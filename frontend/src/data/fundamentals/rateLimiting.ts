import { ArchitectureTopic, emptyContent } from '../systemDesignTypes';

export const rateLimitingTopic: ArchitectureTopic = {
  id: 'rate-limiting',
  title: 'Rate Limiting and Quotas',
  description:
    'Every counting algorithm from fixed window to GCRA, where to enforce it, and the 429 contract a client can actually obey.',
  difficulty: 'Intermediate',
  progress: 0,
  icon: 'Gauge',
  color: 'bg-red-600',
  section: 'fundamentals',
  track: 'classic',
  prerequisites: ['api-gateway'],
  estimatedMinutes: 70,
  order: 12,
  content: emptyContent({
    overview:
      'A rate limiter decides, for each incoming request, whether the caller has spent its allowance for the current instant. It is the cheapest protection you own, because rejecting a request costs microseconds while serving one may cost a database round trip. The interesting part is never the idea, it is the counting: which algorithm, keyed on what, counted where, and what the client is told when the answer is no.',
    whyItExists:
      'Capacity is finite and demand is not, so without an explicit limit the first client with a retry loop or a bad deploy consumes the whole service. A limiter converts an unbounded, shared failure into a bounded, attributable rejection.',
    problemStatement: {
      prompt:
        'A public API serves 40,000 requests per second across 30,000 API keys, and one customer has just shipped a script that calls it in a tight loop. Design the limiter that caps that customer without adding measurable latency for everyone else, and define exactly what the rejected caller receives so its retry behaviour improves rather than worsens.',
      inScope: [
        'The counting algorithms and the mechanism of each',
        'Where enforcement happens: edge, gateway, service, database',
        'Local counters, shared counters, and the two-tier compromise',
        'The 429 response contract, quotas, and per-tenant fairness',
      ],
      outOfScope: [
        'Retry policy, backoff, and circuit breaking on the caller side',
        'Authentication and how the API key is validated',
        'Autoscaling policy and capacity planning',
        'Volumetric DDoS absorption at the network layer',
      ],
    },
    assumptions: [
      'Every request carries an identity: an API key, a user id, or a tenant id',
      'A shared counter store sits in the same availability zone, so a round trip is under a millisecond',
      'Limits are configured per plan and change far more slowly than traffic',
    ],
    whenToUse: [
      'Any public or partner-facing API where callers are not under your control',
      'Expensive endpoints such as search, export, or anything that fans out to a third party',
      'Multi-tenant platforms where one noisy tenant can starve the others',
    ],
    functionalRequirements: [
      { title: 'Decide allow or reject', detail: 'A yes-or-no answer per request against the limit for that key, in under a millisecond.' },
      { title: 'Support several limit shapes', detail: 'Per-second rate, per-minute burst, monthly quota, and a cap on in-flight requests.' },
      { title: 'Report the remaining budget', detail: 'Limit, remaining, and reset headers on every response, not only on rejections.' },
      { title: 'Isolate tenants', detail: 'One key exhausting its allowance must not consume another key allowance or shared capacity.' },
    ],
    nonFunctionalRequirements: [
      { title: 'Added latency', detail: 'Under 1 ms at the median; a limiter that costs 10 ms has become the bottleneck it was meant to prevent.' },
      { title: 'Accuracy', detail: 'Within a few percent of the configured limit is enough; exactness costs either memory or a network hop.' },
      { title: 'Availability', detail: 'If the counter store is unreachable, the limiter must fail open or fail closed by explicit policy, never by accident.' },
      { title: 'Attributability', detail: 'Every rejection is logged with the key, the limit, and the algorithm so support can answer "why was I throttled".' },
    ],
    estimates: [
      { label: 'Fixed-window boundary burst', value: '2× the limit', note: '100/min allows 200 requests in the 2 s spanning a boundary' },
      { label: 'Sliding-window log memory', value: '≈ 800 MB', note: '1M active keys × 100 timestamps × 8 B per timestamp' },
      { label: 'Token bucket state per key', value: '32 B', note: 'tokens plus last_refill; 10M keys ≈ 320 MB in Redis' },
      { label: 'Shared-counter round trip', value: '0.3–1 ms', note: 'Same-zone Redis; it is added to every single request' },
      { label: 'Single Redis shard ceiling', value: '~100k Lua calls/s', note: 'One script per request caps that shard at ~100k rps' },
    ],
    concepts: [
      'Fixed, sliding-log, and sliding-counter windows',
      'Token bucket: burst plus steady refill',
      'Leaky bucket: constant drain, smoothed output',
      'GCRA and virtual scheduling time',
      'Concurrency limit versus rate limit',
      'Atomic check-and-decrement with a Lua script',
      'Choosing the limit key: API key, user, IP, tenant',
      'Quotas, 429, and Retry-After',
    ],
    comparisons: [
      {
        title: 'Every algorithm you will be asked to compare',
        headers: ['Algorithm', 'How it works', 'Use when', 'Avoid when'],
        rows: [
          [
            'Fixed window',
            'One counter per key per wall-clock window; increment and compare, reset to zero at the boundary',
            'You want the simplest possible thing and a 2× overshoot is tolerable',
            'The limit protects a hard capacity ceiling, because the boundary burst breaks it',
          ],
          [
            'Sliding window log',
            'Store the timestamp of every request in a sorted set, drop entries older than the window, count what remains',
            'Limits are small and exactness matters, such as 5 password attempts per hour',
            'Keys are numerous or limits are large — memory grows with the limit itself',
          ],
          [
            'Sliding window counter',
            'Keep the current and previous fixed-window counts and weight the previous one by how much of it still overlaps the window',
            'You want near-sliding accuracy at fixed-window cost, the usual production default',
            'You need exact counts for audit or billing purposes',
          ],
          [
            'Token bucket',
            'A bucket of capacity B refills at R tokens per second; a request takes one token or is rejected',
            'Bursty but well-behaved clients — page loads, batch syncs, mobile apps waking up',
            'A downstream dependency cannot absorb a burst at all',
          ],
          [
            'Leaky bucket (as a queue)',
            'Requests enter a bounded FIFO queue that is drained at a constant rate; a full queue rejects',
            'You must feed a fixed-rate downstream such as an SMS gateway or a payment partner',
            'Latency matters, because queued requests wait instead of failing fast',
          ],
          [
            'GCRA / virtual scheduling',
            'Store one timestamp: the theoretical arrival time of the next allowed request. Allow if now is not earlier than that time minus the tolerance',
            'You want token-bucket behaviour with 8 bytes of state and no refill loop',
            'The team will not be able to reason about or debug the arithmetic',
          ],
          [
            'Concurrency limit',
            'Count requests currently in flight, not requests per second; increment on entry, decrement on completion',
            'Slow endpoints where the real constraint is threads, connections, or memory',
            'You need to bound total work over time — this bounds simultaneity only',
          ],
        ],
        note: 'Token bucket, leaky bucket, and GCRA are the same shaping behaviour expressed three ways. Sliding window counter is the pragmatic default for public APIs.',
      },
      {
        title: 'Where to enforce, and what each layer can see',
        headers: ['Layer', 'How it works', 'Use when', 'Avoid when'],
        rows: [
          [
            'Client hint',
            'The SDK reads the RateLimit headers and self-paces before sending',
            'You publish the SDK and want to spare clients the wasted round trips',
            'Ever, as your only defence — a client you do not control will ignore it',
          ],
          [
            'Edge / CDN',
            'Counting at the point of presence nearest the caller, before the request crosses your network',
            'Abusive traffic, per-IP floods, and cheap early rejection',
            'The limit depends on identity or plan data that only your service holds',
          ],
          [
            'API gateway',
            'One shared enforcement point that already parses auth, so it knows the key and the plan',
            'The default home for per-key and per-tenant limits',
            'A limit that depends on request semantics the gateway cannot inspect',
          ],
          [
            'Service',
            'The owning service applies limits per operation, aware of its own cost model',
            'One endpoint is far more expensive than its neighbours',
            'Every service reimplementing the same policy differently',
          ],
          [
            'Database / dependency',
            'Connection pool caps and statement timeouts bound the damage that arrives anyway',
            'As the last line of defence under all of the above',
            'As the first line — by then the request already consumed a thread',
          ],
        ],
      },
      {
        title: 'Counter placement: local, shared, or two-tier',
        headers: ['Placement', 'Accuracy', 'Added latency', 'Failure behaviour'],
        rows: [
          ['Local in-memory only', 'Overshoots by up to N× with N gateway nodes when a client is not evenly balanced', 'Roughly 100 ns', 'Cannot fail — the counter dies with the process'],
          ['Shared Redis counter', 'Within a few percent of the configured limit', '0.3–1 ms per request', 'Needs an explicit fail-open or fail-closed policy'],
          ['Two-tier: local lease from a global budget', 'Within about 10% and self-correcting', '100 ns typical, one round trip per lease refill', 'Degrades to local limits when the store is unavailable'],
        ],
        note: 'A 1,000 rps global limit split naively across 20 nodes gives each node 50 rps, so a client pinned to one node by a sticky load balancer sees 50, not 1,000. That mismatch is why two-tier leasing exists.',
      },
    ],
    architecture:
      'The gateway resolves the API key to a tenant and a plan, then asks the limiter for a decision keyed on that identity. The limiter answers from a local token bucket that holds a short lease drawn from a global budget in Redis, where a single Lua script performs the refill and the decrement atomically. Rejections return 429 with the remaining budget and a Retry-After computed from the refill rate, and the same counters feed the usage record that backs the monthly quota.',
    diagrams: [
      { id: 'bucket', title: 'One shared bucket, two answers', kind: 'excalidraw', src: 'token-bucket' },
      { id: 'anim', title: 'A burst against a token bucket', kind: 'animation', src: 'token-bucket' },
    ],
    apis: [
      {
        method: 'POST',
        path: '/v1/messages',
        description: 'An ordinary write endpoint, shown here for the rate-limit headers and the rejection contract rather than the business logic.',
        request:
          'POST /v1/messages\nAuthorization: Bearer ak_live_8f2c\nContent-Type: application/json\n\n{ "conversation_id": "c_912", "body": "on my way" }',
        response:
          '200 OK\nX-RateLimit-Limit: 100\nX-RateLimit-Remaining: 97\nX-RateLimit-Reset: 1735689660\n\n{ "id": "m_5521", "created_at": "2025-01-01T00:00:12Z" }',
        errors:
          '429 Too Many Requests\nRetry-After: 12\nX-RateLimit-Limit: 100\nX-RateLimit-Remaining: 0\nX-RateLimit-Reset: 1735689672\n\n{ "error": "rate_limited", "scope": "api_key", "limit": 100, "window": "1m", "retry_after_seconds": 12 }\n\n403 quota_exceeded — the monthly quota is spent; Retry-After is omitted because retrying this month cannot succeed.',
      },
      {
        method: 'GET',
        path: '/v1/rate_limit',
        description: 'Lets a client read its current budget without spending a request against the limited endpoints.',
        request: 'GET /v1/rate_limit\nAuthorization: Bearer ak_live_8f2c',
        response:
          '200 OK\n\n{\n  "rate": { "limit": 100, "window": "1m", "remaining": 97, "reset_at": "2025-01-01T00:01:00Z" },\n  "burst": { "capacity": 200, "tokens": 188 },\n  "concurrency": { "limit": 20, "in_flight": 3 },\n  "quota": { "limit": 5000000, "used": 3120044, "period": "2025-01" }\n}',
        errors: '401 unauthenticated — the key is missing or revoked. This endpoint is itself limited, at a deliberately generous 600 per minute.',
      },
    ],
    walkthrough: [
      {
        title: 'Resolve the identity before counting anything',
        description:
          'The gateway validates the API key and loads the tenant and plan, because the limit is a property of the caller rather than of the connection. Counting starts only after identity is known, since a limiter keyed on the wrong thing is worse than none at all. If the key is invalid the request is rejected on authentication grounds and never touches a counter.',
      },
      {
        title: 'Build the limit key',
        description:
          'The key is a composite string such as tenant:4471:key:ak_live_8f2c:endpoint:messages:write, so the same customer gets separate budgets for cheap reads and expensive writes. Adding the endpoint class to the key is what stops an export job from consuming the allowance that interactive traffic depends on. Keep the key stable, because changing its shape silently resets everyone budget.',
      },
      {
        title: 'Ask the local bucket first',
        description:
          'Each gateway node holds a token bucket in memory for the keys it has seen recently, filled from a lease it took from the global budget. The common case is a hit against that local bucket, which costs a hash lookup and a comparison — around 100 nanoseconds and no network. This is the step that keeps the limiter off the latency budget.',
        animation: 'token-bucket',
      },
      {
        title: 'Refill the lease atomically from Redis',
        description:
          'When the local lease runs low the node calls a Lua script on Redis that reads the bucket, computes the tokens accrued since last_refill, decrements the requested lease, and writes the new state — all inside one script execution. Because Redis runs the script single-threaded to completion, no two gateway nodes can both read 10 tokens and both spend them. Doing the same work as GET then SET would be a textbook race, and under load it overshoots the limit by exactly the number of concurrent nodes.',
      },
      {
        title: 'Answer the caller honestly',
        description:
          'An allowed request carries X-RateLimit-Limit, X-RateLimit-Remaining, and X-RateLimit-Reset so a well-written client can slow down before it is rejected. A rejected request returns 429 with Retry-After set to the seconds until one token is available, computed from the refill rate rather than guessed. The body names the scope that was hit, because a client that cannot tell a per-second limit from a monthly quota will retry the unretryable.',
      },
      {
        title: 'Record usage and shed only as a last resort',
        description:
          'The same counters are aggregated asynchronously into monthly usage so quotas and billing read from one source of truth rather than a parallel pipeline. If aggregate load still exceeds capacity after every per-key limit is honoured, the gateway sheds load by priority — background and batch traffic first, interactive traffic last. Shedding is an admission that the limits were set too generously for the capacity actually deployed.',
      },
    ],
    deepDives: [
      {
        title: 'Why the fixed window allows double the limit',
        body:
          'A fixed window keyed on the minute resets its counter at each boundary, and it has no memory of what happened just before. With a limit of 100 per minute, a client can send 100 requests in the final second of 12:00 and another 100 in the first second of 12:01: 200 requests in two seconds, twice the intended rate, entirely within the rules. If the limit exists to protect a downstream that saturates at 120 per minute, the limiter has not protected it. The sliding window counter fixes this for a few extra bytes: keep both windows and add the previous count weighted by the fraction of it still inside the trailing window, so at 15 seconds past the boundary the previous minute still contributes 75% of its count.',
      },
      {
        title: 'Token bucket and leaky bucket are one idea, two behaviours',
        body:
          'A token bucket of capacity 200 refilling at 100 per second permits an idle client to spend 200 immediately and then settle to 100 per second. Burst tolerance is capacity, sustained rate is refill, and the two are tuned independently — which is why it suits real clients whose traffic arrives in clumps. A leaky bucket implemented as a queue inverts the guarantee: arrivals wait and the downstream sees a perfectly constant drain, so a partner API rated at 100 per second never sees 101. The cost is latency and a bounded queue that must reject when full. Choose the bucket when the client should feel the limit; choose the queue when the downstream must never feel the burst.',
      },
      {
        title: 'GCRA replaces the bucket with one timestamp',
        body:
          'The generic cell rate algorithm keeps a single value per key: the theoretical arrival time at which the next request would be exactly on schedule. Each allowed request pushes that time forward by the emission interval, one second divided by the rate. A request is allowed when the current time is not earlier than the theoretical arrival time minus a burst tolerance, which is the emission interval multiplied by the burst size. There is no background refill task, no drift from a coarse clock tick, and the state is eight bytes rather than a pair of numbers plus a timestamp. Redis rate limiters and Envoy use variants of it. The drawback is purely human: the arithmetic is not obvious on a whiteboard, so teams debug it badly.',
      },
      {
        title: 'The atomic script is the whole correctness argument',
        body:
          'Two gateway nodes checking a shared counter with GET followed by SET both read 1 remaining token and both allow the request, so the effective limit is the configured limit multiplied by the node count. The fix is to make read, compute, and write one indivisible operation. In Redis that is a Lua script, which the server executes to completion without interleaving other commands; the script recomputes the refill from stored last_refill and now, subtracts the cost, and returns the remaining tokens and the retry delay in a single round trip. INCR with EXPIRE is atomic enough for a fixed window, but it cannot express refill, and setting the expiry as a second command leaves a window where a crash produces an immortal counter. One script, one round trip, one answer.',
      },
      {
        title: 'What you key on decides whether the limiter is fair',
        body:
          'An API key or tenant id is the right key for a paid API, because it maps to a plan and to a party you can bill or contact. A user id is right for actions inside a product, such as five password attempts per hour. An IP address is the only key available before authentication, and it is a blunt one: behind carrier-grade NAT a single address can front tens of thousands of mobile subscribers, so an IP limit strict enough to stop one attacker will lock out an entire city, while a mobile client roaming between towers changes address mid-session and resets its own counter. Use IP for pre-auth and abuse control with generous limits, and switch to identity the moment the request is authenticated.',
      },
      {
        title: 'Quotas, rate limits, and concurrency limits answer different questions',
        body:
          'A rate limit bounds requests per unit time and protects against instantaneous overload; it resets continuously and a 429 from it is worth retrying in seconds. A quota bounds total consumption over a billing period — five million requests per month — and protects revenue and cost rather than capacity; retrying it this month cannot succeed, so it deserves 403 with no Retry-After. A concurrency limit bounds requests in flight and protects the resource that actually runs out first on slow endpoints: threads, database connections, or memory. An endpoint holding a connection for two seconds needs a cap of maybe 20 simultaneous calls; expressing that as 10 per second is wrong in both directions, because 10 fast calls are harmless and 10 slow ones are not.',
      },
    ],
    tradeoffs: [
      'Local counters cost nothing and overshoot; shared counters are accurate and add a round trip to every request.',
      'Exact sliding-window logs give perfect counts and grow memory linearly with the limit value.',
      'Generous burst capacity improves the experience of well-behaved clients and widens the worst-case spike.',
      'Failing open keeps the API up when Redis dies but removes all protection at the worst moment.',
    ],
    bottlenecks: [
      'A single Redis shard serving every decision, capping the whole platform near 100k script calls per second.',
      'One hot key, such as a shared tenant id for a large customer, serialising on one shard.',
      'The limiter itself on the request path, turning a store hiccup into elevated latency for all traffic.',
      'Unbounded key cardinality from per-IP or per-URL keys, evicting the buckets that matter.',
    ],
    scalingPath: [
      { scale: 'Prototype', focus: 'One fixed-window counter per key in process memory, single gateway node, limits in config' },
      { scale: 'One region', focus: 'Shared Redis with an atomic Lua token bucket, local lease cache, 429 headers, per-endpoint limit keys' },
      { scale: 'Global', focus: 'Regional counter clusters with per-region budgets, edge pre-filtering for abuse, asynchronous global quota aggregation' },
    ],
    interviewScript: [
      '"I will put per-key limits at the gateway, because that is the one place that already knows the tenant and the plan."',
      '"Default algorithm is a sliding window counter, and a token bucket wherever clients legitimately burst."',
      '"Fixed window is out for hard capacity limits — it lets 200 through across a boundary on a 100-per-minute limit."',
      '"The counter lives in Redis behind a single Lua script, so check-and-decrement is atomic rather than a race."',
      '"To keep latency off the request path, each node holds a short lease locally and refills it from the global budget."',
      '"Rejections are 429 with Retry-After and remaining headers; a monthly quota is a 403, because retrying it cannot help."',
    ],
    commonMistakes: [
      'Reading and writing the shared counter as two commands, which multiplies the effective limit by the node count.',
      'Using a fixed window to protect a downstream that cannot survive the boundary burst.',
      'Limiting on IP address alone, which breaks behind NAT and carrier-grade NAT.',
      'Returning 429 with no Retry-After, leaving clients to hammer immediately.',
      'Confusing a monthly quota with a rate limit and telling the client to retry in a second.',
      'Applying one global limit and calling it fairness, so a large tenant still starves small ones.',
    ],
    relatedTopics: ['api-gateway', 'reliability', 'caching', 'auth'],
    examples: [
      'Stripe publishes per-key limits and returns 429 with a documented header set, so SDKs can self-pace',
      'GitHub separates an hourly REST quota from a per-second secondary limit, with distinct responses for each',
      'Cloudflare enforces per-IP and per-path limits at the edge so abusive traffic never reaches an origin',
    ],
    practicePrompt:
      'Design limits for an API where one endpoint costs 2 ms and another holds a connection for 3 seconds, and say which algorithm you use for each and why.',
    followUps: [
      {
        question: 'Why is the fixed window unsafe for a hard capacity limit?',
        answer:
          'It resets at a wall-clock boundary with no memory of the preceding window, so a client can spend its full allowance at the end of one window and again at the start of the next. On a 100-per-minute limit that is 200 requests in about two seconds. If the limit exists because a downstream saturates at 120 per minute, the limiter has failed at precisely the moment it mattered.',
        category: 'Algorithms',
        difficulty: 'easy',
      },
      {
        question: 'How does the sliding window counter approximate an exact sliding window?',
        answer:
          'It keeps two fixed-window counters, current and previous, and weights the previous one by the fraction of it still inside the trailing window. Fifteen seconds into a minute, the previous minute counts for 75% and the current for all of itself. It assumes requests were spread evenly across the previous window, so it can be a few percent off, but it uses two integers per key instead of one timestamp per request.',
        category: 'Algorithms',
        difficulty: 'medium',
      },
      {
        question: 'Why must check-and-decrement be a single atomic operation?',
        answer:
          'Because otherwise every gateway node races. Twenty nodes that each read one remaining token and each write zero will all allow the request, so the effective limit is twenty times the configured one. A Lua script in Redis executes to completion without interleaving, so the refill computation and the decrement happen as one indivisible step and return the remaining budget in the same round trip.',
        category: 'Correctness',
        difficulty: 'medium',
      },
      {
        question: 'What happens when the Redis holding your counters becomes unreachable?',
        answer:
          'That has to be a decided policy, not an accident. Failing open keeps the API serving but removes all protection, which is usually right for a customer-facing product and wrong for a login endpoint. Failing closed protects the backend and turns a cache outage into an API outage. The practical middle ground is to fall back to the last local lease and a conservative local limit, so nodes degrade to approximate enforcement instead of none.',
        category: 'Reliability',
        difficulty: 'hard',
      },
      {
        question: 'Why is limiting by IP address alone a problem?',
        answer:
          'One address does not mean one caller. Behind carrier-grade NAT a single IPv4 address can represent tens of thousands of mobile subscribers, so a limit tight enough to stop an attacker locks out everyone sharing it. The reverse also holds: a mobile client changes address as it roams and a cloud attacker rotates through a large pool, resetting the counter for free. Use IP generously before authentication and switch to identity afterwards.',
        category: 'Keying',
        difficulty: 'easy',
      },
      {
        question: 'When would you use a concurrency limit instead of a rate limit?',
        answer:
          'When the constraint is simultaneity rather than volume. An endpoint that holds a database connection for three seconds exhausts a pool of 20 connections with 20 simultaneous callers regardless of the arrival rate, so the right control is an in-flight counter incremented on entry and decremented on completion. Expressing it as requests per second is wrong in both directions, because many fast calls are harmless and a few slow ones are not.',
        category: 'Algorithms',
        difficulty: 'medium',
      },
      {
        question: 'How do you keep one large tenant from starving small ones?',
        answer:
          'Give every tenant its own budget rather than sharing one global limit, and reserve a floor of capacity for the long tail so a single customer cannot claim all of it. Add a per-endpoint dimension to the key so an export job cannot spend the allowance interactive traffic needs, and apply weighted fair queueing or priority-based shedding above the limits so that when the service is genuinely full, the loss is distributed rather than concentrated on whoever is slowest to retry.',
        category: 'Fairness',
        difficulty: 'hard',
      },
      {
        question: 'What should a 429 response contain?',
        answer:
          'Retry-After in seconds, computed from the refill rate rather than guessed, plus the limit, the remaining count, and the reset time. The body should name which scope was hit — per-second rate, burst, concurrency, or monthly quota — because the correct client behaviour differs for each. Returning a bare 429 leaves a client with nothing to do except retry immediately, which converts your rejection into a second load problem.',
        category: 'Contract',
        difficulty: 'easy',
      },
      {
        question: 'How do rate limits and quotas differ in implementation?',
        answer:
          'A rate limit is a small, hot, per-key counter that resets continuously and must be read on the request path, so it lives in memory or Redis. A quota is a monotonically increasing monthly total that feeds billing, so it must survive a cache eviction and is aggregated durably, usually asynchronously from the same counters. Reading a quota on every request would be wasteful; checking it once per window and caching the verdict is enough.',
        category: 'Quotas',
        difficulty: 'medium',
      },
      {
        question: 'Where does load shedding fit if you already have rate limits?',
        answer:
          'Rate limits are per caller and are configured ahead of time, so they cannot know that the fleet is currently at 95% CPU. Load shedding is the aggregate, reactive control: when a health signal degrades, the gateway rejects requests by priority, dropping background and batch traffic before interactive traffic. Needing to shed regularly is evidence that the sum of the configured limits exceeds deployed capacity, which is a planning problem rather than an algorithm problem.',
        category: 'Reliability',
        difficulty: 'hard',
      },
    ],
  }),
};
