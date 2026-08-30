import { ArchitectureTopic, emptyContent } from '../systemDesignTypes';

const MARKETPLACE_DIAGRAM = `flowchart LR
  Seeker[Seeker attention] --> Deck[Deck of nearby cards]
  Deck --> Swipe[Like or pass]
  Swipe --> Gate{Mutual like?}
  Gate -->|no| Seen[Never show again]
  Gate -->|yes| Chat[Unlock 1:1 chat]`;

const RECS_SEQUENCE = `sequenceDiagram
  participant App
  participant Recs
  participant Geo
  participant Seen
  participant Ranker
  participant CDN
  App->>Recs: GET /v1/recs
  Recs->>Geo: cell plus 8 neighbors
  Geo-->>Recs: candidate ids
  Recs->>Seen: subtract swipes blocks matches
  Seen-->>Recs: unseen ids
  Recs->>Ranker: rank by activity and fairness
  Ranker-->>Recs: top N
  Recs->>CDN: hydrate photo URLs
  Recs-->>App: cards and cursor`;

const SWIPE_SEQUENCE = `sequenceDiagram
  participant App
  participant Swipe
  participant Likes
  participant Match
  participant Chat
  App->>Swipe: POST /v1/swipes
  Swipe->>Likes: write from_id to_id action
  Swipe->>Likes: read reverse like
  alt reverse like exists
    Swipe->>Match: CAS match user_min user_max
    Match->>Chat: create conversation
    Swipe-->>App: matched true
  else no reverse like
    Swipe-->>App: matched false
  end`;

const NOTIFY_SEQUENCE = `sequenceDiagram
  participant Match
  participant Kafka
  participant Notify
  participant Socket
  participant Push
  Match->>Kafka: match.created
  Kafka->>Notify: consume
  Notify->>Socket: if both online
  Notify->>Push: APNs or FCM fallback
  Notify-->>Match: ack`;

const ER_DIAGRAM = `erDiagram
  PROFILES ||--o{ PHOTOS : has
  PROFILES ||--|| PREFERENCES : sets
  PROFILES ||--o| LOCATIONS : at
  PROFILES ||--o{ SWIPES : sends
  PROFILES ||--o{ MATCHES : joins
  PROFILES ||--o{ BLOCKS : blocks
  MATCHES ||--|| CONVERSATIONS : opens
  CONVERSATIONS ||--o{ MESSAGES : contains
  PROFILES ||--o{ REPORTS : files`;

const SCALING_DIAGRAM = `flowchart TB
  K[1K users] --> PostGIS[PostGIS plus SQL likes]
  M[1M users] --> GeoKV[Geohash Redis plus match service]
  B[100M users] --> Shards[City shards plus ranker plus abuse ML]
  PostGIS --> GeoKV --> Shards`;

export const tinderTopic: ArchitectureTopic = {
  id: 'tinder',
  title: 'Tinder',
  description: 'Geo candidate generation, ranking, unseen-card tracking, atomic matches, then 1:1 chat.',
  difficulty: 'Advanced',
  progress: 0,
  icon: 'Heart',
  color: 'bg-pink-600',
  section: 'products',
  track: 'classic',
  prerequisites: ['databases', 'caching', 'realtime', 'reliability'],
  estimatedMinutes: 90,
  order: 23,
  content: emptyContent({
    overview:
      'Tinder is a two-sided marketplace of attention. The deck is a geo plus preference query with ranking and “never show again.” A match is a distributed AND of two likes, and chat exists only after that AND.',
    whyItExists:
      'People want nearby, filtered, fresh recommendations and a chat unlock only when both people opt in. The product is discovery first, messaging second.',
    whenToUse: [
      'Geo plus ranking interviews',
      'Matching / two-sided like graphs',
      'When the interviewer says “design Tinder, Bumble, or Hinge”',
    ],
    problemStatement: {
      prompt:
        'Design a location-based dating app. Users browse a nearby deck of profiles, swipe like / pass / superlike, and unlock 1:1 chat only when both people like each other.',
      inScope: [
        'Profile CRUD and photo upload',
        'Location updates',
        'Paginated recommendation deck',
        'Swipe: like, pass, superlike',
        'Mutual like creates one match and one conversation',
        'Match list and lightweight 1:1 messages',
        'Push and websocket notify',
        'Block, report, and unmatch (never show again)',
      ],
      outOfScope: [
        'Payments, Boost, and Super Boost',
        'Video chat and live Stories',
        'Passport / travel mode (treat as a follow-up)',
        '“Who liked you” as a paid feature (treat as a follow-up)',
      ],
    },
    assumptions: [
      'About 50 million daily active users, mobile-first, one active location per user.',
      'A typical session is 20 swipes. People open the app a few times a day.',
      'Chat volume is far smaller than WhatsApp — do not design a global messaging fabric.',
      'Photos live on object storage and a CDN. The recs path only returns URLs.',
      'We will not leak who liked you until there is a match.',
    ],
    functionalRequirements: [
      { title: 'Profile and photos', detail: 'Create and edit bio, age, gender, and photos. Photos are uploaded once, then served from a CDN.' },
      { title: 'Location update', detail: 'Client patches lat/lng. The server writes the current cell and last-active timestamp.' },
      { title: 'Recommendation deck', detail: 'Paginated cards in radius that match age, gender, and preference filters, never repeating a seen person.' },
      { title: 'Swipe', detail: 'Like, pass, or superlike. Superlike is a scarce, rate-limited action.' },
      { title: 'Match', detail: 'A mutual like creates exactly one match row and one conversation.' },
      { title: 'Chat', detail: '1:1 messages after a match. Offline users get a push.' },
      { title: 'Notify', detail: 'Push plus websocket if the other person is online.' },
      { title: 'Safety', detail: 'Block, report, and unmatch. Those IDs never re-enter the deck.' },
    ],
    nonFunctionalRequirements: [
      { title: 'Deck latency', detail: 'p99 under 100ms for candidate fetch plus rank plus photo URL hydrate.' },
      { title: 'Swipe ack', detail: 'Write plus reverse-like check under 50ms. Match creation can be slightly slower if it is atomic.' },
      { title: 'Match notify', detail: 'The other person hears about it within about one second.' },
      { title: 'Availability', detail: '99.9% on recs and swipe. Chat can degrade to push-only.' },
      { title: 'Freshness', detail: 'Do not reshuffle the same 20 faces. A seen-set is a correctness requirement, not a nicety.' },
      { title: 'Privacy', detail: 'Do not leak likers before a match. Location is stored at cell granularity for queries, exact coords only for haversine.' },
      { title: 'Abuse', detail: 'Rate-limit likes, detect bots, and stop like-bombs from starving the deck.' },
      { title: 'GDPR', detail: 'A delete must clear SQL, Redis seen/geo keys, photos, and chat.' },
    ],
    estimates: [
      {
        label: 'DAU',
        value: '50M',
        note: 'Lock this with the interviewer. Weekend and city peaks matter more than the average.',
      },
      {
        label: 'Swipe writes / day',
        value: '~3B',
        note: '50M × 3 sessions × 20 swipes. Peak is not the daily average divided by 86400.',
      },
      {
        label: 'Peak swipe QPS',
        value: '~80k–120k',
        note: 'Assume a 0.1–0.15 peak factor on the daily write volume. This is the match-service budget.',
      },
      {
        label: 'Deck reads',
        value: 'Bursty on app-open',
        note: 'A page of 10–20 cards. Far fewer than swipes, but fan-out to geo + seen + rank + CDN.',
      },
      {
        label: 'Chat QPS',
        value: 'Low vs WhatsApp',
        note: 'Only matched pairs talk. Do not copy a WhatsApp design.',
      },
      {
        label: 'Storage',
        value: 'Photos dominate',
        note: 'Swipe rows are skinny but numerous. Photos are the object-store and CDN bill.',
      },
      {
        label: 'Capacity cliff',
        value: 'Hot geo cells',
        note: 'Downtown Friday night and festivals beat any global QPS number.',
      },
    ],
    concepts: [
      'Geohash / S2',
      'Seen-set',
      'Atomic match',
      'Two-sided marketplace',
      'Rate-limited likes',
      'Inventory fairness',
    ],
    walkthrough: [
      {
        title: 'Open the deck',
        description:
          'Resolve the viewer’s geohash and its neighbors, fetch candidate IDs, subtract seen / likes / passes / blocks, rank, then hydrate photo URLs from the CDN. Do not scan the profiles table.',
        animation: 'recs-pipeline',
        diagram: RECS_SEQUENCE,
      },
      {
        title: 'Like',
        description:
          'Record the swipe. If the reverse like exists, create a match and one conversation with a compare-and-set on (user_min, user_max). A miss is the common case.',
        animation: 'swipe-match',
        diagram: SWIPE_SEQUENCE,
      },
      {
        title: 'Notify',
        description:
          'Publish match.created. The notify worker pushes to a websocket if the other user is online, otherwise APNs or FCM. Keep this off the swipe ACK path.',
        diagram: NOTIFY_SEQUENCE,
      },
    ],
    steps: [
      { title: 'Index people by geo cells', description: 'Update cell membership when they move. Recs never does a table scan.' },
      { title: 'Keep a seen structure', description: 'Redis set or bloom plus SQL snapshot for “already swiped.”' },
      { title: 'Make match atomic', description: 'Do not create two chats for one pair.' },
    ],
    apis: [
      {
        method: 'PATCH',
        path: '/v1/me/location',
        description: 'Update the viewer’s current point and geo cell. Called on app-open and on significant movement.',
        request: `{
  "lat": 37.7749,
  "lng": -122.4194
}`,
        response: `{
  "cell": "9q8yyk",
  "activeAt": "2026-08-30T11:02:11Z"
}`,
        errors: `{
  "400": "Invalid coordinates",
  "429": "Location updates are being throttled"
}`,
      },
      {
        method: 'GET',
        path: '/v1/recs',
        description: 'Next page of unseen cards already filtered by prefs, distance, and the seen-set.',
        request: `{
  "limit": 15,
  "cursor": "eyJjZWxsIjoiOXE4eXlrIn0"
}`,
        response: `{
  "cards": [
    {
      "userId": "u_184",
      "name": "Blake",
      "age": 28,
      "distanceKm": 3.2,
      "photoUrls": ["https://cdn.example/p/184/0.jpg"]
    }
  ],
  "cursor": "eyJvZmZzZXQiOjE1fQ"
}`,
        errors: `{
  "400": "Missing location — patch /v1/me/location first",
  "429": "Deck is being rate-limited"
}`,
      },
      {
        method: 'POST',
        path: '/v1/swipes',
        description: 'Like, pass, or superlike. Returns whether this swipe completed a match.',
        request: `{
  "targetId": "u_184",
  "action": "like"
}`,
        response: `{
  "matched": true,
  "matchId": "m_90210"
}`,
        errors: `{
  "404": "Target is gone or blocked you",
  "409": "Match already exists",
  "429": "Like-bomb / superlike quota exceeded"
}`,
      },
      {
        method: 'GET',
        path: '/v1/matches',
        description: 'Recent matches and last-message preview for the inbox.',
        response: `{
  "matches": [
    {
      "matchId": "m_90210",
      "peerId": "u_184",
      "lastMessage": "Hey — you at the show?",
      "unread": 1
    }
  ]
}`,
      },
      {
        method: 'GET',
        path: '/v1/matches/:id/messages',
        description: 'Cursor-paginated 1:1 history for one conversation.',
        request: `{
  "limit": 30,
  "before": "msg_4401"
}`,
        response: `{
  "messages": [
    { "id": "msg_4400", "from": "u_184", "body": "Hey", "ts": "2026-08-30T10:59:01Z" }
  ]
}`,
        errors: `{
  "404": "Unmatched or never existed"
}`,
      },
      {
        method: 'POST',
        path: '/v1/matches/:id/messages',
        description: 'Send a chat message. Online peers get a socket event; everyone else gets a push.',
        request: `{
  "body": "Free Thursday?"
}`,
        response: `{
  "id": "msg_4402",
  "ts": "2026-08-30T11:03:44Z"
}`,
        errors: `{
  "404": "Unmatched",
  "413": "Message too long"
}`,
      },
      {
        method: 'DELETE',
        path: '/v1/matches/:id',
        description: 'Unmatch. Closes the conversation and writes a block-style seen so they do not reappear.',
        response: `{
  "ok": true
}`,
        errors: `{
  "404": "Already unmatched"
}`,
      },
      {
        method: 'POST',
        path: '/v1/reports',
        description: 'Report a user. Always also hides them from future decks.',
        request: `{
  "targetId": "u_184",
  "reason": "spam"
}`,
        response: `{
  "ok": true
}`,
      },
    ],
    dataModel: [
      {
        name: 'profiles',
        primaryKey: ['user_id'],
        columns: [
          { name: 'user_id', type: 'uuid', notes: 'Stable identity' },
          { name: 'name', type: 'text' },
          { name: 'birthdate', type: 'date', notes: 'Age is derived' },
          { name: 'gender', type: 'enum' },
          { name: 'bio', type: 'text' },
          { name: 'active_at', type: 'timestamptz', notes: 'Recency for ranking' },
        ],
        indexes: ['(active_at DESC)'],
      },
      {
        name: 'photos',
        primaryKey: ['photo_id'],
        columns: [
          { name: 'photo_id', type: 'uuid' },
          { name: 'user_id', type: 'uuid' },
          { name: 'object_key', type: 'text', notes: 'S3 key; CDN URL is derived' },
          { name: 'sort_order', type: 'int' },
          { name: 'moderation', type: 'enum', notes: 'pending | clean | rejected' },
        ],
        indexes: ['(user_id, sort_order)'],
      },
      {
        name: 'preferences',
        primaryKey: ['user_id'],
        columns: [
          { name: 'user_id', type: 'uuid' },
          { name: 'want_genders', type: 'enum[]' },
          { name: 'age_min', type: 'int' },
          { name: 'age_max', type: 'int' },
          { name: 'radius_km', type: 'int' },
        ],
      },
      {
        name: 'locations',
        primaryKey: ['user_id'],
        columns: [
          { name: 'user_id', type: 'uuid' },
          { name: 'lat', type: 'float' },
          { name: 'lng', type: 'float' },
          { name: 'geo_cell', type: 'text', notes: 'Geohash or S2 token' },
          { name: 'updated_at', type: 'timestamptz' },
        ],
        indexes: ['(geo_cell, updated_at DESC)'],
        notes: 'Redis GEO is the online index. This table is the source of truth after a restart.',
      },
      {
        name: 'swipes',
        primaryKey: ['from_id', 'to_id'],
        columns: [
          { name: 'from_id', type: 'uuid' },
          { name: 'to_id', type: 'uuid' },
          { name: 'action', type: 'enum', notes: 'like | pass | superlike' },
          { name: 'ts', type: 'timestamptz' },
        ],
        indexes: ['(to_id, action) — reverse-like lookup'],
        notes: 'One row per directed pair. Reverse lookup must be an indexed read, not a scan.',
      },
      {
        name: 'matches',
        primaryKey: ['match_id'],
        columns: [
          { name: 'match_id', type: 'uuid' },
          { name: 'user_min', type: 'uuid', notes: 'Canonical pair order' },
          { name: 'user_max', type: 'uuid' },
          { name: 'created_at', type: 'timestamptz' },
        ],
        indexes: ['UNIQUE (user_min, user_max)'],
        notes: 'The unique pair is the compare-and-set key. Never store unordered (a, b) and (b, a).',
      },
      {
        name: 'conversations',
        primaryKey: ['match_id'],
        columns: [
          { name: 'match_id', type: 'uuid' },
          { name: 'last_message_at', type: 'timestamptz' },
          { name: 'closed_at', type: 'timestamptz', notes: 'Set on unmatch' },
        ],
      },
      {
        name: 'messages',
        primaryKey: ['message_id'],
        columns: [
          { name: 'message_id', type: 'uuid' },
          { name: 'match_id', type: 'uuid' },
          { name: 'from_id', type: 'uuid' },
          { name: 'body', type: 'text' },
          { name: 'ts', type: 'timestamptz' },
        ],
        indexes: ['(match_id, ts DESC)'],
      },
      {
        name: 'blocks',
        primaryKey: ['from_id', 'to_id'],
        columns: [
          { name: 'from_id', type: 'uuid' },
          { name: 'to_id', type: 'uuid' },
          { name: 'reason', type: 'enum', notes: 'block | unmatch | report' },
          { name: 'ts', type: 'timestamptz' },
        ],
        notes: 'Unioned into the seen-set so blocked people never re-enter the deck.',
      },
      {
        name: 'reports',
        primaryKey: ['report_id'],
        columns: [
          { name: 'report_id', type: 'uuid' },
          { name: 'from_id', type: 'uuid' },
          { name: 'to_id', type: 'uuid' },
          { name: 'reason', type: 'text' },
          { name: 'ts', type: 'timestamptz' },
        ],
      },
    ],
    architecture:
      'Clients talk to an API gateway. Recs reads a geo index and a seen-set, then a ranker, then the photo CDN. Swipe/Match owns likes and the atomic match write. Chat is a small 1:1 service. Notify consumes match events. Redis holds last-active, GEO membership, and seen-sets. Postgres is the source of truth. Kafka carries swipe and match events off the ACK path.',
    diagram: `flowchart TB
    App --> Gateway[API Gateway]
    Gateway --> Recs
    Gateway --> Swipe[Swipe service]
    Gateway --> Chat
    Recs --> Geo[(Geo index)]
    Recs --> Seen[(Seen / swipe sets)]
    Recs --> Ranker
    Recs --> CDN[(Photo CDN)]
    Swipe --> Likes[(Likes)]
    Swipe --> Match{Reverse like?}
    Match -->|yes| Conv[(Conversation)]
    Match --> Notify
    Notify --> Push[APNs / FCM]`,
    diagrams: [
      {
        id: 'architecture-poster',
        title: 'End-to-end architecture',
        kind: 'excalidraw',
        src: 'tinder-architecture',
      },
      {
        id: 'marketplace',
        title: 'Two-sided marketplace of attention',
        kind: 'mermaid',
        src: MARKETPLACE_DIAGRAM,
      },
      {
        id: 'er',
        title: 'Entity relationships',
        kind: 'mermaid',
        src: ER_DIAGRAM,
      },
      {
        id: 'scaling',
        title: 'Scaling roadmap',
        kind: 'mermaid',
        src: SCALING_DIAGRAM,
      },
      {
        id: 'hot-cell',
        title: 'Festival spike on one cell',
        kind: 'animation',
        src: 'hot-cell',
      },
    ],
    deepDives: [
      {
        title: 'Geohash neighbors — a cell is not a radius',
        body: 'A geohash (or S2) cell is a square. People just across the boundary are invisible if you query only the home cell. Recs reads the home cell plus its eight neighbors, then drops anyone outside the exact kilometre radius with a cheap haversine. S2 is the same idea with better polar behavior. When a user moves, remove them from the old cell and insert them into the new one — do not leave stale membership.',
        animation: 'geohash',
      },
      {
        title: 'Seen-set',
        body: 'The deck is wrong if it reshuffles the same faces. Keep a Redis SET of swiped and blocked IDs per user, cap it, and snapshot to SQL. A Bloom filter can hide people you have not seen (false positive = skipped candidate). That is acceptable if you rebuild periodically. False negatives — showing someone again — are the failure the interviewer will punish.',
      },
      {
        title: 'Ranking is not a beauty contest',
        body: 'If you rank only by attractiveness or inbound-like rate, a few faces absorb all attention and inventory dies. Mix recency (active_at), mutual preference fit, and a fairness injection so newer or less-seen profiles still appear. Keep the ranker a sidecar. Geo candidate generation stays mandatory even if you later add embeddings.',
      },
      {
        title: 'Match atomicity',
        body: 'Two likes can land in the same millisecond. Store the match under a canonical pair (user_min, user_max) and create it with a unique constraint or compare-and-set. The swipe ACK can return matched=true only after that write succeeds. Creating the conversation in the same transaction (or an idempotent outbox) prevents two chats for one pair.',
        animation: 'swipe-match',
        diagram: SWIPE_SEQUENCE,
      },
      {
        title: 'Photo CDN and moderation',
        body: 'Uploads go to object storage. The recs path never streams bytes — it returns signed or CDN URLs. Run moderation asynchronously; a pending photo can sit behind a placeholder. A rejected photo must drop out of hydration even if the profile row still exists.',
      },
      {
        title: 'Chat is smaller than WhatsApp',
        body: 'There is no group chat, no 1:N fan-out, and no status protocol to design. One conversation per match, cursor-paginated history, websocket if online, push if not. Unmatch closes the conversation. If you start drawing Kafka partitions for chat, you have left the problem.',
      },
      {
        title: 'Abuse: rate limits, devices, like-bombs',
        body: 'Cap likes per hour and superlikes per day. Bind suspicious velocity to device and payment signals, not just user_id — otherwise a bot farm rotates accounts. A like-bomb that writes millions of likes still has to hit the reverse-like path; isolate that read and keep it an indexed point lookup.',
      },
      {
        title: 'Hot downtown cells',
        body: 'Global QPS is the wrong bottleneck story. One festival geohash can hold 50k actives. Split hot cells into finer children, cache a precomputed top-N per subcell, and never let Recs scan the raw set on the request path.',
        animation: 'hot-cell',
      },
    ],
    tradeoffs: [
      'Rank by popularity and the app becomes a beauty contest; inject activity and inventory fairness.',
      'Larger radius: more candidates, worse locality, and a heavier seen-set subtraction.',
      'Bloom filters save memory but can hide valid people. Rebuild on a schedule.',
      'Strong consistency on match creation vs eventual notify. The row must be unique; the push can be late.',
      'City shards keep recs fast and make travel / Passport a cross-shard problem.',
    ],
    bottlenecks: [
      'Hot downtown or festival geo cells',
      'Swipe write QPS and reverse-like lookups',
      'Seen-set size for power users',
      'Bots and like-bombs',
      'Photo upload and moderation backlog',
    ],
    scalingPath: [
      { scale: '1K', focus: 'PostGIS radius query plus SQL likes. One Postgres is enough.' },
      { scale: '1M', focus: 'Geohash or S2 in Redis, Redis seen-sets, a dedicated match service, CDN for photos.' },
      { scale: '100M', focus: 'City shards, a dedicated ranker, precomputed hot-cell top-N, and an abuse / ML lane.' },
    ],
    interviewScript: [
      '“I will lock scope: deck, swipe, atomic match, then a small chat. Not WhatsApp.”',
      '“Candidates come from geo cells plus neighbors, not a table scan. Then I subtract seen and rank.”',
      '“A match is an atomic check of the reverse like, then one conversation row keyed by (user_min, user_max).”',
      '“Notify is async. The swipe ACK does not wait on APNs.”',
      '“The scary scale is a hot cell, not the global DAU number.”',
    ],
    commonMistakes: [
      'No seen-set — the deck repeats the same 20 faces',
      'Chat architecture bigger than WhatsApp',
      'Querying a single geohash cell and calling it a radius',
      'Creating two conversations when likes race',
      'No rate limits, so bots starve the marketplace',
      'Ranking only on attractiveness',
    ],
    relatedTopics: ['realtime', 'reliability', 'embedding-matching'],
    examples: ['Tinder', 'Bumble', 'Hinge'],
    practicePrompt:
      'Keep deck latency under 100ms when a festival dumps 50k actives into one geohash. Say what you precompute, what you shard, and what you refuse to do on the request path.',
    followUps: [
      {
        question: 'A festival dumps 50k actives into one cell. How do you keep deck p99 under 100ms?',
        category: 'scale',
        difficulty: 'hard',
        answer:
          'Stop treating the cell as a single Redis key you scan. Split it into finer S2 children, keep a short-TTL precomputed top-N per subcell, and have Recs union a handful of those lists. Subtract seen from the already-ranked lists, not from 50k raw IDs. Spill overflow to neighbor cells only after the local top-N is exhausted. The request path never does a live popularity sort over the whole festival.',
      },
      {
        question: 'How do you implement Superlike without turning it into an unbounded write amp?',
        category: 'matching',
        difficulty: 'medium',
        answer:
          'Superlike is a scarce counter (daily quota in Redis) plus a normal swipe row with action=superlike. The reverse-like path is unchanged. You can surface superlikes in a priority lane of the other person’s deck, but that is a ranker input, not a second match protocol. Quota lives on the swipe service so a client cannot mint extras.',
      },
      {
        question: 'After an unmatch, should the same person ever reappear in the deck?',
        category: 'matching',
        difficulty: 'medium',
        answer:
          'Default no. Unmatch writes a blocks-style row (reason=unmatch) and adds the peer to both seen-sets. If the product later wants “maybe later,” that is an explicit, time-boxed expiry — not an accidental Bloom false negative. Say the policy out loud so the interviewer knows you thought about it.',
      },
      {
        question: 'The gender ratio is skewed and a few profiles get like-bombed. What do you change?',
        category: 'ranking',
        difficulty: 'hard',
        answer:
          'Cap outbound likes per hour. Down-rank or queue inbound likes so a celebrity profile is not a hot key. Inject inventory of less-seen profiles into the deck. On the write path, the reverse-like lookup must stay an indexed point get — never “select * likes where to_id = celebrity.” Consider a separate inbound-like store for famous accounts.',
      },
      {
        question: 'How would you ship “who liked you” without leaking that information for free?',
        category: 'privacy',
        difficulty: 'medium',
        answer:
          'Store inbound likes, but the free client only gets a count or blurred tiles. The paid client reads a gated endpoint that lists liker IDs. Do not put liker identity in the generic recs payload. Cache the paid list carefully — a cache bug is a privacy bug. This is also why match creation still requires the second like even if someone paid to peek.',
      },
      {
        question: 'Walk through a GDPR delete across Redis, SQL, photos, and chat.',
        category: 'privacy',
        difficulty: 'hard',
        answer:
          'A delete request enqueues a workflow: remove GEO membership and seen keys, tombstone the profile, delete swipe and match rows (or anonymize the peer side), close conversations, delete messages, delete S3 objects, and purge CDN. Recs must treat a missing profile as a hydrate miss. Give the interviewer a timeline (minutes for keys, hours for object storage) rather than “we DELETE FROM users.”',
      },
      {
        question: 'Passport / travel mode — the user wants a deck in another city.',
        category: 'geo',
        difficulty: 'medium',
        answer:
          'Location is a first-class input to Recs, not a hidden cookie. Passport writes a temporary view-cell distinct from the physical phone location. Recs runs the same neighbor query against the destination city’s shard. If you city-sharded, this is a cross-shard read — fan out to that city’s recs replica, do not pull every traveler into the home shard. Clear the view-cell when they leave the mode.',
      },
      {
        question: 'How do you stop swipe replay / fraud (client resends an old like)?',
        category: 'abuse',
        difficulty: 'medium',
        answer:
          'Swipes are idempotent on (from_id, to_id). A replay is a no-op, not a second match attempt. Authenticate the user, rate-limit, and optionally sign a short-lived recs card token so you cannot like someone who was never served. Device signals catch farms that rotate accounts but share hardware.',
      },
      {
        question: 'When do you add two-tower embeddings on top of this design?',
        category: 'ranking',
        difficulty: 'hard',
        answer:
          'After geo candidate generation already works. Embeddings rerank a few hundred nearby IDs; they do not replace the geo index. Train offline, load a ranker sidecar, A/B against the activity/fairness baseline. The classic Tinder lesson stops at geo + seen + fairness; the AI follow-on is embedding-matching.',
      },
      {
        question: 'What happens if Redis loses the seen-set?',
        category: 'geo',
        difficulty: 'medium',
        answer:
          'SQL swipes and blocks are the source of truth. On miss, rebuild the Redis SET from those tables (capped to recent N) and optionally a Bloom. Serve a slightly stale deck rather than an empty one, and never “start over” from zero — that is how you reshuffle the same faces after a cache flush.',
      },
      {
        question: 'Why not put everyone in one Postgres table and SELECT ... WHERE ST_DWithin?',
        category: 'geo',
        difficulty: 'easy',
        answer:
          'It works at 1K users. At city scale the query fans over too many rows, you still have to subtract seen, and a festival locks the page. PostGIS is a fine v1, then you move membership to a geo index and keep Postgres for profiles and likes.',
      },
    ],
  }),
};
