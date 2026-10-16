import type { LucideIcon } from 'lucide-react';

import {
  CheckCircle2Icon,
  FilmIcon,
  FolderIcon,
  HeartIcon,
  MicIcon,
  SettingsIcon,
  TagIcon,
  UsersIcon,
} from 'lucide-react';

export const AREA_NAV_ICONS = {
  clips: FilmIcon,
  collections: FolderIcon,
  favorites: HeartIcon,
  finished: CheckCircle2Icon,
  settings: SettingsIcon,
  speakers: UsersIcon,
  talks: MicIcon,
  topics: TagIcon,
} as const satisfies Record<string, LucideIcon>;

export type AreaNavIcon = keyof typeof AREA_NAV_ICONS;
