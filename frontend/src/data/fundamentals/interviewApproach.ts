import { ArchitectureTopic, emptyContent } from '../systemDesignTypes';

export const interviewApproachTopic: ArchitectureTopic = {
  id: 'interview-approach',
  title: 'How to Approach a System Design Interview',
  description: 'A repeatable 45-minute method: clarify, estimate, design boring-first, then scale and trade off out loud.',
  difficulty: 'Beginner',
  progress: 0,
  icon: 'Target',
  color: 'bg-slate-600',
  section: 'fundamentals',
  track: 'classic',
  prerequisites: [],
  estimatedMinutes: 45,
  order: 0,
  content: emptyContent({
    overview:
      'Most weak interviews fail on process, not knowledge. The interviewer is watching how you scope an open problem, justify decisions with numbers, and change your mind when the numbers change.',
    whyItExists:
      'Without a method you start drawing boxes, discover a missing requirement at minute 30, and never reach the interesting part of the problem.',
    problemStatement: {
      prompt:
        'You get one sentence — "design a URL shortener" — and 45 minutes. You have to turn that into a scoped problem, a working design, and at least one deep dive, while narrating your reasoning the whole time.',
      inScope: [
        'A repeatable phase structure with a time budget',
        'Back-of-envelope estimation you can do in your head',
        'How to choose which part to go deep on',
        'What to say when you are stuck or contradicted',
      ],
      outOfScope: [
        'Memorising specific technologies',
        'Coding or algorithm rounds',
        'Behavioural and team-fit questions',
        'Company-specific rubrics',
      ],
    },
    assumptions: [
      'A 45-minute round with a shared drawing surface',
      'The interviewer will interrupt and redirect; that is a signal, not a failure',
      'One or two deep dives are expected, not full coverage',
    ],
    whenToUse: [
      'Any open-ended prompt of the form "design X"',
      'When the interviewer stays quiet and you have to drive',
      'When you feel the urge to start drawing immediately',
    ],
    functionalRequirements: [
      { title: 'Clarify the user and the flow', detail: 'Who does what, how often, and what is explicitly out of scope.' },
      { title: 'Produce one working v1', detail: 'An end-to-end path that would actually serve a real request.' },
      { title: 'Go deep on the bottleneck', detail: 'Pick the part the numbers say is hard, not the part you like.' },
      { title: 'Close with failure modes', detail: 'What breaks first, how it degrades, what you would build next.' },
    ],
    nonFunctionalRequirements: [
      { title: 'Latency', detail: 'State p50 and p99 separately, and read path separately from write path.' },
      { title: 'Consistency', detail: 'Read-your-writes? Global ordering? Or is eventual fine?' },
      { title: 'Availability', detail: 'Can writes be down if reads stay up? What is the blast radius?' },
      { title: 'Cost', detail: 'A design that needs 400 machines for 1,000 users is a wrong answer.' },
    ],
    estimates: [
      { label: 'Time budget', value: '45 min', note: '5 clarify, 5 estimate, 15 design, 15 deep dive, 5 close' },
      { label: 'DAU to QPS', value: '1M DAU ≈ 10–20 QPS average', note: 'Assumes roughly one action per user per day' },
      { label: 'Peak multiplier', value: '5–10× average', note: 'Design the hot path for peak, not for the mean' },
      { label: 'Row size', value: '100 B – 4 KB', note: '1B rows ≈ 0.1–4 TB before indexes' },
      { label: 'Round numbers', value: '86,400 s/day ≈ 100k', note: 'Divide daily volume by 100k for a rough QPS' },
    ],
    concepts: [
      'Functional vs non-functional requirements',
      'Back-of-envelope estimation',
      'Boring-correct design first',
      'Read path vs write path',
      'Deep dive on the bottleneck',
      'Failure modes and graceful degradation',
      'Evolution: v1 to v2 to v3',
    ],
    comparisons: [
      {
        title: 'The five phases and what each one is worth',
        headers: ['Phase', 'What you do', 'Signal it sends', 'Failure mode'],
        rows: [
          [
            'Clarify (5 min)',
            'Restate the prompt, list 4–6 flows, ask what to cut',
            'You do not build unrequested features',
            'Designing an unbounded product',
          ],
          [
            'Estimate (5 min)',
            'QPS, storage, bandwidth, fan-out',
            'Your components are justified by numbers',
            'Adding a cache "because caches are fast"',
          ],
          [
            'Design v1 (15 min)',
            'One request path end to end',
            'You can build something that works',
            'A microservice diagram with no data flow',
          ],
          [
            'Deep dive (15 min)',
            'Two hard parts, chosen by the estimates',
            'You have real depth somewhere',
            'Shallow coverage of eight boxes',
          ],
          ['Close (5 min)', 'Bottleneck, failure, next quarter', 'You think past the happy path', 'Running out of time silently'],
        ],
      },
      {
        title: 'Estimation shortcuts worth memorising',
        headers: ['Quantity', 'Shortcut', 'Example'],
        rows: [
          ['Seconds per day', '≈ 100,000', '10M requests/day ≈ 100 QPS'],
          ['Reads vs writes', 'Social: 100:1, commerce: 10:1', '100 QPS writes implies 10k QPS reads'],
          ['Storage per year', 'rows/day × size × 365', '1M posts/day × 1 KB ≈ 365 GB/year'],
          ['Bandwidth', 'QPS × payload', '1k QPS × 200 KB image ≈ 200 MB/s ≈ 1.6 Gbps'],
          ['Cache size', 'hot fraction × row size', '10% of 100M × 1 KB ≈ 10 GB'],
        ],
      },
    ],
    architecture:
      'Treat the interview as a conversation about a single request path, not a catalogue of technologies. Draw the path once, then make it faster, then make it survive failure.',
    diagrams: [{ id: 'clock', title: 'The 45-minute budget', kind: 'excalidraw', src: 'interview-clock' }],
    walkthrough: [
      {
        title: 'Restate and scope',
        description:
          'One sentence back, then 4–6 functional bullets, then ask what to cut. "Shorten a URL, redirect fast, basic analytics. Do we need custom aliases and expiry?" You just eliminated 10 minutes of wasted design.',
      },
      {
        title: 'Estimate before boxes',
        description:
          '100M new links per month is 40 writes/s. Redirects at 100:1 is 4,000 reads/s. 100M × 500 B ≈ 50 GB a month. Now a cache is a justified decision instead of decoration.',
      },
      {
        title: 'Draw a boring v1',
        description:
          'Client, API, one Postgres table, one cache. Say out loud that this handles 10k users. A design that obviously works is a much stronger starting point than a half-drawn distributed system.',
      },
      {
        title: 'Scale the hot path only',
        description:
          '4,000 redirects/s all read the same short codes, so add a read-through cache and a CDN for the 301. Writes are only 40/s, so the single primary stays. Do not shard.',
      },
      {
        title: 'Deep dive where the numbers point',
        description:
          'Here the interesting parts are key generation without collisions and cache invalidation on delete. Pick two and go three levels down: data structure, failure case, and what you would monitor.',
      },
      {
        title: 'Close with failure',
        description:
          '"If Redis dies we fall back to Postgres and the p99 goes from 5ms to 40ms; we survive. If Postgres dies, redirects still work from cache but new links fail." That is the sentence that ends a strong interview.',
      },
    ],
    deepDives: [
      {
        title: 'Choosing what to go deep on',
        body:
          'Let the estimates choose. If reads outnumber writes 100:1, the deep dive is the read path: cache strategy, key design, invalidation. If writes are heavy and must be correct — payments, bookings — the deep dive is concurrency and idempotency. If the fan-out is huge, it is the queue and the worker pool. Announce the choice: "reads dominate by two orders of magnitude, so I want to spend our remaining time on the read path." That single sentence shows you can prioritise, which is most of what the interviewer is grading.',
      },
      {
        title: 'How to disagree with an interviewer',
        body:
          'When they push back, they are usually testing whether you hold an opinion under pressure or fold immediately. Neither extreme scores well. Name the trade-off instead: "You are right that Cassandra would scale writes better. I chose Postgres because bookings need a transaction across two tables, and at 40 writes per second we are nowhere near the limit. If writes reached 50,000 per second I would move the booking log to Cassandra and keep the ledger in Postgres." You conceded the fact, kept the decision, and gave the condition that would change it.',
      },
      {
        title: 'Recovering when you are lost',
        body:
          'Two things save a stalling interview. First, go back to the request path: "let me trace one redirect from the phone to the database and back" — concrete tracing restarts stalled reasoning. Second, ask a scoping question: "would you rather I go deeper on the storage layer or on how this behaves during a region failure?" You are allowed to ask which direction is more interesting. Silence is the only real mistake; thinking out loud, even imperfectly, is the thing being evaluated.',
      },
      {
        title: 'The numbers you should never have to derive',
        body:
          'Memory read is roughly 100 nanoseconds, an SSD read is around 100 microseconds, a same-region network round trip is about 0.5 milliseconds, and a cross-continent round trip is 80–150 milliseconds. One machine handles a few thousand simple requests per second. A single Postgres primary does low thousands of simple writes per second. A modern SSD gives hundreds of megabytes per second. Knowing these means you can say "that is three cross-region hops, so 300 milliseconds minimum" without pausing, and that fluency is what separates a senior answer from a memorised one.',
      },
      {
        title: 'Writing APIs at the right moment',
        body:
          'Do not open with endpoints. Requirements and estimates first, then the data model, then the API almost writes itself. When you do write it, include the unglamorous parts: pagination as a cursor rather than an offset, an idempotency key on anything that charges money, and the error catalogue. Two well-specified endpoints beat twelve one-liners. If the interviewer never asks for the API, a two-line sketch is enough — spending ten minutes on request bodies is a common way to run out of clock.',
      },
    ],
    tradeoffs: [
      'Depth beats breadth: two excellent deep dives outscore eight labelled boxes.',
      'Boring first: "I would start with Postgres" plus the condition to leave it is a strong answer.',
      'Narrate uncertainty rather than hiding it; unstated assumptions read as ignorance.',
      'Time spent on APIs early is time stolen from the deep dive.',
    ],
    bottlenecks: [
      'Designing every microservice and running out of clock.',
      'Never stating a number, which makes every component look arbitrary.',
      'Answering a question you were not asked because you rehearsed it.',
      'Freezing when the interviewer challenges a choice.',
    ],
    scalingPath: [
      { scale: 'Minute 0–10', focus: 'Scope and arithmetic' },
      { scale: 'Minute 10–25', focus: 'One end-to-end design that works' },
      { scale: 'Minute 25–45', focus: 'Two deep dives and failure modes' },
    ],
    interviewScript: [
      '"Let me restate the core use cases and confirm what is out of scope."',
      '"I will estimate QPS and storage first, so we know whether sharding is even on the table."',
      '"Here is the boring version that works for 10,000 users. Now let me find what breaks."',
      '"Reads dominate by 100 to 1, so I want to spend our time on the read path."',
      '"I am choosing Postgres because these two writes must be atomic. I would revisit that above 50,000 writes per second."',
      '"If the cache dies, we degrade to 40 millisecond reads instead of failing. If the primary dies, reads survive and writes stop."',
      '"Next quarter I would add read replicas per region and move analytics off the primary."',
    ],
    commonMistakes: [
      'Jumping to boxes before requirements are agreed.',
      'Listing technologies instead of matching access patterns.',
      'Ignoring the difference between the read path and the write path.',
      'Never mentioning consistency at all.',
      'Adding Kafka, Kubernetes, and a service mesh to a problem with 40 writes per second.',
      'Going silent while thinking.',
    ],
    relatedTopics: ['dns', 'databases', 'caching', 'load-balancer'],
    examples: [
      'Design a URL shortener — the canonical warm-up, read-heavy with a key-generation twist',
      'Design Twitter — fan-out on write versus read, the classic depth question',
      'Design Uber — geospatial indexing plus matching under real-time constraints',
    ],
    practicePrompt:
      'Time-box ten minutes and design a URL shortener out loud using only this framework. Say every number before you draw the box it justifies.',
    followUps: [
      {
        question: 'The interviewer says nothing for five minutes. What do you do?',
        answer:
          'Keep narrating and force checkpoints. Finish the current phase, then ask a closed question: "I am assuming we do not need custom aliases in v1 — is that fair?" Closed questions are easier to answer than "any thoughts?" and they surface hidden requirements. Silence usually means they are letting you drive, not that you are wrong.',
        category: 'Process',
        difficulty: 'easy',
      },
      {
        question: 'At minute 35 you still have no diagram. How do you recover?',
        answer:
          'Stop designing and draw the simplest working path in 90 seconds: client, API, database, cache. Then say "this is v1; the interesting problem is X" and spend the remaining time there. A simple diagram plus one deep dive is a pass. An unfinished sophisticated design is not.',
        category: 'Process',
        difficulty: 'medium',
      },
      {
        question: 'They cut your favourite feature from scope. How should you react?',
        answer:
          'Accept immediately and reallocate the time. "Dropping analytics means we do not need the event pipeline, so I will spend that time on redirect latency instead." Fighting for scope wastes clock and reads as inflexibility. The scope cut is usually a hint about where they want depth.',
        category: 'Process',
        difficulty: 'easy',
      },
      {
        question: 'How do you estimate when you have no idea of the real numbers?',
        answer:
          'State an assumption, make it round, and move on: "I will assume 100 million daily actives and one action per user per day." The interviewer will correct you if it matters. Being off by 2× is fine; being off by 1,000× changes the design, so sanity-check the order of magnitude against something you know.',
        category: 'Estimation',
        difficulty: 'medium',
      },
      {
        question: 'The interviewer asks for a technology you have never used.',
        answer:
          'Say so, then reason from the category. "I have not run Cassandra in production, but it is a wide-column LSM store, so writes are cheap appends, reads need the partition key, and secondary indexes are weak. That fits the write pattern here." Honesty plus category-level reasoning scores far better than bluffing detail you do not have.',
        category: 'Process',
        difficulty: 'medium',
      },
      {
        question: 'How much detail belongs in the data model?',
        answer:
          'Enough to make the access pattern obvious: table name, primary key, the columns you query by, and the indexes. Skip nullability and exact varchar lengths. The primary key and the indexes are the part being graded, because they encode whether your queries are single-lookup or full scans.',
        category: 'Design',
        difficulty: 'easy',
      },
      {
        question: 'When should you propose microservices?',
        answer:
          'Almost never unprompted in a 45-minute round. Propose service boundaries only when they follow from a real constraint: a different scaling profile, a different team, or a different consistency requirement. "The transcoding workers scale independently of the API, so they are a separate deployment" is a reason. "Microservices are modern" is not.',
        category: 'Design',
        difficulty: 'medium',
      },
      {
        question: 'You realise at minute 30 that your data model is wrong. Do you fix it?',
        answer:
          'Say it out loud and fix it if the fix is small. "My shard key was created_at, which puts all of today on one shard. I should shard by host_id instead." Catching your own mistake is a positive signal — self-correction is exactly what senior engineers do in design reviews. Only leave it if fixing it would consume the remaining time, and then name it as known debt.',
        category: 'Process',
        difficulty: 'hard',
      },
      {
        question: 'How do you handle "how would you scale this to 10× traffic?"',
        answer:
          'Answer with the bottleneck order, not a list. Find what saturates first — usually the primary database write path or the fan-out worker pool — and say what you would do at each stage: cache, then read replicas, then partition, then a purpose-built store. Naming the sequence and the trigger for each step is the answer; naming technologies is not.',
        category: 'Scaling',
        difficulty: 'medium',
      },
      {
        question: 'What does a strong closing look like?',
        answer:
          'Three sentences: the current bottleneck with a number, the failure behaviour, and the next investment. "At 4,000 reads per second the cache carries us; the primary saturates around 40,000. If Redis dies we degrade to 40 millisecond reads. Next I would add per-region replicas so we are not crossing an ocean for a redirect."',
        category: 'Process',
        difficulty: 'medium',
      },
    ],
  }),
};
