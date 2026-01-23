import { literals } from 'convex-helpers/validators';

export const speakerRoles = [
  'Apologist',
  'Author',
  'Blogger',
  'Evangelist',
  'Instructor',
  'Minister',
  'Missionary',
  'Musician',
  'Pastor',
  'Theologian',
] as const;

export type SpeakerRole = (typeof speakerRoles)[number];

export const speakerRoleType = literals(...speakerRoles);
