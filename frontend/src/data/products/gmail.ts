import { ArchitectureTopic, emptyContent } from '../systemDesignTypes';

const SEND_SEQUENCE = `sequenceDiagram
  participant App
  participant SendAPI
  participant Outbox
  participant MTA
  participant RecipStore
  App->>SendAPI: POST messages
  SendAPI->>Outbox: durable send job
  SendAPI-->>App: message id
  Outbox->>MTA: SMTP
  MTA->>RecipStore: inbound deliver
  RecipStore->>RecipStore: index async`;

const ER_DIAGRAM = `erDiagram
  USERS ||--o{ MAILBOXES : owns
  MAILBOXES ||--o{ MESSAGES : stores
  MESSAGES ||--o{ LABELS : tagged
  MESSAGES ||--o{ THREADS : groups`;

export const gmailTopic: ArchitectureTopic = {
  id: 'gmail',
  title: 'Gmail',
  description: 'Mailbox storage, threads and labels, SMTP send/receive, and search that is not a table scan.',
  difficulty: 'Advanced',
  progress: 0,
  icon: 'Mail',
  color: 'bg-red-500',
  section: 'products',
  track: 'classic',
  prerequisites: ['databases', 'search-feeds', 'storage-media', 'reliability'],
  estimatedMinutes: 65,
  order: 34,
  content: emptyContent({
    overview:
      'Gmail is a mailbox plus a search index plus an MTA. Send is an outbox job. Inbox is a query over labels, not folders that copy bytes. Threads group by normalized subject and participants.',
    whyItExists:
      'People need reliable send/receive, a huge searchable history, and labels that do not duplicate the message.',
    whenToUse: ['Email interviews', 'Search over personal data', 'Exactly-once-ish delivery'],
    problemStatement: {
      prompt:
        'Design an email service like Gmail. Users send and receive mail, organize with labels and threads, search years of history, and read on multiple devices.',
      inScope: [
        'Send via SMTP outbox',
        'Receive and store inbound',
        'Inbox / labels / threads',
        'Search',
        'Attachments in object storage',
        'Multi-device sync via cursors',
      ],
      outOfScope: [
        'Full anti-spam ML training',
        'Calendar / Meet',
        'Confidential mode cryptography deep dive',
        'Ad targeting',
      ],
    },
    assumptions: [
      'A power user has millions of messages. Scan-on-read is dead.',
      'Attachments dominate bytes; bodies are smaller but numerous.',
      'SMTP is unreliable; the outbox retries.',
      'Labels are many-to-many tags, not mutually exclusive folders.',
    ],
    functionalRequirements: [
      { title: 'Send', detail: 'Compose, outbox, retry, bounce.' },
      { title: 'Receive', detail: 'Inbound SMTP or fetch, store, notify.' },
      { title: 'Read / unread', detail: 'Per user, synced across devices.' },
      { title: 'Labels and threads', detail: 'A message can have many labels. Threads group replies.' },
      { title: 'Search', detail: 'From, to, subject, body, attachments, operators.' },
      { title: 'Attachments', detail: 'Signed upload, virus scan, CDN-ish download.' },
    ],
    nonFunctionalRequirements: [
      { title: 'Send ACK', detail: 'Durable outbox quickly. SMTP can be later.' },
      { title: 'Inbox p99', detail: 'First page fast from a label index, not a full mailbox sort.' },
      { title: 'Search', detail: 'Seconds of index lag is OK. Query p99 of a few hundred ms.' },
      { title: 'Durability', detail: 'Mail is money-adjacent. Multi-AZ, no silent drop.' },
      { title: 'Spam', detail: 'Inbound must be classified before it is “inbox”.' },
    ],
    estimates: [
      { label: 'Mailbox size', value: 'Up to millions of messages', note: 'Index everything; never SELECT *.' },
      { label: 'Attachments', value: 'Dominate storage', note: 'Dedup by hash when you can.' },
      { label: 'Inbound QPS', value: 'Bursty (newsletters, outages)', note: 'MTA queue absorbs it.' },
      { label: 'Search', value: 'Per-user index', note: 'Not one global Lucene for all of Gmail.' },
    ],
    concepts: ['Outbox', 'Label index', 'Thread key', 'Per-user search', 'Attachment store'],
    walkthrough: [
      {
        title: 'Send',
        description:
          'Persist the message in the sender mailbox (Sent) and enqueue an outbox job. ACK the client. The MTA talks SMTP and records bounces. Do not block the UI on the remote MX.',
        diagram: SEND_SEQUENCE,
      },
      {
        title: 'Receive',
        description:
          'MTA accepts, spam pipeline scores, then the mailbox service writes the message, attaches default labels (Inbox or Spam), and notifies devices. Search index is async.',
      },
      {
        title: 'Open inbox',
        description:
          'Read the Inbox label’s posting list, newest first, hydrate a page of thread headers. Not a scan of the mailbox table.',
      },
    ],
    apis: [
      {
        method: 'POST',
        path: '/v1/messages',
        description: 'Send. Body plus recipients. Attachments already uploaded.',
        request: `{\n  "to": ["a@x.com"],\n  "subject": "Invoice",\n  "body": "…",\n  "attachmentIds": ["att_1"]\n}`,
        response: `{\n  "id": "m_9",\n  "threadId": "th_3",\n  "labelIds": ["SENT"]\n}`,
        errors: `{\n  "413": "Too large",\n  "429": "Send quota"\n}`,
      },
      {
        method: 'GET',
        path: '/v1/labels/:id/threads',
        description: 'Inbox or any label, paged by thread.',
        response: `{\n  "threads": [{ "id": "th_3", "snippet": "Invoice", "unread": true }]\n}`,
      },
      {
        method: 'POST',
        path: '/v1/messages/:id/labels',
        description: 'Add or remove labels. Does not copy the blob.',
        request: `{\n  "add": ["STARRED"],\n  "remove": ["INBOX"]\n}`,
        response: `{\n  "labelIds": ["SENT", "STARRED"]\n}`,
      },
      {
        method: 'GET',
        path: '/v1/search',
        description: 'Per-user search with Gmail-style operators.',
        request: `{\n  "q": "from:a@x.com has:attachment"\n}`,
        response: `{\n  "threadIds": ["th_3"]\n}`,
      },
      {
        method: 'POST',
        path: '/v1/attachments/upload-url',
        description: 'Signed PUT for an attachment blob.',
        response: `{\n  "attachmentId": "att_1",\n  "uploadUrl": "https://store.example/att_1"\n}`,
      },
    ],
    dataModel: [
      {
        name: 'messages',
        primaryKey: ['message_id'],
        columns: [
          { name: 'message_id', type: 'uuid' },
          { name: 'user_id', type: 'uuid', notes: 'Mailbox owner (a copy per recipient)' },
          { name: 'thread_id', type: 'uuid' },
          { name: 'rfc_id', type: 'text' },
          { name: 'body_ref', type: 'text' },
          { name: 'ts', type: 'timestamptz' },
        ],
        indexes: ['(user_id, ts DESC)'],
      },
      {
        name: 'label_messages',
        primaryKey: ['user_id', 'label_id', 'message_id'],
        columns: [
          { name: 'user_id', type: 'uuid' },
          { name: 'label_id', type: 'text' },
          { name: 'message_id', type: 'uuid' },
          { name: 'ts', type: 'timestamptz' },
        ],
        notes: 'Inbox is a label. Moving mail is a pointer change.',
      },
      {
        name: 'threads',
        primaryKey: ['thread_id'],
        columns: [
          { name: 'thread_id', type: 'uuid' },
          { name: 'user_id', type: 'uuid' },
          { name: 'subject_norm', type: 'text' },
          { name: 'last_ts', type: 'timestamptz' },
        ],
      },
      {
        name: 'attachments',
        primaryKey: ['attachment_id'],
        columns: [
          { name: 'attachment_id', type: 'uuid' },
          { name: 'sha256', type: 'text' },
          { name: 'object_key', type: 'text' },
          { name: 'size', type: 'bigint' },
        ],
      },
    ],
    architecture:
      'Send API writes the mailbox and an outbox. MTAs send and receive. A spam pipeline labels inbound. Mailbox storage is per-user shards. A label index makes Inbox fast. A per-user search index updates asynchronously. Attachments are object storage with optional hash dedup. Devices sync with a mailbox cursor.',
    diagram: `flowchart LR
    App --> SendAPI
    SendAPI --> Outbox
    Outbox --> MTA
    MTA --> Spam
    Spam --> Mailbox
    Mailbox --> Labels[(Label index)]
    Mailbox --> SearchQ
    App --> Labels
    App --> Search`,
    diagrams: [{ id: 'er', title: 'Entity relationships', kind: 'mermaid', src: ER_DIAGRAM }],
    deepDives: [
      {
        title: 'Labels are not folders',
        body: 'A folder model copies or moves the blob. A label is a row in label_messages. “Archive” is remove INBOX. The message row stays. That is why one mail can be STARRED and INBOX.',
      },
      {
        title: 'Threads',
        body: 'Group by a normalized subject plus a participant set, or by RFC In-Reply-To. Store thread_id on each message so the inbox shows one row per conversation.',
      },
      {
        title: 'Per-user search',
        body: 'A global index would mix tenants and explode posting lists. Each mailbox has an index. Operators (from:, has:attachment) are fields. Index after spam classification.',
      },
      {
        title: 'At-least-once SMTP',
        body: 'Outbound retries can double-send. Idempotency keys and a Message-ID help the receiver dedup. Be honest: email is not exactly-once.',
      },
    ],
    tradeoffs: [
      'Copy-per-recipient vs pointers to one blob (privacy vs storage).',
      'Index lag vs blocking receive on search.',
      'Aggressive spam vs false positives on real mail.',
    ],
    bottlenecks: ['Inbox of a 15-year power user', 'Newsletter storms', 'Attachment store', 'Spam CPU'],
    scalingPath: [
      { scale: 'v1', focus: 'IMAP on one maildir.' },
      { scale: 'v2', focus: 'Per-user shards, label index, outbox, attachment store.' },
      { scale: 'Gmail', focus: 'Per-user search, spam pipeline, multi-device cursors, deduped blobs.' },
    ],
    interviewScript: [
      '“Send ACKs an outbox. SMTP is async.”',
      '“Inbox is a label index, not a folder of copied files.”',
      '“Search is per user and lagged by seconds.”',
    ],
    commonMistakes: [
      'Folders that duplicate blobs',
      'SELECT * FROM messages WHERE user_id ORDER BY ts',
      'Blocking send on remote SMTP',
      'One global search index for all users',
    ],
    relatedTopics: ['search-feeds', 'slack', 'storage-media', 'google-search'],
    examples: ['Gmail', 'Outlook'],
    practicePrompt: 'A user searches “invoice 2019 has:attachment”. Walk indexes, ACL, and why this is not a SQL LIKE.',
    followUps: [
      {
        question: 'How do you implement “undo send” in 10 seconds?',
        category: 'scale',
        difficulty: 'easy',
        answer:
          'Hold the outbox job for N seconds before the MTA. Undo cancels the job. After SMTP, undo is a lie — you can only send a retraction.',
      },
      {
        question: 'A message to 50 recipients — one blob or 50?',
        category: 'scale',
        difficulty: 'medium',
        answer:
          'One attachment blob (hash), many mailbox rows (per-recipient labels, spam, and legal isolation). Do not share a mutable row across users.',
      },
      {
        question: 'How do threads survive “Re: Re: Fwd:”?',
        category: 'scale',
        difficulty: 'medium',
        answer:
          'Prefer In-Reply-To / References headers. Fall back to normalized subject plus participants. Show the algorithm and its failure cases (two unrelated “Hello” mails).',
      },
      {
        question: 'Multi-device unread.',
        category: 'scale',
        difficulty: 'medium',
        answer:
          'Unread is a label or a flag on the per-user message row. Sync is a cursor of mutations. Last write wins, or a vector if you are fancy. Do not store unread only on one phone.',
      },
      {
        question: 'Where does spam sit relative to Inbox?',
        category: 'privacy',
        difficulty: 'medium',
        answer:
          'Classify before default labels. Spam is a label, not a delete. Users can move. The search index should still find it with in:spam.',
      },
      {
        question: 'How is Gmail search different from Google Search?',
        category: 'ranking',
        difficulty: 'easy',
        answer:
          'Personal corpus, strict ACL, structured operators, freshness of seconds. Web search is a global, ranked, eventually consistent index of the public web. Do not reuse PageRank here.',
      },
    ],
  }),
};
