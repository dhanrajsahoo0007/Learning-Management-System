import { ArchitectureTopic, emptyContent } from '../systemDesignTypes';

export const consistentHashingTopic: ArchitectureTopic = {
  id: 'consistent-hashing',
  title: 'Consistent Hashing',
  description:
    'Why modulo rehashing moves 80% of your keys, how the ring and virtual nodes fix it, and when rendezvous hashing is the better answer.',
  difficulty: 'Intermediate',
  progress: 0,
  icon: 'Hexagon',
  color: 'bg-teal-700',
  section: 'fundamentals',
  track: 'classic',
  prerequisites: ['unique-ids'],
  estimatedMinutes: 70,
  order: 16,
  content: emptyContent({
    overview:
      'Consistent hashing is the answer to one question: how do you assign keys to machines so that adding or removing a machine moves as few keys as possible. Placing both keys and nodes on the same circular hash space and walking clockwise achieves that, and virtual nodes make the resulting distribution even. It is the mapping underneath Cassandra, DynamoDB, Riak, memcached clients, and every sharded cache that survives a node failure without a stampede.',
    whyItExists:
      'Hashing a key modulo the node count is correct but catastrophically unstable, because the divisor is part of the function. Consistent hashing removes the node count from the arithmetic so membership changes become local rather than global.',
    problemStatement: {
      prompt:
        'A 20-node cache holds 400 million entries and serves 500,000 reads per second at a 96% hit rate. One node dies at peak and you must add two replacements. Design the key-to-node mapping so that the loss and the reshuffle are proportional to the change, not to the whole dataset, and explain exactly which keys move and where they move to.',
      inScope: [
        'Why modulo rehashing relocates almost everything',
        'Ring construction, clockwise ownership, and virtual nodes',
        'Join and leave behaviour, bounded load, and hot partitions',
        'Rendezvous and jump hashing, membership, and replication',
      ],
      outOfScope: [
        'Choosing a shard key from the access pattern (see sharding)',
        'Quorum reads and writes, and conflict resolution',
        'Layer 4 and layer 7 balancing decisions (see load balancer)',
        'Cryptographic properties of hash functions',
      ],
    },
    assumptions: [
      'The hash function distributes uniformly over a 32-bit or 64-bit space, so MurmurHash or xxHash rather than a cryptographic hash',
      'Every node computes the same ring from the same membership view, and views converge within seconds',
      'Keys are numerous relative to nodes: 400M keys over 20 nodes, so averages behave like averages',
    ],
    whenToUse: [
      'Distributing cache entries across a fleet where node count changes with traffic or failure',
      'Partitioning a storage cluster such as Cassandra or DynamoDB, where data movement is expensive',
      'Sticky routing at a proxy, so a session or a tenant keeps landing on the same backend',
    ],
    functionalRequirements: [
      { title: 'Map any key to an owner', detail: 'A deterministic function from key to node that every client computes identically without coordination.' },
      { title: 'Minimise movement on change', detail: 'Adding or removing one node relocates about 1/N of keys and no more.' },
      { title: 'Distribute evenly', detail: 'No node should own materially more of the space than its share, including after several failures.' },
      { title: 'Support replication', detail: 'Derive an ordered list of R distinct physical owners for a key, not just the first one.' },
    ],
    nonFunctionalRequirements: [
      { title: 'Lookup cost', detail: 'Under a microsecond and allocation-free, because it runs on every single request.' },
      { title: 'Weighting', detail: 'A machine with twice the memory should own roughly twice the keys, expressible without a rewrite.' },
      { title: 'Convergence', detail: 'All clients agree on the ring quickly; a split view sends the same key to two owners.' },
      { title: 'Bounded load', detail: 'A single hot node must be able to shed overflow rather than melt while neighbours idle.' },
    ],
    estimates: [
      { label: 'Modulo rehash, 4 → 5 nodes', value: '80% of keys move', note: 'Only 4 of the 20 residues mod 20 keep their owner' },
      { label: 'Consistent hashing, 4 → 5 nodes', value: '20% of keys move', note: '1/N, and only from the two ring neighbours' },
      { label: 'Virtual nodes per physical node', value: '128–256', note: 'Spread ≈ 1/√V, so about 6–9% instead of 2–3× with one token' },
      { label: 'Ring memory, 100 nodes', value: '≈ 2.4 MB', note: '100 × 256 tokens × ~96 B per sorted entry' },
      { label: 'Lookup by binary search', value: '≈ 15 comparisons', note: 'log₂(25,600) tokens; a few hundred nanoseconds' },
    ],
    concepts: [
      'Why the divisor N ruins modulo hashing',
      'The ring: one hash space for keys and nodes',
      'Clockwise successor as the owner',
      'Virtual nodes, spread, and weighting',
      'Bounded-load consistent hashing',
      'Rendezvous (highest random weight) hashing',
      'Jump consistent hash',
      'Gossip membership and preference lists',
    ],
    comparisons: [
      {
        title: 'Four ways to map keys to nodes',
        headers: ['Scheme', 'How it works', 'Use when', 'Avoid when'],
        rows: [
          [
            'Modulo (hash(key) % N)',
            'One division; the node count is baked into the function, so changing N changes almost every answer',
            'The node count is genuinely fixed, such as fanning work across a constant 8 threads',
            'Nodes can be added, removed, or fail — which is every distributed system',
          ],
          [
            'Consistent hashing (ring)',
            'Nodes and keys hash into one circular space; a key belongs to the first node clockwise. Virtual nodes give each machine many positions',
            'Large clusters with frequent membership change and expensive data movement — caches, Cassandra, Dynamo',
            'You need exact, provable balance, or the team cannot maintain the vnode machinery',
          ],
          [
            'Rendezvous / highest random weight',
            'For each key, compute hash(key, node) for every node and pick the highest score; the second highest is the natural replica',
            'Tens of nodes, heterogeneous weights, and you want minimal disruption with no ring to maintain',
            'Node counts in the thousands, where an O(N) hash per lookup becomes the cost',
          ],
          [
            'Jump consistent hash',
            'A short loop computes the bucket in O(log N) with no stored state and near-perfect balance',
            'A fixed, densely numbered bucket range that only grows or shrinks at the end',
            'You must remove an arbitrary node, weight nodes differently, or name nodes rather than number them',
          ],
        ],
        note: 'Rendezvous is easier to reason about and balances better than a small ring; consistent hashing wins once N is large enough that O(N) per lookup hurts.',
      },
      {
        title: 'What actually moves when membership changes',
        headers: ['Event', 'Modulo', 'Consistent hashing with vnodes'],
        rows: [
          ['Add the 5th node to 4', '≈ 80% of keys move, between arbitrary pairs of nodes', '≈ 20% move, drawn as small slices from all four existing nodes'],
          ['One node of 20 fails', 'Every key rehashes against 19; ≈ 95% move', '≈ 5% move; each vnode range shifts to its clockwise neighbour'],
          ['Replace a node with the same token set', 'Full reshuffle', 'Nothing moves logically; the replacement streams the same ranges back'],
          ['Double the cluster from 20 to 40', 'Essentially all keys move', '≈ 50% move, and each old node hands off to the new tokens interleaved with it'],
        ],
        note: 'With one token per node the moved range comes from a single neighbour, which overloads it. With 256 tokens the load is drawn from every node in small pieces.',
      },
    ],
    architecture:
      'Every node and every key hashes into the same 64-bit circular space, and a key is owned by the first node position encountered walking clockwise. Each physical machine claims 256 positions rather than one, so its share of the circle is the sum of many small arcs and the distribution converges to even. Membership propagates by gossip, every client builds an identical sorted token array, and a lookup is a binary search followed by a walk forward to collect R distinct physical owners for replication.',
    diagrams: [
      { id: 'ring', title: 'A key walks clockwise', kind: 'excalidraw', src: 'hash-ring' },
      { id: 'anim', title: 'Adding a node', kind: 'animation', src: 'hash-ring' },
    ],
    walkthrough: [
      {
        title: 'See the problem in the arithmetic',
        description:
          'With four cache nodes, a photo key lands on hash(key) mod 4. Add a fifth node and the owner becomes hash(key) mod 5, which agrees with the old answer only when the hash modulo 20 is less than 4 — four residues out of twenty, so 80% of keys move. Those keys are not merely reassigned; in a cache they are simply gone, so the hit rate collapses from 96% to about 19% and every miss becomes a database query.',
      },
      {
        title: 'Put nodes and keys in the same space',
        description:
          'Take a 64-bit hash space and treat it as a circle where the largest value wraps to zero. Hash each node identity, such as its host name and token index, to a position on that circle, and hash each key the same way. Nothing about the node count enters the function, which is the entire trick: the divisor is gone, so N can change without changing any hash.',
      },
      {
        title: 'Walk clockwise to find the owner',
        description:
          'A key is owned by the first node position at or after the key position, wrapping around at the top of the space. In practice the positions are held in a sorted array and the lookup is a binary search over 25,600 tokens, about fifteen comparisons. Every client runs the identical function on the identical membership view, so no coordinator is consulted on the read path.',
        animation: 'hash-ring',
      },
      {
        title: 'Give each machine 256 positions',
        description:
          'With one position per node, five random points divide a circle very unevenly and the largest arc is routinely two or three times the smallest. Claiming 128 to 256 virtual positions per machine makes each machine share the sum of many independent arcs, and the relative spread shrinks roughly as one over the square root of the count — about 6% at 256 tokens. Weighting falls out for free: give a machine with twice the memory twice the tokens.',
      },
      {
        title: 'Add a node and watch what moves',
        description:
          'A new machine hashes its 256 tokens into the circle, and each token claims the arc between itself and the previous position, taking those keys from whichever node owned that arc before. Only about 1/N of the total space changes hands, it comes in small slices from every existing node rather than from one unlucky neighbour, and no key that stays put is ever recomputed. Removal is the mirror image: each departing token arc merges into its clockwise successor.',
      },
      {
        title: 'Extend one owner into a replica set',
        description:
          'For durability the key needs R owners, so instead of stopping at the first node clockwise you keep walking and collect nodes until you have R distinct physical machines, skipping further tokens belonging to a machine already in the list. Real systems also skip nodes in the same rack or availability zone so that a single failure domain cannot hold every copy. That ordered list is the preference list, and it is the same on every client because the ring is.',
      },
    ],
    deepDives: [
      {
        title: 'Work out why modulo moves almost everything',
        body:
          'A key keeps its owner across a resize only when hash(key) mod 4 equals hash(key) mod 5. Because 4 and 5 are coprime, the pattern repeats every 20, so it is enough to check the twenty residues of hash modulo 20. Residues 0, 1, 2, and 3 satisfy the equality trivially; every one of the remaining sixteen fails. So exactly 20% of keys stay and 80% move, and the moved keys go to essentially arbitrary destinations rather than to one neighbour. The generalisation is worse than intuition suggests: going from N to N+1 keeps roughly 1/(N+1) of keys, so a 20-node cache losing one node relocates about 95% of its entries. For a cache that means a near-total cold start; for a database it means moving the whole dataset to add one machine.',
      },
      {
        title: 'Virtual nodes are about variance, not about elegance',
        body:
          'Dropping five points at random on a circle does not divide it into five equal arcs. The expected largest arc is far bigger than the average, and with a handful of nodes it is common to see one node holding two or three times its fair share, which in practice means one machine at 90% memory while another sits at 30%. Splitting each machine into V independent tokens makes its share the sum of V independent arcs, and the relative standard deviation falls approximately as 1/√V: about 30% at 10 tokens, 10% at 100, and 6% at 256. That is why Cassandra defaulted to 256 tokens for years. The costs are real but modest: a larger sorted array, more ranges to stream during a repair or rebuild, and a wider blast radius per node because each machine now neighbours almost every other machine.',
      },
      {
        title: 'Bounded-load consistent hashing puts a ceiling on a hot node',
        body:
          'Even a perfectly even key distribution does not give an even request distribution, because one key can be far hotter than the rest — a celebrity profile, a viral listing, a trending video. Standard consistent hashing has no opinion about this: the owner of that arc absorbs all of it. Bounded-load consistent hashing adds a capacity ceiling of (1 + ε) times the current average load per node. On assignment, if the clockwise successor is already at its ceiling, the algorithm keeps walking to the next node with spare capacity. With ε set to 0.25 no node exceeds 125% of average, and the amount of extra movement stays proportional to ε rather than to the cluster size. Google published this for load balancing across serving instances, and it is the standard fix when your keys are uniform but your traffic is not.',
      },
      {
        title: 'Rendezvous hashing: no ring at all',
        body:
          'For a key, compute a score hash(key, node) for every node in the cluster and pick the node with the highest score. That is the whole algorithm. It needs no sorted structure, no token assignment, and no vnode tuning, and it gives a naturally even distribution because each node wins an independent uniform share of keys. Removing a node moves only the keys it won, and those keys go to their own second-highest scorer, so the disruption is minimal by construction. The replica set is simply the top R scores, already ordered. Weighting is done by transforming the score, for example dividing the log of a normalised hash by the weight. The one cost is that lookups are O(N): a hundred nodes means a hundred hash computations, roughly a microsecond, which is fine for a hundred nodes and unacceptable for ten thousand. Below a few hundred nodes, rendezvous is usually the simpler and better-balanced choice.',
      },
      {
        title: 'Jump consistent hash trades flexibility for perfection',
        body:
          'Jump consistent hash maps a key to a bucket in the range 0 to N-1 using about a dozen lines of arithmetic, no memory, and O(log N) time, with a distribution so even it beats a vnode ring. It works by computing, from a seeded pseudo-random sequence, the last bucket count at which the key would have jumped to a new bucket. The catch is structural: buckets are dense integers and the algorithm only guarantees minimal movement when the count changes at the end. You can grow from N to N+1 or shrink from N to N-1, but you cannot remove bucket 3 out of 10 without renumbering, which means an arbitrary node failure is not expressible. There is also no weighting. It fits sharding a fixed logical range — 4,096 partitions later mapped to physical nodes by another layer — and does not fit a fleet where machines die by name.',
      },
      {
        title: 'The ring is only as good as the membership view',
        body:
          'Every client computing the same owner depends on every client holding the same node list. Gossip is the usual mechanism: each node periodically exchanges its view with a few random peers, and versioned entries mean the newest information wins, so a change reaches the whole cluster in O(log N) rounds — a few seconds for a hundred nodes. During that window two clients can disagree, and the same key will be written to two different owners, which is exactly the split-brain a quorum is designed to survive. This is why production systems separate failure detection from ring change: a node that stops responding is marked down and its reads are served from replicas immediately, but the tokens are not reassigned until an operator or a timer confirms the node is really gone. Otherwise a thirty-second network blip triggers a full rebalance, and the rebalance traffic causes the next timeout.',
      },
    ],
    tradeoffs: [
      'More virtual nodes give a smoother distribution and more ranges to stream, repair, and track.',
      'Rendezvous hashing is simpler and better balanced, and costs O(N) hash computations per lookup.',
      'Bounded load protects a hot node and moves more keys than the pure ring would.',
      'Reassigning tokens quickly after a failure restores balance and risks a rebalance storm on a transient blip.',
    ],
    bottlenecks: [
      'A single hot key, which the ring cannot split because ownership is per key.',
      'Streaming ranges during a join, which competes with live traffic for disk and network.',
      'A stale or split membership view sending the same key to two owners.',
      'Very large vnode counts inflating repair and rebuild bookkeeping across all pairs of nodes.',
    ],
    scalingPath: [
      { scale: 'Prototype', focus: 'Rendezvous hashing over a static node list in config; no ring, no gossip, correct behaviour on failure' },
      { scale: 'One region', focus: 'Token ring with 256 vnodes per machine, gossip membership, R distinct owners per key, bounded load on hot arcs' },
      { scale: 'Global', focus: 'Rack- and zone-aware preference lists, per-region rings, weighted tokens for heterogeneous hardware, throttled range streaming' },
    ],
    interviewScript: [
      '"Modulo is out immediately: going from four nodes to five moves 80% of keys, and at twenty nodes losing one moves 95%."',
      '"I hash keys and node tokens into the same 64-bit circle, and a key belongs to the first node clockwise."',
      '"Each machine claims 256 tokens, because five random points do not divide a circle evenly."',
      '"Adding a node then moves about 1/N of keys, taken in small slices from every node rather than from one neighbour."',
      '"Replication walks past the first owner to collect R distinct machines, skipping any in the same availability zone."',
      '"For a hot key the ring cannot help, so I add bounded load with an epsilon of 0.25, or replicate that key deliberately."',
    ],
    commonMistakes: [
      'Using one token per node and being surprised that load varies by two or three times.',
      'Believing consistent hashing balances requests; it balances key space, and a hot key still lands on one node.',
      'Reassigning tokens the instant a node misses a heartbeat, turning a blip into a rebalance storm.',
      'Collecting R replicas by walking to the next R tokens rather than the next R distinct physical machines.',
      'Reaching for jump consistent hash when arbitrary nodes must be removable or weighted.',
      'Using a cryptographic hash on the request path when a fast non-cryptographic hash is what is needed.',
    ],
    relatedTopics: ['sharding', 'load-balancer', 'caching', 'unique-ids', 'databases'],
    examples: [
      'Cassandra assigns each node 256 vnode tokens on a Murmur3 ring and derives replica sets by walking it',
      'DynamoDB inherits the Dynamo paper ring with virtual nodes and rack-aware preference lists',
      'Discord routes voice sessions with rendezvous hashing so a node failure moves only that node sessions',
    ],
    practicePrompt:
      'A 20-node cache loses one node at peak. Compute the fraction of keys that move under modulo and under a 256-vnode ring, and state what each does to the database read rate.',
    followUps: [
      {
        question: 'Show why hash % N moves 80% of keys when N goes from 4 to 5.',
        answer:
          'A key keeps its owner only if hash mod 4 equals hash mod 5. Since 4 and 5 are coprime the pattern repeats every 20, so check the residues modulo 20: only 0, 1, 2, and 3 satisfy the equality, and the other sixteen do not. That is 4 in 20 staying, so 80% move. The same reasoning gives roughly 1/(N+1) staying in general, which is why a 20-node cluster losing a node relocates about 95% of keys.',
        category: 'Fundamentals',
        difficulty: 'medium',
      },
      {
        question: 'Why do you need virtual nodes at all?',
        answer:
          'Because random points do not divide a circle evenly. With one token per node and a handful of nodes, one machine routinely owns two or three times its fair share, so it runs out of memory first while others idle. With V tokens per machine the share is a sum of V independent arcs and the relative spread falls roughly as 1/√V: about 30% at 10 tokens and 6% at 256. Vnodes also make weighting trivial, since a bigger machine simply gets more tokens.',
        category: 'Distribution',
        difficulty: 'easy',
      },
      {
        question: 'Exactly which keys move when a node joins?',
        answer:
          'For each token the new node claims, the keys in the arc between that token and the preceding position, which previously belonged to the node that owned that arc. Nothing else is touched, and no key that stays put is recomputed. Across all tokens that is about 1/N of the key space, and because the tokens are scattered the load is drawn in small slices from every existing node rather than from one neighbour.',
        category: 'Membership',
        difficulty: 'medium',
      },
      {
        question: 'Does consistent hashing solve hot keys?',
        answer:
          'No. It distributes the key space, not the traffic. If one celebrity profile receives 40% of reads, the single node owning that arc receives 40% of reads, and adding nodes does not help because ownership of one key cannot be split. The fixes are different in kind: replicate the hot key to several nodes and read from any of them, put it in a local in-process cache in front of the ring, or apply bounded-load consistent hashing so overflow spills to the next node with capacity.',
        category: 'Load',
        difficulty: 'hard',
      },
      {
        question: 'How does bounded-load consistent hashing work?',
        answer:
          'It sets a ceiling of (1 + ε) times the average load per node. When a key hashes to an arc whose owner is already at its ceiling, the algorithm continues clockwise to the next node with spare capacity. With ε at 0.25 no node exceeds 125% of average, and the extra key movement is proportional to ε rather than to the cluster size. It requires a load signal, so it fits proxies and serving fleets better than storage nodes, where ownership must be stable.',
        category: 'Load',
        difficulty: 'hard',
      },
      {
        question: 'When would you choose rendezvous hashing over the ring?',
        answer:
          'When the cluster is in the tens of nodes rather than the thousands. Rendezvous computes hash(key, node) for every node and picks the highest score, which needs no ring, no token tuning, and no gossip-maintained sorted structure, and it balances better than a ring with few tokens. Replicas are just the next highest scores, already ordered, and weighting is a transformation of the score. The only real objection is the O(N) cost per lookup, which becomes significant somewhere in the hundreds of nodes.',
        category: 'Alternatives',
        difficulty: 'medium',
      },
      {
        question: 'What are the limits of jump consistent hash?',
        answer:
          'It maps keys to dense integer buckets 0 to N-1 with no stored state, O(log N) time, and near-perfect balance, but it only guarantees minimal movement when the bucket count changes at the end. You cannot remove bucket 3 of 10 without renumbering, so an arbitrary node failure is not expressible, and it has no weighting. It fits a fixed logical partition space, such as 4,096 partitions later mapped to physical machines by a separate layer.',
        category: 'Alternatives',
        difficulty: 'hard',
      },
      {
        question: 'How do nodes agree on the ring?',
        answer:
          'Usually by gossip: each node periodically exchanges its versioned view of membership and tokens with a few random peers, so a change converges across the cluster in O(log N) rounds, a few seconds at a hundred nodes. During convergence two clients can disagree about an owner, which is one of the reasons quorum reads and writes exist. Production systems deliberately separate marking a node down, which is immediate, from reassigning its tokens, which is delayed.',
        category: 'Membership',
        difficulty: 'medium',
      },
      {
        question: 'How do you pick the R replicas for a key?',
        answer:
          'Walk clockwise from the key position and collect nodes until you have R distinct physical machines, skipping any further tokens that belong to a machine already chosen — otherwise with 256 vnodes you can easily land three copies on the same host. Rack- and zone-awareness extends the same walk: skip candidates in a failure domain already represented, so losing one zone never removes every copy. The resulting ordered preference list is identical on every client because it is derived from the same ring.',
        category: 'Replication',
        difficulty: 'medium',
      },
      {
        question: 'Why not reassign tokens immediately when a node stops responding?',
        answer:
          'Because most unresponsive nodes come back. Reassigning tokens triggers range streaming between machines, which consumes exactly the disk and network the cluster needs for live traffic, and that pressure makes further heartbeats time out, producing a cascading rebalance. The standard approach is to mark the node down and serve its reads from replicas immediately, buffer writes as hinted handoff, and only reassign ownership after a long timeout or an explicit operator decision.',
        category: 'Operations',
        difficulty: 'hard',
      },
    ],
  }),
};
