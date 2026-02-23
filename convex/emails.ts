import type { ReactElement } from 'react';
import type { MutationCtx } from './_generated/server';

import { Resend, vEmailEvent, vEmailId } from '@convex-dev/resend';
import { render } from '@react-email/render';
import { v } from 'convex/values';

import { components, internal } from './_generated/api';
import { internalAction, internalMutation } from './_generated/server';
import { ResetPasswordTemplate } from './emails/resetPassword';
import { VerifyEmailTemplate } from './emails/verifyEmail';
import { WelcomeEmail } from './emails/welcome';
import { throwConvexError } from './lib/errors';

// Email constants - same across all environments
const TEST_DOMAIN_EMAIL = 'delivered@resend.dev';
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || TEST_DOMAIN_EMAIL;
const FROM_NAME = 'TREAD Talks';
const REPLY_TO_EMAIL = 'hello@gettreadtalks.com';

// Initialize Resend client
export const resend: Resend = new Resend(components.resend, {
  // Note: testMode true = simulate emails (nothing sent), false = actually send emails
  testMode: process.env.RESEND_TEST_MODE !== 'false',
  // biome-ignore lint/suspicious/noExplicitAny: Type compatibility workaround for Convex 1.29.x
  onEmailEvent: internal.emails.handleEmailEvent as any,
});

// ============================================
// MUTATIONS
// ============================================

export const handleEmailEvent = internalMutation({
  args: {
    event: vEmailEvent,
    id: vEmailId,
  },
  handler: async (ctx, args) => {
    const { event, id } = args;

    switch (event.type) {
      case 'email.bounced':
        await suppressRecipients(ctx, {
          emails: normalizeRecipients(event.data.to),
          reason: 'bounced',
          resendEmailId: event.data.email_id,
          bounceType: event.data.bounce.type,
          bounceSubType: event.data.bounce.subType,
        });
        break;
      case 'email.complained':
        await suppressRecipients(ctx, {
          emails: normalizeRecipients(event.data.to),
          reason: 'complained',
          resendEmailId: event.data.email_id,
        });
        break;
      default:
        console.log('Email event:', event.type, id);
        break;
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
  returns: v.null(),
  handler: async (ctx, args) => {
    try {
      const template = ResetPasswordTemplate({
        email: args.email,
        resetUrl: args.resetUrl,
        token: args.token,
      });
      const { html, text } = await renderEmail(template);

      await resend.sendEmail(ctx, {
        from: getFromAddress(),
        html,
        replyTo: [getReplyToAddress()],
        subject: 'Reset your password',
        text,
        to: args.email,
      });
    } catch (error) {
      throwConvexError(500, 'Failed to send password reset email', {
        cause: getErrorMessage(error),
        resource: 'email',
        resourceId: args.email,
      });
    }
  },
});

export const sendTestEmail = internalMutation({
  handler: async (ctx) => {
    await resend.sendEmail(ctx, {
      from: getFromAddress(),
      html: '<p>This is a test email</p>',
      replyTo: [getReplyToAddress()],
      subject: 'Test email from TREAD Talks',
      text: 'This is a test email',
      to: process.env.RESEND_TO_EMAIL || TEST_DOMAIN_EMAIL,
    });
  },
});

export const sendVerificationEmail = internalMutation({
  args: {
    email: v.string(),
    token: v.string(),
    verificationUrl: v.string(),
  },
  returns: vEmailId,
  handler: async (ctx, args) => {
    try {
      const template = VerifyEmailTemplate({
        email: args.email,
        token: args.token,
        verificationUrl: args.verificationUrl,
      });
      const { html, text } = await renderEmail(template);

      const emailId = await resend.sendEmail(ctx, {
        from: getFromAddress(),
        html,
        replyTo: [getReplyToAddress()],
        subject: 'Verify your email address',
        text,
        to: args.email,
      });

      return emailId;
    } catch (error) {
      throwConvexError(500, 'Failed to send verification email', {
        cause: getErrorMessage(error),
        resource: 'email',
        resourceId: args.email,
      });
    }
  },
});

export const sendWelcomeEmail = internalMutation({
  args: {
    email: v.string(),
    name: v.string(),
    userId: v.string(),
  },
  returns: vEmailId,
  handler: async (ctx, args) => {
    try {
      const template = WelcomeEmail({
        email: args.email,
        name: args.name,
      });
      const { html, text } = await renderEmail(template);

      return await resend.sendEmail(ctx, {
        from: getFromAddress(),
        html,
        replyTo: [getReplyToAddress()],
        subject: 'Welcome to TREAD Talks!',
        text,
        to: args.email,
      });
    } catch (error) {
      throwConvexError(500, 'Failed to send welcome email', {
        cause: getErrorMessage(error),
        resource: 'email',
        resourceId: args.email,
      });
    }
  },
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
  return `${FROM_NAME} <${FROM_EMAIL}>`;
}

function getReplyToAddress() {
  return REPLY_TO_EMAIL;
}

async function renderEmail(template: ReactElement) {
  const [html, text] = await Promise.all([render(template), render(template, { plainText: true })]);
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
  },
) {
  for (const email of params.emails) {
    const existing = await ctx.db
      .query('emailSuppressions')
      .withIndex('by_email', (q) => q.eq('email', email))
      .first();

    if (existing) {
      continue;
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
  }
}
