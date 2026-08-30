import { ArchitectureTopic, emptyContent } from './systemDesignTypes';

export const classicFundamentals: ArchitectureTopic[] = [
  {
    id: 'interview-approach',
    title: 'How to Approach a System Design Interview',
    description: 'A repeatable 45-minute method: clarify, estimate, design boring-first, then scale and trade off out loud.',
    difficulty: 'Beginner',
    progress: 0,
    icon: 'Target',
    color: 'bg-slate-600',
    section: 'fundamentals',
    track: 'classic',
    prerequisites: [],
    estimatedMinutes: 25,
    order: 0,
    content: emptyContent({
      overview: 'Most weak interviews fail on process, not knowledge. Interviewers want to see how you scope, estimate, and evolve a design under time pressure.',
      whyItExists: 'Without a method you jump into boxes, miss requirements, and run out of time before the hard parts.',
      whenToUse: [
        'Any open-ended design: “Design X”',
        'When the interviewer is quiet — narrate the framework',
        'When you feel the urge to start drawing immediately',
      ],
      functionalRequirements: [
        { title: 'Clarify users', detail: 'Who uses it, what they do, what is explicitly out of scope.' },
        { title: 'Write APIs last', detail: 'Requirements and scale first, endpoints after the data model is obvious.' },
      ],
      nonFunctionalRequirements: [
        { title: 'Latency', detail: 'p50 vs p99, read vs write path.' },
        { title: 'Consistency', detail: 'Read-your-writes? Global? Eventual is fine?' },
        { title: 'Availability', detail: 'Can it be down for writes if reads stay up?' },
      ],
      estimates: [
        { label: 'Time budget', value: '45 min', note: '5 clarify, 5 estimate, 15 high-level, 15 deep dive, 5 evolution' },
        { label: 'DAU shortcut', value: '1M DAU ≈ 10-20 QPS average', note: 'Peak is often 5-10x average' },
      ],
      concepts: [
        'Functional vs non-functional requirements',
        'Back-of-envelope estimation',
        'Boring correct design first',
        'Deep dive on the bottleneck',
        'v1 vs v2 evolution',
      ],
      walkthrough: [
        { title: 'Restate the problem', description: 'One sentence plus 4-6 functional bullets. Ask what to cut.' },
        { title: 'Estimate before boxes', description: 'QPS, storage, bandwidth, fan-out. Numbers justify caches and shards.' },
        { title: 'Draw v1', description: 'Client, API, one DB, object store if needed. It should work for 10k users.' },
        { title: 'Scale the hot path', description: 'Add cache, queue, shard, CDN only where the numbers demand it.' },
        { title: 'Close with failure', description: 'What dies first, how you degrade, what you would build next quarter.' },
      ],
      steps: [
        { title: 'Clarify', description: 'Users, core flows, out of scope, SLOs.' },
        { title: 'Estimate', description: 'QPS, storage, payload size, peak multiplier.' },
        { title: 'High-level design', description: 'Request path with numbered steps.' },
        { title: 'Deep dive', description: 'Pick 2-3 hard parts, not every box.' },
        { title: 'Evolve', description: '1K → 1M → 100M and the first bottleneck.' },
      ],
      architecture: 'Treat the interview as a conversation around a single request path, not a catalog of technologies.',
      diagram: `flowchart LR
    Clarify --> Estimate
    Estimate --> V1[Boring v1]
    V1 --> Scale[Scale hot path]
    Scale --> Close[Failures and tradeoffs]`,
      tradeoffs: [
        'Depth beats breadth: two excellent deep dives beat eight labeled boxes.',
        'Say “I would start with Postgres” and explain when you would leave it.',
      ],
      bottlenecks: [
        'Running out of time because you designed every microservice.',
        'Never stating numbers, so caches look like decoration.',
      ],
      scalingPath: [
        { scale: 'Interview minute 0-10', focus: 'Scope and math' },
        { scale: 'Minute 10-25', focus: 'End-to-end v1' },
        { scale: 'Minute 25-45', focus: 'One hard problem and evolution' },
      ],
      interviewScript: [
        '“Let me restate the core use cases and confirm what is out of scope.”',
        '“I will estimate QPS and storage so we know whether we need shards on day one.”',
        '“Here is a simple design that works. The first thing that breaks is X, so I would add Y.”',
      ],
      commonMistakes: [
        'Jumping to Kafka and Kubernetes before requirements.',
        'Ignoring write path vs read path.',
        'Never asking about consistency.',
      ],
      relatedTopics: ['databases', 'caching', 'load-balancer'],
      examples: ['Design Twitter', 'Design Uber', 'Design a URL shortener'],
      practicePrompt: 'Time-box 10 minutes: design a URL shortener out loud using only this framework.',
    }),
  },
  {
    id: 'databases',
    title: 'Databases',
    description: 'Choose, model, replicate, and shard storage. The longest fundamental and the one that shows up in every product design.',
    difficulty: 'Intermediate',
    progress: 0,
    icon: 'Database',
    color: 'bg-emerald-600',
    section: 'fundamentals',
    track: 'classic',
    prerequisites: ['interview-approach'],
    estimatedMinutes: 45,
    order: 1,
    content: emptyContent({
      overview: 'A database is not “Postgres or Cassandra.” It is a set of access patterns, consistency needs, and growth constraints. Interviews are won by matching those, not by listing products.',
      whyItExists: 'Application memory dies, files do not query well, and a single disk cannot hold or serve a social graph at scale.',
      whenToUse: [
        'Any durable state: users, bookings, messages, inventory',
        'When the interviewer asks “where does this live?”',
        'When you need transactions, search, or time-series — possibly different stores',
      ],
      functionalRequirements: [
        { title: 'CRUD and queries', detail: 'Primary key lookups, range scans, secondary filters.' },
        { title: 'Transactions', detail: 'Do two writes need to succeed or fail together?' },
        { title: 'Analytics vs OLTP', detail: 'Do not force a warehouse workload onto the primary.' },
      ],
      nonFunctionalRequirements: [
        { title: 'Consistency', detail: 'Read-your-writes, linearizability, or eventual.' },
        { title: 'Availability', detail: 'Can a replica lag? Can a region fail?' },
        { title: 'Growth', detail: 'Data size and QPS in year 1 vs year 5.' },
      ],
      estimates: [
        { label: 'Row size heuristic', value: '1-4 KB typical OLTP row' },
        { label: '1B rows', value: '1-4 TB plus indexes', note: 'Indexes can double storage' },
        { label: 'Single primary writes', value: '~1-10k simple writes/s', note: 'Depends on SSD, WAL, and payload' },
      ],
      concepts: [
        'OLTP vs OLAP, row vs column',
        'SQL, document, KV, wide-column, graph, search, time-series',
        'ACID and isolation levels',
        'CAP and PACELC',
        'Leader-follower, multi-leader, leaderless replication',
        'Hash, range, geo, and directory sharding',
        'B-tree vs LSM indexes',
        'Sagas and transactional outbox',
      ],
      walkthrough: [
        { title: 'Name the access patterns', description: 'Get-by-id, list-by-user, search, time range. These pick the store.' },
        { title: 'Pick a source of truth', description: 'Usually a relational primary until a pattern forces another engine.' },
        { title: 'Add replicas for reads', description: 'Async replicas if the product can tolerate lag.' },
        { title: 'Shard only when needed', description: 'Shard key must spread writes and keep related reads together.' },
      ],
      steps: [
        { title: 'Start with one primary', description: 'Postgres/MySQL covers most v1 products.' },
        { title: 'Add read replicas', description: 'When read QPS or reporting hurts the primary.' },
        { title: 'Cache hot keys', description: 'Do not shard only because a profile page is hot.' },
        { title: 'Shard or move a workload', description: 'Split search, feeds, or time-series into purpose-built stores.' },
      ],
      dataModel: [
        { name: 'users', columns: ['id PK', 'email UNIQUE', 'name', 'created_at'], notes: 'High read, low write. Extremely cacheable.' },
        { name: 'follows', columns: ['follower_id', 'followee_id', 'created_at'], notes: 'Composite PK. Shard by follower_id for “who I follow”.' },
      ],
      architecture: 'OLTP primary for correctness, replicas for read scale, specialized stores for search/graph/time-series, cache in front of hot keys.',
      diagram: `flowchart TB
    App --> Primary[(Primary OLTP)]
    App --> Replica[(Read replicas)]
    Primary --> Replica
    App --> Search[(Search index)]
    App --> Cache[(Cache)]
    Primary --> CDC[CDC / outbox]
    CDC --> Search`,
      deepDives: [
        {
          title: 'Choosing a shard key',
          body: 'A good shard key spreads writes and keeps a request on one shard. user_id is common. Sharding a feed by created_at creates a hot “today” shard. Celebrity user_id still hotspots — isolate those keys.',
        },
        {
          title: 'Unique constraints after sharding',
          body: 'GLOBAL UNIQUE email is easy on one primary and hard across shards. Use a dedicated lookup service, an email hash shard, or accept a two-phase reservation.',
        },
        {
          title: 'Postgres vs Cassandra vs Dynamo vs Elastic',
          body: 'Postgres: transactions and relational integrity. Cassandra/Dynamo: huge write throughput and predictable key access. Elastic: inverted index search, not a source of truth. Redis: hot state, not system of record.',
        },
      ],
      tradeoffs: [
        'Sync replication: safer writes, higher write latency and availability risk.',
        'Multi-leader: write-anywhere, conflict resolution pain.',
        'More engines: better fit, more operational load.',
      ],
      bottlenecks: [
        'Hot shard or hot row (counters, celebrity profiles).',
        'Cross-shard joins and secondary indexes.',
        'Migrations that lock large tables.',
      ],
      scalingPath: [
        { scale: '1K users', focus: 'Single Postgres, good indexes' },
        { scale: '1M users', focus: 'Replicas, connection pooling, cache' },
        { scale: '100M users', focus: 'Sharding or workload-specific stores' },
      ],
      interviewScript: [
        '“I will start with Postgres because bookings need transactions.”',
        '“Reads dominate, so replicas plus cache. I will not shard until write QPS or size forces it.”',
        '“Search is a derived index, not the source of truth.”',
      ],
      commonMistakes: [
        'Sharding on day one.',
        'Using Elastic as the booking database.',
        'Forgetting that secondary indexes do not automatically survive sharding.',
      ],
      relatedTopics: ['caching', 'unique-ids', 'search-feeds', 'message-queues'],
      examples: ['Airbnb bookings in SQL', 'Instagram counters in a separate store', 'LinkedIn graph as follow tables'],
      practicePrompt: 'Pick a shard key for “list all bookings for a host in a date range” and explain why created_at is wrong.',
    }),
  },
  {
    id: 'caching',
    title: 'Caching',
    description: 'Put the hottest data closer to the request. Learn patterns, invalidation, and the failures caches introduce.',
    difficulty: 'Intermediate',
    progress: 0,
    icon: 'Zap',
    color: 'bg-purple-600',
    section: 'fundamentals',
    track: 'classic',
    prerequisites: ['databases'],
    estimatedMinutes: 30,
    order: 2,
    content: emptyContent({
      overview: 'A cache is a performance optimization with consistency consequences. Interviews care about what you cache, how it goes stale, and what happens when it stampedes.',
      whyItExists: 'Disk and network are slower than memory. Repeated profile, session, and feed reads should not hit the primary every time.',
      whenToUse: [
        'Read-heavy, slowly changing keys',
        'Expensive queries or remote calls (Skyscanner provider quotes)',
        'Session and rate-limit state',
      ],
      functionalRequirements: [
        { title: 'Get/set/delete by key', detail: 'Plus TTL and bulk invalidation.' },
        { title: 'Optional stampede control', detail: 'Locks or probabilistic early refresh.' },
      ],
      nonFunctionalRequirements: [
        { title: 'Hit latency', detail: 'Sub-millisecond local, 1-3ms Redis in-AZ.' },
        { title: 'Freshness', detail: 'How stale is acceptable?' },
      ],
      estimates: [
        { label: 'Profile cache', value: '1KB × 10M hot users ≈ 10 GB' },
        { label: 'Hit ratio target', value: '90%+ on hot paths' },
      ],
      concepts: [
        'Cache-aside, read-through, write-through, write-behind',
        'Local vs distributed vs edge',
        'TTL, versioned keys, explicit invalidation',
        'Stampede, dogpile, thundering herd',
        'Redis vs Memcached vs process memory',
      ],
      walkthrough: [
        { title: 'Cache-aside read', description: 'App checks Redis, on miss loads DB, then fills cache.' },
        { title: 'Write', description: 'Write DB first, then delete the key (not always update) so the next read rebuilds.' },
        { title: 'Miss storm', description: 'A popular key expire causes many DB reads unless you lock or stagger TTLs.' },
      ],
      steps: [
        { title: 'Identify hot keys', description: 'Profiles, sessions, popular listings, short URLs.' },
        { title: 'Pick a pattern', description: 'Cache-aside is the default interview answer.' },
        { title: 'Define invalidation', description: 'TTL plus delete-on-write for user-visible correctness.' },
        { title: 'Defend the origin', description: 'Singleflight, jittered TTL, stale-while-revalidate.' },
      ],
      architecture: 'Client → API → cache → origin (DB or service). CDN sits in front for public cacheable bytes.',
      diagram: `flowchart LR
    Client --> API
    API --> Cache[(Redis)]
    Cache -->|hit| API
    Cache -->|miss| DB[(Primary)]
    DB --> Cache`,
      deepDives: [
        {
          title: 'What not to cache',
          body: 'Per-user secrets without careful TTL, rapidly changing counters if you need exact values, and unbounded keys (“cache every search string”) that evict useful data.',
        },
        {
          title: 'Write-through vs delete-on-write',
          body: 'Updating the cache on write can race with concurrent writers. Deleting the key is simpler and usually safer.',
        },
      ],
      tradeoffs: [
        'More cache layers: faster reads, harder invalidation.',
        'Long TTL: better hit rate, worse freshness.',
      ],
      bottlenecks: [
        'Cache as a single Redis instance becomes the new SPOF.',
        'Hot key on one Redis shard.',
      ],
      scalingPath: [
        { scale: 'Small', focus: 'One Redis, cache-aside' },
        { scale: 'Medium', focus: 'Redis cluster, local hot cache' },
        { scale: 'Large', focus: 'Key isolation, request coalescing, CDN' },
      ],
      interviewScript: [
        '“I will cache listings by id with a 5-minute TTL and delete on host edit.”',
        '“Viral keys get a local in-process cache in front of Redis.”',
      ],
      commonMistakes: [
        'Caching without an invalidation story.',
        'Using the cache as the source of truth.',
      ],
      relatedTopics: ['cdn', 'databases', 'load-balancer'],
      examples: ['LinkedIn profile cache', 'URL shortener redirect cache', 'Skyscanner route quote cache'],
      practicePrompt: 'Design invalidation for an Airbnb listing that appears in search, detail, and map tiles.',
    }),
  },
  {
    id: 'load-balancer',
    title: 'Load Balancers',
    description: 'Spread traffic, hide dead nodes, terminate TLS, and fail across zones without sticky-session traps.',
    difficulty: 'Intermediate',
    progress: 0,
    icon: 'Scale',
    color: 'bg-blue-600',
    section: 'fundamentals',
    track: 'classic',
    prerequisites: ['interview-approach'],
    estimatedMinutes: 30,
    order: 3,
    content: emptyContent({
      overview: 'A load balancer is the front door. It chooses a healthy backend, optionally terminates TLS, and is itself made redundant with DNS or anycast.',
      whyItExists: 'One server dies, one server overflows, and clients should not know how many copies you run.',
      whenToUse: [
        'More than one stateless app replica',
        'TLS termination and HTTP routing',
        'Blue/green or canary traffic shifting',
      ],
      functionalRequirements: [
        { title: 'Route to healthy backends', detail: 'Active health checks and connection draining.' },
        { title: 'Optional stickiness', detail: 'Only if you cannot make the app stateless.' },
      ],
      nonFunctionalRequirements: [
        { title: 'No single LB', detail: 'Pair, anycast, or cloud managed LB.' },
        { title: 'Latency', detail: 'L4 is cheaper; L7 can inspect paths and headers.' },
      ],
      estimates: [
        { label: 'Connections', value: 'A modern LB handles 100k-1M+ concurrent connections' },
      ],
      concepts: [
        'L4 vs L7',
        'Round robin, least connections, IP hash, weighted, consistent hashing',
        'Health checks and drain',
        'SSL termination, HTTP/2, gRPC',
        'DNS LB vs anycast vs software LB',
      ],
      walkthrough: [
        { title: 'DNS to LB VIP', description: 'Client resolves a name to an anycast or regional VIP.' },
        { title: 'Health-aware pick', description: 'LB skips failing targets and drains ones you are deploying.' },
        { title: 'Forward and return', description: 'Backend sees X-Forwarded-For; response returns through the LB.' },
      ],
      steps: [
        { title: 'Make app replicas stateless', description: 'Sessions in Redis, not process memory.' },
        { title: 'Put an L7 LB in front', description: 'Path routing, TLS, timeouts.' },
        { title: 'Multi-AZ', description: 'Backends and LBs in at least two zones.' },
      ],
      architecture: 'DNS/anycast → regional L7 LB → autoscaled stateless services. WebSocket/gRPC need longer timeouts and sometimes consistent hashing.',
      diagram: `flowchart LR
    User --> DNS
    DNS --> LB[L7 Load Balancer]
    LB --> A[App A]
    LB --> B[App B]
    LB --> C[App C]`,
      deepDives: [
        {
          title: 'Sticky sessions are a smell',
          body: 'IP hash or cookie stickiness fights deployments and uneven load. Prefer external session stores. Use consistent hashing for stateful streams (chat gateways), not for ordinary HTTP.',
        },
      ],
      tradeoffs: [
        'L7 insight vs L4 raw throughput.',
        'Client-side retries plus LB retries can amplify load.',
      ],
      bottlenecks: [
        'LB as chokepoint if not scaled or multi-AZ.',
        'Health checks that are too shallow (process up, DB down).',
      ],
      scalingPath: [
        { scale: '1 AZ', focus: 'Managed LB + 2 replicas' },
        { scale: 'Multi-AZ', focus: 'Cross-zone, connection draining' },
        { scale: 'Multi-region', focus: 'DNS failover or anycast' },
      ],
      interviewScript: [
        '“Stateless app nodes behind an L7 LB. Sessions in Redis so we do not need stickiness.”',
      ],
      commonMistakes: [
        'Drawing one LB box with no redundancy.',
        'Relying on sticky sessions for a feed or booking API.',
      ],
      relatedTopics: ['cdn', 'api-gateway', 'realtime'],
      examples: ['AWS ALB', 'NGINX/Envoy', 'Cloudflare anycast'],
    }),
  },
  {
    id: 'cdn',
    title: 'CDN and Edge',
    description: 'Push static and cacheable bytes to points of presence. Know cache keys, purge, and when the edge cannot help.',
    difficulty: 'Intermediate',
    progress: 0,
    icon: 'Globe',
    color: 'bg-sky-600',
    section: 'fundamentals',
    track: 'classic',
    prerequisites: ['caching', 'load-balancer'],
    estimatedMinutes: 25,
    order: 4,
    content: emptyContent({
      overview: 'A CDN is a geographically distributed cache in front of your origin. It wins for images, video segments, JS/CSS, and some public API GETs.',
      whyItExists: 'Users are far from your region. Origin bandwidth is expensive. Popular videos should not all hit one cluster.',
      whenToUse: [
        'Images, video, downloadable assets',
        'Public, cacheable API responses',
        'DDoS and bot filtering at the edge',
      ],
      functionalRequirements: [
        { title: 'Cache and serve from POP', detail: 'On miss, fetch origin, then store.' },
        { title: 'Purge / variant keys', detail: 'Query strings, cookies, and auth change cacheability.' },
      ],
      nonFunctionalRequirements: [
        { title: 'TTFB near the user', detail: 'Tens of milliseconds from a nearby POP.' },
        { title: 'Origin shield', detail: 'Collapse worldwide misses onto one shield POP.' },
      ],
      estimates: [
        { label: 'YouTube-like video', value: 'Most bytes never touch origin if hit rate is high' },
      ],
      concepts: [
        'Origin, POP, anycast, cache key',
        'Cache-Control, ETag, stale-if-error, purge',
        'Static vs dynamic acceleration',
        'Signed URLs and token auth',
      ],
      walkthrough: [
        { title: 'Browser requests image', description: 'DNS anycast lands on nearest POP.' },
        { title: 'Hit or miss', description: 'Hit returns immediately. Miss fetches origin, caches, returns.' },
        { title: 'Invalidate', description: 'Version the filename (image_v3.jpg) or purge by URL.' },
      ],
      steps: [
        { title: 'Put object storage behind a CDN', description: 'S3/GCS + CloudFront/Fastly/Cloudflare.' },
        { title: 'Version assets', description: 'Content-hashed filenames beat emergency purges.' },
        { title: 'Decide API cacheability', description: 'Only public GETs with stable keys.' },
      ],
      architecture: 'User → anycast POP → (optional origin shield) → origin / object store.',
      diagram: `flowchart LR
    User --> POP[Nearest POP]
    POP -->|hit| User
    POP -->|miss| Origin[Origin / Object store]
    Origin --> POP`,
      deepDives: [
        {
          title: 'When a CDN does not help',
          body: 'Personalized HTML, authenticated feeds, and write-heavy APIs. Caching those either leaks data or misses constantly.',
        },
      ],
      tradeoffs: [
        'Long edge TTL vs stale content.',
        'Cookie-based cache keys explode cardinality.',
      ],
      bottlenecks: [
        'Origin stampedes on a cold popular object.',
        'Mis-set Cache-Control: private on public images.',
      ],
      scalingPath: [
        { scale: 'v1', focus: 'CDN in front of object storage' },
        { scale: 'v2', focus: 'Origin shield, image variants at edge' },
      ],
      interviewScript: [
        '“Media never goes through the app. Signed PUT to object storage, public GET via CDN.”',
      ],
      commonMistakes: [
        'Streaming video through the API servers.',
        'Forgetting cache keys include query strings.',
      ],
      relatedTopics: ['storage-media', 'caching', 'youtube'],
      examples: ['Instagram photos', 'YouTube segments', 'Airbnb listing images'],
    }),
  },
  {
    id: 'api-gateway',
    title: 'API Design and API Gateway',
    description: 'One public entry: routing, auth, rate limits, timeouts, and clean HTTP/gRPC contracts.',
    difficulty: 'Intermediate',
    progress: 0,
    icon: 'Router',
    color: 'bg-amber-500',
    section: 'fundamentals',
    track: 'classic',
    prerequisites: ['load-balancer'],
    estimatedMinutes: 30,
    order: 5,
    content: emptyContent({
      overview: 'The gateway is policy. Backends are business logic. Do not hide a monolith behind a gateway and call it microservices.',
      whyItExists: 'Clients should not know every internal service. Cross-cutting auth, limits, and routing belong in one place.',
      whenToUse: [
        'Multiple backends or versions',
        'Public mobile/web clients',
        'Need for a BFF that shapes payloads per client',
      ],
      functionalRequirements: [
        { title: 'Route and compose', detail: 'Path, header, or RPC method to a service.' },
        { title: 'Authenticate', detail: 'JWT/session verification at the edge of the mesh.' },
      ],
      nonFunctionalRequirements: [
        { title: 'Timeouts and retries', detail: 'Retry only idempotent requests.' },
        { title: 'Rate limits', detail: 'Per user, IP, and API key.' },
      ],
      estimates: [
        { label: 'Gateway CPU', value: 'Cheap compared to business services if it stays a proxy' },
      ],
      concepts: [
        'REST vs RPC vs GraphQL vs gRPC',
        'Idempotency keys, pagination, versioning',
        'BFF vs single public gateway',
        'Circuit breaker, bulkhead, hedged requests',
      ],
      walkthrough: [
        { title: 'Client calls /api/v1/trips', description: 'Gateway checks JWT, rate limit, then proxies to trip service.' },
        { title: 'Failure', description: 'If trip service exceeds timeout, return 504 and do not retry POST.' },
      ],
      steps: [
        { title: 'Define public APIs', description: 'Resources, idempotency, pagination.' },
        { title: 'Terminate auth at gateway', description: 'Pass a trusted internal identity header.' },
        { title: 'Set budgets', description: 'Timeouts shorter than the client timeout.' },
      ],
      apis: [
        { method: 'GET', path: '/v1/resources?cursor=', description: 'Paginated list with opaque cursor.' },
        { method: 'POST', path: '/v1/resources', description: 'Create with Idempotency-Key header.' },
      ],
      architecture: 'Client → CDN (optional) → API Gateway → services. Gateway should not own databases.',
      diagram: `flowchart LR
    Client --> GW[API Gateway]
    GW --> Auth
    GW --> Trip[Trip service]
    GW --> Pay[Payment service]`,
      deepDives: [
        {
          title: 'Idempotency',
          body: 'Clients retry. POSTs need an idempotency key stored for 24h so a double tap does not double book.',
        },
      ],
      tradeoffs: [
        'GraphQL flexibility vs cacheability and complexity.',
        'One gateway vs per-client BFF.',
      ],
      bottlenecks: [
        'Gateway that does business logic and becomes a monolith.',
        'Unbounded payload fan-out (N+1 GraphQL).',
      ],
      scalingPath: [
        { scale: 'v1', focus: 'One gateway, three services' },
        { scale: 'v2', focus: 'Per-edge gateways, service mesh for internals' },
      ],
      interviewScript: [
        '“Public REST through a gateway. Writes are idempotent. Internal calls use shorter timeouts than the client.”',
      ],
      commonMistakes: [
        'Retrying non-idempotent POSTs.',
        'No pagination on list endpoints.',
      ],
      relatedTopics: ['load-balancer', 'reliability', 'airbnb'],
      examples: ['This app’s own Fiber gateway', 'Kong/Envoy', 'GraphQL BFF for mobile'],
    }),
  },
  {
    id: 'message-queues',
    title: 'Messaging and Async',
    description: 'Decouple producers from consumers. Queues, logs, delivery semantics, and the outbox pattern.',
    difficulty: 'Intermediate',
    progress: 0,
    icon: 'MessageSquare',
    color: 'bg-indigo-600',
    section: 'fundamentals',
    track: 'classic',
    prerequisites: ['databases'],
    estimatedMinutes: 30,
    order: 6,
    content: emptyContent({
      overview: 'If a user should not wait for email, transcode, or provider fan-out, put that work on a queue or log.',
      whyItExists: 'Synchronous chains amplify latency and failure. Async absorbs spikes and isolates slow workers.',
      whenToUse: [
        'Emails, notifications, transcoding, search index updates',
        'Skyscanner-style fan-out to slow APIs',
        'Event-driven projections',
      ],
      functionalRequirements: [
        { title: 'Publish and consume', detail: 'At-least-once is the honest default.' },
        { title: 'Retry and DLQ', detail: 'Poison messages must not block the queue.' },
      ],
      nonFunctionalRequirements: [
        { title: 'Ordering', detail: 'Per-key ordering needs partitions, not a global queue.' },
        { title: 'Durability', detail: 'Can you lose a message on broker crash?' },
      ],
      estimates: [
        { label: 'Backlog', value: 'If produce is 2x consume, delay grows without bound' },
      ],
      concepts: [
        'Queue vs pub/sub vs log (SQS, Kafka)',
        'At-most-once, at-least-once, exactly-once processing',
        'Consumer groups, partitions, keys',
        'Outbox and CDC',
        'Backpressure',
      ],
      walkthrough: [
        { title: 'API writes DB + outbox', description: 'Same transaction, so events are not lost if Kafka is down.' },
        { title: 'Publisher drains outbox', description: 'Sends to the broker.' },
        { title: 'Consumer is idempotent', description: 'Uses event id to skip duplicates.' },
      ],
      steps: [
        { title: 'Identify async work', description: 'Anything not required for the user response.' },
        { title: 'Make consumers idempotent', description: 'Exactly-once is “at-least-once + idempotency.”' },
        { title: 'Add DLQ and metrics', description: 'Age of oldest message is your SLO.' },
      ],
      architecture: 'Service → outbox → broker → consumer group → side effects (email, index, GPU job).',
      diagram: `flowchart LR
    API --> DB[(DB + outbox)]
    DB --> Pub[Publisher]
    Pub --> Q[Queue / Kafka]
    Q --> W1[Worker]
    Q --> W2[Worker]
    W1 --> DLQ[Dead letter]`,
      deepDives: [
        {
          title: 'Exactly-once is a lie',
          body: 'Brokers and networks duplicate. Design idempotent consumers. Kafka transactions help a closed pipeline, not a payment API side effect.',
        },
      ],
      tradeoffs: [
        'Kafka: replay and ordering, more ops.',
        'SQS: simple and scalable, weaker ordering.',
      ],
      bottlenecks: [
        'Hot partition (all events keyed by one celebrity).',
        'Unbounded retry without backoff.',
      ],
      scalingPath: [
        { scale: 'v1', focus: 'One queue, two workers' },
        { scale: 'v2', focus: 'Partitioned log, consumer groups, DLQ' },
      ],
      interviewScript: [
        '“The HTTP path only commits booking + outbox. Email and search update happen asynchronously and idempotently.”',
      ],
      commonMistakes: [
        'Dual write to DB and queue without outbox.',
        'Assuming message order is global.',
      ],
      relatedTopics: ['databases', 'youtube', 'reliability'],
      examples: ['YouTube transcode jobs', 'Notification fan-out', 'Search index updates'],
    }),
  },
  {
    id: 'unique-ids',
    title: 'Unique IDs, Hashing, and Coordination',
    description: 'Snowflake IDs, consistent hashing, and why clocks lie across regions.',
    difficulty: 'Intermediate',
    progress: 0,
    icon: 'Hash',
    color: 'bg-rose-600',
    section: 'fundamentals',
    track: 'classic',
    prerequisites: ['databases'],
    estimatedMinutes: 25,
    order: 7,
    content: emptyContent({
      overview: 'Distributed systems need IDs that are unique without a single auto-increment primary, and they need a way to map keys to nodes as the cluster changes.',
      whyItExists: 'A central ticket server becomes a hotspot. Random UUIDs shatter B-tree locality. Node lists change.',
      whenToUse: [
        'Sharded databases and URL shorteners',
        'Cache and Kafka partition assignment',
        'Leader election for schedulers',
      ],
      functionalRequirements: [
        { title: 'Uniqueness', detail: 'No collisions in the expected lifetime.' },
        { title: 'Optional sortability', detail: 'Time-ordered IDs help range scans.' },
      ],
      nonFunctionalRequirements: [
        { title: 'No single issuer', detail: 'Or a highly available issuer.' },
        { title: 'Minimal coordination', detail: 'Snowflake-style worker ids beat a global lock.' },
      ],
      estimates: [
        { label: 'Snowflake', value: '41 bits time + worker + sequence', note: 'Millions of IDs/s per worker' },
      ],
      concepts: [
        'UUID, ULID, Snowflake, ticket servers',
        'Consistent hashing and virtual nodes',
        'etcd/ZooKeeper leases',
        'Clock skew',
      ],
      walkthrough: [
        { title: 'Mint ID at write', description: 'API or ID service issues a Snowflake id.' },
        { title: 'Place data', description: 'hash(id) or hash(user_id) → shard / cache node.' },
        { title: 'Rebalance', description: 'Consistent hashing moves only a fraction of keys.' },
      ],
      steps: [
        { title: 'Avoid DB autoincrement as a global id', description: 'It couples you to one primary.' },
        { title: 'Prefer time-sortable ids for feeds', description: 'ULID/Snowflake over UUID v4 for clustered indexes.' },
      ],
      architecture: 'ID service or library in each writer. Coordination store only for membership and locks, not for every insert.',
      diagram: `flowchart LR
    Writer --> Snowflake[Snowflake worker]
    Snowflake --> Shard[(Shard = hash key)]`,
      deepDives: [
        {
          title: 'Do not trust now()',
          body: 'NTP steps clocks. Use IDs and versions, not wall-clock comparisons, for conflict resolution across regions.',
        },
      ],
      tradeoffs: [
        'UUID v4: easy, painful indexes.',
        'Snowflake: needs unique worker ids.',
      ],
      bottlenecks: ['Central ticket DB', 'Hash ring without virtual nodes'],
      scalingPath: [
        { scale: 'v1', focus: 'DB sequences' },
        { scale: 'v2', focus: 'Snowflake + consistent hashing' },
      ],
      interviewScript: [
        '“Short codes are a Snowflake id encoded in base62, not a random string I hope is unique.”',
      ],
      commonMistakes: [
        'Using server time to order events across regions.',
        'Modulo hashing that reshuffles the world when you add a node.',
      ],
      relatedTopics: ['databases', 'url-shortener', 'caching'],
      examples: ['Twitter Snowflake', 'Dynamo consistent hashing', 'URL shortener encodings'],
    }),
  },
  {
    id: 'search-feeds',
    title: 'Search and Feeds',
    description: 'Inverted indexes, ranking vs filtering, and fan-out-on-write vs fan-out-on-read.',
    difficulty: 'Advanced',
    progress: 0,
    icon: 'Search',
    color: 'bg-teal-600',
    section: 'fundamentals',
    track: 'classic',
    prerequisites: ['databases', 'caching', 'message-queues'],
    estimatedMinutes: 35,
    order: 8,
    content: emptyContent({
      overview: 'Search and feeds look similar (a ranked list) and are different systems. Search is query-time retrieval. Feeds are precomputed or hybrid timelines.',
      whyItExists: 'SQL LIKE does not scale. Precomputing every celebrity’s fan-out also does not scale. You need the right pull/push mix.',
      whenToUse: [
        'People/listing/flight search',
        'Home timelines and notifications',
      ],
      functionalRequirements: [
        { title: 'Filter and rank', detail: 'Must-match filters vs soft ranking signals.' },
        { title: 'Freshness', detail: 'Index lag vs feed latency after a post.' },
      ],
      nonFunctionalRequirements: [
        { title: 'p99 search', detail: 'Often 100-300ms including network.' },
        { title: 'Index lag SLO', detail: 'Seconds to minutes after a write.' },
      ],
      estimates: [
        { label: 'Fan-out', value: '1 post × 1M followers = 1M timeline writes' },
      ],
      concepts: [
        'Inverted index',
        'Ranking vs filtering',
        'Fan-out on write vs fan-out on read',
        'Hybrid celebrity path',
      ],
      walkthrough: [
        { title: 'Search', description: 'Write path updates source of truth + async index. Read path queries the index, then hydrates from cache/DB.' },
        { title: 'Feed write', description: 'Normal user: push post id into follower timeline caches. Celebrity: store once, pull at read time.' },
      ],
      steps: [
        { title: 'Never search the OLTP primary', description: 'Use a derived index.' },
        { title: 'Hydrate after retrieve', description: 'Index returns ids; cache/DB returns bodies.' },
        { title: 'Split celebrities', description: 'Hybrid fan-out is the standard interview answer for Twitter/Instagram.' },
      ],
      architecture: 'Write → source of truth → queue → indexer or fan-out workers → Redis/Cassandra timelines or Elastic.',
      diagram: `flowchart TB
    Post --> DB[(Source of truth)]
    Post --> Q[Queue]
    Q --> Index[Search index]
    Q --> Fanout[Fan-out workers]
    Fanout --> TL[(Timeline cache)]
    Read --> Index
    Read --> TL`,
      deepDives: [
        {
          title: 'Hydration',
          body: 'Never store full posts in every follower timeline. Store ids, then batch-get from a post cache. Deleted posts vanish at hydrate time.',
        },
      ],
      tradeoffs: [
        'Fan-out on write: fast reads, brutal celebrity writes.',
        'Fan-out on read: cheap writes, slow/complex reads.',
      ],
      bottlenecks: ['Celebrity fan-out', 'Index mapping explosions', 'Deep pagination'],
      scalingPath: [
        { scale: 'v1', focus: 'SQL + latest-N feed table' },
        { scale: 'v2', focus: 'Elastic + Redis timelines + hybrid celebrities' },
      ],
      interviewScript: [
        '“Search is Elastic. The feed is Redis lists of post ids with a pull path for celebrities.”',
      ],
      commonMistakes: [
        'Storing full HTML in the index.',
        'Fan-out on write for every account.',
      ],
      relatedTopics: ['linkedin', 'news-feed', 'instagram', 'airbnb'],
      examples: ['LinkedIn people search', 'Twitter home timeline', 'Airbnb listing search'],
    }),
  },
  {
    id: 'realtime',
    title: 'Real-time Communication',
    description: 'Polling, SSE, WebSockets, presence, and sticky gateway nodes for chat and live location.',
    difficulty: 'Advanced',
    progress: 0,
    icon: 'Radio',
    color: 'bg-cyan-600',
    section: 'fundamentals',
    track: 'classic',
    prerequisites: ['load-balancer', 'message-queues'],
    estimatedMinutes: 25,
    order: 9,
    content: emptyContent({
      overview: 'Real-time is a connection problem more than a database problem. You need a gateway layer that holds sockets and a pub/sub fabric to reach them.',
      whyItExists: 'Chat, typing, driver location, and match notifications cannot wait for the next page load.',
      whenToUse: [
        'Messaging, presence, live maps, collaborative editors',
      ],
      functionalRequirements: [
        { title: 'Push events to devices', detail: 'Online immediately, offline via push/inbox.' },
        { title: 'Presence optional', detail: 'Expensive if naively heartbeated.', },
      ],
      nonFunctionalRequirements: [
        { title: 'Connection count', detail: 'Millions of idle sockets need specialized gateways.' },
        { title: 'Delivery', detail: 'At-least-once plus client seq numbers.' },
      ],
      estimates: [
        { label: '1M online users', value: '1M sockets across a gateway fleet' },
      ],
      concepts: [
        'Short poll, long poll, SSE, WebSocket',
        'Presence and receipts',
        'Sticky gateway + pub/sub',
      ],
      walkthrough: [
        { title: 'Connect', description: 'Client upgrades to WebSocket on a gateway; registry maps user → gateway.' },
        { title: 'Publish', description: 'Chat service publishes to a channel; the gateway that owns the socket writes the frame.' },
      ],
      steps: [
        { title: 'Start with SSE or poll if rare events', description: 'Do not jump to sockets for a booking confirmation.' },
        { title: 'Add a gateway tier for chat', description: 'Separate from the REST API fleet.' },
      ],
      architecture: 'Device → WebSocket gateway → Redis/NATS pubsub → chat service → durable inbox.',
      diagram: `flowchart LR
    Phone --> GW[WS Gateway]
    GW --> Sub[Pub/Sub]
    Chat[Chat service] --> Sub
    Chat --> Inbox[(Offline inbox)]`,
      deepDives: [
        {
          title: 'Sticky vs registry',
          body: 'Either stick a user to a gateway or keep a lookup of which gateway holds the socket. Both need cleanup on disconnect.',
        },
      ],
      tradeoffs: [
        'Sockets: low latency, operational cost.',
        'Push notifications: battery-friendly, not interactive.',
      ],
      bottlenecks: ['Gateway memory', 'Broadcast to large groups'],
      scalingPath: [
        { scale: 'v1', focus: 'SSE on the API' },
        { scale: 'v2', focus: 'Dedicated WS fleet + pub/sub' },
      ],
      interviewScript: [
        '“REST for history. WebSocket gateways for live messages. Offline devices get a durable inbox plus push.”',
      ],
      commonMistakes: [
        'Storing chat history only in memory on the socket node.',
        'Using HTTP request nodes to hold millions of sockets.',
      ],
      relatedTopics: ['whatsapp', 'tinder', 'uber', 'load-balancer'],
      examples: ['WhatsApp', 'Uber driver location', 'Tinder match ping'],
    }),
  },
  {
    id: 'reliability',
    title: 'Reliability, Observability, and Security',
    description: 'SLOs, rate limits, retries, idempotency, traces, and the abuse cases interviewers expect.',
    difficulty: 'Intermediate',
    progress: 0,
    icon: 'Shield',
    color: 'bg-red-600',
    section: 'fundamentals',
    track: 'classic',
    prerequisites: ['api-gateway', 'message-queues'],
    estimatedMinutes: 30,
    order: 10,
    content: emptyContent({
      overview: 'A design that cannot be operated or abused will fail an interview even if the boxes are right. State SLOs, limit traffic, and make writes idempotent.',
      whyItExists: 'Networks duplicate, users retry, attackers scrape, and you cannot fix what you cannot see.',
      whenToUse: [
        'Every design, as a closing section',
      ],
      functionalRequirements: [
        { title: 'Rate limit', detail: 'Token bucket per user and IP.' },
        { title: 'Audit sensitive actions', detail: 'Bookings, messages, deletions.' },
      ],
      nonFunctionalRequirements: [
        { title: 'SLO', detail: 'e.g. 99.9% of reads < 200ms' },
        { title: 'Privacy', detail: 'Encryption, GDPR deletion path.' },
      ],
      estimates: [
        { label: 'Error budget', value: '99.9% ≈ 43 minutes downtime/month' },
      ],
      concepts: [
        'SLI/SLO/SLA and error budgets',
        'Logs, metrics, traces',
        'Token bucket / leaky bucket',
        'Idempotency and poison pills',
      ],
      walkthrough: [
        { title: 'Limit', description: 'Gateway decrements a Redis token bucket before the handler runs.' },
        { title: 'Trace', description: 'One request id across gateway, service, and queue consumer.' },
      ],
      steps: [
        { title: 'Name SLIs', description: 'Availability, latency, freshness.' },
        { title: 'Rate limit public writes', description: 'Likes, swipes, search.' },
        { title: 'Plan deletion', description: 'User data must be findable by user_id.' },
      ],
      architecture: 'Gateway limits and auth. Services emit traces. Queues isolate retries. Secrets stay in a manager, not env screenshots.',
      diagram: `flowchart LR
    Client --> GW[Gateway limits]
    GW --> Svc[Service]
    Svc --> Metrics
    Svc --> Traces`,
      deepDives: [
        {
          title: 'Retry storms',
          body: 'Exponential backoff with jitter. Retry budgets. Never retry non-idempotent booking POSTs without a key.',
        },
      ],
      tradeoffs: [
        'Tight SLO vs cost of multi-region active-active.',
        'Verbose logs vs PII risk.',
      ],
      bottlenecks: ['Unbounded retries', 'No owner for an on-call SLO'],
      scalingPath: [
        { scale: 'v1', focus: 'Metrics + structured logs' },
        { scale: 'v2', focus: 'Tracing, error budgets, chaos tests' },
      ],
      interviewScript: [
        '“I would rate-limit swipes and searches, use idempotency keys on booking, and define a 99.9% read SLO.”',
      ],
      commonMistakes: [
        'No mention of abuse on Tinder/LinkedIn.',
        'Retries without idempotency.',
      ],
      relatedTopics: ['api-gateway', 'tinder', 'airbnb'],
      examples: ['Stripe idempotency keys', 'Twitter rate limits', 'GDPR delete jobs'],
    }),
  },
  {
    id: 'storage-media',
    title: 'Storage and Media',
    description: 'Object storage, signed uploads, transcode pipelines, and lifecycle to cold storage.',
    difficulty: 'Intermediate',
    progress: 0,
    icon: 'HardDrive',
    color: 'bg-orange-600',
    section: 'fundamentals',
    track: 'classic',
    prerequisites: ['cdn', 'message-queues'],
    estimatedMinutes: 25,
    order: 11,
    content: emptyContent({
      overview: 'Blobs do not belong in Postgres or on API disks. Clients upload to object storage; workers process; CDNs serve.',
      whyItExists: 'Images and video are large, popular, and processed in many variants.',
      whenToUse: [
        'Photos, video, attachments, ML artifacts',
      ],
      functionalRequirements: [
        { title: 'Resumable upload', detail: 'Mobile networks drop.' },
        { title: 'Variants', detail: 'Thumb, web, HLS ladder.' },
      ],
      nonFunctionalRequirements: [
        { title: 'Durability', detail: '11 nines class object stores.' },
        { title: 'Cost', detail: 'Lifecycle to infrequent access / glacier.' },
      ],
      estimates: [
        { label: '1M photos/day × 2 MB', value: '~2 TB/day ingest' },
      ],
      concepts: [
        'Object vs block vs file',
        'Signed URL PUT/GET',
        'Transcode queue',
        'Lifecycle policies',
      ],
      walkthrough: [
        { title: 'Request upload slot', description: 'API auth’s the user and returns a signed PUT URL.' },
        { title: 'Client uploads to object store', description: 'Bytes never transit the app cluster.' },
        { title: 'Completion callback', description: 'Queue transcode; write metadata when ready.' },
      ],
      steps: [
        { title: 'Metadata in SQL, bytes in object storage', description: 'Never mix them.' },
        { title: 'Process async', description: 'Do not block the upload ACK on transcode.' },
      ],
      architecture: 'App issues signed URLs. Object store + CDN for reads. Workers consume upload events.',
      diagram: `flowchart LR
    Client -->|signed PUT| S3[Object store]
    Client --> API
    API --> S3
    S3 --> Q[Queue]
    Q --> Worker[Transcode]
    Worker --> CDN`,
      deepDives: [
        {
          title: 'Hot popular object',
          body: 'A viral video is a CDN problem, not an app problem. Origin shield plus many POPs.',
        },
      ],
      tradeoffs: [
        'More bitrates: better UX, more storage and cost.',
      ],
      bottlenecks: ['Transcode backlog', 'Unbounded original retention'],
      scalingPath: [
        { scale: 'v1', focus: 'S3 + one worker' },
        { scale: 'v2', focus: 'HLS ladder, CDN, lifecycle' },
      ],
      interviewScript: [
        '“Uploads are signed URLs to S3. The API only stores metadata. Processing is a queue.”',
      ],
      commonMistakes: [
        'Multipart upload through the API server.',
        'No virus/moderation step on user media.',
      ],
      relatedTopics: ['cdn', 'youtube', 'instagram', 'message-queues'],
      examples: ['YouTube ingest', 'Instagram photos', 'WhatsApp media'],
    }),
  },
];
