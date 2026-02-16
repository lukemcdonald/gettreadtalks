export type EventMap = {
  // Navigation (page_viewed is auto-tracked by analytics-provider)
  search_performed: { query: string; results_count?: number };
  filter_applied: { filter_type: string; filter_value: string };

  // Media playback
  talk_played: { talk_id: string; speaker_slug: string; media_type: 'audio' | 'video' };
  talk_paused: { talk_id: string; speaker_slug: string; progress_pct: number };
  talk_completed: { talk_id: string; speaker_slug: string };
  clip_played: { clip_id: string; clip_slug: string };
  clip_paused: { clip_id: string; clip_slug: string; progress_pct: number };
  clip_completed: { clip_id: string; clip_slug: string };

  // Engagement
  talk_favorited: { talk_id: string };
  talk_unfavorited: { talk_id: string };
  talk_finished: { talk_id: string };
  talk_unfinished: { talk_id: string };
  talk_shared: { method: 'clipboard' | 'share_api'; talk_id: string };

  // Discovery
  topic_clicked: { topic_id: string; topic_slug: string };
  collection_opened: { collection_id: string; collection_slug: string };
  speaker_link_clicked: { link_type: string; speaker_slug: string; url: string };

  // Account
  signed_up: Record<string, never>;
  signed_in: Record<string, never>;
  signed_out: Record<string, never>;

  // Errors
  not_found_hit: { path: string };
};

/** Events that carry no payload — derived automatically from EventMap. */
export type NoPayloadEvents = {
  [E in keyof EventMap]: EventMap[E] extends Record<string, never> ? E : never;
}[keyof EventMap];

/** Events that require a payload — everything else. */
export type PayloadEvents = Exclude<keyof EventMap, NoPayloadEvents>;
