import type { PasswordResetEmailProps, VerificationEmailProps, WelcomeEmailProps } from './types';

export const EMAIL_TEMPLATES = {
  WELCOME: 'welcome',
  VERIFY_EMAIL: 'verify-email',
  RESET_PASSWORD: 'reset-password',
} as const;

export type EmailTemplateName = (typeof EMAIL_TEMPLATES)[keyof typeof EMAIL_TEMPLATES];

export interface TemplatePropsMap {
  [EMAIL_TEMPLATES.WELCOME]: WelcomeEmailProps;
  [EMAIL_TEMPLATES.VERIFY_EMAIL]: VerificationEmailProps;
  [EMAIL_TEMPLATES.RESET_PASSWORD]: PasswordResetEmailProps;
}

export function getEmailSubject(template: EmailTemplateName): string {
  switch (template) {
    case EMAIL_TEMPLATES.WELCOME:
      return 'Welcome to TreadTalks!';
    case EMAIL_TEMPLATES.VERIFY_EMAIL:
      return 'Verify your email address';
    case EMAIL_TEMPLATES.RESET_PASSWORD:
      return 'Reset your password';
    default:
      throw new Error(`Unknown email template: ${template}`);
  }
}
