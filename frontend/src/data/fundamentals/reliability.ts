import { ArchitectureTopic, emptyContent } from '../systemDesignTypes';

export const reliabilityTopic: ArchitectureTopic = {
  id: 'reliability',
  title: 'Reliability, Failure and Graceful Degradation',
  description:
    'Every dependency will fail. The design question is not how to prevent that but what your system does in the thirty seconds afterwards, and whether it makes things better or worse.',
  difficulty: 'Advanced',
  progress: 0,
  icon: 'Shield',
  color: 'bg-red-600',
  section: 'fundamentals',
  track: 'classic',
  prerequisites: ['load-balancer', 'message-queues'],
  estimatedMinutes: 70,
  order: 21,
  content: emptyContent({
    overview:
      'Reliability is not the absence of failure; it is the property that failures stay small. A distributed system is a large number of components each of which is individually quite reliable, which means that at any moment something is broken and the interesting question is whether that fact is visible to a user. Most serious outages are not caused by the original fault. They are caused by the system reaction to it: retries that multiply load, timeouts that outlive the user, queues that grow without bound, and health checks that remove healthy capacity. This lesson is about the handful of patterns that keep a partial failure partial.',
    whyItExists:
      'A single machine either works or it does not, and you can reason about it. A system of forty services has no such state; it is always partially degraded. Without explicit timeouts, bulkheads, and circuit breakers, a slowdown in one unimportant dependency propagates upward by consuming threads and connections everywhere it is called, and a recommendation service nobody would miss takes down checkout.',
    problemStatement: {
      prompt:
        'Your checkout page calls seven internal services. One of them, the loyalty points service, starts responding in 8 seconds instead of 40 milliseconds. Within ninety seconds checkout is fully down even though six of the seven dependencies are healthy. Explain the mechanism precisely, then design the system so this failure costs users only the points display.',
      inScope: [
        'Timeouts, retries, backoff, jitter, and retry budgets',
        'Circuit breakers, bulkheads, and load shedding',
        'Failure modes: cascading, correlated, grey, and metastable',
        'SLOs, error budgets, and how availability composes',
      ],
      outOfScope: [
        'Metrics, tracing, and alerting mechanics (see the Observability lesson)',
        'Replication and failover of the data tier (see Replication)',
        'Deployment safety and rollback (see Deployments)',
        'Consensus protocols (see Consensus and Coordination)',
      ],
    },
    assumptions: [
      'Every remote call can hang, fail, or return slowly, and the slow case is the dangerous one',
      'Some dependencies are optional to the user outcome and some are not, and you can tell which',
      'Retries are enabled somewhere in your stack whether or not you configured them deliberately',
    ],
    whenToUse: [
      'Any synchronous call to a service, database, or third party you do not control',
      'Any request path with more than two hops, where latency and failure probability compound',
      'Any dependency whose failure should be survivable, which is most of them',
    ],
    functionalRequirements: [
      { title: 'Bound every wait', detail: 'No outbound call may block indefinitely; every one carries a connect timeout and a request timeout derived from the caller budget.' },
      { title: 'Fail open where the outcome allows', detail: 'An optional dependency that is unavailable returns a defined fallback, not an exception that propagates to the user.' },
      { title: 'Stop calling a dead dependency', detail: 'After a threshold of failures the caller short-circuits rather than queueing more work against something that is not answering.' },
      { title: 'Shed rather than collapse', detail: 'Beyond a known capacity the service rejects work quickly with a 429 or 503 instead of accepting everything and timing out at the client.' },
    ],
    nonFunctionalRequirements: [
      { title: 'Blast radius', detail: 'A single failed dependency degrades one feature, never the whole page, and never a second unrelated service.' },
      { title: 'Time to detect and shed', detail: 'A breaker should open within a few seconds of a dependency going bad, not after a minute of accumulated timeouts.' },
      { title: 'Recovery without a thundering herd', detail: 'When the dependency returns, traffic must ramp rather than resume at full volume the same instant across every caller.' },
      { title: 'Availability target', detail: 'A stated SLO with an error budget, so the team knows how much unreliability is acceptable before feature work stops.' },
    ],
    estimates: [
      { label: 'Serial availability', value: '7 dependencies at 99.9% each ≈ 99.3%', note: 'That is roughly 61 hours of downtime a year from composition alone' },
      { label: 'Same, with fallbacks', value: '2 required at 99.9%, 5 optional ≈ 99.8%', note: 'Making a dependency optional is worth more than making it more reliable' },
      { label: 'Retry amplification', value: '3 retries × 3 hops = up to 27× load', note: 'Retrying at every layer of a call chain multiplies, it does not add' },
      { label: 'Thread exhaustion', value: '200 threads ÷ 8 s hang = 25 req/s before saturation', note: 'The same pool at 40 ms handles 5,000 req/s, a 200× collapse' },
      { label: 'Error budget', value: '99.9% monthly = 43 minutes', note: '99.99% is 4.3 minutes, which usually rules out any manual response' },
      { label: 'Timeout budget', value: 'User 2 s, gateway 1.8 s, service 900 ms, database 300 ms', note: 'Each layer must be strictly shorter than its caller or the timeout never fires usefully' },
    ],
    concepts: [
      'Timeout budget and deadline propagation',
      'Exponential backoff with full jitter',
      'Retry budgets and retry amplification',
      'Circuit breaker: closed, open, half-open',
      'Bulkhead isolation and per-dependency pools',
      'Load shedding and admission control',
      'Graceful degradation and static fallbacks',
      'Cascading, correlated, grey, and metastable failure',
      'Idempotency keys and safe retries',
      'SLI, SLO, error budget, blameless postmortem',
    ],
    comparisons: [
      {
        title: 'Failure modes and what actually stops them',
        headers: ['Mode', 'What happens', 'Why it spreads', 'What stops it'],
        rows: [
          [
            'Cascading',
            'One slow service consumes the caller threads, so the caller becomes slow, and so on up the chain',
            'Every caller blocks on the same shared pool',
            'Timeouts shorter than the caller budget, bulkheads, circuit breakers',
          ],
          [
            'Retry storm',
            'A brief blip triggers retries at every layer, and the multiplied load prevents recovery',
            'Retries compound multiplicatively across hops',
            'Retry budgets, retry only at the edge, backoff with full jitter',
          ],
          [
            'Correlated',
            'Instances fail together because they share a zone, a deploy, a config push, or a certificate expiry',
            'Redundancy was never independent in the first place',
            'Spread across zones, staged rollouts, staggered certificate and token expiry',
          ],
          [
            'Grey',
            'A node is slow or returns wrong answers but passes its health check, so it keeps receiving traffic',
            'Liveness checks measure the process, not the work',
            'Deep health checks, outlier ejection on latency and error rate, client-side hedging',
          ],
          [
            'Metastable',
            'The system stays down after the trigger is gone, because the recovery load exceeds capacity',
            'Cold caches plus queued retries create a load higher than steady state',
            'Load shedding, gradual traffic ramp, cache warming, queue draining before reopening',
          ],
          [
            'Thundering herd',
            'Every client reconnects or refetches in the same instant after an outage',
            'Synchronised timers and identical backoff',
            'Full jitter, staggered reconnect windows, server-assigned retry-after',
          ],
        ],
      },
      {
        title: 'Resilience patterns',
        headers: ['Pattern', 'How it works', 'Protects against', 'Cost'],
        rows: [
          ['Timeout', 'Abandon a call after a fixed deadline derived from the caller budget', 'Unbounded resource occupancy', 'Abandons work that might have succeeded a moment later'],
          ['Retry with backoff and jitter', 'Retry a failed idempotent call after a randomised, growing delay', 'Transient packet loss and brief blips', 'Multiplies load exactly when the dependency is weakest'],
          ['Circuit breaker', 'Track the recent failure rate; above a threshold reject immediately without calling', 'Cascading failure and wasted latency', 'Rejects requests during the window when the dependency has just recovered'],
          ['Bulkhead', 'Give each dependency its own bounded connection or thread pool', 'One slow dependency starving all others', 'Lower peak utilisation, since pools cannot borrow from each other'],
          ['Load shedding', 'Reject low-value work fast once concurrency or queue depth exceeds a threshold', 'Total collapse under overload', 'Some users get an explicit error instead of a slow success'],
          ['Hedged request', 'After the p95 latency, send a duplicate to another replica and take the first answer', 'Grey failures and tail latency', 'Roughly 5% extra load, and requires idempotence'],
          ['Fallback', 'Return cached, stale, or static content when the dependency is unavailable', 'A single optional feature taking down a page', 'The answer may be wrong or old, which must be acceptable'],
        ],
      },
      {
        title: 'What an availability number actually costs you',
        headers: ['SLO', 'Downtime per month', 'Downtime per year', 'What it implies'],
        rows: [
          ['99%', '7.2 hours', '3.65 days', 'A single instance with manual restarts'],
          ['99.9%', '43 minutes', '8.8 hours', 'Redundant instances, health checks, an on-call rotation'],
          ['99.99%', '4.3 minutes', '52 minutes', 'Multi-zone, automated failover, no human in the recovery path'],
          ['99.999%', '26 seconds', '5.3 minutes', 'Multi-region active-active, and usually more than it is worth'],
        ],
        note: 'Availability composes multiplicatively along a serial call chain, so ten dependencies at 99.99% give you 99.9%. The cheapest way to raise a number is almost always to remove a dependency from the required path, not to make it more reliable.',
      },
    ],
    architecture:
      'Every outbound call is wrapped in a client that owns four things: a deadline inherited from the incoming request, its own bounded connection pool, a circuit breaker keyed on the dependency, and a declared fallback. The gateway stamps a deadline on arrival and each hop passes the remaining budget downstream, so nobody waits on work the user has already abandoned. Optional dependencies such as recommendations and loyalty points are called with short timeouts and fall back to cached or empty responses; required dependencies such as payment and inventory fail the request explicitly. Above a measured concurrency limit the service sheds, returning 503 with a Retry-After rather than accepting work it cannot finish. Retries exist only at the edge, are budgeted to roughly 10% of traffic, and use full jitter.',
    diagrams: [
      { id: 'storm', title: 'How three retries at three hops becomes 27× load', kind: 'excalidraw', src: 'retry-storm' },
      { id: 'anim', title: 'A circuit breaker opening and probing', kind: 'animation', src: 'circuit-breaker' },
    ],
    walkthrough: [
      {
        title: 'Trace the actual mechanism of the outage',
        description:
          'The loyalty service slows from 40 ms to 8 s. Checkout has 200 request threads and calls loyalty synchronously, so each in-flight checkout now holds a thread for 8 seconds instead of 40 milliseconds. At 25 requests per second the pool is fully occupied; above that, new requests queue and then time out at the load balancer. Six healthy dependencies are irrelevant because there is no thread left to call them. Nothing crashed, no error was logged by loyalty, and the page is down. This is the shape of nearly every cascading outage.',
      },
      {
        title: 'Give every call a deadline, derived not guessed',
        description:
          'Start from the user-facing budget, say 2 seconds, and subdivide downward: the gateway allows 1.8 s, checkout allows 900 ms per service call, the database allows 300 ms. Each layer must be strictly shorter than its caller, otherwise the caller gives up first and the inner timeout never does anything except hold a connection open for work nobody is waiting on. Propagate the remaining budget in a header or context so a service that receives a request with 120 ms left does not start a 900 ms query.',
      },
      {
        title: 'Separate required from optional and declare fallbacks',
        description:
          'Walk the seven dependencies and mark each one. Payment and inventory are required: if they fail the order must fail, loudly and safely. Loyalty points, recommendations, recently viewed, and shipping estimates are optional: each gets a short timeout, perhaps 150 ms, and a defined fallback of cached, stale, or absent. This single classification is worth more than any amount of retry tuning, because it converts an outage into a slightly diminished page.',
      },
      {
        title: 'Isolate the pools so one dependency cannot starve the rest',
        description:
          'Replace the single shared thread and connection pool with a bulkhead per dependency: 20 permits for loyalty, 50 for inventory, 50 for payment. Now a hung loyalty service can occupy at most its own 20 permits, and the twenty-first call is rejected instantly and takes its fallback. The pool sizing is deliberate rather than generous, because a bulkhead that is large enough never to reject is not a bulkhead.',
        animation: 'circuit-breaker',
      },
      {
        title: 'Open a breaker so you stop paying the timeout',
        description:
          'Even with a bulkhead you are still paying 150 ms per doomed call. A circuit breaker watches the rolling failure rate over a window, say 20 requests, and once more than half fail it opens and rejects instantly for perhaps 10 seconds. After that it moves to half-open and lets a small number of probe requests through: if they succeed it closes, if they fail it reopens with a longer wait. The saving is not only latency; it is that the recovering dependency receives a trickle instead of the full firehose.',
      },
      {
        title: 'Fix retries before they multiply',
        description:
          'Audit where retries live. Three retries at each of three hops is up to 27 times the original load, delivered precisely when the system is weakest. Retry at the edge only, cap the total to a budget of about 10% of requests so a broad failure cannot amplify at all, use full jitter so the delay is random between zero and the backoff ceiling rather than a synchronised wave, and retry only calls that are idempotent or carry an idempotency key.',
      },
      {
        title: 'Shed load instead of accepting work you cannot finish',
        description:
          'Measure the concurrency at which p99 latency starts climbing and make that an admission limit. Beyond it, return 503 with a Retry-After immediately. A rejected request costs a millisecond; an accepted request that times out costs the full budget and still fails, while occupying resources that would have served someone successfully. Shed by value where you can, so health checks and paying customers survive while crawlers and prefetches are dropped first.',
      },
      {
        title: 'Rehearse the failure rather than assuming the design works',
        description:
          'Inject the fault deliberately: add 8 seconds of latency to loyalty in staging, and later in production for 1% of traffic, and watch whether checkout stays up. Most resilience configuration is wrong in a way that is only visible under the real failure, typically a timeout that is longer than its caller or a fallback that itself calls the failing service. Game days and automated fault injection are the only way to find that before an incident does.',
      },
    ],
    deepDives: [
      {
        title: 'Why a slow dependency is worse than a dead one',
        body:
          'A dependency that refuses connections fails in a millisecond, and your caller moves on almost immediately. A dependency that accepts the connection and then takes 8 seconds holds one of your threads, one of your connections, and one slot in your load balancer for the whole duration. Little law makes the arithmetic brutal: concurrency equals arrival rate times service time, so a service handling 5,000 requests per second at 40 ms needs 200 concurrent slots, and the same traffic at 8 seconds needs 40,000. You have 200. Everything above the first 25 requests per second queues and then times out. This is why the fastest possible failure is a feature, why timeouts matter more than retries, and why some systems deliberately fail a connection rather than accept one they cannot serve promptly.',
      },
      {
        title: 'Retry amplification and the retry budget',
        body:
          'Retries feel local and behave globally. If the gateway retries three times, the service it calls also retries three times, and the data client retries three times, a single user request can become 27 backend calls. During a partial failure that turns a dependency at 70% capacity into one at 1,900% and guarantees it never recovers. Two rules contain this. First, retry at one layer only, normally the outermost one that knows the user intent, and make inner layers fail fast. Second, use a retry budget rather than a per-request count: allow retries only while they are under roughly 10% of total requests in a rolling window, so a healthy system retries freely and a broadly failing one stops retrying automatically. Add full jitter, meaning a delay drawn uniformly from zero to the current backoff ceiling rather than the ceiling itself, because synchronised backoff simply reschedules the storm.',
      },
      {
        title: 'The circuit breaker state machine, and the half-open trap',
        body:
          'A breaker has three states. Closed passes traffic while counting outcomes in a rolling window; you need a minimum volume, perhaps 20 requests, before the rate means anything, otherwise two failures out of two will trip it. Open rejects instantly for a cooldown, typically 5 to 30 seconds, returning the fallback without touching the dependency. Half-open is the subtle one: it admits a small number of probes, and the common bug is admitting all traffic at once, which re-kills a dependency that was seconds from recovering and produces a flapping cycle. Allow perhaps 1 to 5 concurrent probes, require several consecutive successes before closing, and back off the open duration exponentially on repeated failure. Key the breaker per dependency and often per endpoint, because a slow search endpoint should not stop you writing to the same service.',
      },
      {
        title: 'Bulkheads: the pattern that actually contains blast radius',
        body:
          'The name comes from ship compartments, and the analogy is exact: a hull breach floods one compartment rather than the vessel. In software the bulkhead is a bounded, per-dependency pool of threads, connections, or semaphore permits. A checkout service with a single 200-thread pool shared across seven dependencies has no isolation at all, because whichever dependency is slowest will eventually own every thread. Splitting it into per-dependency allocations, say 20 for loyalty and 50 each for payment and inventory, caps the damage arithmetically. The uncomfortable part is that bulkheads reduce peak utilisation, because loyalty cannot borrow idle payment threads even when payment is quiet. That is the price of isolation, and it is almost always worth paying. The same idea scales upward as cell-based architecture, where entire independent copies of the stack serve disjoint slices of users so a bad shard affects 5% of them.',
      },
      {
        title: 'Load shedding beats queueing under overload',
        body:
          'When arrival rate exceeds capacity, a queue does not help, it only delays the failure and makes it worse. Requests accumulate, each one waits longer, and eventually every response is delivered after the client has already given up, so the system does the work and nobody benefits, a state called congestive collapse. Shedding inverts this: measure the concurrency at which p99 latency begins to rise, treat that as an admission limit, and reject anything beyond it in under a millisecond with a 503 and a Retry-After. Adaptive algorithms such as gradient limiting adjust that ceiling automatically by watching latency, which is far more robust than a hand-tuned constant. Shed by priority so that internal health checks, paying customers, and in-flight checkouts survive while crawlers, prefetches, and background sync are dropped first. Bounded queues with a short timeout are the same idea in queue form: a queue you cannot drain in a few seconds should be rejecting, not growing.',
      },
      {
        title: 'Grey failure, health checks, and why a node lies',
        body:
          'The failure that survives longest is the one that looks healthy. A node with a corrupted disk, an exhausted connection pool, or a slow garbage collector still answers a shallow /health probe with 200, so the load balancer keeps sending it a full share of traffic while it fails or delays every real request. Fixing this needs two layers. Deep health checks verify that the node can actually do its job, including reaching its critical dependencies, but they must be careful: if the check fails whenever a shared database is slow, every node fails its check at once and the load balancer removes the entire fleet, converting a slow dependency into a total outage. The second layer is outlier detection at the caller or proxy, ejecting an instance whose error rate or latency is a significant multiple of its peers, which catches the cases a self-report never will. Hedged requests are the last resort: after the p95 latency, send a duplicate to a different replica and take whichever answers first, which removes most tail latency for about 5% extra load.',
      },
      {
        title: 'Metastable failure: why the system stays down after the cause is gone',
        body:
          'The most confusing outages are the ones where you fix the trigger and nothing improves. The pattern is a feedback loop that sustains itself. A brief database blip causes timeouts, timeouts cause retries, retries evict the cache because the retry path repopulates differently, and the cold cache now sends far more traffic to the database than steady state ever did. The database stays saturated on load that the original trigger no longer generates. Escaping requires deliberately reducing load below the level that sustains the loop, which almost always means shedding aggressively, draining the retry backlog, warming caches before reopening, and then ramping traffic back in steps rather than restoring it at once. Designing against it means capping retries with budgets, keeping cache TTLs jittered so a flush does not synchronise, and building an explicit way to admit traffic gradually, because a load balancer that returns all instances to the pool simultaneously will simply restart the loop.',
      },
      {
        title: 'SLOs and error budgets as a design constraint',
        body:
          'An SLO turns reliability from an argument into arithmetic. Pick a service level indicator that reflects the user experience, such as the proportion of checkout requests served successfully in under 500 ms, set a target such as 99.9% over 28 days, and the remaining 0.1% is the error budget: about 43 minutes. The budget is a currency. While it is unspent you can ship aggressively, deploy on Fridays, and run experiments. When it is exhausted, feature work stops until reliability is repaid. This also disciplines design, because availability composes multiplicatively: seven required dependencies at 99.9% each yield 99.3%, roughly 61 hours of downtime a year, before your own code fails at all. The insight that follows is that making a dependency optional almost always buys more availability than making it more reliable, and it is far cheaper.',
      },
    ],
    tradeoffs: [
      'Short timeouts fail fast and abandon requests that would have completed a moment later.',
      'Retries recover transient failures and multiply load exactly when the dependency is weakest.',
      'Bulkheads contain blast radius and lower peak utilisation, because pools cannot share capacity.',
      'Fallbacks keep the page up and can silently serve a wrong or stale answer if you do not surface it.',
      'Deep health checks catch grey failures and risk removing the entire fleet on one shared dependency.',
      'A higher availability target costs disproportionately more; each additional nine is roughly ten times the effort.',
    ],
    bottlenecks: [
      'A single shared thread or connection pool, which turns one slow dependency into total unavailability.',
      'Retry logic at multiple layers, multiplying rather than adding.',
      'Unbounded queues that convert overload into delayed failure and congestive collapse.',
      'Shallow health checks that keep grey nodes in rotation.',
      'Correlated redundancy, where every replica shares a zone, a deploy, or a certificate expiry.',
      'Recovery paths that resume full traffic instantly and re-trigger the failure.',
    ],
    scalingPath: [
      { scale: 'Prototype', focus: 'Explicit timeouts on every call, retries at the edge only, health checks wired to the load balancer' },
      { scale: 'One region', focus: 'Circuit breakers and bulkheads per dependency, declared fallbacks, load shedding, SLOs with error budgets, fault injection in staging' },
      { scale: 'Global', focus: 'Cell-based isolation, multi-region failover with gradual ramp, adaptive concurrency limits, production game days and continuous chaos testing' },
    ],
    interviewScript: [
      '"Before I add redundancy I want to know which dependencies are required for the user outcome and which are optional, because making one optional buys more availability than making it more reliable."',
      '"Every call gets a deadline derived from the user budget: 2 s at the edge, 900 ms per service, 300 ms at the database, and the remaining budget is propagated downstream."',
      '"Each dependency gets its own bounded pool, so a hang can occupy 20 permits rather than all 200 threads."',
      '"Retries live at the edge only, under a 10% budget with full jitter, otherwise three hops of three retries is 27 times the load."',
      '"Above the concurrency where p99 starts climbing I shed with a 503 and a Retry-After, because an accepted request that times out costs more than a rejected one."',
      '"Recovery is ramped, not instant, because a cold cache plus a queued retry backlog is exactly how an outage becomes metastable."',
    ],
    commonMistakes: [
      'Using a default or infinite timeout, so a hung dependency holds resources until the process is restarted.',
      'Setting an inner timeout longer than the caller budget, so the caller abandons first and the inner one never fires.',
      'Retrying at every layer, converting a small failure into a self-sustaining retry storm.',
      'Retrying non-idempotent writes without an idempotency key, producing duplicate charges or orders.',
      'Sharing one thread pool across all dependencies, so any single slowdown becomes total unavailability.',
      'Health checks that only prove the process is alive, leaving grey nodes serving errors at full share.',
      'A fallback path that itself calls the failing dependency, so degradation fails exactly when it is needed.',
      'Restoring full traffic the instant a dependency recovers, re-killing it and starting a flap cycle.',
      'Treating a 99.99% target as free when the dependency chain mathematically cannot exceed 99.3%.',
    ],
    relatedTopics: ['load-balancer', 'observability', 'message-queues', 'rate-limiting', 'deployments'],
    examples: [
      'Netflix Hystrix popularised per-dependency bulkheads and breakers, and its successors keep the same fallback-first shape',
      'AWS internal services propagate a request deadline so no service starts work the caller has already abandoned',
      'Google SRE practice ties feature launches to an error budget, so reliability debt stops the roadmap rather than being argued about',
    ],
    practicePrompt:
      'A checkout page calls seven services and one of them slows to 8 seconds. Walk through the exact mechanism by which the page goes down, then specify the timeout budget, bulkhead sizes, breaker thresholds, and fallback for each dependency so that the same failure costs users only the loyalty points display.',
    followUps: [
      {
        question: 'Why is a slow dependency more dangerous than one that is completely down?',
        answer:
          'A refused connection returns in about a millisecond and the caller moves on. A slow one holds a thread, a connection, and a load balancer slot for its full duration. By Little law, concurrency equals arrival rate times service time, so traffic that needed 200 concurrent slots at 40 ms needs 40,000 at 8 seconds. The pool saturates, unrelated dependencies become uncallable because no thread is free, and the caller goes down while every other dependency is healthy.',
        category: 'Failure modes',
        difficulty: 'medium',
      },
      {
        question: 'How do you actually choose a timeout value?',
        answer:
          'Work down from the user-facing budget rather than up from the dependency. If the page must answer in 2 seconds, the gateway gets 1.8 s, a service call gets 900 ms, and a database query gets 300 ms, so every layer is strictly shorter than its caller. Sanity check each against the observed p99 of that call: a timeout below p99 will fail healthy requests, and one far above it stops being a protection. Then propagate the remaining budget downstream so late-arriving requests do not start long work.',
        category: 'Timeouts',
        difficulty: 'medium',
      },
      {
        question: 'What is full jitter and why not just use exponential backoff?',
        answer:
          'Plain exponential backoff makes every failed client wait the same 1, 2, 4, 8 seconds, so a thousand clients that failed together retry together and the recovering dependency is hit by a synchronised wave each round. Full jitter draws the delay uniformly between zero and the current ceiling, which spreads the same retries smoothly across the interval. It converges faster in practice and, more importantly, it removes the periodic load spikes that keep a struggling dependency from ever recovering.',
        category: 'Retries',
        difficulty: 'easy',
      },
      {
        question: 'What is a retry budget and why is it better than a retry count?',
        answer:
          'A count is per-request and has no idea what the rest of the system is doing, so during a broad failure every request retries three times and load triples exactly when capacity is lowest. A budget is global: allow retries only while retries are under roughly 10% of requests in a rolling window. A healthy system with occasional blips retries freely, and a system where most calls are failing stops retrying automatically. It converts retry behaviour from a per-request decision into a system-level safety valve.',
        category: 'Retries',
        difficulty: 'hard',
      },
      {
        question: 'Where does a circuit breaker most commonly go wrong?',
        answer:
          'In half-open. The frequent bug is admitting all traffic the moment the cooldown ends, which slams a dependency that was seconds from recovering and produces an open-closed flap. Allow only a few concurrent probes and require several consecutive successes before closing. The second common bug is tripping on too little data: without a minimum request volume of around 20, two failures out of two reads as a 100% failure rate. The third is one breaker for a whole service instead of per endpoint.',
        category: 'Circuit breakers',
        difficulty: 'hard',
      },
      {
        question: 'Why shed load rather than queue it?',
        answer:
          'Because a queue under sustained overload only delays the failure. Requests accumulate, each waits longer, and eventually every response arrives after the client has given up, so you burn full capacity producing answers nobody receives. Rejecting in under a millisecond with a 503 and a Retry-After frees that capacity for requests you can actually complete, and it gives the client a clear signal to back off. A bounded queue with a short timeout is the same idea: past a point, growing is strictly worse than refusing.',
        category: 'Overload',
        difficulty: 'medium',
      },
      {
        question: 'How do you retry a payment without charging the customer twice?',
        answer:
          'The client generates an idempotency key, typically a UUID tied to the checkout attempt, and sends it with every attempt including retries. The payment service stores the key with the result in a uniquely indexed table before performing the charge. A retry carrying a key that already exists returns the stored result rather than charging again. Keys need a retention window long enough to cover any plausible retry, usually 24 hours, and the uniqueness must be enforced by the database rather than by an application check.',
        category: 'Correctness',
        difficulty: 'medium',
      },
      {
        question: 'How can a deep health check make an outage worse?',
        answer:
          'If the check fails whenever a shared dependency is slow, then every instance fails simultaneously, the load balancer removes the entire fleet, and a partially degraded service becomes a total outage. The rule is that a health check should report whether this instance is worse than its peers, not whether the world is healthy. Keep dependency checks out of the signal used for pool membership, or make them advisory, and rely on outlier ejection at the caller to catch instances that are genuinely bad relative to the others.',
        category: 'Health checks',
        difficulty: 'hard',
      },
      {
        question: 'What is a metastable failure and how do you get out of one?',
        answer:
          'It is an outage that sustains itself after the trigger is gone, because the recovery load exceeds capacity. A blip causes timeouts, timeouts cause retries, retries flush the cache, and the cold cache now generates more database load than normal traffic ever did. Restarting does not help because the backlog returns immediately. You escape by deliberately reducing load below the sustaining threshold: shed aggressively, drain the retry backlog, warm caches, then ramp traffic back in steps rather than restoring it all at once.',
        category: 'Failure modes',
        difficulty: 'hard',
      },
      {
        question: 'You are asked for 99.99% availability on a service with seven dependencies. What do you say?',
        answer:
          'That it is arithmetically impossible as specified. Seven required dependencies at 99.9% each compose to about 99.3%, roughly 61 hours a year, before your own code contributes a single failure. So the first move is not more redundancy but reducing the required set: classify each dependency, give the optional ones short timeouts and fallbacks, and you might reach 99.8% with two required. Beyond that you need multi-zone redundancy with automated failover, because 4.3 minutes a month leaves no room for a human to respond.',
        category: 'SLOs',
        difficulty: 'medium',
      },
    ],
  }),
};
