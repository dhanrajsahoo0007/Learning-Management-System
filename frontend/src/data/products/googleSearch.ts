import { ArchitectureTopic, emptyContent } from '../systemDesignTypes';

const QUERY_SEQUENCE = `sequenceDiagram
  participant User
  participant FE
  participant Cache
  participant Root
  participant Leaf
  User->>FE: GET q
  FE->>Cache: exact query
  alt miss
    FE->>Root: fan-out
    Root->>Leaf: posting lists
    Leaf-->>Root: top docs
    Root-->>FE: ranked IDs
  end
  FE->>FE: hydrate snippets
  FE-->>User: SERP`;

const CRAWL_FLOW = `flowchart LR
  Frontier --> Fetcher
  Fetcher --> Store[Raw docs]
  Store --> Indexer
  Indexer --> Shards[(Inverted shards)]
  Indexer --> Docstore[(Doc store)]`;

const ER_DIAGRAM = `erDiagram
  URLS ||--|| DOCS : fetches
  DOCS ||--o{ POSTINGS : indexed_as
  QUERIES ||--o{ CLICKS : produces`;

export const googleSearchTopic: ArchitectureTopic = {
  id: 'google-search',
  title: 'Google Search',
  description: 'Crawl frontier, inverted index, query fan-out, ranking, and a results page that is not a database LIKE.',
  difficulty: 'Advanced',
  progress: 0,
  icon: 'Search',
  color: 'bg-blue-600',
  section: 'products',
  track: 'classic',
  prerequisites: ['search-feeds', 'caching', 'databases', 'reliability'],
  estimatedMinutes: 75,
  order: 35,
  content: emptyContent({
    overview:
      'Web search is two systems: an offline crawl/index pipeline and an online query path that fans out to inverted-index shards. The SERP hydrates a handful of docs. SQL LIKE is not in the design.',
    whyItExists:
      'The web is too big to scan. Users type a few words and need a ranked page in about a second.',
    whenToUse: ['Search engine interviews', 'Inverted index deep dive', 'Contrast with Gmail or catalog search'],
    problemStatement: {
      prompt:
        'Design a web search engine like Google. The system crawls the public web, builds an index, and serves ranked results with snippets for a query in about a second.',
      inScope: [
        'URL frontier and politeness',
        'Fetch, store, parse',
        'Inverted index and doc store',
        'Query serving: cache, fan-out, rank, snippet',
        'Freshness for news-ish URLs',
        'Spell-correct / suggest as a teaser',
      ],
      outOfScope: [
        'Ads auction',
        'Knowledge graph internals',
        'Full spam/quality ML training',
        'Images / video / maps verticals',
      ],
    },
    assumptions: [
      'Tens of billions of docs. A query cannot touch more than a sliver.',
      'Query QPS is huge and extremely cacheable (head queries).',
      'Index build is continuous, not a nightly batch only.',
      'Users tolerate a slightly stale page; they do not tolerate a 10s SERP.',
    ],
    functionalRequirements: [
      { title: 'Crawl', detail: 'Discover URLs, fetch politely, handle robots.txt.' },
      { title: 'Index', detail: 'Tokenize, postings, doc store with titles and snippets.' },
      { title: 'Query', detail: 'AND/OR of terms, top-K docs, snippets with highlights.' },
      { title: 'Rank', detail: 'Static quality plus query-dependent score. Say BM25 + PageRank-ish as v1.' },
      { title: 'Suggest', detail: 'Prefix suggestions from a query log.' },
      { title: 'Freshness', detail: 'Recrawl important URLs more often.' },
    ],
    nonFunctionalRequirements: [
      { title: 'SERP p99', detail: 'Well under a second including snippet hydrate.' },
      { title: 'Availability', detail: 'Query path 99.99%. Crawler can lag.' },
      { title: 'Freshness', detail: 'News in minutes to hours; the long tail can be days.' },
      { title: 'Politeness', detail: 'Per-host rate limits. Do not DDoS the web.' },
      { title: 'Spam', detail: 'Low-quality docs must not dominate head queries.' },
    ],
    estimates: [
      { label: 'Docs', value: 'O(10^10)+', note: 'Shard the index. One machine cannot hold postings.' },
      { label: 'Query QPS', value: 'O(10^5)+', note: 'Result cache on the exact query string hits hard.' },
      { label: 'Head vs tail', value: 'Head is cache', note: 'Tail pays the shard fan-out.' },
      { label: 'Index size', value: 'Many PB', note: 'Postings are the bulk; doc store is smaller but hot.' },
    ],
    concepts: ['Frontier', 'Inverted index', 'Root-leaf fan-out', 'BM25 + static rank', 'Query cache'],
    walkthrough: [
      {
        title: 'Crawl and index',
        description:
          'Frontier pops a URL, fetcher respects robots and host caps, raw bytes go to a doc store, indexer updates postings and a forward index for snippets.',
        diagram: CRAWL_FLOW,
      },
      {
        title: 'Query',
        description:
          'Check an exact-query cache. On miss, a root fans out to term shards, intersects/unions postings, scores a candidate set, returns top IDs. Frontend hydrates titles and snippets.',
        diagram: QUERY_SEQUENCE,
      },
      {
        title: 'Head query',
        description:
          '“youtube” is served from cache. Clicks can refresh rank offline. Do not hit every leaf on every head query.',
      },
    ],
    apis: [
      {
        method: 'GET',
        path: '/search',
        description: 'Public SERP. Keep it cacheable.',
        request: `{\n  "q": "system design interview",\n  "page": 0\n}`,
        response: `{\n  "results": [\n    { "url": "https://example.com", "title": "…", "snippet": "…" }\n  ],\n  "ts": 180\n}`,
      },
      {
        method: 'GET',
        path: '/suggest',
        description: 'Prefix suggestions from a compact query-log index.',
        request: `{\n  "q": "system des"\n}`,
        response: `{\n  "suggestions": ["system design", "system design interview"]\n}`,
      },
    ],
    dataModel: [
      {
        name: 'urls',
        primaryKey: ['url_hash'],
        columns: [
          { name: 'url_hash', type: 'bytes' },
          { name: 'url', type: 'text' },
          { name: 'host', type: 'text' },
          { name: 'priority', type: 'float' },
          { name: 'next_fetch', type: 'timestamptz' },
        ],
        indexes: ['(host, next_fetch)'],
        notes: 'Frontier. Priority from links + freshness + errors.',
      },
      {
        name: 'docs',
        primaryKey: ['doc_id'],
        columns: [
          { name: 'doc_id', type: 'uint64' },
          { name: 'url', type: 'text' },
          { name: 'title', type: 'text' },
          { name: 'body_ref', type: 'text' },
          { name: 'static_rank', type: 'float' },
          { name: 'fetched_at', type: 'timestamptz' },
        ],
      },
      {
        name: 'postings',
        primaryKey: ['term', 'doc_id'],
        columns: [
          { name: 'term', type: 'text' },
          { name: 'doc_id', type: 'uint64' },
          { name: 'tf', type: 'int' },
          { name: 'positions', type: 'int[]', notes: 'Phrase / snippet' },
        ],
        notes: 'Stored inverted, sharded by term (or by doc with a scatter-gather).',
      },
    ],
    architecture:
      'Crawler fleet + frontier + raw store. Indexer builds inverted shards and a doc store. Online: edge cache, query root, leaf shards, snippet hydrate, spell/suggest sidecar. Ranking features can be added without changing the serving shape.',
    diagram: `flowchart TB
    Browser --> Edge
    Edge --> QueryCache
    QueryCache --> Root
    Root --> Leaf1[(Shard A)]
    Root --> Leaf2[(Shard B)]
    Root --> Docstore
    Frontier --> Fetcher --> Indexer
    Indexer --> Leaf1
    Indexer --> Leaf2`,
    diagrams: [{ id: 'er', title: 'Entity relationships', kind: 'mermaid', src: ER_DIAGRAM }],
    deepDives: [
      {
        title: 'Inverted index',
        body: 'term → sorted list of doc IDs plus frequencies. AND is an intersection of sorted lists. Phrase queries need positions. This is why LIKE %query% is not a search engine.',
      },
      {
        title: 'Sharding',
        body: 'Term-sharded: each leaf holds some terms, the root intersects. Doc-sharded: each leaf scores a slice of the web, the root merges top-K. Doc-sharded is the usual web-search answer because every query hits a predictable fan-out and you can add machines by splitting docs.',
      },
      {
        title: 'Frontier politeness',
        body: 'Per-host queues and crawl-delay. A single hot host cannot starve the frontier, and you cannot stampede a small site. robots.txt is a fetch, not a suggestion.',
      },
      {
        title: 'Result cache',
        body: 'Exact normalized query → SERP. Head queries never hit leaves. Invalidate on a timer, not on every index update. Freshness for news uses a small real-time overlay, not a flush of the whole cache.',
      },
    ],
    tradeoffs: [
      'Doc-sharded vs term-sharded indexes.',
      'Fresher index vs serving stability.',
      'Heavier rankers vs p99.',
    ],
    bottlenecks: ['Tail queries that hit huge postings', 'Frontier skew to a few hosts', 'Snippet hydrate of the doc store', 'Spam floods'],
    scalingPath: [
      { scale: 'v1', focus: 'One box, one inverted index, crawl a seed list.' },
      { scale: 'v2', focus: 'Shard docs, query cache, separate crawler.' },
      { scale: 'web', focus: 'Continuous index, static rank, real-time overlay, suggest, spam.' },
    ],
    interviewScript: [
      '“Offline crawl/index, online fan-out to shards. I will not LIKE the web.”',
      '“Head queries die in a result cache. Tail queries pay the leaves.”',
      '“v1 rank is BM25 plus a static quality score. ML is a follow-up.”',
    ],
    commonMistakes: [
      'SQL full-table scan',
      'No politeness on the crawler',
      'No query cache',
      'Building ads in the first 20 minutes',
    ],
    relatedTopics: ['search-feeds', 'gmail', 'caching', 'recommendation-system'],
    examples: ['Google', 'Bing'],
    practicePrompt: '“taylor swift” is both a head query and a freshness problem the night of a release. How do cache and overlay coexist?',
    followUps: [
      {
        question: 'Doc-sharded or term-sharded — which do you pick and why?',
        category: 'scale',
        difficulty: 'medium',
        answer:
          'Doc-sharded for web search: every query fans out to all leaves (or a large subset) with bounded work per leaf, easy to add capacity, and AND/OR happen locally. Term-sharded can make rare terms cheap but intersections become a distributed join.',
      },
      {
        question: 'How do you keep a crawler from becoming a botnet?',
        category: 'geo',
        difficulty: 'easy',
        answer:
          'Per-host rate limits, shared politeness tokens, robots.txt, backoff on errors, and a cap on concurrent fetches per IP. This is correctness, not an optimization.',
      },
      {
        question: 'Where does PageRank sit in a 2026 interview?',
        category: 'ranking',
        difficulty: 'medium',
        answer:
          'As a static quality feature computed offline from the link graph, combined with BM25 and many other signals. Do not claim you will compute PageRank at query time.',
      },
      {
        question: 'Spell correction — online or offline?',
        category: 'ranking',
        difficulty: 'medium',
        answer:
          'A compact model or dictionary from query logs, consulted before fan-out. You may issue a second query. Do not edit-distance the whole index.',
      },
      {
        question: 'How do you update one viral news URL without rebuilding the web?',
        category: 'scale',
        difficulty: 'hard',
        answer:
          'A real-time index overlay for hot docs. The root merges overlay hits with the batch index. The main shards roll forward in generations. Cache keys for those queries get a short TTL.',
      },
      {
        question: 'Why is this not Gmail search?',
        category: 'ranking',
        difficulty: 'easy',
        answer:
          'Gmail is a per-user corpus with ACL. Web search is a global corpus with ranking and spam. Different sharding, different freshness, different failure modes.',
      },
    ],
  }),
};
