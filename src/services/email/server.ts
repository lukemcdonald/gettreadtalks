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
  email,
  name,
  userId,
}: {
  email: string;
  name: string;
  userId: string;
}) {
  // Note: Using type assertion because fetchMutation from convex/nextjs doesn't support internal mutations
  // and these email functions are internal mutations by design for security
  await fetchMutation(
    internal.emails.sendWelcomeEmail as unknown as FunctionReference<'mutation'>,
    {
      email,
      name,
      userId,
    },
  );
}

export async function sendVerificationEmail({
  email,
  token,
  verificationUrl,
}: {
  email: string;
  token: string;
  verificationUrl: string;
}) {
  // Note: Using type assertion because fetchMutation from convex/nextjs doesn't support internal mutations
  // and these email functions are internal mutations by design for security
  await fetchMutation(
    internal.emails.sendVerificationEmail as unknown as FunctionReference<'mutation'>,
    {
      email,
      token,
      verificationUrl,
    },
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
    {
      email,
      resetUrl,
      token,
    },
  );
}
