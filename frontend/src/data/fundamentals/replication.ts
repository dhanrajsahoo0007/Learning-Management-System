import { ArchitectureTopic, emptyContent } from '../systemDesignTypes';

export const replicationTopic: ArchitectureTopic = {
  id: 'replication',
  title: 'Replication',
  description: 'Copies of your data on other machines: leader-follower, multi-leader, quorums, lag, failover, and split-brain.',
  difficulty: 'Intermediate',
  progress: 0,
  icon: 'Copy',
  color: 'bg-blue-700',
  section: 'fundamentals',
  track: 'classic',
  prerequisites: ['databases'],
  estimatedMinutes: 80,
  order: 4,
  content: emptyContent({
    overview:
      'Replication buys durability, read capacity, and geographic proximity. It costs you a new class of bug: two copies that disagree, and a user who cannot see the write they just made.',
    whyItExists:
      'A single database is a single point of failure and a single machine worth of read capacity. Copies solve both, and immediately raise the question of what "the data" means when copies differ.',
    problemStatement: {
      prompt:
        'One primary database serves your product. Add replicas so reads scale and a machine loss is survivable, then answer the hard part: what a user sees immediately after a write, and what happens when the primary disappears mid-transaction.',
      inScope: [
        'Synchronous, asynchronous, and semi-synchronous replication',
        'Leader-follower, multi-leader, and leaderless topologies',
        'Quorums and the W + R > N rule',
        'Failover, split-brain, and replication lag',
      ],
      outOfScope: [
        'Raft and Paxos internals (see the consensus lesson)',
        'Partitioning data across nodes (see the sharding lesson)',
        'Isolation levels (see the transactions lesson)',
        'Backup and point-in-time restore procedures',
      ],
    },
    assumptions: [
      'Replicas are full copies; partitioning is a separate concern',
      'The network can partition and machines can pause without warning',
      'Reads outnumber writes, which is what makes replicas useful',
    ],
    whenToUse: [
      'Read capacity beyond one machine',
      'Surviving the loss of a node, a zone, or a region',
      'Serving users on another continent without crossing an ocean per read',
    ],
    functionalRequirements: [
      { title: 'Propagate every committed write', detail: 'In order, exactly once, to every replica.' },
      { title: 'Serve reads from replicas', detail: 'With a documented staleness bound the application can reason about.' },
      { title: 'Promote on failure', detail: 'Choose a new leader and prevent the old one from accepting writes.' },
      { title: 'Rejoin after recovery', detail: 'A returning node must catch up or be rebuilt, never silently diverge.' },
    ],
    nonFunctionalRequirements: [
      { title: 'Durability', detail: 'How many copies must acknowledge before you tell the user "saved"?' },
      { title: 'Write latency', detail: 'Synchronous replication adds a full round trip to every commit.' },
      { title: 'Staleness', detail: 'Bound replica lag and alert on it; unbounded lag is a silent correctness bug.' },
      { title: 'Failover time', detail: 'Detection plus promotion plus client reconnection, typically 10–60 seconds.' },
    ],
    estimates: [
      { label: 'Same-AZ replication lag', value: '1–10 ms', note: 'Usually invisible to users' },
      { label: 'Cross-region lag', value: '50–500 ms', note: 'Bounded below by the speed of light' },
      { label: 'Sync commit penalty', value: '+1 RTT per write', note: '~1ms in-region, ~80ms cross-region' },
      { label: 'Quorum for N=3', value: 'W=2, R=2', note: 'W + R > N guarantees an overlap' },
      { label: 'Typical failover', value: '10–60 s', note: 'Detection dominates; do not set it too aggressive' },
    ],
    concepts: [
      'Leader-follower (primary-replica)',
      'Synchronous vs asynchronous vs semi-synchronous',
      'Write-ahead log shipping',
      'Replication lag and LSN',
      'Quorum reads and writes',
      'Read-your-writes consistency',
      'Split-brain and fencing',
      'Failover and automated promotion',
    ],
    comparisons: [
      {
        title: 'Replication topologies',
        headers: ['Topology', 'How it works', 'Use when', 'Avoid when'],
        rows: [
          [
            'Leader-follower',
            'One node accepts writes and streams its log to read-only followers',
            'The default for almost everything: simple and conflict-free',
            'You need write availability in more than one region',
          ],
          [
            'Multi-leader',
            'Several nodes accept writes and replicate to each other, resolving conflicts',
            'Multi-region writes, offline-capable clients',
            'You cannot define a sane conflict resolution rule',
          ],
          [
            'Leaderless (Dynamo-style)',
            'The client writes to several nodes and reads from several; quorum overlap gives consistency',
            'High availability under partial failure, tunable per query',
            'You need ordering guarantees or simple mental models',
          ],
          [
            'Chain replication',
            'Nodes form a chain; writes enter the head, reads leave the tail',
            'Strong consistency with high read throughput',
            'Latency matters — a write traverses the whole chain',
          ],
        ],
      },
      {
        title: 'Durability versus write latency',
        headers: ['Mode', 'How it works', 'Use when', 'Avoid when'],
        rows: [
          [
            'Asynchronous',
            'Leader commits and replies; replicas catch up whenever',
            'Read scaling where a few seconds of lag is fine',
            'Losing the last few seconds of writes is unacceptable',
          ],
          [
            'Synchronous',
            'Leader waits for every replica before replying',
            'Very small clusters where durability dominates',
            'One slow replica can stall all writes',
          ],
          [
            'Semi-synchronous',
            'Leader waits for one replica, the rest catch up asynchronously',
            'The practical default: bounded data loss, bounded latency',
            'You need zero data loss under simultaneous double failure',
          ],
        ],
        note: 'Semi-synchronous is what most production Postgres and MySQL deployments actually run.',
      },
      {
        title: 'Reading your own writes',
        headers: ['Technique', 'How it works', 'Cost'],
        rows: [
          ['Read from leader', 'Route a user to the primary for a short window after a write', 'Leader read load rises'],
          ['LSN tracking', 'Client carries the log position; replica waits until it has applied it', 'Extra latency on the read'],
          ['Sticky routing', 'Pin a session to one replica', 'Uneven load; breaks when that replica dies'],
          ['Write-through cache', 'Serve the just-written value from the cache', 'Only covers the exact key written'],
        ],
      },
    ],
    architecture:
      'A leader accepts every write and appends it to a write-ahead log. Replicas stream that log and apply it in order. One replica may acknowledge synchronously so a leader loss cannot lose the last commit; the rest lag by milliseconds and serve reads that tolerate staleness.',
    diagrams: [
      { id: 'quorum', title: 'Leader, replicas, and quorum', kind: 'excalidraw', src: 'replication-quorum' },
      { id: 'lag', title: 'Where a stale read comes from', kind: 'animation', src: 'replication-lag' },
      { id: 'merkle', title: 'Anti-entropy: comparing replicas without shipping the data', kind: 'excalidraw', src: 'merkle-shards' },
      {
        id: 'failover',
        title: 'Failover sequence',
        kind: 'mermaid',
        src: `sequenceDiagram
  participant App
  participant Primary
  participant Replica
  participant Orchestrator
  App->>Primary: write
  Primary->>Replica: stream WAL
  Primary--xOrchestrator: heartbeat missed
  Orchestrator->>Replica: is your log the most complete?
  Replica-->>Orchestrator: LSN 120
  Orchestrator->>Replica: promote to primary
  Orchestrator->>Primary: fence the old node
  App->>Replica: reconnect and write`,
      },
    ],
    walkthrough: [
      {
        title: 'The write lands on the leader',
        description:
          'The leader appends the change to its write-ahead log and fsyncs it. That log is the single ordered history of the database, and every replica will replay exactly this sequence.',
        animation: 'replication-lag',
      },
      {
        title: 'One replica acknowledges before the commit returns',
        description:
          'In semi-synchronous mode the leader waits for one replica to have the record durably before telling the client "committed". A leader loss now costs at most an in-flight transaction, not the last five seconds.',
      },
      {
        title: 'Other replicas stream behind',
        description:
          'Async replicas apply the same log at their own pace, typically milliseconds behind in-region. Their lag is a measurable number — the LSN difference — and it should be on a dashboard with an alert.',
      },
      {
        title: 'A read hits a lagging replica',
        description:
          'The user updates their profile, the write commits, the read goes to a replica that is 200ms behind, and the old name comes back. Nothing is broken; the system is doing exactly what asynchronous replication means.',
      },
      {
        title: 'The leader disappears',
        description:
          'Heartbeats stop. An orchestrator compares replica log positions, promotes the most complete one, and — critically — fences the old leader so it cannot accept writes if it wakes up.',
      },
      {
        title: 'Clients reconnect',
        description:
          'Applications find the new leader through a virtual IP, a proxy, or a service registry. Any connection pool still pointing at the old node must be recycled, which is why failover time is dominated by client behaviour rather than by promotion.',
      },
    ],
    deepDives: [
      {
        title: 'Replication lag is a product decision',
        body:
          'Lag is not merely an operational metric; it decides what your users can see. A user who edits their profile and immediately reloads must see the new value, so that read goes to the leader or waits for the replica to reach the write log position. A user browsing someone else feed can tolerate seconds of staleness. The design move is to classify each read path as "must be fresh" or "may be stale" and route accordingly, rather than sending everything to the leader out of caution and losing the read scaling you built replicas for.',
      },
      {
        title: 'Quorums and why W + R > N works',
        body:
          'With N replicas, if writes must be acknowledged by W of them and reads must consult R of them, then W + R > N guarantees at least one node in every read set also took part in the last write. With N=3, W=2 and R=2 gives one node of overlap and tolerates one failure on either path. Tuning changes the profile: W=1, R=3 makes writes fast and reads expensive, W=3, R=1 does the opposite. Quorum gives you overlap, not ordering — concurrent writes to different nodes still need version vectors or last-write-wins to resolve, which is why leaderless systems return multiple versions to the client.',
      },
      {
        title: 'Split-brain and why fencing is mandatory',
        body:
          'A network partition can make a healthy leader look dead. If the orchestrator promotes a replica while the old leader still accepts writes from clients on its side of the partition, both nodes take writes and the histories diverge permanently. Merging them afterwards is a manual, lossy exercise. The defences are a majority quorum for the promotion decision, so a minority partition cannot elect anything, and hard fencing of the old node — revoking its virtual IP, blocking it at the proxy, or STONITH. Automatic failover without fencing is more dangerous than no automatic failover at all.',
      },
      {
        title: 'Multi-leader conflicts are unavoidable, so plan the rule',
        body:
          'The instant two regions accept writes to the same row, two conflicting versions can exist and no amount of clever engineering removes that possibility. The question is only how you resolve it. Last-write-wins with synchronised clocks is simple and silently discards data. Version vectors detect the conflict and hand both versions to the application, which needs a merge rule. CRDTs — counters, sets, sequences with commutative merge semantics — resolve automatically and are why collaborative editors work, at the cost of restricting your data types. Choose the rule before you choose multi-leader, not after the first conflict.',
      },
      {
        title: 'Semi-synchronous is the pragmatic default',
        body:
          'Fully synchronous replication means one slow or restarting replica blocks every write in the system, converting a partial failure into a total outage. Fully asynchronous means a leader loss silently discards recent commits. Waiting for exactly one acknowledgement from any replica bounds data loss to in-flight transactions while keeping the latency penalty to a single in-region round trip, around a millisecond. The tuning detail that matters is the timeout: if no replica acknowledges within it, decide deliberately whether to degrade to asynchronous or to reject writes, because that choice is your availability-versus-durability stance.',
      },
      {
        title: 'What replication does not give you',
        body:
          'Replicas are not backups. A dropped table, a bad migration, or a malicious delete replicates faithfully and instantly to every copy. Only a point-in-time restore from snapshots plus archived logs recovers from a logical error, and only a restore that has actually been rehearsed counts. Replicas also do not scale writes, because every write still passes through the leader — that is what partitioning is for. Stating both limits in an interview is a quick way to show you have operated this rather than only read about it.',
      },
    ],
    tradeoffs: [
      'Synchronous replication trades write latency and availability for durability.',
      'More replicas mean more read capacity and more lag to monitor.',
      'Multi-leader buys regional write availability at the price of conflict resolution.',
      'Aggressive failover detection reduces downtime and increases false promotions.',
    ],
    bottlenecks: [
      'A single leader caps total write throughput no matter how many replicas exist.',
      'One slow replica stalls synchronous commits for everyone.',
      'Long-running queries on a replica delay log application and inflate lag.',
      'Connection pools that keep pointing at a demoted node after failover.',
    ],
    scalingPath: [
      { scale: 'Prototype', focus: 'One primary plus one asynchronous replica for safety' },
      { scale: 'One region', focus: 'Semi-synchronous commit, read routing by freshness need, lag alerting' },
      { scale: 'Global', focus: 'Per-region read replicas, or distributed SQL when regional writes are required' },
    ],
    interviewScript: [
      '"One leader takes writes; replicas serve reads that tolerate a few hundred milliseconds of staleness."',
      '"I will run semi-synchronous, so a leader loss costs an in-flight transaction rather than five seconds of commits."',
      '"Profile edits read from the leader for thirty seconds after a write; everything else reads replicas."',
      '"Failover promotes the replica with the highest log position and fences the old leader before anything else."',
      '"Replication does not scale writes and it is not a backup — a bad DELETE replicates perfectly."',
      '"If we need writes in two regions I would move to distributed SQL rather than hand-rolling multi-leader conflict resolution."',
    ],
    commonMistakes: [
      'Sending every read to replicas and then being surprised by stale data.',
      'Automatic failover without fencing the old leader.',
      'Treating replicas as a backup strategy.',
      'Ignoring replication lag until it is measured in hours.',
      'Choosing multi-leader without a defined conflict resolution rule.',
      'Assuming replication increases write throughput.',
    ],
    relatedTopics: ['databases', 'consensus', 'sharding', 'transactions', 'distributed-locking'],
    examples: [
      'Postgres streaming replication with synchronous_standby_names for semi-synchronous commit',
      'DynamoDB uses leaderless quorum replication with tunable consistency per read',
      'Google Spanner replicates each partition with a Paxos group to keep external consistency',
    ],
    practicePrompt:
      'Your product shows a user their own profile immediately after they edit it, but 20% of reads are stale. Design the fix and state its cost on leader load.',
    followUps: [
      {
        question: 'How do you guarantee read-your-writes without sending everything to the leader?',
        answer:
          'Return the write log position to the client, carry it on subsequent reads, and have the replica block briefly until it has applied that position. Only the reads that genuinely follow a write pay the cost. A simpler approximation is a short leader-read window per session, which is easier to implement and covers most cases.',
        category: 'Consistency',
        difficulty: 'hard',
      },
      {
        question: 'What exactly is split-brain?',
        answer:
          'Two nodes both believing they are the leader, usually after a partition made a healthy leader look dead. Both accept writes and the histories diverge irreconcilably. Prevention is majority-quorum promotion plus hard fencing of the demoted node, not faster health checks.',
        category: 'Failure',
        difficulty: 'medium',
      },
      {
        question: 'Why is one slow replica dangerous under synchronous replication?',
        answer:
          'Because the leader cannot commit until it acknowledges, so a replica doing a long vacuum or a slow disk turns into a global write stall. This is availability being reduced by adding a machine, which is the counter-intuitive part. Semi-synchronous with a timeout avoids it.',
        category: 'Failure',
        difficulty: 'medium',
      },
      {
        question: 'When does multi-leader actually make sense?',
        answer:
          'When writes must succeed in more than one region during a partition, or when clients work offline and sync later. Collaborative editing and mobile-first apps are the honest use cases, and they work because their data types are mergeable. For ordinary transactional data, distributed SQL is usually the better answer.',
        category: 'Topology',
        difficulty: 'hard',
      },
      {
        question: 'How do you measure replication lag correctly?',
        answer:
          'Compare log positions between leader and replica, not wall-clock timestamps of the last applied transaction — an idle database shows huge apparent time lag with zero real lag. Alert on bytes behind and on apply rate, and record the p99 rather than the average, because the tail is what users notice.',
        category: 'Operations',
        difficulty: 'medium',
      },
      {
        question: 'What is a witness or arbiter node?',
        answer:
          'A voting member that participates in quorum decisions without storing a full data copy. It lets you run two data replicas across two zones and still get a majority for promotion, cheaply. It cannot be promoted, so it improves availability of the decision rather than durability of the data.',
        category: 'Topology',
        difficulty: 'medium',
      },
      {
        question: 'Does a quorum give you ordering?',
        answer:
          'No. It guarantees overlap between read and write sets, so a read sees at least one node that took the latest write. Concurrent writes to different nodes still produce siblings that need version vectors or last-write-wins. Ordering requires consensus, which is a stronger and more expensive primitive.',
        category: 'Theory',
        difficulty: 'hard',
      },
      {
        question: 'How long should failover detection take?',
        answer:
          'Long enough to survive a garbage collection pause or a brief network blip — typically 10 to 30 seconds of missed heartbeats. Sub-second detection produces false promotions, and every false promotion is a small outage plus a fencing event. Optimise total recovery time, of which client reconnection is often the largest share.',
        category: 'Operations',
        difficulty: 'medium',
      },
      {
        question: 'Can you read from a replica during failover?',
        answer:
          'Yes, and that is a real availability benefit: reads keep working while writes are unavailable. Say so explicitly in an interview, because "the database is down" is usually only half true, and designing the product to degrade to read-only is often cheap.',
        category: 'Failure',
        difficulty: 'easy',
      },
      {
        question: 'What is the difference between logical and physical replication?',
        answer:
          'Physical ships raw block or WAL changes, so the replica is a byte-identical copy — fast, but the same version and full database only. Logical ships row-level change events, so you can replicate a subset of tables, across versions, or into a different system entirely. CDC pipelines are built on logical replication for exactly that reason.',
        category: 'Mechanics',
        difficulty: 'medium',
      },
    ],
  }),
};
