import { ArchitectureTopic, emptyContent } from '../systemDesignTypes';

export const dnsTopic: ArchitectureTopic = {
  id: 'dns',
  title: 'DNS and Name Resolution',
  description: 'How a hostname becomes an IP, what TTL really costs you, and why DNS is a weak load balancer on its own.',
  difficulty: 'Beginner',
  progress: 0,
  icon: 'Globe',
  color: 'bg-sky-700',
  section: 'fundamentals',
  track: 'classic',
  prerequisites: ['interview-approach'],
  estimatedMinutes: 60,
  order: 1,
  content: emptyContent({
    overview:
      'DNS is the first hop of every request and the only part of your stack you cannot fully control. It is a globally distributed, aggressively cached key-value lookup with one knob that matters: TTL.',
    whyItExists:
      'Humans cannot remember addresses, and machines move. DNS adds a layer of indirection so a name can survive a server, a region, or an entire provider change.',
    problemStatement: {
      prompt:
        'A user types api.example.com. Before a single byte of your application runs, four or five machines you do not own have to agree on an address. Design that lookup, and decide what TTL you can live with when a region fails.',
      inScope: [
        'Recursive versus authoritative resolution',
        'The common record types and what each is for',
        'TTL, caching, and the real cost of failover',
        'Anycast, geo-DNS, and weighted routing',
      ],
      outOfScope: [
        'Running your own root servers',
        'DNSSEC key rotation ceremonies in depth',
        'Registrar and domain purchasing workflows',
        'Full BGP routing behaviour',
      ],
    },
    assumptions: [
      'Clients use a recursive resolver they did not choose (ISP, 8.8.8.8, corporate)',
      'You control your authoritative zone and can set TTLs',
      'Resolvers mostly honour TTL, but some clamp or ignore it',
    ],
    whenToUse: [
      'Any public endpoint: web, API, mail, or service host',
      'Region failover and traffic steering above the load balancer',
      'Service discovery inside a cluster, where DNS is often the simplest registry',
    ],
    functionalRequirements: [
      { title: 'Resolve a name to an address', detail: 'A and AAAA records, plus CNAME indirection for managed endpoints.' },
      { title: 'Steer traffic', detail: 'Geo, latency, and weighted answers so users reach a nearby healthy region.' },
      { title: 'Support failover', detail: 'Remove a dead region from answers within an acceptable window.' },
      { title: 'Carry metadata', detail: 'MX for mail, TXT for domain verification and SPF, SRV for service ports.' },
    ],
    nonFunctionalRequirements: [
      { title: 'Latency', detail: 'A cached answer costs microseconds; a cold full walk costs 100–300ms.' },
      { title: 'Availability', detail: 'DNS must outlive your application; use at least two independent providers for critical zones.' },
      { title: 'Propagation window', detail: 'A change is only fully live after the longest cached TTL expires.' },
      { title: 'Integrity', detail: 'Cache poisoning and hijacking are the real attacks; DNSSEC and CAA records mitigate them.' },
    ],
    estimates: [
      { label: 'Cold full resolution', value: '100–300 ms', note: 'Stub, resolver, root, TLD, authoritative' },
      { label: 'Cached at resolver', value: '1–20 ms', note: 'The overwhelmingly common case' },
      { label: 'Typical web TTL', value: '300 s', note: 'Balance of failover speed and query volume' },
      { label: 'Failover TTL', value: '30–60 s', note: 'Costs roughly 10× the query volume of a 300s TTL' },
      { label: 'Query cost at scale', value: '1M clients / 60s TTL ≈ 16k QPS', note: 'Managed DNS bills per query' },
    ],
    concepts: [
      'Recursive vs authoritative resolvers',
      'Root, TLD, and zone delegation',
      'A, AAAA, CNAME, ALIAS, MX, TXT, SRV, NS',
      'TTL and negative caching',
      'Anycast and geo-DNS',
      'Cache poisoning and DNSSEC',
      'Why DNS cannot health-check',
    ],
    comparisons: [
      {
        title: 'Record types you will actually be asked about',
        headers: ['Record', 'How it works', 'Use when', 'Avoid when'],
        rows: [
          ['A / AAAA', 'Maps a name directly to an IPv4 / IPv6 address', 'You own a stable address or anycast VIP', 'The target IP changes often'],
          ['CNAME', 'Alias to another name; resolver follows a second lookup', 'Pointing at a managed endpoint (ALB, CDN)', 'At the zone apex — it is illegal there'],
          ['ALIAS / ANAME', 'Provider-side CNAME flattened into an A answer', 'You need apex.com to point at a managed LB', 'You need portability between DNS providers'],
          ['MX', 'Names the mail exchangers plus a priority', 'Receiving email for the domain', 'Anything that is not SMTP'],
          ['TXT', 'Free-form strings', 'Domain verification, SPF, DKIM', 'Storing anything large or secret'],
          ['SRV', 'Returns host plus port plus weight', 'Internal service discovery, SIP, XMPP', 'Browsers — they ignore SRV'],
          ['NS', 'Delegates a subtree to other nameservers', 'Splitting a subdomain to another team or provider', 'You want a single authoritative zone'],
        ],
      },
      {
        title: 'Traffic steering strategies',
        headers: ['Strategy', 'How it works', 'Use when', 'Avoid when'],
        rows: [
          ['Simple', 'One answer for everyone', 'Single region', 'You have more than one region'],
          ['Weighted', 'Answers returned in set proportions', 'Canary and gradual migration', 'You need per-request precision'],
          ['Latency / geo', 'Answer depends on resolver location', 'Global users, regional stacks', 'Resolver location misrepresents the user'],
          ['Failover', 'Secondary answer only when the primary health check fails', 'Active–passive disaster recovery', 'You need sub-second failover'],
          ['Anycast (not DNS)', 'One IP announced from many sites; BGP picks', 'CDN and DNS infrastructure itself', 'Long-lived TCP that must not re-route'],
        ],
        note: 'Everything except anycast is applied at answer time, so it is only as fast as the TTL that is already cached.',
      },
    ],
    architecture:
      'A stub resolver in the operating system asks a recursive resolver. On a cache miss the resolver walks the delegation chain — root, then TLD, then your authoritative nameservers — and caches every answer for its TTL. Your control ends at the authoritative zone.',
    diagrams: [
      { id: 'walk', title: 'The resolution walk', kind: 'excalidraw', src: 'dns-walk' },
      { id: 'anim', title: 'Following one lookup', kind: 'animation', src: 'dns-walk' },
    ],
    walkthrough: [
      {
        title: 'The stub asks a resolver',
        description:
          'The OS stub resolver has no cache worth speaking of and no ability to walk the tree. It sends one UDP query to the configured recursive resolver and waits. This is why a broken resolver looks like "the whole internet is down".',
        animation: 'dns-walk',
      },
      {
        title: 'The resolver checks its cache',
        description:
          'A busy ISP resolver serving millions of users has almost everything hot. This is the step that makes DNS fast, and also the step that makes your TTL a promise you cannot revoke.',
      },
      {
        title: 'Walk down from the root',
        description:
          'On a miss the resolver asks a root server who is responsible for .com, gets a referral to the TLD servers, asks them who is responsible for example.com, and gets a referral to your nameservers. Roots never know your address; they only know who to ask next.',
      },
      {
        title: 'The authoritative server answers',
        description:
          'Your nameserver returns the A record and a TTL. If you use geo or weighted routing, this is the moment the decision is made, based on the resolver address rather than the user address.',
      },
      {
        title: 'Everyone caches',
        description:
          'The resolver caches for the TTL, the OS caches, and the browser caches for its own fixed window. A record with a 300 second TTL can realistically be served for 10 minutes after you change it.',
      },
      {
        title: 'Only then does TCP start',
        description:
          'The client finally opens a connection to the returned address. Everything before this point happened before your load balancer saw a single packet.',
      },
    ],
    deepDives: [
      {
        title: 'TTL is a failover budget, not a config value',
        body:
          'The TTL you publish is the worst-case time a client will keep sending traffic to a dead address. A 300 second TTL means five minutes of errors after you pull a region, and in practice longer because some resolvers clamp low TTLs upward and browsers cache independently. The fix is to lower TTL to 30–60 seconds before a planned migration, wait one old TTL period so the short value propagates, then make the change. Lowering it during the outage does nothing, because the resolvers already hold the old value.',
      },
      {
        title: 'Why DNS is a bad load balancer',
        body:
          'DNS returns an answer to a resolver, not to a user. One corporate or ISP resolver may front a million people, so round-robin records distribute across resolvers rather than across users. It also has no feedback loop: DNS does not know a backend is returning 500s, and a client that cached an answer will keep using it until the TTL expires. Use DNS for coarse steering between regions, then use an anycast address and a real load balancer for per-request decisions.',
      },
      {
        title: 'Anycast changes the shape of the problem',
        body:
          'With anycast the same IP address is announced from dozens of sites, and BGP delivers each packet to the topologically nearest one. There is no TTL to wait out — withdrawing a route moves traffic in seconds — and a single A record serves the whole world. The cost is that routing can change mid-connection, which is fine for UDP DNS and short HTTP requests but hostile to long-lived TCP. This is exactly why CDNs and public resolvers run on anycast while ordinary application servers do not.',
      },
      {
        title: 'Cache poisoning and why the port is random',
        body:
          'A resolver accepts an answer that matches the query name, the transaction id, and the source port. If those are guessable, an attacker can race the real authoritative server and inject a forged address that is then cached for the whole TTL. Source port randomisation raised the entropy from 16 bits to about 32, which turned a practical attack into a difficult one. DNSSEC solves it properly by signing records so the resolver can verify the chain, at the cost of key management and larger responses.',
      },
      {
        title: 'The apex CNAME problem',
        body:
          'The DNS specification forbids a CNAME at the zone apex, because the apex must also hold NS and SOA records and a CNAME cannot coexist with them. This bites constantly, because managed load balancers and CDNs give you a hostname rather than a stable IP. Providers work around it with ALIAS or ANAME records, which resolve the target server-side and return a synthesised A record. It works well, but it is proprietary, so the workaround has to be redone if you change DNS provider.',
      },
      {
        title: 'Negative caching is also cached',
        body:
          'When a name does not exist, the NXDOMAIN response is cached too, governed by the minimum field in the zone SOA record rather than by a record TTL. Teams hit this when they create a new subdomain shortly after someone looked it up: the negative answer is stuck in resolvers for the SOA minimum, often an hour. Keep the SOA minimum low (300 seconds is common) if you create records dynamically.',
      },
    ],
    tradeoffs: [
      'Low TTL means fast failover and far more queries, which managed providers bill for.',
      'CNAME chains add a full extra resolution round trip on every cold lookup.',
      'Geo-routing uses resolver location, which is wrong for users of public resolvers.',
      'DNSSEC gives integrity but adds key management and larger UDP responses.',
    ],
    bottlenecks: [
      'A single DNS provider is a single point of failure for the entire domain.',
      'Long TTLs stretch every incident by the length of the TTL.',
      'Cold resolution adds 100–300ms to the very first request from a new client.',
      'Clients that cache forever and ignore TTL entirely, notably some JVM defaults.',
    ],
    scalingPath: [
      { scale: 'Prototype', focus: 'One managed zone, 300s TTL, single A record' },
      { scale: 'One region', focus: 'Health-checked failover records, low SOA minimum, monitoring on resolution time' },
      { scale: 'Global', focus: 'Two independent DNS providers, anycast entry, latency-based steering above regional load balancers' },
    ],
    interviewScript: [
      '"Before any of my boxes run, the client does a DNS lookup — that is 100 to 300 milliseconds cold, near zero warm."',
      '"I will keep TTL at 300 seconds normally and drop it to 60 before a planned migration."',
      '"DNS steers between regions; the per-request decision belongs to an L7 load balancer."',
      '"I will not rely on round-robin A records, because one resolver fronts many users."',
      '"For the apex I need an ALIAS record, since a CNAME is illegal there."',
      '"For failover I want health-checked records plus an anycast entry point, so we are not waiting on a TTL."',
    ],
    commonMistakes: [
      'Treating DNS round-robin as real load balancing.',
      'Lowering TTL during an incident and expecting it to help immediately.',
      'Putting a CNAME at the zone apex.',
      'Using a single DNS provider for a business-critical domain.',
      'Forgetting that negative answers are cached under the SOA minimum.',
      'Assuming every client honours TTL.',
    ],
    relatedTopics: ['http-rpc', 'cdn', 'load-balancer', 'service-discovery'],
    examples: [
      'Cloudflare and Route 53 run authoritative DNS on anycast so a zone has no single location',
      'The 2016 Dyn outage took down major sites whose only DNS provider was Dyn',
      'Kubernetes uses CoreDNS with SRV records as its in-cluster service registry',
    ],
    practicePrompt:
      'You must move api.example.com from one cloud region to another with under a minute of errors. Write the exact sequence of TTL and record changes, and say when each one takes effect.',
    followUps: [
      {
        question: 'Why does lowering TTL during an outage not help?',
        answer:
          'Resolvers already hold the old record with the old TTL. Your new low TTL is only seen when they re-query, which happens after the old TTL expires. Lowering TTL is a preparation step: drop it at least one old-TTL period before the change you plan to make.',
        category: 'Operations',
        difficulty: 'easy',
      },
      {
        question: 'A user reports the old IP hours after your change. What are the likely causes?',
        answer:
          'A resolver that clamps TTL to a minimum, a browser or JVM that caches indefinitely, a corporate resolver with its own policy, or a stale entry in the OS cache. This is why real failover uses anycast or a load balancer behind a stable address rather than changing the address itself.',
        category: 'Operations',
        difficulty: 'medium',
      },
      {
        question: 'When is geo-DNS wrong?',
        answer:
          'When the resolver is not near the user. A user in Ireland on 8.8.8.8 may be seen from an anycast Google node whose location differs from theirs, and VPN users are systematically mislocated. EDNS Client Subnet passes a truncated client address to improve this, at a real privacy cost.',
        category: 'Routing',
        difficulty: 'medium',
      },
      {
        question: 'How would you support DNS-based service discovery inside a cluster?',
        answer:
          'Give each service a stable name resolved by an in-cluster resolver such as CoreDNS, backed by the orchestrator so records follow pod lifecycle. Keep TTLs at a few seconds inside the cluster because the resolver is local and cheap, and use SRV records when callers need the port. For anything needing sub-second reaction, use a real registry with watches instead of polling DNS.',
        category: 'Discovery',
        difficulty: 'hard',
      },
      {
        question: 'What breaks if you set TTL to 0?',
        answer:
          'Query volume explodes, because every client resolution reaches your authoritative servers, and your DNS bill scales with users rather than with changes. Some resolvers ignore a zero TTL and substitute their own minimum anyway, so you pay the cost without reliably getting the benefit.',
        category: 'Operations',
        difficulty: 'easy',
      },
      {
        question: 'How does a CDN use DNS?',
        answer:
          'Your hostname is a CNAME to the CDN, whose authoritative servers answer with an address near the requesting resolver, usually an anycast address for a nearby point of presence. The CDN therefore controls the steering decision on every cold lookup, which is why a CDN can shift traffic away from a failing region much faster than you can.',
        category: 'Delivery',
        difficulty: 'medium',
      },
      {
        question: 'What is the difference between recursive and authoritative?',
        answer:
          'A recursive resolver does the work of walking the tree on behalf of a client and caches the results. An authoritative server holds the actual zone data for a domain and answers only for that zone. Root and TLD servers are authoritative but only for delegations — they return referrals, not addresses.',
        category: 'Fundamentals',
        difficulty: 'easy',
      },
      {
        question: 'Why do critical domains use two DNS providers?',
        answer:
          'Because DNS failure is total: if your zone cannot be resolved, nothing else in your architecture matters. Publishing NS records for two independent providers and keeping zones synchronised means one provider outage or DDoS does not remove the domain from the internet. The cost is having to apply every zone change twice, ideally through automation.',
        category: 'Reliability',
        difficulty: 'hard',
      },
      {
        question: 'Does DNS use UDP or TCP?',
        answer:
          'UDP on port 53 for ordinary queries, because one datagram each way is far cheaper than a handshake. Responses larger than the negotiated EDNS buffer set the truncated flag and the client retries over TCP, which happens with DNSSEC and large record sets. DNS over TLS and DNS over HTTPS put queries inside an encrypted TCP session for privacy.',
        category: 'Fundamentals',
        difficulty: 'medium',
      },
      {
        question: 'How do you verify a DNS change went out correctly?',
        answer:
          'Query your authoritative servers directly to confirm the record is correct at the source, then query several public resolvers to observe propagation, and watch the remaining TTL count down. Do not trust one local lookup — your own resolver may be the only one that has the new value.',
        category: 'Operations',
        difficulty: 'easy',
      },
    ],
  }),
};
