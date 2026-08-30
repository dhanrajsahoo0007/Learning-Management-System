import { ArchitectureTopic, emptyContent } from '../systemDesignTypes';

export const shardingTopic: ArchitectureTopic = {
  id: 'sharding',
  title: 'Sharding and Partitioning',
  description: 'Splitting one dataset across many machines: choosing a key, routing a request, and living with what you broke.',
  difficulty: 'Intermediate',
  progress: 0,
  icon: 'Grid3X3',
  color: 'bg-blue-800',
  section: 'fundamentals',
  track: 'classic',
  prerequisites: ['databases'],
  estimatedMinutes: 75,
  order: 5,
  content: emptyContent({
    overview:
      'Sharding is the only way to scale writes past one machine, and it is the most expensive architectural decision you will make. The shard key determines which queries stay cheap forever and which become impossible.',
    whyItExists:
      'Replication scales reads but every write still funnels through one leader. When the write rate or the dataset outgrows a single machine, the data itself has to be split.',
    problemStatement: {
      prompt:
        'Your bookings table is four terabytes and the primary is saturated on writes. Split it across machines, choose the key, and explain what happens to the queries and constraints that used to be free.',
      inScope: [
        'Range, hash, geographic, and directory partitioning',
        'Choosing a shard key from the access patterns',
        'Routing a request to the right shard',
        'Hotspots, resharding, and cross-shard queries',
      ],
      outOfScope: [
        'The consistent hashing ring itself (see that lesson)',
        'Replication within a shard (see the replication lesson)',
        'Distributed transaction protocols (see the transactions lesson)',
        'Geospatial cell indexing (see the geospatial lesson)',
      ],
    },
    assumptions: [
      'Each shard is itself replicated; a shard is a replica set, not a single machine',
      'Queries overwhelmingly filter by one entity, which is what makes a good key possible',
      'The application can be changed to carry the shard key on every request',
    ],
    whenToUse: [
      'Write throughput exceeds what one leader can absorb',
      'The dataset no longer fits on one machine or its maintenance windows became unmanageable',
      'Regulatory rules require data to physically live in a particular country',
    ],
    functionalRequirements: [
      { title: 'Route by key', detail: 'Given an entity id, find the shard without asking every shard.' },
      { title: 'Serve the common query on one shard', detail: 'The dominant access pattern must not fan out.' },
      { title: 'Rebalance', detail: 'Move partitions to new nodes without taking writes offline.' },
      { title: 'Handle the queries that do fan out', detail: 'Scatter-gather with a bounded result size, or a derived index.' },
    ],
    nonFunctionalRequirements: [
      { title: 'Even distribution', detail: 'No shard should carry more than about 1.5× the average load.' },
      { title: 'Elasticity', detail: 'Adding a node moves a bounded fraction of the data, not all of it.' },
      { title: 'Latency', detail: 'Single-shard reads stay flat; scatter-gather is bounded by the slowest shard.' },
      { title: 'Operability', detail: 'Backups, migrations, and failover now happen N times.' },
    ],
    estimates: [
      { label: 'When to shard', value: '> 1–2 TB or > 10k writes/s', note: 'Below that, replicas and caching are cheaper' },
      { label: 'Shard count', value: '2–4× current need', note: 'Over-provision logical shards so you split rarely' },
      { label: 'Rebalance cost', value: '~1/N of data moves', note: 'With consistent hashing; naive modulo moves nearly all' },
      { label: 'Scatter-gather latency', value: 'p99 of the slowest shard', note: '16 shards at p99 100ms gives a much worse combined p99' },
      { label: 'Hotspot threshold', value: '>1.5× mean load', note: 'The point at which a split or a cache is required' },
    ],
    concepts: [
      'Shard key and partition key',
      'Range vs hash vs geo vs directory partitioning',
      'Logical shards versus physical nodes',
      'Scatter-gather and fan-out queries',
      'Hotspots and celebrity keys',
      'Resharding and double writes',
      'Global secondary indexes',
      'Cross-shard uniqueness',
    ],
    comparisons: [
      {
        title: 'Partitioning strategies',
        headers: ['Strategy', 'How it works', 'Use when', 'Avoid when'],
        rows: [
          [
            'Range',
            'Contiguous key ranges per shard; a directory maps range to node',
            'Range scans are the dominant query, e.g. time windows',
            'The key is monotonic — all new writes land on the last shard',
          ],
          [
            'Hash',
            'hash(key) decides the shard, so keys are spread uniformly',
            'Point lookups by entity id and even write distribution',
            'You need ordered scans across keys',
          ],
          [
            'Geographic',
            'Shard by region or country, usually one stack per region',
            'Data residency rules and latency-sensitive local reads',
            'Users move between regions or traffic is very uneven',
          ],
          [
            'Directory (lookup table)',
            'An explicit map of entity to shard, consulted on every request',
            'You need to relocate individual tenants or isolate a large one',
            'The directory becomes a hot dependency — it must be cached',
          ],
          [
            'Consistent hashing',
            'Keys and nodes both hash onto a ring; a key belongs to the next node clockwise',
            'Nodes join and leave frequently, as in caches and Dynamo-style stores',
            'You want a simple, auditable, explicitly controlled placement',
          ],
        ],
      },
      {
        title: 'What a shard key costs you',
        headers: ['Query shape', 'Sharded by listing_id', 'Sharded by created_at'],
        rows: [
          ['Bookings for one listing', 'One shard, indexed range scan', 'Every shard, scatter-gather'],
          ['Bookings created today', 'Every shard', 'One shard — and it takes all the writes'],
          ['Write distribution', 'Even across listings', 'All writes hit the newest shard'],
          ['Unique email', 'Needs a global lookup either way', 'Needs a global lookup either way'],
        ],
        note: 'Time is almost always the wrong shard key, because "now" is a single point that every write targets.',
      },
    ],
    architecture:
      'A routing layer maps the shard key to a logical shard and the logical shard to a physical node. Each node holds many logical shards, so rebalancing means moving whole logical shards rather than re-hashing rows. Queries that carry the key touch one shard; queries that do not either scatter or use a derived global index.',
    diagrams: [
      { id: 'router', title: 'One hop or all hops', kind: 'excalidraw', src: 'shard-router' },
      {
        id: 'reshard',
        title: 'Splitting a hot shard',
        kind: 'mermaid',
        src: `sequenceDiagram
  participant App
  participant Router
  participant Old as Shard 2
  participant New as Shard 2b
  App->>Router: writes continue
  Router->>Old: normal traffic
  Router->>Old: begin split
  Old->>New: copy the upper half of the range
  Old->>New: stream the change log until caught up
  Router->>Router: flip the range map (atomic)
  Router->>New: traffic for the upper half
  Old->>Old: drop the moved rows`,
      },
    ],
    walkthrough: [
      {
        title: 'Confirm sharding is actually required',
        description:
          'Read replicas, a cache, better indexes, and archiving cold rows often buy another order of magnitude. Sharding is what you do when the write rate or the raw size makes one machine impossible, and you should be able to name the number that forced it.',
      },
      {
        title: 'Derive the key from the dominant query',
        description:
          'List the top three queries by volume. If ninety per cent of traffic is "bookings for listing X", the key is listing_id. The key is not a design preference; it is whichever value appears in the WHERE clause of the query you cannot afford to fan out.',
      },
      {
        title: 'Create many logical shards up front',
        description:
          'Map keys to 1,024 logical shards and place many logical shards on each physical node. Growing then means moving whole logical shards between nodes rather than re-hashing every row, and the mapping never has to change.',
      },
      {
        title: 'Route the request',
        description:
          'A routing layer — a proxy, a client library, or a coordinator — turns the key into a shard and opens a connection to it. The map is small, cached everywhere, and changed rarely, so a lookup adds microseconds.',
      },
      {
        title: 'Handle the queries that do not carry the key',
        description:
          '"All bookings by this guest" no longer maps to one shard. Either scatter-gather with a hard result limit, or maintain a global secondary index keyed by guest_id that points at the shard, updated asynchronously.',
      },
      {
        title: 'Watch for the hot shard',
        description:
          'One stadium listing during a final can take sixty per cent of the traffic. Detect it with per-shard metrics, then split the range, cache that key aggressively, or give it a dedicated shard.',
      },
    ],
    deepDives: [
      {
        title: 'Why monotonic keys destroy range sharding',
        body:
          'Sharding by created_at or by an auto-increment id puts every new row on the last shard, because "now" is a single point. The other fifteen shards sit idle holding history while one absorbs the entire write load, and adding nodes does not help because the new node also sits idle until the boundary moves. If you need time-ordered scans, use a composite key: hash a tenant or entity id to choose the shard and use time only as the clustering order within it. That way each shard has its own time-ordered range and writes spread across all of them.',
      },
      {
        title: 'Logical shards are the trick that makes resharding survivable',
        body:
          'If keys hash directly onto physical nodes, adding a node changes the modulus and almost every key moves. Instead, hash keys onto a large fixed number of logical shards — 1,024 is common — and keep a separate map from logical shard to physical node. Growing the cluster means reassigning some logical shards to a new node and copying only their data; the key-to-logical-shard function never changes. Vitess calls these keyspaces, Elasticsearch fixes the shard count at index creation for the same reason, and Cassandra achieves it with virtual nodes on the ring.',
      },
      {
        title: 'Cross-shard queries and the p99 trap',
        body:
          'A scatter-gather query is only as fast as the slowest shard it touches. If each shard responds at p99 in 100 milliseconds, querying sixteen shards means the chance that at least one is slow is high, so the combined p99 is far worse than 100 milliseconds — this is tail amplification. Mitigations are hedged requests to a replica after a delay, hard result limits so no shard returns unbounded rows, and pushing aggregation down so shards return counts rather than rows. The structural fix is a derived store — a search index or a rollup table — that answers the query from one place.',
      },
      {
        title: 'Global uniqueness after the split',
        body:
          'A unique index is enforced inside one database, so once users are spread across shards nothing stops the same email being inserted twice. The usual answer is a dedicated uniqueness service: a small table sharded by a hash of the email, written before the user row, holding email to user_id. It becomes a required dependency on the signup path, so it needs its own availability story. The alternative is to shard users by email hash, which makes uniqueness local but turns every lookup by user_id into a scatter — a good trade only if lookups by email dominate.',
      },
      {
        title: 'Resharding without downtime',
        body:
          'The safe sequence is: start double-writing to both the old and the new placement, backfill historical rows in batches while monitoring replication lag, verify by comparing row counts and checksums per range, flip reads to the new placement behind a flag, then stop double-writing and drop the old rows. Every step is individually reversible, which is the entire point — a resharding plan without a rollback at each stage is how teams end up in a multi-day incident. Expect the backfill to be the long part, measured in days for terabytes.',
      },
      {
        title: 'Celebrity keys break even a perfect key',
        body:
          'Hash sharding distributes keys evenly, but it distributes keys, not traffic. One account with fifty million followers, or one product on a flash sale, generates orders of magnitude more requests than the average key while living on exactly one shard. Fixes are key salting — splitting the logical entity into user:123#0 through user:123#9 and merging on read — a dedicated cache tier in front of that key, or moving the entity to its own isolated shard. Detection matters as much as the fix: you need per-key traffic sampling, because per-shard averages hide a single dominant key.',
      },
    ],
    tradeoffs: [
      'Hash sharding spreads writes evenly and gives up ordered scans.',
      'Range sharding keeps scans cheap and invites monotonic hotspots.',
      'More shards mean better parallelism and worse tail latency on fan-out queries.',
      'A directory gives precise placement control at the cost of a hot lookup dependency.',
    ],
    bottlenecks: [
      'A hot shard caused by a celebrity key or a monotonic key.',
      'Cross-shard joins and aggregations that scatter to every node.',
      'The routing layer or shard directory becoming a single point of failure.',
      'Backfills during resharding saturating disk and replication bandwidth.',
    ],
    scalingPath: [
      { scale: 'Prototype', focus: 'One database, correct indexes, no partitioning at all' },
      { scale: 'One region', focus: 'Table partitioning and archiving, replicas for reads, cache for hot keys' },
      { scale: 'Global', focus: 'Hash sharding into many logical shards, global secondary indexes, per-region placement' },
    ],
    interviewScript: [
      '"Ninety per cent of queries filter by listing_id, so that is the shard key."',
      '"I will hash into 1,024 logical shards so growing the cluster never changes the key function."',
      '"created_at is the wrong key — every write would land on the newest shard."',
      '"Queries by guest_id do not carry the key, so they need a global secondary index rather than a scatter."',
      '"Unique email needs a dedicated lookup table, because a unique index only holds within one shard."',
      '"For a stadium listing I would salt the key or give it a dedicated shard rather than let it dominate."',
    ],
    commonMistakes: [
      'Sharding before caching and read replicas have been exhausted.',
      'Choosing a monotonically increasing shard key.',
      'Assuming unique constraints still work across shards.',
      'Ignoring tail amplification on scatter-gather queries.',
      'Hashing directly onto physical nodes with no logical shard layer.',
      'Planning a reshard with no per-step rollback.',
    ],
    relatedTopics: ['databases', 'consistent-hashing', 'replication', 'geospatial', 'transactions', 'bookmyshow'],
    examples: [
      'Vitess shards MySQL for YouTube using keyspaces and a routing proxy',
      'Instagram shards Postgres by user id with thousands of logical shards per machine',
      'DynamoDB partitions by hash of the partition key and splits partitions automatically under load',
    ],
    practicePrompt:
      'Choose a shard key for a ticketing system where reads are "seats for one event" and writes spike on one event at a time. Explain what you do about the hot event.',
    followUps: [
      {
        question: 'How do you pick between range and hash sharding?',
        answer:
          'Ask whether ordered scans across keys matter. If your dominant query is "everything between these two values", range wins and you must ensure the key is not monotonic. If it is "get this entity", hash wins because it distributes writes evenly with no boundary tuning. Many systems use hash for placement and range ordering inside each shard.',
        category: 'Design',
        difficulty: 'medium',
      },
      {
        question: 'What is a global secondary index in a sharded system?',
        answer:
          'A separate structure keyed by the alternate attribute, partitioned by that attribute, mapping it to the primary key and shard. It turns a scatter-gather into two point lookups. It is updated asynchronously in most systems, so it is eventually consistent, and that staleness must be acceptable to the query using it.',
        category: 'Indexing',
        difficulty: 'hard',
      },
      {
        question: 'How do you detect a hot shard before users notice?',
        answer:
          'Per-shard dashboards of QPS, CPU, and p99 latency with an alert when any shard exceeds about 1.5× the fleet mean. Add per-key traffic sampling, because a shard average hides a single dominant key. Track the ratio between the busiest and the median shard as a single health number.',
        category: 'Operations',
        difficulty: 'medium',
      },
      {
        question: 'Can you change the shard key later?',
        answer:
          'Only by rewriting the whole dataset into a new placement, which is a migration of the same scale as the original sharding project. This is why the key decision deserves disproportionate care up front, and why teams over-provision logical shards — changing the node count is easy, changing the key is not.',
        category: 'Operations',
        difficulty: 'hard',
      },
      {
        question: 'How does a transaction work across shards?',
        answer:
          'It does not, cheaply. You either constrain the design so a transaction never spans shards — which is why co-locating related entities under the same key matters — or you use a saga with compensating actions, or a distributed SQL engine that runs consensus per range. Two-phase commit across shards is possible and rarely worth its blocking behaviour.',
        category: 'Consistency',
        difficulty: 'hard',
      },
      {
        question: 'What is the relationship between sharding and consistent hashing?',
        answer:
          'Consistent hashing is one placement function for sharding, chosen when membership changes often, because it moves only about 1/N of keys when a node joins. Range and directory partitioning are alternatives that give more explicit control. Sharding is the problem; consistent hashing is one solution to the placement part of it.',
        category: 'Theory',
        difficulty: 'medium',
      },
      {
        question: 'Should each shard be replicated?',
        answer:
          'Yes, always. A shard is a replica set, not a machine. Otherwise losing one node loses a slice of your data permanently, and the probability of losing at least one node grows with the number of shards. Sixteen unreplicated shards are sixteen times more likely to lose data than one.',
        category: 'Reliability',
        difficulty: 'easy',
      },
      {
        question: 'How many shards should you start with?',
        answer:
          'Enough logical shards that you will not need to change the count — 256 or 1,024 is typical — placed on as few physical nodes as your load requires. Splitting logical shards later is far more disruptive than moving them, so over-provision the logical count and under-provision the hardware.',
        category: 'Design',
        difficulty: 'medium',
      },
      {
        question: 'What is the difference between partitioning and sharding?',
        answer:
          'They mean the same thing conceptually. In practice "partitioning" often refers to splitting a table within one database instance — Postgres declarative partitioning — while "sharding" means splitting across separate machines. Local partitioning helps with maintenance and pruning; only sharding adds machines.',
        category: 'Terminology',
        difficulty: 'easy',
      },
      {
        question: 'How do you keep a tenant on a specific shard for compliance?',
        answer:
          'Use directory partitioning for those tenants: an explicit map that pins tenant to shard and region, consulted on every request and heavily cached. Hash placement cannot guarantee physical location, and data residency rules are about physical location, so the explicit map is the only defensible answer.',
        category: 'Compliance',
        difficulty: 'hard',
      },
    ],
  }),
};
