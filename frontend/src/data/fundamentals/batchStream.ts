import { ArchitectureTopic, emptyContent } from '../systemDesignTypes';

export const batchStreamTopic: ArchitectureTopic = {
  id: 'batch-stream',
  title: 'Batch and Stream Processing',
  description:
    'Split, shuffle, and reduce; event time, windows, and watermarks; and why Kappa replaced Lambda for most teams.',
  difficulty: 'Intermediate',
  progress: 0,
  icon: 'Layers',
  color: 'bg-orange-700',
  section: 'fundamentals',
  track: 'classic',
  prerequisites: ['message-queues'],
  estimatedMinutes: 70,
  order: 14,
  content: emptyContent({
    overview:
      'Batch processing reads a bounded dataset that has stopped changing and produces a complete answer. Stream processing reads an unbounded dataset that never stops and produces an answer that is correct as of now, revised as more data arrives. The two share almost all their mechanics — partition the data, group by key, aggregate — and differ in one decision: whether you are allowed to wait for all the input before answering.',
    whyItExists:
      'A single machine cannot scan a day of payment events, and a nightly job cannot tell a fraud model what happened four seconds ago. These frameworks exist so that partitioning, retries, and state recovery are not written by hand in every job.',
    problemStatement: {
      prompt:
        'A payments platform emits 200,000 events per second and needs three things from them: a live per-merchant revenue counter with under five seconds of lag, an exact daily settlement report, and the ability to recompute the last 30 days after a bug is found in the revenue logic. Design the processing layer, and decide whether the live path and the historical path share code.',
      inScope: [
        'Batch execution: split, shuffle, reduce, and where the cost sits',
        'Micro-batch versus true streaming, and the latency each buys',
        'Event time, windows, watermarks, and late data policy',
        'State, checkpoints, exactly-once effects, and backfill',
      ],
      outOfScope: [
        'Broker internals, partitions, and consumer groups (see message queues)',
        'Warehouse schema design and BI modelling',
        'Feature store and model training pipelines from the AI track',
        'Cluster scheduling and resource manager tuning',
      ],
    },
    assumptions: [
      'The event log is durable and replayable for at least 30 days, so it can serve as the source of truth',
      'Every event carries an event-time timestamp set by the producer and a stable event id',
      'Sinks can be made idempotent, either by upsert on a key or by a transactional write',
    ],
    whenToUse: [
      'Aggregations over volumes one machine cannot scan, such as a day of clickstream or payment events',
      'Anything with a freshness requirement measured in seconds: fraud scoring, live dashboards, alerting',
      'Recomputing derived data after a logic change, where correctness depends on replaying history',
    ],
    functionalRequirements: [
      { title: 'Aggregate by key over a window', detail: 'Revenue per merchant per hour, computed on event time rather than arrival time.' },
      { title: 'Handle late and out-of-order events', detail: 'A mobile client that was offline for ten minutes must still land in the right hour.' },
      { title: 'Produce exactly-once effects', detail: 'A restarted job must not double-count a payment in the sink, even if it reprocesses the input.' },
      { title: 'Support backfill', detail: 'Replay any window of history through new logic and overwrite the derived output deterministically.' },
    ],
    nonFunctionalRequirements: [
      { title: 'Freshness', detail: 'Live path under 5 s end to end; the daily report may take hours as long as it is exact.' },
      { title: 'Throughput', detail: 'Absorb 200k events/s steady and a 3× replay burst during backfill without falling behind.' },
      { title: 'Recovery time', detail: 'A failed task resumes from the last checkpoint in under a minute, not from the start of the stream.' },
      { title: 'Determinism', detail: 'The same input range and the same code produce the same output, which is what makes backfill trustworthy.' },
    ],
    estimates: [
      { label: 'Nightly batch input', value: '2 TB in 6 h', note: '≈ 95 MB/s sustained read spread across the cluster' },
      { label: 'Shuffle volume per stage', value: '≈ 1× input', note: '2 TB across the network; the dominant cost of the job' },
      { label: 'Micro-batch vs streaming lag', value: '1–5 s vs 50–500 ms', note: 'Trigger interval floors micro-batch latency' },
      { label: 'Checkpoint write', value: '10 GB every 30 s', note: '≈ 333 MB/s to object storage unless checkpoints are incremental' },
      { label: '30-day backfill', value: '≈ 4 h', note: '518 B events replayed at 36× live rate, sink absorbing 7M rows/s' },
    ],
    concepts: [
      'Split, shuffle, and reduce',
      'Micro-batch versus true streaming',
      'Event time versus processing time',
      'Tumbling, sliding, and session windows',
      'Watermarks and allowed lateness',
      'Keyed state and checkpointing',
      'Lambda versus Kappa architecture',
      'Idempotent sinks and replay',
    ],
    comparisons: [
      {
        title: 'Batch, micro-batch, and streaming',
        headers: ['Model', 'How it works', 'Use when', 'Avoid when'],
        rows: [
          [
            'Scheduled batch (MapReduce, Spark, cron)',
            'A trigger starts a job over a bounded input range; the job splits the input, shuffles by key, reduces, and writes a complete output before exiting',
            'The answer must be exact and complete, and hours of lag are acceptable — settlement, invoices, model training sets',
            'A decision has to be made while the user is still on the page',
          ],
          [
            'Micro-batch (Spark Structured Streaming)',
            'The stream is cut into small bounded batches on a trigger interval, and each batch runs the ordinary batch engine',
            'You already run Spark, want one API for both paths, and 1–5 s of lag is fine',
            'You need tens of milliseconds, or per-event side effects such as sending an alert',
          ],
          [
            'True streaming (Flink, Kafka Streams)',
            'Operators form a long-lived dataflow graph; each event flows through as it arrives while state lives beside the operator',
            'Low latency, session windows, and complex per-key state machines',
            'The team has no appetite for operating stateful jobs and tuning checkpoints',
          ],
        ],
        note: 'Micro-batch trades latency for reusing a batch engine. True streaming trades operational simplicity for latency and richer windowing.',
      },
      {
        title: 'Lambda versus Kappa',
        headers: ['Property', 'Lambda', 'Kappa'],
        rows: [
          ['Shape', 'A batch layer over all history plus a speed layer over recent events, merged at read time', 'One streaming path over a replayable log; history is just an older offset'],
          ['Codebases', 'Two, in different engines, that must agree on the same semantics', 'One, used for both live processing and backfill'],
          ['Backfill', 'Rerun the batch layer, which eventually overwrites the approximate speed-layer answer', 'Start a second job from an earlier offset, write to a new output, then swap'],
          ['Correctness risk', 'The two implementations drift and the merge hides which one was wrong', 'A bug affects one path, so it is visible and fixed once'],
          ['Cost', 'Two clusters and two on-call surfaces', 'One cluster, but it must retain enough log to replay'],
          ['Use when', 'The batch engine can express something the streaming engine genuinely cannot', 'Almost always, if the log retains enough history'],
        ],
        note: 'Kappa depends entirely on log retention. If the log keeps seven days and you must recompute a year, you still need a batch path over archived data.',
      },
    ],
    architecture:
      'Producers append payment events to a partitioned, replayable log keyed by merchant. A stateful streaming job consumes it, assigns event time, aggregates into hourly windows behind a watermark, and upserts results into a serving store keyed by merchant and hour. The same job binary, started from an older offset and pointed at a shadow output table, performs backfill, and the log is also archived to object storage so a batch engine can rebuild anything older than the retention window.',
    diagrams: [
      { id: 'paths', title: 'Two paths over one log', kind: 'excalidraw', src: 'kappa-vs-lambda' },
    ],
    walkthrough: [
      {
        title: 'Split the input into tasks',
        description:
          'The engine divides the input into partitions — file blocks for batch, log partitions for streaming — and schedules one task per partition, ideally on a machine that already holds the data. Parallelism is bounded by the number of splits, so 200 files means at most 200 concurrent map tasks no matter how large the cluster is. This is why a job over ten thousand tiny files is slower than one over a hundred large ones.',
      },
      {
        title: 'Compute what can be computed locally',
        description:
          'Anything that does not need data from another partition happens in place: filters, projections, and partial aggregation of a key within one split. A good engine pushes a combiner here so that a million rows for one merchant leave the task as a single partial sum. Every byte eliminated at this stage is a byte that does not cross the network in the next one.',
      },
      {
        title: 'Shuffle by key, and pay for it',
        description:
          'To group all events for merchant 4471 together, the engine hashes each key, writes rows into per-destination buckets on local disk, and every reducer then fetches its bucket from every mapper. That is an all-to-all transfer of roughly the whole dataset, plus a disk write and a disk read, which is why shuffle dominates the runtime of almost every real job. Reducing shuffle volume with pre-aggregation, broadcast joins for small tables, or partitioning the input by the join key is the single highest-leverage optimisation available.',
      },
      {
        title: 'Reduce, and hold state if the input never ends',
        description:
          'Each reducer merges the rows for its keys and produces the output. In batch the reducer sees all rows for a key and then exits; in streaming it keeps a per-key accumulator alive indefinitely, updating the hourly sum for merchant 4471 as events arrive. That accumulator is real state on the machine, which is what forces checkpointing to exist.',
      },
      {
        title: 'Advance the watermark and close the window',
        description:
          'The job tracks the maximum event time it has observed and subtracts an allowed lateness, say 30 seconds, to produce a watermark: the assertion that no event older than this is still expected. When the watermark passes the end of the 13:00 window, that window is closed and emitted. Nothing before this point is safe to emit as final, because a straggling mobile client could still change the answer.',
      },
      {
        title: 'Write idempotently, then checkpoint',
        description:
          'The sink upserts on the key (merchant, hour) so replaying the same window overwrites rather than adds, which is what makes a restart harmless. Only after the write is durable does the job commit a checkpoint containing both the operator state and the input offsets, so recovery resumes from a point where output and offset agree. Backfill is then simply the same job started from an older offset writing into a shadow table, promoted by an atomic rename once it catches up.',
      },
    ],
    deepDives: [
      {
        title: 'Shuffle is the cost, everything else is detail',
        body:
          'A map task can filter at close to disk speed, but a group-by requires every row for a key to meet on one machine. The engine hashes the key modulo the reducer count, writes rows into that many local files, and each of R reducers then pulls a file from each of M mappers: M × R network fetches and a full round trip of the dataset through local disk. On a 2 TB job that is 2 TB written, 2 TB read, and 2 TB transferred, which is why doubling the cluster often halves compute time and barely moves total runtime. The countermeasures are all about moving less: pre-aggregate with a combiner so a merchant leaves each task as one partial sum, broadcast a dimension table under a few hundred megabytes instead of shuffling both sides, and bucket the input by the join key once so future jobs skip the shuffle entirely.',
      },
      {
        title: 'Event time is the only time that means anything',
        body:
          'Processing time is when your machine saw the event, and it is contaminated by network delay, consumer lag, retries, and restarts. A payment authorised at 12:59:58 on a phone with poor signal may arrive at 13:04, and if you bucket by arrival it lands in the wrong hour and both hours are wrong forever. Event time is the timestamp the producer stamped, which stays correct through every delay and every replay. It is also the reason a replay is meaningful: reprocessing yesterday with event-time windows reproduces yesterday exactly, while processing-time windows would produce whatever the replay speed happened to be. The cost is that event time does not advance on its own, so the job needs an explicit signal for progress, which is the watermark.',
      },
      {
        title: 'Watermarks and the three answers for late data',
        body:
          'A watermark is a claim, derived from observed timestamps minus an allowed lateness, that no event earlier than time T remains. It is a heuristic, so it must be tuned from the real arrival delay distribution: if p99.9 lateness is 25 seconds, a 30 second watermark closes windows promptly and abandons about one event in a thousand. When an event arrives behind the watermark there are exactly three defensible policies. Drop it and count the drops in a metric, which is correct for a dashboard. Route it to a side output for a repair job or manual review, which is correct for payments. Or keep the window state alive past the watermark and emit an updated result, which is correct when the sink can accept retractions and updates. Choosing silently is how a settlement report ends up short by a fraction of a percent nobody can explain.',
      },
      {
        title: 'Checkpointing is what makes exactly-once possible',
        body:
          'A streaming job holds per-key accumulators, so a crash without state recovery means restarting the hourly totals from zero. Flink injects barriers into the dataflow; when a barrier passes an operator, that operator snapshots its state to durable storage, and when every operator has snapshotted, the checkpoint commits together with the input offsets. Recovery restores the state and rewinds the input to exactly that offset, so no event is lost and none is applied twice inside the job. Note carefully what this does not give you: exactly-once processing inside the job says nothing about the outside world. End-to-end exactly-once needs the sink to participate, either through a transaction committed with the checkpoint or through an idempotent upsert keyed on something stable. Without one of those, recovery re-emits and the sink double-counts.',
      },
      {
        title: 'Lambda works, Kappa is cheaper to be right in',
        body:
          'Lambda runs a batch job over all history for the exact answer and a streaming job over recent events for the fast approximate answer, and the serving layer merges them. It works, and for years it was the only option, but the flaw is structural: the same business logic exists twice in two engines with different semantics, so the two answers drift and the merge hides which one is wrong. Kappa keeps one streaming implementation and treats history as an older offset in a replayable log. Backfill means running a second instance of the same job from an earlier offset into a shadow output, then swapping it in — same code, same windows, same result. The precondition is retention: if the log keeps seven days and you must recompute a year, you still need archived data and a batch reader over it, which is Lambda wearing different clothes.',
      },
      {
        title: 'Skew and the straggler that owns your runtime',
        body:
          'A job finishes when its slowest task finishes. If one merchant produces 30% of all events, the reducer holding that key does 30% of the work while 199 others idle, and the job takes three times longer than the data volume suggests. In streaming the same skew shows up as one overloaded task with growing state and rising checkpoint duration. The fixes are mechanical. Salt the hot key by appending a random suffix from 0 to 63, aggregate in two stages, then sum the 64 partials. Use a map-side combiner so the hot key arrives pre-reduced. Or detect skew at plan time, as adaptive query execution does, and split the offending partition. Speculative execution helps only with slow machines; it cannot help a task that genuinely has more data.',
      },
    ],
    tradeoffs: [
      'Batch gives exact, complete answers and cannot give you freshness measured in seconds.',
      'A longer watermark captures more late events and delays every window result by the same amount.',
      'Micro-batch reuses one engine and one API at the cost of a latency floor set by the trigger interval.',
      'Larger streaming state enables session windows and joins, and makes every checkpoint and every recovery slower.',
    ],
    bottlenecks: [
      'Shuffle, which moves roughly the entire dataset over the network and through local disk.',
      'A skewed key giving one task a disproportionate share of the work and the whole job its runtime.',
      'Checkpoint duration growing with state size until it exceeds the checkpoint interval.',
      'The sink, which during a backfill must absorb many times the live write rate.',
    ],
    scalingPath: [
      { scale: 'Prototype', focus: 'One cron job reading yesterday partition and writing a summary table; no streaming path at all' },
      { scale: 'One region', focus: 'A stateful streaming job on event time with watermarks, incremental checkpoints, and idempotent upserts into a serving store' },
      { scale: 'Global', focus: 'Per-region jobs over regional logs, a global rollup, archived log in object storage for long-range backfill, shadow-table promotion for reprocessing' },
    ],
    interviewScript: [
      '"There are two requirements here with different deadlines, so I will name the freshness target for each before choosing an engine."',
      '"Everything is keyed on event time, because arrival time is contaminated by lag and makes replay meaningless."',
      '"Hourly windows close on a watermark of maximum event time minus 30 seconds, tuned from the real lateness distribution."',
      '"Late payments go to a side output rather than being dropped, since a settlement report cannot be quietly short."',
      '"The sink upserts on merchant and hour, so a restart or a replay overwrites instead of double-counting."',
      '"I would choose Kappa: one job, and backfill is the same binary from an older offset into a shadow table."',
    ],
    commonMistakes: [
      'Windowing on processing time and then wondering why a replay produces different numbers.',
      'Treating the watermark as exact rather than as a tuned heuristic with a measurable drop rate.',
      'Assuming in-job exactly-once gives end-to-end exactly-once without an idempotent or transactional sink.',
      'Maintaining two implementations of the same aggregation in Lambda and letting them drift.',
      'Ignoring key skew until one straggler task defines the runtime of every job.',
      'Backfilling straight into the live table instead of a shadow table that can be promoted or discarded.',
    ],
    relatedTopics: ['message-queues', 'observability', 'databases', 'google-search'],
    examples: [
      'Netflix runs Flink for near-real-time playback metrics and Spark for large historical aggregations over the same events',
      'Uber built a Kappa-style pipeline so surge and ETA logic exists once and backfills by replaying Kafka',
      'LinkedIn originated the log-centric argument behind Kappa with Kafka and Samza fed by change data capture',
    ],
    practicePrompt:
      'Given payment events with a p99.9 arrival delay of 25 seconds and an hourly settlement report that must be exact, choose the watermark and the late-data policy and justify both with numbers.',
    followUps: [
      {
        question: 'Why is shuffle the expensive part of a batch job?',
        answer:
          'Grouping by key forces every row for a key onto one machine, so the engine writes rows into per-reducer buckets on local disk and every reducer fetches from every mapper. That is roughly the whole dataset written, read, and transferred across an all-to-all pattern. A 2 TB job moves about 2 TB over the network, which is why adding machines shortens compute but barely moves total runtime.',
        category: 'Batch',
        difficulty: 'medium',
      },
      {
        question: 'What exactly is a watermark?',
        answer:
          'It is an assertion carried through the dataflow that no event with an event time earlier than T is still expected, usually computed as the maximum observed event time minus an allowed lateness. It is what lets the job decide a window is finished, because event time does not advance on its own. It is a heuristic, so its value should come from the measured arrival-delay distribution rather than from a round number.',
        category: 'Streaming',
        difficulty: 'medium',
      },
      {
        question: 'An event arrives after its window closed. What are the options?',
        answer:
          'Drop it and increment a metric, which is acceptable for a dashboard where a 0.1% error is invisible. Send it to a side output for a repair job or human review, which is the right answer for money. Or hold the window state past the watermark and emit a corrected result, which requires a sink that accepts updates or retractions. The failure mode is picking one implicitly and discovering the loss in a reconciliation months later.',
        category: 'Streaming',
        difficulty: 'medium',
      },
      {
        question: 'Does checkpointing give you exactly-once?',
        answer:
          'Only inside the job. A checkpoint snapshots operator state together with input offsets, so recovery restores both and no event is counted twice within the dataflow. The moment output leaves the job, the guarantee ends: recovery will re-emit records written since the last checkpoint. End-to-end you need either a transactional sink that commits with the checkpoint or an idempotent upsert keyed on something stable, such as merchant and hour.',
        category: 'Correctness',
        difficulty: 'hard',
      },
      {
        question: 'When is micro-batch the right choice over true streaming?',
        answer:
          'When the freshness requirement is a second or more and the team already operates a batch engine. Micro-batch gives one API and one mental model for both bounded and unbounded input, which is a real organisational saving, and its throughput per core is often better because it amortises scheduling across a batch. It is the wrong choice when you need sub-100-millisecond reaction, per-event side effects, or session windows with complex keyed state.',
        category: 'Engines',
        difficulty: 'easy',
      },
      {
        question: 'How do tumbling, sliding, and session windows differ?',
        answer:
          'Tumbling windows are fixed and non-overlapping, so each event belongs to exactly one — hourly revenue. Sliding windows are fixed length with a smaller step, so an event belongs to several and state cost multiplies by length over step: a 10-minute window every minute puts each event in ten. Session windows have no fixed bounds; they group events by activity and close after a gap of inactivity, which is how you measure a user visit.',
        category: 'Streaming',
        difficulty: 'easy',
      },
      {
        question: 'How do you backfill 30 days after fixing a bug in the aggregation?',
        answer:
          'Start the corrected job from the offset corresponding to 30 days ago, writing into a shadow output table rather than the live one. Because windows are on event time, the replayed result is identical to what the fixed code would have produced originally, regardless of how fast the replay runs. When it catches up to the live offset, promote the shadow table with an atomic rename or pointer swap. Watch the sink write rate, since replay runs many times faster than live traffic.',
        category: 'Operations',
        difficulty: 'hard',
      },
      {
        question: 'What is the real cost of Lambda architecture?',
        answer:
          'Two implementations of the same business logic in engines with different semantics, maintained by people under deadline pressure. Every change has to be made twice and verified to produce identical results, and when the batch and speed layers disagree the merge layer hides which one was wrong. The infrastructure cost of a second cluster is the smaller half of the bill; the correctness and staffing cost is the larger one.',
        category: 'Architecture',
        difficulty: 'medium',
      },
      {
        question: 'When do you still need a batch layer under Kappa?',
        answer:
          'When the replay range exceeds log retention. Kafka retaining seven days cannot answer a request to recompute a year, so archived events in object storage plus a batch reader remain necessary. Batch also stays ahead for jobs that genuinely need to see the whole dataset at once, such as training a model or a global sort, where a streaming formulation would just be a batch job with extra machinery.',
        category: 'Architecture',
        difficulty: 'hard',
      },
      {
        question: 'How do you fix a straggler caused by one hot key?',
        answer:
          'Salt it: append a random suffix from 0 to 63 to the key, aggregate the 64 sub-keys in parallel, then sum the partials in a small second stage. A map-side combiner also helps, since the hot key then leaves each task as one partial sum instead of millions of rows. Adaptive query execution can detect the skewed partition at runtime and split it. Speculative execution will not help, because that task is slow from having more data, not from running on a bad machine.',
        category: 'Performance',
        difficulty: 'medium',
      },
    ],
  }),
};
