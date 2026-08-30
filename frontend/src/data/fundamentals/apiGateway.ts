import { ArchitectureTopic, emptyContent } from '../systemDesignTypes';

export const apiGatewayTopic: ArchitectureTopic = {
  id: 'api-gateway',
  title: 'API Gateway and BFF',
  description:
    'The single hop where cross-cutting concerns are applied once, in a fixed order, before a request is allowed to reach a service.',
  difficulty: 'Intermediate',
  progress: 0,
  icon: 'Router',
  color: 'bg-violet-600',
  section: 'fundamentals',
  track: 'classic',
  prerequisites: ['load-balancer'],
  estimatedMinutes: 70,
  order: 11,
  content: emptyContent({
    overview:
      'An API gateway is one place where every request is authenticated, rate limited, routed, timed out, and observed, so that forty services do not each implement those concerns differently. It is not a load balancer, which picks a machine, and it is not a service, because it holds no business rules and owns no data. A backend for frontend is a narrower idea: a gateway shaped for exactly one client, which composes several service calls into the one response that client needs. The failure mode of both is the same, and it is organisational: logic leaks in, and the gateway quietly becomes the most important service nobody owns.',
    whyItExists:
      'Authentication, rate limiting, and observability are needed by every service, and implementing them forty times produces forty subtly different behaviours. Moving them to one hop makes the policy uniform and auditable, and gives clients one address instead of forty.',
    problemStatement: {
      prompt:
        'A mobile app, a web app, and three partner integrations all call a system of twenty services. Every caller needs authentication, quotas, sensible timeouts, and one consistent error format. Design the entry hop, decide what belongs in it and what must not, and say how it stops being a single point of failure.',
      inScope: [
        'The order of operations in a single gateway hop',
        'Gateway, BFF, GraphQL gateway, protocol translation, mesh ingress',
        'Timeouts, retry budgets, circuit breaking, bulkheads, hedging',
        'A consistent error catalogue and gateway redundancy',
      ],
      outOfScope: [
        'HTTP versions and API contract styles (see the HTTP and RPC lesson)',
        'Rate limiting algorithms such as token bucket and sliding window (see the rate limiting lesson)',
        'Identity provider internals and token issuance (see the auth lesson)',
        'Backend selection algorithms (see the load balancing lesson)',
      ],
    },
    assumptions: [
      'Clients are untrusted; services behind the gateway trust the identity it asserts',
      'Every service exposes a health endpoint and honours a deadline passed to it',
      'Contract styles and protocol choices are already decided in the HTTP and RPC lesson',
    ],
    whenToUse: [
      'More than a handful of services exposed to clients you do not control',
      'Several client types needing different response shapes from the same services',
      'A policy that must be enforced identically everywhere: quotas, auth, audit logging',
    ],
    functionalRequirements: [
      { title: 'Terminate and authenticate', detail: 'Complete TLS, validate the token, and attach a verified identity to the request.' },
      { title: 'Enforce quotas', detail: 'Apply per-identity and per-route limits before any backend work is done.' },
      { title: 'Route and translate', detail: 'Map a public path to an internal service, and translate REST to gRPC where needed.' },
      { title: 'Normalise failures', detail: 'Return one documented error shape with a stable code and a correlation id.' },
    ],
    nonFunctionalRequirements: [
      { title: 'Added latency', detail: 'The whole hop should cost under 5 ms at p99 excluding the backend call itself.' },
      { title: 'Availability', detail: 'Higher than any service behind it, since every request passes through it.' },
      { title: 'Statelessness', detail: 'No request may depend on gateway memory, so any instance can serve any request.' },
      { title: 'Observability', detail: 'Every request emits a trace id, route, identity, status, and latency without exception.' },
    ],
    estimates: [
      { label: 'Per-hop budget', value: 'TLS 1 ms + JWT verify 0.1 ms + limit check 0.5 ms + routing 0.1 ms ≈ 2 ms', note: 'A local JWT signature check is cheap; a token introspection call is 20–50 ms' },
      { label: 'Rate limit store cost', value: '40k RPS × 2 Redis commands = 80k commands/s', note: 'Enough to need pipelining or a local pre-filter before the shared counter' },
      { label: 'Timeout budget', value: 'Client 3 s, gateway 2.5 s, service 2 s, database 1 s', note: 'Each layer must be shorter than its caller, or retries pile up invisibly' },
      { label: 'Retry amplification', value: '3 attempts × 3 layers = up to 27 backend calls per request', note: 'Why a budget of 5% of traffic replaces per-call retry counts' },
      { label: 'Fan-out saving for a BFF', value: '7 mobile round trips at 120 ms become 1 at 150 ms', note: 'Roughly 840 ms of wall clock removed on a slow network' },
    ],
    concepts: [
      'Reverse proxy versus gateway versus BFF',
      'The fixed order of the hop',
      'Token validation versus introspection',
      'Deadline propagation and retry budgets',
      'Circuit breaker and bulkhead',
      'Hedged requests at the edge',
      'Response composition and over-fetching',
      'Error catalogue and correlation id',
    ],
    comparisons: [
      {
        title: 'Things that sit at the edge, and what each actually does',
        headers: ['Type', 'How it works', 'Use when', 'Avoid when'],
        rows: [
          [
            'Reverse proxy (nginx, Envoy)',
            'Terminates TLS and forwards by host or path, with rewriting, compression, and caching but no notion of identity or quota',
            'A small number of services and no per-caller policy',
            'You need per-identity quotas, key management, or a published developer contract',
          ],
          [
            'API gateway',
            'A reverse proxy plus an identity and policy engine: token validation, per-consumer quotas, route configuration, transformation, and uniform errors',
            'Public or partner APIs across many services',
            'There is one service and one client, where it is pure overhead',
          ],
          [
            'Backend for frontend',
            'A gateway owned by one client team that composes several service calls into the exact response that client needs',
            'A mobile client on a slow network needing few, tailored round trips',
            'Clients need almost identical data, since you would maintain near-duplicate layers',
          ],
          [
            'GraphQL gateway',
            'Publishes one schema stitched or federated from service subgraphs and resolves a client query by fanning out to owners',
            'Many clients with widely varying field requirements',
            'You cannot control query cost, or the data is naturally a small fixed set of endpoints',
          ],
          [
            'gRPC-to-REST gateway',
            'Generates a JSON and HTTP surface from protobuf service definitions and transcodes each call to gRPC internally',
            'Internal services speak gRPC but browsers and partners need JSON',
            'The internal contract changes constantly, since the public surface changes with it',
          ],
          [
            'Service mesh ingress',
            'The mesh control plane configures the same sidecar proxy technology as an ingress, with mutual TLS, retries, and traffic splitting',
            'You already run a mesh and want one policy model inside and at the edge',
            'You need consumer key management and developer portals, which a mesh does not provide',
          ],
        ],
        note: 'These are layers rather than alternatives. A common production shape is mesh ingress for transport, a gateway for policy, and a BFF per client for composition.',
      },
      {
        title: 'One gateway or a BFF per client',
        headers: ['Aspect', 'Single gateway', 'BFF per client'],
        rows: [
          ['Ownership', 'A platform team owns one configuration for everyone', 'Each client team owns and deploys its own layer'],
          ['Response shape', 'Generic, so clients over-fetch and discard fields', 'Exactly what one screen needs, in one round trip'],
          ['Change coupling', 'Any change is negotiated across all client teams', 'A client can change its layer without touching others'],
          ['Cost', 'One thing to run, monitor, and secure', 'N deployments, N sets of dashboards, duplicated policy risk'],
          ['Failure blast radius', 'One misconfiguration affects every client', 'A broken BFF affects only its own client'],
        ],
        note: 'The usual compromise is one gateway for cross-cutting policy, with a BFF added only for the client whose response shape genuinely differs, typically mobile.',
      },
    ],
    architecture:
      'A load balancer fronts a stateless fleet of gateway instances, each applying the same ordered chain: terminate TLS, verify identity, check quota, choose a route, attach a deadline, transform if required, and emit telemetry. Backend calls go out through per-dependency connection pools with circuit breakers, so one slow service cannot consume the whole fleet. Because the gateway is on the path of every request, it runs in at least two zones with no shared mutable state beyond the rate limit counters.',
    diagrams: [{ id: 'hop', title: 'One gateway hop', kind: 'excalidraw', src: 'gateway-hop' }],
    apis: [
      {
        method: 'GET',
        path: '/v1/bookings/{id}',
        description: 'Routed to the bookings service. Demonstrates the standard gateway error catalogue.',
        request: 'Authorization: Bearer <jwt>; X-Request-Id optional, generated if absent',
        response: '200 { "id": "bk_8812", "listingId": "ls_44", "status": "confirmed" }',
        errors:
          '401 invalid or expired token, before any routing; 403 token valid but scope bookings:read missing; 404 routed and the service reported no such booking; 429 quota exceeded, with Retry-After; 504 the bookings service exceeded the 2.5 s gateway deadline',
      },
      {
        method: 'POST',
        path: '/v1/bookings',
        description: 'Write path. Requires an idempotency key because the gateway may not safely retry on its own.',
        request: 'Authorization: Bearer <jwt>; Idempotency-Key: <uuid>; body { "listingId": "ls_44", "startsOn": "2026-09-14" }',
        response: '201 { "id": "bk_8813", "status": "pending" }',
        errors:
          '400 malformed body, rejected at the gateway by schema validation; 401 missing token; 409 idempotency key reused with a different body; 429 write quota exceeded; 503 circuit breaker open for the bookings service, with Retry-After',
      },
      {
        method: 'GET',
        path: '/bff/mobile/home',
        description: 'BFF composition endpoint: one call fans out to bookings, listings, and notifications and returns one payload.',
        request: 'Authorization: Bearer <jwt>; X-Client-Version: ios/8.2.1',
        response: '200 { "upcoming": [...], "recommended": [...], "unreadCount": 3 }',
        errors:
          '401 invalid token; 429 per-device quota exceeded; 206 returned when a non-essential fan-out call failed and the payload omits that section; 504 the essential bookings call exceeded its 800 ms sub-deadline',
      },
    ],
    walkthrough: [
      {
        title: 'Terminate TLS and establish a request identity',
        description:
          'The gateway completes the handshake and immediately assigns a correlation id, generating one if the client did not send it. Everything after this point is logged against that id, which is the only reason a support ticket can later be traced through twenty services. Nothing about the request is trusted yet.',
      },
      {
        title: 'Authenticate, then authorise',
        description:
          'The token signature is verified locally against cached public keys, which costs a fraction of a millisecond, and the claims are checked for expiry and audience. An invalid token is a 401 and ends here, before any backend is consulted. A valid token lacking the required scope is a 403, which is a different answer and must not be conflated with the first.',
      },
      {
        title: 'Apply the quota',
        description:
          'Limits are checked after authentication, because a quota is meaningful per identity and only anonymous traffic needs to fall back to an address-based bucket. Exceeding a limit returns 429 with Retry-After, and it costs nothing downstream, which is the entire point of placing this step early. The algorithms behind the counter belong to the rate limiting lesson.',
      },
      {
        title: 'Choose the route and attach a deadline',
        description:
          'A path and method match one route, which names an upstream cluster and a timeout. The gateway sets a deadline, for example 2.5 s, and passes the remaining budget downstream so a service that receives 200 ms left does not start a two second query. Retries are governed by a fleet-wide budget rather than a per-call attempt count.',
      },
      {
        title: 'Transform only at the boundary',
        description:
          'Here the gateway may rename a field, drop an internal one, or transcode JSON to gRPC, and it may validate the request against a schema so malformed payloads never reach a service. This is also where the temptation begins: a small conditional today becomes business logic in six months. Transformation is allowed, decisions are not.',
      },
      {
        title: 'Emit telemetry and normalise the response',
        description:
          'Every request produces a trace span, a metric labelled by route and status, and a log line carrying the correlation id and identity. Backend failures are mapped into the documented error catalogue so a client sees the same shape for a timeout as for a rejected quota. An internal panic must never reach the client as a stack trace.',
      },
    ],
    deepDives: [
      {
        title: 'The order of the hop is the design',
        body:
          'Terminate TLS, authenticate, authorise, rate limit, route, set the deadline, transform, observe. The order is not arbitrary. Authentication precedes rate limiting because a quota per identity is worth far more than a quota per address, and because an unauthenticated request should be cheap to reject. Rate limiting precedes routing so that rejected traffic consumes no backend capacity, which is what lets the gateway shield services during an abusive burst. Deadlines are set at routing time because only there do you know which upstream and which budget apply. Observation wraps everything, so even a request rejected at the first step is counted. Getting this wrong produces specific bugs: limiting before authenticating means one shared office address exhausts a quota for a hundred legitimate users, and routing before limiting means a burst still costs you database connections.',
      },
      {
        title: 'One gateway, or a BFF for each client',
        body:
          'A generic gateway gives every client the same response, so a mobile home screen makes seven calls and discards most of what it receives, which costs roughly 840 ms on a network with 120 ms round trips. A backend for frontend collapses that into one call of about 150 ms, returning exactly the fields the screen renders, and it is owned by the client team so it ships on their schedule. The cost is another deployment per client, and the real risk is that policy drifts: two BFFs will eventually validate tokens differently. The stable arrangement is a single gateway that owns authentication, quotas, and telemetry, with each BFF sitting behind it doing composition only. Add a BFF when a client response shape genuinely differs, not because the pattern has a name.',
      },
      {
        title: 'Timeouts, deadlines, and retry budgets',
        body:
          'Timeouts must decrease as you go inward: client 3 s, gateway 2.5 s, service 2 s, database 1 s. If a service waits longer than its caller, the caller has already given up and the work continues, which burns capacity for nobody. Passing the remaining budget with the request, as gRPC deadlines do, lets each hop decide whether it is even worth starting. Retries need the same discipline. Three attempts at three layers is up to twenty-seven backend calls for one request, so a partial failure becomes a self-inflicted flood at the worst moment. Replace per-call attempt counts with a budget: the fleet may retry at most, say, 5% of its request volume, and once the budget is spent failures are returned immediately. Only idempotent requests may be retried at all, which is why the write endpoint above requires an idempotency key.',
      },
      {
        title: 'Circuit breakers, bulkheads, and hedging',
        body:
          'A circuit breaker counts failures per upstream and, above a threshold such as a 50% error rate over ten seconds, stops calling it entirely for a cooldown, then lets a single probe through to test recovery. This converts a slow dependency into a fast rejection, which is what keeps the gateway threads free. A bulkhead limits the resources any single upstream may consume: a dedicated connection pool of, say, 50 for the recommendation service means it can never occupy every worker while the booking path stays healthy. Hedging targets tail latency instead of failure: send a second identical request to another instance if the first has not answered by the p95, take whichever returns first, and cap hedges at a small percentage of traffic. Hedging is only safe for idempotent reads, and it trades a few percent of extra load for a large p99 improvement.',
      },
      {
        title: 'Why the gateway must never touch a database',
        body:
          'The moment the gateway reads a table, three things follow. It acquires a schema dependency on a team that does not know it exists, so their migration becomes your outage. It acquires a stateful failure mode on the one hop that must be more available than everything behind it. And it becomes tempting to add a second query, then a join, at which point you have built a service with none of a service ownership. The legitimate needs look like database needs but are not: identity comes from a signed token verified with cached public keys, consumer configuration is deployed as configuration and reloaded, and rate limit counters live in a dedicated store the gateway owns entirely and can lose without becoming incorrect. If a decision genuinely requires business data, the correct move is to call the service that owns that data.',
      },
      {
        title: 'Keeping business logic out, and the gateway redundant',
        body:
          'Logic leaks in one small step at a time: a discount condition, a country check, a special case for one partner. Each is easier to add at the edge than to negotiate with a service team, and the result is rules that live in a configuration file, are untestable in isolation, and are owned by nobody. The rule worth stating in an interview is that the gateway may enforce policy about the request and may reshape it, but must not decide anything about the domain. Redundancy follows from the same statelessness. Because no request depends on instance memory, the gateway runs as an autoscaled fleet across at least two availability zones behind a load balancer, with configuration versioned and rolled out gradually so a bad route cannot be applied everywhere at once. Health checks must stay shallow, or one degraded upstream will empty the entire gateway pool.',
      },
    ],
    tradeoffs: [
      'One hop makes policy uniform and puts every request behind one component.',
      'A BFF per client gives ideal payloads and multiplies deployments and duplicated policy risk.',
      'Transformation at the edge decouples clients from services and hides the real contract.',
      'Local token validation is fast and cannot see a revocation until the token expires.',
    ],
    bottlenecks: [
      'The rate limit store, touched twice per request on every single call.',
      'TLS handshake CPU during a reconnect storm after a gateway restart.',
      'One slow upstream consuming all gateway workers when no bulkhead is configured.',
      'A GraphQL query with unbounded depth or fan-out, turning one request into thousands.',
    ],
    scalingPath: [
      { scale: 'Prototype', focus: 'A reverse proxy with TLS, path routing, and one global rate limit' },
      { scale: 'One region', focus: 'Managed gateway with local JWT validation, per-consumer quotas, deadlines, circuit breakers, and one error catalogue' },
      { scale: 'Global', focus: 'Regional gateway fleets behind anycast, a mobile BFF, hedged reads, config rollout with automated rollback' },
    ],
    interviewScript: [
      '"One hop applies the cross-cutting concerns in a fixed order, so twenty services do not each reinvent authentication."',
      '"The order matters: authenticate first so quotas are per identity, then rate limit so rejected traffic costs no backend capacity."',
      '"Timeouts shrink inward, three seconds to two point five to two, and the remaining budget travels with the request."',
      '"Retries run on a fleet budget of about five percent, because three attempts at three layers is twenty-seven calls."',
      '"The gateway never reads a database. Identity comes from a signed token and configuration is deployed, not queried."',
      '"It is stateless, so it scales as a fleet across two zones, and health checks stay shallow so one bad upstream cannot empty the pool."',
    ],
    commonMistakes: [
      'Rate limiting before authenticating, so one office address exhausts the quota for a hundred users.',
      'Letting the gateway query a database and inheriting another team schema migrations.',
      'Adding business conditionals to routing configuration until nobody can test the behaviour.',
      'Setting a backend timeout longer than the caller timeout, so abandoned work keeps running.',
      'Retrying non-idempotent writes at the edge without an idempotency key.',
      'Running one gateway instance and calling the architecture highly available.',
    ],
    relatedTopics: ['rate-limiting', 'auth', 'http-rpc', 'reliability', 'load-balancer'],
    examples: [
      'Netflix built Zuul as its edge gateway and later added per-client composition rather than one generic API',
      'Kong and Envoy Gateway apply the same ordered filter chain, which is why their configuration models look alike',
      'Netflix Falcor and the wider GraphQL federation approach exist because one generic response never fits every device',
    ],
    practicePrompt:
      'A partner is sending 10,000 requests per second with a valid token and exhausting a downstream service. Write the exact order of gateway steps that stops them, and state which status code and header the partner receives.',
    followUps: [
      {
        question: 'What is the difference between a load balancer and an API gateway?',
        answer:
          'A load balancer answers the question of which machine should serve this request, using health and an algorithm, and it does not care what the request means. A gateway answers whether this request is allowed at all, from whom, how often, and where it should go, then normalises the result. Almost every gateway contains a load balancer, but adding identity, quotas, and a published contract is what makes it a gateway.',
        category: 'Fundamentals',
        difficulty: 'easy',
      },
      {
        question: 'Why must authentication come before rate limiting?',
        answer:
          'Because a quota is only meaningful against an identity. If you limit before authenticating, the only key available is the source address, so a corporate NAT presenting a hundred users as one address exhausts a shared bucket, and a distributed abuser with many addresses slips through. Authenticate first, key the limit on the consumer, and keep a much stricter address-based limit purely for unauthenticated routes.',
        category: 'Ordering',
        difficulty: 'medium',
      },
      {
        question: 'Local JWT validation or token introspection at the identity provider?',
        answer:
          'Validate locally by checking the signature against cached public keys, which costs about 0.1 ms and adds no dependency to the request path. Introspection gives you immediate revocation but adds 20 to 50 ms and makes the identity provider a hard dependency of every request. The usual compromise is short token lifetimes of five to fifteen minutes plus a revocation list for the small number of tokens that must be killed early.',
        category: 'Auth',
        difficulty: 'hard',
      },
      {
        question: 'Should the gateway cache responses?',
        answer:
          'Only public, non-personalised responses, and only with the identity in the key if there is any chance the payload varies by user. It is a legitimate optimisation for shared read endpoints such as a public catalogue. For anything truly cacheable and public, a CDN in front of the gateway is the better place, because it also removes the network distance rather than just the backend call.',
        category: 'Performance',
        difficulty: 'medium',
      },
      {
        question: 'How do you version a public API at the gateway?',
        answer:
          'Put the major version in the path, route each version to its own upstream, and keep both running while consumers migrate. The gateway is the right place to hold a compatibility shim for a deprecated version, such as renaming a field, because that keeps the shim out of the service. What it must not do is contain conditional business behaviour per version, which is a signal that the versions are genuinely different services.',
        category: 'Contracts',
        difficulty: 'medium',
      },
      {
        question: 'A downstream service starts taking 8 seconds per call. What does the gateway do?',
        answer:
          'The route deadline of 2.5 s fires first, so clients get a 504 rather than hanging. The bulkhead confines the damage to that service connection pool, so unrelated routes stay healthy. Once the error rate crosses the breaker threshold the gateway stops calling it entirely for a cooldown and returns 503 with Retry-After immediately, releasing workers and giving the failing service room to recover before a single probe tests it again.',
        category: 'Reliability',
        difficulty: 'hard',
      },
      {
        question: 'Is a GraphQL gateway a substitute for a BFF?',
        answer:
          'It solves the same over-fetching problem by a different route: instead of one tailored endpoint per client, each client asks for exactly the fields it needs. The trade is control. A BFF has a fixed, testable query cost, while a GraphQL query can be arbitrarily deep and expensive, so you must add depth limits, complexity budgets, and persisted queries. Choose federation when client needs vary constantly and you can invest in that governance.',
        category: 'Composition',
        difficulty: 'medium',
      },
      {
        question: 'How is a bad gateway configuration rolled out safely?',
        answer:
          'Treat configuration as code: version it, validate the schema in the pipeline, and roll it out to a small percentage of instances first while watching error rate and latency per route. Because a route change affects every client at once, automated rollback on a metric breach matters more here than in an ordinary service. Many outages attributed to gateways are really one unvalidated configuration applied everywhere simultaneously.',
        category: 'Operations',
        difficulty: 'medium',
      },
      {
        question: 'What belongs in the gateway error catalogue?',
        answer:
          'A small, stable set with unambiguous meanings: 400 for a request the gateway itself rejected on schema, 401 for an invalid or missing token, 403 for a valid identity lacking the scope, 429 for quota with Retry-After, 503 for an open circuit breaker, and 504 for a deadline exceeded. Every response carries the correlation id and a machine-readable code, and no internal exception text is ever forwarded to a client.',
        category: 'Contracts',
        difficulty: 'easy',
      },
      {
        question: 'When do you not need a gateway at all?',
        answer:
          'When you have one or two services and one client you control. A reverse proxy handling TLS and path routing is enough, and the identity check can live in a shared library. The gateway earns its cost when the number of services or the number of untrusted callers grows to the point where duplicated policy becomes the larger risk, which is usually when partner traffic or a second client appears.',
        category: 'Design',
        difficulty: 'easy',
      },
    ],
  }),
};
