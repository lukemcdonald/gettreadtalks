export type EmailTemplateProps = {
  email: string;
  firstName?: string;
  lastName?: string;
};

export type WelcomeEmailProps = EmailTemplateProps & {
  name: string;
};

export type VerificationEmailProps = EmailTemplateProps & {
  token: string;
  verificationUrl: string;
};

export type PasswordResetEmailProps = EmailTemplateProps & {
  resetUrl: string;
  token: string;
};

export type EmailSendOptions = {
  from: string;
  html?: string;
  replyTo?: string;
  subject: string;
  text?: string;
  to: string[];
};
