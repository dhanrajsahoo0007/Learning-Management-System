import { ArchitectureTopic, emptyContent } from '../systemDesignTypes';

export const databasesTopic: ArchitectureTopic = {
  id: 'databases',
  title: 'Databases and Storage Layers',
  description:
    'Every database family and how it actually stores data, plus block, file, and object storage — including what S3 is and is not.',
  difficulty: 'Intermediate',
  progress: 0,
  icon: 'Database',
  color: 'bg-emerald-600',
  section: 'fundamentals',
  track: 'classic',
  prerequisites: ['interview-approach'],
  estimatedMinutes: 100,
  order: 3,
  content: emptyContent({
    overview:
      'A database is not a brand name. It is a commitment to a set of access patterns, a consistency model, and a growth curve. Underneath every one of them sits a storage layer — a block volume, a shared filesystem, or an object store — and choosing the wrong layer is a more expensive mistake than choosing the wrong engine.',
    whyItExists:
      'Process memory dies, flat files cannot answer queries, and a single disk cannot hold or serve a social graph. Databases exist to make durability, concurrency, and querying somebody else problem.',
    problemStatement: {
      prompt:
        'You are storing user profiles, bookings, uploaded photos, a search index, and a year of analytics events. Decide where each one lives, justify it from the access pattern, and explain how the bytes are physically stored underneath.',
      inScope: [
        'Block, file, and object storage — how each works',
        'Every major database family and its internal structure',
        'Matching an access pattern to an engine',
        'Derived stores, CDC, and the outbox pattern',
      ],
      outOfScope: [
        'Replication topologies in depth (see the replication lesson)',
        'Partitioning strategies in depth (see the sharding lesson)',
        'Isolation levels and sagas (see the transactions lesson)',
        'Vector databases, which belong to the AI track',
      ],
    },
    assumptions: [
      'One source of truth; everything else can be rebuilt from it',
      'Reads outnumber writes by roughly 10:1 for the product surface',
      'The team can operate at most two or three distinct engines well',
    ],
    whenToUse: [
      'Any durable state: users, orders, messages, inventory',
      'When the interviewer asks "where does this live?"',
      'When one workload — search, analytics, time-series — is fighting the primary',
    ],
    functionalRequirements: [
      { title: 'Point lookups and range scans', detail: 'Get by primary key; list by user or time window.' },
      { title: 'Secondary access paths', detail: 'Filter by status, search by text, traverse relationships.' },
      { title: 'Durability', detail: 'An acknowledged write survives a process crash and a disk loss.' },
      { title: 'Large binary objects', detail: 'Photos and video belong in object storage, with a row pointing at the key.' },
    ],
    nonFunctionalRequirements: [
      { title: 'Consistency', detail: 'Read-your-writes, linearizable, or eventual — pick per workload, not globally.' },
      { title: 'Latency', detail: 'Single-digit millisecond point reads; range scans bounded by result size.' },
      { title: 'Growth', detail: 'Data volume and QPS in year one versus year five decide partitioning.' },
      { title: 'Operability', detail: 'Backups, restore drills, and schema migration without long locks.' },
    ],
    estimates: [
      { label: 'OLTP row size', value: '100 B – 4 KB', note: '1B rows ≈ 0.1–4 TB before indexes' },
      { label: 'Index overhead', value: '10–50% of table size', note: 'Several indexes can double storage' },
      { label: 'Single primary writes', value: '1k–10k simple writes/s', note: 'WAL fsync and payload size bound this' },
      { label: 'Point read from SSD', value: '~100 µs', note: 'Versus ~100 ns from RAM — a 1000× gap' },
      { label: 'S3 object durability', value: '99.999999999%', note: 'Eleven nines, via erasure coding across facilities' },
      { label: 'S3 first-byte latency', value: '20–100 ms', note: 'Far slower than a database read; never in a tight loop' },
    ],
    concepts: [
      'Block vs file vs object storage',
      'B-tree vs LSM-tree indexes',
      'Write-ahead log and MVCC',
      'OLTP vs OLAP, row vs column layout',
      'Source of truth vs derived store',
      'Change data capture and the outbox pattern',
      'Access-pattern-first modelling',
      'Erasure coding and storage classes',
    ],
    comparisons: [
      {
        title: 'Storage layers: where the bytes physically live',
        headers: ['Layer', 'How it works', 'Use when', 'Avoid when'],
        rows: [
          [
            'Block (EBS, local NVMe)',
            'A raw volume of fixed-size blocks attached to one machine; the filesystem and database impose all structure',
            'Database data files, anything needing random writes and low latency',
            'You need many machines writing the same data',
          ],
          [
            'File (NFS, EFS)',
            'A shared POSIX tree with directories, permissions, and file locks over the network',
            'Legacy apps expecting a filesystem, shared config, build artefacts',
            'High-throughput OLTP — network fsync and lock semantics wreck it',
          ],
          [
            'Object (S3, GCS, R2)',
            'Flat bucket of immutable key-to-blob mappings over HTTP; no partial writes, no directories',
            'Photos, video, backups, logs, data lake files',
            'You need to update part of an object, or query its contents transactionally',
          ],
        ],
        note: 'A database usually sits on block storage and hands large blobs to object storage. Those two facts explain most real architectures.',
      },
      {
        title: 'Database families and how each one operates',
        headers: ['Family', 'How it stores and finds data', 'Use when', 'Avoid when'],
        rows: [
          [
            'Relational OLTP (Postgres, MySQL)',
            'Row-oriented pages, B-tree indexes, write-ahead log, MVCC snapshots for readers',
            'Transactions across tables, joins, strong constraints',
            'Petabyte scans or millions of writes per second',
          ],
          [
            'Document (MongoDB)',
            'BSON documents in collections, B-tree indexes on paths; a document is fetched whole',
            'Aggregates read and written as one unit, evolving shapes',
            'You need multi-document invariants and rich joins',
          ],
          [
            'Key-value (Redis, DynamoDB, RocksDB)',
            'Hash or sorted partition of key to opaque value; single-key operations only',
            'Sessions, counters, caches, well-known access keys',
            'Ad-hoc queries or anything needing a scan',
          ],
          [
            'Wide-column (Cassandra, Bigtable, HBase)',
            'Partition key plus clustering columns, LSM-tree writes, compaction, hinted handoff',
            'Huge write volume with predictable partition access',
            'Aggregations, joins, or strong cross-partition consistency',
          ],
          [
            'Graph (Neo4j)',
            'Nodes with direct pointers to edges, so a hop is a pointer chase rather than a join',
            'Multi-hop traversal: shortest path, recommendations, fraud rings',
            'Simple one-hop relationships a foreign key already handles',
          ],
          [
            'Search (Elasticsearch, OpenSearch)',
            'Inverted index from token to posting list, plus scoring at query time',
            'Full-text relevance, faceting, fuzzy matching',
            'As a source of truth — it is a rebuildable index',
          ],
          [
            'Time-series (TimescaleDB, InfluxDB)',
            'Partitioned by time, heavy compression, automatic downsampling and retention',
            'Metrics, IoT, anything append-only and queried by time range',
            'Records that get updated after they are written',
          ],
          [
            'Columnar OLAP (ClickHouse, BigQuery, Redshift)',
            'Column-per-file layout with strong compression; reads touch only requested columns',
            'Aggregating billions of rows over few columns',
            'Point reads and row-level updates',
          ],
          [
            'Distributed SQL (Spanner, CockroachDB)',
            'Range-partitioned data with a consensus group per range; SQL on top',
            'Horizontal scale without giving up transactions',
            'Latency-critical single-region work — consensus costs round trips',
          ],
          [
            'Embedded (SQLite, RocksDB)',
            'A library writing local files; no server, no network hop',
            'Edge, mobile, single-node tools, service-local state',
            'Multiple machines needing shared write access',
          ],
        ],
      },
      {
        title: 'B-tree versus LSM-tree, the choice underneath everything',
        headers: ['Property', 'B-tree (Postgres, MySQL)', 'LSM-tree (Cassandra, RocksDB)'],
        rows: [
          ['Write path', 'Update the page in place, after a WAL append', 'Append to an in-memory table, flush sorted files later'],
          ['Write amplification', 'Lower per write, but random I/O', 'Higher over time due to compaction, but sequential'],
          ['Read path', 'One tree traversal, predictable', 'May check several sorted files; Bloom filters skip most'],
          ['Range scans', 'Excellent and ordered', 'Good within a partition, merged across files'],
          ['Best at', 'Mixed read/write with transactions', 'Very high sustained write throughput'],
        ],
      },
    ],
    architecture:
      'One transactional primary holds the truth on block storage. Large binaries go to an object store with only the key in the row. Search, analytics, and caches are derived stores fed by change data capture, and every one of them can be rebuilt by replaying from the primary.',
    diagrams: [
      { id: 'layers', title: 'Storage layers under one application', kind: 'excalidraw', src: 'storage-layers' },
      { id: 'families', title: 'Source of truth and derived stores', kind: 'excalidraw', src: 'db-families' },
      {
        id: 'er',
        title: 'A booking schema with its access paths',
        kind: 'mermaid',
        src: `erDiagram
  USERS ||--o{ BOOKINGS : places
  LISTINGS ||--o{ BOOKINGS : receives
  USERS ||--o{ PHOTOS : uploads
  LISTINGS ||--o{ PHOTOS : shows
  BOOKINGS ||--o| PAYMENTS : settles`,
      },
    ],
    dataModel: [
      {
        name: 'users',
        columns: [
          { name: 'id', type: 'bigint', notes: 'Snowflake or UUIDv7, time-sortable' },
          { name: 'email', type: 'citext', notes: 'Globally unique — the constraint that breaks under sharding' },
          { name: 'display_name', type: 'text' },
          { name: 'created_at', type: 'timestamptz' },
        ],
        primaryKey: ['id'],
        indexes: ['UNIQUE (email)'],
        notes: 'Read constantly, written rarely. The ideal cache-aside candidate.',
      },
      {
        name: 'bookings',
        columns: [
          { name: 'id', type: 'bigint' },
          { name: 'listing_id', type: 'bigint', notes: 'Shard key: every query filters on it' },
          { name: 'guest_id', type: 'bigint' },
          { name: 'starts_on', type: 'date' },
          { name: 'ends_on', type: 'date' },
          { name: 'status', type: 'text', notes: 'pending, confirmed, cancelled' },
        ],
        primaryKey: ['id'],
        indexes: ['(listing_id, starts_on)', 'partial (guest_id) WHERE status = \'confirmed\''],
        notes: 'Range queries by listing and date drive the composite index and the shard key alike.',
      },
      {
        name: 'photos',
        columns: [
          { name: 'id', type: 'bigint' },
          { name: 'listing_id', type: 'bigint' },
          { name: 'object_key', type: 'text', notes: 'S3 key — the bytes are never in the database' },
          { name: 'bytes', type: 'bigint' },
          { name: 'checksum', type: 'text', notes: 'Detects a truncated upload' },
        ],
        primaryKey: ['id'],
        indexes: ['(listing_id)'],
        notes: 'The classic split: metadata in Postgres, bytes in object storage, delivery through a CDN.',
      },
    ],
    walkthrough: [
      {
        title: 'Write down the access patterns first',
        description:
          '"Get booking by id", "list bookings for a listing in a date range", "search listings by text", "sum revenue by month". Four patterns, and they already imply four different storage decisions. The engine falls out of this list; it never precedes it.',
      },
      {
        title: 'Choose one source of truth',
        description:
          'Bookings need two rows to change atomically, so a relational primary wins. Say it explicitly: Postgres until write volume or data size forces a change, and name the number that would force it.',
      },
      {
        title: 'Put the bytes somewhere else',
        description:
          'Photos go to an object store. The row keeps the key, the size, and a checksum. This keeps rows small, backups fast, and lets a CDN serve the bytes without touching your database.',
      },
      {
        title: 'Derive the other access paths',
        description:
          'Full-text search goes to an inverted index, monthly revenue to a columnar store. Both are fed by change data capture, both are disposable, and neither is ever the source of truth.',
      },
      {
        title: 'Make the event and the row atomic',
        description:
          'Writing a row and publishing an event are two systems, so a crash between them loses the event. The outbox pattern writes both in one local transaction and lets a relay publish from the outbox table.',
      },
      {
        title: 'Only now consider partitioning',
        description:
          'Caches and replicas come before sharding, because sharding costs you cross-partition queries and global uniqueness. Partition when one machine can no longer hold the data or absorb the writes — not before.',
      },
    ],
    deepDives: [
      {
        title: 'What object storage really is',
        body:
          'S3 is a flat namespace of immutable objects behind an HTTP API, split internally into a metadata service that maps keys to locations and a data plane that stores the bytes erasure-coded across facilities. There are no directories — a prefix is just a string convention — and there is no partial update, so changing one byte means rewriting the object. You get read-after-write consistency for new objects, versioning, lifecycle rules that move cold data to cheaper classes, and presigned URLs that let a client upload directly without the bytes touching your servers. What you do not get is transactions, joins, or a query planner, which is exactly why it complements a database instead of replacing one.',
      },
      {
        title: 'Why databases avoid network filesystems',
        body:
          'A database assumes that fsync means durable and that file locks are honoured precisely, because crash recovery depends on knowing which writes reached disk. Network filesystems add latency to every fsync, and their locking has historically been the source of subtle corruption during network partitions — two nodes each believing they hold the lock will happily destroy a data file. Block storage attached to one machine keeps the semantics simple and the latency low. When a database does use shared storage, as Aurora does, it is a purpose-built log-structured service, not general-purpose NFS.',
      },
      {
        title: 'MVCC: how readers avoid blocking writers',
        body:
          'Under multi-version concurrency control, an update writes a new version of the row rather than overwriting it, tagged with the transaction that created it. Each transaction sees a snapshot: the versions committed before it started. Readers therefore never block writers and writers never block readers, which is why Postgres handles mixed workloads gracefully. The cost is garbage: dead versions accumulate and must be cleaned up by vacuum. A long-running analytics query holds an old snapshot open, which prevents cleanup and causes table bloat — the single most common Postgres production surprise.',
      },
      {
        title: 'The unique email problem after partitioning',
        body:
          'A unique index is enforced within one database. Split users across sixteen shards by user_id and nothing prevents the same email from being inserted on two shards at once. There are three workable answers. Keep a small dedicated lookup service or table, sharded by a hash of the email, that owns uniqueness and is written first. Or shard users by email hash instead, which makes uniqueness local but every lookup by user_id a scatter. Or accept a two-phase reservation: claim the email, then create the user, with a cleanup job for abandoned claims. Interviewers ask this because it exposes whether you understand that constraints are per-partition.',
      },
      {
        title: 'Change data capture beats dual writes',
        body:
          'The tempting design is to write to Postgres and then to Elasticsearch. It fails the moment the second write errors or the process dies between them, and it fails silently, so the index drifts for months. CDC instead reads the database write-ahead log — the same log replication uses — and streams committed changes in order. Nothing is lost because nothing depends on the application staying alive, ordering is preserved, and the consumer can be replayed from any point to rebuild the index from scratch. The trade-off is an extra moving part and eventual rather than immediate freshness.',
      },
      {
        title: 'When a specialised engine is worth the operational cost',
        body:
          'Every additional engine costs backups, monitoring, upgrade cycles, and on-call knowledge. The bar should be a workload that actively degrades the primary or that the primary genuinely cannot serve. Full-text search over millions of documents qualifies, because LIKE queries cannot use a B-tree and relevance scoring is not something SQL does well. A year of analytics scans qualifies, because they evict the OLTP working set from the buffer pool. A leaderboard does not: a sorted set in the cache you already run is enough. The strongest interview answer names the workload, the symptom, and only then the engine.',
      },
      {
        title: 'Storage classes and lifecycle as a cost lever',
        body:
          'Object stores price hot, infrequent-access, and archival tiers very differently, and the gap is roughly an order of magnitude between hot and archive. Lifecycle rules move objects automatically — original uploads to infrequent access after thirty days, to archive after a year — while keeping the key stable so application code never changes. The trap is retrieval: archival tiers charge per request and may take minutes to hours to restore, so an object that is read even occasionally can cost more in archive than it saved. Tier by access pattern, and always keep the derived thumbnails hot even when the originals are cold.',
      },
    ],
    tradeoffs: [
      'One engine is operationally cheap but eventually fights itself across workloads.',
      'Derived stores add freshness lag in exchange for query shapes the primary cannot serve.',
      'Normalised schemas keep writes correct; denormalised ones make reads fast.',
      'Object storage is cheap and durable but has 20–100ms latency and no transactions.',
      'LSM engines absorb writes beautifully and pay for it in compaction and read amplification.',
    ],
    bottlenecks: [
      'A hot row such as a global counter, serialising every write.',
      'Long analytics queries holding MVCC snapshots and bloating tables.',
      'Storing blobs in the database, inflating backups and buffer pool pressure.',
      'Missing composite indexes turning list queries into sequential scans.',
      'Cross-partition queries that scatter to every shard and gather.',
    ],
    scalingPath: [
      { scale: 'Prototype', focus: 'One Postgres, correct indexes, object storage for blobs' },
      { scale: 'One region', focus: 'Read replicas, cache-aside on hot keys, CDC into a search index' },
      { scale: 'Global', focus: 'Partition the largest table, move analytics to columnar, per-region replicas' },
    ],
    interviewScript: [
      '"Let me list the access patterns first, because they choose the engine."',
      '"Bookings need two rows to change atomically, so Postgres is the source of truth."',
      '"Photos go to S3; the row holds the key, the size, and a checksum."',
      '"Search is a derived index fed by CDC. If it burns down we rebuild it from the primary."',
      '"I am not sharding yet. At 40 writes per second one primary is nowhere near its limit."',
      '"If we do shard by listing_id, global email uniqueness needs a dedicated lookup table."',
      '"Analytics moves to a columnar store so month-long scans stop evicting the OLTP working set."',
    ],
    commonMistakes: [
      'Naming a database before naming the access pattern.',
      'Sharding on day one.',
      'Treating Elasticsearch as the source of truth.',
      'Storing image bytes in a table column.',
      'Dual-writing to the database and the index instead of using CDC.',
      'Forgetting that unique constraints do not survive partitioning.',
      'Assuming an object store can replace a database because both "store data".',
    ],
    relatedTopics: ['replication', 'sharding', 'transactions', 'storage-media', 'caching', 'bookmyshow', 'paytm'],
    examples: [
      'Instagram keeps photo bytes in object storage and metadata in sharded Postgres',
      'Discord moved messages from MongoDB to Cassandra for write throughput, then to ScyllaDB',
      'Airbnb keeps bookings relational for transactional integrity and derives search into a separate index',
    ],
    practicePrompt:
      'Choose the shard key for "list all bookings for one listing in a date range" and explain precisely why created_at is the wrong choice.',
    followUps: [
      {
        question: 'Why not use S3 as a database?',
        answer:
          'No transactions, no secondary indexes, no query planner, and 20–100ms latency per request. Listing objects by prefix is not a query — filtering a million keys means fetching a million keys. It is superb at storing immutable blobs durably and cheaply, which is a different job from serving indexed reads.',
        category: 'Storage',
        difficulty: 'easy',
      },
      {
        question: 'What is PACELC and why is it more useful than CAP?',
        answer:
          'CAP only describes behaviour during a partition. PACELC adds the normal case: if Partitioned, choose Availability or Consistency; Else, choose Latency or Consistency. That is the trade-off you actually make every day. DynamoDB is PA/EL — available and low latency. Spanner is PC/EC — it pays consensus latency to stay consistent.',
        category: 'Theory',
        difficulty: 'hard',
      },
      {
        question: 'When does a secondary index stop helping?',
        answer:
          'When its selectivity is poor. An index on a boolean matching half the table costs more than a scan, because the planner does random page fetches for each match. Indexes also slow every write and consume storage. Composite indexes must match the query prefix order, and a partial index on the rows you actually query is often the better answer.',
        category: 'Indexing',
        difficulty: 'medium',
      },
      {
        question: 'How do you run a schema migration on a large table without downtime?',
        answer:
          'Expand, migrate, contract. Add the new nullable column, deploy code that writes both, backfill in small batches with pauses to avoid replication lag, deploy code that reads the new column, then drop the old one in a later release. Never add a NOT NULL column with a default on a large table in one statement on an engine that rewrites the table.',
        category: 'Operations',
        difficulty: 'hard',
      },
      {
        question: 'Why is a global counter a hot row?',
        answer:
          'Every increment takes a lock on the same row, so throughput collapses to one write at a time regardless of hardware. The fixes are sharded counters that spread increments across N rows and sum on read, an approximate counter in the cache flushed periodically, or a probabilistic sketch when exactness is not required.',
        category: 'Contention',
        difficulty: 'medium',
      },
      {
        question: 'Block, file, or object for database backups?',
        answer:
          'Object storage. Backups are large, immutable, written once and read rarely, and need durability across facilities — precisely the object store profile. Lifecycle rules move them to archival tiers automatically. Block storage is expensive for this and tied to one availability zone.',
        category: 'Storage',
        difficulty: 'easy',
      },
      {
        question: 'When is a document store genuinely better than relational?',
        answer:
          'When the aggregate is always read and written whole and there are no invariants across documents. A product catalogue entry with nested variants is a good fit. The moment you need "these two documents must change together" or heavy joins across collections, you are rebuilding a relational engine badly.',
        category: 'Modelling',
        difficulty: 'medium',
      },
      {
        question: 'Why does Cassandra make you design the table per query?',
        answer:
          'Because there is no join and no query planner worth the name. Data is physically laid out by partition key and clustering columns, so a query that does not match that layout requires a full cluster scan. The idiom is one table per access pattern with data duplicated across them, and writes are cheap enough on an LSM engine that duplication is acceptable.',
        category: 'Modelling',
        difficulty: 'hard',
      },
      {
        question: 'How large can one Postgres instance get before you must shard?',
        answer:
          'Further than most people expect: several terabytes and tens of thousands of transactions per second on modern hardware, especially with partitioned tables and read replicas. The usual forcing functions are write throughput on one hot table, maintenance windows becoming unmanageable, or a working set that no longer fits in memory — not raw size alone.',
        category: 'Scaling',
        difficulty: 'medium',
      },
      {
        question: 'What breaks first when you put images in the database?',
        answer:
          'Backups and restores, which grow from minutes to hours. Then the buffer pool, because blob pages evict the index pages you actually need. Then replication, since every byte crosses the replication stream. Then your CDN story, because you now serve bytes through the application tier.',
        category: 'Storage',
        difficulty: 'easy',
      },
      {
        question: 'Do you need a separate time-series database for metrics?',
        answer:
          'Only at volume. A partitioned Postgres table with a retention policy handles moderate metric loads. A purpose-built engine earns its place when you need high-cardinality ingestion, automatic downsampling, and compression across billions of points — at which point the compression ratio alone often justifies it.',
        category: 'Modelling',
        difficulty: 'medium',
      },
    ],
  }),
};
