import { ArchitectureTopic, emptyContent } from '../systemDesignTypes';

const UPLOAD_SEQUENCE = `sequenceDiagram
  participant Creator
  participant API
  participant Store
  participant Q as Transcode queue
  participant Catalog
  Creator->>API: POST upload-url
  API-->>Creator: signed PUT
  Creator->>Store: PUT bytes
  Store->>Q: object.created
  Q->>Store: write HLS renditions
  Q->>Catalog: first playable variant ready
  Catalog-->>Creator: video is watchable`;

const WATCH_SEQUENCE = `sequenceDiagram
  participant Player
  participant API
  participant CDN
  participant Origin
  Player->>API: GET video metadata
  API-->>Player: manifest URL
  Player->>CDN: GET master.m3u8
  CDN-->>Player: ladder
  Player->>CDN: GET segment
  alt cache miss
    CDN->>Origin: fetch segment
  end
  Player-->>API: watch heartbeat async`;

const ER_DIAGRAM = `erDiagram
  VIDEOS ||--o{ RENDITIONS : has
  VIDEOS ||--o{ COMMENTS : receives
  USERS ||--o{ VIDEOS : uploads
  USERS ||--o{ WATCH_HISTORY : watches`;

export const youtubeTopic: ArchitectureTopic = {
  id: 'youtube',
  title: 'YouTube / Video Streaming',
  description: 'Resumable upload, transcode ladder, CDN + ABR playback, and social features kept off the watch path.',
  difficulty: 'Advanced',
  progress: 0,
  icon: 'Play',
  color: 'bg-red-600',
  section: 'products',
  track: 'classic',
  prerequisites: ['storage-media', 'cdn', 'message-queues', 'search-feeds'],
  estimatedMinutes: 70,
  order: 28,
  content: emptyContent({
    overview:
      'YouTube is a media pipeline plus a catalog. Almost all watch bytes never touch the app tier. Upload is a job graph. Comments and likes are separate services. Recommendations are a different product.',
    whyItExists:
      'User-generated video at internet scale needs processing and edge delivery, not a single MP4 on an app server.',
    whenToUse: ['Video / CDN interviews', 'Async processing graphs', 'Hot-object delivery'],
    problemStatement: {
      prompt:
        'Design a video sharing platform. Creators upload videos. Viewers watch with adaptive bitrate, resume, search, and a home shelf. Comments and likes exist but must not sit on the playback path.',
      inScope: [
        'Resumable upload to object storage',
        'Transcode ladder (HLS/DASH) and catalog',
        'ABR playback via CDN',
        'Watch history and resume',
        'Comments and likes as isolated services',
        'Search over title/description (not the recs stack)',
      ],
      outOfScope: [
        'Live streaming and Premiere',
        'YouTube Shorts / Stories',
        'Full recommendation ranking (see the AI track)',
        'Copyright Content ID internals beyond “async scan”',
      ],
    },
    assumptions: [
      'Billions of watch hours; a tiny fraction of videos are hot.',
      'A 10-minute 1080p source is a few hundred MB; the ladder multiplies storage.',
      'First-frame time matters more than finishing every rendition.',
      'Playback QPS is a CDN problem. The API returns metadata and a manifest URL.',
    ],
    functionalRequirements: [
      { title: 'Upload', detail: 'Resumable signed PUT, then process.' },
      { title: 'Process', detail: 'Probe, transcode rungs, thumbnails, a preview as soon as the lowest rung exists.' },
      { title: 'Watch', detail: 'ABR playback, resume from last position.' },
      { title: 'Catalog', detail: 'Title, description, visibility, duration, manifest.' },
      { title: 'Social', detail: 'Comments and likes — eventually consistent, not on the watch API.' },
      { title: 'Search / home', detail: 'Keyword search plus a ranked home teaser. Recs can be a stub.' },
    ],
    nonFunctionalRequirements: [
      { title: 'Time to first frame', detail: 'Low hundreds of ms to the first segment via a nearby POP.' },
      { title: 'Processing delay', detail: 'A watchable preview in minutes; 4K can trail.' },
      { title: 'Availability', detail: 'Watch 99.99% at the CDN. Upload can be 99.9%.' },
      { title: 'Hot video', detail: 'One object, planetary QPS, origin stays cold.' },
      { title: 'Cost', detail: 'Egress dominates. Origin shield and long TTL on immutable segments.' },
    ],
    estimates: [
      { label: 'Watch bytes', value: 'Dominate cost', note: 'App servers should never stream media.' },
      { label: 'Upload QPS', value: 'Low vs watch', note: 'Burst after events; the queue absorbs it.' },
      { label: 'Hot video', value: 'One ID, huge QPS', note: 'Pre-warm POPs; origin shield.' },
      { label: 'Ladder storage', value: '3–8× source', note: 'More rungs, better ABR, more money.' },
      { label: 'Comments', value: 'Write-heavy on viral videos', note: 'Shard by video_id, not a column on videos.' },
    ],
    concepts: ['HLS/DASH ladder', 'Origin shield', 'Transcode DAG', 'Immutable segments', 'Counter service'],
    walkthrough: [
      {
        title: 'Upload and process',
        description:
          'API mints a signed URL. Bytes land in object storage. A worker probes the file, emits one transcode task per rendition, and marks the catalog playable when the first variant exists.',
        diagram: UPLOAD_SEQUENCE,
      },
      {
        title: 'Watch',
        description:
          'Player asks the API for metadata and a CDN manifest URL, then fetches segments. Watch history is an async heartbeat. Likes never join this path.',
        diagram: WATCH_SEQUENCE,
      },
      {
        title: 'Viral spike',
        description:
          'A World Cup clip is 50% of watch QPS. The CDN and origin shield absorb it. The app tier only sees metadata GETs and sampled history writes.',
      },
    ],
    apis: [
      {
        method: 'POST',
        path: '/v1/videos/upload-url',
        description: 'Mint a resumable signed PUT. The client uploads bytes directly to object storage.',
        request: `{\n  "filename": "goal.mp4",\n  "sizeBytes": 184320000,\n  "mime": "video/mp4"\n}`,
        response: `{\n  "videoId": "v_9k2",\n  "uploadUrl": "https://store.example/put/v_9k2",\n  "expiresAt": "2026-08-30T12:00:00Z"\n}`,
        errors: `{\n  "413": "File too large",\n  "429": "Upload quota"\n}`,
      },
      {
        method: 'GET',
        path: '/v1/videos/:id',
        description: 'Catalog metadata plus a CDN manifest URL. No bytes.',
        response: `{\n  "id": "v_9k2",\n  "title": "Goal",\n  "durationSec": 42,\n  "status": "ready",\n  "manifestUrl": "https://cdn.example/v_9k2/master.m3u8"\n}`,
        errors: `{\n  "404": "Unknown or private",\n  "403": "Age-gated"\n}`,
      },
      {
        method: 'POST',
        path: '/v1/videos/:id/heartbeats',
        description: 'Resume position. Sampled and async — never on the segment path.',
        request: `{\n  "positionSec": 18\n}`,
        response: `{\n  "ok": true\n}`,
      },
      {
        method: 'GET',
        path: '/v1/videos/:id/comments',
        description: 'Cursor page of comments from the comment service.',
        response: `{\n  "comments": [{ "id": "c1", "userId": "u_2", "body": "insane" }]\n}`,
      },
      {
        method: 'POST',
        path: '/v1/videos/:id/likes',
        description: 'Like. Increment lives in a counter service, not the videos row.',
        response: `{\n  "liked": true\n}`,
      },
      {
        method: 'GET',
        path: '/v1/search',
        description: 'Keyword search over the catalog index.',
        request: `{\n  "q": "world cup goal",\n  "limit": 20\n}`,
        response: `{\n  "hits": [{ "videoId": "v_9k2", "title": "Goal" }]\n}`,
      },
    ],
    dataModel: [
      {
        name: 'videos',
        primaryKey: ['video_id'],
        columns: [
          { name: 'video_id', type: 'uuid' },
          { name: 'owner_id', type: 'uuid' },
          { name: 'title', type: 'text' },
          { name: 'status', type: 'enum', notes: 'uploading | processing | ready | rejected' },
          { name: 'duration_sec', type: 'int' },
          { name: 'manifest_key', type: 'text' },
        ],
        indexes: ['(owner_id, created_at DESC)'],
      },
      {
        name: 'renditions',
        primaryKey: ['video_id', 'height', 'bitrate'],
        columns: [
          { name: 'video_id', type: 'uuid' },
          { name: 'height', type: 'int' },
          { name: 'bitrate', type: 'int' },
          { name: 'object_key', type: 'text' },
        ],
      },
      {
        name: 'watch_history',
        primaryKey: ['user_id', 'video_id'],
        columns: [
          { name: 'user_id', type: 'uuid' },
          { name: 'video_id', type: 'uuid' },
          { name: 'position_sec', type: 'int' },
          { name: 'updated_at', type: 'timestamptz' },
        ],
      },
      {
        name: 'comments',
        primaryKey: ['comment_id'],
        columns: [
          { name: 'comment_id', type: 'uuid' },
          { name: 'video_id', type: 'uuid' },
          { name: 'user_id', type: 'uuid' },
          { name: 'body', type: 'text' },
          { name: 'ts', type: 'timestamptz' },
        ],
        indexes: ['(video_id, ts DESC)'],
        notes: 'Never store comments on the videos row.',
      },
    ],
    architecture:
      'Upload API mints signed URLs. Object store plus a transcode worker pool writes an HLS/DASH ladder. Catalog is a small metadata service. Viewers hit a CDN with an origin shield. Comments, likes, and search are separate. Recs is offline plus an online ranker, not on the watch GET.',
    diagram: `flowchart LR
    Creator -->|signed PUT| Store
    Store --> Q[Transcode workers]
    Q --> Store
    Q --> Catalog
    Viewer --> API
    API --> Catalog
    Viewer --> CDN
    CDN --> Shield[Origin shield]
    Shield --> Store`,
    diagrams: [
      { id: 'er', title: 'Entity relationships', kind: 'mermaid', src: ER_DIAGRAM },
    ],
    deepDives: [
      {
        title: 'ABR ladder',
        body: 'Multiple bitrates, immutable segment keys. The player picks a rung from measured bandwidth. CDN caches each key independently. Publish 360p first so the video is watchable while 1080p still cooks.',
      },
      {
        title: 'Hot video',
        body: 'Not an app-tier problem. Pre-warm POPs, sit an origin shield in front of the bucket, and never let segment GETs reach Node. Metadata can be cached at the edge too.',
      },
      {
        title: 'Transcode DAG',
        body: 'Probe → N independent rendition jobs → manifest rewrite → thumbnail. Fail one rung without failing the video. A viral upload wave is a queue-depth problem, not a request-path problem.',
      },
      {
        title: 'Counters and comments',
        body: 'Viral like bursts will melt a videos.like_count column. Buffer increments in Redis and flush. Comments shard by video_id.',
      },
    ],
    tradeoffs: [
      'More renditions: smoother ABR, more storage and transcode cost.',
      'Waiting for 4K before publish vs shipping a preview.',
      'Stale like counts vs a hot row on the catalog.',
    ],
    bottlenecks: ['Transcode backlog after a viral wave', 'Copyright scan queue', 'Hot comment shards', 'Origin if the shield is misconfigured'],
    scalingPath: [
      { scale: 'v1', focus: 'One MP4 on S3 plus CloudFront.' },
      { scale: 'v2', focus: 'HLS ladder, workers, catalog, origin shield.' },
      { scale: 'planet', focus: 'POP pre-warm, multi-region origin, isolated social services, recs stack.' },
    ],
    interviewScript: [
      '“Playback is CDN. The API only returns metadata and a manifest URL.”',
      '“Processing is a DAG of jobs. I will publish a low rung first.”',
      '“Likes and comments are not columns on the video row.”',
    ],
    commonMistakes: [
      'Streaming bytes through app servers',
      'Coupling like_count to the video row',
      'Waiting for every rendition before the video is watchable',
      'Designing the whole recs stack in a 45-minute video interview',
    ],
    relatedTopics: ['cdn', 'storage-media', 'netflix', 'recommendation-system'],
    examples: ['YouTube', 'Vimeo'],
    practicePrompt: 'A World Cup highlight is 50% of global watch QPS. Walk the CDN path and say what the app tier is allowed to do.',
    followUps: [
      {
        question: 'How do you get a video watchable before 4K finishes transcoding?',
        category: 'media',
        difficulty: 'medium',
        answer:
          'The catalog becomes ready when the lowest playable rung and a master playlist exist. Higher rungs append to the playlist as jobs complete. The player simply sees a growing ladder.',
      },
      {
        question: 'What do you do when one rendition job fails?',
        category: 'media',
        difficulty: 'easy',
        answer:
          'Retry that job. Do not fail the video. Serve the rungs you have. Alert if the only playable rung dies.',
      },
      {
        question: 'Where does Content ID / copyright scan sit?',
        category: 'scale',
        difficulty: 'medium',
        answer:
          'An async consumer on the same ingest topic. It can block monetization or visibility without blocking the preview publish, unless policy says otherwise. Say the policy out loud.',
      },
      {
        question: 'How do you stop a celebrity video from melting the comment database?',
        category: 'scale',
        difficulty: 'hard',
        answer:
          'Shard comments by video_id. Cache the first page. Rate-limit writes. For the hottest IDs, write to a dedicated store or a queue that materializes a page cache. Never SELECT * FROM comments WHERE video_id = viral on every watch.',
      },
      {
        question: 'Live streaming — what changes?',
        category: 'media',
        difficulty: 'hard',
        answer:
          'Ingest becomes a persistent codec session, packaging is chunked in seconds not minutes, and the CDN caches short-TTL media playlists. DVR is a sliding window in object storage. Do not pretend VOD transcode is live.',
      },
      {
        question: 'When do recommendations enter this design?',
        category: 'ranking',
        difficulty: 'medium',
        answer:
          'After watch works. Home and Up Next read a candidate set plus a ranker. They must not sit on GET /videos/:id. The AI track covers two-tower ranking.',
      },
    ],
  }),
};
