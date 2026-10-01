interface TalkTrackProperties {
  speaker_id?: string;
  speaker_slug?: string;
  talk_id: string;
  talk_slug: string;
}

/** Add a key here, then call `track` from `@/services/analytics`. */
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
  talk_completed: TalkTrackProperties;
  talk_favorited: TalkTrackProperties;
  talk_featured: TalkTrackProperties;
  talk_finished: TalkTrackProperties;
  talk_paused: TalkTrackProperties & { progress_pct: number };
  talk_played: TalkTrackProperties & { media_type: 'audio' | 'video' };
  talk_shared: TalkTrackProperties & { method: 'clipboard' | 'share_api' };
  talk_unfavorited: TalkTrackProperties;
  talk_unfeatured: TalkTrackProperties;
  talk_unfinished: TalkTrackProperties;
}
