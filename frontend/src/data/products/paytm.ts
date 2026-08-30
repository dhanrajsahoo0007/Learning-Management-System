import { ArchitectureTopic, emptyContent } from '../systemDesignTypes';

const PAY_SEQUENCE = `sequenceDiagram
  participant App
  participant Ledger
  participant PSP
  App->>Ledger: POST payments
  Ledger->>Ledger: reserve debit
  Ledger-->>App: payment id pending
  Ledger->>PSP: capture or UPI collect
  PSP-->>Ledger: webhook
  Ledger->>Ledger: post journal
  Ledger-->>App: push settled`;

const ER_DIAGRAM = `erDiagram
  USERS ||--|| WALLETS : owns
  WALLETS ||--o{ JOURNAL : posts
  USERS ||--o{ PAYMENTS : starts
  PAYMENTS ||--o{ JOURNAL : settles`;

export const paytmTopic: ArchitectureTopic = {
  id: 'paytm',
  title: 'Paytm / Digital Wallet',
  description: 'Ledger-first wallet, UPI/PSP rails, idempotent payments, and a balance that is never a single integer update.',
  difficulty: 'Advanced',
  progress: 0,
  icon: 'Wallet',
  color: 'bg-sky-700',
  section: 'products',
  track: 'classic',
  prerequisites: ['databases', 'reliability', 'api-gateway', 'caching'],
  estimatedMinutes: 75,
  order: 36,
  content: emptyContent({
    overview:
      'A digital wallet is a ledger. The displayed balance is a projection. Payments are state machines with idempotency keys. UPI and cards are rails you call, not your source of truth.',
    whyItExists:
      'People move money to peers and merchants with a phone. Double-spend and lost webhooks are the interview.',
    whenToUse: ['Payments / ledger', 'Idempotency', 'Exactly-once-ish money movement'],
    problemStatement: {
      prompt:
        'Design a digital wallet like Paytm. Users onboard, hold a balance, add money from a bank, pay peers or merchants (UPI/QR), and see a transaction history.',
      inScope: [
        'KYC-lite onboarding and a wallet account',
        'Add money / withdraw',
        'P2P transfer',
        'Merchant QR pay',
        'Ledger, statement, notifications',
        'Idempotent retries and webhook handling',
      ],
      outOfScope: [
        'Full bank core / NEFT internals',
        'Mutual funds and gold',
        'Credit card issuing',
        'Detailed RBI policy beyond “we need an audit log”',
      ],
    },
    assumptions: [
      'India-scale: huge UPI QPS, tiny average ticket.',
      'A payment can fail after we debit if we are sloppy — so we reserve, then post.',
      'PSP/UPI webhooks are at-least-once and delayed.',
      'Balance is not SELECT SUM in the request path at scale — but the ledger can reconstruct it.',
    ],
    functionalRequirements: [
      { title: 'Onboard', detail: 'User, device, KYC state, wallet account.' },
      { title: 'Add money', detail: 'Collect from bank/UPI into the wallet.' },
      { title: 'P2P', detail: 'Pay a phone number / VPA.' },
      { title: 'Merchant pay', detail: 'Scan QR, enter amount, confirm.' },
      { title: 'History', detail: 'Statement with statuses: pending, success, failed, reversed.' },
      { title: 'Notifications', detail: 'Push on settle. SMS as fallback.' },
    ],
    nonFunctionalRequirements: [
      { title: 'No double spend', detail: 'Serializable or carefully reserved balances per account.' },
      { title: 'Idempotency', detail: 'Client key on every pay. Webhooks too.' },
      { title: 'Audit', detail: 'Immutable journal. You can replay a balance.' },
      { title: 'Latency', detail: 'P2P wallet-to-wallet can be tens of ms. UPI is the rail’s SLA.' },
      { title: 'Availability', detail: 'Reads of balance can degrade. Posts cannot silently succeed twice.' },
    ],
    estimates: [
      { label: 'Pay QPS', value: 'Tens to hundreds of thousands at peak', note: 'Festival / IPL. Shard by wallet_id.' },
      { label: 'Ticket size', value: 'Small', note: 'Overhead per payment matters.' },
      { label: 'Webhook delay', value: 'Seconds to minutes', note: 'UI must show pending honestly.' },
      { label: 'Hot merchants', value: 'One QR, huge inbound', note: 'Do not lock one merchant row for every pay.' },
    ],
    concepts: ['Journal / ledger', 'Reserve then post', 'Idempotency key', 'Webhook inbox', 'Balance projection'],
    walkthrough: [
      {
        title: 'Wallet-to-wallet P2P',
        description:
          'Idempotency key in, lock or compare-and-set the payer’s available balance, write a pending journal pair, ACK. A worker posts the payee credit. One transaction, two lines.',
        diagram: PAY_SEQUENCE,
      },
      {
        title: 'UPI collect',
        description:
          'Create a payment row, call the rail, wait for a webhook. On success, post the journal. On failure, release the reserve. A duplicate webhook no-ops because the payment ID is the idempotency key.',
      },
      {
        title: 'Read balance',
        description:
          'Read a cached projection updated by the journal poster. A daily recon job compares projection to SUM of journal. Never increment wallets.balance in five places.',
      },
    ],
    apis: [
      {
        method: 'GET',
        path: '/v1/wallet',
        description: 'Available and pending balance.',
        response: `{\n  "availablePaise": 120050,\n  "pendingPaise": 0\n}`,
      },
      {
        method: 'POST',
        path: '/v1/payments',
        description: 'Create a payment. Idempotent on Idempotency-Key.',
        request: `{\n  "type": "p2p",\n  "to": "9876543210",\n  "amountPaise": 50000,\n  "note": "food"\n}`,
        response: `{\n  "id": "pay_1",\n  "status": "pending"\n}`,
        errors: `{\n  "402": "Insufficient funds",\n  "409": "Idempotency key reused with different body"\n}`,
      },
      {
        method: 'GET',
        path: '/v1/payments/:id',
        description: 'Client polls if the push is late.',
        response: `{\n  "id": "pay_1",\n  "status": "success"\n}`,
      },
      {
        method: 'POST',
        path: '/v1/webhooks/upi',
        description: 'Rail callback. Must be idempotent on rail_ref.',
        request: `{\n  "railRef": "upi_9",\n  "paymentId": "pay_1",\n  "status": "success"\n}`,
        response: `{\n  "ok": true\n}`,
      },
      {
        method: 'GET',
        path: '/v1/statement',
        description: 'Cursor over the journal, not a live SUM.',
        response: `{\n  "entries": [{ "id": "j_1", "amountPaise": -50000, "ts": "…" }]\n}`,
      },
    ],
    dataModel: [
      {
        name: 'wallets',
        primaryKey: ['wallet_id'],
        columns: [
          { name: 'wallet_id', type: 'uuid' },
          { name: 'user_id', type: 'uuid' },
          { name: 'available_paise', type: 'bigint', notes: 'Projection' },
          { name: 'version', type: 'int', notes: 'CAS' },
        ],
      },
      {
        name: 'payments',
        primaryKey: ['payment_id'],
        columns: [
          { name: 'payment_id', type: 'uuid' },
          { name: 'idempotency_key', type: 'text' },
          { name: 'from_wallet', type: 'uuid' },
          { name: 'to_wallet', type: 'uuid' },
          { name: 'amount_paise', type: 'bigint' },
          { name: 'status', type: 'enum' },
          { name: 'rail_ref', type: 'text' },
        ],
        indexes: ['UNIQUE (user_id, idempotency_key)', 'UNIQUE (rail_ref)'],
      },
      {
        name: 'journal',
        primaryKey: ['entry_id'],
        columns: [
          { name: 'entry_id', type: 'uuid' },
          { name: 'wallet_id', type: 'uuid' },
          { name: 'payment_id', type: 'uuid' },
          { name: 'amount_paise', type: 'bigint', notes: 'Signed' },
          { name: 'ts', type: 'timestamptz' },
        ],
        indexes: ['(wallet_id, ts DESC)'],
        notes: 'Append-only. The audit trail.',
      },
    ],
    architecture:
      'An API gateway with idempotency. A ledger service owns wallets, payments, and the journal. PSP/UPI adapters are outbound workers plus a webhook inbox. Notifications consume payment.settled. History reads the journal. Balance is a projection with a recon job.',
    diagram: `flowchart TB
    App --> API
    API --> Ledger
    Ledger --> Journal[(Journal)]
    Ledger --> PSP[UPI / card adapter]
    PSP --> Webhooks
    Webhooks --> Ledger
    Ledger --> Notify`,
    diagrams: [{ id: 'er', title: 'Entity relationships', kind: 'mermaid', src: ER_DIAGRAM }],
    deepDives: [
      {
        title: 'Never UPDATE balance in three services',
        body: 'One ledger posts journal lines. Balance is derived or a single projection updated in the same transaction as the journal. Two writers is how you invent money.',
      },
      {
        title: 'Idempotency keys',
        body: 'Client sends a key per user intent. Same key + same body = return the original payment. Same key + different body = 409. Webhooks use the rail reference as a second unique key.',
      },
      {
        title: 'Reserve then post',
        body: 'Debit available, credit pending, call the rail. Success: pending → posted. Fail: release. A crash after debit without a payment row is the bug — write the payment first.',
      },
      {
        title: 'Hot merchant QR',
        body: 'Do not serialize all pays on the merchant wallet row. Credit fan-in can be sharded or posted asynchronously from a queue of successful pays, with a periodic recon.',
      },
    ],
    tradeoffs: [
      'Synchronous P2P vs always-async rails.',
      'Strong ledger vs availability during a region outage (you fail closed on money).',
      'Showing pending vs only showing settled (honesty vs support tickets).',
    ],
    bottlenecks: ['Hot merchant credits', 'Webhook storms', 'Festival P2P', 'Recon backlog'],
    scalingPath: [
      { scale: 'v1', focus: 'One SQL ledger, one PSP, unique payment IDs.' },
      { scale: 'v2', focus: 'Sharded wallets, webhook inbox, projection + recon.' },
      { scale: 'India peak', focus: 'Merchant credit queue, rail-specific adapters, freeze/AML lane.' },
    ],
    interviewScript: [
      '“The ledger is the product. UPI is a rail.”',
      '“Idempotency on the client key and on the webhook.”',
      '“I reserve, then post. I do not increment a balance in the HTTP handler.”',
    ],
    commonMistakes: [
      'balance = balance + x without a journal',
      'No idempotency key',
      'Trusting a single webhook',
      'Locking the merchant row for every QR pay',
    ],
    relatedTopics: ['reliability', 'databases', 'zomato', 'bookmyshow'],
    examples: ['Paytm', 'PhonePe', 'GPay'],
    practicePrompt: 'The UPI webhook arrives twice, two minutes apart, for the same rail_ref. Walk both times through your tables.',
    followUps: [
      {
        question: 'What if the process dies after debiting and before calling UPI?',
        category: 'matching',
        difficulty: 'hard',
        answer:
          'The payment row exists in pending. A sweeper retries the rail or reverses the reserve after a timeout. The journal is the recovery map. This is why the payment is written first.',
      },
      {
        question: 'How do you reverse a successful pay?',
        category: 'matching',
        difficulty: 'medium',
        answer:
          'A new payment of type refund that posts opposite journal lines, linked to the original ID. Do not DELETE journal rows. Ever.',
      },
      {
        question: 'P2P to an unregistered phone number.',
        category: 'scale',
        difficulty: 'medium',
        answer:
          'Create a claimable credit (voucher) keyed by phone. On signup, a job posts it to the new wallet. Expiry returns money to the sender. Do not invent a wallet for a ghost user without a policy.',
      },
      {
        question: 'Why paise / minor units, not floats?',
        category: 'matching',
        difficulty: 'easy',
        answer:
          'Money is integer minor units. Floats invent and destroy paise. Say this out loud; interviewers listen for it.',
      },
      {
        question: 'Festival 10x QPS — what do you shed?',
        category: 'scale',
        difficulty: 'hard',
        answer:
          'Queue merchant credits, cache KYC reads, keep the debit path strictly serial per wallet. History and offers can degrade. The ledger cannot.',
      },
      {
        question: 'How is this different from a food-order payment?',
        category: 'scale',
        difficulty: 'medium',
        answer:
          'Zomato holds a payment against an order state machine (authorize on place, capture on accept / complete). The wallet is still a ledger. The extra object is the order, not a second balance.',
      },
    ],
  }),
};
