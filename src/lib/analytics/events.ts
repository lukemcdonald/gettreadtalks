/** Add a key here, then call `track` from `@/lib/analytics`. */
export interface EventMap {
  clip_completed: { clip_id: string; clip_slug: string };
  clip_paused: { clip_id: string; clip_slug: string; progress_pct: number };
  clip_played: { clip_id: string; clip_slug: string };
  not_found_hit: { path: string };
  signed_in: Record<string, never>;
  signed_out: Record<string, never>;
  signed_up: Record<string, never>;
  speaker_favorited: { speaker_id: string; speaker_slug: string };
  speaker_link_clicked: {
    link_type: string;
    speaker_id: string;
    speaker_slug: string;
    url: string;
  };
  speaker_shared: {
    method: 'clipboard' | 'share_api';
    speaker_id: string;
    speaker_slug: string;
  };
  speaker_unfavorited: { speaker_id: string; speaker_slug: string };
  talk_completed: {
    speaker_id?: string;
    speaker_slug?: string;
    talk_id: string;
    talk_slug: string;
    talk_title: string;
  };
  talk_favorited: {
    speaker_id?: string;
    speaker_slug?: string;
    talk_id: string;
    talk_slug: string;
    talk_title: string;
  };
  talk_featured: {
    speaker_id?: string;
    speaker_slug?: string;
    talk_id: string;
    talk_slug: string;
    talk_title: string;
  };
  talk_finished: {
    speaker_id?: string;
    speaker_slug?: string;
    talk_id: string;
    talk_slug: string;
    talk_title: string;
  };
  talk_paused: {
    progress_pct: number;
    speaker_id?: string;
    speaker_slug?: string;
    talk_id: string;
    talk_slug: string;
    talk_title: string;
  };
  talk_played: {
    media_type: 'audio' | 'video';
    speaker_id?: string;
    speaker_slug?: string;
    talk_id: string;
    talk_slug: string;
    talk_title: string;
  };
  talk_shared: {
    method: 'clipboard' | 'share_api';
    speaker_id?: string;
    speaker_slug?: string;
    talk_id: string;
    talk_slug: string;
    talk_title: string;
  };
  talk_unfavorited: {
    speaker_id?: string;
    speaker_slug?: string;
    talk_id: string;
    talk_slug: string;
    talk_title: string;
  };
  talk_unfeatured: {
    speaker_id?: string;
    speaker_slug?: string;
    talk_id: string;
    talk_slug: string;
    talk_title: string;
  };
  talk_unfinished: {
    speaker_id?: string;
    speaker_slug?: string;
    talk_id: string;
    talk_slug: string;
    talk_title: string;
  };
}
