import { ArchitectureTopic, emptyContent } from '../systemDesignTypes';

const STREAM_SEQUENCE = `sequenceDiagram
  participant App
  participant API
  participant License
  participant CDN
  App->>API: GET track
  API-->>App: metadata plus audio URL
  App->>License: widevine or file token
  App->>CDN: GET audio chunks
  App->>API: play heartbeat`;

const ER_DIAGRAM = `erDiagram
  ARTISTS ||--o{ TRACKS : records
  TRACKS ||--o{ ALBUMS : belongs
  USERS ||--o{ PLAYLISTS : owns
  PLAYLISTS ||--o{ PLAYLIST_TRACKS : contains
  USERS ||--o{ FOLLOWS : follows
  USERS ||--o{ LISTENS : plays`;

export const spotifyTopic: ArchitectureTopic = {
  id: 'spotify',
  title: 'Spotify',
  description: 'Catalog search, playlists, licensed audio streaming, and offline sync without turning into YouTube.',
  difficulty: 'Advanced',
  progress: 0,
  icon: 'Music',
  color: 'bg-green-600',
  section: 'products',
  track: 'classic',
  prerequisites: ['cdn', 'search-feeds', 'caching', 'storage-media'],
  estimatedMinutes: 65,
  order: 30,
  content: emptyContent({
    overview:
      'Spotify is a licensed music catalog plus social playlists. Audio is small versus video, but QPS is huge and skip-heavy. The player must start in well under a second and keep working offline.',
    whyItExists:
      'People want any track instantly, playlists that feel like theirs, and a Discover Weekly that is not a table scan.',
    whenToUse: ['Audio streaming interviews', 'Playlist / fan-out', 'Contrast with Netflix and YouTube'],
    problemStatement: {
      prompt:
        'Design a music streaming service like Spotify. Users search the catalog, play licensed tracks, build playlists, follow artists, and get a personalized home.',
      inScope: [
        'Catalog metadata and search',
        'Play / skip / seek with licensed audio via CDN',
        'Playlists and collaborative playlists',
        'Follow artist / user',
        'Listen history and a weekly mix stub',
        'Offline download for premium',
      ],
      outOfScope: [
        'Podcasts and audiobooks as a full second catalog',
        'Creator upload / DistroKid',
        'Full two-tower recs training',
        'HiFi / lossless packaging details',
      ],
    },
    assumptions: [
      'Catalog is tens of millions of tracks — large, but not YouTube-scale objects.',
      'A stream is a few MB. Start-up and skip rate matter more than GB egress.',
      'Free tier is ads + shuffle constraints; premium is on-demand plus offline.',
      'Playlists can be followed by millions (Today’s Top Hits).',
    ],
    functionalRequirements: [
      { title: 'Search', detail: 'Tracks, artists, albums, playlists. Typeahead.' },
      { title: 'Play', detail: 'Start, pause, skip, seek. Gapless is a plus.' },
      { title: 'Playlists', detail: 'CRUD, reorder, collaborative edits.' },
      { title: 'Follow', detail: 'Artists and users. Home surface uses this.' },
      { title: 'History', detail: 'Recently played, used by recs and the jump-back UI.' },
      { title: 'Offline', detail: 'Premium download of a playlist with expiry.' },
    ],
    nonFunctionalRequirements: [
      { title: 'Time to first audio', detail: 'Under ~200ms on a cached track.' },
      { title: 'Skip latency', detail: 'The next track must already be prefetching.' },
      { title: 'Playlist fan-out', detail: 'A celebrity playlist edit must not write to every follower inbox.' },
      { title: 'Search p99', detail: 'Typeahead under 100ms from an in-memory or ES prefix index.' },
      { title: 'License', detail: 'Do not hand a forever URL to the free client.' },
    ],
    estimates: [
      { label: 'DAU', value: 'Hundreds of millions', note: 'Play and skip dominate writes.' },
      { label: 'Skip rate', value: 'Very high', note: 'Prefetch next; do not treat every skip as a full play.' },
      { label: 'Playlist follows', value: 'A hit list can have 30M followers', note: 'Pull, do not fan-out writes.' },
      { label: 'Audio size', value: 'Few MB per track', note: 'CDN still required; origin stays cold.' },
    ],
    concepts: ['Prefetch next', 'Playlist pull', 'Typeahead index', 'Listen log', 'Offline license'],
    walkthrough: [
      {
        title: 'Play a track',
        description:
          'Resolve metadata, mint a short-lived audio URL or DRM session, start the current file, prefetch the next queue item. Heartbeat the listen log after a threshold (e.g. 30 seconds) so skips do not pollute recs.',
        diagram: STREAM_SEQUENCE,
      },
      {
        title: 'Edit a huge playlist',
        description:
          'Write the playlist version and track list once. Followers pull the latest version on open. Do not fan-out 30M inbox rows.',
      },
      {
        title: 'Typeahead',
        description:
          'Prefix index on normalized names. Hydrate top IDs from a metadata cache. Do not SQL LIKE the catalog.',
      },
    ],
    apis: [
      {
        method: 'GET',
        path: '/v1/search',
        description: 'Typeahead across tracks, artists, playlists.',
        request: `{\n  "q": "bohem",\n  "types": ["track", "artist"]\n}`,
        response: `{\n  "tracks": [{ "id": "tr_1", "name": "Bohemian Rhapsody" }]\n}`,
      },
      {
        method: 'GET',
        path: '/v1/tracks/:id',
        description: 'Metadata plus a short-lived audio URL.',
        response: `{\n  "id": "tr_1",\n  "durationMs": 354000,\n  "audioUrl": "https://cdn.example/tr_1?exp=…",\n  "nextPrefetch": ["tr_2"]\n}`,
        errors: `{\n  "402": "Free tier cannot pick this track",\n  "404": "Takedown"\n}`,
      },
      {
        method: 'POST',
        path: '/v1/listens',
        description: 'Count a play after the threshold. Used by recs and royalties.',
        request: `{\n  "trackId": "tr_1",\n  "playedMs": 32000\n}`,
        response: `{\n  "counted": true\n}`,
      },
      {
        method: 'POST',
        path: '/v1/playlists',
        description: 'Create a playlist.',
        request: `{\n  "name": "Commute"\n}`,
        response: `{\n  "id": "pl_9"\n}`,
      },
      {
        method: 'PUT',
        path: '/v1/playlists/:id/tracks',
        description: 'Replace or patch the track list. Bumps version.',
        request: `{\n  "trackIds": ["tr_1", "tr_2"],\n  "version": 14\n}`,
        response: `{\n  "version": 15\n}`,
        errors: `{\n  "409": "Version conflict — collaborative edit"\n}`,
      },
      {
        method: 'GET',
        path: '/v1/playlists/:id',
        description: 'Pull a playlist by version. Followers use this, not a push inbox.',
        response: `{\n  "id": "pl_9",\n  "version": 15,\n  "trackIds": ["tr_1", "tr_2"]\n}`,
      },
    ],
    dataModel: [
      {
        name: 'tracks',
        primaryKey: ['track_id'],
        columns: [
          { name: 'track_id', type: 'uuid' },
          { name: 'artist_id', type: 'uuid' },
          { name: 'name', type: 'text' },
          { name: 'duration_ms', type: 'int' },
          { name: 'audio_key', type: 'text' },
        ],
      },
      {
        name: 'playlists',
        primaryKey: ['playlist_id'],
        columns: [
          { name: 'playlist_id', type: 'uuid' },
          { name: 'owner_id', type: 'uuid' },
          { name: 'name', type: 'text' },
          { name: 'version', type: 'int' },
          { name: 'collaborative', type: 'bool' },
        ],
      },
      {
        name: 'playlist_tracks',
        primaryKey: ['playlist_id', 'position'],
        columns: [
          { name: 'playlist_id', type: 'uuid' },
          { name: 'position', type: 'int' },
          { name: 'track_id', type: 'uuid' },
        ],
      },
      {
        name: 'listens',
        primaryKey: ['listen_id'],
        columns: [
          { name: 'listen_id', type: 'uuid' },
          { name: 'user_id', type: 'uuid' },
          { name: 'track_id', type: 'uuid' },
          { name: 'played_ms', type: 'int' },
          { name: 'ts', type: 'timestamptz' },
        ],
        indexes: ['(user_id, ts DESC)'],
        notes: 'Append-only. Royalty and recs jobs read this, not the play API.',
      },
      {
        name: 'follows',
        primaryKey: ['user_id', 'target_id'],
        columns: [
          { name: 'user_id', type: 'uuid' },
          { name: 'target_id', type: 'uuid' },
          { name: 'kind', type: 'enum', notes: 'artist | user | playlist' },
        ],
      },
    ],
    architecture:
      'Search and metadata are a catalog cluster. Play mints a CDN URL or DRM session and records listens asynchronously. Playlists are a versioned document; followers pull. Recs jobs write Discover Weekly into a per-user playlist. Offline is a device license plus downloaded files.',
    diagram: `flowchart TB
    App --> Search
    App --> PlayAPI
    App --> Playlists
    PlayAPI --> CDN
    PlayAPI --> Listens[(Listen log)]
    Playlists --> PlaylistDB[(Versioned playlists)]
    RecsJobs --> Weekly[(Discover Weekly)]`,
    diagrams: [{ id: 'er', title: 'Entity relationships', kind: 'mermaid', src: ER_DIAGRAM }],
    deepDives: [
      {
        title: 'Why audio still needs a CDN',
        body: 'Each file is small, but skip QPS is enormous and global. Cache by track+bitrate. Prefetch the next item in the queue so a skip is a local hit.',
      },
      {
        title: 'Celebrity playlists',
        body: 'Today’s Top Hits is a single versioned list. Followers pull on open and subscribe to a version channel. Fan-out-on-write would melt the cluster every time a curator moves one track.',
      },
      {
        title: 'What counts as a listen',
        body: 'Royalties and recs need a threshold (often 30s). The heartbeat API is not “I pressed play.” Skips stay in a separate skip log if you care about taste.',
      },
      {
        title: 'Collaborative playlist edits',
        body: 'Optimistic version on the playlist. 409 on conflict; client rebases. Do not lock a row for 30M-follower lists — those are not collaborative.',
      },
    ],
    tradeoffs: [
      'Pull vs push for playlist followers.',
      'Count every play vs a 30s threshold (recs quality vs royalty rules).',
      'Gapless prefetch uses bandwidth the user might skip.',
    ],
    bottlenecks: ['Typeahead QPS', 'Hot playlist reads after an edit', 'Listen-log ingest', 'License takedowns'],
    scalingPath: [
      { scale: 'v1', focus: 'SQL catalog, S3 audio, one playlist table.' },
      { scale: 'v2', focus: 'Prefix search, CDN, versioned playlists, listen log.' },
      { scale: '100M', focus: 'Pull-on-follow, recs jobs, offline licenses, sharded listens.' },
    ],
    interviewScript: [
      '“Audio is CDN. I mint a short-lived URL. I do not stream through Node.”',
      '“A viral playlist is a versioned document that followers pull.”',
      '“A listen is a threshold, not a button press.”',
    ],
    commonMistakes: [
      'Fan-out playlist edits to every follower',
      'SQL LIKE for typeahead',
      'Treating this as YouTube transcode',
      'Writing a listen row on every skip',
    ],
    relatedTopics: ['youtube', 'netflix', 'search-feeds', 'recommendation-system'],
    examples: ['Spotify', 'Apple Music'],
    practicePrompt: 'Today’s Top Hits swaps a track. 30 million followers open the app in the next hour. What do you write, and what do they pull?',
    followUps: [
      {
        question: 'How do you implement Discover Weekly without ranking at request time?',
        category: 'ranking',
        difficulty: 'medium',
        answer:
          'A weekly batch job writes a per-user playlist. The app just GET /playlists/discover-weekly. Online rerank is optional and small. Do not train a model on the request.',
      },
      {
        question: 'Free tier shuffle — how do you enforce it?',
        category: 'media',
        difficulty: 'medium',
        answer:
          'The play API refuses a specific track pick and returns a server-built queue. The client cannot mint URLs for arbitrary IDs. Enforcement is on the license, not a UI hide.',
      },
      {
        question: 'A label takedown lands. What do you invalidate?',
        category: 'privacy',
        difficulty: 'medium',
        answer:
          'Mark the track unavailable, purge search, strip it from playlist hydration (tombstone, do not rewrite every playlist), and expire CDN tokens. Play must 404 even if a playlist still lists the ID.',
      },
      {
        question: 'Collaborative playlist: two people insert at index 3.',
        category: 'scale',
        difficulty: 'hard',
        answer:
          'Version or CRDT positions (fractional indexes). 409 + rebase is enough for a 45-minute answer. Do not use array rewrite without a version.',
      },
      {
        question: 'Offline downloads and a cancelled subscription.',
        category: 'media',
        difficulty: 'easy',
        answer:
          'Persist license has an expiry. On next online check, licenses die. Files can remain encrypted and unplayable. Do not rely on the client deleting them.',
      },
      {
        question: 'Crossfade / gapless — is that a backend problem?',
        category: 'media',
        difficulty: 'easy',
        answer:
          'Mostly client plus prefetch. Backend can expose gapless metadata (trim samples). Do not transcode a joined file per pair of tracks.',
      },
    ],
  }),
};
