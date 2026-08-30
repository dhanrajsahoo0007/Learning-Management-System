import { ArchitectureTopic, emptyContent } from '../systemDesignTypes';

export const serviceDiscoveryTopic: ArchitectureTopic = {
  id: 'service-discovery',
  title: 'Service Discovery',
  description: 'How a caller finds a healthy instance when addresses change every deploy: registries, health checks, watches, and the deregister-before-shutdown sequence.',
  difficulty: 'Intermediate',
  progress: 0,
  icon: 'Search',
  color: 'bg-violet-700',
  section: 'fundamentals',
  track: 'classic',
  prerequisites: ['load-balancer', 'dns'],
  estimatedMinutes: 60,
  order: 26,
  content: emptyContent({
    overview:
      'Service discovery is the mechanism that turns a logical name such as payments into the address of an instance that is actually able to serve a request right now. It exists because instance addresses are ephemeral: every deploy, every autoscaling event, and every crash changes the set. The interesting engineering is not the lookup, which is easy, but the staleness window between an instance becoming unusable and every caller knowing about it.',
    whyItExists:
      'Hardcoded addresses and static configuration files describe a fleet that stopped existing at the last deploy, so callers either fail or send traffic to terminated processes. A registry keeps the mapping current and, crucially, keeps unhealthy instances out of it.',
    problemStatement: {
      prompt:
        'Sixty instances of a service are replaced three times a day by rolling deploys, and the autoscaler adds and removes instances continuously. Callers must reach only healthy instances, and a shutting-down instance must stop receiving requests before it stops accepting connections. Design the registry, the health signal, and the propagation path.',
      inScope: [
        'DNS-based, client-side, server-side, and mesh-based discovery',
        'Registration: self-registration versus a third-party registrar',
        'Liveness and readiness checks and what each controls',
        'Propagation, staleness, and graceful shutdown ordering',
      ],
      outOfScope: [
        'Load balancing algorithm choice, covered by the load balancer lesson',
        'Public DNS resolution mechanics, covered by the DNS lesson',
        'Authentication and mutual TLS policy inside the mesh',
        'Container scheduling and bin-packing decisions',
      ],
    },
    assumptions: [
      'Instances are disposable and get a new address every time they are replaced',
      'An orchestrator or cloud control plane knows the intended state of the fleet',
      'Callers are in-cluster services, not browsers, so a client library is an option',
    ],
    whenToUse: [
      'Any system with more than a handful of services whose instances are replaced automatically',
      'Autoscaled fleets where the instance count changes without a human involved',
      'Blue-green and canary releases, where two versions must be addressable at once',
    ],
    functionalRequirements: [
      { title: 'Resolve a name', detail: 'Return the current set of addresses and ports for a logical service name.' },
      { title: 'Register and deregister', detail: 'Add an instance when it becomes ready and remove it before it stops serving.' },
      { title: 'Filter by health', detail: 'Never return an instance that is failing its readiness check.' },
      { title: 'Notify on change', detail: 'Push updates to callers rather than making them poll, so convergence is sub-second.' },
    ],
    nonFunctionalRequirements: [
      { title: 'Staleness bound', detail: 'A removed instance is out of every caller view within a few seconds, not a few minutes.' },
      { title: 'Availability', detail: 'A registry outage must degrade to last-known-good, never to zero reachable instances.' },
      { title: 'Lookup latency', detail: 'Resolution is a local cache read on the request path, adding well under 1 ms.' },
      { title: 'Correctness of state', detail: 'The registry is the source of truth for membership, so it needs consensus rather than best-effort writes.' },
    ],
    estimates: [
      { label: 'Fleet churn', value: '60 instances x 3 deploys/day = 180 replacements/day', note: 'Each one is a registration and a deregistration event' },
      { label: 'DNS staleness', value: '30 s TTL plus client caching ≈ 60–90 s', note: 'A terminated instance keeps receiving traffic for that whole window' },
      { label: 'Ejection time', value: '5 s interval x 3 failures = 15 s', note: 'How long a dead instance stays in rotation with a standard health check' },
      { label: 'Cost of skipping deregistration', value: '5 s x 33 rps ≈ 170 failed requests per instance', note: 'At 2,000 rps across 60 instances, a full roll produces about 10,000 errors' },
      { label: 'Registry state size', value: '500 services x 20 instances = 10,000 endpoints', note: 'A few megabytes, which is why a consensus store is affordable here' },
    ],
    concepts: [
      'Registry as source of truth',
      'Self-registration vs third-party registrar',
      'Client-side vs server-side discovery',
      'Liveness vs readiness',
      'Watch and stream vs poll',
      'Kubernetes Service and EndpointSlice',
      'Sidecar proxy and control plane',
      'Deregister before shutdown',
    ],
    comparisons: [
      {
        title: 'Four ways to find an instance',
        headers: ['Approach', 'How it works', 'Use when', 'Avoid when'],
        rows: [
          [
            'DNS',
            'The service name resolves to A or SRV records listing instance addresses, cached for a TTL',
            'Simple internal services, or clients you cannot add a library to',
            'Instances churn faster than the TTL, or you need health-aware answers',
          ],
          [
            'Client-side discovery',
            'The client fetches the instance list from a registry such as Consul or Eureka and load balances itself',
            'You control the clients and want per-request choice with no extra hop',
            'Many languages, since every one needs a correct client implementation',
          ],
          [
            'Server-side discovery',
            'The client sends to one stable address; a load balancer or virtual IP holds the instance list',
            'Heterogeneous or external clients that must stay dumb',
            'You need client-aware routing such as locality preference or request hedging',
          ],
          [
            'Mesh sidecar',
            'A local proxy such as Envoy receives every outbound call and is programmed by a control plane',
            'Many languages, and you want retries, mTLS, and traffic shifting uniformly',
            'The operational cost of a proxy per pod outweighs the benefit at small scale',
          ],
        ],
        note: 'The sidecar is really client-side discovery with the client logic moved out of your process, which is why it works across languages.',
      },
    ],
    architecture:
      'A registry holds the mapping from logical service name to the set of instance endpoints, and it is the authority on membership rather than a cache of it. Instances enter that set only after passing a readiness check and leave it on deregistration or repeated health failures, and callers learn about changes through a watch that pushes updates rather than a poll that discovers them late. Because the registry decides who exists, it is backed by a consensus store — etcd or Raft inside Consul — so a partition cannot produce two disagreeing views of the fleet.',
    diagrams: [
      { id: 'reg', title: 'How a caller finds a healthy instance', kind: 'excalidraw', src: 'registry-between-lb' },
    ],
    walkthrough: [
      {
        title: 'Static configuration rots immediately',
        description:
          'A configuration file listing three payment service addresses is correct until the first deploy replaces those instances with three new ones at new addresses. With sixty instances rolled three times a day there are 180 address changes daily, and the autoscaler adds more, so any human-maintained list is wrong within hours. The first design decision is that instance addresses are runtime state, not configuration.',
      },
      {
        title: 'An instance is registered when it becomes ready',
        description:
          'Registration happens one of two ways. In self-registration the process calls the registry on startup and heartbeats to stay listed, which is simple but puts discovery logic in every service and leaves a stale entry if the process dies without deregistering. In third-party registration a registrar watches the orchestrator and writes entries on its behalf, which keeps services ignorant of the registry and makes the orchestrator view of the world authoritative — this is what Kubernetes does.',
      },
      {
        title: 'Health checks decide membership, and there are two kinds',
        description:
          'A readiness check answers "should this instance receive traffic right now" and gates registry membership, so an instance still warming its cache or waiting on a migration is simply not returned to callers. A liveness check answers "is this process irrecoverably stuck" and triggers a restart. Conflating them is a classic outage: if a slow dependency fails your liveness check, the orchestrator restarts every healthy instance simultaneously and turns a degraded dependency into a total outage.',
      },
      {
        title: 'The caller resolves the name',
        description:
          'With client-side discovery the caller holds the instance list locally and picks one per request, which gives it locality and hedging decisions and costs no extra network hop. With server-side discovery it sends to a single stable address and something else chooses, which keeps clients trivial at the cost of an extra hop and a load balancer to operate. A mesh sidecar is the third form: the application connects to localhost and the local Envoy applies the control plane view of the fleet.',
      },
      {
        title: 'Changes propagate by watch, not by poll',
        description:
          'Polling the registry every thirty seconds means up to thirty seconds of routing to instances that no longer exist, and it puts constant load on the registry proportional to the number of callers. A watch — a long-lived gRPC stream or a blocking query — pushes the new endpoint set within milliseconds of the change, so convergence is bounded by delivery rather than by an interval. Every caller must still hold a last-known-good copy, so a registry outage freezes routing instead of emptying it.',
      },
      {
        title: 'Deregister before you stop serving',
        description:
          'Shutdown must happen in a strict order: deregister or fail readiness first, wait for callers to observe the change, stop accepting new connections, finish in-flight requests, then exit. Skipping the wait is the standard source of deploy-time 502s — at 2,000 requests per second across sixty instances, one instance disappearing without deregistering drops roughly 170 requests over a five second health-check interval, and a full roll produces about 10,000 errors that look like a mysterious latency spike.',
      },
    ],
    deepDives: [
      {
        title: 'Why DNS is a weak registry',
        body:
          'DNS is attractive because everything already speaks it, and it is weak for three specific reasons. First, answers are cached for a TTL, and the TTL is a floor on staleness rather than a target: a 30 second TTL plus operating system and application caching means 60 to 90 seconds during which a caller confidently sends traffic to a terminated instance. Second, DNS has no health feedback — it returns the records in the zone whether or not those instances are answering, so removing a failing instance requires a control loop to rewrite records and then waiting out the TTL again. Third, some clients cache indefinitely: the JVM historically cached successful lookups forever by default, and connection pools resolve once at creation and never again. DNS is fine for a stable internal service and unsuitable for a fleet that changes every few minutes.',
      },
      {
        title: 'Client-side and server-side discovery, and what each costs',
        body:
          'In client-side discovery the caller asks the registry for the full instance list, caches it, watches for changes, and chooses an instance per request. This eliminates a network hop and gives the client information only it has — which instance it already has a warm connection to, which is in the same availability zone, which is currently slow — so locality routing and request hedging become possible. The cost is that every language needs a correct implementation of registry watching, caching, health filtering, and load balancing, and bugs in that library are distributed across every service. Server-side discovery moves all of it behind one address: the client is trivial and can be anything, but you pay an extra hop of latency, you must scale and operate the balancer, and the client loses the ability to make locality-aware choices.',
      },
      {
        title: 'The mesh sidecar and its control plane',
        body:
          'A service mesh resolves the language problem by moving the client logic into a separate process. Every pod runs an Envoy proxy, iptables or eBPF rules redirect outbound traffic to it, and the application simply connects to localhost while the proxy handles endpoint selection, retries, circuit breaking, timeouts, and mutual TLS. The proxies are programmed by a control plane — Istio, Linkerd, or a bare xDS server — that watches the orchestrator and streams endpoint and route updates down to each sidecar, typically converging in under a second. The result is uniform behaviour regardless of language and traffic shifting by configuration rather than by redeploy. The costs are real: an extra process per pod consuming memory and adding a hop of a millisecond or so each way, plus a control plane that is now on the critical path for how traffic flows.',
      },
      {
        title: 'How Kubernetes actually implements this',
        body:
          'A Service is a stable name and cluster IP; it does not hold the addresses itself. A controller watches pods matching the Service selector and writes their addresses into EndpointSlice objects, each holding up to a hundred endpoints so that a change in a large fleet does not rewrite one enormous object and flood every watcher. kube-proxy or a CNI dataplane watches those slices and programs iptables, IPVS, or eBPF rules so that traffic to the cluster IP is load balanced to a ready pod, which makes this server-side discovery implemented at the kernel level with no extra hop. A pod appears in an EndpointSlice only when its readiness probe passes, which is how readiness gates traffic. A headless Service — clusterIP set to None — skips the virtual IP entirely and returns all pod addresses through DNS, which is what stateful clients such as Kafka or Cassandra drivers need in order to address individual members.',
      },
      {
        title: 'Liveness and readiness are not the same signal',
        body:
          'Readiness answers whether this instance should receive traffic now, and failing it removes the instance from the endpoint set without killing it, which is the correct response to a cold cache, a saturated thread pool, or a dependency being briefly unavailable. Liveness answers whether the process is unrecoverable, and failing it causes a restart, which is the correct response to a deadlock or a wedged event loop. The dangerous mistake is a liveness probe that calls a downstream dependency: when that dependency has a bad minute, every instance fails liveness at once, the orchestrator restarts the entire fleet, and cold caches plus reconnection storms turn a partial degradation into a full outage. Keep liveness local and cheap, put dependency awareness in readiness, and give both a startup grace period so slow-booting services are not killed during initialisation.',
      },
      {
        title: 'The staleness window and how to shrink it',
        body:
          'Between an instance becoming unable to serve and the last caller learning about it, requests are lost. That window is the sum of detection, propagation, and client cache. Detection with a five second interval and three required failures is fifteen seconds; propagation by watch is milliseconds, or up to the poll interval if you poll; client-side caches and connection pools add their own delay. Two mechanisms shrink it. Proactive deregistration removes detection from the equation entirely for planned shutdowns, since the instance announces its own departure before it stops serving — which is why a PreStop hook plus a sleep is worth the seconds it costs. Client-side retry to a different instance covers the unplanned case, because a request that fails on a dying instance can succeed immediately elsewhere if the call is idempotent, which turns a lost request into added latency.',
      },
    ],
    tradeoffs: [
      'DNS is universally supported and structurally stale by at least its TTL.',
      'Client-side discovery removes a hop and requires a correct library in every language.',
      'A sidecar gives uniform behaviour across languages and adds a process per pod plus a control plane dependency.',
      'Aggressive health checks eject dead instances faster and eject healthy ones during transient blips.',
    ],
    bottlenecks: [
      'The registry becoming a hard dependency whose outage stops all new routing decisions.',
      'Watch fan-out: 10,000 endpoints changing during a deploy pushed to thousands of watchers at once.',
      'Health check traffic itself, at one request per instance per interval per checker.',
      'Client connection pools that resolve once at startup and never observe a change.',
    ],
    scalingPath: [
      { scale: 'Prototype', focus: 'DNS names with short TTLs, or a load balancer address per service in configuration' },
      { scale: 'One region', focus: 'Orchestrator-native discovery with readiness-gated endpoints, watches, and PreStop draining' },
      { scale: 'Global', focus: 'Mesh sidecars with locality-aware routing, per-region registries, and failover to a remote region only when the local one has no ready endpoints' },
    ],
    interviewScript: [
      '"Instance addresses are runtime state, so the registry is the source of truth and configuration never lists them."',
      '"I prefer third-party registration by a registrar watching the orchestrator, so services carry no discovery logic."',
      '"Readiness gates traffic and liveness restarts the process — I never point liveness at a downstream dependency."',
      '"Callers watch for endpoint changes instead of polling, so convergence is milliseconds rather than a poll interval."',
      '"On shutdown I fail readiness, wait one propagation interval, drain in-flight requests, then exit — otherwise every deploy emits 502s."',
      '"The registry decides membership, so it sits on a consensus store; a partition must not produce two views of the fleet."',
    ],
    commonMistakes: [
      'Relying on DNS TTL for a fleet that changes faster than the TTL.',
      'Pointing a liveness probe at a downstream dependency and restarting the whole fleet when it hiccups.',
      'Terminating an instance before deregistering it, then blaming the resulting 502s on the load balancer.',
      'Polling the registry on an interval and calling the resulting stale routing a network problem.',
      'Having no last-known-good cache, so a registry outage means callers can reach nothing at all.',
      'Resolving addresses once at connection pool creation and never refreshing.',
    ],
    relatedTopics: ['load-balancer', 'deployments', 'dns', 'consensus'],
    examples: [
      'Kubernetes writes pod addresses into EndpointSlices and programs kube-proxy, gating membership on the readiness probe',
      'HashiCorp Consul keeps its catalogue in a Raft-replicated store and exposes both a DNS and an HTTP watch interface',
      'Netflix Eureka pioneered client-side discovery, deliberately choosing availability and stale answers over consistency',
    ],
    practicePrompt:
      'Write the exact shutdown sequence for an instance serving 33 requests per second so that a rolling deploy of sixty instances produces zero failed requests.',
    followUps: [
      {
        question: 'Why is DNS a poor fit for fast-changing fleets?',
        answer:
          'Because a TTL is a lower bound on staleness and DNS carries no health information. A 30 second TTL plus operating system and library caching gives roughly a minute during which callers send traffic to instances that no longer exist, and removing a failing instance means rewriting records and waiting the TTL out again. Some clients, notably older JVM defaults and most connection pools, cache the resolution far longer than that.',
        category: 'Mechanics',
        difficulty: 'easy',
      },
      {
        question: 'Self-registration or a third-party registrar?',
        answer:
          'A registrar is usually better. Self-registration is simple but embeds registry logic and credentials in every service, and it leaves a stale entry whenever a process dies without a clean shutdown, so it depends on heartbeat expiry to clean up. A third-party registrar watches the orchestrator, which already knows the intended and actual state of every instance, and writes entries on their behalf — so services stay ignorant of discovery and crashes are handled by the same loop that manages the pods.',
        category: 'Registration',
        difficulty: 'medium',
      },
      {
        question: 'What is the difference between liveness and readiness?',
        answer:
          'Readiness decides whether an instance receives traffic; failing it removes the instance from the endpoint set but leaves the process running, which is right for a cold cache or a temporarily saturated pool. Liveness decides whether the process is unrecoverable; failing it restarts the container, which is right for a deadlock. Making a liveness probe depend on a downstream service is a known outage pattern, because one bad dependency minute restarts every replica at once.',
        category: 'Health',
        difficulty: 'medium',
      },
      {
        question: 'Why does skipping deregistration cause 502s?',
        answer:
          'Because callers keep an endpoint list, and until they observe the removal they keep opening connections to a process that has stopped accepting them. The gap is the health check detection window — five seconds per interval, often three intervals — and at 33 requests per second per instance that is roughly 170 failed requests each time an instance is replaced. Over a sixty instance roll it is about 10,000 errors, which typically surface as an unexplained error spike during every deploy.',
        category: 'Operations',
        difficulty: 'medium',
      },
      {
        question: 'What is the correct shutdown sequence?',
        answer:
          'Fail the readiness check or explicitly deregister, then sleep long enough for the change to reach every caller — in Kubernetes this is a PreStop hook with a few seconds of sleep, because endpoint propagation and dataplane reprogramming are not instantaneous. Then stop accepting new connections while continuing to serve in-flight requests, and exit once they complete or the grace period expires. The grace period must exceed your longest normal request.',
        category: 'Operations',
        difficulty: 'hard',
      },
      {
        question: 'Watch or poll?',
        answer:
          'Watch. A long-lived stream or blocking query delivers the new endpoint set within milliseconds of the change, so the staleness window is dominated by detection rather than by an arbitrary interval. Polling every thirty seconds both delays convergence and creates constant registry load proportional to the number of callers times the number of watched services. Keep a last-known-good cache either way, so a registry outage freezes the current view instead of emptying it.',
        category: 'Propagation',
        difficulty: 'medium',
      },
      {
        question: 'How does Kubernetes implement discovery?',
        answer:
          'A Service provides a stable name and cluster IP, while a controller writes the addresses of ready pods into EndpointSlice objects, each capped at around a hundred endpoints so large fleets do not rewrite one huge object on every change. kube-proxy or an eBPF dataplane watches those slices and programs kernel rules that load balance cluster IP traffic to a ready pod, so there is no extra proxy hop. Membership is gated on the readiness probe, which is exactly how readiness controls traffic.',
        category: 'Platform',
        difficulty: 'medium',
      },
      {
        question: 'When do you need a headless Service?',
        answer:
          'When the client must address individual instances rather than be balanced across them. Setting clusterIP to None makes DNS return every pod address instead of a virtual IP, which is what stateful systems require: a Kafka client needs to reach the specific broker leading a partition, and a Cassandra driver maintains its own token-aware routing. Load balancing at the virtual IP would break both, because it would send a request to whichever member answered rather than to the one that owns the data.',
        category: 'Platform',
        difficulty: 'hard',
      },
      {
        question: 'Why does the registry itself need consensus?',
        answer:
          'Because it is the authority on membership, and a split view is worse than no view: two halves of a partition each believing they hold the full fleet leads to traffic sent into a partition that cannot serve it, and to two instances both believing they are the single writer. Backing the registry with Raft — as etcd and Consul do — means membership changes are agreed by a majority and a minority partition cannot publish a conflicting endpoint set.',
        category: 'Consistency',
        difficulty: 'hard',
      },
      {
        question: 'What happens to routing if the registry goes down?',
        answer:
          'It should freeze, not fail. Every caller or sidecar keeps the last known endpoint set and continues using it, so existing traffic flows normally while new instances simply cannot join and departures are not observed. That is a deliberate availability choice — stale routing beats no routing — and it is why Eureka was designed to favour availability over consistency. What must be avoided is a client that treats an empty or errored registry response as an empty endpoint list.',
        category: 'Reliability',
        difficulty: 'medium',
      },
    ],
  }),
};
