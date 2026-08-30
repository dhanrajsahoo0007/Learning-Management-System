import type { FlowNode, FlowPhase } from './FlowAnimation';

export interface FlowSpec {
  nodes: FlowNode[];
  phases: FlowPhase[];
}

export const FLOW_SPECS: Record<string, FlowSpec> = {
  'cache-aside': {
    nodes: [
      { id: 'app', label: 'Profile service' },
      { id: 'cache', label: 'Redis', sub: 'empty' },
      { id: 'db', label: 'Postgres' },
    ],
    phases: [
      {
        caption: 'The service always asks the cache first. Nothing else knows the cache exists.',
        active: ['app', 'cache'],
        values: { cache: 'GET profile:42' },
      },
      {
        caption: 'Miss. Only now does the request reach Postgres.',
        active: ['cache', 'db'],
        values: { cache: 'nil', db: 'SELECT WHERE id = 42' },
      },
      {
        caption: 'The service writes the row back with a TTL, then answers the caller.',
        active: ['cache'],
        values: { cache: 'SET profile:42 EX 300' },
      },
      {
        caption: 'The next few thousand reads never leave Redis.',
        active: ['app', 'cache'],
        values: { cache: 'hit, about 1ms' },
      },
    ],
  },

  stampede: {
    nodes: [
      { id: 'req', label: '1,000 requests' },
      { id: 'cache', label: 'Hot key' },
      { id: 'lock', label: 'Rebuild lock' },
      { id: 'db', label: 'Postgres' },
    ],
    phases: [
      { caption: 'One hot key serves everything. The database is idle.', active: ['cache'], values: { cache: 'TTL 300s' } },
      {
        caption: 'The TTL expires. Every in-flight request misses in the same millisecond.',
        active: ['req'],
        danger: ['cache'],
        values: { cache: 'expired' },
      },
      {
        caption: 'Without protection all thousand run the same query at once.',
        danger: ['db'],
        values: { db: '1,000 identical queries' },
      },
      {
        caption: 'With a per-key lock one request rebuilds; the rest wait or serve slightly stale data.',
        active: ['lock', 'db'],
        values: { lock: 'SET NX rebuild:42', db: '1 query' },
      },
    ],
  },

  'replication-lag': {
    nodes: [
      { id: 'w', label: 'Writer' },
      { id: 'p', label: 'Primary' },
      { id: 'r', label: 'Async replica' },
    ],
    phases: [
      { caption: 'The write commits on the primary and returns to the user.', active: ['w', 'p'], values: { p: 'commit LSN 120' } },
      { caption: 'The replica is still applying older WAL records.', danger: ['r'], values: { r: 'LSN 118, ~200ms behind' } },
      {
        caption: 'A read routed to that replica cannot see the row the user just wrote.',
        danger: ['r'],
        values: { r: 'row not found' },
      },
      {
        caption: 'Send read-your-writes traffic to the primary, or wait for the replica to reach the LSN.',
        active: ['r'],
        values: { r: 'LSN 120, caught up' },
      },
    ],
  },

  'hash-ring': {
    nodes: [
      { id: 'key', label: 'key user:8421' },
      { id: 'pos', label: 'Ring position' },
      { id: 'nb', label: 'node-b' },
      { id: 'nc', label: 'node-c' },
    ],
    phases: [
      { caption: 'Hash the key to a point on a 32-bit ring.', active: ['key', 'pos'], values: { pos: '0x7f2a…' } },
      { caption: 'Walk clockwise. The first virtual node you meet owns the key.', active: ['nb'], values: { nb: 'owner' } },
      { caption: 'node-c joins and claims 128 virtual nodes spread around the ring.', active: ['nc'], values: { nc: 'joining' } },
      {
        caption: 'Only keys between node-c and its predecessor move: about 1/N, not all of them.',
        active: ['nc'],
        values: { nb: 'hands over a slice', nc: 'owner of this key' },
      },
    ],
  },

  snowflake: {
    nodes: [
      { id: 'clock', label: 'Timestamp', sub: '41 bits' },
      { id: 'worker', label: 'Worker id', sub: '10 bits' },
      { id: 'seq', label: 'Sequence', sub: '12 bits' },
      { id: 'id', label: 'Id' },
    ],
    phases: [
      { caption: 'Read the millisecond since a custom epoch.', active: ['clock'], values: { clock: '1735689600123' } },
      { caption: 'Stamp the worker id that was assigned when the process booted.', active: ['worker'], values: { worker: '42' } },
      {
        caption: 'A second id in the same millisecond just bumps the sequence.',
        active: ['seq', 'id'],
        values: { seq: '0 → 1', id: 'monotonic' },
      },
      {
        caption: 'If the sequence exhausts 4,096, spin until the clock ticks. Never move the clock backwards.',
        danger: ['seq'],
        values: { seq: '4095, wait for next ms' },
      },
    ],
  },

  'token-bucket': {
    nodes: [
      { id: 'bucket', label: 'Bucket', sub: '100 tokens' },
      { id: 'req', label: 'Requests' },
      { id: 'verdict', label: 'Verdict' },
    ],
    phases: [
      { caption: 'The bucket refills at 10 tokens per second and holds at most 100.', active: ['bucket'], values: { bucket: '100 / 100' } },
      {
        caption: 'A burst of 100 arrives and every one is allowed. That is what burst capacity is for.',
        active: ['req', 'verdict'],
        values: { bucket: '0 / 100', verdict: '200 OK' },
      },
      {
        caption: 'The bucket is empty. Further requests are rejected immediately.',
        danger: ['verdict'],
        values: { bucket: '0 / 100', verdict: '429 + Retry-After: 1' },
      },
      {
        caption: 'One second later there are ten tokens again, so a client that honoured Retry-After gets through.',
        active: ['bucket', 'verdict'],
        values: { bucket: '10 / 100', verdict: '200 OK' },
      },
    ],
  },

  'circuit-breaker': {
    nodes: [
      { id: 'callers', label: 'Callers' },
      { id: 'breaker', label: 'Breaker', sub: 'closed' },
      { id: 'down', label: 'Payments API' },
    ],
    phases: [
      { caption: 'Closed. Calls pass through and the breaker counts failures.', active: ['breaker'], values: { breaker: 'closed, 2% errors' } },
      {
        caption: 'The downstream slows to timeouts and the error rate crosses the threshold.',
        danger: ['down'],
        values: { breaker: 'closed, 58% errors', down: 'timeouts' },
      },
      {
        caption: 'Open. Calls fail instantly, so threads and connections are not held hostage.',
        danger: ['breaker'],
        values: { breaker: 'open, fail fast' },
      },
      {
        caption: 'Half-open. One probe request decides whether to close again or stay open.',
        active: ['breaker'],
        values: { breaker: 'half-open, 1 probe' },
      },
    ],
  },

  'queue-backpressure': {
    nodes: [
      { id: 'prod', label: 'Producers' },
      { id: 'queue', label: 'Queue', sub: 'depth 12' },
      { id: 'cons', label: 'Consumers', sub: '4 workers' },
      { id: 'dlq', label: 'DLQ' },
    ],
    phases: [
      { caption: 'Producers and consumers are balanced, so queue depth stays near zero.', active: ['cons'], values: { queue: 'depth 12' } },
      {
        caption: 'A spike outruns the consumers. Depth and age both climb.',
        danger: ['queue'],
        values: { queue: 'depth 240k, oldest 9m' },
      },
      {
        caption: 'Scale consumers out, or shed load at the producer. Never let the queue become the outage.',
        active: ['cons'],
        values: { cons: '40 workers', queue: 'depth falling' },
      },
      {
        caption: 'A message that fails five times is parked in the dead-letter queue instead of blocking the partition.',
        danger: ['dlq'],
        values: { dlq: '3 poison messages' },
      },
    ],
  },

  fanout: {
    nodes: [
      { id: 'post', label: 'New post' },
      { id: 'fan', label: 'Fan-out worker' },
      { id: 'inbox', label: 'Inboxes' },
      { id: 'reader', label: 'Reader' },
    ],
    phases: [
      { caption: 'A normal user with 500 followers publishes a post.', active: ['post'], values: { post: '1 write' } },
      {
        caption: 'Fan-out on write pushes the post id into 500 timeline lists.',
        active: ['fan', 'inbox'],
        values: { inbox: '500 list appends' },
      },
      {
        caption: 'The reader gets a precomputed timeline in a single lookup.',
        active: ['reader'],
        values: { reader: 'one range read' },
      },
      {
        caption: 'A celebrity with 50M followers would need 50M writes, so their posts are pulled at read time instead.',
        danger: ['fan'],
        values: { fan: 'skip: pull on read' },
      },
    ],
  },

  'cdn-hit': {
    nodes: [
      { id: 'viewer', label: 'Viewer' },
      { id: 'edge', label: 'Edge POP' },
      { id: 'shield', label: 'Shield' },
      { id: 'origin', label: 'Origin' },
    ],
    phases: [
      { caption: 'The first viewer in a region arrives and the edge holds nothing.', active: ['viewer'], danger: ['edge'], values: { edge: 'miss' } },
      { caption: 'The edge miss goes to the shield, which collapses duplicate fetches from every edge.', active: ['shield'], values: { shield: 'single in-flight fetch' } },
      { caption: 'The shield fetches once from origin and caches on the way back.', active: ['origin'], values: { origin: '1 request' } },
      { caption: 'Every later viewer in that region is served at the edge in about 10ms.', active: ['viewer', 'edge'], values: { edge: 'hit' } },
    ],
  },

  's3-put': {
    nodes: [
      { id: 'client', label: 'Client' },
      { id: 'api', label: 'Upload API' },
      { id: 'parts', label: 'Parts' },
      { id: 'object', label: 'Object' },
    ],
    phases: [
      { caption: 'The client asks your API for permission, not for a place to stream bytes.', active: ['client', 'api'], values: { api: 'POST /uploads' } },
      { caption: 'CreateMultipartUpload returns an upload id and a presigned URL per part.', active: ['api'], values: { api: 'uploadId + 8 URLs' } },
      { caption: 'Parts upload straight to the bucket in parallel; each returns an ETag.', active: ['parts'], values: { parts: '8 × 8MB, parallel' } },
      { caption: 'A part that fails is retried on its own, not the whole 4GB file.', danger: ['parts'], values: { parts: 'part 5 retried' } },
      { caption: 'CompleteMultipartUpload stitches the parts into one immutable object.', active: ['object'], values: { object: 'visible, versioned' } },
    ],
  },

  'lb-l4-l7': {
    nodes: [
      { id: 'client', label: 'Client' },
      { id: 'l4', label: 'L4 balancer' },
      { id: 'l7', label: 'L7 proxy' },
      { id: 'pool', label: 'Backends' },
    ],
    phases: [
      { caption: 'L4 sees a TCP connection: five-tuple in, one backend out. It never reads the payload.', active: ['l4'], values: { l4: 'hash(src, dst)' } },
      {
        caption: 'Because it cannot read the path, every request on that connection lands on the same backend.',
        danger: ['l4'],
        values: { l4: 'no per-request choice' },
      },
      { caption: 'L7 terminates TLS and reads host, path, method, and headers.', active: ['l7'], values: { l7: 'GET /api/orders' } },
      {
        caption: 'Now /api and /images can go to different pools, and a failed idempotent request can be retried elsewhere.',
        active: ['l7', 'pool'],
        values: { pool: 'routed per request' },
      },
    ],
  },

  'dns-walk': {
    nodes: [
      { id: 'stub', label: 'Stub (OS)' },
      { id: 'resolver', label: 'Resolver' },
      { id: 'root', label: 'Root' },
      { id: 'tld', label: '.com TLD' },
      { id: 'auth', label: 'Authoritative' },
    ],
    phases: [
      { caption: 'The OS stub asks the configured recursive resolver and then waits.', active: ['stub', 'resolver'], values: { resolver: 'A? api.example.com' } },
      { caption: 'Cache miss, so the resolver asks a root server who is responsible for .com.', active: ['root'], values: { root: 'referral to .com' } },
      { caption: 'The .com servers return the nameservers for example.com.', active: ['tld'], values: { tld: 'referral to ns1.example.com' } },
      { caption: 'The authoritative server finally answers with the A record and its TTL.', active: ['auth'], values: { auth: '203.0.113.10, TTL 60' } },
      { caption: 'Every hop is cached for its TTL, so the next lookup answers from the resolver.', active: ['resolver'], values: { resolver: 'cached 60s' } },
    ],
  },

  'raft-elect': {
    nodes: [
      { id: 'f', label: 'Follower' },
      { id: 'c', label: 'Candidate' },
      { id: 'peers', label: 'Peers' },
      { id: 'l', label: 'Leader' },
    ],
    phases: [
      { caption: 'Followers wait for a heartbeat, each with its own randomized timeout.', active: ['f'], values: { f: 'timeout 150–300ms' } },
      { caption: 'No heartbeat arrives, so one follower increments the term and becomes a candidate.', active: ['c'], values: { c: 'term 8' } },
      {
        caption: 'It requests votes. A peer grants one only if the candidate log is at least as complete as its own.',
        active: ['peers'],
        values: { peers: '2 of 3 votes' },
      },
      { caption: 'A majority makes it leader, and it sends heartbeats immediately to stop new elections.', active: ['l'], values: { l: 'term 8 leader' } },
    ],
  },
};
