import { ArchitectureTopic, emptyContent } from '../systemDesignTypes';

export const uniqueIdsTopic: ArchitectureTopic = {
  id: 'unique-ids',
  title: 'Unique ID Generation',
  description:
    'Sequences, UUIDs, ULIDs, and Snowflake bit by bit — why time-sortable keys are kind to a B-tree and why you never move the clock backwards.',
  difficulty: 'Intermediate',
  progress: 0,
  icon: 'Hash',
  color: 'bg-teal-600',
  section: 'fundamentals',
  track: 'classic',
  prerequisites: ['databases'],
  estimatedMinutes: 65,
  order: 15,
  content: emptyContent({
    overview:
      'Every row, message, and upload needs a name that no other row will ever take. On one database that is a sequence and the problem is solved in one line. Across sixteen shards, three regions, and a mobile client that must name a photo before it has network, the identifier becomes a small distributed systems problem with three real constraints: uniqueness without coordination, sortability that matches how the storage engine wants writes to arrive, and not leaking how many customers you have.',
    whyItExists:
      'A single counter is only unique if a single machine owns it, and that machine is a write bottleneck and a single point of failure. Identifier schemes exist to buy uniqueness without asking anyone for permission on the hot path.',
    problemStatement: {
      prompt:
        'You are sharding a photo service across sixteen databases in two regions and the mobile client wants to name an upload while offline so it can retry safely. Design the identifier: decide who generates it, how it stays unique with no central allocator, whether it sorts by time, and what the public URL exposes. State the exact bit layout and the failure behaviour when a clock jumps.',
      inScope: [
        'Sequences, UUIDv4, UUIDv7, ULID, Snowflake, and block allocators',
        'The Snowflake 64-bit layout and what each field buys',
        'Clock skew, sequence overflow, and worker-id allocation',
        'Index locality, short codes, and information leakage',
      ],
      outOfScope: [
        'Consistent hashing and the hash ring, which the consistent hashing lesson owns',
        'Choosing a shard key, which the sharding lesson owns',
        'Cryptographic token design such as session tokens and JWTs',
        'Content-addressed hashing for deduplication',
      ],
    },
    assumptions: [
      'Peak identifier demand is around 200,000 per second across the fleet, with bursts to 500,000',
      'Hosts run NTP, so clocks are usually within a few milliseconds but occasionally step',
      'The primary key is stored in a B-tree engine such as Postgres or InnoDB, not an append-only log',
    ],
    whenToUse: [
      'Sharded writes, where no single database can own a sequence',
      'Client-generated identifiers, so an offline retry is idempotent rather than duplicated',
      'Any table where the primary key is also the natural insertion order, such as messages or events',
    ],
    functionalRequirements: [
      { title: 'Global uniqueness', detail: 'No two identifiers collide across 1,024 generators, restarts, and regions.' },
      { title: 'Generation without coordination', detail: 'A host produces an identifier locally with no network call on the hot path.' },
      { title: 'Rough time ordering', detail: 'Identifiers sort close to creation order so range scans and index appends stay cheap.' },
      { title: 'A separate public form', detail: 'A short opaque code for URLs that does not expose the internal counter.' },
    ],
    nonFunctionalRequirements: [
      { title: 'Latency', detail: 'Under 10 microseconds per identifier, which rules out a synchronous round trip per row.' },
      { title: 'Throughput', detail: '4,096 per millisecond per worker, so 200,000 per second needs only a handful of workers.' },
      { title: 'Compactness', detail: '64 bits fits a bigint; 128 bits doubles every index entry that carries the key.' },
      { title: 'Availability', detail: 'Identifier generation must survive the loss of the coordination service that hands out worker ids.' },
    ],
    estimates: [
      { label: 'Snowflake sequence ceiling', value: '4,096 ids per worker per millisecond', note: '4.1M per second per worker; 1,024 workers gives about 4.2 billion per second' },
      { label: '41-bit millisecond clock', value: '2^41 ms ≈ 69.7 years', note: 'With a 2020 custom epoch the field exhausts in 2089, not 1970 plus 69' },
      { label: 'UUIDv4 collision risk', value: '122 random bits', note: 'About 2.7 × 10^18 ids for a 50% chance; at 10^9 ids the risk is under 1 in 10^15' },
      { label: 'Base62 seven-character code', value: '62^7 ≈ 3.52 × 10^12', note: 'With 10^9 codes already issued, a fresh random code collides about 1 time in 3,500' },
      { label: 'Block allocator coordination', value: '1 round trip per 10,000 ids', note: 'At 5,000 ids/s per host that is one call every 2 seconds instead of 5,000' },
    ],
    concepts: [
      'Database sequence and auto-increment',
      'UUIDv4 vs UUIDv7 vs ULID',
      'Snowflake layout: 1 + 41 + 10 + 12 bits',
      'Time-sortable keys and B-tree locality',
      'Worker-id allocation and leases',
      'Clock skew and NTP step-back',
      'Base62 short codes and the birthday bound',
      'Enumerable ids as information leakage',
    ],
    comparisons: [
      {
        title: 'Identifier schemes and what each one costs',
        headers: ['Type', 'How it works', 'Use when', 'Avoid when'],
        rows: [
          [
            'Sequence / auto-increment',
            'The database holds a counter and hands out the next value inside the insert, so uniqueness is enforced by one owner',
            'Single primary, small scale, and you want the smallest possible key',
            'Writes are sharded, or the client must name the row before it reaches the database',
          ],
          [
            'UUIDv4',
            '122 bits from a cryptographic random source, formatted as 36 characters; uniqueness is probabilistic, not coordinated',
            'You need an identifier anywhere with zero setup and no ordering requirement',
            'It is the primary key of a large B-tree table, because random inserts destroy index locality',
          ],
          [
            'UUIDv7',
            '48-bit Unix millisecond timestamp in the high bits, version and variant bits, then 74 bits of randomness, so it sorts by time',
            'You want the drop-in familiarity of a UUID plus append-friendly insert order',
            'You need 64 bits, or the timestamp prefix reveals creation time you must hide',
          ],
          [
            'ULID',
            '48-bit millisecond timestamp plus 80 random bits, encoded as 26 Crockford base32 characters that sort lexicographically as strings',
            'Identifiers travel as text through logs, URLs, and object keys and must still sort',
            'You store them as a 26-byte string in a hot index where 8 bytes would do',
          ],
          [
            'Snowflake',
            'One 64-bit integer: 1 unused sign bit, 41 bits of milliseconds since a custom epoch, 10 bits of worker id, 12 bits of per-millisecond sequence',
            'High-volume sharded writes needing a compact, sortable, coordination-free key',
            'You cannot reliably assign a unique worker id or keep clocks monotonic',
          ],
          [
            'Hashids / base62 short code',
            'A short random or encoded string drawn from a 62-character alphabet, checked for collision on insert with a unique index',
            'Public URLs and share links where length and opacity matter more than sortability',
            'It is the storage key for a huge table, or the space is too small for the volume',
          ],
          [
            'Range (block) allocator',
            'A central table hands each host a block such as 1,000,000 to 1,009,999; the host serves that block from memory and returns for another',
            'You want dense small integers with almost no coordination and can tolerate gaps',
            'Gaps are unacceptable, or the allocator cannot be made highly available',
          ],
        ],
        note: 'Only two questions really matter: does the generator need to ask anyone for permission, and does the value sort by time. Every row above is an answer to that pair.',
      },
      {
        title: 'One 64-bit Snowflake identifier, field by field',
        headers: ['Field', 'Bits', 'Range', 'What it buys'],
        rows: [
          ['Sign', '1', 'Always 0', 'Keeps the value positive in languages with only signed 64-bit integers, such as Java and JavaScript bigint handling'],
          ['Timestamp', '41', '0 to 2,199,023,255,551 ms', 'Roughly 69.7 years of milliseconds from a custom epoch, and it makes the identifier sort by time'],
          ['Worker id', '10', '0 to 1,023', 'Up to 1,024 generators producing concurrently with no communication between them'],
          ['Sequence', '12', '0 to 4,095', '4,096 identifiers inside the same millisecond on one worker, which is 4.1 million per second'],
        ],
        note: 'The fields are packed high to low, so comparing two identifiers as integers compares timestamp first. Reallocating bits is a direct trade: 12 worker bits gives 4,096 hosts but only 1,024 ids per millisecond each.',
      },
    ],
    architecture:
      'Each application host generates identifiers locally from a 64-bit Snowflake-style packer, using a worker id obtained once at startup from a short lease in etcd and kept renewed. The generator holds the last millisecond and last sequence in memory, spins to the next millisecond on overflow, and refuses to emit anything if the clock moves backwards. Public URLs carry a separate short base62 code stored in its own uniquely indexed column, so the internal sortable key never appears to users.',
    diagrams: [
      { id: 'bits', title: 'One 64-bit Snowflake id', kind: 'excalidraw', src: 'snowflake-bits' },
      { id: 'anim', title: 'Generating two ids in one millisecond', kind: 'animation', src: 'snowflake' },
    ],
    walkthrough: [
      {
        title: 'Start with the sequence and say why it fails',
        description:
          'On one Postgres, a bigserial primary key is eight bytes, perfectly ordered, and free. It stops working for two specific reasons rather than for vague scale reasons: sixteen shards each running their own sequence will hand out the value 4,001 sixteen times, and a mobile client that wants to name a photo before uploading cannot ask the database at all. Name the reason that applies before reaching for anything more complex.',
      },
      {
        title: 'Decide whether generation may block on a network call',
        description:
          'If a round trip per identifier is acceptable, a central allocator is the simplest correct answer, and a block allocator makes it cheap by handing out 10,000 at a time so coordination happens once every two seconds instead of 5,000 times a second. If generation must never block, uniqueness has to come from the structure of the value itself, which means either randomness or a worker id plus a clock.',
      },
      {
        title: 'Choose sortable over purely random',
        description:
          'A random UUIDv4 primary key scatters inserts uniformly across every leaf page of the index, so a 50 GB index needs 50 GB of buffer pool to avoid a read before every write. A time-prefixed value such as UUIDv7, ULID, or Snowflake always inserts at the right-hand edge of the tree, keeping one leaf page hot and filling pages densely. Pick randomness only when leaking creation time is genuinely unacceptable.',
      },
      {
        title: 'Pack the 64 bits',
        description:
          'Take the current time in milliseconds, subtract a custom epoch such as 1 January 2020, and shift it left 22 places; shift the 10-bit worker id left 12; and place the 12-bit sequence in the low bits. Two identifiers created in the same millisecond on the same worker differ only in the sequence field, which is exactly why they still sort in creation order. The whole operation is arithmetic on registers, which is why it costs well under a microsecond.',
        animation: 'snowflake',
      },
      {
        title: 'Hand out worker ids and defend the clock',
        description:
          'Uniqueness rests entirely on no two live generators sharing a worker id, so acquire it as a lease from etcd or ZooKeeper at startup and renew it, rather than baking it into a config file that gets copied. Then decide the clock policy explicitly: if the current millisecond is earlier than the last one used, the generator waits until the clock catches up or refuses to serve, and it never subtracts. Run NTP in slew mode so corrections drift rather than step.',
      },
      {
        title: 'Separate the storage key from the public code',
        description:
          'A sortable internal key is a gift to your index and a gift to anyone counting your orders, because id 91,204 followed by 91,533 tells a competitor you processed 329 orders in the interval. Store a second column holding a seven-character base62 code with a unique index, generate it randomly, and retry on the rare constraint violation. URLs and API responses use the code; joins and range scans use the integer.',
      },
    ],
    deepDives: [
      {
        title: 'What happens at 4,096 identifiers in one millisecond',
        body:
          'The generator keeps two fields in memory: the last millisecond it served and the sequence counter within it. Each call reads the clock; if the millisecond is unchanged it increments the sequence, and if the millisecond has advanced it resets the sequence to zero. When the sequence reaches 4,095 inside the same millisecond, there are no distinct values left, so the correct behaviour is to spin in a tight loop until the clock ticks over and then continue at sequence zero. That is a stall of at most one millisecond, and it means a single worker is hard-capped at 4.1 million identifiers per second. The wrong behaviours are wrapping the sequence, which duplicates identifiers, and borrowing a millisecond from the future, which quietly breaks ordering and can collide after a restart.',
      },
      {
        title: 'Clock skew: never move the clock backwards, wait instead',
        body:
          'A timestamp-plus-sequence identifier is unique only because the timestamp never repeats. If NTP steps a host back by 40 milliseconds, the generator will reissue timestamps it has already used, and with the same worker id it will produce exact duplicates for those 40 milliseconds. The defence is to persist the highest millisecond served and compare on every call: if the clock is behind, either block until it catches up or fail loudly, but never emit. Forty milliseconds of blocking is survivable; silent duplicate primary keys are not. Configure NTP to slew rather than step so corrections arrive as a gradual rate adjustment, keep leap-second smearing consistent across the fleet, and alarm on any host whose offset exceeds a few milliseconds.',
      },
      {
        title: 'Why a random primary key fragments a B-tree',
        body:
          'A B-tree index stores entries in sorted order across fixed-size pages, typically 8 or 16 KB. Inserting a time-sortable key always appends to the right-most leaf, so that single page stays in memory, fills close to 100 percent, and is written once per flush. Inserting UUIDv4 keys targets a uniformly random leaf each time, so with a 50 GB index and a 16 GB buffer pool most inserts must first read a page from disk, then dirty it, and pages split near the middle and settle around 50 to 70 percent full. The index ends up roughly 1.5 times larger, write amplification rises several-fold because far more distinct pages are dirtied per second, and full-page writes bloat the write-ahead log. In InnoDB it is worse still: every secondary index stores the primary key, so a 16-byte random key inflates each of them too.',
      },
      {
        title: 'Allocating the worker id is the real operational problem',
        body:
          'Snowflake correctness reduces to one invariant: at most one live process per worker id. A static config value is simple and fails the moment an image is cloned or a deployment scales out, because two pods then share id 7 and produce identical identifiers within the same millisecond. A hash of the hostname needs no coordination but collides in a 1,024-slot space with meaningful probability once you have a few dozen hosts, and it silently reuses a slot when a host is replaced. The robust approach is a short lease from etcd or ZooKeeper: at startup a process claims the lowest free id with a time-to-live, renews it while alive, and loses it automatically if it dies. A process that cannot renew must stop generating rather than assume it still owns the slot.',
      },
      {
        title: 'Block allocators trade a little density for a lot of coordination',
        body:
          'A single row holding next_value, updated with an atomic increment of 10,000, turns identifier generation into one round trip per 10,000 values. Each host caches the range in memory and serves from it, so at 5,000 identifiers per second a host talks to the allocator once every two seconds instead of 5,000 times. The identifiers stay small dense integers, which keeps indexes tight and URLs short. The costs are that the allocator must be highly available because an outage stops all growth once caches drain, and that restarts abandon the unused tail of each block, so the sequence has visible gaps. Since ordering is only guaranteed within a block, two hosts holding adjacent blocks will interleave, which is fine for keys and wrong for anything sold as a strict sequence such as invoice numbers.',
      },
      {
        title: 'Short codes, base62, and the birthday bound',
        body:
          'A URL code drawn from the 62 characters of digits plus mixed-case letters gives 62^n values: 56.8 billion at six characters and 3.52 trillion at seven. Generating them randomly rather than encoding the primary key keeps them unguessable and non-enumerable, and the collision question is answered by the ratio rather than by intuition. With one billion codes already issued in a seven-character space, a freshly drawn code collides roughly once in 3,500 attempts, which is common enough that you must handle it and rare enough that handling it is trivial: insert with a unique index and retry on violation, which converges in one or two tries. Do not encode the integer key in base62 and call it opaque, because the mapping is reversible and the codes become sequential and countable.',
      },
    ],
    tradeoffs: [
      'Time-sortable keys give you index locality and hand every reader an accurate creation timestamp you may not want to publish.',
      '64-bit Snowflake keys are compact and sortable but require correct worker-id allocation and a monotonic clock; 128-bit UUIDv7 needs neither and costs twice the bytes in every index.',
      'Block allocators keep identifiers dense and small at the price of visible gaps and a coordination service on the critical path for growth.',
      'Random short codes are unguessable and force a uniqueness check plus retry on insert, unlike an encoding of the primary key which is free and enumerable.',
    ],
    bottlenecks: [
      'A single-row allocator becoming the hottest write in the system when the block size is too small.',
      'One worker capped at 4,096 identifiers per millisecond, spinning for the rest of the millisecond under burst load.',
      'Random primary keys causing a disk read before nearly every insert once the index exceeds the buffer pool.',
      'The worker-id lease service being unavailable at deploy time, so new pods start and cannot safely generate anything.',
    ],
    scalingPath: [
      { scale: 'Prototype', focus: 'One bigserial sequence in Postgres, plus a random short code column for public URLs' },
      { scale: 'One region', focus: 'UUIDv7 or Snowflake generated in the application, worker ids from an etcd lease, NTP in slew mode with offset alarms' },
      { scale: 'Global', focus: 'Region encoded into the worker-id field so identifiers never collide across regions, and consumers that treat cross-region ordering as approximate' },
    ],
    interviewScript: [
      '"A sequence is the right default, and it fails here for one specific reason: sixteen shards would each hand out the same number."',
      '"I want the key sortable by time, because a random UUID scatters inserts across every leaf page of the index."',
      '"Snowflake is 64 bits: one sign bit, 41 bits of milliseconds, 10 bits of worker id, 12 bits of sequence."',
      '"That gives 4,096 ids per worker per millisecond, so one worker is capped at 4.1 million per second and I only need a few."',
      '"Uniqueness depends on the worker id being unique, so I lease it from etcd rather than putting it in config."',
      '"If the clock steps backwards I wait or refuse; I never subtract, because that reissues timestamps I have already used."',
    ],
    commonMistakes: [
      'Using UUIDv4 as the clustered primary key of a large, write-heavy table.',
      'Assigning worker ids from static configuration, so a cloned deployment produces duplicates.',
      'Wrapping the sequence field instead of waiting for the next millisecond.',
      'Letting NTP step the clock backwards and assuming the generator will cope.',
      'Exposing sequential internal ids in URLs, letting anyone count and enumerate your records.',
      'Encoding the primary key in base62 and treating the result as an opaque secret.',
    ],
    relatedTopics: ['consistent-hashing', 'databases', 'sharding'],
    examples: [
      'Twitter built Snowflake so tweet ids could be generated on any host and still sort by time without a central counter',
      'Instagram embeds a shard id in the identifier so a photo id tells the router which of its Postgres shards holds the row',
      'Stripe uses prefixed opaque object identifiers such as a charge prefix, which are unguessable and self-describing in logs',
    ],
    practicePrompt:
      'Reallocate the 64 Snowflake bits for a system with 4,000 hosts that needs 200 years of lifetime, and state exactly what each host loses in per-millisecond throughput.',
    followUps: [
      {
        question: 'Why not just use UUIDv4 for everything?',
        answer:
          'Because a UUIDv4 is 122 random bits with no ordering, and as a primary key that scatters every insert into a random leaf page of the B-tree. Once the index is larger than the buffer pool, most inserts require a disk read first, pages split around half full so the index grows roughly 1.5 times, and write amplification climbs. It is also 16 bytes rather than 8, which in InnoDB is copied into every secondary index. UUIDv4 is excellent for identifiers that are generated anywhere and never used as the clustered key.',
        category: 'Indexing',
        difficulty: 'easy',
      },
      {
        question: 'Walk me through the Snowflake bit layout and what each field buys.',
        answer:
          'One sign bit stays zero so the value is a positive signed 64-bit integer. Forty-one bits hold milliseconds since a custom epoch, which is about 69.7 years of range and makes integer comparison equal to time comparison. Ten bits hold the worker id, allowing 1,024 concurrent generators with no communication. Twelve bits hold a per-millisecond sequence, giving 4,096 identifiers per worker per millisecond, or 4.1 million per second. The fields are packed from high to low so the timestamp dominates the sort order.',
        category: 'Fundamentals',
        difficulty: 'medium',
      },
      {
        question: 'What happens if a worker needs more than 4,096 ids in one millisecond?',
        answer:
          'The sequence field is exhausted, so the generator must spin until the clock reaches the next millisecond and then resume at sequence zero. That is a stall of under one millisecond and a hard ceiling of 4.1 million identifiers per second per worker. Wrapping the sequence would emit a duplicate, and consuming timestamps from the future breaks ordering and risks collisions after a restart, so blocking is the only correct option. If you genuinely need more, add workers or move bits from the worker field to the sequence field.',
        category: 'Mechanism',
        difficulty: 'medium',
      },
      {
        question: 'A host has its clock stepped back 50 ms by NTP. What does your generator do?',
        answer:
          'It compares the current millisecond against the highest millisecond it has already served and, seeing that it is behind, either blocks until the clock catches up or fails the request loudly. It must never generate, because reusing a timestamp with the same worker id and a reset sequence produces exact duplicate identifiers. Fifty milliseconds of blocking is a tiny latency spike; duplicate primary keys are a data corruption incident. The systemic fix is running NTP in slew mode so corrections are gradual, plus alarms on clock offset per host.',
        category: 'Failure modes',
        difficulty: 'hard',
      },
      {
        question: 'How do you allocate worker ids safely?',
        answer:
          'Take a short lease from a coordination service such as etcd or ZooKeeper: the process claims the lowest free id with a time-to-live, renews it while it runs, and the id is released automatically if it dies. Static configuration breaks the moment an image is cloned or a replica set scales, because two processes then share an id and collide within a millisecond. A hostname hash needs no coordination but collides in a 1,024-slot space at surprisingly small fleet sizes. A process that cannot renew its lease must stop generating rather than assume it still owns the slot.',
        category: 'Operations',
        difficulty: 'hard',
      },
      {
        question: 'UUIDv7 or ULID, and why?',
        answer:
          'Both put a 48-bit millisecond timestamp in the high bits and fill the rest with randomness, so both sort by time and both avoid the coordination that Snowflake needs. UUIDv7 is the better choice when the value lives in a native UUID column and existing tooling expects UUID formatting. ULID is better when the identifier mostly travels as text through logs, URLs, and object keys, because its 26-character Crockford base32 encoding sorts correctly as a plain string and avoids ambiguous characters. If storage width matters, note that both are 16 bytes against Snowflake at 8.',
        category: 'Selection',
        difficulty: 'medium',
      },
      {
        question: 'What information do sequential ids leak?',
        answer:
          'Volume and timing. If a competitor creates two accounts an hour apart and sees ids 91,204 and 91,533, they know you processed 329 records in that hour, and repeating it gives them your growth curve. Sequential ids are also enumerable, so any endpoint with a weak authorisation check can be walked from 1 upward to scrape every record. The fix is not to hide the sequence but to keep it internal and expose a separate random opaque code, while still enforcing authorisation on every lookup.',
        category: 'Security',
        difficulty: 'medium',
      },
      {
        question: 'How would you build short URL codes and handle collisions?',
        answer:
          'Draw seven random characters from a 62-character alphabet, giving about 3.52 trillion possibilities, and insert the row with a unique index on the code. With one billion codes issued, a random draw collides roughly once in 3,500 attempts, so catch the constraint violation and retry, which succeeds almost immediately. Avoid encoding the primary key in base62: the transformation is reversible, so the codes become sequential, guessable, and countable. Watch the fill ratio over time and add a character before the space gets tight.',
        category: 'Encoding',
        difficulty: 'medium',
      },
      {
        question: 'Is a central identifier service ever the right answer?',
        answer:
          'Yes, when identifiers must be dense and small, or when the numbering has business meaning such as invoice or ticket numbers. Make it cheap with block allocation: an atomic increment of 10,000 on a single row means one round trip per 10,000 values, so a host generating 5,000 per second calls it once every two seconds. Accept that restarts abandon the unused tail of each block, so gaps appear, and that two hosts holding adjacent blocks will interleave in time. The service must be replicated, because once caches drain nothing can be created.',
        category: 'Architecture',
        difficulty: 'medium',
      },
      {
        question: 'Where does consistent hashing fit into this?',
        answer:
          'It does not generate identifiers; it decides which node stores a given key once you already have one. The identifier scheme answers "what is this thing called", and consistent hashing answers "which of my N nodes owns that name, and how little moves when N changes". They interact in exactly one way worth mentioning: a time-sortable identifier hashes to a well-spread position on the ring, whereas partitioning directly on the raw sortable value would send all current writes to one node. The ring itself is covered in the consistent hashing lesson.',
        category: 'Fundamentals',
        difficulty: 'easy',
      },
    ],
  }),
};
