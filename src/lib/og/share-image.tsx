// oxlint-disable next/no-img-element -- ImageResponse only renders <img>
import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

import { site } from '@/configs/site';
import { pluralize } from '@/utils';

export const alt = site.name;
export const contentType = 'image/png';
export const size = {
  height: 630,
  width: 1200,
};

const AVATAR_MD = 120;
const AVATAR_SM = 80;
const BACKGROUND = '#f4f4f5';
const FOREGROUND = '#27272a';
const LOGO_HEIGHT = 56;
const LOGO_WIDTH = 412;
const MUTED = '#52525b';
const PADDING = 80;

const assets = Promise.all([
  readFile(path.join(process.cwd(), 'src/assets/fonts/inter-latin-600.ttf')),
  readFile(path.join(process.cwd(), 'public/logo.png')),
]);

interface ShareSpeaker {
  detail?: string;
  imageUrl?: string;
  name: string;
}

interface ShareSpeakerSource {
  firstName?: string;
  imageUrl?: string;
  lastName?: string;
  ministry?: string;
  role?: string;
}

interface ShareImageInput {
  speaker?: ShareSpeaker;
  speakerPlacement?: 'byline' | 'title';
  subtitle?: string;
  title: string;
}

interface ShareMediaInput {
  speaker?: ShareSpeakerSource | null;
  title: string;
}

interface ShareCountedInput {
  talkCount: number;
  title: string;
}

export function buildSharePropsForClip(input: ShareMediaInput) {
  return buildSharePropsForMedia(input);
}

export function buildSharePropsForCollection(input: ShareCountedInput) {
  return buildSharePropsForCounted(input);
}

export function buildSharePropsForSpeaker(speaker: ShareSpeakerSource) {
  const mapped = toShareSpeaker(speaker);

  return {
    speaker: mapped,
    speakerPlacement: 'title' as const,
    title: mapped?.name ?? '',
  };
}

export function buildSharePropsForTalk(input: ShareMediaInput) {
  return buildSharePropsForMedia(input);
}

export function buildSharePropsForTopic(input: ShareCountedInput) {
  return buildSharePropsForCounted(input);
}

function buildSharePropsForMedia({
  speaker,
  title,
}: ShareMediaInput): ShareImageInput {
  return {
    speaker: toShareSpeaker(speaker),
    title,
  };
}

function buildSharePropsForCounted({
  talkCount,
  title,
}: ShareCountedInput): ShareImageInput {
  return {
    subtitle: `${talkCount} ${pluralize(talkCount, 'talk', 'talks')}`,
    title,
  };
}

function toShareSpeaker(
  speaker?: ShareSpeakerSource | null
): ShareSpeaker | undefined {
  if (!speaker) {
    return;
  }

  const name = `${speaker.firstName ?? ''} ${speaker.lastName ?? ''}`.trim();

  if (!name) {
    return;
  }

  return {
    detail: speaker.ministry || speaker.role,
    imageUrl: speaker.imageUrl,
    name,
  };
}

export async function shareImage({
  speaker,
  speakerPlacement = 'byline',
  subtitle,
  title,
}: ShareImageInput) {
  const [[font, logo], speakerSrc] = await Promise.all([
    assets,
    resolvePhotoSrc(speaker?.imageUrl),
  ]);

  return new ImageResponse(
    <ShareImageTemplate
      logoSrc={toDataUri('image/png', logo)}
      speaker={speaker}
      speakerPlacement={speakerPlacement}
      speakerSrc={speakerSrc}
      subtitle={subtitle}
      title={title}
    />,
    {
      fonts: [
        {
          data: font,
          name: 'Inter',
          style: 'normal',
          weight: 600,
        },
      ],
      ...size,
    }
  );
}

function ShareImageTemplate({
  logoSrc,
  speaker,
  speakerPlacement,
  speakerSrc,
  subtitle,
  title,
}: {
  logoSrc: string;
  speaker?: ShareSpeaker;
  speakerPlacement: 'byline' | 'title';
  speakerSrc?: string;
  subtitle?: string;
  title: string;
}) {
  return (
    <div
      style={{
        backgroundColor: BACKGROUND,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        justifyContent: 'space-between',
        padding: PADDING,
        width: '100%',
      }}
    >
      <img alt="" height={LOGO_HEIGHT} src={logoSrc} width={LOGO_WIDTH} />
      <div
        style={{
          color: FOREGROUND,
          display: 'flex',
          fontFamily: 'Inter',
          fontSize: 72,
          fontWeight: 600,
          letterSpacing: -1.5,
          lineClamp: 3,
          lineHeight: 1.15,
          overflow: 'hidden',
        }}
      >
        {title}
      </div>
      <ShareImageFooter
        speaker={speaker}
        speakerPlacement={speakerPlacement}
        speakerSrc={speakerSrc}
        subtitle={subtitle}
      />
    </div>
  );
}

function ShareImageFooter({
  speaker,
  speakerPlacement,
  speakerSrc,
  subtitle,
}: {
  speaker?: ShareSpeaker;
  speakerPlacement: 'byline' | 'title';
  speakerSrc?: string;
  subtitle?: string;
}) {
  if (speaker && speakerPlacement === 'title') {
    return (
      <SpeakerMeta
        avatarSize={AVATAR_MD}
        detail={speaker.detail}
        photoSrc={speakerSrc}
      />
    );
  }

  if (speaker) {
    return (
      <SpeakerMeta
        avatarSize={AVATAR_SM}
        detail={speaker.detail}
        name={speaker.name}
        photoSrc={speakerSrc}
      />
    );
  }

  if (!subtitle) {
    return <div style={{ display: 'flex', height: 34 }} />;
  }

  return (
    <div
      style={{
        color: MUTED,
        display: 'flex',
        fontFamily: 'Inter',
        fontSize: 28,
        fontWeight: 600,
      }}
    >
      {subtitle}
    </div>
  );
}

function SpeakerMeta({
  avatarSize,
  detail,
  name,
  photoSrc,
}: {
  avatarSize: number;
  detail?: string;
  name?: string;
  photoSrc?: string;
}) {
  return (
    <div
      style={{
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'row',
        gap: 24,
      }}
    >
      {photoSrc ? <Avatar photoSrc={photoSrc} pixelSize={avatarSize} /> : null}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
        }}
      >
        {name ? (
          <div
            style={{
              color: FOREGROUND,
              display: 'flex',
              fontFamily: 'Inter',
              fontSize: 28,
              fontWeight: 600,
            }}
          >
            {name}
          </div>
        ) : null}
        {detail ? (
          <div
            style={{
              color: MUTED,
              display: 'flex',
              fontFamily: 'Inter',
              fontSize: 22,
              fontWeight: 600,
            }}
          >
            {detail}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function Avatar({
  photoSrc,
  pixelSize,
}: {
  photoSrc: string;
  pixelSize: number;
}) {
  return (
    <div
      style={{
        borderRadius: pixelSize,
        display: 'flex',
        height: pixelSize,
        overflow: 'hidden',
        width: pixelSize,
      }}
    >
      <img
        alt=""
        height={pixelSize}
        src={photoSrc}
        style={{
          objectFit: 'cover',
          objectPosition: 'center',
        }}
        width={pixelSize}
      />
    </div>
  );
}

async function resolvePhotoSrc(photoUrl?: string) {
  if (!photoUrl || photoUrl.includes('..')) {
    return;
  }

  if (!photoUrl.startsWith('/')) {
    return photoUrl;
  }

  const filePath = path.join(
    process.cwd(),
    'public',
    photoUrl.replace(/^\//u, '')
  );

  try {
    return toDataUri(mimeFor(filePath), await readFile(filePath));
  } catch {
    return `${site.url}${photoUrl}`;
  }
}

function mimeFor(filePath: string) {
  if (filePath.endsWith('.png')) {
    return 'image/png';
  }

  if (filePath.endsWith('.webp')) {
    return 'image/webp';
  }

  return 'image/jpeg';
}

function toDataUri(mime: string, data: Buffer) {
  return `data:${mime};base64,${data.toString('base64')}`;
}
