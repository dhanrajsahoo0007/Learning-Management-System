import { ArchitectureTopic, emptyContent } from '../systemDesignTypes';

const SEND_SEQUENCE = `sequenceDiagram
  participant App
  participant Gateway
  participant Channel
  participant Fanout
  participant Push
  App->>Gateway: POST message
  Gateway->>Channel: append
  Channel-->>App: ack id ts
  Channel->>Fanout: new message
  Fanout->>App: websocket to online members
  Fanout->>Push: offline members`;

const ER_DIAGRAM = `erDiagram
  WORKSPACES ||--o{ CHANNELS : has
  CHANNELS ||--o{ MEMBERSHIPS : includes
  CHANNELS ||--o{ MESSAGES : contains
  MESSAGES ||--o{ THREADS : replies
  USERS ||--o{ MEMBERSHIPS : joins`;

export const slackTopic: ArchitectureTopic = {
  id: 'slack',
  title: 'Slack',
  description: 'Workspace channels, ordered message log, presence, search, and fan-out that is not WhatsApp 1:1.',
  difficulty: 'Advanced',
  progress: 0,
  icon: 'Hash',
  color: 'bg-purple-600',
  section: 'products',
  track: 'classic',
  prerequisites: ['realtime', 'search-feeds', 'message-queues', 'databases'],
  estimatedMinutes: 70,
  order: 33,
  content: emptyContent({
    overview:
      'Slack is a workspace of channels. A message is an append to a channel log, then fan-out to members who are online. Search, files, and presence are separate. Do not design WhatsApp E2E 1:1 and call it Slack.',
    whyItExists:
      'Teams need persistent, searchable rooms — not disappearing 1:1 chats and not email.',
    whenToUse: ['Channel fan-out', 'Presence', 'Workspace search', 'Contrast with WhatsApp'],
    problemStatement: {
      prompt:
        'Design a workplace chat product like Slack. Users belong to a workspace, join channels, send messages and threads, see who is online, share files, and search history.',
      inScope: [
        'Workspaces, channels, DMs as a two-person channel',
        'Ordered messages and threads',
        'Realtime fan-out to online members',
        'Unread / badge',
        'Presence (active / away)',
        'File upload via object storage',
        'Search within a workspace',
      ],
      outOfScope: [
        'E2E encryption (WhatsApp)',
        'Video calls (Zoom)',
        'Huddles internals',
        'App Directory / slash-command marketplace',
      ],
    },
    assumptions: [
      'A workspace can have tens of thousands of users. A public channel can be huge.',
      'Most users are idle. Online fan-out is much smaller than membership.',
      'History is retained (paid) and must be searchable.',
      'DMs are channels with two members — one code path.',
    ],
    functionalRequirements: [
      { title: 'Channels', detail: 'Public, private, DM. Join / leave.' },
      { title: 'Send / edit / delete', detail: 'Ordered in a channel. Threads are a child log.' },
      { title: 'Realtime', detail: 'Online members see the message in about a second.' },
      { title: 'Unread', detail: 'Per channel last-read cursor.' },
      { title: 'Presence', detail: 'Active, away, DND. Approximate is OK.' },
      { title: 'Search and files', detail: 'Workspace search. Files via signed upload.' },
    ],
    nonFunctionalRequirements: [
      { title: 'Send ACK', detail: 'Under ~100ms to persist and return an ID.' },
      { title: 'Fan-out', detail: 'Online members in about a second. Offline get push.' },
      { title: 'Catch-up', detail: 'Reconnect must replay from a cursor, not a full dump.' },
      { title: 'Search', detail: 'Seconds of lag after send is OK. Index async.' },
      { title: 'Isolation', detail: 'A workspace query never leaks another tenant.' },
    ],
    estimates: [
      { label: 'Messages / day', value: 'Billions globally', note: 'Shard by workspace, then channel.' },
      { label: 'Channel size', value: '#general can be 20k', note: 'Fan-out only to connections, not to all members.' },
      { label: 'Online fraction', value: 'Small', note: 'Presence and sockets, not membership, drive fan-out.' },
      { label: 'Search lag', value: 'Seconds', note: 'Do not index on the send ACK path.' },
    ],
    concepts: ['Channel log', 'Gateway sockets', 'Last-read cursor', 'Async search index', 'Tenant isolation'],
    walkthrough: [
      {
        title: 'Send',
        description:
          'Gateway authenticates the workspace member, the channel service appends an ordered message, ACK returns id+ts, then a fan-out job notifies online sockets and push.',
        diagram: SEND_SEQUENCE,
      },
      {
        title: 'Reconnect',
        description:
          'Client sends last cursor per channel. Server streams missed messages. Do not resend the whole history.',
      },
      {
        title: 'Search',
        description:
          'An indexer consumes the message topic and writes a per-workspace inverted index. Search is that index plus ACL filter on channel membership.',
      },
    ],
    apis: [
      {
        method: 'POST',
        path: '/v1/channels/:id/messages',
        description: 'Append a message. Returns the durable ID.',
        request: `{\n  "body": "ship it",\n  "threadId": null\n}`,
        response: `{\n  "id": "msg_88",\n  "ts": "2026-08-30T11:12:01.203Z",\n  "channelId": "ch_1"\n}`,
        errors: `{\n  "403": "Not a member",\n  "429": "Slow mode"\n}`,
      },
      {
        method: 'GET',
        path: '/v1/channels/:id/messages',
        description: 'History page from a cursor.',
        request: `{\n  "before": "msg_88",\n  "limit": 50\n}`,
        response: `{\n  "messages": [{ "id": "msg_80", "body": "lgtm" }]\n}`,
      },
      {
        method: 'POST',
        path: '/v1/read-cursors',
        description: 'Mark a channel read. Drives unread badges.',
        request: `{\n  "channelId": "ch_1",\n  "lastReadId": "msg_88"\n}`,
        response: `{\n  "ok": true\n}`,
      },
      {
        method: 'GET',
        path: '/v1/search',
        description: 'Workspace search, ACL-filtered to channels you can see.',
        request: `{\n  "q": "deploy friday",\n  "workspaceId": "ws_1"\n}`,
        response: `{\n  "hits": [{ "messageId": "msg_10", "channelId": "ch_2" }]\n}`,
      },
      {
        method: 'POST',
        path: '/v1/files/upload-url',
        description: 'Signed PUT. Message then references the file ID.',
        response: `{\n  "fileId": "f_3",\n  "uploadUrl": "https://store.example/f_3"\n}`,
      },
    ],
    dataModel: [
      {
        name: 'channels',
        primaryKey: ['channel_id'],
        columns: [
          { name: 'channel_id', type: 'uuid' },
          { name: 'workspace_id', type: 'uuid' },
          { name: 'kind', type: 'enum', notes: 'public | private | dm' },
          { name: 'name', type: 'text' },
        ],
        indexes: ['(workspace_id, name)'],
      },
      {
        name: 'memberships',
        primaryKey: ['channel_id', 'user_id'],
        columns: [
          { name: 'channel_id', type: 'uuid' },
          { name: 'user_id', type: 'uuid' },
          { name: 'last_read_id', type: 'uuid' },
        ],
      },
      {
        name: 'messages',
        primaryKey: ['message_id'],
        columns: [
          { name: 'message_id', type: 'uuid' },
          { name: 'channel_id', type: 'uuid' },
          { name: 'thread_id', type: 'uuid', notes: 'null = top-level' },
          { name: 'user_id', type: 'uuid' },
          { name: 'body', type: 'text' },
          { name: 'ts', type: 'timestamptz' },
        ],
        indexes: ['(channel_id, ts DESC)'],
        notes: 'Shard / partition by channel_id. Snowflake-ish IDs keep order.',
      },
    ],
    architecture:
      'Edge websocket gateways hold sockets. A channel service appends to a per-channel log. Fan-out reads the online-set for that channel, not the full membership list. Presence is a heartbeat into Redis. Search is an async index per workspace. Files are object storage. Push is for idle mobiles.',
    diagram: `flowchart TB
    App --> Gateway
    Gateway --> ChannelSvc
    ChannelSvc --> Log[(Channel log)]
    ChannelSvc --> Fanout
    Fanout --> Gateway
    Fanout --> Push
    ChannelSvc --> IndexQ[Search indexer]
    Presence --> Redis[(Online set)]`,
    diagrams: [{ id: 'er', title: 'Entity relationships', kind: 'mermaid', src: ER_DIAGRAM }],
    deepDives: [
      {
        title: 'Do not fan-out to membership',
        body: '#general with 20k members and 200 online: publish to 200 sockets. Membership is for ACL and unread. Online-set is a Redis presence key per channel or a gateway-local map.',
      },
      {
        title: 'Message order',
        body: 'Assign IDs in the channel service (or a per-channel sequence). Clients reconcile by ID, not by arrival time. Threads are a second index (thread_id, ts).',
      },
      {
        title: 'Unread badges',
        body: 'Store last_read_id per (user, channel). Badge is a count of messages after that cursor — cached, not a COUNT(*) on every sidebar paint.',
      },
      {
        title: 'Workspace search and ACL',
        body: 'The index can hold all messages, but the query must filter to channels the user belongs to. A leaked private channel hit is a security bug, not a ranking bug.',
      },
    ],
    tradeoffs: [
      'At-least-once fan-out plus idempotent IDs vs a harder exactly-once socket protocol.',
      'Per-channel sequence vs global snowflake (order is per channel anyway).',
      'Slack is not E2E — say that so you do not copy WhatsApp crypto.',
    ],
    bottlenecks: ['Hot #general', 'Reconnect storms after an outage', 'Search indexer lag', 'Giant workspace sidebar queries'],
    scalingPath: [
      { scale: 'v1', focus: 'One Postgres, one socket process.' },
      { scale: 'v2', focus: 'Channel shards, gateway fleet, Redis presence, async search.' },
      { scale: 'enterprise', focus: 'Tenant isolation, compliance export, per-workspace indexes.' },
    ],
    interviewScript: [
      '“A message is an append to a channel log. I ACK, then fan-out to online sockets.”',
      '“#general is not 20k writes. It is 200 online connections.”',
      '“This is not WhatsApp. History is searchable and server-side.”',
    ],
    commonMistakes: [
      'Designing E2E 1:1 and calling it Slack',
      'Fan-out to every member row',
      'Search on the send ACK path',
      'No cursor on reconnect',
    ],
    relatedTopics: ['whatsapp', 'realtime', 'gmail', 'zoom'],
    examples: ['Slack', 'Teams', 'Discord'],
    practicePrompt: 'After a 15-minute outage, 50k clients reconnect. How do you catch them up without melting the channel log?',
    followUps: [
      {
        question: 'How is Slack different from WhatsApp in one minute?',
        category: 'scale',
        difficulty: 'easy',
        answer:
          'Slack: server-side history, channels, search, workspace ACL. WhatsApp: 1:1/small groups, E2E, multi-device is the hard part. Do not mix the designs.',
      },
      {
        question: 'A bot posts to 5,000 channels. What breaks?',
        category: 'scale',
        difficulty: 'hard',
        answer:
          'Each post is a normal append — that is fine. Fan-out and search ingest spike. Rate-limit bots, batch index, and isolate bot traffic so human #general still ACKs in 100ms.',
      },
      {
        question: 'How do threads avoid scanning the parent channel?',
        category: 'scale',
        difficulty: 'medium',
        answer:
          'thread_id index. The parent row holds a reply_count. Opening a thread is (thread_id, ts), not a filter over the whole channel.',
      },
      {
        question: 'Presence accuracy vs cost.',
        category: 'scale',
        difficulty: 'medium',
        answer:
          'Heartbeat every 30–60s into Redis with TTL. Approximate is OK. Do not write SQL on every mouse move. DND is a user flag, not presence.',
      },
      {
        question: 'Enterprise retention / eDiscovery.',
        category: 'privacy',
        difficulty: 'medium',
        answer:
          'The log is already server-side. A compliance export is a workspace-scoped reader with a legal hold flag that blocks deletes. This is why Slack is not E2E.',
      },
      {
        question: 'Unread for a user who never opened #general.',
        category: 'scale',
        difficulty: 'medium',
        answer:
          'last_read starts at join time, not channel creation. Mentions can use a separate per-user mention index so you do not count every message in a 20k channel.',
      },
    ],
  }),
};
