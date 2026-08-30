import { ArchitectureTopic, emptyContent } from '../systemDesignTypes';

export const consensusTopic: ArchitectureTopic = {
  id: 'consensus',
  title: 'Consensus',
  description: 'How a group of machines agrees on one order of operations: why two-phase commit blocks, how Raft elects and repairs, and what a majority round trip costs.',
  difficulty: 'Advanced',
  progress: 0,
  icon: 'GitBranch',
  color: 'bg-indigo-800',
  section: 'fundamentals',
  track: 'classic',
  prerequisites: ['replication'],
  estimatedMinutes: 95,
  order: 24,
  content: emptyContent({
    overview:
      'Consensus is a group of machines agreeing on a single ordered sequence of operations, such that the agreement survives the loss of a minority of them. That is a narrow guarantee and an expensive one: every committed entry costs a round trip to a majority, so a cross-region group pays over a hundred milliseconds per write. It is the right primitive for configuration, leadership, and locks, and the wrong one for bulk data.',
    whyItExists:
      'Replication gives you copies, but copies can disagree, and a partition can convince two nodes they are both in charge. Consensus is the mechanism that makes one history authoritative so no partition can produce two.',
    problemStatement: {
      prompt:
        'Five nodes must agree on which of them is the primary database and on the current shard map, and they must keep agreeing while any two of them are down or unreachable. Design that agreement, then state exactly what a client is told when it writes during an election.',
      inScope: [
        'What consensus provides and what it costs',
        'Two-phase commit, its blocking failure, and why three-phase commit is not the fix',
        'Raft in detail: terms, elections, log replication, commit, and log repair',
        'Quorum arithmetic, read scaling, and real deployments',
      ],
      outOfScope: [
        'Byzantine fault tolerance and blockchain consensus',
        'Formal proofs of safety and liveness',
        'Multi-Paxos implementation details beyond the core idea',
        'Conflict resolution for multi-leader replication, which the replication lesson covers',
      ],
    },
    assumptions: [
      'Nodes may crash and restart, and messages may be lost, delayed, or reordered, but not maliciously forged',
      'Every node has stable storage it can fsync to, so a restart does not forget acknowledged entries',
      'The cluster membership is known and changes rarely, through an explicit reconfiguration step',
    ],
    whenToUse: [
      'Electing a leader, or granting a lock or lease that must never be held twice',
      'Storing small critical state: shard maps, feature configuration, cluster membership',
      'Ordering an operation log that replicas apply deterministically, as a replicated state machine',
    ],
    functionalRequirements: [
      { title: 'Agree on an order', detail: 'Every node applies the same operations in the same sequence, or applies nothing.' },
      { title: 'Elect a leader', detail: 'Exactly one leader per term, chosen by a majority, with no possibility of two in the same term.' },
      { title: 'Commit durably', detail: 'An entry acknowledged to a client is present on a majority and survives any minority loss.' },
      { title: 'Repair divergence', detail: 'A follower whose log conflicts with the leader is truncated and refilled, never left inconsistent.' },
    ],
    nonFunctionalRequirements: [
      { title: 'Write latency', detail: 'One majority round trip plus an fsync: 1–3 ms in-region, over 100 ms across continents.' },
      { title: 'Availability', detail: 'Full function while a majority is reachable; unavailable for writes when it is not, by design.' },
      { title: 'Recovery time', detail: 'An election completes in roughly 150–600 ms, during which writes fail and must be retried.' },
      { title: 'Throughput', detail: 'Thousands of entries per second, not millions — this is coordination state, not a data store.' },
    ],
    estimates: [
      { label: 'Fault tolerance', value: '2f+1 tolerates f: 3 tolerates 1, 5 tolerates 2', note: '4 nodes also tolerate only 1, so an even size buys nothing' },
      { label: 'In-region commit', value: '1–3 ms', note: 'One round trip to a majority plus an fsync on each acknowledging node' },
      { label: 'Cross-region commit', value: '~110 ms', note: 'us-east to eu-west is about 80 ms RTT, and the majority must include a remote node' },
      { label: 'Election timeout', value: '150–300 ms randomised, 50 ms heartbeat', note: 'Randomisation makes split votes rare; a split costs one more timeout' },
      { label: 'etcd throughput', value: '~10k writes/s on 3 SSD nodes', note: 'The per-entry fsync dominates, which is why bulk data does not belong here' },
    ],
    concepts: [
      'Replicated state machine',
      'Two-phase commit blocking',
      'FLP impossibility',
      'Raft terms and election timeouts',
      'RequestVote and log completeness',
      'AppendEntries and log matching',
      'Committed means majority-replicated',
      'Lease reads versus read index',
    ],
    comparisons: [
      {
        title: 'Agreement protocols',
        headers: ['Protocol', 'How it works', 'Use when', 'Avoid when'],
        rows: [
          [
            'Two-phase commit',
            'A coordinator asks every participant to prepare, then tells all of them to commit or abort; unanimity is required',
            'A single atomic operation across a fixed, small set of resources inside one datacentre',
            'The coordinator can fail, or participants cannot hold locks through an outage',
          ],
          [
            'Raft',
            'A single elected leader appends to a log and commits an entry once a majority has stored it',
            'You want an understandable, implementable consensus for leadership and small state',
            'You need write throughput of millions per second, or writers in many regions',
          ],
          [
            'Paxos (Multi-Paxos)',
            'Proposers get a majority to promise on a ballot number, then get a value accepted per slot',
            'You are building on a mature library, or you need its flexibility around leaderless proposals',
            'The team has to implement and operate it from the paper',
          ],
          [
            'Quorum without consensus',
            'Write to W nodes, read from R nodes, with W + R > N guaranteeing overlap',
            'High availability with tunable staleness — Dynamo-style stores',
            'You need a total order, uniqueness, or exactly-once semantics',
          ],
        ],
        note: 'Only the middle two give you an agreed order. Quorum gives overlap, and 2PC gives atomicity for one transaction without surviving coordinator loss.',
      },
    ],
    architecture:
      'A cluster of an odd number of nodes maintains an identical, append-only log of operations. One node is leader for a numbered term; it appends client commands to its log and replicates them with AppendEntries, and once a majority has stored an entry the leader marks it committed and applies it to the state machine. If the leader stops sending heartbeats, a follower whose randomised timeout expires first increments the term and campaigns, and any node with a strictly more complete log wins over one without.',
    diagrams: [
      { id: 'log', title: 'Committed means a majority', kind: 'excalidraw', src: 'raft-log' },
      { id: 'anim', title: 'An election', kind: 'animation', src: 'raft-elect' },
    ],
    walkthrough: [
      {
        title: 'Start from why two-phase commit is not enough',
        description:
          'In two-phase commit a coordinator asks each participant to prepare, and a participant that votes yes must hold its locks and promise it can still commit later. If the coordinator crashes after collecting the votes but before sending the decision, every participant is stuck: it cannot commit, because it does not know whether everyone voted yes, and it cannot abort, because someone may already have been told to commit. The rows stay locked until an operator intervenes, which is why 2PC is described as a blocking protocol.',
      },
      {
        title: 'A term begins with an election',
        description:
          'Raft divides time into terms, each with at most one leader, and the term number is a logical clock carried on every message so a stale leader is detected immediately. Each follower runs an election timer of 150 to 300 milliseconds, randomised per node; if no heartbeat arrives before it fires, the node increments its term, votes for itself, and sends RequestVote to everyone. Randomisation is what usually prevents two candidates starting simultaneously, and if a split vote does happen nobody wins that term and the next timeout resolves it.',
        animation: 'raft-elect',
      },
      {
        title: 'The vote includes a log completeness check',
        description:
          'A voter grants its vote only if it has not already voted in this term and if the candidate log is at least as up to date as its own, compared by the term and index of the last entry. This single rule is what makes Raft safe: a candidate missing committed entries cannot collect a majority, because any majority must include at least one node that stored those entries and will refuse. So the new leader is guaranteed to already hold every entry that was ever committed.',
      },
      {
        title: 'The leader appends and replicates',
        description:
          'A client command becomes an entry in the leader log, tagged with the current term and the next index, and the leader sends AppendEntries to every follower. That message carries the index and term of the immediately preceding entry, so a follower rejects it unless its own log matches at that point. Empty AppendEntries also serve as the heartbeat, sent about every 50 milliseconds, which is what keeps followers from starting an election.',
      },
      {
        title: 'Committed means stored by a majority, then applied',
        description:
          'When the leader has acknowledgements from a majority — three of five nodes, itself included — the entry is committed, and only then does the leader apply it to the state machine and reply to the client. Committed is a durability statement, not a visibility one: the entry is guaranteed to survive any minority loss and to be present in every future leader log. The leader piggybacks its commit index on the next AppendEntries so followers learn they may apply their copies too.',
      },
      {
        title: 'A new leader repairs the followers',
        description:
          'After an election, followers may hold uncommitted entries from an old term that the new leader does not have. The leader tracks a nextIndex per follower, and on a rejected AppendEntries it walks that index backwards until the previous entry matches, then streams forward from there, overwriting whatever diverged. Only entries that were never committed can be discarded this way, so no acknowledged write is ever lost, and every log converges to the leader log.',
      },
    ],
    deepDives: [
      {
        title: 'Why 2PC blocks, and why 3PC does not fix it',
        body:
          'The fatal state in two-phase commit is prepared-but-undecided. A participant that has voted yes has given up its right to abort unilaterally, so if the coordinator disappears it must wait, holding locks that block unrelated traffic. Three-phase commit inserts a pre-commit round so participants learn that everyone voted yes before anyone commits, which lets a survivor time out and commit on its own. That works under a synchronous network with reliable failure detection, and both assumptions are false in practice: a network partition is indistinguishable from a crash, so one side can time out and commit while the other times out and aborts, producing exactly the split-brain the protocol was supposed to prevent. The real fix is to replicate the coordinator decision itself through consensus, which is what a transaction manager on Raft or a Spanner participant group does.',
      },
      {
        title: 'FLP, and why Raft still works',
        body:
          'The Fischer, Lynch and Paterson result says that in an asynchronous system with no bound on message delay, no deterministic protocol can guarantee that all correct nodes reach agreement if even one may crash, because a crashed node and an arbitrarily slow one are indistinguishable. That sounds like a prohibition and is not, because it constrains guaranteed termination and not safety. Practical protocols therefore keep safety absolute — never two leaders in a term, never two different values committed at one index — and make liveness probabilistic by adding timeouts and randomisation. Raft randomised election timeout is precisely this: in a pathological run of split votes it might not elect a leader, but the probability of that continuing decays geometrically with each round, so in reality an election finishes in a few hundred milliseconds.',
      },
      {
        title: 'The log matching property and follower repair',
        body:
          'Raft maintains two invariants that together make repair mechanical. If two logs contain an entry with the same index and term, that entry holds the same command; and if they agree at some index, they agree on every entry before it. The first holds because a leader never changes an entry it created and only one leader exists per term. The second is enforced by the consistency check inside AppendEntries: each message names the index and term of the preceding entry, and a follower refuses the append unless its log matches there. On refusal the leader decrements nextIndex for that follower and retries, converging on the last common point — optimised implementations return the conflicting term so the leader can skip a whole term in one step instead of one index at a time. From that point the leader overwrites, and because a leader always holds every committed entry, only uncommitted entries can be discarded.',
      },
      {
        title: 'Quorum arithmetic and witness nodes',
        body:
          'A cluster of 2f+1 nodes tolerates f failures, because f+1 constitutes a majority and two different majorities always intersect, so no two conflicting decisions can both gather one. Three nodes tolerate one failure, five tolerate two, seven tolerate three, with each step adding latency because the majority is larger and the slowest of f+1 responses sets the pace. An even size is a trap: four nodes still require three for a majority, so it tolerates one failure exactly like three nodes do, while costing an extra machine and slightly worse tail latency. When you want to span two datacentres, the standard answer is a witness or arbiter — a voting member that stores only the log metadata and no state machine data, placed in a third location. It cannot become leader, but it makes a majority reachable when either real site fails.',
      },
      {
        title: 'Reading without paying for consensus every time',
        body:
          'A naive strongly consistent read is submitted as a log entry, which costs a full majority round trip and pollutes the log. Two standard optimisations avoid that. ReadIndex has the leader record its current commit index, confirm with a majority via a heartbeat that it is still the leader, and then serve the read once it has applied that index: no log write, but still one round trip. Lease reads go further — the leader takes a time-bounded lease, valid for less than the election timeout, and serves reads locally with no messages at all, on the assumption that no new leader can be elected while its lease holds. That assumption depends on bounded clock drift, which is the trade being made. Followers can also serve reads if the client sends a required index and the follower waits until it has applied it.',
      },
      {
        title: 'The cost, and therefore the correct scope',
        body:
          'Every committed write requires the leader to reach a majority and for those nodes to make the entry durable, so the floor is one round trip plus an fsync: about one to three milliseconds inside a region, and roughly 110 milliseconds when the majority spans North America and Europe. Throughput on a three-node etcd cluster with SSDs is around ten thousand writes per second, and it does not improve by adding nodes — more members means a larger majority and more work per entry. That shape makes consensus excellent for small, critical, infrequently written state: shard maps, leases, cluster membership, feature configuration. It makes it a poor choice for user data, which is why real systems put data in per-partition replicas and put only the metadata about those partitions into a consensus group.',
      },
    ],
    tradeoffs: [
      'Consensus gives a single agreed order and costs a majority round trip on every committed write.',
      'More members tolerate more failures and make every commit slower, since the majority is larger.',
      'Lease reads are the fastest strong reads and depend on a clock drift assumption that ReadIndex does not need.',
      'A consensus group placed across regions survives a region loss and pays 100 ms per write forever.',
    ],
    bottlenecks: [
      'The leader is a single funnel for every write in the group.',
      'The per-entry fsync ties throughput to disk latency more than to CPU or network.',
      'Elections make the cluster unavailable for writes for a few hundred milliseconds.',
      'A slow or distant majority member setting the pace for every commit.',
    ],
    scalingPath: [
      { scale: 'Prototype', focus: 'A single node store for configuration, with the understanding that it is a single point of failure' },
      { scale: 'One region', focus: 'Three nodes across three availability zones, in-region commit of a few milliseconds, leader-side lease reads' },
      { scale: 'Global', focus: 'Consensus for metadata only, one group per shard with a regional majority, and a witness in a third site' },
    ],
    interviewScript: [
      '"Consensus buys me one agreed order of operations that survives losing a minority — nothing more, and it is not cheap."',
      '"I will not use two-phase commit for anything durable, because a coordinator crash after prepare leaves locks held indefinitely."',
      '"Raft has one leader per term; a candidate only wins if its log is at least as complete as the voter log."',
      '"Committed means a majority has it on disk — three of five — and only then do I answer the client."',
      '"Five nodes tolerate two failures; four nodes tolerate one, so an even cluster wastes a machine."',
      '"Strong reads go through ReadIndex or a leader lease, so I am not writing a log entry just to read."',
    ],
    commonMistakes: [
      'Running a four or six node cluster and believing the extra node adds fault tolerance.',
      'Storing bulk application data in etcd or ZooKeeper instead of only coordination state.',
      'Claiming a write is safe once the leader has it, before a majority has acknowledged.',
      'Using two-phase commit across services without a replicated coordinator, then being surprised by stuck locks.',
      'Spreading a single consensus group across three continents and then complaining about write latency.',
      'Confusing quorum replication with consensus, and expecting a total order from W + R > N.',
    ],
    relatedTopics: ['replication', 'distributed-locking', 'transactions', 'databases'],
    examples: [
      'etcd runs Raft and stores all Kubernetes cluster state, which is why the API server is only as available as its quorum',
      'ZooKeeper uses Zab, a close relative, and underpins leader election for HBase and older Kafka clusters',
      'Google Spanner runs a Paxos group per shard so each partition has its own leader and its own majority',
    ],
    practicePrompt:
      'You need a shard map that survives losing an entire availability zone; choose the cluster size and placement, and state the commit latency and the failure count it tolerates.',
    followUps: [
      {
        question: 'What does consensus actually guarantee?',
        answer:
          'That every non-faulty node agrees on the same sequence of operations, and that an operation reported as committed will be present in every future state of the system. It gives you a total order and uniqueness, which is what makes leader election and locks safe. It does not give you low latency, high throughput, or availability during a loss of majority — those are the prices you pay for the order.',
        category: 'Theory',
        difficulty: 'medium',
      },
      {
        question: 'Why does two-phase commit block?',
        answer:
          'Because a participant that has voted yes in the prepare phase has surrendered the right to decide on its own, and it holds its locks while waiting for the verdict. If the coordinator crashes before broadcasting the decision, survivors cannot commit — they do not know that everyone voted yes — and cannot abort, since someone may already have committed. The transaction stays in doubt, holding locks, until the coordinator returns or a human intervenes.',
        category: 'Protocols',
        difficulty: 'medium',
      },
      {
        question: 'Does three-phase commit solve that?',
        answer:
          'Not in a real network. The extra pre-commit round tells participants that the vote was unanimous, so a survivor can decide alone after a timeout, but this relies on being able to distinguish a crash from a partition. Under a partition one side can time out and commit while the other times out and aborts, so 3PC converts a blocking failure into an inconsistency. Replicating the coordinator decision through consensus is the actual fix.',
        category: 'Protocols',
        difficulty: 'hard',
      },
      {
        question: 'State the FLP result in plain terms.',
        answer:
          'In a fully asynchronous system where one node may crash, no deterministic algorithm can guarantee that agreement is always reached, because an arbitrarily slow node is indistinguishable from a dead one. Practical systems keep safety unconditional and make progress probabilistic, using timeouts to suspect failure and randomisation to break symmetry. Raft randomised election timeout is exactly that concession.',
        category: 'Theory',
        difficulty: 'hard',
      },
      {
        question: 'Why does a Raft voter check the candidate log?',
        answer:
          'To ensure a new leader cannot be missing a committed entry. A voter compares the term and index of the candidate last entry against its own and refuses if the candidate is behind. Since any committed entry is on a majority, and any winning candidate needs a majority, at least one voter holds that entry and blocks a candidate without it. This is why Raft never needs to copy missing entries into a new leader.',
        category: 'Raft',
        difficulty: 'hard',
      },
      {
        question: 'What does committed mean in Raft?',
        answer:
          'That the entry is stored durably on a majority of the cluster, at which point the leader applies it to the state machine and answers the client. It is a statement about survivability: the entry is present in every possible future leader log, so it can never be undone. Followers learn the commit index from the next AppendEntries and apply their own copies, which is why a follower read can lag slightly even though nothing is inconsistent.',
        category: 'Raft',
        difficulty: 'medium',
      },
      {
        question: 'Why is an even cluster size a bad idea?',
        answer:
          'Because fault tolerance depends on the majority threshold, not on the node count. Four nodes need three for a majority, so they tolerate exactly one failure, the same as three nodes, while adding cost and a slightly worse tail because more members must be polled. Six nodes need four and tolerate two, the same as five. The useful sizes are therefore three, five, and occasionally seven.',
        category: 'Sizing',
        difficulty: 'easy',
      },
      {
        question: 'How do you serve strongly consistent reads cheaply?',
        answer:
          'ReadIndex has the leader capture its commit index and confirm leadership with one heartbeat round to a majority, then serve the read after applying up to that index — no log entry written. A leader lease is faster still: the leader holds a lease shorter than the election timeout and serves reads with no messages, which is safe only if clock drift is bounded. Followers can also serve reads if the client passes a required index and the follower waits to catch up.',
        category: 'Performance',
        difficulty: 'hard',
      },
      {
        question: 'What is a witness node?',
        answer:
          'A full voting member that participates in elections and commit quorums but stores only log metadata rather than the complete state machine. It is placed in a third location so a two-site deployment still has a reachable majority when either site fails, at a fraction of the cost of a third full replica. Because it holds no data it can never be promoted, so it improves availability of the decision rather than durability of the data.',
        category: 'Sizing',
        difficulty: 'medium',
      },
      {
        question: 'Where is consensus actually used, and where should it not be?',
        answer:
          'Use it for small critical state and coordination: etcd holds all Kubernetes objects, ZooKeeper elects HBase masters, the Kafka controller now runs on KRaft, and Spanner runs a Paxos group per shard. Do not use it as a general data store, because every write costs a majority round trip plus an fsync and adding members makes it slower rather than faster. The standard architecture stores data in per-partition replicas and puts only the map describing those partitions in a consensus group.',
        category: 'Practice',
        difficulty: 'medium',
      },
    ],
  }),
};
