import type { ActionCtx, MutationCtx } from './_generated/server';
import type { EmailId, SendEmailOptions } from '@convex-dev/resend';
import type { ReactElement } from 'react';

import { Resend, vEmailEvent, vEmailId } from '@convex-dev/resend';
import { v } from 'convex/values';
import { render } from 'react-email';

import { site } from '../src/configs/site';
import { components, internal } from './_generated/api';
import { internalAction, internalMutation } from './_generated/server';
import { ResetPasswordTemplate } from './emails/resetPassword';
import { VerifyEmailTemplate } from './emails/verifyEmail';
import { WelcomeEmail } from './emails/welcome';
import { throwConvexError } from './lib/errors';
import { reportSentryException } from './lib/sentry';
import { getErrorMessage } from './lib/utils';

// Email constants - same across all environments
const TEST_DOMAIN_EMAIL = 'delivered@resend.dev';
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || TEST_DOMAIN_EMAIL;

// Comfortably longer than the component's own ~1s base batch delay.
const CHECK_SEND_RESULT_DELAY_MS = 45_000;

// Resend's own retry ladder can take up to ~15 minutes to exhaust.
const CHECK_SEND_RESULT_MAX_BUDGET_MS = 20 * 60 * 1000;

const EMAIL_KINDS = [
  'passwordReset',
  'test',
  'verification',
  'welcome',
] as const;
type EmailKind = (typeof EMAIL_KINDS)[number];
const vEmailKind = v.union(...EMAIL_KINDS.map((kind) => v.literal(kind)));

const EMAIL_ADDRESS_PATTERN = /[\w.+-]+@[\w-]+\.[\w.-]+/gu;

// Initialize Resend client
export const resend: Resend = new Resend(components.resend, {
  // Note: testMode true = simulate emails (nothing sent), false = actually send emails
  testMode: process.env.RESEND_TEST_MODE !== 'false',
  // oxlint-disable-next-line typescript/no-explicit-any -- Convex 1.29 Resend component type mismatch
  onEmailEvent: internal.emails.handleEmailEvent as any,
});

// ============================================
// MUTATIONS
// ============================================

/**
 * Catches sends the Resend component silently drops: `sendEmail()` only
 * enqueues, and a later permanent rejection never throws or fires `onEmailEvent`.
 */
export const checkSendResult = internalAction({
  args: {
    emailId: vEmailId,
    kind: vEmailKind,
    startedAt: v.number(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const status = await resend.status(ctx, args.emailId);

    // `status.failed` is set only by Resend's webhook; the batch-rejection
    // and retry-exhausted paths this check targets only set `status.status`.
    if (status?.status === 'failed') {
      await reportEmailFailure({
        emailId: args.emailId,
        errorMessage: status.errorMessage,
        kind: args.kind,
      });
      return null;
    }

    // Not yet in a terminal state -- reschedule while budget remains, since
    // 'sent'/'delivery_delayed' can still transition to 'failed' later.
    const isPending =
      status === null ||
      status.status === 'waiting' ||
      status.status === 'queued' ||
      status.status === 'sent' ||
      status.status === 'delivery_delayed';

    if (isPending) {
      const withinBudget =
        Date.now() - args.startedAt + CHECK_SEND_RESULT_DELAY_MS <=
        CHECK_SEND_RESULT_MAX_BUDGET_MS;

      if (withinBudget) {
        await ctx.scheduler.runAfter(
          CHECK_SEND_RESULT_DELAY_MS,
          internal.emails.checkSendResult,
          args
        );
      } else {
        console.warn(
          'checkSendResult gave up waiting for a terminal status:',
          args.emailId,
          args.kind
        );
      }
    }

    return null;
  },
});

export const handleEmailEvent = internalMutation({
  args: {
    event: vEmailEvent,
    id: vEmailId,
  },
  handler: async (ctx, args) => {
    const { event, id } = args;

    switch (event.type) {
      case 'email.bounced': {
        await suppressRecipients(ctx, {
          bounceSubType: event.data.bounce.subType,
          bounceType: event.data.bounce.type,
          emails: normalizeRecipients(event.data.to),
          reason: 'bounced',
          resendEmailId: event.data.email_id,
        });
        break;
      }
      case 'email.complained': {
        await suppressRecipients(ctx, {
          emails: normalizeRecipients(event.data.to),
          reason: 'complained',
          resendEmailId: event.data.email_id,
        });
        break;
      }
      default: {
        console.log('Email event:', event.type, id);
        break;
      }
    }

    return null;
  },
  returns: v.null(),
});

export const sendPasswordResetEmail = internalAction({
  args: {
    email: v.string(),
    resetUrl: v.string(),
    token: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      const template = ResetPasswordTemplate({
        email: args.email,
        resetUrl: args.resetUrl,
        token: args.token,
      });
      const { html, text } = await renderEmail(template);

      await sendTrackedEmail(
        ctx,
        {
          from: getFromAddress(),
          html,
          replyTo: [getReplyToAddress()],
          subject: 'Reset your password',
          text,
          to: args.email,
        },
        'passwordReset'
      );
    } catch (error) {
      throwConvexError(500, 'Failed to send password reset email', {
        cause: getErrorMessage(error),
        resource: 'email',
        resourceId: args.email,
      });
    }
  },
  returns: v.null(),
});

export const sendTestEmail = internalMutation({
  handler: async (ctx) => {
    await sendTrackedEmail(
      ctx,
      {
        from: getFromAddress(),
        html: '<p>This is a test email</p>',
        replyTo: [getReplyToAddress()],
        subject: `Test email from ${site.name}`,
        text: 'This is a test email',
        to: process.env.RESEND_TO_EMAIL || TEST_DOMAIN_EMAIL,
      },
      'test'
    );
  },
});

export const sendVerificationEmail = internalMutation({
  args: {
    email: v.string(),
    token: v.string(),
    verificationUrl: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      const template = VerifyEmailTemplate({
        email: args.email,
        token: args.token,
        verificationUrl: args.verificationUrl,
      });
      const { html, text } = await renderEmail(template);

      return await sendTrackedEmail(
        ctx,
        {
          from: getFromAddress(),
          html,
          replyTo: [getReplyToAddress()],
          subject: 'Verify your email address',
          text,
          to: args.email,
        },
        'verification'
      );
    } catch (error) {
      throwConvexError(500, 'Failed to send verification email', {
        cause: getErrorMessage(error),
        resource: 'email',
        resourceId: args.email,
      });
    }
  },
  returns: vEmailId,
});

export const sendWelcomeEmail = internalMutation({
  args: {
    email: v.string(),
    name: v.string(),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      const template = WelcomeEmail({
        email: args.email,
        name: args.name,
        siteUrl: process.env.SITE_URL || site.url,
      });
      const { html, text } = await renderEmail(template);

      return await sendTrackedEmail(
        ctx,
        {
          from: getFromAddress(),
          html,
          replyTo: [getReplyToAddress()],
          subject: `Welcome to ${site.name}!`,
          text,
          to: args.email,
        },
        'welcome'
      );
    } catch (error) {
      throwConvexError(500, 'Failed to send welcome email', {
        cause: getErrorMessage(error),
        resource: 'email',
        resourceId: args.email,
      });
    }
  },
  returns: vEmailId,
});

// ============================================
// HELPERS
// ============================================

function getFromAddress() {
  return `${site.name} <${FROM_EMAIL}>`;
}

function getReplyToAddress() {
  return site.email.reply;
}

/**
 * Resend's errorMessage can echo back the recipient's address; strip it
 * before this text reaches Sentry or the logs.
 */
function redactEmailAddresses(message: string): string {
  return message.replaceAll(EMAIL_ADDRESS_PATTERN, '[redacted]');
}

/**
 * Sends an email and schedules its follow-up status check in one step, so
 * every send function tracks failures the same way.
 */
async function sendTrackedEmail(
  ctx: ActionCtx | MutationCtx,
  emailParams: SendEmailOptions,
  kind: EmailKind
): Promise<EmailId> {
  const emailId = await resend.sendEmail(ctx, emailParams);

  try {
    await ctx.scheduler.runAfter(
      CHECK_SEND_RESULT_DELAY_MS,
      internal.emails.checkSendResult,
      {
        emailId,
        kind,
        startedAt: Date.now(),
      }
    );
  } catch (error) {
    // Email already sent; a scheduling failure must not read as a send failure.
    console.error(
      'Failed to schedule checkSendResult:',
      emailId,
      getErrorMessage(error)
    );
  }

  return emailId;
}

async function reportEmailFailure(params: {
  emailId: EmailId;
  errorMessage: string | null;
  kind: EmailKind;
}): Promise<void> {
  const errorMessage = params.errorMessage
    ? redactEmailAddresses(params.errorMessage)
    : 'unknown error';

  await reportSentryException({
    message: `Resend permanently rejected a "${params.kind}" email (${params.emailId}): ${errorMessage}`,
    tags: { emailKind: params.kind },
  });
}

async function renderEmail(template: ReactElement) {
  const [html, text] = await Promise.all([
    render(template),
    render(template, { plainText: true }),
  ]);
  return { html, text };
}

function normalizeRecipients(to: string | string[]): string[] {
  return Array.isArray(to) ? to : [to];
}

async function suppressRecipients(
  ctx: MutationCtx,
  params: {
    bounceSubType?: string;
    bounceType?: string;
    emails: string[];
    reason: 'bounced' | 'complained';
    resendEmailId: string;
  }
) {
  const uniqueEmails = [...new Set(params.emails)];

  await Promise.all(
    uniqueEmails.map(async (email) => {
      const existing = await ctx.db
        .query('emailSuppressions')
        .withIndex('by_email', (q) => q.eq('email', email))
        .first();

      if (existing) {
        return;
      }

      await ctx.db.insert('emailSuppressions', {
        bounceSubType: params.bounceSubType,
        bounceType: params.bounceType,
        email,
        reason: params.reason,
        resendEmailId: params.resendEmailId,
        suppressedAt: Date.now(),
      });

      console.log('Email suppressed:', email, 'reason:', params.reason);
    })
  );
}
