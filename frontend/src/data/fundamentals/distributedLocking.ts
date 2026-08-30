import { ArchitectureTopic, emptyContent } from '../systemDesignTypes';

export const distributedLockingTopic: ArchitectureTopic = {
  id: 'distributed-locking',
  title: 'Distributed Locking and Leases',
  description: 'Mutual exclusion across machines: why a TTL is a guess, why a paused process still holds a lock it has lost, and why only fencing tokens make it safe.',
  difficulty: 'Advanced',
  progress: 0,
  icon: 'Lock',
  color: 'bg-amber-700',
  section: 'fundamentals',
  track: 'classic',
  prerequisites: ['databases'],
  estimatedMinutes: 70,
  order: 23,
  content: emptyContent({
    overview:
      'A distributed lock is an attempt to give one process exclusive access to something when there is no shared memory and no reliable clock. It is achievable, but not with the guarantees the name suggests: any lock with a timeout can expire while its holder still believes it is held, and no amount of tuning removes that. The safe designs either avoid needing the lock or push a fencing check down to the resource being protected.',
    whyItExists:
      'Two workers running the same job at the same time can double-charge a card, send a notification twice, or corrupt a file that is not written atomically. Locking is the blunt tool for making such an operation happen once, when the cheaper structural fixes are unavailable.',
    problemStatement: {
      prompt:
        'A nightly settlement job runs on three application servers behind an autoscaler, and it must process each merchant exactly once. Design the mutual exclusion, then explain precisely what happens when the holder stalls for twelve seconds in garbage collection while its lease has ten seconds left.',
      inScope: [
        'Designs that remove the need for a lock entirely',
        'Database locks, Redis locks, and etcd or ZooKeeper leases',
        'Lease expiry under process pauses, and fencing tokens',
        'Granularity, convoys, deadlock, and leader election',
      ],
      outOfScope: [
        'Single-process mutexes, semaphores, and memory ordering',
        'Consensus algorithm internals, which the consensus lesson covers',
        'Database isolation levels in depth, covered by the transactions lesson',
        'Distributed transactions and saga compensation flows',
      ],
    },
    assumptions: [
      'Processes can pause arbitrarily long without noticing, from GC, page faults, or a hypervisor stall',
      'The network can delay, duplicate, and reorder messages, so a lock reply may arrive after it is stale',
      'Clocks drift, so wall-clock reasoning about expiry is unreliable across machines',
    ],
    whenToUse: [
      'A side effect that is genuinely not idempotent and cannot be made so, such as writing a non-atomic file',
      'Electing one active worker from a pool, where the others must stay idle',
      'Serialising an expensive operation to protect a downstream system rather than to protect correctness',
    ],
    functionalRequirements: [
      { title: 'Mutual exclusion', detail: 'At most one holder per key at any time, under normal operation.' },
      { title: 'Automatic release', detail: 'A holder that crashes must not block the key forever, so every lock carries a TTL or session.' },
      { title: 'Safe release', detail: 'A holder may only release its own lock, identified by a token it generated at acquisition.' },
      { title: 'Extension', detail: 'A long task can renew its lease while it is still demonstrably alive.' },
    ],
    nonFunctionalRequirements: [
      { title: 'Acquisition latency', detail: 'Under 1 ms in-region, so the lock is cheap relative to the work it guards.' },
      { title: 'Safety under pause', detail: 'A stale holder writing after expiry must be rejected, not merely unlikely.' },
      { title: 'Availability', detail: 'The lock service must not become a single point of failure for the whole application.' },
      { title: 'Fairness', detail: 'Bounded waiting, so one contended key does not starve a subset of workers indefinitely.' },
    ],
    estimates: [
      { label: 'Redis SET NX round trip', value: '0.3–1 ms in-region', note: 'One RTT plus negligible server work' },
      { label: 'TTL sizing', value: 'p99 work 4 s → TTL 30 s', note: 'About 7x headroom for pauses and slow I/O' },
      { label: 'Throughput per key', value: '5 ms hold → 200 ops/s', note: 'One lock key is a hard serialisation ceiling regardless of fleet size' },
      { label: 'etcd lease', value: '10 s TTL, keepalive every 3 s', note: 'Three missed heartbeats before the session is revoked' },
      { label: 'Stop-the-world pause', value: '200 ms typical, over 10 s possible', note: 'A 12 s pause inside a 30 s TTL after 20 s of work loses the lock mid-write' },
    ],
    concepts: [
      'Prefer idempotency over locking',
      'SELECT FOR UPDATE and advisory locks',
      'SET key token NX PX ttl',
      'Unlock by compare-and-delete',
      'Lease, session, and ephemeral node',
      'Fencing token monotonicity',
      'Lock convoy and lock ordering',
      'Leader election as a lock',
    ],
    comparisons: [
      {
        title: 'Four ways to get exclusivity',
        headers: ['Approach', 'How it works', 'Use when', 'Avoid when'],
        rows: [
          [
            'No lock at all',
            'A unique constraint, a conditional write on a version, an idempotency key, or one partition owner per key',
            'Almost always — it is faster, has no expiry, and cannot be held by a dead process',
            'The protected effect is external and truly non-repeatable',
          ],
          [
            'Database row lock',
            'SELECT ... FOR UPDATE inside a transaction, or pg_advisory_lock tied to the session',
            'The work already runs in a transaction against the same database',
            'The hold time is long, or you need exclusivity over something outside that database',
          ],
          [
            'Redis lock',
            'SET key token NX PX ttl to acquire, a Lua compare-and-delete to release',
            'Best-effort coordination where a rare double execution is merely wasteful',
            'Correctness depends on it and there is no fencing check at the resource',
          ],
          [
            'etcd or ZooKeeper lease',
            'A session with a heartbeat; keys tied to it vanish when the session lapses, and each grant has a monotonic revision',
            'You need a strongly consistent lock and a token you can fence with',
            'You cannot afford a consensus round trip on every acquisition, roughly 2–10 ms',
          ],
        ],
        note: 'Only the last row gives you a fencing token for free, which is why control planes use it and application caches do not.',
      },
    ],
    architecture:
      'The lock lives in a store outside every participant: a row in the database, a key in Redis, or a lease in etcd. A worker attempts an atomic create-if-absent carrying a unique token and a TTL, does its work, and releases by deleting only if the stored token still matches its own. Because the TTL can expire while the holder is alive but stalled, the protected resource independently tracks the highest fencing token it has seen and rejects any write carrying a lower one.',
    diagrams: [
      { id: 'fence', title: 'A lease can expire while its holder is paused', kind: 'excalidraw', src: 'fencing-token' },
    ],
    walkthrough: [
      {
        title: 'Try to eliminate the lock first',
        description:
          'Before designing mutual exclusion, ask what breaks if the operation runs twice. If the answer is "nothing", because the write is a conditional update on a version number or the row has a unique constraint on the settlement id, then you need no lock at all and no expiry to reason about. Partitioning also removes locks: assign each merchant id to exactly one consumer by hash, and single-writer-per-key becomes a property of the topology rather than something to enforce at runtime.',
      },
      {
        title: 'Acquire atomically with a token and a TTL',
        description:
          'In Redis the correct acquisition is a single SET key token NX PX 30000, where NX means create only if absent, PX sets a 30 second expiry in milliseconds, and token is a random UUID unique to this attempt. Doing this as SETNX followed by EXPIRE is a real bug: if the process dies between the two commands the key exists with no expiry and blocks the job forever. The TTL exists solely so a crashed holder does not deadlock the key.',
      },
      {
        title: 'Do the work inside the lease, and renew if it is long',
        description:
          'The holder now treats the TTL as a deadline rather than a comfort. A task whose p99 is four seconds under a thirty second lease has roughly seven times headroom, which is a reasonable margin. If the work is genuinely long-running, a background thread extends the lease — again conditionally on the token still matching — but note that a paused process cannot renew, which is precisely the case that hurts.',
      },
      {
        title: 'Release only your own lock',
        description:
          'A plain DEL is unsafe, because by the time you issue it your lease may have expired and another worker may hold the key; you would then release a lock you do not own and allow a third worker in. The release must therefore be an atomic compare-and-delete, which in Redis means a small Lua script: if redis.call("GET", KEYS[1]) == ARGV[1] then return redis.call("DEL", KEYS[1]) else return 0 end. Redis executes the script atomically, so the read and the delete cannot interleave.',
      },
      {
        title: 'The pause that breaks everything',
        description:
          'Twenty seconds into the work the process enters a twelve second stop-the-world garbage collection. At second thirty the lease expires and Redis deletes the key. A second worker acquires it legitimately and begins settling the same merchant. At second thirty-two the first process wakes up, entirely unaware, and completes its write. Two workers have now written, the lock was never violated by any component, and no timeout value would have prevented this.',
      },
      {
        title: 'Fence at the resource',
        description:
          'The only real fix is to make the protected resource reject stale writers. Each acquisition returns a monotonically increasing fencing token — etcd gives one as the key revision, ZooKeeper as the sequential node number, or a database sequence provides one. The worker sends the token with every write, and the storage layer records the highest token it has accepted and refuses anything lower. The revived process from the previous step arrives with token 41, the resource has already seen 42, and its write is rejected rather than silently applied.',
      },
    ],
    deepDives: [
      {
        title: 'Why unlock must be a compare-and-delete',
        body:
          'The unlock path is where naive implementations lose safety. Suppose worker A holds the key with a 30 second TTL, its work overruns, and the key expires. Worker B acquires the key and starts work. Worker A then finishes and issues DEL, which removes B lock even though A no longer owns it, and worker C immediately acquires it — so three workers have now been admitted, two of them concurrently. Storing a random token as the value and deleting only when the stored value matches your token closes this hole. It has to be atomic, because a GET followed by a separate DEL can interleave with an expiry and another acquisition in exactly the same way, which is why Redis implementations use a Lua script that runs as one unit.',
      },
      {
        title: 'The GC pause failure is unavoidable, not unlikely',
        body:
          'A lock with an expiry assumes a bound on how long a live process can be unresponsive, and no such bound exists. A large JVM heap can stop the world for over ten seconds; a container can be throttled by its CPU quota for many seconds; a virtual machine can be live-migrated; a page fault against a swapped page can take arbitrarily long; a network partition can delay an in-flight write past the expiry. In every case the holder believes it holds the lock, the lock service has correctly expired it, and both are right. Raising the TTL trades this risk against recovery time: a 300 second TTL makes the race rarer but means a genuinely crashed worker blocks the key for five minutes. That is a choice between two bad outcomes, not a solution.',
      },
      {
        title: 'Fencing tokens are the only real fix',
        body:
          'A fencing token is a number that strictly increases with every successful acquisition, so token order encodes acquisition order. The lock service issues it — etcd returns a revision, ZooKeeper hands out a sequential znode suffix, a Postgres sequence works if the sequence and the lock share a transaction — and the worker attaches it to every write against the protected resource. The resource keeps the highest token it has ever accepted and rejects anything lower or equal. This moves the safety decision from the lock, which cannot know whether its holder is alive, to the resource, which can compare two numbers with certainty. The price is real: the storage layer must participate, which is why fencing works with your own service or database and not with an arbitrary third-party API.',
      },
      {
        title: 'The Redlock debate, fairly stated',
        body:
          'Redlock acquires the same lock on a majority of independent Redis nodes and treats the lock as held if a majority succeed within a fraction of the TTL. The argument for it is practical: it removes the single-node failure mode of a simple Redis lock, it is fast, and it is far better than nothing. Martin Kleppmann objection is that it still relies on timing assumptions — bounded clock drift and bounded process pauses — and therefore cannot provide safety, only reduced probability of failure. Salvatore Sanfilippo replied that the mutual exclusion is about liveness and best-effort efficiency, not about protecting data without fencing. The honest resolution is the one both sides accept: if a double execution is merely wasteful, a Redis lock is fine; if it is a correctness problem, you need fencing tokens and a consensus-backed store, and then Redlock adds nothing you need.',
      },
      {
        title: 'Leases and sessions in etcd and ZooKeeper',
        body:
          'These systems replace the bare TTL with a session. A client obtains a lease with, say, a 10 second TTL and sends a keepalive every 3 seconds, so it tolerates two lost heartbeats. Keys can be attached to that lease — ZooKeeper calls them ephemeral nodes — and when the session lapses the server deletes them automatically, which gives crash detection without any application code. Because both systems are backed by Raft or Zab, the deletion is agreed by a majority, so there is no window in which two nodes disagree about who holds the lock. Waiters register a watch on the predecessor node rather than polling, which turns contention into a queue with an event per handoff instead of a thundering herd. The cost is a consensus round trip per acquisition, a few milliseconds in-region and far more across regions.',
      },
      {
        title: 'Granularity, convoys, and deadlock',
        body:
          'One global lock is easy to reason about and caps your throughput at the reciprocal of the hold time — a 5 millisecond critical section allows 200 operations per second, no matter how many servers you add. Locking per entity, such as one key per merchant id, gives concurrency proportional to the number of entities, and is almost always the right granularity. Two failure patterns follow. A lock convoy appears when the hold time approaches the arrival interval: every request queues, latency rises, and the queue itself becomes the bottleneck even though no single hold is slow. Deadlock appears when two workers take two locks in opposite order; the fix is a global ordering rule, such as always locking entity ids ascending, plus a timeout on acquisition so a mistake degrades into a retry rather than a hang.',
      },
    ],
    tradeoffs: [
      'A long TTL reduces the stale-holder race and makes a crashed worker block the key for that long.',
      'Redis locking is sub-millisecond and unsafe without fencing; etcd is safe and costs a consensus round trip.',
      'Coarse locks are simple and cap throughput; per-entity locks scale and introduce ordering and deadlock concerns.',
      'Automatic lease renewal keeps long jobs alive and cannot help precisely when the process is paused.',
    ],
    bottlenecks: [
      'A single hot lock key serialising the whole fleet to one critical section at a time.',
      'Lock service latency added to every operation, which is significant if the work itself is short.',
      'Convoy formation when hold time approaches request inter-arrival time.',
      'The lock store becoming a hard dependency whose outage stops all guarded work.',
    ],
    scalingPath: [
      { scale: 'Prototype', focus: 'A unique constraint or SELECT FOR UPDATE in the database you already run' },
      { scale: 'One region', focus: 'Redis SET NX PX with token-checked release, per-entity keys, and idempotent handlers behind it' },
      { scale: 'Global', focus: 'etcd or ZooKeeper leases with fencing tokens enforced at the storage layer, or partition ownership so no lock is needed' },
    ],
    interviewScript: [
      '"My first move is to not need a lock: an idempotency key and a conditional write remove the problem entirely."',
      '"If I do need one, acquisition is a single atomic SET with NX, a TTL, and a random token."',
      '"Release is a compare-and-delete in Lua, because a plain DEL can release a lock someone else now holds."',
      '"A TTL cannot be made safe — a twelve second GC pause expires my lease while I still think I hold it."',
      '"So the resource enforces a monotonic fencing token and rejects any write below the highest it has seen."',
      '"For anything where correctness depends on exclusivity I use etcd leases, and accept the few milliseconds."',
    ],
    commonMistakes: [
      'Using SETNX followed by a separate EXPIRE, leaving a lock with no expiry if the process dies between them.',
      'Releasing with DEL instead of a token-checked compare-and-delete.',
      'Believing a longer TTL makes the lock safe rather than making the failure rarer.',
      'Assuming a lock provides correctness without any fencing check at the resource.',
      'Holding a lock across a network call to a third party, so a slow dependency becomes a fleet-wide stall.',
      'Taking multiple locks in an inconsistent order and calling the resulting hang a performance problem.',
    ],
    relatedTopics: ['consensus', 'transactions', 'databases', 'bookmyshow'],
    examples: [
      'Kubernetes controllers elect a leader through a Lease object in the API server, renewed every few seconds',
      'HDFS NameNode failover uses a fencing step so the previous active node cannot write to the shared edit log',
      'Postgres advisory locks are widely used to serialise cron-style jobs in the database that already holds the data',
    ],
    practicePrompt:
      'Your payout job must charge each merchant once, and the worker occasionally pauses for ten seconds; write the acquisition, release, and fencing steps that make a double charge impossible.',
    followUps: [
      {
        question: 'How do you avoid needing a distributed lock in the first place?',
        answer:
          'Make the operation idempotent and let the storage layer enforce uniqueness: a unique constraint on a settlement id turns a duplicate into a rejected insert rather than a double effect. Conditional writes — compare-and-set on a version column or an ETag — make the second writer fail instead of overwrite. Partitioning by key so one consumer owns each key converts mutual exclusion into a property of the topology, which cannot expire.',
        category: 'Design',
        difficulty: 'medium',
      },
      {
        question: 'Why is SETNX plus EXPIRE wrong?',
        answer:
          'They are two separate commands, so a crash or a connection drop between them leaves the key present with no expiry, and the lock is held forever by nobody. Since Redis 2.6.12 the single command SET key token NX PX ttl does both atomically, which is why every current implementation uses it. The same reasoning applies to release, which must also be one atomic operation.',
        category: 'Mechanics',
        difficulty: 'easy',
      },
      {
        question: 'Why does the unlock script compare a token?',
        answer:
          'Because your lease may already have expired and been acquired by someone else. If you issue a plain DEL at that moment you free the new holder lock, admitting a third worker while the second is still running. Storing a random token as the value and deleting only when the value matches yours makes the release a no-op when you no longer own the lock, and it must be a Lua script so the compare and the delete cannot interleave.',
        category: 'Mechanics',
        difficulty: 'medium',
      },
      {
        question: 'Walk through the GC pause failure.',
        answer:
          'A worker acquires a 30 second lease and starts a job. Twenty seconds in it stops the world for twelve seconds. At second thirty the lease expires, a second worker legitimately acquires the lock and begins the same job. At second thirty-two the first worker resumes with no knowledge that time has passed and completes its write, so two workers write concurrently despite every component behaving correctly.',
        category: 'Failure',
        difficulty: 'hard',
      },
      {
        question: 'What is a fencing token and why does it fix that?',
        answer:
          'It is a strictly increasing number issued on each successful acquisition, so ordering by token is ordering by acquisition. The worker sends its token with every write, and the resource remembers the highest token it has accepted and rejects anything lower. The revived worker from the pause scenario arrives with token 41 while the resource has already accepted 42, so its write is refused. Safety now rests on comparing two integers rather than on assumptions about clocks and pauses.',
        category: 'Safety',
        difficulty: 'hard',
      },
      {
        question: 'Is Redlock safe?',
        answer:
          'It is safer than a single-node Redis lock, because a majority acquisition survives losing one node, but it still assumes bounded clock drift and bounded process pauses, so it reduces the probability of two holders rather than eliminating it. That is acceptable when a double execution only wastes work — sending a cache refresh twice, recomputing a report. When a double execution is a correctness bug you need fencing tokens from a consensus-backed store, and at that point Redlock adds complexity without adding the property you need.',
        category: 'Debate',
        difficulty: 'hard',
      },
      {
        question: 'How do etcd leases differ from a Redis TTL?',
        answer:
          'A lease is a session rather than a per-key timer: the client sends keepalives, typically every 3 seconds against a 10 second TTL, and every key attached to that lease is deleted together when the session lapses. Because etcd is Raft-backed, the expiry decision is agreed by a majority, so there is no window where two clients see different lock states. Each write also carries a revision number, which doubles as a ready-made fencing token.',
        category: 'Mechanics',
        difficulty: 'medium',
      },
      {
        question: 'What is a lock convoy?',
        answer:
          'It is the queueing collapse that happens when hold time approaches the interval between requests. Each holder is individually fast, but arrivals never find the lock free, so the wait queue grows and latency is dominated by queueing rather than by work. The symptom is a latency graph that climbs while every profile looks fine. Fixes are finer granularity so contention splits across keys, shorter critical sections, or removing the lock through conditional writes.',
        category: 'Performance',
        difficulty: 'medium',
      },
      {
        question: 'How is leader election related to locking?',
        answer:
          'A leader is simply the holder of one well-known lock with automatic renewal, so all the same properties apply: the lease can expire while the leader is paused, and the leader must therefore be fenced. In practice election uses a lease in etcd or the Kubernetes API server, and the leader includes its term or revision in every action it takes so the resource can reject a deposed leader. Kubernetes controllers work exactly this way.',
        category: 'Design',
        difficulty: 'medium',
      },
      {
        question: 'What granularity should the lock key have?',
        answer:
          'As fine as correctness allows, normally one key per entity — per merchant, per booking, per document — so concurrency scales with the number of entities rather than being capped at one. A single global lock limits throughput to the reciprocal of the hold time, so a 5 millisecond critical section allows only 200 operations per second across the entire fleet. The counterweight is that multiple fine-grained locks introduce deadlock risk, which you resolve with a fixed acquisition order and an acquisition timeout.',
        category: 'Design',
        difficulty: 'medium',
      },
    ],
  }),
};
