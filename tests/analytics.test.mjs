import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { stripTypeScriptTypes } from 'node:module';
import path from 'node:path';
import { test } from 'node:test';
import { createContext, SourceTextModule, SyntheticModule } from 'node:vm';

async function loadSource(file, globals = {}, mocks = {}) {
  const context = createContext({
    clearTimeout,
    console,
    Date,
    process: {
      env: { NEXT_PUBLIC_SEGMENT_WRITE_KEY: 'test', NODE_ENV: 'production' },
    },
    setTimeout,
    URL,
    URLSearchParams,
    ...globals,
  });
  const modules = new Map();
  async function load(filePath) {
    if (modules.has(filePath)) {
      return modules.get(filePath);
    }
    const code = stripTypeScriptTypes(await readFile(filePath, 'utf-8'));
    const sourceModule = new SourceTextModule(code, {
      context,
      identifier: filePath,
      importModuleDynamically: async (specifier, parent) => {
        const dependency = await link(specifier, parent);
        if (dependency.status === 'unlinked') {
          await dependency.link(link);
        }
        if (dependency.status === 'linked') {
          await dependency.evaluate();
        }
        return dependency;
      },
    });
    modules.set(filePath, sourceModule);
    return sourceModule;
  }
  function link(specifier, parent) {
    if (Object.hasOwn(mocks, specifier)) {
      const values = mocks[specifier];
      return new SyntheticModule(
        Object.keys(values),
        function setExports() {
          for (const [key, value] of Object.entries(values)) {
            this.setExport(key, value);
          }
        },
        { context }
      );
    }
    return load(
      path.resolve(path.dirname(parent.identifier), `${specifier}.ts`)
    );
  }
  const sourceModule = await load(path.resolve(file));
  await sourceModule.link(link);
  await sourceModule.evaluate();
  return sourceModule.namespace;
}

async function createClient({
  delivery,
  ready,
  userId: initialUserId = null,
} = {}) {
  const calls = [];
  const document = {
    referrer: 'https://example.com/?email=private#secret',
    title: 'Reset password',
  };
  const window = {
    location: {
      href: 'https://gettreadtalks.com/reset-password?token=secret&utm_source=newsletter#secret',
    },
  };
  let userId = initialUserId;
  let anonymousId = 'returning-visitor';
  let settings;
  const sdk = {
    identify(id, traits, options) {
      userId = id;
      calls.push({ id, method: 'identify', options, traits });
      return delivery?.('identify') ?? Promise.resolve();
    },
    page(properties, options) {
      calls.push({ method: 'page', options, properties, userId });
      return delivery?.('page') ?? Promise.resolve();
    },
    reset() {
      userId = null;
      anonymousId = 'new-visitor';
      calls.push({ method: 'reset' });
    },
    track(event, properties, options) {
      calls.push({ event, method: 'track', options, properties, userId });
      return delivery?.('track') ?? Promise.resolve();
    },
    user: () => ({ id: () => userId }),
  };
  const client = await loadSource(
    'src/lib/analytics/client.ts',
    { document, window },
    {
      '@segment/analytics-next': {
        AnalyticsBrowser: {
          async load(value) {
            settings = value;
            await ready;
            return [sdk];
          },
        },
      },
    }
  );
  return {
    calls,
    client,
    identity: () => ({ anonymousId, userId }),
    settings: () => settings,
    window,
  };
}

test('anonymous startup preserves identity; stale sign-in is cleared only once', async () => {
  const anonymous = await createClient();
  await anonymous.client.reset();
  await anonymous.client.reset();
  assert.equal(anonymous.identity().anonymousId, 'returning-visitor');
  assert.equal(anonymous.calls.length, 0);
  const signedIn = await createClient({ userId: 'stale-user' });
  await signedIn.client.reset();
  await signedIn.client.reset();
  assert.deepEqual(
    signedIn.calls.map(({ method }) => method),
    ['reset']
  );
});

test('identity is applied before tracks without waiting for identify delivery', async () => {
  const pending = Promise.withResolvers();
  const { calls, client } = await createClient({
    delivery: (method) => (method === 'identify' ? pending.promise : undefined),
  });
  const identified = client.identify('user-1', { name: 'First' });
  await client.captureEvent('talk_played', { talk_id: 'talk-1' });
  assert.deepEqual(
    calls.map(({ method }) => method),
    ['identify', 'track']
  );
  assert.equal(calls[1].userId, 'user-1');
  await client.identify('user-1', { name: 'First' });
  assert.equal(calls.length, 2);
  pending.resolve();
  await identified;
  await client.identify('user-2', { name: 'Second' });
  assert.deepEqual(
    calls.slice(2).map(({ method }) => method),
    ['reset', 'identify']
  );
});

test('page and track context retain the original route while SDK startup is delayed', async () => {
  const ready = Promise.withResolvers();
  const { calls, client, window } = await createClient({
    ready: ready.promise,
  });
  const page = client.page();
  const track = client.captureEvent('speaker_link_clicked', {
    url: 'https://example.com/?token=private',
  });
  window.location.href = 'https://gettreadtalks.com/talks/new-page';
  ready.resolve();
  await Promise.all([page, track]);
  for (const call of calls) {
    assert.equal(call.options.context.page.path, '/reset-password');
    assert.equal(call.options.context.page.search, '?utm_source=newsletter');
    assert.equal(call.options.context.page.referrer, 'https://example.com/');
    assert.ok(call.options.timestamp instanceof Date);
    assert.ok(!JSON.stringify(call).includes('secret'));
  }
  assert.equal(calls[1].properties.url, 'https://example.com/');
});

test('privacy plugin sanitizes SDK-generated page properties and context', async () => {
  const { client, settings } = await createClient();
  await client.page();
  const [plugin] = settings().plugins;
  for (const method of ['alias', 'group', 'identify', 'page', 'track']) {
    const context = {
      event: {
        context: {
          page: {
            search: '?token=secret&email=private&utm_medium=email',
            url: 'https://example.com/?token=secret#secret',
          },
        },
        properties: {
          path: '/reset-password?token=secret',
          referrer: 'https://user:password@example.com/?code=secret',
          url: 'https://example.com/?email=private',
        },
      },
    };
    plugin[method](context);
    assert.ok(!JSON.stringify(context).includes('secret'));
    assert.ok(!JSON.stringify(context).includes('private'));
    assert.ok(!JSON.stringify(context).includes('password@'));
    assert.equal(context.event.context.page.search, '?utm_medium=email');
  }
});

test('redirect wait is bounded when analytics cannot finish', async () => {
  const { client } = await createClient();
  const start = Date.now();
  await client.waitForAnalytics(Promise.withResolvers().promise);
  assert.ok(Date.now() - start < 1500);
});

for (const [file, hook, events] of [
  [
    'users/hooks/use-toggle-talk-favorited',
    'useToggleTalkFavorited',
    ['talk_favorited', 'talk_unfavorited'],
  ],
  [
    'users/hooks/use-toggle-talk-finished',
    'useToggleTalkFinished',
    ['talk_finished', 'talk_unfinished'],
  ],
  [
    'users/hooks/use-toggle-speaker-favorited',
    'useToggleSpeakerFavorited',
    ['speaker_favorited', 'speaker_unfavorited'],
  ],
  [
    'talks/hooks/use-toggle-talk-featured',
    'useToggleTalkFeatured',
    ['talk_featured', 'talk_unfeatured'],
  ],
]) {
  test(`${hook} tracks confirmed mutations only`, async () => {
    const mutations = [];
    const tracked = [];
    let onToggle;
    const functions = new Proxy({}, { get: (_, name) => name });
    const source = await loadSource(
      `src/features/${file}.ts`,
      {},
      {
        '@/convex/_generated/api': {
          api: { talks: functions, users: functions },
        },
        '@/hooks': {
          useMutation: (_, options) => {
            function mutateAsync() {
              const pending = Promise.withResolvers();
              mutations.push(pending);
              return pending.promise.then(
                (value) => {
                  options.onSuccess?.(value);
                },
                (error) => {
                  options.onError?.(error);
                  throw error;
                }
              );
            }
            return {
              mutate: () => {
                mutateAsync().catch(() => {});
              },
              mutateAsync,
            };
          },
          useOptimisticToggle: (options) => {
            ({ onToggle } = options);
            return {
              clearOptimistic() {},
              isActive: false,
              isLoading: false,
              toggle() {},
            };
          },
        },
        '@/lib/analytics': {
          speakerTrackProps: () => ({ speaker_id: 'speaker-1' }),
          talkTrackProps: () => ({ talk_id: 'talk-1' }),
          track: (event) => tracked.push(event),
        },
        'convex/react': { useQuery: () => false },
      }
    );
    source[hook]({
      speaker: { _id: 'speaker-1', slug: 'speaker' },
      talk: { _id: 'talk-1', slug: 'talk', title: 'Talk' },
    });
    const failed = onToggle(true);
    assert.equal(tracked.length, 0);
    mutations.shift().reject(new Error('mutation rejected'));
    await failed;
    await Promise.resolve();
    assert.equal(tracked.length, 0);
    const enabled = onToggle(true);
    mutations.shift().resolve();
    await enabled;
    await Promise.resolve();
    const disabled = onToggle(false);
    mutations.shift().resolve();
    await disabled;
    await Promise.resolve();
    assert.deepEqual(tracked, events);
  });
}

test('failed identify can be retried with the same traits', async () => {
  let attempts = 0;
  const { client } = await createClient({
    delivery: (method) => {
      if (method === 'identify') {
        attempts += 1;
        return attempts === 1
          ? Promise.reject(new Error('delivery failed'))
          : Promise.resolve();
      }
    },
  });
  await client.identify('user-1', { name: 'First' });
  await client.identify('user-1', { name: 'First' });
  assert.equal(attempts, 2);
});

test('URL policy rejects unsafe URLs and strips consecutive sensitive parameters', async () => {
  const source = await loadSource('src/lib/analytics/page-context.ts');
  const sanitize = (url) => source.sanitizePageProperties({ url }).url;
  assert.equal(
    sanitize(
      'https://example.com/?token=a&email=b&redirect=c&utm_source=mail#secret'
    ),
    'https://example.com/?utm_source=mail'
  );
  assert.equal(sanitize('ftp://example.com/private'), '');
  assert.equal(sanitize('not a URL'), '');
});

test('native media excludes invalid progress and separates completion from pause', async () => {
  const events = [];
  const source = await loadSource(
    'src/components/media-embed/media/use-media-tracking.ts',
    {},
    {
      '@/lib/analytics': {
        track: (event, properties) => events.push({ event, properties }),
      },
      react: { useRef: (current) => ({ current }) },
    }
  );
  const media = { currentTime: 10, duration: Number.NaN, ended: false };
  const handlers = source.useMediaTracking({
    mediaRef: { current: media },
    mediaType: 'audio',
    trackingContext: {
      entityId: 'talk-1',
      entitySlug: 'talk',
      entityTitle: 'Talk',
      entityType: 'talk',
      speakerId: 'speaker-1',
    },
  });
  handlers.handlePlay();
  handlers.handlePlay();
  handlers.handlePause();
  assert.equal(events.length, 1);
  media.duration = 20;
  handlers.handlePause();
  assert.equal(events[1].properties.progress_pct, 50);
  media.ended = true;
  handlers.handlePause();
  handlers.handleEnded();
  assert.deepEqual(
    events.map(({ event }) => event),
    ['talk_played', 'talk_paused', 'talk_completed']
  );
  assert.equal(events[0].properties.speaker_id, 'speaker-1');
  assert.equal(events[0].properties.talk_title, 'Talk');
  assert.ok(!Object.hasOwn(events[0].properties, 'speaker_slug'));
});
