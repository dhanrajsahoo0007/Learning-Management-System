import { ArchitectureTopic, emptyContent } from '../systemDesignTypes';

export const messageQueuesTopic: ArchitectureTopic = {
  id: 'message-queues',
  title: 'Message Queues and Logs',
  description:
    'Why a queue deletes a message and a log keeps it, how partitions bound ordering, and what to do when consumers fall behind.',
  difficulty: 'Intermediate',
  progress: 0,
  icon: 'MessageSquare',
  color: 'bg-orange-600',
  section: 'fundamentals',
  track: 'classic',
  prerequisites: ['databases'],
  estimatedMinutes: 75,
  order: 13,
  content: emptyContent({
    overview:
      'A message broker is a buffer that lets a fast producer and a slow consumer live at different speeds without either one failing. There are two fundamentally different shapes of broker, and confusing them is the most common asynchronous design error: a queue removes a message once a consumer acknowledges it, while a log only advances a per-consumer offset and keeps the bytes on disk for its retention period. That single difference decides whether you can replay history, whether you can add a second independent consumer later, and how you recover from a bug that corrupted every record it touched.',
    whyItExists:
      'Synchronous calls make the caller inherit the latency, the failures, and the capacity limits of everything downstream. A broker turns that chain into a durable handoff, so a payment can be accepted in 50 milliseconds even when the receipt email service is down for an hour.',
    problemStatement: {
      prompt:
        'A payment succeeds and six things must follow: update the ledger, send a receipt, notify the merchant, refresh a fraud model, index the transaction for search, and emit an analytics event. Design the messaging layer so the payment API never waits on any of them, so no event is silently lost when a consumer crashes mid-handler, and so a bug discovered on Friday can be fixed and its events reprocessed on Monday.',
      inScope: [
        'Broker queue, append-only log, managed stream, and pub/sub bus',
        'Delivery semantics and idempotent consumers',
        'Partitions, ordering keys, and consumer groups',
        'Backpressure, dead-letter queues, and the transactional outbox',
      ],
      outOfScope: [
        'Stream processing operators and windowing (see the batch and stream lesson)',
        'Distributed transaction protocols and sagas (see the transactions lesson)',
        'Broker cluster internals such as Kafka controller elections',
        'Schema registry governance and versioning policy',
      ],
    },
    assumptions: [
      'Producers accept an asynchronous handoff and do not need the downstream result inline',
      'Consumers can be made idempotent by keying on a producer-supplied event id',
      'Peak traffic is roughly five times average, so the buffer must absorb bursts rather than average load',
    ],
    whenToUse: [
      'Fan-out: one business event that several independent services must react to',
      'Load levelling: a burst of 50,000 uploads that a transcoding fleet drains over an hour',
      'Decoupling deploys and failures, so a dead consumer delays work instead of rejecting it',
    ],
    functionalRequirements: [
      { title: 'Durable handoff', detail: 'An accepted message survives a broker restart before any consumer has seen it.' },
      { title: 'Ordered processing per entity', detail: 'All events for one account are handled in the order they were produced.' },
      { title: 'Independent consumers', detail: 'Adding a search indexer must not change or slow the existing ledger consumer.' },
      { title: 'Replay', detail: 'Reprocess the last 24 hours of events after fixing a consumer bug, without asking producers to resend.' },
    ],
    nonFunctionalRequirements: [
      { title: 'Throughput', detail: 'Sustain 20,000 messages per second at 1 KB each, which is roughly 20 MB/s of ingest.' },
      { title: 'End-to-end latency', detail: 'p99 under two seconds from produce to handled while the system is caught up.' },
      { title: 'Durability', detail: 'Replication factor three with acknowledgement from a majority, so one broker loss is invisible.' },
      { title: 'Recoverability', detail: 'Retention of seven days so a weekend outage can be replayed rather than reconstructed.' },
    ],
    estimates: [
      { label: 'Kafka partition throughput', value: '~10 MB/s per partition', note: 'At 1 KB messages that is 10k msg/s; 20k/s needs at least 2, use 12 for headroom' },
      { label: 'Seven-day retention', value: '20k/s × 1 KB × 604,800 s ≈ 12 TB', note: 'Times replication factor 3 ≈ 36 TB of disk' },
      { label: 'Visibility timeout', value: '6 × p99 handler time', note: 'A 2 s p99 means 12 s, not the 30 s default' },
      { label: 'Drain capacity', value: '2× peak produce rate', note: 'A 30-minute backlog at 20k/s needs 40k/s to clear in 30 minutes' },
      { label: 'Batching gain', value: '10 messages per API call', note: 'SQS billed per request: batching cuts request cost and cost per message by 10×' },
    ],
    concepts: [
      'Delete-on-ack queue vs offset-based log',
      'At-most-once, at-least-once, effectively-once',
      'Partitions and ordering keys',
      'Consumer groups and rebalancing',
      'Visibility timeout and redelivery',
      'Dead-letter queues and poison messages',
      'Consumer lag: queue depth vs message age',
      'Transactional outbox and dual writes',
    ],
    comparisons: [
      {
        title: 'The four shapes of asynchronous messaging',
        headers: ['Type', 'How it works', 'Use when', 'Avoid when'],
        rows: [
          [
            'Broker queue (SQS, RabbitMQ)',
            'Messages sit in a queue; a consumer receives one, the broker hides it for a visibility timeout, and deletes it permanently on acknowledgement',
            'Work distribution across competing consumers where each item must be done exactly once',
            'You need replay, or a second team wants the same stream later',
          ],
          [
            'Append-only log (Kafka, Redpanda)',
            'Records are appended to a partitioned log on disk; each consumer group stores only an offset, and the data stays until retention expires',
            'Multiple independent consumers, replay after a bug, and ordered per-key processing',
            'You need per-message retries and per-message delay, which offsets cannot express',
          ],
          [
            'Managed stream (Kinesis, Pub/Sub Lite)',
            'A hosted log with fixed shards, an iterator per consumer, and capacity bought in shard units',
            'You want log semantics without operating brokers, and traffic fits shard granularity',
            'Throughput is spiky and unpredictable, since resharding is a deliberate operation',
          ],
          [
            'Pub/sub bus (SNS to SQS, NATS)',
            'Publisher writes to a topic; the bus copies the message into every subscriber queue, so each subscriber gets its own copy and its own backlog',
            'Fan-out to teams you do not control, with per-subscriber filtering and independent failure',
            'You need one shared ordered history rather than N divergent copies',
          ],
          [
            'Task queue (Celery, Sidekiq)',
            'A queue plus a job library: named functions, arguments, scheduled and delayed execution, retries with backoff, and a result backend',
            'Application-level background jobs such as resizing an avatar or sending a reminder',
            'The payload is a business event other services need, not a private unit of work',
          ],
        ],
        note: 'The dividing question is whether the broker owns the notion of "done". A queue does, so it deletes. A log does not, so it keeps the data and lets each consumer own its own position.',
      },
      {
        title: 'Delivery semantics and who pays for them',
        headers: ['Semantic', 'What the broker does', 'What the consumer must do', 'Cost'],
        rows: [
          ['At-most-once', 'Hands over the message and forgets it immediately', 'Nothing; accept that a crash mid-handler loses the message', 'Silent data loss, acceptable only for metrics and best-effort telemetry'],
          ['At-least-once', 'Redelivers until acknowledged', 'Be idempotent: deduplicate on a stable event id before applying an effect', 'Duplicates on every retry, timeout, and rebalance'],
          ['Effectively-once', 'Transactional writes plus a deduplication window, typically minutes to hours', 'Still be idempotent, because the guarantee ends at the broker boundary', 'Lower throughput, and no protection at all for external side effects such as email'],
        ],
        note: 'No broker can make a third-party payment API or an SMTP server exactly-once. The guarantee always terminates at the last system you control.',
      },
    ],
    architecture:
      'Producers write business events into a partitioned log, keyed by the entity whose order matters, and write those events in the same database transaction as the state change by way of an outbox table. Each downstream concern is a separate consumer group with its own offset, so the ledger, the notifier, and the search indexer fail and scale independently. A queue with a dead-letter target sits in front of any consumer that needs per-message retry and delay rather than a single moving position.',
    diagrams: [
      { id: 'vs', title: 'Queue deletes, log replays', kind: 'excalidraw', src: 'queue-vs-log' },
      { id: 'anim', title: 'When consumers fall behind', kind: 'animation', src: 'queue-backpressure' },
    ],
    walkthrough: [
      {
        title: 'Name the coupling you are removing',
        description:
          'The payment API currently calls six services inline, so its latency is the sum of six p99s and its availability is the product of six availabilities. Write that down as a number first: six services at 99.9 percent each give 99.4 percent, which is roughly four hours of downtime a month caused entirely by things the payment does not need to wait for. The broker exists to convert that multiplication into a single durable write.',
      },
      {
        title: 'Decide queue or log from the replay question',
        description:
          'Ask whether anyone will ever need to reprocess these events, and whether a second consumer might appear. Receipt emails are once-only work with no value in history, so a queue is correct and deleting on acknowledgement is a feature. The payment event itself feeds the ledger, fraud, search, and analytics, so it belongs in a log where four groups hold four offsets over one copy of the data.',
      },
      {
        title: 'Choose the partition key, not the partition count',
        description:
          'Ordering exists only inside a partition, so the key decides which sequences are guaranteed. Keying on account_id means every event for one account lands in the same partition and is handled in produce order, which is what a balance calculation requires. Keying on a random uuid gives perfect load spread and no ordering at all, and keying on merchant_id creates a hot partition the moment one merchant runs a sale.',
      },
      {
        title: 'Make the row and the event atomic',
        description:
          'Writing the payment row to Postgres and then publishing to Kafka is a dual write: a crash between the two commits the money and loses the event, and no amount of retry logic fixes it because the process is gone. Insert the event into an outbox table in the same transaction as the payment, and let a relay read that table and publish. The database is now the single point that decides whether both happened.',
      },
      {
        title: 'Make the consumer idempotent and size the timeout',
        description:
          'At-least-once delivery means every handler will see duplicates, so each consumer stores the processed event id in a table with a unique constraint and treats a conflict as success. Set the visibility timeout to about six times the p99 handler duration: too short and the broker redelivers work that is still running, which doubles the load exactly when the system is slow. Two seconds p99 means twelve seconds, and a handler that legitimately needs longer should extend the lease rather than raise the default.',
      },
      {
        title: 'Alarm on age, then drain',
        description:
          'Queue depth alone is ambiguous, because 100,000 messages is fine if you drain 40,000 per second and a disaster if you drain 200. Alarm instead on the age of the oldest unprocessed message, which directly expresses the promise you make to users. When age grows, add consumers up to the partition count, then shed non-essential work, and only then consider adding partitions.',
        animation: 'queue-backpressure',
      },
    ],
    deepDives: [
      {
        title: 'A queue deletes on acknowledgement, a log moves an offset',
        body:
          'In SQS or RabbitMQ, a receive hides the message for the visibility timeout and an acknowledgement destroys it. The broker holds the only copy of "what is left to do", which makes per-message retry and per-message delay natural and makes history impossible: once the ledger consumer acknowledged Tuesday, Tuesday is gone. Kafka instead appends records to a partition file and stores one integer per consumer group, the offset. Acknowledging means committing offset 4,912,338; the record at 4,912,337 is still on disk until retention expires. Rewinding the offset to yesterday reprocesses yesterday, and a new consumer group starting at the earliest offset replays everything without touching the existing groups.',
      },
      {
        title: 'Exactly-once is at-least-once plus an idempotent consumer',
        body:
          'A consumer must do two things that cannot be one atomic operation: apply an effect and record that it applied. If it acknowledges first and then crashes, the work is lost; if it works first and then crashes before acknowledging, the work repeats. Brokers that advertise exactly-once close this only within their own boundary, using a producer sequence number to drop duplicate appends and a transaction that commits the output records and the offset together. Nothing extends that to a charge on a card or an outbound email. The practical design is at-least-once delivery plus a processed_events table with a unique index on event_id, inserted in the same transaction as the effect, so a duplicate delivery hits the constraint and returns success without charging twice.',
      },
      {
        title: 'Ordering is per partition, and consumer groups follow partitions',
        body:
          'A partition is an ordered file; the topic as a whole is not ordered, because twelve partitions are twelve independent sequences appended concurrently. Global ordering therefore requires exactly one partition, which caps you at roughly 10 MB/s and one consumer, so real systems order per key instead. Within a consumer group each partition is assigned to exactly one member, which is why adding a thirteenth consumer to a twelve-partition topic gives you an idle process rather than more throughput. Partition count is easy to raise and impossible to lower, and raising it rehashes keys so a given account may move partitions, briefly breaking the per-key order you were relying on across the boundary.',
      },
      {
        title: 'Rebalancing is a stop-the-world event you should plan for',
        body:
          'When a member joins, leaves, or misses its heartbeat, the group coordinator reassigns partitions and, in the classic protocol, every member revokes everything and re-acquires, so the whole group stops for the duration. A rolling deploy of twelve pods therefore triggers twelve rebalances, and a handler that blocks longer than the poll interval looks dead and triggers another. Three settings fix most of this: cooperative sticky assignment so only moved partitions pause, static group membership so a restarting pod reclaims its own partitions instead of provoking a reassignment, and a max poll size small enough that one batch always finishes inside the poll timeout. Consumers that commit offsets after processing rather than before turn each rebalance into duplicates instead of gaps.',
      },
      {
        title: 'Poison messages, dead-letter queues, and the retry loop that never ends',
        body:
          'A message that always fails, such as an event referencing a deleted account, will be redelivered forever and can consume an entire fleet. A queue solves this with a receive counter and a maximum receives setting: after five deliveries the broker moves the message to a dead-letter queue, preserving the payload and the failure for a human. A log has no per-message counter, so the consumer must implement the equivalent by tracking attempts and publishing the record to a separate dead-letter topic before advancing past it. The important discipline is that a dead-letter queue with no alarm and no redrive path is just a leak: alarm on depth greater than zero, and keep a tested redrive job that replays the queue after the fix ships.',
      },
      {
        title: 'Backpressure: depth is the symptom, age is the alarm',
        body:
          'Producers rarely slow down when consumers stall, so the backlog absorbs the difference until disk or retention runs out. Depth is a poor alarm because it has no time dimension: 500,000 messages is ten seconds of work at 50,000 per second and forty minutes at 200. Alarm instead on the age of the oldest unacknowledged message, and separately on the derivative of depth, which tells you whether you are gaining or losing. Recovery has an order: scale consumers up to the partition count, cut the work per message by batching database writes, drop or divert low-value traffic such as analytics into a separate topic, and only then add partitions. If the consumer is downstream-bound, adding consumers makes the downstream worse, so rate-limit deliberately instead.',
      },
      {
        title: 'The transactional outbox, because dual writes lose events',
        body:
          'Two writes to two systems cannot be made atomic by ordering them carefully. Commit the payment and then publish, and a crash in between leaves money moved with no event. Publish and then commit, and a rollback leaves an event describing a payment that never happened. The outbox pattern makes it one write: the same transaction that inserts the payment also inserts a row into an outbox table, so either both are visible or neither is. A relay process, or change data capture reading the write-ahead log, then reads unpublished outbox rows and produces them to the broker, marking them sent. Publishing may duplicate on relay restart, which is fine because consumers are already idempotent, and ordering per key is preserved because the log is read in commit order.',
      },
    ],
    tradeoffs: [
      'A log gives replay and multiple consumers but no per-message retry or delay, so retries become a consumer concern.',
      'More partitions raise throughput and consumer parallelism while increasing rebalance time, open file handles, and end-to-end latency variance.',
      'Longer retention buys recovery from a week-old bug and costs terabytes of replicated disk.',
      'Asynchronous handoff makes the write path fast and makes every read path eventually consistent, so the client must be designed for a pending state.',
    ],
    bottlenecks: [
      'A hot partition created by a low-cardinality key such as merchant_id or country.',
      'Consumers capped at the partition count, so extra pods sit idle while lag grows.',
      'A slow downstream dependency inside the handler, which turns consumer scaling into downstream overload.',
      'Repeated rebalances caused by handlers exceeding the poll interval, so the group spends more time reassigning than working.',
    ],
    scalingPath: [
      { scale: 'Prototype', focus: 'One queue, one consumer, idempotent handler, dead-letter queue with an alarm on depth above zero' },
      { scale: 'One region', focus: 'Partitioned log with a key per entity, outbox relay for producers, consumer group per concern, alarm on oldest message age' },
      { scale: 'Global', focus: 'Per-region clusters with asynchronous topic mirroring, tiered storage for long retention, and consumers that treat cross-region order as undefined' },
    ],
    interviewScript: [
      '"The payment API should not wait on six downstream services, so I publish one event and let them consume it."',
      '"I use a log rather than a queue here, because the ledger, fraud, and search all want the same stream and I want to replay after a bug."',
      '"I key the partition on account_id, so events for one account are ordered; there is no global order and I do not need one."',
      '"Delivery is at-least-once, so every consumer deduplicates on event_id in the same transaction as the effect."',
      '"The row and the event go in one transaction through an outbox, because a dual write silently loses events."',
      '"I alarm on the age of the oldest message, not on queue depth, and my drain capacity is twice peak produce rate."',
    ],
    commonMistakes: [
      'Assuming a topic is globally ordered when ordering only holds inside a partition.',
      'Believing an exactly-once flag removes the need for an idempotent consumer.',
      'Writing to the database and then publishing to the broker as two separate operations.',
      'Adding consumers beyond the partition count and expecting more throughput.',
      'Alarming on queue depth with no notion of message age or drain rate.',
      'Creating a dead-letter queue with no alarm and no tested redrive path.',
    ],
    relatedTopics: ['transactions', 'batch-stream', 'reliability', 'databases', 'paytm', 'slack'],
    examples: [
      'LinkedIn built Kafka as a replayable log because dozens of teams needed the same activity stream without coordinating',
      'Uber uses Kafka partitioned by trip so all events for one trip stay ordered while millions of trips run concurrently',
      'Stripe fans webhook deliveries out through queues with retries and a dead-letter path, because customer endpoints fail unpredictably',
    ],
    practicePrompt:
      'Given a payment event that must reach a ledger, an email service, and a search index, state which of the three gets a queue and which gets a log, and justify each choice from replay and retry requirements.',
    followUps: [
      {
        question: 'What exactly is the difference between a queue and a log?',
        answer:
          'A queue owns the definition of outstanding work: it hides a message during a visibility timeout and deletes it when a consumer acknowledges, so only one logical consumer can ever process it and history is gone. A log owns an ordered file per partition and stores just an offset per consumer group, so the record survives acknowledgement until retention expires. That means a log supports replay and any number of independent consumers, while a queue supports per-message retry and delay that a single moving offset cannot express.',
        category: 'Fundamentals',
        difficulty: 'easy',
      },
      {
        question: 'Why is exactly-once delivery not really achievable?',
        answer:
          'Applying an effect and recording that you applied it are two operations, and a crash can land between them in either order. Broker features labelled exactly-once use producer sequence numbers to drop duplicate appends and a transaction to commit output records with the consumer offset, which works only for state inside that broker. The moment a handler charges a card or sends an email the guarantee ends, so the real pattern is at-least-once delivery with a deduplication key stored transactionally alongside the effect.',
        category: 'Semantics',
        difficulty: 'medium',
      },
      {
        question: 'How do you guarantee ordering for one user without giving up throughput?',
        answer:
          'Partition by the user identifier so all of that user\'s events land in one partition, which is an ordered file consumed by exactly one member of each group. Other users occupy other partitions and run fully in parallel, so throughput scales with partition count while order holds per user. The residual risks are a hot key that overwhelms one partition, and increasing the partition count later, which rehashes keys and can briefly interleave a user\'s events across the old and new partitions.',
        category: 'Ordering',
        difficulty: 'medium',
      },
      {
        question: 'What should the visibility timeout be, and what breaks if it is wrong?',
        answer:
          'Set it to roughly six times the p99 handler duration, so a 2 second p99 gets 12 seconds rather than the 30 second default. Too short and the broker redelivers messages that are still being processed, which duplicates work precisely when the system is slow and can turn a small slowdown into a self-reinforcing overload. Too long and a genuinely crashed consumer leaves messages invisible for that whole window, so recovery stalls. Handlers with legitimately variable duration should extend the lease periodically instead of raising the global default.',
        category: 'Operations',
        difficulty: 'medium',
      },
      {
        question: 'A consumer keeps failing on the same message. What do you do?',
        answer:
          'Treat it as a poison message and stop letting it block the partition or consume the fleet. In a queue, set a maximum receive count so the broker moves it to a dead-letter queue after a handful of attempts with the payload and error preserved. In a log, the consumer must count attempts itself, publish the record to a dead-letter topic, and commit past the offset, otherwise the whole partition stops. Then alarm on dead-letter depth above zero and keep a tested redrive job to replay it after the fix ships.',
        category: 'Reliability',
        difficulty: 'medium',
      },
      {
        question: 'Why is queue depth a bad alarm?',
        answer:
          'Depth has no time dimension, so the same number means completely different things at different drain rates: 500,000 messages is ten seconds of work at 50,000 per second and forty minutes at 200 per second. The user-visible promise is latency, so alarm on the age of the oldest unprocessed message, which maps directly to that promise. Depth is still useful as a secondary signal, particularly its derivative, which tells you whether the backlog is growing or shrinking.',
        category: 'Operations',
        difficulty: 'easy',
      },
      {
        question: 'Explain the transactional outbox and when you would skip it.',
        answer:
          'The outbox turns a dual write into a single transaction: the same commit that inserts the payment row also inserts an event row into an outbox table, and a relay or change data capture process publishes unsent rows to the broker afterwards. Because the database decides atomicity, there is no window in which state changed without an event. The relay can duplicate on restart, which is acceptable because consumers deduplicate. You can skip it only when losing the event is genuinely harmless, such as a best-effort analytics ping, or when the event is derived from the log itself by change data capture.',
        category: 'Correctness',
        difficulty: 'hard',
      },
      {
        question: 'What happens during a consumer group rebalance?',
        answer:
          'The coordinator reassigns partitions among members whenever one joins, leaves, or misses a heartbeat, and under the classic eager protocol every member revokes all partitions and re-acquires, so the group stops processing for the duration. A rolling deploy therefore causes one rebalance per pod, and a handler that blocks past the poll interval is declared dead and causes another. Cooperative sticky assignment pauses only the partitions actually moving, and static membership lets a restarting pod reclaim its own partitions without provoking a reassignment at all.',
        category: 'Operations',
        difficulty: 'hard',
      },
      {
        question: 'When is SNS fan-out to several SQS queues better than one Kafka topic?',
        answer:
          'When subscribers are independent teams that need their own backlog, their own filtering, and their own retry and dead-letter behaviour, and when nobody needs a shared ordered history. Each subscriber gets a private copy, so a stalled consumer cannot delay anyone else and per-message retries work naturally. The cost is that there is no single replayable history, the copies can diverge, and storage grows with the number of subscribers rather than staying at one copy.',
        category: 'Architecture',
        difficulty: 'medium',
      },
      {
        question: 'How do you handle a burst that is ten times your consumer capacity?',
        answer:
          'Accept the backlog on purpose, because that is what the buffer is for, and then defend latency for the traffic that matters. Split the topic by priority so checkout events do not queue behind analytics, scale consumers up to the partition count, and reduce per-message cost by batching writes so one commit covers 100 records instead of one. If the bottleneck is a downstream dependency, adding consumers only amplifies the overload, so rate-limit deliberately and let the queue grow while alarming on message age.',
        category: 'Scaling',
        difficulty: 'hard',
      },
    ],
  }),
};
