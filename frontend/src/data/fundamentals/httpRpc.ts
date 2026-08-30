import { ArchitectureTopic, emptyContent } from '../systemDesignTypes';

export const httpRpcTopic: ArchitectureTopic = {
  id: 'http-rpc',
  title: 'HTTP, REST, gRPC and GraphQL',
  description: 'What actually goes over the wire: connection reuse, multiplexing, cache headers, and choosing a contract style.',
  difficulty: 'Beginner',
  progress: 0,
  icon: 'Link',
  color: 'bg-slate-700',
  section: 'fundamentals',
  track: 'classic',
  prerequisites: ['dns'],
  estimatedMinutes: 70,
  order: 2,
  content: emptyContent({
    overview:
      'Every design you draw is ultimately requests on a wire. The transport version decides how much parallelism you get for free, and the contract style decides how much coupling you sign up for.',
    whyItExists:
      'A design that ignores the protocol produces surprises: mobile clients stalling on six connections, caches that never hit because of a missing header, and a chatty API that needs forty round trips to render one screen.',
    problemStatement: {
      prompt:
        'Two services and a mobile app need to talk. Choose the transport and the contract, and justify it with connection behaviour, caching, and how the contract evolves when a field changes.',
      inScope: [
        'HTTP/1.1, HTTP/2 and HTTP/3 on the wire',
        'REST, RPC, gRPC, GraphQL, and webhooks',
        'Caching headers, ETags, and conditional requests',
        'Idempotency, status codes, and pagination',
      ],
      outOfScope: [
        'TLS handshake cryptography in detail',
        'Writing a protobuf compiler plugin',
        'Full OpenAPI tooling ecosystems',
        'WebSocket and streaming, which live in the realtime lesson',
      ],
    },
    assumptions: [
      'Clients are a mix of browsers, mobile apps, and other services',
      'TLS is mandatory everywhere, so connection setup cost is real',
      'Services can be updated independently, so contracts must evolve without lockstep deploys',
    ],
    whenToUse: [
      'Designing any public or internal API surface',
      'Explaining why a page needs one round trip instead of forty',
      'Deciding what a CDN or browser is allowed to cache',
    ],
    functionalRequirements: [
      { title: 'Carry requests and responses', detail: 'Methods, status codes, headers, and a body format both sides agree on.' },
      { title: 'Evolve without breaking clients', detail: 'Add fields safely; never repurpose an existing one.' },
      { title: 'Support caching', detail: 'Tell intermediaries what is cacheable, for how long, and how to revalidate.' },
      { title: 'Make retries safe', detail: 'Idempotent methods plus an idempotency key for anything that mutates money.' },
    ],
    nonFunctionalRequirements: [
      { title: 'Latency', detail: 'Round trips dominate; each TLS handshake costs one to two extra of them.' },
      { title: 'Concurrency', detail: 'HTTP/1.1 gives about six connections per origin; HTTP/2 gives hundreds of streams over one.' },
      { title: 'Payload size', detail: 'Compression and binary encodings matter most on mobile networks.' },
      { title: 'Observability', detail: 'Status codes and trace headers must survive every proxy in the path.' },
    ],
    estimates: [
      { label: 'TCP + TLS 1.3 setup', value: '2 round trips', note: '1 with session resumption, 0 with QUIC 0-RTT' },
      { label: 'Browser connections per origin', value: '6', note: 'HTTP/1.1 only; HTTP/2 uses one' },
      { label: 'JSON vs protobuf size', value: '2–5× smaller binary', note: 'Plus cheaper parsing on mobile CPUs' },
      { label: 'Cross-continent round trip', value: '80–150 ms', note: 'Four sequential calls means half a second of nothing' },
      { label: 'Header overhead', value: '500–800 B per request', note: 'HPACK compresses repeats to a few bytes' },
    ],
    concepts: [
      'Connection reuse and keep-alive',
      'Head-of-line blocking at the application and transport layers',
      'Multiplexed streams and HPACK',
      'QUIC and 0-RTT resumption',
      'Safe, idempotent, and unsafe methods',
      'ETag and conditional requests',
      'Cursor pagination',
      'Schema evolution and field numbering',
    ],
    comparisons: [
      {
        title: 'Transport versions',
        headers: ['Version', 'How it works', 'Use when', 'Avoid when'],
        rows: [
          [
            'HTTP/1.1',
            'One request per connection at a time; parallelism means more sockets',
            'Simple internal tools, curl-friendly debugging',
            'Many small assets or high-latency mobile links',
          ],
          [
            'HTTP/2',
            'Many streams multiplexed over one TCP connection, headers compressed with HPACK',
            'Browsers, mobile apps, gRPC between services',
            'Very lossy networks, where TCP loss stalls all streams',
          ],
          [
            'HTTP/3 (QUIC)',
            'Streams over UDP with per-stream loss recovery and built-in TLS',
            'Mobile and lossy networks, connection migration across IP changes',
            'Environments that block UDP, or middleboxes that mangle it',
          ],
        ],
        note: 'HTTP/2 removes application-layer head-of-line blocking but not TCP-layer blocking; only HTTP/3 removes both.',
      },
      {
        title: 'Contract styles',
        headers: ['Style', 'How it works', 'Use when', 'Avoid when'],
        rows: [
          [
            'REST',
            'Resources and URLs, standard verbs, JSON bodies',
            'Public APIs, cacheable reads, wide client variety',
            'Deeply nested graphs needing many round trips',
          ],
          [
            'RPC (JSON)',
            'Named procedures over POST',
            'Internal actions that are not resources ("rebuildIndex")',
            'You want HTTP caching and standard semantics',
          ],
          [
            'gRPC',
            'Protobuf over HTTP/2, generated clients, streaming built in',
            'Service-to-service traffic, low latency, strict schemas',
            'Browsers without a proxy, or ad-hoc curl debugging',
          ],
          [
            'GraphQL',
            'One endpoint, client specifies the exact shape it needs',
            'Many screens with different data needs, one round trip',
            'Simple CRUD, or when HTTP caching is your main lever',
          ],
          [
            'Webhooks',
            'Server calls a client-supplied URL on an event',
            'Third parties needing push without polling',
            'You cannot guarantee delivery, ordering, or the receiver being up',
          ],
        ],
      },
      {
        title: 'Method semantics that decide retry safety',
        headers: ['Method', 'Safe', 'Idempotent', 'Retry after timeout?'],
        rows: [
          ['GET', 'yes', 'yes', 'Always safe'],
          ['PUT', 'no', 'yes', 'Safe — same body gives the same end state'],
          ['DELETE', 'no', 'yes', 'Safe — second delete is a no-op'],
          ['POST', 'no', 'no', 'Only with an Idempotency-Key header'],
          ['PATCH', 'no', 'depends', 'Only if the patch is absolute, not relative'],
        ],
      },
    ],
    architecture:
      'Clients reach an edge over HTTP/2 or HTTP/3 with long-lived connections. The edge terminates TLS and speaks HTTP/2 or gRPC to internal services. Cache headers set at the origin decide what the browser and CDN may keep.',
    diagrams: [{ id: 'wire', title: 'Sockets versus streams', kind: 'excalidraw', src: 'http2-vs-http1' }],
    apis: [
      {
        method: 'GET',
        path: '/v1/orders?limit=20&cursor=eyJpZCI6MTIzfQ',
        description: 'Cursor-paginated list. Cursors survive inserts; offsets do not.',
        response: '200 { "items": [...], "next_cursor": "eyJpZCI6MTQzfQ" }\nETag: "a1b2c3"\nCache-Control: private, max-age=30',
        errors: '400 invalid_cursor · 401 unauthenticated · 429 rate_limited',
      },
      {
        method: 'GET',
        path: '/v1/orders/{id}',
        description: 'Conditional read. A matching ETag saves the entire body.',
        request: 'If-None-Match: "a1b2c3"',
        response: '304 Not Modified (no body) or 200 with the order',
        errors: '404 not_found',
      },
      {
        method: 'POST',
        path: '/v1/orders',
        description: 'Create an order. The idempotency key makes a network retry safe.',
        request: 'Idempotency-Key: 8f14e45f\n{ "sku": "abc", "qty": 2 }',
        response: '201 { "id": "ord_123", "status": "pending" }\nReplay returns the original 201, not a duplicate order',
        errors: '409 idempotency_key_reused_with_different_body · 422 out_of_stock',
      },
    ],
    walkthrough: [
      {
        title: 'Resolve, connect, handshake',
        description:
          'DNS gives an address, TCP costs one round trip, TLS 1.3 costs one more. Roughly 250ms is gone before the first byte on a cross-region link, which is why connection reuse matters more than payload size.',
      },
      {
        title: 'HTTP/1.1 runs out of sockets',
        description:
          'A page needing 30 assets over six connections serialises into five waves. Any slow response blocks everything queued behind it on that connection. This is application-layer head-of-line blocking.',
        animation: 'lb-l4-l7',
      },
      {
        title: 'HTTP/2 multiplexes',
        description:
          'One connection carries many interleaved streams, each with its own flow control, and HPACK compresses repeated headers to a few bytes. Thirty assets now go out concurrently over a single socket.',
      },
      {
        title: 'TCP still blocks on loss',
        description:
          'Because all streams share one TCP connection, a single lost segment stalls every stream until it is retransmitted. HTTP/3 moves to QUIC over UDP, where loss on one stream leaves the others running.',
      },
      {
        title: 'The response says what may be cached',
        description:
          'Cache-Control decides whether the browser and CDN may store the response, and ETag lets the next request revalidate cheaply with a 304 instead of transferring the body again.',
      },
      {
        title: 'Retries need semantics',
        description:
          'A timeout does not tell you whether the server processed the request. GET, PUT, and DELETE are safe to repeat by definition. POST needs an Idempotency-Key that the server stores so a replay returns the original result.',
      },
    ],
    deepDives: [
      {
        title: 'Head-of-line blocking exists at two layers',
        body:
          'At the application layer, HTTP/1.1 forces responses on a connection to come back in order, so one slow response blocks everything behind it. HTTP/2 fixes that with independent streams. At the transport layer, TCP guarantees in-order delivery of the whole byte stream, so one lost packet stalls every multiplexed stream until retransmission. HTTP/2 actually concentrated this risk by putting everything on a single connection. QUIC solves it by tracking loss per stream, which is why HTTP/3 wins most clearly on lossy mobile networks rather than on fast wired ones.',
      },
      {
        title: 'gRPC is not just "fast JSON"',
        body:
          'The real differences are the schema and the generated code. Protobuf fields are identified by number, so renaming a field is free and reusing a number is catastrophic. Adding an optional field is always backward compatible, which means services deploy independently. You also get four call shapes — unary, server streaming, client streaming, and bidirectional — over one connection. The costs are that browsers cannot speak gRPC without grpc-web and a proxy, payloads are not human readable, and ordinary HTTP caches cannot help you because everything is a POST.',
      },
      {
        title: 'GraphQL moves the round trips, not the work',
        body:
          'One query can replace a dozen REST calls, which is a genuine win on mobile. But the server still has to resolve each field, and a naive resolver turns one query into hundreds of database calls: the N+1 problem. The standard fix is a per-request batching loader that collects all the ids requested for a field and issues a single query. You also lose URL-level HTTP caching, because everything is one POST endpoint, and you gain a new operational risk: a client can write a deeply nested query that is expensive to execute, so you need query depth limits and cost analysis.',
      },
      {
        title: 'Cache headers are an API design decision',
        body:
          'Cache-Control: public, max-age=31536000, immutable belongs on content-hashed assets, where the URL changes whenever the bytes change. HTML and API responses get short max-age with must-revalidate, or no-store when they contain personal data. Add ETag so a revalidation costs headers instead of a body. The subtle one is Vary: if a response differs by Accept-Encoding or Authorization, you must declare it, or a shared cache will serve one user the other user response. Getting this wrong is one of the few API bugs that is both a performance problem and a security incident.',
      },
      {
        title: 'Pagination: cursors, not offsets',
        body:
          'OFFSET 10000 makes the database count and discard ten thousand rows on every page, and if a row is inserted while the client pages, items shift and some are skipped or repeated. A cursor encodes the sort key of the last item seen — typically an opaque base64 of (created_at, id) — so the next query is an indexed range scan with a stable result set. Keep the cursor opaque so you can change the encoding later, and always return an explicit next_cursor rather than making clients construct one.',
      },
      {
        title: 'Status codes are a contract, not decoration',
        body:
          'Clients make retry decisions from the code, so getting it wrong causes real damage. 4xx means do not retry without changing something; 5xx and 429 mean retry with backoff. Return 429 with Retry-After for rate limits, 409 for a genuine state conflict, and 422 for a request that is well-formed but semantically invalid. The common anti-pattern is returning 200 with an error object in the body: every proxy, cache, and retry library in the path now believes the call succeeded.',
      },
    ],
    tradeoffs: [
      'gRPC gives speed and strict schemas but sacrifices browser reach and curl-level debuggability.',
      'GraphQL saves round trips but forfeits URL-based HTTP caching and adds query cost control.',
      'HTTP/2 removes application head-of-line blocking but concentrates transport loss on one connection.',
      'Long cache lifetimes cut origin load but make an incorrect deploy hard to withdraw.',
    ],
    bottlenecks: [
      'Chatty clients making sequential calls across a high-latency link.',
      'Missing keep-alive, so every call pays a TLS handshake.',
      'Unbounded page sizes and offset pagination on large tables.',
      'GraphQL resolvers issuing N+1 queries.',
    ],
    scalingPath: [
      { scale: 'Prototype', focus: 'REST plus JSON over HTTP/1.1, no cache headers yet' },
      { scale: 'One region', focus: 'HTTP/2 at the edge, ETags, cursor pagination, idempotency keys on writes' },
      { scale: 'Global', focus: 'HTTP/3 at the edge, gRPC internally, immutable asset caching, per-client cost limits' },
    ],
    interviewScript: [
      '"The mobile client talks HTTP/2 to the edge, so thirty requests share one connection."',
      '"Internally I use gRPC: strict schemas, generated clients, and cheap streaming."',
      '"Reads carry an ETag so revalidation costs headers, not a body."',
      '"Writes are POST with an Idempotency-Key, so a client retry cannot double-charge."',
      '"Pagination is cursor-based, because OFFSET degrades and skips rows under concurrent inserts."',
      '"I would only reach for GraphQL if the screens genuinely need different shapes of the same graph."',
    ],
    commonMistakes: [
      'Returning 200 with an error body.',
      'Retrying a non-idempotent POST without an idempotency key.',
      'Offset pagination on a table that receives writes.',
      'Forgetting Vary and leaking one user response to another through a shared cache.',
      'Assuming HTTP/2 removed all head-of-line blocking.',
      'Exposing gRPC directly to browsers.',
    ],
    relatedTopics: ['dns', 'api-gateway', 'cdn', 'realtime', 'auth'],
    examples: [
      'Google runs gRPC internally and REST at the public edge',
      'GitHub offers both REST and GraphQL, with GraphQL rate limits priced by computed query cost',
      'Stripe made Idempotency-Key on POST the reference pattern for payment APIs',
    ],
    practicePrompt:
      'Design the read and write API for a comment feed. Specify the pagination scheme, the cache headers, and exactly what happens when a client retries a create after a timeout.',
    followUps: [
      {
        question: 'When is HTTP/3 actually worth it?',
        answer:
          'On lossy or changing networks. QUIC recovers loss per stream instead of stalling the whole connection, and connection migration keeps a session alive when a phone moves from wifi to cellular. On a clean wired network the gain over HTTP/2 is small, and some corporate networks block UDP entirely, so keep HTTP/2 as a fallback.',
        category: 'Transport',
        difficulty: 'medium',
      },
      {
        question: 'How do you version an API?',
        answer:
          'Prefer additive evolution: new optional fields, never repurposing existing ones. When a breaking change is unavoidable, put the version in the path (/v2/) so routing and metrics are trivial, run both versions concurrently, and publish a deprecation window with usage metrics per client so you know when it is safe to remove.',
        category: 'Contracts',
        difficulty: 'medium',
      },
      {
        question: 'What exactly does an idempotency key store?',
        answer:
          'A record keyed by (client, key) holding the request fingerprint, the status, and the serialised response, typically kept 24 hours. A replay with the same key and body returns the stored response; the same key with a different body returns 409. The row must be written in the same transaction as the effect, or a crash between the two lets a retry double-charge.',
        category: 'Reliability',
        difficulty: 'hard',
      },
      {
        question: 'Why can browsers not speak gRPC directly?',
        answer:
          'Browser fetch APIs do not expose the HTTP/2 framing gRPC needs, particularly trailers. grpc-web works around it with a modified framing that a proxy such as Envoy translates to real gRPC. That proxy hop is why most public edges stay REST or GraphQL and reserve gRPC for internal traffic.',
        category: 'Contracts',
        difficulty: 'medium',
      },
      {
        question: 'How do you stop a GraphQL query from taking down the database?',
        answer:
          'Limit query depth and breadth, assign each field a cost and reject queries above a budget, use per-request batching loaders to kill N+1 resolution, and enforce persisted queries in production so clients can only send pre-approved documents. Rate limit on computed cost rather than on request count.',
        category: 'Contracts',
        difficulty: 'hard',
      },
      {
        question: 'What is the difference between safe and idempotent?',
        answer:
          'Safe means no side effects at all, so GET and HEAD qualify. Idempotent means repeating the request leaves the same end state, which covers PUT and DELETE as well. Every safe method is idempotent; the reverse is not true. Retry logic depends on idempotency, while caching depends on safety.',
        category: 'Contracts',
        difficulty: 'easy',
      },
      {
        question: 'Why is Vary a security issue and not just a performance one?',
        answer:
          'A shared cache keys entries on the URL plus whatever Vary lists. If a personalised response omits Vary: Authorization, the cache can serve one user private data to another. The safe defaults are Cache-Control: private or no-store on anything user-specific, and an explicit Vary on anything that genuinely differs by header.',
        category: 'Caching',
        difficulty: 'hard',
      },
      {
        question: 'How should webhooks be delivered reliably?',
        answer:
          'Sign the payload so the receiver can verify origin, include an event id so the receiver can deduplicate, retry with exponential backoff for a bounded window, and expose a replay endpoint plus a dead-letter view. Assume at-least-once delivery and out-of-order arrival, and tell integrators to make handlers idempotent.',
        category: 'Contracts',
        difficulty: 'hard',
      },
      {
        question: 'Do you still need to bundle and sprite assets under HTTP/2?',
        answer:
          'Much less. Multiplexing removes the per-request connection penalty that made bundling essential, and smaller files cache more granularly, so one changed module does not invalidate a megabyte bundle. Some bundling still helps compression ratios and reduces per-file overhead, so the modern answer is moderate chunking rather than one giant bundle or hundreds of tiny files.',
        category: 'Transport',
        difficulty: 'medium',
      },
      {
        question: 'Where does the trace context live?',
        answer:
          'In the traceparent header defined by W3C Trace Context, propagated by every hop including proxies and queue consumers. Any component that drops it breaks the trace at that boundary, which is why gateway and message-broker configuration is the usual place traces go missing.',
        category: 'Observability',
        difficulty: 'medium',
      },
    ],
  }),
};
