import { ArchitectureTopic, emptyContent } from '../systemDesignTypes';

export const cachingTopic: ArchitectureTopic = {
  id: 'caching',
  title: 'Caching',
  description:
    'Putting hot data closer to the request so a read costs microseconds instead of milliseconds, and paying for it with a window in which the answer is out of date.',
  difficulty: 'Intermediate',
  progress: 0,
  icon: 'Zap',
  color: 'bg-amber-500',
  section: 'fundamentals',
  track: 'classic',
  prerequisites: ['databases'],
  estimatedMinutes: 70,
  order: 8,
  content: emptyContent({
    overview:
      'A cache is a second copy of data placed nearer the reader than the source of truth. It converts an expensive lookup into a cheap one, and in exchange it introduces a window during which the copy and the truth disagree. Every design decision in caching is really a decision about how long that window may be and who notices. The engineering is not in adding the cache; it is in the invalidation, the expiry moment, and the day the cache is gone.',
    whyItExists:
      'Databases are optimised for correctness and durability, which makes them slow and expensive per read, and most workloads read the same small set of rows over and over. A cache lets that small hot set be served from memory at a fraction of the cost.',
    problemStatement: {
      prompt:
        'A listing page for a booking site takes 180 ms because it joins four tables, and it is requested 10,000 times per second while the underlying rows change a few times per day. Design the caching layer. Decide what is cached, where it lives, how it is invalidated, and what happens at the instant a popular entry expires.',
      inScope: [
        'Where a cache can live: process, distributed, edge, browser',
        'The five read and write patterns and what each write path looks like',
        'Eviction, TTL, and the expiry stampede',
        'Invalidation strategies and negative caching',
      ],
      outOfScope: [
        'CDN and edge delivery specifics (see the CDN lesson)',
        'Bloom filters and sketches (see the probabilistic structures lesson)',
        'Redis replication and cluster failover internals',
        'Materialised views and precomputed feeds',
      ],
    },
    assumptions: [
      'Reads outnumber writes by at least 20:1 on the surfaces worth caching',
      'A few seconds of staleness is acceptable for reads that are not the user own writes',
      'The source of truth remains authoritative; the cache can always be thrown away',
    ],
    whenToUse: [
      'A read that is expensive to compute and requested far more often than it changes',
      'A read that must be fast under a burst the database cannot absorb, such as a flash sale page',
      'A lookup that is called on every request, such as a session, a feature flag map, or an auth token',
    ],
    functionalRequirements: [
      { title: 'Serve a hit from memory', detail: 'A key lookup returns the stored value without touching the database.' },
      { title: 'Fill on a miss', detail: 'On a miss the value is computed once, stored with a TTL, and returned to the caller.' },
      { title: 'Invalidate on change', detail: 'A write to the row makes the cached copy unusable, by deletion or by a new key version.' },
      { title: 'Bound memory', detail: 'When the cache is full an eviction policy chooses a victim rather than refusing writes.' },
    ],
    nonFunctionalRequirements: [
      { title: 'Latency', detail: 'A local hit in about 100 ns, a distributed hit in 0.3–1 ms, versus 2–200 ms at the origin.' },
      { title: 'Staleness bound', detail: 'The worst case is the TTL plus any grace window used for stale-while-revalidate.' },
      { title: 'Availability', detail: 'Losing the cache must degrade latency, not correctness, and must not take the database with it.' },
      { title: 'Hit ratio', detail: 'Below roughly 80% the cache adds a network hop for little benefit and should be resized or removed.' },
    ],
    estimates: [
      { label: 'Local heap versus Redis', value: '~100 ns versus ~500 µs', note: 'Roughly 5000×, which is why a small local tier in front of Redis still pays' },
      { label: 'Origin load at 95% hit rate', value: '10k QPS becomes 500 QPS', note: 'Lifting 95% to 99% cuts it again to 100 QPS' },
      { label: 'Working set size', value: '1M profiles × 2 KB = 2 GB', note: 'Add ~30% for Redis key and structure overhead, so a 4 GB instance' },
      { label: 'Single Redis node', value: '80k–150k GET/s per core', note: 'Pipelining raises it; values above 100 KB collapse it' },
      { label: 'Stampede blast radius', value: '5k QPS × 200 ms query = ~1000 concurrent queries', note: 'One expired hot key can exceed the entire connection pool' },
    ],
    concepts: [
      'Cache-aside, read-through, write-through, write-behind, refresh-ahead',
      'Hit ratio, miss penalty, and working set',
      'TTL, jitter, and stale-while-revalidate',
      'LRU, LFU, FIFO, random eviction',
      'Stampede (dogpile) and singleflight',
      'Negative caching and tombstones',
      'Delete-on-write versus versioned keys',
      'Hot keys and hash slots',
    ],
    comparisons: [
      {
        title: 'Where a cache can live',
        headers: ['Type', 'How it works', 'Use when', 'Avoid when'],
        rows: [
          [
            'Process / local heap',
            'An in-memory map inside the application process, often with a size bound and a short TTL',
            'Tiny hot sets: feature flags, currency tables, the top 100 listings',
            'The value must be consistent across instances, or it is large',
          ],
          [
            'Distributed (Redis)',
            'A separate server holding keys with rich types (strings, hashes, sorted sets), single-threaded per shard, optional persistence and replicas',
            'Shared state across instances, leaderboards, rate counters, sessions',
            'You need a cache that can never be a dependency',
          ],
          [
            'Distributed (Memcached)',
            'Multi-threaded slab-allocated key to blob store, no persistence, no replication, client-side sharding',
            'Very large simple blob caches where losing the whole tier is acceptable',
            'You need data structures, replication, or durability',
          ],
          [
            'Edge / CDN',
            'HTTP responses cached in points of presence near the user, keyed by URL and Vary headers',
            'Public, cacheable responses: images, bundles, video segments, anonymous HTML',
            'Responses are per-user or change on every request',
          ],
          [
            'Browser / HTTP',
            'The client stores the response and revalidates with ETag or If-Modified-Since when Cache-Control allows',
            'Assets with content-hashed filenames, and any response the user reloads',
            'You need to change the answer before the stored max-age expires',
          ],
        ],
        note: 'These stack. A request can be answered by the browser, then the edge, then a local heap, then Redis, and only then the database.',
      },
      {
        title: 'Patterns, and what the write path actually does',
        headers: ['Pattern', 'Write path', 'Read path', 'Use when', 'Avoid when'],
        rows: [
          [
            'Cache-aside',
            'Application commits the row to the database, then deletes the cache key. The cache is never written on the write path.',
            'Ask the cache; on a miss query the database, store the value with a TTL, return it',
            'The default for almost everything',
            'You cannot tolerate the brief stale window created by the delete race',
          ],
          [
            'Read-through',
            'Unchanged: writes still go to the database, and invalidation is still explicit',
            'The application only calls the cache; the cache library or sidecar runs the loader on a miss',
            'You want one place to enforce TTL, locking, and metrics',
            'You need the application to keep working when the cache layer cannot load',
          ],
          [
            'Write-through',
            'Application writes to the cache, the cache writes synchronously to the database, then the write is acknowledged',
            'Always a hit for anything recently written',
            'Read-after-write must be immediate and writes are infrequent',
            'Write latency matters; you now pay both stores on every write',
          ],
          [
            'Write-behind',
            'Application writes to the cache and is acknowledged at once; a flusher writes to the database in batches, for example every 200 ms or every 500 entries',
            'Always a hit, and the newest value may not be durable yet',
            'View counts, tallies, presence, telemetry',
            'Payments, bookings, anything where losing the unflushed window is unacceptable',
          ],
          [
            'Refresh-ahead',
            'Unchanged, but a background job recomputes a key at roughly 80% of its TTL',
            'Readers effectively never miss on a predictably hot key',
            'A known small set of very hot, expensive keys',
            'Access is unpredictable, since you will recompute keys nobody reads again',
          ],
        ],
      },
      {
        title: 'Eviction policies',
        headers: ['Policy', 'How it chooses a victim', 'Use when', 'Avoid when'],
        rows: [
          ['LRU', 'Discards the entry not read for the longest time, tracked by an intrusive list or an approximation over sampled keys', 'General purpose; recency predicts reuse in most products', 'A single large scan walks every key and flushes the useful set'],
          ['LFU', 'Counts accesses, often with a decaying counter, and discards the least frequently used', 'A stable hot set with periodic bulk scans over cold data', 'Traffic patterns shift quickly and old winners keep their counts'],
          ['FIFO', 'Discards the oldest inserted entry regardless of how often it is read', 'Simple bounded buffers, immutable fragments', 'Popularity varies; the hottest key gets evicted on schedule'],
          ['TTL only', 'Nothing is chosen; entries disappear when their timer expires', 'Freshness is the real requirement and memory is ample', 'Memory is the binding constraint, since a full cache will start refusing writes'],
          ['Random', 'Picks a victim uniformly at random, which costs no bookkeeping', 'Extreme throughput where per-access metadata is too expensive', 'Miss penalty is high and you need predictable retention'],
        ],
        note: 'Redis combines these: maxmemory-policy selects allkeys-lru, allkeys-lfu, volatile-ttl, or noeviction, and the LRU is a sampled approximation rather than an exact list.',
      },
    ],
    architecture:
      'The application talks to a small local heap cache, then to a Redis cluster, then to Postgres. Reads use cache-aside, writes commit to Postgres and then invalidate, and every key carries a jittered TTL so nothing expires in lockstep. Because the cache is on the read path for 95% of traffic, it is treated as a production dependency: replicated, monitored on hit ratio and eviction rate, and load tested with the cache switched off.',
    diagrams: [
      { id: 'aside', title: 'Cache-aside: the application owns the cache', kind: 'excalidraw', src: 'cache-aside' },
      { id: 'anim', title: 'A read that misses', kind: 'animation', src: 'cache-aside' },
    ],
    walkthrough: [
      {
        title: 'Find out what is actually hot',
        description:
          'Before choosing a technology, measure which keys are requested and how often they change. A listing page read 10,000 times per second and edited twice a day is an ideal candidate; a payment record read once by one person is not. The ratio of reads to writes, not the latency of the query, is what decides whether a cache helps.',
      },
      {
        title: 'A read asks the cache first',
        description:
          'The request handler builds a key such as listing:9182:v3 and issues a single GET. On a hit it returns in well under a millisecond and the database never learns the request existed. This is the step that carries 95% of traffic, so the key format has to be deterministic and must include everything that changes the answer, including locale and currency.',
        animation: 'cache-aside',
      },
      {
        title: 'On a miss, load once and populate',
        description:
          'A miss runs the real query, serialises the result, and writes it back with a TTL. The critical detail is that only one request per key should be allowed to do this work, otherwise a popular miss multiplies into hundreds of identical queries. Wrap the load in a per-key lock so the rest of the callers wait on a result that is already being computed.',
      },
      {
        title: 'A write changes the row, then invalidates the key',
        description:
          'The write path commits to Postgres first, because the database is the source of truth and must never be behind the cache. Only after the transaction commits does the handler delete the cache key. If the deletion fails, the TTL is the backstop, which is the real reason every entry gets a TTL even when you believe invalidation is complete.',
      },
      {
        title: 'Protect the expiry moment',
        description:
          'Set each TTL to a base plus a random offset, for example 300 seconds plus 0 to 30 seconds, so a batch of keys written together does not expire together. For the hottest keys add stale-while-revalidate: keep serving the expired value for a short grace window while one background refresh runs. The user sees a fast, slightly old answer instead of a latency spike.',
      },
      {
        title: 'Plan for the cache being gone',
        description:
          'Assume the Redis cluster is unreachable at peak and ask what the database sees. If the answer is 10,000 QPS against a primary sized for 500, you have built a system that cannot restart. The mitigations are a load shedder in front of the origin, a per-key concurrency limit on fills, and a local heap tier that still absorbs the hottest keys while Redis is down.',
      },
    ],
    deepDives: [
      {
        title: 'Cache-aside and read-through: who owns the miss',
        body:
          'In cache-aside the application owns both stores. A read asks Redis for user:42, and on a miss it queries Postgres, writes the value back with a TTL, and returns it. The write path never writes to the cache; it commits the row and then deletes the key so the next reader repopulates. Read-through moves the miss handling into the cache library or a sidecar, so the application only ever calls the cache and a loader function runs behind it. The difference shows up in an outage. Cache-aside degrades to direct database reads, which is slow but correct, whereas a read-through layer that cannot reach its loader returns errors. Cache-aside also tolerates arbitrary value shapes and per-call TTLs, which is why nearly every production system starts there and keeps read-through for one or two well-understood surfaces.',
      },
      {
        title: 'Write-through, write-behind, and refresh-ahead',
        body:
          'Write-through puts the cache inside the write path: the application writes the cache, the cache writes synchronously to the database, and only then is the write acknowledged. Nothing is ever stale, and every write pays both latencies, perhaps 0.5 ms plus 3 ms. Write-behind acknowledges as soon as the cache accepts the value and flushes to the database in batches, for example every 200 ms or every 500 entries. That turns 5000 individual row updates per second into 10 batched writes, and it loses the unflushed window on a crash, which is fine for a video view counter and unacceptable for a booking. Refresh-ahead is orthogonal: a background job recomputes a key at about 80% of its TTL so readers never see a miss. It is only worth it for a known, small, genuinely hot set, because you are paying to recompute keys speculatively.',
      },
      {
        title: 'The stampede, and its three fixes',
        body:
          'A key with a 60 second TTL serving 5000 requests per second expires at a single instant. Every in-flight request misses at once, and if the underlying query takes 200 ms then roughly 1000 concurrent queries arrive at the database, which usually exhausts the connection pool and turns a routine expiry into an outage. This is the stampede, also called the dogpile. There are three fixes and mature systems use all three together. A per-key lock, often called singleflight, lets exactly one caller compute while the others wait on that single result. Jittered TTL sets each key to 60 seconds plus a random 0 to 10 seconds so keys written together never expire together. Stale-while-revalidate keeps serving the expired value for a grace window while one background refresh runs, removing the latency spike entirely at the cost of a few seconds of staleness.',
        animation: 'stampede',
      },
      {
        title: 'Delete-on-write versus versioned keys',
        body:
          'Delete-on-write is the usual approach: commit the row, then delete the key. It is simple and it has a race. A reader that missed, read the old row, and was then descheduled can write that stale value back after the deletion, and the cache will serve the old answer until the TTL expires. Versioned keys remove the race by never mutating a key at all. The key embeds a version, such as user:42:v7, and a write increments the version, so the previous entry is orphaned and evicted in due course. Every read of a new version misses once, which is far cheaper than an unbounded wrong answer. Negative caching belongs to the same discussion: store an explicit tombstone for "not found" with a short TTL of 5 to 30 seconds, or a stream of requests for deleted or guessed identifiers will pass straight through to the database every time.',
      },
      {
        title: 'Two tiers: a local heap in front of Redis',
        body:
          'A local heap cache answers in roughly 100 nanoseconds while Redis costs a network round trip of about 500 microseconds, so for a small set of extremely hot keys a local tier removes most of the traffic to the shared tier. Keep it small, a few thousand entries, and keep the TTL short, 5 to 30 seconds, because you have no precise way to invalidate 60 application instances at once. If precision matters, publish invalidation messages on a Redis pub/sub channel and have each instance drop the key locally, accepting that a dropped message leaves one instance stale until its TTL expires. The reason to keep the local tier deliberately small is that every instance holds its own copy, so both memory cost and consistency skew grow linearly with fleet size.',
      },
      {
        title: 'One hot key lands on exactly one shard',
        body:
          'Redis Cluster maps each key to one of 16,384 hash slots, and every slot lives on exactly one primary. Adding nodes therefore does nothing for a single key: when one celebrity profile takes 200,000 reads per second, all of it lands on one process and effectively one CPU core. Every fix is a form of duplication. Reading from replicas of that shard spreads the load if the client accepts slightly stale reads. Key splitting stores N copies under keys such as profile:9:0 through profile:9:7 and has each reader pick one at random, dividing read load by eight at the cost of eight invalidations per write. A tiny local in-process cache with a two second TTL is often the cheapest answer of all, because a hot key is precisely the case where a small local cache reaches a near perfect hit rate.',
      },
    ],
    tradeoffs: [
      'Longer TTLs raise hit ratio and lengthen the window in which users see an old answer.',
      'Write-through keeps the cache correct and adds the database latency to every write.',
      'A local tier is the fastest option and the hardest to invalidate across a fleet.',
      'Versioned keys eliminate the invalidation race and guarantee one miss per change.',
    ],
    bottlenecks: [
      'A single hot key saturating one shard while the rest of the cluster is idle.',
      'Synchronised TTLs causing periodic stampedes onto the database.',
      'Eviction pressure from oversized values, dropping hit ratio without any traffic change.',
      'The cache becoming a hard dependency, so losing it takes the database down with it.',
    ],
    scalingPath: [
      { scale: 'Prototype', focus: 'One Redis instance, cache-aside on the two slowest endpoints, TTL 300 s with jitter' },
      { scale: 'One region', focus: 'Replicated Redis, singleflight on fills, negative caching, hit ratio and eviction dashboards' },
      { scale: 'Global', focus: 'Per-region clusters, a local heap tier for the hottest keys, key splitting for celebrities, CDN in front of public reads' },
    ],
    interviewScript: [
      '"This page is read 10,000 times a second and edited twice a day, so it is an obvious cache-aside candidate."',
      '"Writes commit to Postgres first, then delete the key. The TTL is the backstop if the delete fails."',
      '"Every TTL gets jitter, and the hottest keys get a per-key lock so one expiry does not become a thousand queries."',
      '"I will cache misses too, with a five second tombstone, otherwise lookups for deleted ids go straight through."',
      '"One celebrity key lands on one shard, so I would split it into eight replica keys or add a two second local cache."',
      '"If Redis disappears at peak, the database sees 10,000 QPS, so I need shedding and per-key fill limits before that day arrives."',
    ],
    commonMistakes: [
      'Adding a cache before measuring which keys are hot and how often they change.',
      'Writing to the cache before the database, so a failed commit leaves the cache authoritative.',
      'Giving every key the same TTL and creating a synchronised expiry wave.',
      'Never caching negative results, so missing identifiers hit the database every time.',
      'Caching per-user responses at a shared layer and leaking one user data to another.',
      'Treating a 60% hit ratio as a success when it is mostly an extra network hop.',
    ],
    relatedTopics: ['databases', 'cdn', 'probabilistic', 'load-balancer', 'tinder'],
    examples: [
      'Facebook fronts MySQL with memcache and adds leases so one expiry cannot dogpile onto the database',
      'Twitter serves home timelines from Redis so a fan-out read never reaches the primary store',
      'Netflix runs EVCache replicated across availability zones so losing a zone does not flood the origin services',
    ],
    practicePrompt:
      'Design the cache for a product page read 20,000 times per second whose price changes every few minutes, and state exactly what a user sees in the second after an admin edits the price.',
    followUps: [
      {
        question: 'Why is cache-aside the default rather than write-through?',
        answer:
          'Cache-aside keeps the cache off the write path, so a cache outage slows reads instead of failing writes. It also lets each call site choose its own value shape and TTL, and it degrades gracefully to plain database reads. Write-through only wins when you need immediate read-after-write on a surface with very few writes.',
        category: 'Patterns',
        difficulty: 'easy',
      },
      {
        question: 'Should you delete the cache key before or after committing the database write?',
        answer:
          'After. If you delete first, a concurrent reader can miss, load the old row, and repopulate the cache before your transaction commits, leaving a stale entry for the full TTL. Committing first and then deleting narrows the race to the interval in which a reader has already fetched the old value, and a short TTL bounds even that. Versioned keys remove the race entirely because no key is ever overwritten.',
        category: 'Invalidation',
        difficulty: 'hard',
      },
      {
        question: 'How do you make a user see their own edit immediately when the page is cached?',
        answer:
          'Give the writer a read-your-writes path. The simplest version writes the new value into the cache as part of the request that changed it, so the author reads a hit containing their own edit. Alternatively pin that user to the primary database for a few seconds after a write, or attach a version to the session and bypass the cache while the cached version is older. Other users can safely see the old answer until the TTL expires.',
        category: 'Consistency',
        difficulty: 'medium',
      },
      {
        question: 'Redis or Memcached?',
        answer:
          'Redis unless you have a specific reason not to use it. It gives you sorted sets for leaderboards, hashes for partial updates, atomic counters for rate limits, replication, and optional persistence. Memcached is multi-threaded per node and has a very efficient slab allocator, so it can be cheaper for enormous caches of plain blobs where losing the whole tier is acceptable.',
        category: 'Technology',
        difficulty: 'easy',
      },
      {
        question: 'How do you choose a TTL?',
        answer:
          'Start from the staleness the product can tolerate, not from the hit ratio you want. A currency table can be stale for an hour, a price for 30 seconds, an inventory count for perhaps one second or not at all. Then check the miss cost: if the query behind the key takes 200 ms and the key is hot, use a longer TTL with stale-while-revalidate rather than a short TTL that creates a repeated latency spike.',
        category: 'Operations',
        difficulty: 'medium',
      },
      {
        question: 'The cache cluster fails at peak traffic. What happens and how do you survive it?',
        answer:
          'Every request becomes a miss, so the database receives the full unfiltered load, typically 20 times what it is provisioned for, and it collapses. Because clients retry, the system cannot recover even after the cache returns until load is shed. Survival needs three things planned in advance: a per-key fill limit so a cold cache cannot multiply queries, admission control that sheds low-value traffic with a 503, and a small local heap tier that keeps serving the hottest keys while the shared tier is gone.',
        category: 'Reliability',
        difficulty: 'hard',
      },
      {
        question: 'How do you cache a paginated feed?',
        answer:
          'Do not cache page 2 onwards by offset, because any insertion shifts every page and invalidates all of them. Cache the identifier list for the first N items under one key and hydrate the objects from a separate per-object cache, so an edit to one item invalidates one small key rather than the whole feed. Use cursor keys based on a stable sort value, and accept that deep pages are rarely worth caching because almost nobody requests them.',
        category: 'Modelling',
        difficulty: 'hard',
      },
      {
        question: 'How do you invalidate a local in-process cache across 60 instances?',
        answer:
          'You accept a bound rather than achieving precision. A short TTL of 5 to 30 seconds gives a guaranteed convergence window with no coordination at all. If that is too slow, publish invalidation events on a Redis pub/sub channel or a Kafka topic and have each instance drop the key locally, keeping the TTL as the backstop for instances that missed the message. Never assume a broadcast reached every instance.',
        category: 'Invalidation',
        difficulty: 'medium',
      },
      {
        question: 'Which metrics tell you the cache is actually working?',
        answer:
          'Hit ratio per key family rather than one global number, because a single healthy family can hide a useless one. Then eviction rate, which reveals that the working set no longer fits, and the p99 latency of both hits and misses, since a rising miss latency is what turns an expiry into an incident. Finally track origin QPS: the cache exists to reduce that number, so it is the only measure of success that matters.',
        category: 'Operations',
        difficulty: 'easy',
      },
      {
        question: 'When should you not cache at all?',
        answer:
          'When reads and writes are of similar volume, because every write throws away the entry the next read needs and you have added a hop for nothing. When the data must be exactly correct at read time, such as a remaining seat count at checkout. And when the query is already a fast indexed point read of a small row, where a 0.5 ms Redis round trip may not beat a 1 ms database read once you account for the added failure mode.',
        category: 'Design',
        difficulty: 'medium',
      },
    ],
  }),
};
