import { ArchitectureTopic, emptyContent } from '../systemDesignTypes';

const JOIN_SEQUENCE = `sequenceDiagram
  participant Client
  participant API
  participant SFU
  participant Peers
  Client->>API: POST meetings/:id/join
  API-->>Client: sfu url plus ice
  Client->>SFU: publish camera
  SFU->>Peers: subscribe forwarded streams
  Client->>API: chat message optional`;

const ER_DIAGRAM = `erDiagram
  USERS ||--o{ MEETINGS : hosts
  MEETINGS ||--o{ PARTICIPANTS : has
  MEETINGS ||--o{ CHAT_LINES : records
  MEETINGS ||--o| RECORDINGS : may_have`;

export const zoomTopic: ArchitectureTopic = {
  id: 'zoom',
  title: 'Zoom',
  description: 'Meeting control plane, SFU media plane, chat as a sidecar, and recording off the live path.',
  difficulty: 'Advanced',
  progress: 0,
  icon: 'Video',
  color: 'bg-sky-600',
  section: 'products',
  track: 'classic',
  prerequisites: ['realtime', 'load-balancer', 'reliability', 'storage-media'],
  estimatedMinutes: 70,
  order: 32,
  content: emptyContent({
    overview:
      'Zoom is two systems: a control plane (schedule, join, roster, chat) and a media plane (an SFU that forwards RTP). Do not mesh every pair of clients. Do not send video through your REST API.',
    whyItExists:
      'Groups need to talk live with tolerable latency, screen share, and a recording they can watch later.',
    whenToUse: ['Video conferencing', 'SFU vs MCU vs mesh', 'Control plane vs media plane'],
    problemStatement: {
      prompt:
        'Design a video meeting product like Zoom. Users schedule or start a meeting, join from multiple devices, see a roster, share screens, chat, and optionally record.',
      inScope: [
        'Create / join / leave a meeting',
        'A/V and screen share via an SFU',
        'Roster and mute / host controls',
        'In-meeting chat',
        'Cloud recording as an async consumer',
        'Waiting room / password',
      ],
      outOfScope: [
        'Phone PSTN dial-in internals',
        'Webinar 10k broadcast (follow-up)',
        'Full Slack-style persistent chat',
        'AI meeting summaries',
      ],
    },
    assumptions: [
      'Typical meeting is under 50 people. A 1:1 can be a special case.',
      'Video is UDP/WebRTC. Chat and roster are reliable TCP.',
      'One region per meeting unless you explicitly cascade SFUs.',
      'Recording is not required for the live path to work.',
    ],
    functionalRequirements: [
      { title: 'Create / start', detail: 'Instant or scheduled meeting with a join code.' },
      { title: 'Join', detail: 'Auth, waiting room, return SFU endpoints and ICE.' },
      { title: 'Media', detail: 'Publish camera/mic/screen; subscribe to others.' },
      { title: 'Roster controls', detail: 'Mute all, remove, lock, host handoff.' },
      { title: 'Chat', detail: 'In-meeting messages, not a standalone messenger.' },
      { title: 'Record', detail: 'Host starts recording; a recorder bot joins the SFU.' },
    ],
    nonFunctionalRequirements: [
      { title: 'Media latency', detail: 'End-to-end of a few hundred ms on a good network.' },
      { title: 'Join time', detail: 'A few seconds to first remote frame.' },
      { title: 'Resilience', detail: 'A chat outage must not kill audio.' },
      { title: 'Scale', detail: 'An SFU process per meeting or a shard of meetings, not one global socket.' },
      { title: 'Privacy', detail: 'Waiting room and passwords. Recording consent is a product call.' },
    ],
    estimates: [
      { label: 'Active meetings', value: 'Millions concurrently at peak', note: 'Shard by meeting_id.' },
      { label: 'Bitrate', value: '1–3 Mbps per sender', note: 'SFU selectively forwards; MCU would re-encode all.' },
      { label: 'Mesh cost', value: 'N²', note: 'Why we refuse P2P mesh above ~4 people.' },
      { label: 'Chat QPS', value: 'Tiny vs RTP', note: 'Keep it off the media path.' },
    ],
    concepts: ['SFU', 'Control vs media', 'Selective forwarding', 'Recorder bot', 'ICE / TURN'],
    walkthrough: [
      {
        title: 'Join',
        description:
          'Control API authenticates, places the user in the roster, and returns the SFU URL plus ICE/TURN. The client publishes tracks to the SFU.',
        diagram: JOIN_SEQUENCE,
      },
      {
        title: 'Someone shares a screen',
        description:
          'A new track is published. The SFU notifies subscribers. Other clients subscribe only to the screen plus a few visible tiles — not every 360p at once.',
      },
      {
        title: 'Record',
        description:
          'A recorder participant joins the same SFU, composites or stores per-track, and uploads to object storage. Live users never wait on that write.',
      },
    ],
    apis: [
      {
        method: 'POST',
        path: '/v1/meetings',
        description: 'Create an instant or scheduled meeting.',
        request: `{\n  "title": "Standup",\n  "waitingRoom": true\n}`,
        response: `{\n  "id": "m_44",\n  "joinUrl": "https://meet.example/m_44"\n}`,
      },
      {
        method: 'POST',
        path: '/v1/meetings/:id/join',
        description: 'Enter the control plane. Returns media endpoints, not RTP.',
        response: `{\n  "role": "participant",\n  "sfuUrl": "wss://sfu-9.example/m_44",\n  "ice": ["turn:turn.example"]\n}`,
        errors: `{\n  "401": "Bad password",\n  "403": "Waiting room"\n}`,
      },
      {
        method: 'POST',
        path: '/v1/meetings/:id/controls',
        description: 'Host actions: mute all, lock, end.',
        request: `{\n  "action": "mute_all"\n}`,
        response: `{\n  "ok": true\n}`,
        errors: `{\n  "403": "Not host"\n}`,
      },
      {
        method: 'POST',
        path: '/v1/meetings/:id/chat',
        description: 'In-meeting chat. Fan-out on the control websocket.',
        request: `{\n  "body": "link in chat"\n}`,
        response: `{\n  "id": "c_1",\n  "ts": "2026-08-30T11:10:00Z"\n}`,
      },
      {
        method: 'POST',
        path: '/v1/meetings/:id/recording',
        description: 'Host starts or stops a recorder bot.',
        request: `{\n  "action": "start"\n}`,
        response: `{\n  "state": "recording"\n}`,
      },
    ],
    dataModel: [
      {
        name: 'meetings',
        primaryKey: ['meeting_id'],
        columns: [
          { name: 'meeting_id', type: 'uuid' },
          { name: 'host_id', type: 'uuid' },
          { name: 'region', type: 'text', notes: 'Pins the SFU' },
          { name: 'state', type: 'enum', notes: 'scheduled | live | ended' },
          { name: 'waiting_room', type: 'bool' },
        ],
      },
      {
        name: 'participants',
        primaryKey: ['meeting_id', 'user_id'],
        columns: [
          { name: 'meeting_id', type: 'uuid' },
          { name: 'user_id', type: 'uuid' },
          { name: 'role', type: 'enum' },
          { name: 'joined_at', type: 'timestamptz' },
        ],
      },
      {
        name: 'recordings',
        primaryKey: ['recording_id'],
        columns: [
          { name: 'recording_id', type: 'uuid' },
          { name: 'meeting_id', type: 'uuid' },
          { name: 'object_key', type: 'text' },
          { name: 'status', type: 'enum' },
        ],
      },
    ],
    architecture:
      'HTTPS/WebSocket control plane owns meetings, roster, chat, and host actions. A fleet of SFUs owns RTP. A TURN fleet helps clients behind bad NATs. Recorder workers join as silent participants. Recordings land in object storage. Chat never shares a process with media.',
    diagram: `flowchart TB
    Clients --> Control[Meeting API]
    Clients --> SFU
    Control --> Roster[(Roster)]
    SFU --> SFU
    Recorder --> SFU
    Recorder --> Store[(Object store)]
    Clients --> TURN`,
    diagrams: [{ id: 'er', title: 'Entity relationships', kind: 'mermaid', src: ER_DIAGRAM }],
    deepDives: [
      {
        title: 'Why SFU, not mesh or MCU',
        body: 'Mesh is N² uploads and dies at a handful of peers. MCU mixes on the server and burns CPU. An SFU forwards selected tracks. The client encodes once. That is the default interview answer for Zoom-like systems.',
      },
      {
        title: 'Selective subscription',
        body: 'A 50-person call does not download 49 HD streams. The client tells the SFU which tiles are on screen and at what size. Gallery view is a bandwidth and subscription problem.',
      },
      {
        title: 'Cascaded SFUs',
        body: 'A cross-ocean meeting can pin a local SFU per region and forward a subset of tracks between them. Do not make every client hairpin through Virginia.',
      },
      {
        title: 'Recording',
        body: 'A bot subscriber is simpler than tapping every packet on the SFU. Compositing can be live (one MP4) or per-track (flexible later). Either way it is off the live ACK path.',
      },
    ],
    tradeoffs: [
      'SFU simplicity vs MCU layout control for recordings.',
      'One SFU per meeting vs packing many small meetings on one process.',
      'Waiting room security vs join latency.',
    ],
    bottlenecks: ['SFU CPU/bandwidth on screen share', 'TURN cost', 'A 1,000-person all-hands (that is a webinar)'],
    scalingPath: [
      { scale: 'v1', focus: 'P2P 1:1 plus a signaling server.' },
      { scale: 'v2', focus: 'SFU per meeting, control API, TURN.' },
      { scale: 'global', focus: 'Regional SFU cascade, recorder fleet, webinar mode.' },
    ],
    interviewScript: [
      '“Control plane and media plane are separate. Video does not go through my REST handler.”',
      '“SFU, not mesh. Clients subscribe to visible tiles.”',
    ],
    commonMistakes: [
      'WebRTC through the API server',
      'N² mesh for a 20-person standup',
      'Coupling chat availability to audio',
      'Treating a webinar as a regular meeting',
    ],
    relatedTopics: ['realtime', 'whatsapp', 'slack', 'youtube'],
    examples: ['Zoom', 'Meet', 'Teams'],
    practicePrompt: 'An all-hands has 2,000 viewers and 6 speakers. What do you change from a 20-person SFU meeting?',
    followUps: [
      {
        question: 'When do you still use P2P?',
        category: 'media',
        difficulty: 'easy',
        answer:
          '1:1 or very small calls to save SFU cost. Graduate to an SFU as soon as a third person joins or a recording starts.',
      },
      {
        question: 'How do you handle a user on a 400kbps link?',
        category: 'media',
        difficulty: 'medium',
        answer:
          'The SFU forwards a low rung or pauses video and keeps audio. Simulcast: the sender uploads a few encodings and the SFU picks. Do not make everyone suffer the weakest link (that is MCU thinking).',
      },
      {
        question: 'Webinar of 10k — why not one SFU meeting?',
        category: 'scale',
        difficulty: 'hard',
        answer:
          'Most people are subscribe-only. Turn it into a live broadcast: a small interactive SFU for speakers, and an HLS/LL-HLS or CDN fan-out for the audience. Questions go over the control plane.',
      },
      {
        question: 'A participant is behind a symmetric NAT.',
        category: 'media',
        difficulty: 'medium',
        answer:
          'ICE tries host, then STUN, then TURN. Budget TURN bandwidth; it is the expensive fallback. The join payload already includes TURN URIs.',
      },
      {
        question: 'Where do you store chat after the meeting ends?',
        category: 'scale',
        difficulty: 'easy',
        answer:
          'Optional. If the product wants history, flush the in-memory meeting log to SQL/object storage on end. Do not build Slack for a 30-minute meeting.',
      },
      {
        question: 'How do you keep audio up if the control websocket dies?',
        category: 'scale',
        difficulty: 'medium',
        answer:
          'Media is a different socket. Reconnect control in the background. Roster may freeze briefly; RTP should not. That is the point of the split.',
      },
    ],
  }),
};
