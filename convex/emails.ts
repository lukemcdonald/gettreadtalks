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

// Email constants - same across all environments
const TEST_DOMAIN_EMAIL = 'delivered@resend.dev';
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || TEST_DOMAIN_EMAIL;

// Comfortably longer than the Resend component's own base batch delay (~1s
// under normal load), so its scheduled send attempt has time to complete.
const CHECK_SEND_RESULT_DELAY_MS = 45_000;

const EMAIL_KINDS = [
  'passwordReset',
  'test',
  'verification',
  'welcome',
] as const;
type EmailKind = (typeof EMAIL_KINDS)[number];
const vEmailKind = v.union(...EMAIL_KINDS.map((kind) => v.literal(kind)));

const EMAIL_ADDRESS_PATTERN = /[\w.+-]+@[\w-]+\.[\w.-]+/g;

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
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const status = await resend.status(ctx, args.emailId);

    // The component's own batch-rejection and retry-exhausted paths only ever
    // set `status: "failed"`; the separate `failed` boolean is set exclusively
    // by Resend's `email.failed` webhook event, which this check must not rely on.
    if (status?.status === 'failed') {
      await reportEmailFailure({
        emailId: args.emailId,
        errorMessage: status.errorMessage,
        kind: args.kind,
      });
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

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'Unknown error';
}

function getFromAddress() {
  return `${site.name} <${FROM_EMAIL}>`;
}

function getReplyToAddress() {
  return site.email.reply;
}

/**
 * Resend's errorMessage often echoes back the offending email address (from
 * the raw API response body or a bounce message). Strip it before this text
 * reaches Sentry or the logs, since it must never carry a recipient address.
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
      }
    );
  } catch (error) {
    // The email already sent successfully; a failure here is a scheduling
    // problem, not a send failure, so it must not surface as one to callers.
    console.error(
      'Failed to schedule checkSendResult:',
      emailId,
      getErrorMessage(error)
    );
  }

  return emailId;
}

/**
 * Derives the ingest envelope URL from a Sentry DSN. The DSN itself travels
 * in the envelope header for auth, so the public key isn't needed separately.
 */
function parseSentryDsn(dsn: string): { ingestUrl: string } | null {
  try {
    const url = new URL(dsn);
    const projectId = url.pathname.slice(1);

    if (!(url.username && projectId)) {
      return null;
    }

    return {
      ingestUrl: `${url.protocol}//${url.host}/api/${projectId}/envelope/`,
    };
  } catch {
    return null;
  }
}

/**
 * Fallback Sentry reporting for Convex's Free plan (no native exception
 * integration). Fire and forget: a Sentry outage must never affect sends.
 */
async function reportEmailFailure(params: {
  emailId: EmailId;
  errorMessage: string | null;
  kind: EmailKind;
}): Promise<void> {
  const errorMessage = params.errorMessage
    ? redactEmailAddresses(params.errorMessage)
    : null;

  try {
    const dsn = process.env.SENTRY_DSN;
    const parsedDsn = dsn ? parseSentryDsn(dsn) : null;

    if (!parsedDsn) {
      console.error(
        'Email send failed and SENTRY_DSN is not configured or malformed:',
        params.kind,
        params.emailId,
        errorMessage
      );
      return;
    }

    const eventId = crypto.randomUUID().replaceAll('-', '');
    const sentAt = new Date().toISOString();

    const event = {
      event_id: eventId,
      exception: {
        values: [
          {
            type: 'EmailSendFailed',
            value: `Resend permanently rejected a "${params.kind}" email (${params.emailId}): ${errorMessage ?? 'unknown error'}`,
          },
        ],
      },
      level: 'error',
      platform: 'node',
      tags: { emailKind: params.kind },
      timestamp: sentAt,
    };

    const envelope = [
      JSON.stringify({ dsn, event_id: eventId, sent_at: sentAt }),
      JSON.stringify({ type: 'event' }),
      JSON.stringify(event),
      '',
    ].join('\n');

    const response = await fetch(parsedDsn.ingestUrl, {
      body: envelope,
      headers: { 'Content-Type': 'application/x-sentry-envelope' },
      method: 'POST',
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      console.error(
        'Sentry rejected the email failure envelope:',
        response.status
      );
    }
  } catch (error) {
    console.error(
      'Failed to report email send failure to Sentry:',
      getErrorMessage(error)
    );
  }
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
