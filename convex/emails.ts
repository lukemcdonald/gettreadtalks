import { Resend, vEmailEvent, vEmailId } from '@convex-dev/resend';
import { render } from '@react-email/render';
import { v } from 'convex/values';

import { ResetPasswordTemplate } from '../emails/reset-password';
import { VerifyEmailTemplate } from '../emails/verify-email';
import { WelcomeEmail } from '../emails/welcome';
import { components, internal } from './_generated/api';
import { internalMutation } from './_generated/server';

export const resend: Resend = new Resend(components.resend, {
  testMode: process.env.NODE_ENV === 'development',
  onEmailEvent: internal.emails.handleEmailEvent,
});

export const sendTestEmail = internalMutation({
  handler: async (ctx) => {
    await resend.sendEmail(ctx, {
      from: getFromAddress(),
      replyTo: [getReplyToAddress()],
      to: 'delivered@resend.dev',
      subject: 'Hi there',
      html: 'This is a test email',
    });
  },
});

// Email event handler for webhook tracking following documentation pattern
export const handleEmailEvent = internalMutation({
  args: {
    id: vEmailId,
    event: vEmailEvent,
  },
  handler: async (_ctx, args) => {
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
    }
  },
});

function getFromAddress() {
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'noreply@gettreadtalks.com';
  const fromName = process.env.RESEND_FROM_NAME || 'TREAD Talks';

  // Always use Resend test domain if in development mode
  if (process.env.NODE_ENV === 'development') {
    return 'TREAD Talks <delivered@resend.dev>';
  }

  return `${fromName} <${fromEmail}>`;
}

function getReplyToAddress() {
  return process.env.RESEND_REPLY_TO_EMAIL || 'hello@gettreadtalks.com';
}

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
          name: args.name,
          email: args.email,
        }),
      );

      return await resend.sendEmail(ctx, {
        subject: 'Welcome to TREAD Talks!',
        to: args.email,
        from: getFromAddress(),
        replyTo: [getReplyToAddress()],
        html,
      });
    } catch (error) {
      console.error('Failed to send welcome email:', error);
      throw new Error('Failed to send welcome email');
    }
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
          verificationUrl: args.verificationUrl,
          token: args.token,
        }),
      );

      const emailId = await resend.sendEmail(ctx, {
        subject: 'Verify your email address',
        from: getFromAddress(),
        replyTo: [getReplyToAddress()],
        to: args.email,
        html,
      });

      return emailId;
    } catch (error) {
      console.error('Failed to send verification email:', error);
      throw new Error('Failed to send verification email');
    }
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
        subject: 'Reset your password',
        to: args.email,
        from: getFromAddress(),
        replyTo: [getReplyToAddress()],
        html,
      });

      return emailId;
    } catch (error) {
      console.error('Failed to send password reset email:', error);
      throw new Error('Failed to send password reset email');
    }
  },
});
