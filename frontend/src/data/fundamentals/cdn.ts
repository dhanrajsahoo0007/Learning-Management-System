import { ArchitectureTopic, emptyContent } from '../systemDesignTypes';

export const cdnTopic: ArchitectureTopic = {
  id: 'cdn',
  title: 'CDN and the Edge',
  description:
    'Serving bytes from a machine near the user instead of your origin, and the cache key discipline that decides whether it works.',
  difficulty: 'Intermediate',
  progress: 0,
  icon: 'Globe',
  color: 'bg-sky-600',
  section: 'fundamentals',
  track: 'classic',
  prerequisites: ['caching'],
  estimatedMinutes: 65,
  order: 9,
  content: emptyContent({
    overview:
      'A content delivery network is a cache in front of your origin, operated by somebody else, replicated to hundreds of points of presence close to users. It buys two separate things: latency, because the round trip is 10 ms instead of 150 ms, and offload, because 96% of requests never reach your servers. Whether you get either depends almost entirely on the cache key, which most teams get wrong on their first attempt. The edge is also increasingly a place to run code, not just to store responses.',
    whyItExists:
      'The speed of light puts a floor of roughly 150 ms on a round trip between London and Sydney, and no amount of server capacity removes it. Placing a copy of the response near the user removes the distance, and doing so also removes the traffic from your origin.',
    problemStatement: {
      prompt:
        'You are serving a video-heavy site to users on five continents from two origin regions, and origin egress is now the largest line on the bill. Design the delivery path. Decide what is cached, how the cache key is composed, what TTL each content type gets, and how a wrong file already served to a million users is corrected.',
      inScope: [
        'Pull versus push distribution, and dynamic acceleration',
        'The path from DNS through the edge and shield to the origin',
        'Cache key composition, TTL policy, and purge strategy',
        'Origin shielding, request collapsing, and multi-CDN',
      ],
      outOfScope: [
        'Video encoding ladders and adaptive bitrate packaging',
        'Rate limiting and authentication logic (see those lessons)',
        'BGP and anycast internals beyond how traffic reaches a point of presence',
        'Application caching inside your own services (see the caching lesson)',
      ],
    },
    assumptions: [
      'Most bytes are static and public: images, bundles, and video segments',
      'HTML is small, personalised at the margins, and changes often',
      'You control response headers at the origin and can deploy content-hashed filenames',
    ],
    whenToUse: [
      'Any public asset served to users who are not in your origin region',
      'A launch or event that will multiply read traffic for a short window',
      'Large downloads or video, where origin egress cost dominates compute cost',
    ],
    functionalRequirements: [
      { title: 'Serve cached responses at the edge', detail: 'A hit is answered from the nearest point of presence without contacting the origin.' },
      { title: 'Fetch and store on a miss', detail: 'A miss is fetched through the shield, stored under a deterministic cache key, and returned.' },
      { title: 'Respect freshness rules', detail: 'Cache-Control, ETag, and Vary from the origin decide TTL, revalidation, and key variants.' },
      { title: 'Correct a bad object', detail: 'Purge by URL, prefix, or surrogate tag, or ship a new content-hashed URL instead.' },
    ],
    nonFunctionalRequirements: [
      { title: 'Latency', detail: 'Edge hit in 5–20 ms versus 80–200 ms cross-continent to a single origin.' },
      { title: 'Offload', detail: 'Target 95% or better on static assets; anything under 80% means the cache key is wrong.' },
      { title: 'Availability', detail: 'The edge should serve stale content when the origin is down rather than propagate the failure.' },
      { title: 'Cost', detail: 'CDN egress is cheaper than origin egress, and a cache hit costs nothing in origin compute.' },
    ],
    estimates: [
      { label: 'Round trip to a nearby point of presence', value: '5–20 ms versus 80–200 ms to one origin region', note: 'London to Sydney is about 150 ms at best, and TLS multiplies it' },
      { label: 'Origin load at 96% hit rate', value: '10k RPS becomes 400 RPS', note: 'A shield collapsing misses can halve that again' },
      { label: 'Bytes offloaded', value: '1 PB/month at 95% offload leaves 50 TB from origin', note: 'At typical cloud egress rates this is the single largest saving' },
      { label: 'Immutable asset TTL', value: '31,536,000 s (one year)', note: 'Only safe when the filename contains a content hash' },
      { label: 'Cache fragmentation from one stray parameter', value: '1 asset × 50 campaign values = 50 entries per point of presence', note: 'With 300 points of presence that is 15,000 misses before anything is warm' },
    ],
    concepts: [
      'Point of presence, edge, and origin shield',
      'Pull versus push distribution',
      'Cache key: URL, query string, and Vary',
      'Cache-Control, immutable, ETag revalidation',
      'stale-while-revalidate and stale-if-error',
      'Request collapsing and origin shielding',
      'Purge versus versioned URL',
      'Signed and expiring URLs',
    ],
    comparisons: [
      {
        title: 'Kinds of edge delivery',
        headers: ['Type', 'How it works', 'Use when', 'Avoid when'],
        rows: [
          [
            'Pull CDN',
            'The edge holds nothing until a user asks; the first request per point of presence misses and fetches from the origin, then stores it for the TTL',
            'Almost always: images, bundles, video segments, public JSON',
            'The first user in each region cannot tolerate a slow cold request',
          ],
          [
            'Push CDN',
            'You upload objects to the network ahead of time and manage their lifetime yourself',
            'Large files with a known release moment, such as a game patch or a launch video',
            'A long tail of rarely accessed objects, where you would pay to store everything everywhere',
          ],
          [
            'Dynamic acceleration',
            'Nothing is cached; the request rides the provider backbone with warm TLS and TCP connections and better routing than the public internet',
            'Personalised HTML and API calls that must reach the origin',
            'The response is genuinely cacheable and you are paying for routing instead of hits',
          ],
          [
            'Edge compute',
            'Small functions run at the point of presence to rewrite requests, do A/B splits, verify tokens, or assemble a response from cached fragments',
            'Decisions that only need the request itself and no shared state',
            'You need a database, a transaction, or anything requiring consistency',
          ],
          [
            'Multi-CDN',
            'Two or more providers behind a steering layer, usually DNS or a client-side selector, chosen on measured availability and latency',
            'Delivery is business-critical, or one provider has poor coverage in a key market',
            'You cannot afford to keep two configurations, two purge paths, and two sets of headers in step',
          ],
        ],
      },
      {
        title: 'Cache policy by content type',
        headers: ['Content', 'TTL', 'Cache key', 'Why'],
        rows: [
          ['app.9f3c1a.js', 'max-age=31536000, immutable', 'Path only; strip all query parameters', 'The hash is the version, so the URL can never mean anything else'],
          ['Listing HTML (anonymous)', 'max-age=60, stale-while-revalidate=600', 'Path plus the few parameters that change the page, plus Vary on Accept-Encoding', 'Content changes often, and the grace window hides origin latency and outages'],
          ['Public API JSON', 'max-age=10, stale-if-error=86400', 'Path, sorted whitelisted query parameters, Vary on Accept-Encoding', 'Short freshness with a long fallback keeps read endpoints up during an origin incident'],
          ['User avatar', 'max-age=86400', 'Path including the user id and an upload version', 'Public but per-object; a new upload produces a new URL rather than a purge'],
          ['Video segment', 'max-age=604800', 'Path only, segments are immutable once packaged', 'Segments are never rewritten, and long TTLs are what make offload above 99% possible'],
        ],
        note: 'Private or per-user responses should carry Cache-Control: private, no-store unless you are certain the key includes the identity.',
      },
    ],
    architecture:
      'A user resolves your hostname to an anycast address belonging to the CDN, which lands them on the nearest point of presence. On a miss that point of presence asks a designated shield, one node per region that fronts the origin and collapses duplicate requests, and only the shield talks to your origin. The origin therefore sees a small, stable request rate regardless of how much traffic the edge is handling.',
    diagrams: [
      { id: 'path', title: 'Edge, shield, origin', kind: 'excalidraw', src: 'cdn-path' },
      { id: 'anim', title: 'Cold edge to warm edge', kind: 'animation', src: 'cdn-hit' },
    ],
    walkthrough: [
      {
        title: 'DNS puts the user on a nearby point of presence',
        description:
          'Your hostname is a CNAME to the provider, whose authoritative servers answer with an anycast address, so BGP delivers the packets to the topologically closest site. This is the first steering decision and it happens before any of your code runs. It is also why a CDN can move traffic away from a failing region far faster than you can by editing records.',
      },
      {
        title: 'The edge computes a cache key and looks it up',
        description:
          'The point of presence turns the request into a key from the hostname, the path, whichever query parameters the configuration allows, and any headers named in the Vary response. If that key is present and fresh it returns the stored bytes in a few milliseconds. Every hit-rate problem you will ever have starts in this step.',
        animation: 'cdn-hit',
      },
      {
        title: 'A miss goes to the shield, not to the origin',
        description:
          'Without a shield, 300 points of presence each fetch the same object separately, so the origin serves 300 copies of one file. With a shield each region funnels misses through one node, which also collapses concurrent requests for the same key into a single upstream fetch. The origin sees one request even when ten thousand users asked at the same instant.',
      },
      {
        title: 'The origin answers with headers that are the real policy',
        description:
          'The origin returns the bytes plus Cache-Control, ETag, and Vary, and those headers are what the network obeys. Sending Cache-Control: no-store on your JavaScript bundle turns a CDN into an expensive proxy, and sending a long max-age on HTML makes a bad deploy permanent. Treat these headers as production configuration and assert them in tests.',
      },
      {
        title: 'Later requests are served from memory at the edge',
        description:
          'Once warm, the point of presence answers locally and your origin never learns those requests happened. On expiry the edge revalidates with If-None-Match and usually receives a 304 with no body, which costs a small header exchange rather than a full transfer. With stale-while-revalidate the user is not even made to wait for that check.',
      },
      {
        title: 'Correcting a mistake: version rather than purge',
        description:
          'If a shipped asset is wrong, the reliable fix is a new URL with a new content hash, because it takes effect immediately everywhere and cannot be defeated by a browser cache you do not control. A purge is the tool for content you cannot rename, such as HTML or an API response, and it is best done by surrogate tag so one call can invalidate every page that embedded a changed listing.',
      },
    ],
    deepDives: [
      {
        title: 'The cache key is the whole design',
        body:
          'The key is composed from the hostname, the path, the query parameters your configuration permits, and every header listed in the response Vary. Add nothing else. A single tracking parameter such as a campaign tag turns one object into as many entries as there are values, so with 50 campaigns and 300 points of presence you have created 15,000 separate cold entries for one file, and the hit rate falls from 98% to under 20% while origin traffic multiplies. The fixes are to strip unknown parameters at the edge, sort and whitelist the ones that genuinely change the response, and normalise case. Vary deserves the same suspicion: Vary on Accept-Encoding is necessary, Vary on User-Agent forks the cache thousands of ways, and Vary on Cookie usually means nothing will ever be cached.',
      },
      {
        title: 'Immutable assets versus HTML',
        body:
          'Build a bundle as app.9f3c1a.js where the hash is derived from the contents, then serve it with Cache-Control: max-age=31536000, immutable. Because the name changes whenever the bytes change, that URL can be cached for a year at every layer with no risk, and browsers with immutable will not even revalidate on reload. The HTML that references it must go the other way: a short max-age of 30 to 60 seconds plus stale-while-revalidate, so a deploy is visible within a minute. This split is the single highest-value change most teams can make, because it moves the entire asset payload to a permanent cache while leaving the one small document that names them under your control.',
      },
      {
        title: 'Origin shielding and request collapsing',
        body:
          'Consider a World Cup goal clip published at kickoff. Within one second, two million viewers request the same segment and it exists nowhere in the network. Without collapsing, each of 300 points of presence opens its own connection and your origin receives 300 concurrent fetches of a 4 MB file; without shielding at all, in the worst case each individual miss becomes an origin request and the origin simply falls over. Shielding designates one node per region as the only path to the origin, and request collapsing holds all concurrent waiters for a key on a single in-flight fetch. The origin serves one or a handful of copies, the shield fans out to the edges, and the edges fan out to users. This is why the interview answer to a hot object is always shield plus collapse before it is extra origin capacity.',
      },
      {
        title: 'Purge, and why it is not the primary tool',
        body:
          'A purge instructs the network to drop a key, and modern providers do it globally in a few seconds. It has three limits. It does not reach browsers, so a user holding a response with max-age=3600 keeps it regardless. It is rate limited and is billed, so purging by wildcard on every deploy is both slow and expensive. And it creates a cold key at the exact moment traffic is highest, which is a stampede aimed at your origin. Surrogate keys are the sane middle ground: tag each response with the entities it contains, then purge by tag when an entity changes, so editing one listing invalidates exactly the pages that show it. For anything you control the filename of, a versioned URL is strictly better than a purge.',
      },
      {
        title: 'Signed URLs and what the edge can decide alone',
        body:
          'For paid or private content, the origin issues a URL containing an expiry timestamp and a signature over the path and expiry, computed with a key the CDN also holds. The edge verifies the signature and the expiry itself, so an unauthorised request is rejected in a few milliseconds without any call to your services, and a leaked link stops working after, say, five minutes. You can bind the token further to a client IP or a session identifier at the cost of breaking mobile users who change network. The same principle covers edge compute generally: the edge can check a signature, run an experiment split, or rewrite a path, because all of those need only the request. Anything requiring shared mutable state belongs at the origin.',
      },
      {
        title: 'Multi-CDN and dynamic acceleration',
        body:
          'One provider is a single point of failure for delivery, and providers do have regional failures. Multi-CDN puts a steering layer in front, usually DNS answering with the provider currently measured as healthiest and fastest per region, sometimes a small client-side selector for finer control. The cost is real: two configurations, two purge integrations, two sets of header behaviour, and a hit rate that is split across both networks. For traffic that cannot be cached at all, dynamic acceleration is the other half of the story. The request still enters at the nearest point of presence, but the value is a warm connection and an optimised path across the provider backbone instead of the public internet, which typically saves 20 to 40% of round-trip time on long routes and removes the TLS handshake from the user path.',
      },
    ],
    tradeoffs: [
      'Long TTLs give the best hit rate and make an incorrect object hard to withdraw.',
      'A pull network is free to configure and makes the first user in each region pay for the miss.',
      'Shielding cuts origin load and adds one hop of latency to every miss.',
      'Multi-CDN removes a single point of failure and splits your hit rate across two networks.',
    ],
    bottlenecks: [
      'Cache keys fragmented by query parameters or an over-broad Vary header.',
      'A newly published hot object with no shield, so every point of presence fetches it separately.',
      'Origin egress and connection limits during a purge-induced cold start.',
      'Uncacheable personalised HTML dragging every request back to the origin region.',
    ],
    scalingPath: [
      { scale: 'Prototype', focus: 'One pull CDN in front of static assets, content-hashed filenames, HTML at max-age=60' },
      { scale: 'One region', focus: 'Origin shield, request collapsing, surrogate-key purges, stale-if-error on read APIs' },
      { scale: 'Global', focus: 'Two providers behind latency steering, regional shields, signed URLs for paid media, edge compute for routing and experiments' },
    ],
    interviewScript: [
      '"The user resolves to an anycast address, so they land on a point of presence 10 milliseconds away instead of an origin 150 milliseconds away."',
      '"Bundles are content-hashed and cached for a year; HTML gets 60 seconds plus stale-while-revalidate."',
      '"I strip unknown query parameters at the edge, because one campaign tag can fragment a single object into fifty cache entries."',
      '"Misses go through a regional shield that collapses duplicates, so the origin serves one copy of a hot segment rather than three hundred."',
      '"To fix a bad asset I ship a new hashed URL. Purge is reserved for HTML and API responses I cannot rename."',
      '"Paid video uses signed URLs with a five minute expiry, verified at the edge so no request reaches my services."',
    ],
    commonMistakes: [
      'Allowing arbitrary query parameters into the cache key and then wondering why the hit rate is 30%.',
      'Serving Cache-Control: no-store on assets and calling the CDN ineffective.',
      'Putting a long max-age on HTML, so a broken deploy cannot be rolled back for an hour.',
      'Caching a personalised response at a shared layer without the identity in the key.',
      'Relying on wildcard purges as the deploy mechanism, creating a cold origin at peak.',
      'Assuming a CDN helps write-heavy or per-request API traffic, where dynamic acceleration is the relevant tool.',
    ],
    relatedTopics: ['caching', 'storage-media', 'dns', 'http-rpc', 'youtube', 'netflix'],
    examples: [
      'Netflix places Open Connect appliances inside internet service providers so video segments are served from within the access network',
      'Cloudflare runs its cache on anycast so a single address is answered by whichever point of presence is closest',
      'Fastly built its business on instant surrogate-key purging, which is what makes short-TTL news HTML cacheable at all',
    ],
    practicePrompt:
      'A single 4 MB video segment is published and requested by two million users within one second. Describe the exact path of the first request and explain how many requests your origin actually receives.',
    followUps: [
      {
        question: 'Why does one extra query parameter destroy the hit rate?',
        answer:
          'The parameter is part of the cache key by default, so every distinct value is a separate object at every point of presence. Fifty campaign values across 300 sites means 15,000 cold entries for one file, and every one of them is a fetch from your origin. Strip unknown parameters at the edge and whitelist only those that genuinely change the response.',
        category: 'Cache keys',
        difficulty: 'easy',
      },
      {
        question: 'Pull or push for a game patch released at a fixed time?',
        answer:
          'Push, or a pre-warm on a pull network, because the access pattern is known in advance and the file is large. Uploading ahead of the release means the first million users all get an edge hit instead of thousands of points of presence simultaneously discovering they have nothing. For the long tail of ordinary assets, pull remains correct because you should not pay to store rarely read objects everywhere.',
        category: 'Distribution',
        difficulty: 'medium',
      },
      {
        question: 'How do you cache HTML that contains the user name?',
        answer:
          'Split the response. Cache the shell publicly with a short TTL and fetch the personalised fragment separately, or assemble the page at the edge from a cached shell plus a small authenticated call. Edge compute makes the second option practical. What you must not do is cache the whole page at a shared layer without identity in the key, because that leaks one user data to the next visitor.',
        category: 'Dynamic content',
        difficulty: 'hard',
      },
      {
        question: 'You shipped a broken bundle. Purge or version?',
        answer:
          'Version. A new content hash produces a new URL that takes effect the moment the referencing HTML updates, and it works even for browsers still holding the old file under its old name. A purge clears the network but cannot reach a browser that already has the response, and it creates a cold key at peak traffic. Purge is the tool for the HTML document itself, which cannot be renamed.',
        category: 'Operations',
        difficulty: 'medium',
      },
      {
        question: 'What does an origin shield actually do?',
        answer:
          'It designates one node per region as the only path from the edge to your origin, so misses from many points of presence converge instead of arriving independently. It also collapses concurrent requests for the same key into a single upstream fetch. The result is that origin request volume tracks the number of distinct objects rather than the number of edge locations or users, at the cost of one additional hop on a miss.',
        category: 'Architecture',
        difficulty: 'medium',
      },
      {
        question: 'When is a CDN the wrong answer?',
        answer:
          'When the response is different for every request and cannot be cached, such as a personalised feed or a write. You then get no offload, and the only remaining benefit is routing and connection reuse, which is what dynamic acceleration sells. It is also wrong when the data must be strictly fresh, because the whole mechanism is built on serving a copy that may be slightly old.',
        category: 'Design',
        difficulty: 'easy',
      },
      {
        question: 'How does stale-if-error change an origin outage?',
        answer:
          'With stale-if-error set to a long window, the edge continues to serve the last good response when the origin returns 5xx or times out, so users see slightly old content rather than an error page. Combined with stale-while-revalidate it means the origin can be down for hours and read traffic still succeeds. It only covers keys that were warm before the outage, so it protects popular pages and not the long tail.',
        category: 'Reliability',
        difficulty: 'medium',
      },
      {
        question: 'How would you protect paid video from link sharing?',
        answer:
          'Issue signed URLs from the origin that embed an expiry and a signature over the path, verified at the edge with a shared key. A five minute expiry limits the value of a copied link without any per-request call to your services. Binding the token to a client IP is stronger but breaks users who move between mobile and wifi, so most systems bind to a session and accept short-lived sharing.',
        category: 'Security',
        difficulty: 'hard',
      },
      {
        question: 'Is multi-CDN worth the complexity?',
        answer:
          'Only when delivery failure is a business incident or one provider has genuinely poor performance in a market you care about. The gain is that a provider outage becomes a steering change rather than downtime. The cost is duplicate configuration, duplicate purge paths, subtly different header handling, and a hit rate split across two networks, so most teams should first exhaust single-provider reliability features.',
        category: 'Reliability',
        difficulty: 'hard',
      },
      {
        question: 'What can you safely run at the edge?',
        answer:
          'Anything that depends only on the incoming request: signature checks, redirects, header rewriting, geolocation routing, experiment bucketing, and assembling a page from cached fragments. What does not belong there is anything needing shared mutable state or a transaction, because you would be making a call back to a central region from hundreds of locations and paying the latency you deployed to the edge to avoid.',
        category: 'Edge compute',
        difficulty: 'medium',
      },
    ],
  }),
};
