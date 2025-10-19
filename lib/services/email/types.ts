export interface EmailTemplateProps {
  firstName?: string;
  lastName?: string;
  email: string;
}

export interface WelcomeEmailProps extends EmailTemplateProps {
  name: string;
}

export interface VerificationEmailProps extends EmailTemplateProps {
  verificationUrl: string;
  token: string;
}

export interface PasswordResetEmailProps extends EmailTemplateProps {
  resetUrl: string;
  token: string;
}

export interface EmailSendOptions {
  to: string[];
  from: string;
  subject: string;
  html?: string;
  text?: string;
  replyTo?: string;
}
