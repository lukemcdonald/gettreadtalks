import { Resend, vEmailEvent, vEmailId } from '@convex-dev/resend';
import { render } from '@react-email/render';
import { v } from 'convex/values';

import { components, internal } from './_generated/api';
import { internalMutation } from './_generated/server';
import { ResetPasswordTemplate } from './emails/resetPassword';
import { VerifyEmailTemplate } from './emails/verifyEmail';
import { WelcomeEmail } from './emails/welcome';
import { ErrorCodes, createConvexError } from './lib/errors';

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
  returns: v.null(),
  handler: (_ctx, args) => {
    console.log('Email event received:', {
      emailId: args.id,
      event: args.event.type,
      timestamp: new Date().toISOString(),
    });

    // Handle different email events based on documentation
    switch (args.event.type) {
      case 'email.delivered':
        // You can add custom logic here, such as:
        // - Update user records with email status
        // - Log statistics for analytics
        console.log('Email delivered successfully:', args.id);
        break;
      case 'email.opened':
        // Track email engagement
        console.log('Email opened:', args.id);
        break;
      case 'email.clicked':
        // Track link engagement
        console.log('Email link clicked:', args.id);
        break;
      case 'email.bounced':
        // Handle bounces - might want to mark email as invalid
        console.log('Email bounced:', args.id, 'reason:', args.event.data.bounce.type);
        break;
      case 'email.complained':
        // Handle spam complaints
        console.log('Email marked as spam:', args.id);
        break;
      default:
        console.log('Email event not handled:', args.event.type);
        break;
    }

    return null;
  },
});

export const sendPasswordResetEmail = internalMutation({
  args: {
    email: v.string(),
    resetUrl: v.string(),
    token: v.string(),
  },
  returns: vEmailId,
  handler: async (ctx, args) => {
    try {
      const html = await render(
        ResetPasswordTemplate({
          email: args.email,
          resetUrl: args.resetUrl,
          token: args.token,
        }),
      );

      const emailId = await resend.sendEmail(ctx, {
        from: getFromAddress(),
        html,
        replyTo: [getReplyToAddress()],
        subject: 'Reset your password',
        to: args.email,
      });

      return emailId;
    } catch {
      throw createConvexError('Failed to send password reset email', {
        errorCode: ErrorCodes.SERVER_ERROR,
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
      const html = await render(
        VerifyEmailTemplate({
          email: args.email,
          token: args.token,
          verificationUrl: args.verificationUrl,
        }),
      );

      const emailId = await resend.sendEmail(ctx, {
        from: getFromAddress(),
        html,
        replyTo: [getReplyToAddress()],
        subject: 'Verify your email address',
        to: args.email,
      });

      return emailId;
    } catch {
      throw createConvexError('Failed to send verification email', {
        errorCode: ErrorCodes.SERVER_ERROR,
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
      const html = await render(
        WelcomeEmail({
          email: args.email,
          name: args.name,
        }),
      );

      return await resend.sendEmail(ctx, {
        from: getFromAddress(),
        html,
        replyTo: [getReplyToAddress()],
        subject: 'Welcome to TREAD Talks!',
        to: args.email,
      });
    } catch {
      throw createConvexError('Failed to send welcome email', {
        errorCode: ErrorCodes.SERVER_ERROR,
        resource: 'email',
        resourceId: args.email,
      });
    }
  },
});

// ============================================
// HELPERS
// ============================================

function getFromAddress() {
  return `${FROM_NAME} <${FROM_EMAIL}>`;
}

function getReplyToAddress() {
  return REPLY_TO_EMAIL;
}
