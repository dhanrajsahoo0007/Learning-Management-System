import { ArchitectureTopic, emptyContent } from '../systemDesignTypes';

const PLAY_SEQUENCE = `sequenceDiagram
  participant App
  participant PlayAPI
  participant License
  participant CDN
  App->>PlayAPI: POST play
  PlayAPI->>License: mint DRM license
  PlayAPI-->>App: manifest plus license
  App->>CDN: ABR segments
  App->>PlayAPI: bookmark heartbeat`;

const ER_DIAGRAM = `erDiagram
  TITLES ||--o{ ASSETS : has
  USERS ||--o{ PROFILES : has
  PROFILES ||--o{ BOOKMARKS : resumes
  PROFILES ||--o{ MY_LIST : saves
  TITLES ||--o{ ROWS : appears_on`;

export const netflixTopic: ArchitectureTopic = {
  id: 'netflix',
  title: 'Netflix',
  description: 'Catalog, personalized homepage rows, DRM playback, bookmarks, and a CDN-heavy watch path.',
  difficulty: 'Advanced',
  progress: 0,
  icon: 'Tv',
  color: 'bg-red-800',
  section: 'products',
  track: 'classic',
  prerequisites: ['cdn', 'storage-media', 'caching', 'search-feeds'],
  estimatedMinutes: 70,
  order: 31,
  content: emptyContent({
    overview:
      'Netflix is a licensed catalog, not UGC. The hard parts are homepage personalization, DRM playback, bookmarks across devices, and shipping bits from the nearest Open Connect box.',
    whyItExists:
      'People want to start a title in one second on any device and continue on another, without the studio leaking a clean file.',
    whenToUse: ['VOD + personalization interviews', 'DRM / device playback', 'Contrast with YouTube UGC'],
    problemStatement: {
      prompt:
        'Design a subscription video service like Netflix. Members browse a personalized home of rows, play licensed titles with DRM and ABR, and resume on any device.',
      inScope: [
        'Catalog and availability windows',
        'Personalized homepage rows',
        'Play: manifest, DRM license, ABR via CDN',
        'Bookmarks / continue watching',
        'Profiles and My List',
        'Search over the catalog',
      ],
      outOfScope: [
        'User uploads',
        'Live sports (treat as a follow-up)',
        'Billing and plan catalog internals',
        'Full recs model training',
      ],
    },
    assumptions: [
      'Tens of millions of concurrent streams at peak, not billions of distinct titles.',
      'A title has a small, studio-approved set of renditions prepared offline.',
      'Open Connect / ISP caches hold the popular titles; origin is for the tail.',
      'Homepage can be stale by minutes. Play start cannot.',
    ],
    functionalRequirements: [
      { title: 'Browse home', detail: 'Rows: continue watching, trending, because you watched X.' },
      { title: 'Title page', detail: 'Metadata, seasons, similar titles.' },
      { title: 'Play', detail: 'DRM license + ABR manifest. Device-specific packaging.' },
      { title: 'Resume', detail: 'Bookmark per profile per title, synced across devices.' },
      { title: 'Profiles', detail: 'A few profiles per account, kids mode.' },
      { title: 'My List and search', detail: 'Explicit save plus keyword search.' },
    ],
    nonFunctionalRequirements: [
      { title: 'Play start', detail: 'First frame under ~1s on a warm title at the ISP cache.' },
      { title: 'Bookmark lag', detail: 'A few seconds is OK; last-writer wins per profile.' },
      { title: 'Homepage freshness', detail: 'Minutes. Precompute rows.' },
      { title: 'License security', detail: 'Widevine/FairPlay. Keys never go to the app as raw files.' },
      { title: 'Regional catalog', detail: 'A title can be missing in a country. Availability is a first-class filter.' },
    ],
    estimates: [
      { label: 'Concurrent streams', value: 'Tens of millions at peak', note: 'CDN and Open Connect, not the play API.' },
      { label: 'Catalog size', value: 'Thousands of titles', note: 'Tiny vs YouTube. Precomputation is feasible.' },
      { label: 'Home QPS', value: 'Bursty on open', note: 'Cache the row payload per profile.' },
      { label: 'Bookmark writes', value: 'One per ~30s of play', note: 'Sample or debounce.' },
    ],
    concepts: ['Open Connect', 'DRM license', 'Precomputed rows', 'Bookmark log', 'Availability window'],
    walkthrough: [
      {
        title: 'Open home',
        description:
          'Resolve the profile, read precomputed row IDs from a cache, hydrate title cards, apply the country availability filter. Continue Watching is a live-ish read of bookmarks.',
      },
      {
        title: 'Press play',
        description:
          'Play API checks entitlement and region, mints a short-lived DRM license, returns a CDN manifest. The player never asks the app for bytes.',
        diagram: PLAY_SEQUENCE,
      },
      {
        title: 'Switch device',
        description:
          'Bookmark service has the last position. The new device asks play again and seeks. Conflict: last heartbeat wins.',
      },
    ],
    apis: [
      {
        method: 'GET',
        path: '/v1/home',
        description: 'Personalized rows for the active profile and country.',
        response: `{\n  "rows": [\n    { "id": "continue", "titleIds": ["t_11"] },\n    { "id": "trending", "titleIds": ["t_8", "t_3"] }\n  ]\n}`,
      },
      {
        method: 'GET',
        path: '/v1/titles/:id',
        description: 'Title metadata if available in this country.',
        response: `{\n  "id": "t_11",\n  "name": "The Crown",\n  "seasons": 6,\n  "available": true\n}`,
        errors: `{\n  "404": "Unknown or not licensed here"\n}`,
      },
      {
        method: 'POST',
        path: '/v1/play',
        description: 'Start or resume a stream. Returns manifest + license session, not bytes.',
        request: `{\n  "titleId": "t_11",\n  "profileId": "p_2",\n  "device": "tv-os"\n}`,
        response: `{\n  "manifestUrl": "https://oc.example/t_11/master.mpd",\n  "licenseUrl": "https://drm.example/session/s1",\n  "bookmarkSec": 1420\n}`,
        errors: `{\n  "402": "Not entitled",\n  "451": "Not available in this country"\n}`,
      },
      {
        method: 'POST',
        path: '/v1/bookmarks',
        description: 'Debounced resume position.',
        request: `{\n  "profileId": "p_2",\n  "titleId": "t_11",\n  "positionSec": 1440\n}`,
        response: `{\n  "ok": true\n}`,
      },
      {
        method: 'PUT',
        path: '/v1/my-list/:titleId',
        description: 'Save a title to My List for this profile.',
        response: `{\n  "saved": true\n}`,
      },
      {
        method: 'GET',
        path: '/v1/search',
        description: 'Catalog search, already filtered by country.',
        request: `{\n  "q": "crown"\n}`,
        response: `{\n  "hits": [{ "titleId": "t_11" }]\n}`,
      },
    ],
    dataModel: [
      {
        name: 'titles',
        primaryKey: ['title_id'],
        columns: [
          { name: 'title_id', type: 'uuid' },
          { name: 'name', type: 'text' },
          { name: 'kind', type: 'enum', notes: 'movie | show' },
        ],
      },
      {
        name: 'assets',
        primaryKey: ['asset_id'],
        columns: [
          { name: 'asset_id', type: 'uuid' },
          { name: 'title_id', type: 'uuid' },
          { name: 'package', type: 'text', notes: 'device family' },
          { name: 'manifest_key', type: 'text' },
        ],
      },
      {
        name: 'availability',
        primaryKey: ['title_id', 'country'],
        columns: [
          { name: 'title_id', type: 'uuid' },
          { name: 'country', type: 'char(2)' },
          { name: 'starts_at', type: 'date' },
          { name: 'ends_at', type: 'date' },
        ],
      },
      {
        name: 'bookmarks',
        primaryKey: ['profile_id', 'title_id'],
        columns: [
          { name: 'profile_id', type: 'uuid' },
          { name: 'title_id', type: 'uuid' },
          { name: 'position_sec', type: 'int' },
          { name: 'updated_at', type: 'timestamptz' },
        ],
      },
      {
        name: 'home_rows',
        primaryKey: ['profile_id', 'row_id'],
        columns: [
          { name: 'profile_id', type: 'uuid' },
          { name: 'row_id', type: 'text' },
          { name: 'title_ids', type: 'uuid[]' },
          { name: 'computed_at', type: 'timestamptz' },
        ],
        notes: 'Materialized. Recomputed offline plus a small online rerank.',
      },
    ],
    architecture:
      'A small play API (entitlement, DRM, bookmark) sits in front of Open Connect / CDN. Homepage is a precomputed row store plus a title-metadata cache. Catalog and availability are a CMS. Search is an inverted index on the licensed set. Recs jobs write home_rows.',
    diagram: `flowchart TB
    App --> HomeAPI
    App --> PlayAPI
    HomeAPI --> Rows[(Precomputed rows)]
    HomeAPI --> Titles[(Title cache)]
    PlayAPI --> DRM
    PlayAPI --> Bookmarks
    App --> CDN[Open Connect / CDN]
    CDN --> Origin`,
    diagrams: [{ id: 'er', title: 'Entity relationships', kind: 'mermaid', src: ER_DIAGRAM }],
    deepDives: [
      {
        title: 'Open Connect vs YouTube CDN',
        body: 'Netflix plants caches inside ISPs because the catalog is small and popular. YouTube’s tail is too long for that. In an interview, say: popular titles are pre-positioned; the tail comes from regional origin.',
      },
      {
        title: 'DRM',
        body: 'The play API mints a license bound to the device. Segments are encrypted. A leaked manifest URL without a license is useless. Rotate licenses; do not put raw keys in the client.',
      },
      {
        title: 'Homepage rows',
        body: 'You cannot rank the whole catalog on app-open. Offline jobs produce candidate rows per profile. Continue Watching is the one row that should be fresher — read bookmarks at request time.',
      },
      {
        title: 'Bookmarks',
        body: 'Debounce heartbeats. Key is (profile, title). Multi-device races: last timestamp wins. Do not write on every video frame.',
      },
    ],
    tradeoffs: [
      'Precomputed home is fast and slightly stale vs live ranking.',
      'More device packages: better playback, more packaging cost.',
      'Kids profile isolation vs one shared continue-watching row.',
    ],
    bottlenecks: ['Friday-night play-start QPS on a new season', 'DRM license service', 'Country-filter bugs leaking titles'],
    scalingPath: [
      { scale: 'v1', focus: 'S3 + CloudFront + one SQL catalog.' },
      { scale: 'v2', focus: 'DRM, bookmarks, cached home, regional origin.' },
      { scale: 'planet', focus: 'Open Connect, precomputed rows, multi-DRM, live as a sidecar.' },
    ],
    interviewScript: [
      '“This is a licensed catalog, not UGC. Playback is CDN plus DRM. Home is precomputed.”',
      '“Continue Watching is the one homepage row I will read live from bookmarks.”',
    ],
    commonMistakes: [
      'Designing YouTube upload for Netflix',
      'Streaming through the play API',
      'Ranking the whole catalog on GET /home',
      'Forgetting country availability',
    ],
    relatedTopics: ['youtube', 'cdn', 'recommendation-system'],
    examples: ['Netflix', 'Disney+', 'Hotstar'],
    practicePrompt: 'A new season drops Friday 8pm in 30 countries. What is pre-positioned, what is computed, and what is allowed to be stale?',
    followUps: [
      {
        question: 'How is Netflix different from YouTube in this interview?',
        category: 'media',
        difficulty: 'easy',
        answer:
          'No UGC upload graph. Small catalog. DRM. Availability windows. Pre-positioned ISP caches. Homepage personalization is first-class; comments are not.',
      },
      {
        question: 'A title is licensed in IN but not US. Where is that enforced?',
        category: 'privacy',
        difficulty: 'medium',
        answer:
          'On home, search, title page, and play. Availability is a join, not a client filter. Play must 451 even if someone has a cached title ID.',
      },
      {
        question: 'How do you pre-position a Friday drop on Open Connect?',
        category: 'scale',
        difficulty: 'hard',
        answer:
          'Package early, push the top rungs to ISP caches before 8pm, keep origin warm for the tail and for countries with thin caches. The play API only mints licenses — it does not fan out bytes.',
      },
      {
        question: 'Two devices seek at once. Which bookmark wins?',
        category: 'media',
        difficulty: 'medium',
        answer:
          'Last heartbeat timestamp. Optionally refuse a second active stream per profile (concurrency cap) so the race is rare.',
      },
      {
        question: 'Where do you put download-for-offline?',
        category: 'media',
        difficulty: 'medium',
        answer:
          'A licensed, time-boxed package on device with a DRM persist license. Expiry is checked on play. This is not a second CDN — it is a license plus a local file.',
      },
      {
        question: 'Live sports — what breaks?',
        category: 'scale',
        difficulty: 'hard',
        answer:
          'You lose pre-positioning. Packaging is just-in-time, playlists are short-TTL, and a goal is a planetary hot key. Treat it as a live product, not a VOD row.',
      },
    ],
  }),
};
