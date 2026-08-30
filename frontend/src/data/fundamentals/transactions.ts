import { ArchitectureTopic, emptyContent } from '../systemDesignTypes';

export const transactionsTopic: ArchitectureTopic = {
  id: 'transactions',
  title: 'Transactions and Sagas',
  description: 'ACID, isolation levels with the anomalies they permit, and how to keep money correct across services without two-phase commit.',
  difficulty: 'Advanced',
  progress: 0,
  icon: 'Coins',
  color: 'bg-yellow-700',
  section: 'fundamentals',
  track: 'classic',
  prerequisites: ['databases'],
  estimatedMinutes: 95,
  order: 6,
  content: emptyContent({
    overview:
      'A transaction is a promise that a group of changes either all happen or none do, and that concurrent work does not corrupt the result. Inside one database that promise is cheap. Across services it does not exist, and everything you build there is a controlled approximation.',
    whyItExists:
      'Money, inventory, and seat reservations have invariants that must survive crashes and concurrency. Without transactional guarantees you sell the same seat twice and cannot prove which write won.',
    problemStatement: {
      prompt:
        'A checkout must charge a card, decrement inventory, and create a shipment. Those live in three services with three databases. Guarantee that a customer is never charged for something that was never reserved, and never has inventory held for a payment that failed.',
      inScope: [
        'ACID and what each letter actually buys',
        'Isolation levels and the anomalies each permits',
        'Two-phase commit and why it blocks',
        'Sagas, compensation, the outbox, and idempotency',
      ],
      outOfScope: [
        'Raft and Paxos internals (see the consensus lesson)',
        'Replication topologies (see the replication lesson)',
        'Distributed lock implementations (see the distributed locking lesson)',
        'Payment network settlement rules',
      ],
    },
    assumptions: [
      'Each service owns its own database and no other service writes to it',
      'The network can drop or duplicate any message, and any process can die at any point',
      'Business stakeholders can define what a compensating action means',
    ],
    whenToUse: [
      'Any invariant that spans two or more rows: balances, inventory, seats',
      'Any workflow that spans services and must not leave money in limbo',
      'Whenever the interviewer says "what if it crashes right here?"',
    ],
    functionalRequirements: [
      { title: 'Atomicity', detail: 'All the writes in a unit commit, or none of them do.' },
      { title: 'Correct concurrency', detail: 'Two simultaneous bookings must not both take the last seat.' },
      { title: 'Recovery', detail: 'A crash mid-workflow resolves to a defined end state, not a stuck one.' },
      { title: 'Safe retries', detail: 'A duplicate request produces one effect, not two.' },
    ],
    nonFunctionalRequirements: [
      { title: 'Latency', detail: 'Holding a lock across a network call is how you build a slow, deadlock-prone system.' },
      { title: 'Availability', detail: 'A coordinator failure must not freeze participants indefinitely.' },
      { title: 'Auditability', detail: 'Every state change is recorded, so a dispute can be reconstructed.' },
      { title: 'Bounded inconsistency', detail: 'If the end state is eventual, the window must be short and monitored.' },
    ],
    estimates: [
      { label: 'Local commit', value: '1–5 ms', note: 'Dominated by a WAL fsync' },
      { label: '2PC across services', value: '2 round trips + slowest participant', note: 'Locks held for the whole duration' },
      { label: 'Saga end-to-end', value: '100 ms – seconds', note: 'Each step commits locally and independently' },
      { label: 'Idempotency record TTL', value: '24 h', note: 'Long enough to cover every client retry policy' },
      { label: 'Serializable retry rate', value: '1–5% of transactions', note: 'Your code must handle the serialization failure' },
    ],
    concepts: [
      'ACID and MVCC snapshots',
      'Isolation levels and their anomalies',
      'Optimistic vs pessimistic concurrency',
      'Two-phase commit and coordinator blocking',
      'Saga orchestration and choreography',
      'Compensating transactions',
      'Transactional outbox',
      'Idempotency keys',
    ],
    comparisons: [
      {
        title: 'Isolation levels and the anomalies each one still allows',
        headers: ['Level', 'How it works', 'Still permits', 'Use when'],
        rows: [
          [
            'Read uncommitted',
            'No read protection at all',
            'Dirty reads — you see another transaction uncommitted change',
            'Essentially never',
          ],
          [
            'Read committed',
            'Each statement sees a fresh snapshot of committed data',
            'Non-repeatable reads: the same row read twice differs',
            'The default for most OLTP work',
          ],
          [
            'Repeatable read / snapshot',
            'The whole transaction sees one snapshot taken at the start',
            'Write skew: two transactions each read, then write, and jointly break an invariant',
            'Reports and multi-statement reads that must be consistent',
          ],
          [
            'Serializable',
            'The result is equivalent to some sequential order, enforced by predicate locks or conflict detection',
            'Nothing — but transactions get aborted and must be retried',
            'Money, inventory, seats: anywhere an invariant must hold',
          ],
        ],
        note: 'Write skew is the anomaly worth memorising: two doctors each check "at least one other doctor is on call", each sees the other, and both go off call.',
      },
      {
        title: 'Coordinating across services',
        headers: ['Approach', 'How it works', 'Use when', 'Avoid when'],
        rows: [
          [
            'Two-phase commit',
            'Coordinator asks everyone to prepare, then tells everyone to commit',
            'A single database cluster, or an XA-capable message broker and database',
            'Across services you do not control, or over the public internet',
          ],
          [
            'Saga (orchestrated)',
            'A central workflow drives each local transaction and runs compensations on failure',
            'Multi-service business workflows needing visible state',
            'Steps have no meaningful inverse',
          ],
          [
            'Saga (choreographed)',
            'Each service reacts to events; no central coordinator',
            'Few steps, loose coupling, teams owning their own reactions',
            'You need to answer "where is order 123 stuck?" quickly',
          ],
          [
            'TCC (try-confirm-cancel)',
            'Reserve a resource first, then confirm or cancel it explicitly',
            'Inventory and seats, where a reservation is a natural concept',
            'Services cannot expose a reservation state',
          ],
          [
            'Outbox + idempotent consumer',
            'Write the row and the event in one local transaction; a relay publishes it',
            'Almost every event-driven system — this is the baseline',
            'Never; the alternative is dual writes that silently lose events',
          ],
        ],
      },
    ],
    architecture:
      'Inside one service, use a real database transaction and the strictest isolation the workload can afford. Across services, run a saga: each step is a local transaction, each step has a compensating action, every event is published through an outbox, and every consumer is idempotent.',
    diagrams: [
      { id: 'saga', title: 'Commit locally, compensate on failure', kind: 'excalidraw', src: 'saga-order' },
      {
        id: 'seq',
        title: 'Checkout saga with a failing step',
        kind: 'mermaid',
        src: `sequenceDiagram
  participant C as Checkout
  participant O as Orchestrator
  participant P as Payment
  participant I as Inventory
  participant S as Shipping
  C->>O: place order
  O->>P: authorize card (local commit)
  P-->>O: authorized
  O->>I: reserve 2 units (local commit)
  I-->>O: reserved
  O->>S: book a slot
  S-->>O: no capacity
  O->>I: release reservation (compensate)
  O->>P: void authorization (compensate)
  O-->>C: order failed, nothing charged`,
      },
    ],
    dataModel: [
      {
        name: 'idempotency_keys',
        columns: [
          { name: 'key', type: 'text', notes: 'Client-supplied, scoped to the caller' },
          { name: 'request_hash', type: 'text', notes: 'Detects the same key reused with a different body' },
          { name: 'status', type: 'text', notes: 'in_progress, completed' },
          { name: 'response_body', type: 'jsonb', notes: 'Replayed verbatim on a duplicate' },
          { name: 'expires_at', type: 'timestamptz' },
        ],
        primaryKey: ['key'],
        notes: 'Inserted in the same transaction as the effect. Written separately, a crash between the two lets a retry double-charge.',
      },
      {
        name: 'outbox',
        columns: [
          { name: 'id', type: 'bigserial' },
          { name: 'aggregate_id', type: 'text', notes: 'Used as the partition key so events for one order stay ordered' },
          { name: 'event_type', type: 'text' },
          { name: 'payload', type: 'jsonb' },
          { name: 'published_at', type: 'timestamptz', notes: 'NULL until the relay confirms publication' },
        ],
        primaryKey: ['id'],
        indexes: ['(published_at) WHERE published_at IS NULL'],
        notes: 'Written in the same transaction as the business row, so the event cannot be lost or invented.',
      },
      {
        name: 'saga_steps',
        columns: [
          { name: 'saga_id', type: 'uuid' },
          { name: 'step', type: 'text' },
          { name: 'state', type: 'text', notes: 'pending, done, compensating, compensated' },
          { name: 'attempt', type: 'int' },
        ],
        primaryKey: ['saga_id', 'step'],
        notes: 'Makes "where is order 123 stuck?" a single query, which is the main reason to prefer orchestration.',
      },
    ],
    walkthrough: [
      {
        title: 'Start with a real local transaction',
        description:
          'If everything lives in one database, BEGIN, do the work, COMMIT. Decrementing inventory and inserting a booking in one transaction is atomic and needs none of the machinery below. Reach for distributed patterns only when the data genuinely lives in separate stores.',
      },
      {
        title: 'Pick the isolation level deliberately',
        description:
          'Read committed is the default and permits write skew, which is exactly the anomaly that oversells seats. For the seat-reservation transaction use serializable, or take an explicit row lock with SELECT FOR UPDATE, and be ready to retry on a serialization failure.',
      },
      {
        title: 'Make the entry point idempotent',
        description:
          'The client sends an Idempotency-Key. Insert the key row and the effect in the same transaction. A replay finds the key, returns the stored response, and creates nothing new. This alone prevents most double-charge incidents.',
      },
      {
        title: 'Split the workflow into local transactions',
        description:
          'Authorize the payment, reserve the inventory, book the shipment. Each commits independently in its own service. There is no global lock and no coordinator holding anyone hostage, which is the entire point of a saga.',
      },
      {
        title: 'Publish through the outbox',
        description:
          'Each service writes its business row and an outbox row in one transaction, and a relay tails the outbox and publishes. If the process dies after the commit, the relay still publishes; if it dies before, nothing happened at all.',
      },
      {
        title: 'Compensate in reverse on failure',
        description:
          'Shipping has no capacity, so the orchestrator releases the inventory reservation and voids the payment authorization, in reverse order. The customer sees a clean failure, and nothing is left half-committed.',
      },
    ],
    deepDives: [
      {
        title: 'Write skew is the anomaly that costs money',
        body:
          'Two transactions read overlapping rows, each decides an invariant still holds, and each then writes — jointly breaking it. Two people book the last seat: both read availability as one, both insert a booking, and both commit, because neither modified the row the other read. Snapshot isolation does not stop this, which surprises people who assume repeatable read is safe. The fixes are serializable isolation, which detects the conflict and aborts one transaction, a pessimistic SELECT FOR UPDATE on the seat row, or materialising the conflict as a unique constraint on (event_id, seat_number) so the database rejects the second insert outright.',
      },
      {
        title: 'Why two-phase commit does not scale across services',
        body:
          'In the prepare phase every participant durably promises it can commit and holds its locks. If the coordinator dies between prepare and commit, participants are stuck: they may not commit, because the decision might have been abort, and they may not abort, because it might have been commit. They hold locks until an operator intervenes. Availability is also multiplicative — with five participants at 99.9% each, the transaction succeeds about 99.5% of the time, and it gets worse with every service added. That blocking window is why sagas won for cross-service workflows despite giving up atomicity.',
      },
      {
        title: 'Every saga step needs a real inverse',
        body:
          'Compensation is a business action, not a rollback. You cannot un-send an email, so you send a correction. You cannot un-ship a parcel, so you issue a return label. A payment authorization is voided, but a captured payment is refunded, which is a different operation with different fees and a different ledger entry. Design the order of steps so that the least reversible action comes last: authorize before capture, reserve before ship. If a step has no meaningful inverse and cannot be moved to the end, that is a signal the workflow needs a human approval gate rather than automatic compensation.',
      },
      {
        title: 'The outbox pattern in detail',
        body:
          'The failure being prevented is the dual write: commit the order row, then publish the event, and die in between. The order exists and nobody downstream knows. The outbox writes both rows in one local transaction, so they are atomic by construction. A relay — either polling the unpublished rows or tailing the write-ahead log via change data capture — publishes and marks them sent. Delivery is at-least-once, so consumers must deduplicate on the event id. Ordering is preserved per aggregate if you use the aggregate id as the partition key.',
      },
      {
        title: 'Optimistic versus pessimistic concurrency',
        body:
          'Pessimistic locking takes the row lock first with SELECT FOR UPDATE, so conflicting writers queue. It is predictable and correct, but a lock held across a network call is a deadlock and latency disaster. Optimistic concurrency reads a version number, does the work, and writes with WHERE version = :seen; zero rows updated means someone else won, so you retry. It is ideal when conflicts are rare, as with editing your own profile. Use pessimistic locking for genuinely contended rows like the last seat at a popular event, and optimistic everywhere else.',
      },
      {
        title: 'Orchestration versus choreography',
        body:
          'In choreography each service listens for events and reacts, so there is no central component and coupling is low. The cost appears the first time someone asks why order 123 is stuck: the answer is distributed across five services logs, and the implicit workflow exists only in aggregate. Orchestration puts the sequence in one place with an explicit state machine you can query, alert on, and resume. For anything touching money, orchestration is usually worth its central component, because operability during an incident matters more than diagram elegance.',
      },
      {
        title: 'Exactly-once is a property of effects, not of delivery',
        body:
          'No messaging system can deliver exactly once across a network that can drop acknowledgements — the sender cannot distinguish a lost message from a lost ack. What is achievable is at-least-once delivery combined with an effect that is idempotent, which is observationally identical. Implement it by storing a processed-event id in the same transaction as the effect, so a redelivery finds the id and does nothing. Frameworks advertising exactly-once, such as Kafka transactions, are doing precisely this internally with atomic offset commits.',
      },
    ],
    tradeoffs: [
      'Serializable isolation is correct and forces your code to handle retries.',
      'Sagas give availability and give up atomicity; there is a visible window of partial completion.',
      'Orchestration is operable and adds a central component to run.',
      'Pessimistic locks are simple and serialise throughput on contended rows.',
    ],
    bottlenecks: [
      'A hot row such as one popular event seat map, serialising every booking.',
      'Long transactions holding locks or MVCC snapshots open.',
      'Serialization failures under contention causing a retry storm.',
      'An outbox relay falling behind and delaying every downstream effect.',
    ],
    scalingPath: [
      { scale: 'Prototype', focus: 'One database, one transaction, read committed' },
      { scale: 'One region', focus: 'Serializable on the money path, idempotency keys, outbox for events' },
      { scale: 'Global', focus: 'Orchestrated sagas across services, per-aggregate ordering, reconciliation jobs' },
    ],
    interviewScript: [
      '"Inventory and booking are in one database, so that part is a single transaction."',
      '"The seat check is a write skew risk, so it runs serializable or takes an explicit row lock."',
      '"Checkout carries an Idempotency-Key, stored in the same transaction as the charge."',
      '"Across services I use a saga: authorize, reserve, ship, each committing locally."',
      '"Events go through an outbox, so we never write a row and lose its event."',
      '"If shipping fails we release the reservation and void the authorization, in reverse order."',
      '"I would not use two-phase commit here, because a coordinator crash leaves participants holding locks."',
    ],
    commonMistakes: [
      'Assuming the default isolation level prevents overselling.',
      'Dual-writing to the database and the message broker.',
      'Designing sagas without defining the compensating action for each step.',
      'Retrying a payment without an idempotency key.',
      'Holding a database transaction open across an HTTP call.',
      'Claiming exactly-once delivery instead of idempotent effects.',
    ],
    relatedTopics: ['databases', 'message-queues', 'replication', 'distributed-locking', 'consensus', 'paytm', 'bookmyshow'],
    examples: [
      'Stripe uses idempotency keys on every mutating endpoint as the reference pattern',
      'Uber built Cadence, and later Temporal, to make long-running sagas durable and queryable',
      'Booking systems reserve inventory with a TTL, then confirm or expire it — a TCC in practice',
    ],
    practicePrompt:
      'Design checkout across payment, inventory, and shipping services. Specify each compensating action and exactly what the customer sees when step three fails.',
    followUps: [
      {
        question: 'Does serializable isolation make my code simpler?',
        answer:
          'It makes reasoning simpler and the code slightly harder, because transactions can now be aborted with a serialization failure and your application must retry them. That retry loop, with a bounded attempt count and backoff, is the price of never having to reason about write skew again — usually a good trade on the money path.',
        category: 'Isolation',
        difficulty: 'medium',
      },
      {
        question: 'How do you prevent overselling the last seat?',
        answer:
          'Three workable options: serializable isolation so the conflicting transaction aborts, an explicit SELECT FOR UPDATE on the seat row so writers queue, or a unique constraint on (event_id, seat_number) so the second insert is rejected by the database. The constraint is the most robust because it holds regardless of application bugs.',
        category: 'Concurrency',
        difficulty: 'medium',
      },
      {
        question: 'When is two-phase commit acceptable?',
        answer:
          'Within one administrative boundary where the coordinator is highly available and participants are trusted — a distributed SQL engine committing across its own partitions, for example, where the coordinator itself is replicated by consensus. Across independently owned services it is a liability, because the blocking window becomes someone else incident.',
        category: 'Coordination',
        difficulty: 'hard',
      },
      {
        question: 'What if a compensating action itself fails?',
        answer:
          'Retry it with backoff, because compensations must be idempotent by design. If it keeps failing, park the saga in a dead-letter state with full context and alert a human. Never silently abandon it: an unfinished compensation means a customer is charged for something they did not receive, which is the failure mode this whole pattern exists to prevent.',
        category: 'Failure',
        difficulty: 'hard',
      },
      {
        question: 'Is the outbox not just a queue in your database?',
        answer:
          'Yes, deliberately. Its value is being in the same database as the business data, so one transaction covers both. It is a staging table, not a long-term broker — a relay moves rows to the real broker within milliseconds and deletes or marks them. The tables stays small.',
        category: 'Messaging',
        difficulty: 'medium',
      },
      {
        question: 'How long should idempotency keys be retained?',
        answer:
          'Longer than any client will retry, typically 24 hours, and long enough to cover a mobile app that retries after a day offline. Store the response so a replay returns the original result rather than reprocessing, and return 409 if the same key arrives with a different body, which indicates a client bug.',
        category: 'Reliability',
        difficulty: 'medium',
      },
      {
        question: 'What is TCC and when is it better than a plain saga?',
        answer:
          'Try-Confirm-Cancel makes the reservation explicit: try holds the resource with a timeout, confirm commits it, cancel releases it. It is better than after-the-fact compensation when the resource is genuinely scarce, because nobody else can take the seat during the workflow. It requires each service to expose a reservation state, which not all can.',
        category: 'Coordination',
        difficulty: 'hard',
      },
      {
        question: 'Can you do sagas without a workflow engine?',
        answer:
          'For three steps, yes: a state machine table plus a retry worker is enough. Engines like Temporal earn their place when you need durable timers, versioned workflow code, automatic retries with history, and a queryable state across thousands of in-flight sagas. Below that threshold the engine is more operational surface than it saves.',
        category: 'Coordination',
        difficulty: 'medium',
      },
      {
        question: 'How do you audit a distributed workflow after a dispute?',
        answer:
          'Persist every state transition with a timestamp, actor, and correlation id, and keep the events immutably rather than only the current state. Event sourcing takes this to its conclusion by making the event log the source of truth. For most systems an append-only audit table keyed by the saga id, plus the outbox history, is enough to reconstruct what happened.',
        category: 'Auditing',
        difficulty: 'medium',
      },
      {
        question: 'Does a distributed SQL database remove the need for sagas?',
        answer:
          'Only within one database. Spanner or CockroachDB can commit atomically across partitions, so if all your data is in that one cluster you can use ordinary transactions. The moment a workflow calls an external payment provider or another team service, you are back to sagas, because you cannot enlist someone else system in your transaction.',
        category: 'Coordination',
        difficulty: 'hard',
      },
    ],
  }),
};
