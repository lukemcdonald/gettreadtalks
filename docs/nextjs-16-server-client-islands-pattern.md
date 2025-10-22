# Next.js 16: Server Component + Client Islands Pattern

## Overview

The **Server Component + Client Islands** pattern combines the best of Server and Client Components in Next.js 16 to achieve:
- ⚡ Fast initial page loads (no loading states)
- 🔍 Great SEO (server-rendered content)
- 🎯 Interactive features (client-side interactivity)
- 👤 User-specific functionality (favorites, auth status)

## The Problem

Next.js 16 introduces stricter caching rules that create a dilemma:

### Server Components
**Pros:**
- Fast initial render (data fetched on server)
- Great SEO (content indexed by search engines)
- No loading spinners for users

**Cons:**
- Can't use React hooks (`useState`, `useEffect`)
- Can't use `'use cache'` with authentication
- Must call `await cookies()` before using better-auth

### Client Components
**Pros:**
- Can use React hooks
- Interactive features work
- Real-time updates

**Cons:**
- Show loading states on first render
- Worse SEO (content not server-rendered)
- Slower initial page load

### Cache Components
**Limitations:**
- ❌ Cannot use `cookies()`, `headers()`, or `searchParams`
- ❌ Cannot be used with authentication
- ❌ Cannot be used on Client Components
- ✅ Only works for truly public, static content

**For apps with authentication:** Cache Components are not applicable.

---

## The Solution: Server + Client Islands

Combine Server Components (for data fetching) with Client Component "islands" (for interactivity).

### Architecture Diagram

```
┌─────────────────────────────────────────────┐
│  Page (Server Component)                    │
│  - Fetches data from API/database          │
│  - No UI rendering                          │
│  - Passes data to Client Component          │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│  PageContent (Client Component)             │
│  ┌─────────────────────────────────────┐   │
│  │ Interactive Island (Client)         │   │  ← Favorite button
│  └─────────────────────────────────────┘   │
│                                             │
│  Static Content (rendered on server)       │  ← Talk details
│  - Speaker info                             │
│  - Description                              │
│  - Collection                               │
└─────────────────────────────────────────────┘
```

---

## Implementation Guide

### Step 1: Server Component Page (Data Fetching)

**Purpose:** Fetch data on server, handle auth, return early if not found.

```typescript
// app/talks/[slug]/page.tsx (Server Component)
import { fetchQuery } from 'convex/nextjs';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';

import { api } from '@/convex/_generated/api';
import { getAuthToken } from '@/lib/services/auth/server';

import { TalkPageContent } from './_components/talk-page-content';

interface TalkPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function TalkPage({ params }: TalkPageProps) {
  // IMPORTANT: Access cookies first for Next.js 16 + better-auth compatibility
  await cookies();

  const { slug } = await params;
  const authToken = await getAuthToken();
  const talkData = await fetchQuery(
    api.talks.getBySlug,
    { slug },
    { token: authToken }
  );

  if (!talkData) {
    notFound();
  }

  // Pass data to Client Component
  return <TalkPageContent talkData={talkData} />;
}
```

**Key Points:**
- ✅ No `'use client'` directive (Server Component by default)
- ✅ Must call `await cookies()` before `getAuthToken()` (Next.js 16 requirement)
- ✅ Fetches data with `fetchQuery` (server-side)
- ✅ Handles not found case
- ✅ Minimal UI logic (just passes data)

---

### Step 2: Client Component Content (Rendering)

**Purpose:** Receive data from server, render UI, include interactive islands.

```typescript
// app/talks/[slug]/_components/talk-page-content/talk-page-content.tsx
'use client';

import type { FunctionReturnType } from 'convex/server';
import type { api } from '@/convex/_generated/api';

import MainLayout from '@/components/layout/main-layout';

import { FavoriteTalkButton } from '../favorite-talk-button';

interface TalkPageContentProps {
  talkData: NonNullable<FunctionReturnType<typeof api.talks.getBySlug>>;
}

export function TalkPageContent({ talkData }: TalkPageContentProps) {
  const { talk, speaker, collection, clips, topics } = talkData;

  return (
    <MainLayout>
      <div>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">{talk.title}</h1>
          
          {/* Client Component Island - Interactive */}
          <FavoriteTalkButton talkId={talk._id} />
        </div>

        {/* Static content - server-rendered */}
        {speaker && (
          <section className="mb-4">
            <h2 className="text-lg font-bold">Speaker</h2>
            <p>{speaker.firstName} {speaker.lastName}</p>
            {speaker.description && <p>{speaker.description}</p>}
          </section>
        )}

        {/* More static content... */}
      </div>
    </MainLayout>
  );
}
```

**Key Points:**
- ✅ Has `'use client'` directive
- ✅ Receives typed data from server via props
- ✅ Renders all UI content
- ✅ Includes Client Component islands for interactivity
- ✅ Type-safe using `FunctionReturnType`

---

### Step 3: Client Component Island (Interactive Feature)

**Purpose:** Small, focused component for a specific interactive feature.

```typescript
// app/talks/[slug]/_components/favorite-talk-button/favorite-talk-button.tsx
'use client';

import type { Id } from '@/convex/_generated/dataModel';

import {
  useFavoriteTalk,
  useIsTalkFavorited,
  useUnfavoriteTalk,
} from '@/lib/features/users/hooks';

interface FavoriteTalkButtonProps {
  talkId: Id<'talks'>;
}

export function FavoriteTalkButton({ talkId }: FavoriteTalkButtonProps) {
  const { data: isFavorited, isLoading: isCheckingFavorite } = useIsTalkFavorited(talkId);
  const favoriteTalk = useFavoriteTalk();
  const unfavoriteTalk = useUnfavoriteTalk();

  const handleToggleFavorite = async () => {
    if (isFavorited) {
      await unfavoriteTalk({ talkId });
    } else {
      await favoriteTalk({ talkId });
    }
  };

  return (
    <button
      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors disabled:opacity-50"
      disabled={isCheckingFavorite}
      onClick={handleToggleFavorite}
      type="button"
    >
      <span className="text-xl">{isFavorited ? '❤️' : '🤍'}</span>
      <span>{isFavorited ? 'Favorited' : 'Favorite'}</span>
    </button>
  );
}
```

**Key Points:**
- ✅ Has `'use client'` directive
- ✅ Uses Convex hooks (`useQuery`, `useMutation`)
- ✅ **Destructures `mutate`** from `useMutation()` return object
- ✅ Handles user interaction (`onClick`)
- ✅ Shows loading/disabled states
- ✅ Focused on single responsibility

**Important:** The custom `useMutation` hook returns an object with `{ mutate, isLoading, error, ... }`. Always destructure `mutate`:

```typescript
// ✅ Correct
const { mutate: favoriteTalk, isLoading } = useFavoriteTalk();
await favoriteTalk({ talkId });

// ❌ Wrong - returns object, not function
const favoriteTalk = useFavoriteTalk();
await favoriteTalk({ talkId }); // Error: favoriteTalk is not a function
```

---

## File Organization

Following component architecture best practices:

```
app/talks/[slug]/
├─ page.tsx                                    # Server Component (data)
└─ _components/                                # Page-specific components
   ├─ favorite-talk-button/
   │  ├─ favorite-talk-button.tsx             # Client Component
   │  └─ index.ts                             # Barrel export
   └─ talk-page-content/
      ├─ talk-page-content.tsx                # Client Component
      └─ index.ts                             # Barrel export
```

**Why `_components/` folder:**
- Next.js ignores folders starting with `_`
- Page-specific components stay co-located
- Easy to find and refactor
- Clear separation from routes

---

## Benefits of This Pattern

### 1. Performance
- ✅ **Zero loading states** - Server fetches data before sending HTML
- ✅ **Fast TTFB** - Content rendered on server
- ✅ **Smaller initial bundle** - Interactive code loaded only where needed

### 2. SEO
- ✅ **Content indexed** - Search engines see full HTML
- ✅ **Better rankings** - Faster page loads improve SEO
- ✅ **Social sharing** - Open Graph tags work correctly

### 3. User Experience
- ✅ **Instant content** - Users see talk immediately
- ✅ **Interactive features** - Favorite button, comments, etc.
- ✅ **Real-time updates** - Client islands subscribe to changes

### 4. Developer Experience
- ✅ **Clean separation** - Data fetching vs. rendering
- ✅ **Reusable pattern** - Template for all pages
- ✅ **Type safe** - Server data typed to Client Components
- ✅ **Easy to test** - Small, focused components

---

## When to Use This Pattern

### ✅ Use Server + Client Islands When:
- Page has mostly static content
- Some interactive features needed (buttons, forms)
- SEO is important
- Fast initial load matters
- Using authentication

**Examples:**
- Blog posts with comment forms
- Product pages with "Add to Cart" button
- Talk pages with favorite button
- Article pages with share buttons

### ❌ Use Full Client Component When:
- Entire page is interactive (dashboard, admin panel)
- User-specific data throughout (account settings)
- Real-time updates everywhere
- SEO not important

**Examples:**
- User dashboards
- Admin panels
- Real-time chat
- Account settings pages

### ✅ Use Full Server Component When:
- No interactivity needed
- Purely static content
- SEO critical
- No user-specific features

**Examples:**
- Marketing pages
- Documentation
- Blog listings
- About pages

---

## Next.js 16 Specific Requirements

### 1. Must Call `await cookies()` Before Auth + Wrap in Suspense

```typescript
import { Suspense } from 'react';

async function PageData({ slug }: { slug: string }) {
  // REQUIRED: Access cookies before better-auth
  await cookies();
  
  const authToken = await getAuthToken();
  const data = await fetchQuery(...);
  
  if (!data) notFound();
  
  return <PageContent data={data} />;
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PageData slug={slug} />
    </Suspense>
  );
}
```

**Why Suspense:** Next.js 16 wants you to wrap dynamic data access (like `cookies()`) in Suspense boundaries so the page can stream progressively instead of blocking entirely.

**Why `await cookies()` first:** Next.js 16 requires accessing dynamic data sources (like `cookies()`) before any code that uses `Math.random()`. Since `better-auth` uses `Math.random()` internally, we must call `await cookies()` first.

**Errors if missing:**
```
// Missing await cookies():
Error: Route "/" used `Math.random()` before accessing Request data

// Missing Suspense:
Warning: uncached data was accessed outside of <Suspense>
This delays the entire page from rendering
```

### 2. Cache Components Don't Work With Auth

```typescript
// ❌ This will fail
'use cache';
export default async function Page() {
  const authToken = await getAuthToken(); // Uses cookies() - not allowed!
  // ...
}
```

**Error:**
```
Error: Route used `cookies()` inside "use cache". Accessing Dynamic data sources inside a cache scope is not supported.
```

**Why:** Cache Components are for content that's identical for all users. Authentication is per-user, so it's incompatible with caching.

---

## Type Safety

### Using `FunctionReturnType` for Props

Always type your Client Component props with the exact return type from your Convex queries:

```typescript
import type { FunctionReturnType } from 'convex/server';
import type { api } from '@/convex/_generated/api';

interface TalkPageContentProps {
  talkData: NonNullable<FunctionReturnType<typeof api.talks.getBySlug>>;
}
```

**Why `NonNullable`:**
- Server Component already handles `null` case (`if (!talkData) notFound()`)
- Client Component receives guaranteed non-null data
- TypeScript knows data exists

---

## Common Patterns

### Pattern 1: Interactive Button in Static Page

```typescript
// Server Component page (with Suspense)
async function ItemPageData({ slug }) {
  await cookies();
  const data = await fetchQuery(api.items.getBySlug, { slug });
  return <ItemPageContent data={data} />;
}

export default async function ItemPage({ params }) {
  const { slug } = await params;
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ItemPageData slug={slug} />
    </Suspense>
  );
}

// Client Component content
'use client';
export function ItemPageContent({ data }) {
  return (
    <div>
      <h1>{data.title}</h1>
      <AddToCartButton itemId={data._id} /> {/* Client island */}
      <div>{data.description}</div>
    </div>
  );
}

// Client Component island
'use client';
export function AddToCartButton({ itemId }) {
  const { mutate: addToCart, isLoading } = useAddToCart();
  
  return (
    <button 
      onClick={() => addToCart({ itemId })}
      disabled={isLoading}
    >
      {isLoading ? 'Adding...' : 'Add to Cart'}
    </button>
  );
}
```

### Pattern 2: Form in Static Page

```typescript
// Server Component page
export default async function ContactPage() {
  await cookies();
  return <ContactPageContent />;
}

// Client Component with form
'use client';
export function ContactPageContent() {
  const sendMessage = useSendMessage();
  const [message, setMessage] = useState('');
  
  return (
    <div>
      <h1>Contact Us</h1>
      <form onSubmit={(e) => { e.preventDefault(); sendMessage({ message }); }}>
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
```

### Pattern 3: Multiple Interactive Islands

```typescript
// Client Component content with multiple islands
'use client';
export function ArticleContent({ data }) {
  return (
    <article>
      <h1>{data.title}</h1>
      
      {/* Interactive islands */}
      <div className="flex gap-2">
        <FavoriteButton articleId={data._id} />
        <ShareButton url={data.url} />
        <BookmarkButton articleId={data._id} />
      </div>
      
      {/* Static content */}
      <div>{data.content}</div>
      
      {/* Another interactive island */}
      <CommentSection articleId={data._id} />
    </article>
  );
}
```

---

## File Structure Template

For any new page with interactive features:

```
app/[feature]/[slug]/
├─ page.tsx                                    # Server Component
└─ _components/                                # Page-specific components
   ├─ [feature]-page-content/
   │  ├─ [feature]-page-content.tsx           # Client Component (main)
   │  └─ index.ts                             # Barrel export
   ├─ interactive-button/
   │  ├─ interactive-button.tsx               # Client Component (island)
   │  └─ index.ts                             # Barrel export
   └─ another-feature/
      ├─ another-feature.tsx                  # Client Component (island)
      └─ index.ts                             # Barrel export
```

**Example from this app:**
```
app/talks/[slug]/
├─ page.tsx                                    # Server: fetches talk data
└─ _components/
   ├─ talk-page-content/
   │  ├─ talk-page-content.tsx                # Client: renders all content
   │  └─ index.ts
   └─ favorite-talk-button/
      ├─ favorite-talk-button.tsx             # Client: favorite functionality
      └─ index.ts
```

---

## Code Template for Future Pages

### 1. Server Component Page

```typescript
// app/[entity]/[slug]/page.tsx
import { Suspense } from 'react';

import { fetchQuery } from 'convex/nextjs';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';

import { api } from '@/convex/_generated/api';
import { getAuthToken } from '@/lib/services/auth/server';

import { EntityPageContent } from './_components/entity-page-content';

interface EntityPageProps {
  params: Promise<{
    slug: string;
  }>;
}

async function EntityPageData({ slug }: { slug: string }) {
  // Required for Next.js 16 + better-auth
  await cookies();

  const authToken = await getAuthToken();
  const entityData = await fetchQuery(
    api.entities.getBySlug,
    { slug },
    { token: authToken }
  );

  if (!entityData) {
    notFound();
  }

  return <EntityPageContent entityData={entityData} />;
}

export default async function EntityPage({ params }: EntityPageProps) {
  const { slug } = await params;

  return (
    <Suspense fallback={<div className="p-8">Loading...</div>}>
      <EntityPageData slug={slug} />
    </Suspense>
  );
}
```

### 2. Client Component Content

```typescript
// app/[entity]/[slug]/_components/entity-page-content/entity-page-content.tsx
'use client';

import type { FunctionReturnType } from 'convex/server';
import type { api } from '@/convex/_generated/api';

import MainLayout from '@/components/layout/main-layout';

import { InteractiveButton } from '../interactive-button';

interface EntityPageContentProps {
  entityData: NonNullable<FunctionReturnType<typeof api.entities.getBySlug>>;
}

export function EntityPageContent({ entityData }: EntityPageContentProps) {
  const { entity, relatedData } = entityData;

  return (
    <MainLayout>
      <div>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">{entity.title}</h1>
          
          {/* Client Component Island */}
          <InteractiveButton entityId={entity._id} />
        </div>

        {/* Static content */}
        <div>{entity.description}</div>
        
        {/* More content... */}
      </div>
    </MainLayout>
  );
}
```

### 3. Client Component Island

```typescript
// app/[entity]/[slug]/_components/interactive-button/interactive-button.tsx
'use client';

import type { Id } from '@/convex/_generated/dataModel';

import { useEntityMutation, useEntityQuery } from '@/lib/features/entities/hooks';

interface InteractiveButtonProps {
  entityId: Id<'entities'>;
}

export function InteractiveButton({ entityId }: InteractiveButtonProps) {
  const { data: someState, isLoading } = useEntityQuery(entityId);
  const doSomething = useEntityMutation();

  const handleClick = async () => {
    await doSomething({ entityId });
  };

  return (
    <button
      className="px-4 py-2 rounded-lg border transition-colors disabled:opacity-50"
      disabled={isLoading}
      onClick={handleClick}
      type="button"
    >
      {someState ? 'Active' : 'Inactive'}
    </button>
  );
}
```

### 4. Barrel Exports

```typescript
// app/[entity]/[slug]/_components/entity-page-content/index.ts
export { EntityPageContent } from './entity-page-content';

// app/[entity]/[slug]/_components/interactive-button/index.ts
export { InteractiveButton } from './interactive-button';
```

---

## Decision Tree

### Should I use Server + Client Islands?

```
Does your page need authentication?
├─ Yes
│  ├─ Does it have interactive features? (buttons, forms, etc.)
│  │  ├─ Yes → ✅ Use Server + Client Islands
│  │  └─ No → Use full Server Component
│  └─ No
│     └─ Is it truly public static content?
│        ├─ Yes → Consider Cache Components or full Server Component
│        └─ No → Use Server + Client Islands
```

### Which parts should be Client Components?

```
For each feature, ask:
├─ Does it need user interaction? (onClick, onChange, onSubmit)
│  └─ Yes → Client Component island
├─ Does it need React hooks? (useState, useEffect, custom hooks)
│  └─ Yes → Client Component island
├─ Does it use browser APIs? (localStorage, window, document)
│  └─ Yes → Client Component island
├─ Does it need real-time updates?
│  └─ Yes → Client Component island
└─ Otherwise
   └─ Keep in Server-rendered content
```

---

## Common Mistakes to Avoid

### ❌ Mistake 1: Forgetting `await cookies()` or Suspense

```typescript
// ❌ Bad - will throw error in Next.js 16
export default async function TalkPage({ params }) {
  const authToken = await getAuthToken(); // Uses cookies internally
  // Error: used Math.random() before accessing Request data
}

// ⚠️ Better - but will show warning
export default async function TalkPage({ params }) {
  await cookies(); // Access cookies first
  const authToken = await getAuthToken();
  // Warning: uncached data accessed outside of Suspense
}

// ✅ Best - with Suspense
async function TalkPageData({ slug }) {
  await cookies(); // Access cookies first
  const authToken = await getAuthToken();
  const data = await fetchQuery(...);
  return <TalkPageContent data={data} />;
}

export default async function TalkPage({ params }) {
  const { slug } = await params;
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TalkPageData slug={slug} />
    </Suspense>
  );
}
```

### ❌ Mistake 2: Using `'use cache'` with Auth

```typescript
// ❌ Bad - incompatible
'use cache';
export default async function TalkPage({ params }) {
  const authToken = await getAuthToken(); // Uses cookies()
  // Error: used cookies() inside "use cache"
}

// ✅ Good - no cache directive
export default async function TalkPage({ params }) {
  await cookies();
  const authToken = await getAuthToken();
}
```

### ❌ Mistake 3: Making Entire Page Client Component

```typescript
// ❌ Bad - loses SEO and shows loading states
'use client';
export default function TalkPage({ params }) {
  const { data, isLoading } = useTalkBySlug(slug);
  
  if (isLoading) return <div>Loading...</div>; // Bad UX
  // ...
}

// ✅ Good - Server fetches, no loading state
export default async function TalkPage({ params }) {
  await cookies();
  const talkData = await fetchQuery(...); // Fast server fetch
  return <TalkPageContent talkData={talkData} />; // Client renders
}
```

### ❌ Mistake 4: Passing Entire Context to Islands

```typescript
// ❌ Bad - passing too much data
<FavoriteTalkButton talkData={talkData} /> // Entire object

// ✅ Good - pass only what's needed
<FavoriteTalkButton talkId={talkData.talk._id} /> // Just the ID
```

---

## Authentication Handling

### Site Header (Client Component in Root Layout)

Your header is already set up correctly as a Client Component in the root layout:

```typescript
// app/layout.tsx (Server)
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AuthProvider>
          <SiteHeader /> {/* Client Component */}
          {children}      {/* Can be Server or Client pages */}
        </AuthProvider>
      </body>
    </html>
  );
}

// components/layout/site-header/auth-status/auth-status.tsx (Client)
'use client';

export default function AuthStatus() {
  return (
    <>
      <Authenticated>
        <AuthenticatedContent /> {/* Shows user avatar/name */}
      </Authenticated>
      <Unauthenticated>
        <UnauthenticatedContent /> {/* Shows login button */}
      </Unauthenticated>
    </>
  );
}
```

**Why this works:**
- ✅ Header is Client Component (can use Convex hooks)
- ✅ Lives in root layout (appears on all pages)
- ✅ Works on both Server and Client pages
- ✅ Shows user status everywhere

---

## Performance Comparison

### Before: Full Client Component
```
Request → HTML shell → JavaScript loads → Data fetches → Content renders
         [Fast]        [Slow]             [Slow]         [Finally!]
                        
User sees: Loading spinner for 2-3 seconds
SEO sees: Empty page
```

### After: Server + Client Islands
```
Request → Server fetches data → HTML with content → JavaScript enhances → Interactive!
         [Fast]                 [Fast]              [Fast]               [Instant]
                        
User sees: Full content immediately
SEO sees: Complete HTML content
```

**Result:** 2-3 second faster perceived load time!

---

## Future-Proofing

This pattern is forward-compatible with future Next.js improvements:

### React Server Components
- ✅ Following RSC best practices
- ✅ Ready for React 20+ features

### Partial Pre-Rendering (PPR)
- ✅ Server Component pages work with PPR
- ✅ Client islands render independently

### Streaming
- ✅ Can add `<Suspense>` around client islands
- ✅ Progressive enhancement ready

---

## Additional Examples from This App

### Homepage Pattern
```typescript
// app/page.tsx (Server)
export default async function Home() {
  await cookies();
  const authToken = await getAuthToken();
  const preloadedTalks = await preloadQuery(api.talks.list, {...}, { token: authToken });
  
  return <HomeContent preloadedTalks={preloadedTalks} />;
}

// app/_components/home-content.tsx (Client)
'use client';
export function HomeContent({ preloadedTalks }) {
  const talks = usePreloadedQuery(preloadedTalks);
  // Pagination, filtering, etc.
}
```

**Pattern:** Server preloads data → Client adds pagination/interactivity

---

## Suspense Fallbacks

### Best Practices for Loading States

**Keep it simple:** Users typically won't see the fallback because data loads fast on the server.

```typescript
// ✅ Simple and appropriate
<Suspense fallback={<div className="p-8">Loading...</div>}>

// ✅ Branded loading
<Suspense fallback={<div className="p-8 text-center">Loading talk...</div>}>

// ✅ Skeleton UI (for slower connections)
<Suspense fallback={<TalkPageSkeleton />}>

// ❌ Over-engineered (unnecessary for server-side fetching)
<Suspense fallback={<ComplexLoadingSpinner />}>
```

**Why simple is better:**
- Server-side fetches are usually fast (< 100ms)
- Users rarely see the fallback
- Complex loading UIs add bundle size for little benefit

**When to use skeleton UI:**
- Slow external API calls
- Large data fetches
- Known slow operations

**For this app:** Simple text fallbacks are sufficient because:
- Convex queries are fast
- Server-side fetching is quick
- Most data is already cached by Convex

---

## Checklist for New Pages

When creating a new page:

- [ ] Is the page mostly static content?
  - Yes → Server Component page
- [ ] Does it need interactive features?
  - Yes → Add Client Component islands
- [ ] Does it use authentication?
  - Yes → Add `await cookies()` in data-fetching component
  - Yes → Wrap in `<Suspense>` boundary
- [ ] Is SEO important?
  - Yes → Keep main content in Server Component
- [ ] Create `_components/` folder for page-specific components
- [ ] Use barrel exports (`index.ts`) for all components
- [ ] Type Client Component props with `FunctionReturnType`
- [ ] Pass only necessary data to Client islands (IDs, not full objects)
- [ ] Add simple loading fallback to Suspense boundary
- [ ] Extract data fetching to separate async component (inside Suspense)

---

## Summary

**Server Component + Client Islands** is the recommended pattern for Next.js 16 apps with authentication because:

1. ✅ Fast initial loads (no loading states)
2. ✅ Great SEO (server-rendered content)
3. ✅ Interactive features work (client islands)
4. ✅ User authentication works everywhere (client header)
5. ✅ Type safe and maintainable
6. ✅ Forward-compatible with React/Next.js evolution

**Use this pattern for all pages that need both fast loads and interactivity!**

---

## References

- [Next.js 16 Blog Post](https://nextjs.org/blog/next-16)
- [Next.js Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
- [Next.js Client Components](https://nextjs.org/docs/app/building-your-application/rendering/client-components)
- [Convex with Next.js](https://docs.convex.dev/client/react/nextjs)
