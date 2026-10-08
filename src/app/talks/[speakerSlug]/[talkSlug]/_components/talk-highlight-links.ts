import { getClipUrl } from '../../../../../features/clips/utils.ts';

export function talkHighlightLinks<
  TClip extends { slug: string; title: string },
>(clips: readonly TClip[]) {
  return clips.map((clip) => ({
    ...clip,
    href: getClipUrl(clip.slug),
  }));
}
