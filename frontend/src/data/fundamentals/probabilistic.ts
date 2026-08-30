import { ArchitectureTopic, emptyContent } from '../systemDesignTypes';

export const probabilisticTopic: ArchitectureTopic = {
  id: 'probabilistic',
  title: 'Probabilistic Data Structures',
  description: 'Bloom filters, Count-Min sketches, HyperLogLog, and Merkle trees: bounded memory and a known error rate instead of exact answers and linear growth.',
  difficulty: 'Intermediate',
  progress: 0,
  icon: 'Sparkles',
  color: 'bg-fuchsia-700',
  section: 'fundamentals',
  track: 'classic',
  prerequisites: ['caching'],
  estimatedMinutes: 65,
  order: 25,
  content: emptyContent({
    overview:
      'Probabilistic data structures trade exactness for size. Instead of storing the elements themselves and growing linearly, they store a fixed number of bits or counters and answer with a quantified error, which turns questions that needed gigabytes into questions that need kilobytes. The discipline is knowing which direction each structure can be wrong in, because a false positive that costs one extra disk read is fine and a false negative that loses a record is not.',
    whyItExists:
      'Exact answers to set membership, frequency, and distinct counting all require memory proportional to the data, which is impossible at billions of items per day. These structures make the memory constant and push the uncertainty into a tunable error rate.',
    problemStatement: {
      prompt:
        'A storage engine holds 200 sorted files per node and must avoid touching disk for keys that are not present. The same service must report the daily count of unique visitors and the top thousand hottest keys, using a few megabytes of memory. Design the structures and state their error behaviour.',
      inScope: [
        'Bloom filters, counting Bloom filters, and cuckoo filters',
        'Count-Min sketch for frequency and heavy hitters',
        'HyperLogLog for cardinality, including merging across shards',
        'Merkle trees for comparing replicas cheaply',
      ],
      outOfScope: [
        'Cryptographic hash design and collision resistance proofs',
        'Exact top-k algorithms over the full dataset',
        'Streaming windowing semantics, which the batch and stream lesson covers',
        'Approximate nearest neighbour and vector indexes',
      ],
    },
    assumptions: [
      'A fast non-cryptographic hash such as MurmurHash or xxHash is available and behaves close to uniformly',
      'The expected number of distinct items is known within an order of magnitude before sizing',
      'A bounded, well-understood error is acceptable to the product for the specific question asked',
    ],
    whenToUse: [
      'Avoiding an expensive lookup — a disk read, a network call — for keys that are almost certainly absent',
      'Counting distinct users or devices where a two percent error changes no decision',
      'Finding replicas that disagree without transferring or reading every row',
    ],
    functionalRequirements: [
      { title: 'Membership test', detail: 'Answer "have I seen this key" with no false negatives and a configured false positive rate.' },
      { title: 'Frequency estimate', detail: 'Answer "roughly how many times has this key appeared" and surface the heaviest keys.' },
      { title: 'Cardinality estimate', detail: 'Answer "how many distinct items" for a stream far larger than memory.' },
      { title: 'Divergence detection', detail: 'Identify which ranges of two replicas differ, without comparing every row.' },
    ],
    nonFunctionalRequirements: [
      { title: 'Fixed memory', detail: 'Footprint set at construction time and independent of how many items arrive after that.' },
      { title: 'Constant time operations', detail: 'Insert and query cost k hash computations and k memory probes, with no data-dependent growth.' },
      { title: 'Known error direction', detail: 'Documented so callers can rely on it: Bloom never says no wrongly, Count-Min never under-counts.' },
      { title: 'Mergeability', detail: 'Per-shard structures combinable into a global answer without re-reading the source data.' },
    ],
    estimates: [
      { label: 'Bloom filter for 100M keys at 1%', value: '10 bits/key = 125 MB', note: 'An exact hash set of 100M 32-byte keys costs well over 4 GB' },
      { label: 'Bloom false positive rate', value: 'm/n = 10, k = 7 → p ≈ 0.82%', note: 'From p ≈ (1 - e^(-kn/m))^k' },
      { label: 'HyperLogLog', value: '12 KB for billions of distinct items', note: '16,384 registers of 6 bits, standard error 0.81%, so answers land inside about 2%' },
      { label: 'Count-Min sketch', value: 'd = 5, w = 2,000, 4-byte counters = 40 KB', note: 'Enough to find the top thousand keys out of tens of millions' },
      { label: 'Merkle comparison', value: '1M rows → about 20 levels, tens of hashes', note: 'Log-scale descent instead of one million row comparisons' },
    ],
    concepts: [
      'Approximation for bounded memory',
      'm bits, k hashes, n items',
      'False positive versus false negative',
      'Counting Bloom and cuckoo filters',
      'Count-Min: take the minimum',
      'HyperLogLog leading zeros',
      'Mergeable sketches across shards',
      'Merkle root and subtree descent',
    ],
    comparisons: [
      {
        title: 'Which structure answers which question',
        headers: ['Structure', 'What it answers', 'Memory', 'Error mode'],
        rows: [
          [
            'Bloom filter',
            'Is this key possibly in the set, or definitely not',
            'About 10 bits per key for 1% error',
            'False positives only; never a false negative',
          ],
          [
            'Counting Bloom filter',
            'The same question, with support for removal',
            '4 bits per counter, so roughly 4x a plain Bloom',
            'False positives, plus counter overflow if sized too small',
          ],
          [
            'Cuckoo filter',
            'Membership with deletion and better locality',
            'Comparable to Bloom below about 3% error, better above it',
            'False positives; insert can fail once the table is nearly full',
          ],
          [
            'Count-Min sketch',
            'Roughly how often has this key appeared, and which are the heaviest',
            'd x w counters, typically tens of kilobytes',
            'Over-counts from collisions; never under-counts',
          ],
          [
            'HyperLogLog',
            'How many distinct items has this stream contained',
            '12 KB regardless of cardinality',
            'Symmetric relative error of about 1%, either direction',
          ],
          [
            'Merkle tree',
            'Which ranges of two datasets differ',
            'One hash per node, so about 2n hashes for n leaves',
            'Exact for detection; a collision is cryptographically negligible',
          ],
        ],
        note: 'Choose by the error you can tolerate and its direction, not by memory alone.',
      },
    ],
    architecture:
      'Each structure is a fixed-size array plus a small family of hash functions, held in memory beside the data it describes. A Bloom filter sits in front of each on-disk file so a lookup for an absent key returns without any I/O; a Count-Min sketch and a HyperLogLog register array sit in the ingest path and are updated per event; a Merkle tree is built over token ranges so two replicas can compare a single root hash before descending into anything. Because all of them are mergeable or comparable, per-shard instances combine into a global answer without re-reading the source.',
    diagrams: [
      { id: 'bits', title: 'A Bloom filter never misses, but it lies', kind: 'excalidraw', src: 'bloom-bits' },
      { id: 'merkle', title: 'Compare hashes, not rows', kind: 'excalidraw', src: 'merkle-shards' },
    ],
    walkthrough: [
      {
        title: 'Name the trade before choosing a structure',
        description:
          'An exact answer to "is this key present" requires storing the keys, which is memory proportional to the data: a hundred million thirty-two byte keys is over four gigabytes with hash table overhead. The probabilistic version stores no keys at all, only bits set by hashing them, which fixes memory at construction time. You are buying a constant footprint with a small chance of a wrong answer, and the design work is confining that wrongness to a direction that costs you nothing serious.',
      },
      {
        title: 'Insert into a Bloom filter',
        description:
          'A Bloom filter is an array of m bits, all zero, plus k independent hash functions. To insert a key, hash it k times, reduce each hash modulo m, and set those k bits to one; nothing else is stored, so the key itself is unrecoverable. Inserting the same key twice is a no-op, and bits set by different keys overlap freely, which is exactly where the error comes from.',
      },
      {
        title: 'Query, and understand which way it can lie',
        description:
          'To test a key, hash it k times and read those k bits. If any bit is zero the key was definitely never inserted, because insertion would have set it — so there are no false negatives, ever. If all k bits are one the key is probably present, but the bits may have been set by k other keys collectively, which is a false positive. For an SSTable lookup that means a wasted disk read, not a wrong result, because the file itself is then consulted for the truth.',
      },
      {
        title: 'Size it from the formula',
        description:
          'The false positive probability is approximately p = (1 - e^(-kn/m))^k for n inserted items, and the optimal number of hashes is k = (m/n) ln 2. The practical rule that follows is about ten bits per key with k = 7, which gives roughly 0.82% error; fifteen bits per key with k = 10 gives about 0.046%. Note that n is the number of items you will insert, so a filter sized for a million keys and fed ten million degrades to a structure that answers yes to everything.',
      },
      {
        title: 'Handle deletion, which a plain Bloom cannot',
        description:
          'You cannot clear the bits for a removed key, because any one of them may also be the last remaining evidence of a different key, and clearing it would create a false negative. A counting Bloom filter replaces each bit with a small counter, usually four bits, incremented on insert and decremented on delete, at roughly four times the memory. A cuckoo filter stores short fingerprints in a cuckoo hash table instead, supporting genuine deletion with better cache locality and comparable size at low error rates.',
      },
      {
        title: 'Count frequency and cardinality with sketches',
        description:
          'A Count-Min sketch is d rows of w counters with one hash per row: increment one counter per row on each event, and estimate a key frequency as the minimum of its d counters, since collisions can only inflate a counter and the minimum is the least polluted. HyperLogLog answers the different question of how many distinct items appeared, using 12 kilobytes for any cardinality, and both structures merge across shards — Count-Min by summing counters, HyperLogLog by taking the per-register maximum.',
      },
    ],
    deepDives: [
      {
        title: 'Bloom filter sizing, worked through',
        body:
          'Given a target error rate you solve for the bits, not the other way around. With m bits and n items, each insert sets k bits, so after n inserts the probability that a particular bit is still zero is (1 - 1/m)^(kn), which approximates to e^(-kn/m). A false positive needs all k probed bits to be one, giving p ≈ (1 - e^(-kn/m))^k. Minimising over k yields k = (m/n) ln 2, and substituting back gives m/n ≈ -1.44 log2(p). So one percent error needs about 9.6 bits per key with k = 7, and 0.1% needs about 14.4 bits with k = 10. For a hundred million keys that is 125 megabytes at one percent — comfortably in memory, against more than four gigabytes for the exact set.',
      },
      {
        title: 'Why deletion is impossible, and the two escapes',
        body:
          'The bits in a Bloom filter are shared. If the key photo-991 set bits 12, 4001, and 88117, some of those bits are probably also the only evidence that user-33 was inserted. Clearing them on delete would make a subsequent query for user-33 return a definite no, which breaks the one guarantee the structure offers. A counting Bloom filter replaces each bit with a four-bit counter so deletes decrement rather than clear, costing four times the memory and introducing a saturation bug if any counter would exceed fifteen. A cuckoo filter instead stores an eight-to-sixteen-bit fingerprint of each key in a bucketed cuckoo hash table; a delete removes the matching fingerprint, which is safe because the fingerprint identifies the entry rather than being shared. Cuckoo filters are also more cache-friendly, probing two buckets rather than k scattered bits.',
      },
      {
        title: 'Count-Min sketch and why the minimum is right',
        body:
          'A Count-Min sketch is a d-by-w matrix of counters with one independent hash per row. On each event you hash the key once per row and increment the selected counter, so a stream of a billion events costs d increments each. To query, read the d counters for that key and return the smallest. Every one of them contains the true count plus whatever other keys collided in that cell, so each is an over-estimate, and the minimum is the estimate with the least contamination — which is why the structure can over-count but never under-count. With d = 5 and w = 2,000 in four-byte counters, 40 kilobytes tracks heavy hitters across tens of millions of distinct keys, because a genuinely hot key is hot in every row while a cold key is only inflated by collisions in one.',
      },
      {
        title: 'HyperLogLog and the leading-zero trick',
        body:
          'Cardinality estimation exploits a property of uniform hashes: if you hash every item, seeing a hash whose binary form starts with a run of exactly p zeros suggests you have seen on the order of 2^p distinct values, because such a hash appears with probability 2^-(p+1). One observation is far too noisy, so HyperLogLog splits the hash — the first 14 bits select one of 16,384 registers, and the remainder contributes its leading-zero count — and each register keeps the maximum it has seen. The final estimate is a bias-corrected harmonic mean across registers, which suppresses the effect of one lucky outlier. Those 16,384 six-bit registers are 12 kilobytes and give a standard error of 0.81% for cardinalities up to the billions. The property that matters operationally is mergeability: the union of two HLLs is the element-wise maximum of their registers, so per-shard and per-hour sketches combine exactly, with no double counting.',
      },
      {
        title: 'Merkle trees for anti-entropy',
        body:
          'To find out whether two replicas of a million-row range agree, you could read and compare every row, which costs a full scan on both sides and the network to move it. A Merkle tree instead hashes each leaf partition of the range, hashes each pair of children into a parent, and repeats up to a single root. Comparing roots is one hash comparison: equal means the entire range matches, and no further work happens, which is the common case. If they differ, each side sends the two child hashes, and only the differing subtree is descended, so locating one divergent row in a million-row range takes about twenty levels and a few dozen hash comparisons instead of a million row comparisons. Cassandra repair works exactly this way, and the cost is that the tree must be built by reading the data, so the saving is on the comparison and the transfer rather than on the initial hash.',
      },
      {
        title: 'Where these actually sit in a real system',
        body:
          'The clearest win is an LSM storage engine. A read may have to consult many sorted files on disk, and most of them do not contain the key, so each file carries an in-memory Bloom filter sized at about ten bits per key. A negative answer costs a handful of memory probes and skips the file entirely, turning a lookup for a missing key from several disk seeks into no disk I/O at all, and the one percent false positive rate costs only a wasted read. Elsewhere in the same system, HyperLogLog gives daily unique visitor counts from 12 kilobytes per day per dimension, small enough to keep years of history; a Count-Min sketch identifies the hot keys that need dedicated cache capacity or rate limiting; and Merkle trees drive replica repair. The pattern is consistent — each one replaces an expensive exact operation on a path where a small, one-directional error is harmless.',
      },
    ],
    tradeoffs: [
      'A lower error rate costs more bits per key, roughly 1.44 log2(1/p), so each extra decimal place is about 4.8 bits.',
      'Bloom filters are smaller and cannot delete; cuckoo filters delete and can fail to insert when nearly full.',
      'Count-Min is tiny and biased upward, so it is safe for detecting hot keys and unsafe for billing.',
      'Merkle trees make comparison cheap and require reading the data to build the tree in the first place.',
    ],
    bottlenecks: [
      'A Bloom filter fed far more keys than it was sized for, saturating until every answer is yes.',
      'Filter memory itself: 200 files per node with 125 MB filters does not fit, so per-file sizing matters.',
      'Hash computation on the hot path when k is large and the hash is not cheap.',
      'Rebuilding Merkle trees during repair competing with live traffic for disk reads.',
    ],
    scalingPath: [
      { scale: 'Prototype', focus: 'An exact hash set or SQL COUNT DISTINCT — correct, simple, and fine below a few million items' },
      { scale: 'One region', focus: 'Bloom filters on every SSTable, HyperLogLog for unique counts, Count-Min to find hot keys' },
      { scale: 'Global', focus: 'Per-shard sketches merged centrally, per-day HLL retained for years, Merkle-based repair between regions' },
    ],
    interviewScript: [
      '"I am trading an exact answer for constant memory, and I need the error to point in a harmless direction."',
      '"A Bloom filter is m bits and k hashes; any zero bit proves absence, so there are no false negatives."',
      '"Ten bits per key with seven hashes gives me about 0.8% false positives, so 100 million keys costs 125 megabytes."',
      '"Each SSTable gets a filter, so a lookup for a missing key does no disk I/O at all."',
      '"You cannot delete from a plain Bloom filter, so if I need removal I use a counting Bloom or a cuckoo filter."',
      '"Unique visitors go into HyperLogLog — 12 kilobytes per day, and shard sketches merge by taking register maxima."',
    ],
    commonMistakes: [
      'Claiming a Bloom filter can produce false negatives, or treating a positive as proof of presence.',
      'Sizing a filter for the current item count and never resizing as the dataset grows.',
      'Deleting from a plain Bloom filter by clearing bits, which silently creates false negatives.',
      'Using a Count-Min estimate as a billable count when it structurally over-counts.',
      'Trying to average HyperLogLog estimates across shards instead of merging registers, which double counts overlaps.',
      'Reusing one hash function with different seeds without checking that the results are effectively independent.',
    ],
    relatedTopics: ['caching', 'databases', 'replication', 'unique-ids'],
    examples: [
      'RocksDB and Cassandra attach a Bloom filter to every SSTable so a missing key costs no disk seek',
      'Redis PFADD and PFCOUNT expose HyperLogLog directly, using 12 KB per key for unique counting',
      'Cassandra nodetool repair builds Merkle trees per token range and streams only the differing subranges',
    ],
    practicePrompt:
      'Size a Bloom filter for 50 million cache keys at a 0.1% false positive rate, and state the memory it needs and the number of hash functions.',
    followUps: [
      {
        question: 'Can a Bloom filter produce a false negative?',
        answer:
          'No, and that is the whole point. Insertion only ever sets bits to one, so if any of the k probed bits is zero, the key cannot have been inserted. The asymmetry is what makes it usable as a pre-filter in front of an authoritative store: a definite no can be trusted and returned immediately, while a maybe is resolved by consulting the real data.',
        category: 'Bloom',
        difficulty: 'easy',
      },
      {
        question: 'How do you pick m and k?',
        answer:
          'Start from the target error rate p and the expected item count n. The bits per key follow from m/n ≈ 1.44 log2(1/p), so 1% needs about 9.6 bits and 0.1% about 14.4. The optimal hash count is k = (m/n) ln 2, giving k = 7 and k = 10 respectively. Under-provisioning n is the dangerous mistake, because the error rate rises steeply once the bit array saturates.',
        category: 'Bloom',
        difficulty: 'medium',
      },
      {
        question: 'Why can you not delete from a Bloom filter?',
        answer:
          'Because bits are shared between keys. Clearing the k bits for a removed key may clear the only bit that proved a different key was present, which would turn a later query into a definite no — a false negative, the one error the structure promises never to make. If you need deletion, use a counting Bloom filter with small per-slot counters, or a cuckoo filter that stores per-entry fingerprints it can remove individually.',
        category: 'Bloom',
        difficulty: 'medium',
      },
      {
        question: 'Why does Count-Min take the minimum?',
        answer:
          'Each of the d rows gives the true count for a key plus the counts of any other keys that collided in the same cell, so every row is an over-estimate. The smallest of them is the one with the least collision contamination, making it the tightest available upper bound. This structure therefore over-counts and never under-counts, which is exactly what you want for detecting heavy hitters and exactly what you do not want for billing.',
        category: 'Count-Min',
        difficulty: 'medium',
      },
      {
        question: 'How does HyperLogLog work in one paragraph?',
        answer:
          'Hash each item and look at the run of leading zeros in the hash. A run of p zeros occurs with probability 2^-(p+1), so the longest run observed is evidence of roughly 2^p distinct items. To reduce variance, the first 14 bits of the hash select one of 16,384 registers and each register keeps the maximum run it has seen; the estimate is a bias-corrected harmonic mean across registers, giving 0.81% standard error from 12 kilobytes.',
        category: 'HyperLogLog',
        difficulty: 'hard',
      },
      {
        question: 'Why is mergeability so valuable?',
        answer:
          'It lets each shard or each time bucket maintain its own sketch independently, then combine them without touching the raw data. Two HyperLogLogs merge into their element-wise register maximum, which naturally deduplicates items counted in both, and Count-Min sketches merge by summing counters. Averaging estimates instead would double count anything present in more than one shard, which is precisely the error merging avoids.',
        category: 'HyperLogLog',
        difficulty: 'medium',
      },
      {
        question: 'When is a cuckoo filter better than a Bloom filter?',
        answer:
          'When you need deletion, or when the target error rate is below roughly three percent, where a cuckoo filter uses less space than a Bloom filter for the same accuracy. It also probes only two buckets rather than k scattered bit positions, so it is friendlier to CPU caches on lookup. The costs are a more complex implementation and the possibility that an insert fails once the table load factor approaches its limit.',
        category: 'Filters',
        difficulty: 'hard',
      },
      {
        question: 'How does a Merkle tree make repair cheap?',
        answer:
          'Each side hashes leaf partitions of a range, then hashes pairs upward to a single root. Comparing the two roots is one comparison, and if they match the entire range is known to agree with no further work — the common case. If they differ, both sides exchange child hashes and descend only into the mismatching subtree, so finding one divergent row among a million takes about twenty levels and a few dozen comparisons instead of a full scan.',
        category: 'Merkle',
        difficulty: 'medium',
      },
      {
        question: 'Where exactly does an SSTable Bloom filter save work?',
        answer:
          'A read in an LSM engine may have to check many immutable sorted files, and for most of them the key is absent. Each file keeps an in-memory Bloom filter of its keys, so a negative answer costs a few memory probes and the file is skipped entirely, turning a point lookup for a missing key from several disk seeks into zero. The one percent of positives that are false cost one unnecessary read, which is a good trade against the seeks avoided.',
        category: 'Practice',
        difficulty: 'medium',
      },
      {
        question: 'What happens when a Bloom filter is over-filled?',
        answer:
          'The bit array saturates and the false positive rate climbs toward one hundred percent, at which point the filter answers maybe for everything and provides no benefit while still consuming memory and CPU. The failure is silent — nothing errors, the system just gets slower — so the fill ratio should be a monitored metric. The fixes are to size for the eventual n, or to use a scalable Bloom filter that chains progressively larger filters as it fills.',
        category: 'Operations',
        difficulty: 'hard',
      },
    ],
  }),
};
