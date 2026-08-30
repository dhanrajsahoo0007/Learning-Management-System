import { ArchitectureTopic, emptyContent } from '../systemDesignTypes';

export const loadBalancerTopic: ArchitectureTopic = {
  id: 'load-balancer',
  title: 'Load Balancing',
  description:
    'Choosing which backend serves a request, at which network layer that choice is made, and how a machine is added or removed without dropping anything.',
  difficulty: 'Intermediate',
  progress: 0,
  icon: 'Split',
  color: 'bg-indigo-600',
  section: 'fundamentals',
  track: 'classic',
  prerequisites: ['interview-approach'],
  estimatedMinutes: 80,
  order: 10,
  content: emptyContent({
    overview:
      'A load balancer is the component that turns a pool of interchangeable machines into one address. Two questions decide everything about it: at which network layer does it make the decision, and by what rule does it pick a backend. A layer 4 balancer moves packets and knows only addresses and ports; a layer 7 balancer terminates the connection, reads the request, and can route on a path or a header. Real systems stack both, and the interesting engineering is in health checks, draining, and the fact that the balancer is itself a machine that can fail.',
    whyItExists:
      'One server has a ceiling and will eventually be restarted, redeployed, or lost, and clients cannot be asked to track which machines are currently alive. A load balancer provides one stable entry point and hides the churn behind it.',
    problemStatement: {
      prompt:
        'An API receives 40,000 requests per second from three continents, served by 200 stateless instances across two regions that are deployed several times a day. Design the entry path. Decide which layer makes which decision, which algorithm picks a backend, and how a deploy removes an instance without failing a single in-flight request.',
      inScope: [
        'Layer 3, 4, and 7 balancing and what each can see',
        'Selection algorithms and how each one picks a backend',
        'Health checking, warm-up, draining, and outlier ejection',
        'TLS handling, client identity, and stickiness',
      ],
      outOfScope: [
        'DNS record types and TTL mechanics (see the DNS lesson)',
        'Rate limiting algorithms (see the rate limiting lesson)',
        'API gateway concerns such as authentication and transformation',
        'Autoscaling policy and capacity planning',
      ],
    },
    assumptions: [
      'Application instances are stateless, so any instance can serve any request',
      'Instances are replaced continuously by deploys and autoscaling',
      'Clients are ordinary HTTP and gRPC callers you do not control',
    ],
    whenToUse: [
      'The moment you have more than one instance of anything, including the balancer itself',
      'Rolling deploys and instance replacement without a maintenance window',
      'Steering traffic between regions, and shifting a percentage during a canary',
    ],
    functionalRequirements: [
      { title: 'Distribute requests', detail: 'Spread load across healthy backends according to a stated algorithm.' },
      { title: 'Remove unhealthy backends', detail: 'Detect failure by active probes and passive error observation, then stop sending traffic.' },
      { title: 'Route by request content', detail: 'At layer 7, send /api to one pool and /images to another, and split a canary by header.' },
      { title: 'Add and remove capacity safely', detail: 'Warm a new instance up gradually and drain an old one before it stops.' },
    ],
    nonFunctionalRequirements: [
      { title: 'Latency overhead', detail: 'A layer 7 hop adds roughly 30–80 µs of processing; a layer 4 hop is close to line rate.' },
      { title: 'Availability', detail: 'The balancer must be redundant, since it is on the path of every single request.' },
      { title: 'Failure detection time', detail: 'Two failed probes at a two second interval means about four seconds of errors.' },
      { title: 'Fairness', detail: 'No backend should carry more than a small multiple of the mean, even with uneven request costs.' },
    ],
    estimates: [
      { label: 'Layer 7 proxy overhead', value: '30–80 µs per hop, plus 1–2 ms for a full TLS handshake', note: 'Session resumption removes most of the handshake cost' },
      { label: 'Layer 4 throughput', value: '1–4 million packets/s per modern core with IPVS or DSR', note: 'Direct server return means responses bypass the balancer entirely' },
      { label: 'Ephemeral port ceiling', value: '~64,000 connections per source IP to one backend IP and port', note: 'A busy proxy fleet needs more source addresses, not more CPU' },
      { label: 'Health check load', value: '200 backends × 1 probe / 2 s × 4 balancers = 400 probes/s', note: 'A deep probe that queries the database turns this into 400 queries/s' },
      { label: 'Failover window', value: 'Anycast withdrawal 1–5 s versus a 60 s DNS TTL', note: 'This is why the global tier steers and the regional tier decides' },
    ],
    concepts: [
      'Layer 3 anycast, layer 4 transport, layer 7 application',
      'Virtual IP, direct server return, connection tracking',
      'Round robin, weighted, least connections, least response time',
      'Consistent hashing and random two choices',
      'Active health checks versus passive outlier ejection',
      'Slow start, warm-up, connection draining',
      'TLS termination, passthrough, re-encryption',
      'X-Forwarded-For and the PROXY protocol',
    ],
    comparisons: [
      {
        title: 'Algorithms, and how each one picks a backend',
        headers: ['Algorithm', 'How it picks', 'Use when', 'Avoid when'],
        rows: [
          [
            'Round robin',
            'Keeps a rotating index over the healthy pool and hands the next request to the next backend in order',
            'Backends are identical and requests cost roughly the same',
            'Request costs vary widely, since a slow backend receives just as much work',
          ],
          [
            'Weighted round robin',
            'Same rotation, but each backend appears in the rotation in proportion to its weight, so weight 3 receives three times as many turns',
            'Mixed instance sizes, or shifting 5% of traffic to a canary',
            'You want the system to react to real-time load rather than a static number',
          ],
          [
            'Least connections',
            'Keeps a live count of open connections per backend and sends the request to the lowest count, breaking ties by round robin',
            'Long or uneven request durations, such as uploads and report generation',
            'Connections are long-lived and idle, since an idle WebSocket counts the same as a busy one',
          ],
          [
            'Least response time',
            'Tracks an exponentially weighted moving average of recent latency per backend and picks the fastest, usually combined with connection count',
            'Heterogeneous hardware or noisy neighbours, where slowness is not visible in connection count',
            'Traffic is bursty and the average lags, causing the pool to oscillate onto one backend',
          ],
          [
            'IP hash',
            'Hashes the client source address and takes the result modulo the pool size, so one client always maps to one backend',
            'A crude affinity requirement with no cookie support, such as raw TCP',
            'Clients sit behind large NATs, and note that changing pool size remaps nearly everyone',
          ],
          [
            'Random two choices',
            'Picks two backends uniformly at random, then sends the request to whichever of the two has fewer in-flight requests',
            'Large pools and many independent balancers, where global state is unreliable',
            'The pool is tiny, where plain least connections already sees everything',
          ],
          [
            'Consistent hashing',
            'Hashes a key such as a user or cache id onto a ring of virtual nodes and walks clockwise to the owning backend, so adding one node moves only 1/N of keys',
            'Cache locality, session affinity, or sharded in-memory state',
            'Backends must remain interchangeable, or one key is hot enough to overwhelm its owner',
          ],
        ],
        note: 'Two useful defaults: random two choices for stateless HTTP at scale, and consistent hashing whenever a backend holds state derived from the key.',
      },
      {
        title: 'Layer 3 versus layer 4 versus layer 7',
        headers: ['Layer', 'What it can see and do', 'Use when', 'Avoid when'],
        rows: [
          [
            'Layer 3 (anycast)',
            'Announces one IP address from many sites and lets BGP deliver each packet to the nearest one; no request awareness at all',
            'Global entry, DNS infrastructure, DDoS absorption',
            'Long-lived TCP that must not be re-routed mid-connection',
          ],
          [
            'Layer 4 (NLB, IPVS, DSR)',
            'Sees source and destination addresses and ports; forwards or rewrites packets and keeps a connection table, with no visibility into the payload',
            'Extreme throughput, non-HTTP protocols, TLS passthrough to the backend',
            'You need routing by path or header, retries, or per-request load spreading',
          ],
          [
            'Layer 7 (ALB, nginx, Envoy, HAProxy)',
            'Terminates the connection, parses HTTP or gRPC, and can route on host, path, method, or header, retry, rewrite, and multiplex requests onto pooled upstream connections',
            'Ordinary web and API traffic, canaries, per-request balancing over HTTP/2',
            'Encrypted end-to-end traffic it must not decrypt, or a latency budget of microseconds',
          ],
        ],
        note: 'A typical stack uses all three: anycast to reach the region, a layer 4 balancer to spread connections, and a layer 7 proxy to make the per-request decision.',
      },
      {
        title: 'Scope and form',
        headers: ['Choice', 'How it works', 'Use when', 'Avoid when'],
        rows: [
          ['Global (GSLB, DNS)', 'Answers a resolution with an address for a healthy nearby region, or announces anycast', 'Multi-region steering and regional failover', 'You need per-request precision, which a cached answer cannot give'],
          ['Regional', 'One virtual address in front of the instances in a region, layer 4 or layer 7', 'The main entry point for almost every system', 'Never; this tier is the baseline'],
          ['Service mesh sidecar', 'A proxy in each pod balances outbound calls with full knowledge of the callee pool', 'Service-to-service traffic, per-call retries and circuit breaking', 'Small deployments, where the operational cost exceeds the benefit'],
          ['Hardware appliance', 'Purpose-built device, very high throughput, licensed capacity', 'Regulated data centres with existing appliances', 'Cloud environments, where capacity should be elastic'],
          ['Software (nginx, Envoy, HAProxy)', 'Runs on ordinary machines you scale horizontally behind a virtual address', 'You need full control of routing, retries, and observability', 'You have nobody to operate it'],
          ['Managed (ALB, NLB, Cloud LB)', 'Provider-run, autoscaled, integrated with health checks and certificates', 'Default choice in a cloud', 'You need a feature the provider does not expose'],
        ],
      },
    ],
    architecture:
      'Traffic enters on an anycast address at the nearest edge, which forwards into the closest healthy region. Inside the region a layer 4 balancer spreads connections across a fleet of layer 7 proxies, and those proxies terminate TLS and make the per-request decision using random two choices over healthy instances. Every tier is at least two independent units, because a load balancer sits on the path of every request and therefore cannot be a single point of failure.',
    diagrams: [
      { id: 'layers', title: 'Global, L4, then L7', kind: 'excalidraw', src: 'lb-layers' },
      { id: 'anim', title: 'What each layer can see', kind: 'animation', src: 'lb-l4-l7' },
    ],
    walkthrough: [
      {
        title: 'The client reaches an anycast address',
        description:
          'DNS returns a single address that is announced from many locations, so routing carries the packets to the nearest site without any per-user decision. This tier chooses a region, not a machine, and it is the only tier that can move traffic in seconds rather than waiting for a cached DNS answer to expire. It has no idea whether your application is returning errors.',
      },
      {
        title: 'A layer 4 balancer spreads connections',
        description:
          'Inside the region the virtual address is served by a layer 4 balancer that picks a proxy per new connection and records the choice in a connection table so every later packet of that flow goes to the same place. It reads addresses and ports only, which is what lets it run at millions of packets per second. With direct server return the response bypasses the balancer entirely and goes straight to the client.',
        animation: 'lb-l4-l7',
      },
      {
        title: 'A layer 7 proxy terminates TLS and reads the request',
        description:
          'The proxy completes the handshake, parses the request, and now knows the host, path, method, and headers. That is what allows /api and /images to go to different pools and a canary to be selected by a header. It also records the real client address in X-Forwarded-For, because the backend will otherwise see only the proxy address.',
      },
      {
        title: 'An algorithm picks one backend',
        description:
          'For stateless HTTP the proxy samples two healthy instances at random and sends the request to whichever has fewer requests in flight. This approximates least connections without needing one global view, which matters because you have several proxies each making independent decisions. If a backend held per-key state, the proxy would instead hash the key onto a consistent hash ring.',
      },
      {
        title: 'Health signals continuously reshape the pool',
        description:
          'Active probes hit a cheap /healthz on each instance every two seconds and remove it after two consecutive failures, so a dead instance costs about four seconds of errors. Passive outlier ejection watches real traffic and temporarily removes any instance returning an unusual share of 5xx responses or timeouts. The two mechanisms catch different failures: probes catch a dead process, ejection catches a process that is alive and wrong.',
      },
      {
        title: 'Deploys add and remove instances without dropping requests',
        description:
          'A new instance is registered but given slow start, so its weight ramps from near zero to full over 30 to 60 seconds while caches and JIT compilation warm up. A retiring instance is first marked unhealthy so no new requests arrive, then drains for longer than the longest request while finishing what it holds, and only then receives its shutdown signal. Skipping either step is what produces the burst of 502s that everyone blames on the deploy tool.',
      },
    ],
    deepDives: [
      {
        title: 'What each layer can actually see',
        body:
          'A layer 4 balancer inspects the IP and TCP or UDP headers and nothing else. It chooses a backend once per connection and pins the flow in a connection table, so a client that reuses one connection for a thousand requests sends all thousand to the same backend. That is fine for short HTTP/1.1 connections and disastrous for HTTP/2 and gRPC, where one connection carries many streams for hours. A layer 7 proxy terminates the connection, so it decides per request and can multiplex onto its own pooled upstream connections. The cost is CPU, roughly 30 to 80 microseconds per hop plus TLS, and the fact that it must decrypt. Direct server return is the layer 4 trick worth knowing: the balancer rewrites only the inbound packet and the backend replies straight to the client, so a download-heavy service is not limited by balancer bandwidth.',
      },
      {
        title: 'Least connections, and why two random choices beats it',
        body:
          'Least connections works because it responds to real load: a backend stuck on slow requests accumulates connections and stops being chosen. It requires accurate per-backend counts, which is exactly what breaks when eight proxies each balance independently, since each sees only its own share. Worse, a newly added backend has zero connections and every proxy simultaneously decides it is the best choice, so it is flooded the instant it appears. Random two choices fixes both. Sample two backends at random, compare only those two, and pick the lighter one. With 200 backends this brings the maximum load close to the average, within a small constant factor rather than the logarithmic imbalance of pure random, and because it never selects a global minimum it cannot stampede a fresh instance. This is why Envoy and modern service meshes default to it.',
      },
      {
        title: 'Health checks: shallow, deep, and the cascade',
        body:
          'A shallow check asks whether the process is listening and can serve a trivial response. A deep check asks whether the instance can do real work, typically by touching the database and a downstream dependency. Deep checks catch the instance that is up but useless, and they carry a serious failure mode. If the shared database becomes slow, every deep check in the fleet fails at once, so the balancer marks all 200 instances unhealthy and removes the entire pool, converting a degraded database into total unavailability. The mitigations are a fail-open rule that keeps serving when more than half the pool is unhealthy, separating liveness from readiness so a dependency problem does not kill the process, and caching the dependency result inside the check so 400 probes per second do not become 400 database queries per second.',
      },
      {
        title: 'Warm-up, draining, and a deploy that drops nothing',
        body:
          'A cold instance is slow: empty caches, an unfilled connection pool, and interpreted bytecode not yet compiled. Sending it a full share immediately produces a visible latency spike and often a wave of timeouts, which is why slow start ramps its weight from near zero to full over 30 to 60 seconds. Shutdown is the mirror image and is the step teams get wrong. The order must be: mark the instance unhealthy or deregister it, wait long enough for every balancer to observe that, stop accepting new connections while continuing to serve open ones, wait for the longest expected request plus a margin, then send the shutdown signal. If the process exits as soon as it receives the signal, everything in flight becomes a 502, and if it deregisters and exits in the same second, balancers still holding the old view will route to a closed port.',
      },
      {
        title: 'TLS termination, passthrough, and re-encryption',
        body:
          'Termination decrypts at the balancer, which is what makes layer 7 routing, response compression, and request logging possible, and it centralises certificate management so renewal happens in one place. Passthrough forwards the encrypted bytes untouched to the backend, which is required when the backend needs the client certificate or when policy forbids decryption anywhere but the application, and it restricts you to layer 4 decisions. Re-encryption terminates at the edge and opens a second TLS session to the backend, giving you both request awareness and an encrypted internal hop, at the cost of a second handshake and roughly double the crypto work. In a zero-trust internal network, re-encryption or mesh mutual TLS is the normal answer, and the handshake cost is largely removed by keeping upstream connections pooled and warm.',
      },
      {
        title: 'Stickiness is a smell, and what to use instead',
        body:
          'Sticky sessions bind a client to one backend, either by a cookie the balancer issues or by hashing the source address. Cookie affinity is the more precise of the two; source-IP affinity fails badly because a corporate NAT or a mobile carrier gateway presents thousands of users as one address, which produces a hot backend. Both are a smell because they mean state lives in a process rather than in a store, and that has consequences: a deploy logs those users out, autoscaling cannot rebalance existing sessions, and the load distribution now depends on client behaviour. The fix is to move session state to Redis or a signed token so any instance can serve any request. Where affinity is a genuine performance optimisation rather than a correctness requirement, as with an in-memory cache per instance, use consistent hashing so losing one backend moves 1/N of keys instead of remapping everyone.',
      },
    ],
    tradeoffs: [
      'Layer 7 gives per-request routing and retries; layer 4 gives throughput and protocol neutrality.',
      'Deep health checks catch useless instances and can remove the whole pool during a shared dependency failure.',
      'Aggressive probe intervals shorten the error window and add constant load to every backend.',
      'Sticky sessions improve cache locality and break rebalancing, deploys, and even distribution.',
    ],
    bottlenecks: [
      'Long-lived HTTP/2 and gRPC connections pinned by a layer 4 tier, leaving new backends idle.',
      'Ephemeral port exhaustion on a proxy fleet with too few source addresses.',
      'TLS handshake CPU on the balancer during a reconnect storm after a restart.',
      'The balancer itself, which is on the path of every request and fails as a whole if it is not redundant.',
    ],
    scalingPath: [
      { scale: 'Prototype', focus: 'One managed layer 7 balancer, round robin, a shallow /healthz, TLS terminated at the edge' },
      { scale: 'One region', focus: 'Layer 4 in front of an autoscaled proxy fleet, random two choices, slow start, draining, outlier ejection' },
      { scale: 'Global', focus: 'Anycast entry with health-aware regional steering, per-region proxy fleets, mesh sidecars with mutual TLS for internal calls' },
    ],
    interviewScript: [
      '"Anycast picks the region, a layer 4 tier spreads connections, and a layer 7 proxy makes the per-request decision."',
      '"For stateless HTTP I use random two choices, because eight proxies cannot share an accurate global connection count."',
      '"If a backend holds per-key state I switch to consistent hashing, so losing one node moves a fraction of keys instead of all of them."',
      '"Health checks are shallow by default, and any deep check fails open above 50% so a slow database cannot empty the pool."',
      '"A deploy deregisters, waits for the balancers to notice, drains for longer than the longest request, and only then exits."',
      '"The balancer is on the path of every request, so it runs as at least two units behind one virtual address."',
    ],
    commonMistakes: [
      'Putting a layer 4 balancer in front of gRPC and wondering why new instances receive no traffic.',
      'Using least connections when most connections are idle WebSockets.',
      'Health checking a path that queries the database, so one slow query removes the whole fleet.',
      'Exiting on the shutdown signal without draining, turning every deploy into a burst of 502s.',
      'Relying on source-IP stickiness for clients behind carrier and corporate NATs.',
      'Reading the client address from the socket behind a proxy instead of X-Forwarded-For or the PROXY protocol.',
    ],
    relatedTopics: ['dns', 'service-discovery', 'deployments', 'consistent-hashing', 'api-gateway'],
    examples: [
      'Google Maglev is a software layer 4 balancer using consistent hashing and direct server return so responses skip the balancer',
      'Envoy is the data plane in most service meshes because it does per-request layer 7 balancing with outlier ejection built in',
      'AWS separates NLB for layer 4 throughput from ALB for layer 7 routing, which mirrors the two-tier design directly',
    ],
    practicePrompt:
      'Take one instance out of a 200 instance pool during peak traffic with zero failed requests, and write the exact sequence of steps and the wait at each one.',
    followUps: [
      {
        question: 'Why does a layer 4 balancer starve new backends when the traffic is gRPC?',
        answer:
          'gRPC runs over HTTP/2, so a client opens one long-lived connection and multiplexes thousands of calls onto it. A layer 4 balancer decides once per connection, so those calls are pinned for the lifetime of the connection and a backend added afterwards receives nothing until clients reconnect. The fixes are a layer 7 proxy that balances per stream, a service mesh sidecar doing the same, or forcing periodic reconnects with a maximum connection age and jitter.',
        category: 'Protocols',
        difficulty: 'hard',
      },
      {
        question: 'You have 50,000 idle WebSocket connections. Which algorithm and why?',
        answer:
          'Not least connections, because an idle socket counts exactly the same as a busy one, so the balancer optimises a number that has nothing to do with load. Balance new connections with round robin or random two choices and then measure real work such as messages per second or CPU, feeding that back as weights. Also cap connection age so long-lived clients redistribute after a scale-out, and size the pool by memory per connection rather than by request rate.',
        category: 'Algorithms',
        difficulty: 'hard',
      },
      {
        question: 'How do you defend against slowloris?',
        answer:
          'Slowloris opens many connections and sends headers a byte at a time, holding worker slots without ever completing a request. A layer 7 proxy defends by imposing a header timeout of a few seconds, a minimum throughput rule that drops connections below a byte rate, and per-source-IP connection limits. An event-driven proxy such as nginx or Envoy also makes the attack far less effective than a thread-per-connection backend, which is a good reason never to expose such a backend directly.',
        category: 'Security',
        difficulty: 'medium',
      },
      {
        question: 'Walk through a deploy that drops no requests.',
        answer:
          'Bring up the new instance, wait for it to pass readiness, and give it slow start so its share ramps over 30 to 60 seconds. Then deregister one old instance and wait at least one full health check interval plus propagation so every balancer has stopped selecting it. The process stops accepting new connections but keeps serving open ones, waits for the longest expected request plus a margin, and only then exits. Repeat in small batches so capacity never dips below what peak traffic needs.',
        category: 'Operations',
        difficulty: 'medium',
      },
      {
        question: 'How does the backend learn the real client IP?',
        answer:
          'For HTTP, the terminating proxy appends the client address to X-Forwarded-For, and the backend must read the correct position in that list while trusting only its own proxies, or an attacker will simply send a forged header. For non-HTTP traffic through a layer 4 tier there is no header, so the PROXY protocol prefixes the connection with a small header carrying the original addresses, which both sides must be configured to expect.',
        category: 'Fundamentals',
        difficulty: 'medium',
      },
      {
        question: 'What is outlier ejection and how does it differ from a health check?',
        answer:
          'A health check is an active probe on a separate path, so it tests a synthetic request. Outlier ejection is passive: the balancer watches real responses and temporarily removes a backend whose 5xx rate or latency is a statistical outlier compared with its peers, then returns it after a backoff. It catches failures a probe misses, such as one instance with a corrupt cache serving errors only for real traffic, and it must be capped so it can never eject more than a set percentage of the pool.',
        category: 'Health',
        difficulty: 'medium',
      },
      {
        question: 'When is consistent hashing the right balancing algorithm?',
        answer:
          'When the backend holds state derived from the request key, such as a per-instance cache, a websocket room, or a shard of in-memory data. Hashing the key onto a ring means the same key reaches the same instance, and adding or removing one node in a pool of N remaps only about 1/N of keys instead of all of them. It is the wrong choice for genuinely stateless work, because it gives up the ability to react to load and one hot key can overwhelm its owner.',
        category: 'Algorithms',
        difficulty: 'medium',
      },
      {
        question: 'Where should retries live, at the balancer or the client?',
        answer:
          'At the balancer for idempotent requests, because it knows which backends are healthy and can send the retry elsewhere immediately. It must be bounded by a retry budget, typically a few percent of total requests, or a partial failure becomes a self-inflicted traffic multiplication. Clients should retry only with jittered exponential backoff and only for connection-level failures, and non-idempotent requests need an idempotency key before anything retries them at all.',
        category: 'Reliability',
        difficulty: 'hard',
      },
      {
        question: 'Should the balancer terminate TLS or pass it through?',
        answer:
          'Terminate in most systems, because routing on path or header, compression, and useful access logs all require the plaintext, and certificates are then managed in one place. Pass through when the backend needs the client certificate itself or when policy forbids decryption outside the application. If you need both request awareness and an encrypted internal hop, terminate and re-encrypt to the backend, keeping upstream connections pooled so the second handshake is amortised.',
        category: 'Security',
        difficulty: 'easy',
      },
      {
        question: 'What makes the load balancer itself redundant?',
        answer:
          'At least two units sharing one virtual address, with failure handled below them: anycast withdrawal at the global tier, or a managed balancer that the provider runs across availability zones. Health checking must be mutual so a failed unit stops announcing the address rather than continuing to accept traffic it cannot serve. The point to make in an interview is that a single balancer converts every backend into a dependency of one machine, which is worse than having no balancer at all.',
        category: 'Reliability',
        difficulty: 'easy',
      },
    ],
  }),
};
