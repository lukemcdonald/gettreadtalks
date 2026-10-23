type SearchEventSource = 'header' | 'page';
type SearchResultType = 'clip' | 'speaker' | 'talk' | 'topic' | 'view_all';

interface TalkTrackProperties {
  speaker_id?: string;
  speaker_slug?: string;
  talk_id: string;
  talk_slug: string;
}

export interface ToolCallProperties {
  error?: string;
  result_count?: number;
  success: boolean;
  tool_name: string;
}

/** Add a key here, then call `track` from `@/services/analytics`. */
export interface EventMap {
  clip_completed: { clip_id: string; clip_slug: string };
  clip_paused: { clip_id: string; clip_slug: string; progress_pct: number };
  clip_played: { clip_id: string; clip_slug: string };
  filter_applied: { filter: string; path: string; value: string };
  mcp_tool_called: ToolCallProperties & {
    duration_ms: number;
    query?: string;
    user_agent?: string;
  };
  not_found_hit: { path: string };
  search_no_results: {
    path: string;
    query: string;
    source: SearchEventSource;
  };
  search_performed: {
    path: string;
    query: string;
    result_count?: number;
    source: SearchEventSource;
  };
  search_result_selected: {
    path: string;
    position: number;
    query: string;
    result_type: SearchResultType;
    source: SearchEventSource;
  };
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
  webmcp_tool_called: ToolCallProperties;
}
