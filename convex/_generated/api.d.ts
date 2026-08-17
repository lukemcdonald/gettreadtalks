/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as affiliateLinks from "../affiliateLinks.js";
import type * as auth from "../auth.js";
import type * as clips from "../clips.js";
import type * as collections from "../collections.js";
import type * as emails from "../emails.js";
import type * as emails_components_layout from "../emails/components/layout.js";
import type * as emails_resetPassword from "../emails/resetPassword.js";
import type * as emails_verifyEmail from "../emails/verifyEmail.js";
import type * as emails_welcome from "../emails/welcome.js";
import type * as http from "../http.js";
import type * as lib_errors_constants from "../lib/errors/constants.js";
import type * as lib_errors_index from "../lib/errors/index.js";
import type * as lib_errors_types from "../lib/errors/types.js";
import type * as lib_filters from "../lib/filters.js";
import type * as lib_plugins from "../lib/plugins.js";
import type * as lib_rateLimiter from "../lib/rateLimiter.js";
import type * as lib_rotateContent from "../lib/rotateContent.js";
import type * as lib_sentry from "../lib/sentry.js";
import type * as lib_sort from "../lib/sort.js";
import type * as lib_types from "../lib/types.js";
import type * as lib_utils from "../lib/utils.js";
import type * as lib_validators_index from "../lib/validators/index.js";
import type * as lib_validators_query from "../lib/validators/query.js";
import type * as lib_validators_shared from "../lib/validators/shared.js";
import type * as model_affiliateLinks_index from "../model/affiliateLinks/index.js";
import type * as model_affiliateLinks_mutations from "../model/affiliateLinks/mutations.js";
import type * as model_affiliateLinks_queries from "../model/affiliateLinks/queries.js";
import type * as model_affiliateLinks_validators from "../model/affiliateLinks/validators.js";
import type * as model_auth_index from "../model/auth/index.js";
import type * as model_auth_rateLimiter from "../model/auth/rateLimiter.js";
import type * as model_auth_roles from "../model/auth/roles.js";
import type * as model_auth_types from "../model/auth/types.js";
import type * as model_auth_utils from "../model/auth/utils.js";
import type * as model_clips_index from "../model/clips/index.js";
import type * as model_clips_mutations from "../model/clips/mutations.js";
import type * as model_clips_queries from "../model/clips/queries.js";
import type * as model_clips_validators from "../model/clips/validators.js";
import type * as model_collections_index from "../model/collections/index.js";
import type * as model_collections_mutations from "../model/collections/mutations.js";
import type * as model_collections_queries from "../model/collections/queries.js";
import type * as model_speakers_index from "../model/speakers/index.js";
import type * as model_speakers_mutations from "../model/speakers/mutations.js";
import type * as model_speakers_queries from "../model/speakers/queries.js";
import type * as model_speakers_validators from "../model/speakers/validators.js";
import type * as model_talks_index from "../model/talks/index.js";
import type * as model_talks_mutations from "../model/talks/mutations.js";
import type * as model_talks_queries from "../model/talks/queries.js";
import type * as model_talks_utils from "../model/talks/utils.js";
import type * as model_talks_validators from "../model/talks/validators.js";
import type * as model_topics_index from "../model/topics/index.js";
import type * as model_topics_mutations from "../model/topics/mutations.js";
import type * as model_topics_queries from "../model/topics/queries.js";
import type * as model_topics_validators from "../model/topics/validators.js";
import type * as model_users_index from "../model/users/index.js";
import type * as model_users_mutations from "../model/users/mutations.js";
import type * as model_users_queries from "../model/users/queries.js";
import type * as model_users_utils from "../model/users/utils.js";
import type * as model_users_validators from "../model/users/validators.js";
import type * as speakers from "../speakers.js";
import type * as talks from "../talks.js";
import type * as topics from "../topics.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  affiliateLinks: typeof affiliateLinks;
  auth: typeof auth;
  clips: typeof clips;
  collections: typeof collections;
  emails: typeof emails;
  "emails/components/layout": typeof emails_components_layout;
  "emails/resetPassword": typeof emails_resetPassword;
  "emails/verifyEmail": typeof emails_verifyEmail;
  "emails/welcome": typeof emails_welcome;
  http: typeof http;
  "lib/errors/constants": typeof lib_errors_constants;
  "lib/errors/index": typeof lib_errors_index;
  "lib/errors/types": typeof lib_errors_types;
  "lib/filters": typeof lib_filters;
  "lib/plugins": typeof lib_plugins;
  "lib/rateLimiter": typeof lib_rateLimiter;
  "lib/rotateContent": typeof lib_rotateContent;
  "lib/sentry": typeof lib_sentry;
  "lib/sort": typeof lib_sort;
  "lib/types": typeof lib_types;
  "lib/utils": typeof lib_utils;
  "lib/validators/index": typeof lib_validators_index;
  "lib/validators/query": typeof lib_validators_query;
  "lib/validators/shared": typeof lib_validators_shared;
  "model/affiliateLinks/index": typeof model_affiliateLinks_index;
  "model/affiliateLinks/mutations": typeof model_affiliateLinks_mutations;
  "model/affiliateLinks/queries": typeof model_affiliateLinks_queries;
  "model/affiliateLinks/validators": typeof model_affiliateLinks_validators;
  "model/auth/index": typeof model_auth_index;
  "model/auth/rateLimiter": typeof model_auth_rateLimiter;
  "model/auth/roles": typeof model_auth_roles;
  "model/auth/types": typeof model_auth_types;
  "model/auth/utils": typeof model_auth_utils;
  "model/clips/index": typeof model_clips_index;
  "model/clips/mutations": typeof model_clips_mutations;
  "model/clips/queries": typeof model_clips_queries;
  "model/clips/validators": typeof model_clips_validators;
  "model/collections/index": typeof model_collections_index;
  "model/collections/mutations": typeof model_collections_mutations;
  "model/collections/queries": typeof model_collections_queries;
  "model/speakers/index": typeof model_speakers_index;
  "model/speakers/mutations": typeof model_speakers_mutations;
  "model/speakers/queries": typeof model_speakers_queries;
  "model/speakers/validators": typeof model_speakers_validators;
  "model/talks/index": typeof model_talks_index;
  "model/talks/mutations": typeof model_talks_mutations;
  "model/talks/queries": typeof model_talks_queries;
  "model/talks/utils": typeof model_talks_utils;
  "model/talks/validators": typeof model_talks_validators;
  "model/topics/index": typeof model_topics_index;
  "model/topics/mutations": typeof model_topics_mutations;
  "model/topics/queries": typeof model_topics_queries;
  "model/topics/validators": typeof model_topics_validators;
  "model/users/index": typeof model_users_index;
  "model/users/mutations": typeof model_users_mutations;
  "model/users/queries": typeof model_users_queries;
  "model/users/utils": typeof model_users_utils;
  "model/users/validators": typeof model_users_validators;
  speakers: typeof speakers;
  talks: typeof talks;
  topics: typeof topics;
  users: typeof users;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {
  betterAuth: import("../betterAuth/_generated/component.js").ComponentApi<"betterAuth">;
  rateLimiter: import("@convex-dev/rate-limiter/_generated/component.js").ComponentApi<"rateLimiter">;
  resend: import("@convex-dev/resend/_generated/component.js").ComponentApi<"resend">;
};
