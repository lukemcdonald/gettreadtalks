'use server';

import type { FunctionReference } from 'convex/server';

import { fetchMutation } from 'convex/nextjs';

import { internal } from '@/convex/_generated/api';

export interface EmailService {
  sendWelcomeEmail: (params: { userId: string; email: string; name: string }) => Promise<void>;
  sendVerificationEmail: (params: {
    email: string;
    verificationUrl: string;
    token: string;
  }) => Promise<void>;
  sendPasswordResetEmail: (params: {
    email: string;
    resetUrl: string;
    token: string;
  }) => Promise<void>;
}

export async function sendWelcomeEmail({
  userId,
  email,
  name,
}: {
  userId: string;
  email: string;
  name: string;
}) {
  // Note: Using type assertion because fetchMutation from convex/nextjs doesn't support internal mutations
  // and these email functions are internal mutations by design for security
  await fetchMutation(
    internal.emails.sendWelcomeEmail as unknown as FunctionReference<'mutation'>,
    { userId, email, name },
  );
}

export async function sendVerificationEmail({
  email,
  verificationUrl,
  token,
}: {
  email: string;
  verificationUrl: string;
  token: string;
}) {
  // Note: Using type assertion because fetchMutation from convex/nextjs doesn't support internal mutations
  // and these email functions are internal mutations by design for security
  await fetchMutation(
    internal.emails.sendVerificationEmail as unknown as FunctionReference<'mutation'>,
    { email, verificationUrl, token },
  );
}

export async function sendPasswordResetEmail({
  email,
  resetUrl,
  token,
}: {
  email: string;
  resetUrl: string;
  token: string;
}) {
  // Note: Using type assertion because fetchMutation from convex/nextjs doesn't support internal mutations
  // and these email functions are internal mutations by design for security
  await fetchMutation(
    internal.emails.sendPasswordResetEmail as unknown as FunctionReference<'mutation'>,
    { email, resetUrl, token },
  );
}
