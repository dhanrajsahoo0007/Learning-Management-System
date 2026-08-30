import { ArchitectureTopic, emptyContent } from '../systemDesignTypes';

export const realtimeTopic: ArchitectureTopic = {
  id: 'realtime',
  title: 'Realtime and Push',
  description:
    'Polling through WebSocket and WebRTC, how a gateway shards millions of sockets, and how a message reaches a user connected somewhere else.',
  difficulty: 'Intermediate',
  progress: 0,
  icon: 'Radio',
  color: 'bg-cyan-600',
  section: 'fundamentals',
  track: 'classic',
  prerequisites: ['load-balancer', 'http-rpc'],
  estimatedMinutes: 75,
  order: 19,
  content: emptyContent({
    overview:
      'Request-response assumes the client knows when to ask. Realtime systems invert that: the server has news and must deliver it to a specific human who may be on a phone with a dying connection. Two problems follow. The first is transport, which is a bounded menu from short polling to WebRTC and mostly a matter of matching the update rate. The second is much harder: once a million sockets are spread across fifty machines, delivering one chat message means finding which machine holds that user, which is a routing problem your load balancer cannot help with.',
    whyItExists:
      'A client that polls every five seconds is either wasting requests or delivering news five seconds late, and at a million clients it is doing both. A persistent connection moves the cost from repeated requests to held state, which is a trade worth making the moment updates matter within a second.',
    problemStatement: {
      prompt:
        'Ten million users keep a chat client open. A message sent by one user must reach the other members of a channel in under 200 milliseconds, survive a phone moving from wifi to cellular without losing or duplicating messages, and reach a phone whose app is backgrounded. Design the connection tier, the routing between shards, presence, and reconnection.',
      inScope: [
        'Transport choice from short polling to WebSocket and WebRTC',
        'Gateway sharding and the pub/sub backplane that crosses shards',
        'Presence, heartbeats, reconnection, and message deduplication',
        'Backpressure on slow clients and load balancer settings for long-lived connections',
      ],
      outOfScope: [
        'Media encoding, jitter buffers, and selective forwarding units for video',
        'Broker internals and retention policy, which the message queues lesson covers',
        'Replication protocols, which the replication lesson covers',
        'End-to-end encryption key exchange and device verification',
      ],
    },
    assumptions: [
      'Ten million concurrent connections at peak, with a 3:1 peak to trough ratio across the day',
      'Mobile clients disconnect roughly every few minutes as networks change, so reconnection is the normal case',
      'Message ordering matters within a channel and does not matter across channels',
    ],
    whenToUse: [
      'Chat, notifications, and collaborative editing, where an update older than a second is stale',
      'Live dashboards and price tickers, where the server produces continuously and the client only consumes',
      'Multiplayer and voice, where the last update matters more than every update arriving',
    ],
    functionalRequirements: [
      { title: 'Server-initiated delivery', detail: 'Push a message to a named user or channel without the client asking.' },
      { title: 'Cross-shard routing', detail: 'Deliver to a recipient whose socket lives on a different gateway node than the sender.' },
      { title: 'Presence', detail: 'Report online, away, and offline within about a minute of the truth, across multiple devices per user.' },
      { title: 'Gap-free resume', detail: 'After a reconnect, deliver exactly the messages missed, with no duplicates shown to the user.' },
    ],
    nonFunctionalRequirements: [
      { title: 'Delivery latency', detail: 'p99 under 200 ms from send to render while both parties are connected.' },
      { title: 'Connection density', detail: '200,000 sockets per gateway node, so 10 million concurrent needs about 50 nodes plus headroom.' },
      { title: 'Reconnect tolerance', detail: 'Losing one node drops 200,000 sockets, and the fleet must absorb them without a thundering herd.' },
      { title: 'Bounded memory per socket', detail: 'A slow client must never grow an unbounded server-side send buffer.' },
    ],
    estimates: [
      { label: 'Sockets per node', value: '~200k per gateway process', note: 'At roughly 20 KB of kernel and application buffers each, that is about 4 GB of memory' },
      { label: 'Fleet size', value: '10M / 200k = 50 nodes', note: 'Provision 75 so losing a node does not push the rest past capacity' },
      { label: 'Heartbeat traffic', value: '10M clients / 30 s = 333k pings/s', note: 'At 50 bytes each that is about 17 MB/s of pure keepalive' },
      { label: 'Polling alternative', value: '10M clients / 5 s = 2M req/s', note: 'At 500 bytes of headers each that is 1 GB/s of requests that mostly return nothing' },
      { label: 'Reconnect storm', value: '200k reconnects from one node loss', note: 'Jittered backoff spread over 60 s turns a spike into about 3.3k/s' },
    ],
    concepts: [
      'Short polling, long polling, SSE, WebSocket',
      'Connection tier vs fan-out tier',
      'Pub/sub backplane and channel log',
      'Presence via TTL heartbeats',
      'Resume sequence numbers and deduplication',
      'Slow client backpressure and conflation',
      'Idle timeout and connection draining',
      'Mobile push as the offline path',
    ],
    comparisons: [
      {
        title: 'Realtime transports and what each one costs',
        headers: ['Transport', 'How it works', 'Use when', 'Avoid when'],
        rows: [
          [
            'Short polling',
            'The client sends an ordinary request on a timer and usually gets an empty response, so latency is bounded by the interval',
            'Updates are rare, the client count is small, or you need something working in an hour',
            'Latency must be under a second, or client count is large enough that empty responses dominate traffic',
          ],
          [
            'Long polling',
            'The client sends a request and the server holds it open until there is news or a timeout of 30 seconds, then the client immediately re-asks',
            'You need push semantics through hostile proxies with no protocol support beyond plain HTTP',
            'Update rates are high, since each message costs a full request and response cycle',
          ],
          [
            'Server-Sent Events',
            'One long-lived HTTP response of type text/event-stream carrying framed text events; the browser reconnects automatically and replays a Last-Event-ID header',
            'Server-to-client only streams such as dashboards, notifications, and progress bars',
            'The client must send frequently, or you need binary frames',
          ],
          [
            'WebSocket',
            'An HTTP Upgrade handshake turns the connection into a full-duplex framed channel with 2 to 14 bytes of frame overhead and its own ping and pong frames',
            'Chat, collaboration, and anything bidirectional at high message rates',
            'You have only a few updates per hour and do not want to operate a stateful connection tier',
          ],
          [
            'HTTP/2 server push',
            'The server sends resources the client did not request on an existing HTTP/2 connection, intended for assets rather than application messages',
            'Effectively never; browsers removed support and 103 Early Hints replaced the useful part',
            'Always, for application data — it cannot address a user and cannot know what the client already cached',
          ],
          [
            'WebRTC data channels',
            'SCTP over DTLS over UDP between peers, established through ICE with STUN and TURN for NAT traversal, with optional unreliable and unordered modes',
            'Peer-to-peer game state, cursor positions, and anything where the newest packet beats a complete one',
            'You need server-side authority, audit, or persistence, since the server is not in the path',
          ],
          [
            'Mobile push (APNs, FCM)',
            'The operating system holds one socket to Apple or Google; your server posts a small payload and the OS wakes the app, best effort and unordered',
            'The app is backgrounded or killed and only the OS can wake it',
            'You treat it as a data channel — payloads are a few kilobytes and delivery is neither ordered nor guaranteed',
          ],
        ],
        note: 'The escalation is monotonic: use the simplest transport whose latency budget you can meet, and remember that mobile push is not an alternative to a socket but the path used when there is no socket.',
      },
      {
        title: 'Why three chat-shaped products look different',
        headers: ['Product', 'Delivery shape', 'Why it differs'],
        rows: [
          [
            'WhatsApp',
            'Store-and-forward: the server queues a message until each device acknowledges, then deletes it, and mobile push wakes sleeping devices',
            'Mostly offline mobile clients, small groups, and end-to-end encryption mean the server routes ciphertext and keeps almost no history',
          ],
          [
            'Slack',
            'Durable per-channel history with a sequence number, plus a socket that receives events and a resume path that replays missed sequences',
            'Channels are long-lived, searchable, and shared by hundreds of members, so the log is the product and the socket is only a notification path',
          ],
          [
            'Zoom',
            'Media over UDP through a selective forwarding unit that relays streams, with a separate reliable channel for chat and control',
            'Continuous high-bandwidth streams where a 200 ms retransmission is worse than a dropped frame, so reliability is deliberately abandoned',
          ],
        ],
      },
    ],
    architecture:
      'A stateless connection tier terminates TLS and holds the sockets, doing nothing but authentication, framing, and subscription bookkeeping. Behind it a fan-out tier owns channel membership and appends every message to a per-channel log, then publishes the message on a pub/sub backplane that every gateway node subscribes to for the channels its connected users care about. Delivery is therefore two hops that are independent of where the sender landed, and the log is what makes reconnection and mobile push correct rather than best effort.',
    diagrams: [
      { id: 'gw', title: 'Connection tier and fan-out tier', kind: 'excalidraw', src: 'ws-gateway' },
    ],
    walkthrough: [
      {
        title: 'Pick the transport from the update rate, not from fashion',
        description:
          'Write down the latency budget and the messages per second per client. A build status page updating every few minutes is fine on Server-Sent Events and needs no socket at all. A chat client sending typing indicators and read receipts is bidirectional at several messages per second, which is where WebSocket earns its operational cost. Say the number out loud: ten million clients polling every five seconds is two million requests per second of mostly empty responses.',
      },
      {
        title: 'Split the connection tier from the logic tier',
        description:
          'Gateway nodes should know only how to hold a socket, verify a token, and forward frames, because they are the tier that must be restarted and scaled constantly. All channel membership, permission checks, and persistence live behind them in stateless services that can be deployed without dropping a single connection. This separation is what lets you deploy business logic twenty times a day while sockets stay up for hours.',
        diagram: 'ws-gateway',
      },
      {
        title: 'Route across shards through a backplane',
        description:
          'The sender is connected to gateway 12 and the recipient to gateway 37, and nothing in the TCP path connects them. Gateway 12 hands the message to the fan-out tier, which appends it to the channel log and publishes it on a topic named for the channel. Gateway 37 is already subscribed to that topic because one of its users is a member, so it receives the message and writes it to the right socket, typically within single-digit milliseconds.',
      },
      {
        title: 'Make presence a TTL, never a delete',
        description:
          'Each client heartbeats every 15 seconds, and the gateway refreshes a presence key with a 45 second expiry, so presence expires on its own if the client vanishes. Never delete presence on socket close: a phone switching from wifi to cellular closes one socket and opens another, and a user with a laptop and a phone has two sockets whose closes are independent. Presence is the union of live device leases, which is why it is a set with expiries rather than a boolean column.',
      },
      {
        title: 'Resume from a sequence number and deduplicate',
        description:
          'Every message appended to a channel log gets a monotonically increasing per-channel sequence number, and the client persists the highest one it has rendered. On reconnect the client sends that number, and the server replays everything after it from the log rather than assuming the client is caught up. Because a replay can overlap with a live message that arrived during the handshake, the client also deduplicates on message id, which turns at-least-once delivery into an interface the user perceives as exactly once.',
      },
      {
        title: 'Configure the load balancer for connections that last hours',
        description:
          'Default idle timeouts are built for short requests, so a 60 second idle timeout will silently kill a healthy socket whose client heartbeats every 90 seconds. Keep the application heartbeat well under half the idle timeout, raise the timeout to hours if the protocol has its own keepalive, and set a deregistration delay long enough for graceful shutdown. Then make shutdown explicit: the node sends a "reconnect shortly" frame with a jittered delay so 200,000 clients return over a minute instead of in one second.',
      },
    ],
    deepDives: [
      {
        title: 'How a message reaches a user on a different gateway shard',
        body:
          'Sockets are sticky by physics: once a TCP connection is established with gateway 37, only gateway 37 can write to that user. Sharding therefore creates a routing problem with two standard solutions. A registry maps user to node, held in Redis with a TTL, so the sender looks up the target node and forwards directly, which is one hop and requires the registry to be correct during every reconnect. The more robust design is a pub/sub backplane keyed by channel rather than by user: each gateway subscribes to the channels its connected users belong to, publishing goes to a topic, and the sender never learns where anyone is. Broadcast cost is the concern, so channels are partitioned across backplane nodes and a gateway subscribes only to what it actually needs. Both designs put the durable channel log behind the backplane, so a message that missed a socket is still recoverable.',
      },
      {
        title: 'Presence is a lease, and heartbeats are the renewal',
        body:
          'Presence looks like a boolean and behaves like a distributed lease. The gateway writes a key such as presence for a user and device with a 45 second expiry and refreshes it on every 15 second heartbeat, so three consecutive missed heartbeats expire it automatically. This makes the failure modes benign: a crashed gateway loses no correctness because its keys simply expire, and a network partition results in a user appearing offline slightly late rather than an inconsistent state that requires cleanup. Hand-deleting on socket close is the classic bug, because a mobile client changing networks closes the old socket after opening the new one, so the delete arrives after the refresh and the user flickers offline while actively connected. Aggregate presence per user as the union across devices, and publish transitions rather than raw heartbeats so 333,000 pings per second do not become 333,000 fan-outs.',
      },
      {
        title: 'Backpressure when the client is slower than the stream',
        body:
          'A server writing to a socket writes into a kernel buffer, and when the client cannot keep up that buffer fills and the write blocks or queues in your process. With 200,000 sockets on one node, allowing each to buffer 10 MB is two terabytes of intent and an immediate out-of-memory crash, so every connection needs a hard cap of a few hundred kilobytes. The policy at the cap depends on the data. For state, conflate: keep only the newest value per key and send that, which is why a price ticker sends the latest price rather than a queue of stale ones. For a message log, stop sending and close the socket with a resume hint, so the client reconnects and replays from its sequence number using the durable log instead of your memory. Never drop silently, because a client that believes it is caught up and is not will show a permanently wrong view.',
      },
      {
        title: 'Load balancers, idle timeouts, and reconnect storms',
        body:
          'A load balancer built for HTTP assumes a request completes in seconds, so it enforces idle timeouts, caps connection duration, and drains targets in tens of seconds. Long-lived sockets violate every assumption. Set the application heartbeat below half the idle timeout, since a 60 second timeout with a 90 second ping means healthy connections die mysteriously in production and never in test. Prefer layer four proxying for the socket path so the balancer is not parsing frames, and note that connection-count balancing is only fair at establishment time: a node restarted after an incident receives all new connections and quickly becomes the hottest node in the fleet. Handle shutdown deliberately by telling clients to reconnect after a random delay of up to 60 seconds; without jitter, 200,000 clients reconnect simultaneously, fail authentication under load, and back off together into a synchronised second wave.',
      },
      {
        title: 'Mobile push is the path taken when there is no socket',
        body:
          'An iOS or Android application that is backgrounded loses its socket, and the operating system will not let it keep one, so the only way to reach it is the single connection the OS itself maintains to APNs or FCM. Your server posts a small payload, a few kilobytes at most, and the OS decides when to wake the app. Delivery is best effort, unordered, and may be coalesced or delayed for battery reasons, so it is architecturally a doorbell rather than a delivery mechanism. The correct pattern is to send a notification carrying an identifier and a small preview, and to have the woken application fetch from the channel log using its stored sequence number. That keeps ordering, deduplication, and correctness in your system, and it means a dropped push costs a delay rather than a lost message.',
      },
      {
        title: 'Collaborative editing: operational transform and CRDTs',
        body:
          'Two people editing the same paragraph produce concurrent operations against different versions of the text, so "insert at position 14" is ambiguous by the time it arrives. Operational transform resolves this on a central server that rewrites each incoming operation against the operations it has already applied, adjusting indices so the intent survives; it is compact on the wire and correct only because one authority orders everything, which makes the server mandatory and the transform functions notoriously delicate. Conflict-free replicated data types instead choose a data structure whose merge is commutative, associative, and idempotent, typically by giving every character a unique immutable identifier and a position between two neighbours, so any two replicas that have seen the same set of operations converge regardless of arrival order. That removes the central authority and allows genuine offline editing, at the cost of metadata per character and tombstones for deletions. This is the same convergence problem the replication lesson covers, one layer up: last-write-wins loses keystrokes, so the merge must be defined by the data type rather than by a timestamp.',
      },
    ],
    tradeoffs: [
      'A persistent socket gives sub-second delivery and makes every deploy, load balancer setting, and network blip your problem.',
      'A user-to-node registry delivers in one hop and must be kept correct through every reconnect; a channel backplane is self-healing and broadcasts more.',
      'Longer presence TTLs mean fewer heartbeats and a staler online list; 45 seconds with a 15 second ping is the usual compromise.',
      'Conflating updates keeps slow clients alive and loses intermediate states, which is right for prices and wrong for chat.',
    ],
    bottlenecks: [
      'File descriptor and ephemeral port limits on gateway nodes, hit long before CPU saturates.',
      'Backplane fan-out for very large channels, where one message must reach every node holding a member.',
      'Per-connection send buffers on slow clients, which turn one bad network into node-wide memory pressure.',
      'Reconnect storms after a deploy or node loss, where authentication and log replay spike together.',
    ],
    scalingPath: [
      { scale: 'Prototype', focus: 'One process holding WebSockets in memory, or Server-Sent Events if the flow is one-directional' },
      { scale: 'One region', focus: 'Sharded gateway tier behind a layer four balancer, Redis pub/sub backplane, presence TTLs, sequence-number resume' },
      { scale: 'Global', focus: 'Regional gateways with an anycast entry, cross-region channel log replication, mobile push for backgrounded clients' },
    ],
    interviewScript: [
      '"Ten million clients polling every five seconds is two million requests per second of mostly empty responses, so I hold sockets instead."',
      '"The gateway tier only holds connections and forwards frames; membership and persistence sit behind it and deploy independently."',
      '"Sender and recipient are on different nodes, so delivery goes through a channel-keyed pub/sub backplane, not a direct node lookup."',
      '"Presence is a 45 second TTL refreshed by a 15 second heartbeat. I never delete presence on socket close."',
      '"Every message has a per-channel sequence number, so a reconnect replays from the client last seen value and dedupes on message id."',
      '"Idle timeout on the balancer has to exceed twice the heartbeat interval, and shutdown tells clients to reconnect with jitter."',
    ],
    commonMistakes: [
      'Choosing WebSocket for a one-directional stream where Server-Sent Events would need no connection tier at all.',
      'Deleting presence when a socket closes, so multi-device users flicker offline.',
      'Assuming the load balancer can route a message to the node holding a given user.',
      'Letting per-connection send buffers grow without a cap, then blaming the crash on the client.',
      'Reconnecting without jitter, converting one node failure into a synchronised fleet-wide herd.',
      'Treating mobile push as a reliable ordered delivery channel rather than a wake-up signal.',
    ],
    relatedTopics: ['load-balancer', 'message-queues', 'replication', 'slack', 'zoom', 'whatsapp'],
    examples: [
      'Slack maintains a socket per client and replays missed events by sequence number after a reconnect, which is why a laptop waking from sleep catches up rather than reloading',
      'WhatsApp stores a message only until every recipient device acknowledges it, using mobile push to wake devices that hold no socket',
      'Zoom relays media over UDP through selective forwarding units, deliberately dropping late packets because a retransmitted frame is useless',
    ],
    practicePrompt:
      'A user is connected to gateway 12 and their colleague to gateway 37. Trace the exact path of one message between them and say what happens to it if gateway 37 dies mid-delivery.',
    followUps: [
      {
        question: 'When is Server-Sent Events the better choice over WebSocket?',
        answer:
          'When the flow is server to client only, which covers dashboards, notification streams, and job progress. It is plain HTTP, so proxies, compression, and authentication headers work unchanged, and the browser reconnects automatically while replaying a Last-Event-ID header that gives you resume for free. The limits are that it is text-only and unidirectional, and over HTTP/1.1 it consumes one of the six connections per origin, which HTTP/2 multiplexing removes.',
        category: 'Transport',
        difficulty: 'easy',
      },
      {
        question: 'Why did HTTP/2 server push fail?',
        answer:
          'It solved the wrong problem and solved it blindly. Push sends resources on an existing connection, so it cannot address a specific user and was never an application messaging mechanism. Worse, the server does not know what the client already has cached, so a large share of pushed bytes was wasted, and measurements showed little or negative benefit against the added complexity. Chrome removed support in 2022, and 103 Early Hints kept the genuinely useful part by telling the client what to fetch rather than sending it unrequested.',
        category: 'Transport',
        difficulty: 'medium',
      },
      {
        question: 'How does a message reach a user connected to a different gateway node?',
        answer:
          'Not through the load balancer, which has no idea where anyone is. Either a registry maps user to node so the sender forwards directly, which is one hop but must be accurate through every reconnect, or the gateways subscribe to a pub/sub backplane keyed by channel and the message is published to a topic. The backplane approach is preferred because it is self-healing and the sender never learns anyone location, and behind it the durable channel log ensures a message that missed the socket is still deliverable on resume.',
        category: 'Routing',
        difficulty: 'hard',
      },
      {
        question: 'Why should presence never be deleted on disconnect?',
        answer:
          'Because a socket close does not mean the user left. A phone moving from wifi to cellular opens the new socket before the old one finishes closing, so an explicit delete can arrive after the new heartbeat and mark an actively connected user offline. Users also hold several devices whose sockets close independently. Modelling presence as a per-device key with a 45 second TTL refreshed by heartbeats makes the state self-correcting: a crash or partition just lets it expire, and aggregate presence is the union of live device leases.',
        category: 'Presence',
        difficulty: 'medium',
      },
      {
        question: 'A client reconnects after 30 seconds offline. How do you avoid gaps and duplicates?',
        answer:
          'The channel log assigns every message a monotonically increasing per-channel sequence number, and the client persists the highest number it has rendered. On reconnect it sends that number and the server replays everything after it, which closes gaps deterministically instead of hoping the socket caught up. Duplicates are unavoidable because a replayed message can race a live one delivered during the handshake, so the client also deduplicates on message id, giving the user an experience indistinguishable from exactly once.',
        category: 'Reliability',
        difficulty: 'medium',
      },
      {
        question: 'What do you do when a client cannot keep up with the stream?',
        answer:
          'Cap the per-connection send buffer at a few hundred kilobytes, because 200,000 sockets each allowed to buffer megabytes is a guaranteed out-of-memory crash. Then choose a policy that fits the data: conflate state updates so only the newest value per key is sent, which is correct for prices and cursors, or stop sending message-log data and close the socket with a resume hint so the client reconnects and replays from durable storage. The only unacceptable option is dropping silently, which leaves the client confidently displaying a wrong view.',
        category: 'Backpressure',
        difficulty: 'hard',
      },
      {
        question: 'What load balancer settings break WebSockets?',
        answer:
          'Idle timeouts shorter than the heartbeat interval, which silently kill healthy connections; the classic failure is a 60 second idle timeout with a 90 second application ping. Maximum connection duration limits force mass reconnection on a fixed schedule. Deregistration delays that are too short cut sockets during a deploy instead of draining them. Layer seven inspection also adds needless cost on a path where you only need bytes forwarded, so proxying at layer four is usually better for the socket tier.',
        category: 'Operations',
        difficulty: 'medium',
      },
      {
        question: 'Why do WhatsApp, Slack, and Zoom look so different?',
        answer:
          'They optimise for different truths. WhatsApp assumes mostly offline mobile clients and end-to-end encryption, so the server is a store-and-forward relay that deletes a message once devices acknowledge and leans on mobile push to wake them. Slack assumes long-lived shared channels that must be searchable, so a durable sequenced log is the product and the socket is a notification path over it. Zoom carries continuous media where a retransmitted frame arrives too late to matter, so it uses UDP through selective forwarding units and deliberately gives up reliability.',
        category: 'Architecture',
        difficulty: 'medium',
      },
      {
        question: 'When would you use WebRTC data channels instead of a WebSocket?',
        answer:
          'When latency matters more than reliability and the server does not need to see the data. Data channels run SCTP over DTLS over UDP directly between peers, negotiated through ICE with STUN and TURN for NAT traversal, and can be configured unreliable and unordered so a late packet is dropped rather than retransmitted. That is exactly right for cursor positions and game state, where the newest update supersedes the last. It is wrong whenever you need server-side authority, persistence, or audit, and TURN relays add real infrastructure cost when direct peer connectivity fails.',
        category: 'Transport',
        difficulty: 'hard',
      },
      {
        question: 'For collaborative editing, would you choose operational transform or a CRDT?',
        answer:
          'Operational transform if there is a natural central server and you want minimal wire size: the server rewrites each incoming operation against those already applied so indices stay meaningful, which is efficient but depends on one authority and on transform functions that are famously hard to get right. A CRDT if you need offline editing or peer-to-peer convergence: every character carries an immutable identifier and an ordered position, and the merge is commutative, associative, and idempotent, so replicas converge regardless of delivery order. The cost is per-character metadata and tombstones for deletes. Either way, a plain last-write-wins merge is wrong, because it silently discards keystrokes.',
        category: 'Collaboration',
        difficulty: 'hard',
      },
    ],
  }),
};
