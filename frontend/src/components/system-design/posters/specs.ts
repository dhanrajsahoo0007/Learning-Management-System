import type { PosterSpec } from '../symbols';

export const STORAGE_LAYERS: PosterSpec = {
  title: 'Three storage layers under one application',
  legend: ['Block = one disk, one writer', 'File = shared POSIX tree', 'Object = HTTP key/value blobs'],
  clusters: [
    { id: 'app', label: 'Application' },
    { id: 'layer', label: 'Storage layer' },
    { id: 'holds', label: 'What it holds' },
  ],
  nodes: [
    { id: 'api', symbol: 'server', label: 'Booking API', cluster: 'app' },
    { id: 'block', symbol: 'blockVolume', label: 'Block volume (EBS)', cluster: 'layer' },
    { id: 'file', symbol: 'nfs', label: 'File share (NFS / EFS)', cluster: 'layer' },
    { id: 'object', symbol: 's3', label: 'Object store (S3)', cluster: 'layer' },
    { id: 'pgfiles', symbol: 'sql', label: 'Postgres data files', cluster: 'holds' },
    { id: 'shared', symbol: 'document', label: 'Shared configs, legacy exports', cluster: 'holds' },
    { id: 'media', symbol: 'cdn', label: 'Photos, video, backups', cluster: 'holds' },
  ],
  edges: [
    { from: 'api', to: 'block', label: 'attach one volume', step: 1 },
    { from: 'api', to: 'file', label: 'mount', step: 2 },
    { from: 'api', to: 'object', label: 'HTTP PUT / GET', step: 3 },
    { from: 'block', to: 'pgfiles' },
    { from: 'file', to: 'shared' },
    { from: 'object', to: 'media' },
  ],
};

export const DB_FAMILIES: PosterSpec = {
  title: 'One source of truth, many derived stores',
  legend: ['Pick by access pattern, not by hype', 'Derived stores can always be rebuilt'],
  clusters: [
    { id: 'oltp', label: 'Transactional (source of truth)' },
    { id: 'scale', label: 'Scale-out stores' },
    { id: 'derived', label: 'Derived / analytical' },
  ],
  nodes: [
    { id: 'sql', symbol: 'sql', label: 'Relational (Postgres)', cluster: 'oltp' },
    { id: 'doc', symbol: 'document', label: 'Document (MongoDB)', cluster: 'oltp' },
    { id: 'graph', symbol: 'graph', label: 'Graph (Neo4j)', cluster: 'oltp' },
    { id: 'kv', symbol: 'kv', label: 'Key-value (DynamoDB)', cluster: 'scale' },
    { id: 'wide', symbol: 'wideColumn', label: 'Wide-column (Cassandra)', cluster: 'scale' },
    { id: 'newsql', symbol: 'ring', label: 'Distributed SQL (Spanner)', cluster: 'scale' },
    { id: 'search', symbol: 'search', label: 'Search (Elasticsearch)', cluster: 'derived' },
    { id: 'ts', symbol: 'timeSeries', label: 'Time-series (Influx)', cluster: 'derived' },
    { id: 'olap', symbol: 'columnar', label: 'Columnar (ClickHouse)', cluster: 'derived' },
  ],
  edges: [
    { from: 'sql', to: 'kv', label: 'hot keys', step: 1 },
    { from: 'sql', to: 'search', label: 'CDC index', step: 2 },
    { from: 'sql', to: 'olap', label: 'nightly ETL', step: 3, dashed: true },
  ],
};

export const CACHE_ASIDE: PosterSpec = {
  title: 'Cache-aside: the application owns the cache',
  legend: ['Hit ≈ 1ms, miss ≈ 20ms', 'Every cached key needs a TTL', 'Write path deletes, it does not update'],
  clusters: [
    { id: 'client', label: 'Callers' },
    { id: 'cache', label: 'Cache tier' },
    { id: 'truth', label: 'Source of truth' },
  ],
  nodes: [
    { id: 'app', symbol: 'mobile', label: 'App', cluster: 'client' },
    { id: 'svc', symbol: 'server', label: 'Profile service', cluster: 'client' },
    { id: 'redis', symbol: 'cache', label: 'Redis (aside)', cluster: 'cache' },
    { id: 'warm', symbol: 'worker', label: 'Hot-key warmer', cluster: 'cache' },
    { id: 'pg', symbol: 'sql', label: 'Postgres', cluster: 'truth' },
  ],
  edges: [
    { from: 'app', to: 'svc', label: 'GET /profile/42', step: 1 },
    { from: 'svc', to: 'redis', label: 'GET profile:42', step: 2 },
    { from: 'redis', to: 'pg', label: 'miss: read row', step: 3 },
    { from: 'pg', to: 'redis', label: 'SET + TTL 300s', step: 4 },
    { from: 'warm', to: 'redis', label: 'preload top keys' },
  ],
};

export const CDN_PATH: PosterSpec = {
  title: 'Edge, shield, origin: three chances to avoid the origin',
  legend: ['Edge hit ≈ 10ms', 'Shield collapses duplicate origin fetches', 'Immutable assets: TTL 1 year'],
  clusters: [
    { id: 'viewers', label: 'Viewers' },
    { id: 'edge', label: 'CDN' },
    { id: 'origin', label: 'Origin' },
  ],
  nodes: [
    { id: 'v1', symbol: 'user', label: 'Viewer in Mumbai', cluster: 'viewers' },
    { id: 'v2', symbol: 'user', label: 'Viewer in Berlin', cluster: 'viewers' },
    { id: 'pop', symbol: 'cdn', label: 'Nearest edge POP', cluster: 'edge' },
    { id: 'shield', symbol: 'cdn', label: 'Shield POP', cluster: 'edge' },
    { id: 'bucket', symbol: 's3', label: 'Origin bucket', cluster: 'origin' },
    { id: 'app', symbol: 'server', label: 'Origin app (dynamic)', cluster: 'origin' },
  ],
  edges: [
    { from: 'v1', to: 'pop', label: 'DNS picks nearest', step: 1 },
    { from: 'v2', to: 'pop' },
    { from: 'pop', to: 'shield', label: 'edge miss', step: 2 },
    { from: 'shield', to: 'bucket', label: 'shield miss', step: 3 },
    { from: 'shield', to: 'app', label: 'dynamic passthrough', dashed: true },
  ],
};

export const LB_LAYERS: PosterSpec = {
  title: 'Global, L4, then L7: where each decision is made',
  legend: ['L3/L4 route packets', 'L7 reads host, path, and headers', 'Draining backends finish in-flight requests'],
  clusters: [
    { id: 'clients', label: 'Clients' },
    { id: 'global', label: 'Global tier' },
    { id: 'regional', label: 'Regional tier' },
    { id: 'pool', label: 'Backend pool' },
  ],
  nodes: [
    { id: 'mobile', symbol: 'mobile', label: 'Mobile app', cluster: 'clients' },
    { id: 'web', symbol: 'user', label: 'Browser', cluster: 'clients' },
    { id: 'gslb', symbol: 'dns', label: 'Geo-DNS / GSLB', cluster: 'global' },
    { id: 'anycast', symbol: 'cdn', label: 'Anycast IP (L3)', cluster: 'global' },
    { id: 'l4', symbol: 'loadBalancerL4', label: 'L4: TCP / UDP (NLB)', cluster: 'regional' },
    { id: 'l7', symbol: 'loadBalancerL7', label: 'L7: HTTP (Envoy)', cluster: 'regional' },
    { id: 'a1', symbol: 'server', label: 'app-1 healthy', cluster: 'pool' },
    { id: 'a2', symbol: 'server', label: 'app-2 draining', cluster: 'pool' },
    { id: 'a3', symbol: 'server', label: 'app-3 slow start', cluster: 'pool' },
  ],
  edges: [
    { from: 'web', to: 'gslb', label: 'resolve', step: 1 },
    { from: 'mobile', to: 'anycast' },
    { from: 'gslb', to: 'l4', label: 'nearest region', step: 2 },
    { from: 'l4', to: 'l7', label: 'terminate TLS', step: 3 },
    { from: 'l7', to: 'a1', label: 'least connections', step: 4 },
    { from: 'l7', to: 'a2', label: 'no new conns', dashed: true },
    { from: 'l7', to: 'a3', label: 'weight 10%' },
  ],
};

export const GATEWAY_HOP: PosterSpec = {
  title: 'One gateway hop: TLS, auth, limit, route, timeout',
  legend: ['The gateway never talks to a database', 'Each service owns its own store'],
  clusters: [
    { id: 'client', label: 'Clients' },
    { id: 'edge', label: 'Edge' },
    { id: 'services', label: 'Services' },
    { id: 'data', label: 'Per-service data' },
  ],
  nodes: [
    { id: 'client', symbol: 'mobile', label: 'Mobile / web', cluster: 'client' },
    { id: 'gw', symbol: 'apiGateway', label: 'API gateway', cluster: 'edge' },
    { id: 'authz', symbol: 'lock', label: 'Auth + rate limit', cluster: 'edge' },
    { id: 'profile', symbol: 'server', label: 'Profile service', cluster: 'services' },
    { id: 'order', symbol: 'server', label: 'Order service', cluster: 'services' },
    { id: 'searchsvc', symbol: 'server', label: 'Search service', cluster: 'services' },
    { id: 'redis', symbol: 'cache', label: 'Redis', cluster: 'data' },
    { id: 'pg', symbol: 'sql', label: 'Postgres', cluster: 'data' },
    { id: 'es', symbol: 'search', label: 'Elasticsearch', cluster: 'data' },
  ],
  edges: [
    { from: 'client', to: 'gw', label: 'TLS + bearer token', step: 1 },
    { from: 'gw', to: 'authz', label: 'verify + count', step: 2 },
    { from: 'authz', to: 'profile', label: 'route /v1/profile', step: 3 },
    { from: 'authz', to: 'order' },
    { from: 'authz', to: 'searchsvc' },
    { from: 'profile', to: 'redis' },
    { from: 'order', to: 'pg' },
    { from: 'searchsvc', to: 'es' },
  ],
};

export const QUEUE_VS_LOG: PosterSpec = {
  title: 'Queue deletes on ack, log keeps an offset',
  legend: ['Queue: work distribution', 'Log: replayable history', 'DLQ catches poison messages'],
  clusters: [
    { id: 'producer', label: 'Producer' },
    { id: 'broker', label: 'Broker queue (SQS)' },
    { id: 'log', label: 'Append-only log (Kafka)' },
    { id: 'consumers', label: 'Consumers' },
  ],
  nodes: [
    { id: 'order', symbol: 'server', label: 'Order service', cluster: 'producer' },
    { id: 'sqs', symbol: 'queue', label: 'orders-to-ship', cluster: 'broker' },
    { id: 'dlq', symbol: 'queue', label: 'Dead-letter queue', cluster: 'broker' },
    { id: 'topic', symbol: 'log', label: 'orders topic, 6 partitions', cluster: 'log' },
    { id: 'workers', symbol: 'worker', label: 'Shipping workers', cluster: 'consumers' },
    { id: 'analytics', symbol: 'worker', label: 'Analytics consumer', cluster: 'consumers' },
  ],
  edges: [
    { from: 'order', to: 'sqs', label: 'send', step: 1 },
    { from: 'sqs', to: 'workers', label: 'receive, delete on ack', step: 2 },
    { from: 'sqs', to: 'dlq', label: 'after 5 failures', dashed: true },
    { from: 'order', to: 'topic', label: 'append by order_id', step: 3 },
    { from: 'topic', to: 'analytics', label: 'replay from offset 0', step: 4 },
  ],
};

export const SEARCH_VS_FEED: PosterSpec = {
  title: 'Search and feeds are derived, not queried from the table',
  legend: ['Never ORDER BY on the write table', 'Fan-out on write for most users', 'Pull at read time for celebrities'],
  clusters: [
    { id: 'write', label: 'Write path' },
    { id: 'derive', label: 'Derived stores' },
    { id: 'read', label: 'Read path' },
  ],
  nodes: [
    { id: 'postsvc', symbol: 'server', label: 'Post service', cluster: 'write' },
    { id: 'posts', symbol: 'sql', label: 'posts table', cluster: 'write' },
    { id: 'fanoutq', symbol: 'queue', label: 'Fan-out queue', cluster: 'derive' },
    { id: 'index', symbol: 'search', label: 'Inverted index', cluster: 'derive' },
    { id: 'timeline', symbol: 'kv', label: 'Timeline cache per user', cluster: 'derive' },
    { id: 'searcher', symbol: 'user', label: 'Searcher', cluster: 'read' },
    { id: 'follower', symbol: 'user', label: 'Follower', cluster: 'read' },
  ],
  edges: [
    { from: 'postsvc', to: 'posts', label: 'insert', step: 1 },
    { from: 'posts', to: 'fanoutq', label: 'CDC event', step: 2 },
    { from: 'fanoutq', to: 'timeline', label: 'push to 500 inboxes', step: 3 },
    { from: 'fanoutq', to: 'index', label: 'tokenize + index' },
    { from: 'index', to: 'searcher', label: 'top 10 by score', step: 4 },
    { from: 'timeline', to: 'follower', label: 'GET /feed', step: 5 },
  ],
};

export const WS_GATEWAY: PosterSpec = {
  title: 'Connection tier, fan-out tier, storage tier',
  legend: ['Sticky by connection, not by user', 'Presence expires; it is never hand-deleted', 'Offline users fall back to push'],
  clusters: [
    { id: 'clients', label: 'Clients' },
    { id: 'conn', label: 'Connection tier' },
    { id: 'fanout', label: 'Fan-out' },
    { id: 'store', label: 'Durable store' },
  ],
  nodes: [
    { id: 'phone', symbol: 'mobile', label: 'Phone (WebSocket)', cluster: 'clients' },
    { id: 'web', symbol: 'user', label: 'Web (SSE fallback)', cluster: 'clients' },
    { id: 'wsgw', symbol: 'wsGateway', label: 'WS gateway shard 3', cluster: 'conn' },
    { id: 'presence', symbol: 'kv', label: 'Presence (TTL 30s)', cluster: 'conn' },
    { id: 'channel', symbol: 'log', label: 'Channel log', cluster: 'fanout' },
    { id: 'push', symbol: 'push', label: 'APNs / FCM', cluster: 'fanout' },
    { id: 'messages', symbol: 'sql', label: 'Message store', cluster: 'store' },
  ],
  edges: [
    { from: 'phone', to: 'wsgw', label: 'connect, resume seq', step: 1 },
    { from: 'web', to: 'wsgw' },
    { from: 'wsgw', to: 'presence', label: 'SETEX user:42 30', step: 2 },
    { from: 'wsgw', to: 'channel', label: 'publish', step: 3 },
    { from: 'channel', to: 'messages', label: 'persist', step: 4 },
    { from: 'channel', to: 'push', label: 'offline: push', dashed: true },
  ],
};

export const RETRY_STORM: PosterSpec = {
  title: 'Where a retry storm is stopped',
  legend: ['Retries without jitter synchronize', 'A breaker fails fast so pools survive', 'Every limit needs a client-visible contract'],
  clusters: [
    { id: 'clients', label: 'Clients' },
    { id: 'edge', label: 'Edge controls' },
    { id: 'service', label: 'Service controls' },
    { id: 'down', label: 'Downstream' },
  ],
  nodes: [
    { id: 'clients', symbol: 'mobile', label: '10k retrying clients', cluster: 'clients' },
    { id: 'gw', symbol: 'apiGateway', label: 'Gateway', cluster: 'edge' },
    { id: 'bucket', symbol: 'lock', label: 'Token bucket 100 rps', cluster: 'edge' },
    { id: 'checkout', symbol: 'server', label: 'Checkout service', cluster: 'service' },
    { id: 'breaker', symbol: 'ring', label: 'Circuit breaker', cluster: 'service' },
    { id: 'db', symbol: 'sql', label: 'Payments DB', cluster: 'down' },
    { id: 'retryq', symbol: 'queue', label: 'Retry queue + jitter', cluster: 'down' },
  ],
  edges: [
    { from: 'clients', to: 'gw', label: 'burst', step: 1 },
    { from: 'gw', to: 'bucket', label: '429 + Retry-After', step: 2 },
    { from: 'bucket', to: 'checkout', label: 'admitted traffic', step: 3 },
    { from: 'checkout', to: 'breaker', label: 'open at 50% errors', step: 4 },
    { from: 'breaker', to: 'db', label: 'timeout 300ms', step: 5 },
    { from: 'breaker', to: 'retryq', label: 'backoff + jitter', dashed: true },
  ],
};

export const MEDIA_PIPELINE: PosterSpec = {
  title: 'Bytes go straight to the bucket, never through your API',
  legend: ['Presigned URLs expire in minutes', 'Variants are derived, never the source of truth', 'Moderation gates publication, not upload'],
  clusters: [
    { id: 'client', label: 'Client' },
    { id: 'control', label: 'Control plane' },
    { id: 'storage', label: 'Object storage' },
    { id: 'pipeline', label: 'Pipeline + delivery' },
  ],
  nodes: [
    { id: 'uploader', symbol: 'mobile', label: 'Uploader', cluster: 'client' },
    { id: 'api', symbol: 'server', label: 'Upload API', cluster: 'control' },
    { id: 'row', symbol: 'sql', label: 'uploads row: pending', cluster: 'control' },
    { id: 'raw', symbol: 's3', label: 'Raw bucket', cluster: 'storage' },
    { id: 'derived', symbol: 's3', label: 'Derived bucket', cluster: 'storage' },
    { id: 'transcode', symbol: 'worker', label: 'Transcode + thumbnails', cluster: 'pipeline' },
    { id: 'moderate', symbol: 'worker', label: 'Moderation scan', cluster: 'pipeline' },
    { id: 'cdn', symbol: 'cdn', label: 'CDN', cluster: 'pipeline' },
  ],
  edges: [
    { from: 'uploader', to: 'api', label: 'POST /uploads', step: 1 },
    { from: 'api', to: 'row', label: 'record intent' },
    { from: 'uploader', to: 'raw', label: 'presigned multipart PUT', step: 2 },
    { from: 'raw', to: 'transcode', label: 'ObjectCreated event', step: 3 },
    { from: 'transcode', to: 'derived', label: 'write variants', step: 4 },
    { from: 'transcode', to: 'moderate', label: 'scan before publish' },
    { from: 'derived', to: 'cdn', label: 'origin pull', step: 5 },
  ],
};

export const DNS_WALK: PosterSpec = {
  title: 'How a name becomes an address',
  legend: ['Every hop is cached for its TTL', 'Low TTL = faster failover, more queries', 'DNS alone cannot health-check'],
  clusters: [
    { id: 'client', label: 'Client' },
    { id: 'resolver', label: 'Recursive resolver' },
    { id: 'auth', label: 'Authoritative hierarchy' },
    { id: 'answer', label: 'Answer' },
  ],
  nodes: [
    { id: 'stub', symbol: 'mobile', label: 'Stub resolver (OS)', cluster: 'client' },
    { id: 'recursive', symbol: 'dns', label: 'Recursive resolver', cluster: 'resolver' },
    { id: 'rcache', symbol: 'cache', label: 'Resolver cache', cluster: 'resolver' },
    { id: 'root', symbol: 'dns', label: 'Root (.)', cluster: 'auth' },
    { id: 'tld', symbol: 'dns', label: 'TLD (.com)', cluster: 'auth' },
    { id: 'zone', symbol: 'dns', label: 'example.com zone', cluster: 'auth' },
    { id: 'ip', symbol: 'server', label: 'A 203.0.113.10', cluster: 'answer' },
  ],
  edges: [
    { from: 'stub', to: 'recursive', label: 'A? api.example.com', step: 1 },
    { from: 'recursive', to: 'rcache', label: 'cached and fresh?', step: 2 },
    { from: 'recursive', to: 'root', label: 'who serves .com?', step: 3 },
    { from: 'recursive', to: 'tld', label: 'who serves example.com?', step: 4 },
    { from: 'recursive', to: 'zone', label: 'A record?', step: 5 },
    { from: 'zone', to: 'ip', label: 'TTL 60s', step: 6 },
  ],
};

export const HTTP2_VS_HTTP1: PosterSpec = {
  title: 'Parallelism: more sockets, or more streams',
  legend: ['HTTP/1.1 parallelism costs connections', 'HTTP/2 multiplexes over one socket', 'HTTP/3 moves to QUIC and drops TCP head-of-line blocking'],
  clusters: [
    { id: 'client', label: 'Browser' },
    { id: 'h1', label: 'HTTP/1.1' },
    { id: 'h2', label: 'HTTP/2 and HTTP/3' },
    { id: 'origin', label: 'Origin' },
  ],
  nodes: [
    { id: 'browser', symbol: 'user', label: 'Browser', cluster: 'client' },
    { id: 'sockets', symbol: 'server', label: '6 TCP connections', cluster: 'h1' },
    { id: 'hol', symbol: 'queue', label: 'Head-of-line queue', cluster: 'h1' },
    { id: 'socket', symbol: 'server', label: '1 connection', cluster: 'h2' },
    { id: 'streams', symbol: 'log', label: 'Multiplexed streams', cluster: 'h2' },
    { id: 'origin', symbol: 'apiGateway', label: 'Origin / gateway', cluster: 'origin' },
  ],
  edges: [
    { from: 'browser', to: 'sockets', label: 'one request per socket', step: 1 },
    { from: 'sockets', to: 'hol', label: 'seventh request waits' },
    { from: 'browser', to: 'socket', label: 'many streams, one socket', step: 2 },
    { from: 'socket', to: 'streams', label: 'HPACK headers' },
    { from: 'hol', to: 'origin', label: 'blocked by slowest' },
    { from: 'streams', to: 'origin', label: 'interleaved frames' },
  ],
};

export const REPLICATION_QUORUM: PosterSpec = {
  title: 'One leader, three replicas, two acks',
  legend: ['W + R > N gives quorum reads', 'Async replicas serve stale reads', 'Failover promotes the most caught-up replica'],
  clusters: [
    { id: 'writer', label: 'Writer' },
    { id: 'leader', label: 'Leader' },
    { id: 'replicas', label: 'Replicas' },
    { id: 'reader', label: 'Readers' },
  ],
  nodes: [
    { id: 'writer', symbol: 'server', label: 'Write client', cluster: 'writer' },
    { id: 'primary', symbol: 'sql', label: 'Primary', cluster: 'leader' },
    { id: 'wal', symbol: 'log', label: 'WAL / binlog', cluster: 'leader' },
    { id: 'ra', symbol: 'sql', label: 'Replica A (sync)', cluster: 'replicas' },
    { id: 'rb', symbol: 'sql', label: 'Replica B (async)', cluster: 'replicas' },
    { id: 'rc', symbol: 'sql', label: 'Replica C (lagging)', cluster: 'replicas' },
    { id: 'reader', symbol: 'user', label: 'Read client', cluster: 'reader' },
  ],
  edges: [
    { from: 'writer', to: 'primary', label: 'INSERT', step: 1 },
    { from: 'primary', to: 'wal', label: 'append', step: 2 },
    { from: 'wal', to: 'ra', label: 'ack before commit', step: 3 },
    { from: 'wal', to: 'rb', label: '~200ms behind', step: 4 },
    { from: 'wal', to: 'rc', label: 'minutes behind', dashed: true },
    { from: 'ra', to: 'reader', label: 'read-your-writes', step: 5 },
    { from: 'rb', to: 'reader', label: 'stale read risk' },
  ],
};

export const SHARD_ROUTER: PosterSpec = {
  title: 'The shard key decides whether a query is one hop or all hops',
  legend: ['Good shard key = the key you query by', 'Cross-shard queries scatter and gather', 'Unique constraints need a global index'],
  clusters: [
    { id: 'caller', label: 'Caller' },
    { id: 'routing', label: 'Routing tier' },
    { id: 'shards', label: 'Shards' },
    { id: 'ops', label: 'Operations' },
  ],
  nodes: [
    { id: 'api', symbol: 'server', label: 'Booking API', cluster: 'caller' },
    { id: 'router', symbol: 'ring', label: 'hash(host_id)', cluster: 'routing' },
    { id: 'map', symbol: 'kv', label: 'Shard map', cluster: 'routing' },
    { id: 's0', symbol: 'sql', label: 'Shard 0', cluster: 'shards' },
    { id: 's1', symbol: 'sql', label: 'Shard 1', cluster: 'shards' },
    { id: 's2', symbol: 'sql', label: 'Shard 2 (hotspot)', cluster: 'shards' },
    { id: 'resplit', symbol: 'worker', label: 'Resharding job', cluster: 'ops' },
  ],
  edges: [
    { from: 'api', to: 'router', label: 'bookings by host', step: 1 },
    { from: 'router', to: 'map', label: 'lookup range', step: 2 },
    { from: 'router', to: 's0', label: 'single-shard read', step: 3 },
    { from: 'router', to: 's1' },
    { from: 'router', to: 's2', label: '60% of traffic', dashed: true },
    { from: 's2', to: 'resplit', label: 'split the range', step: 4 },
  ],
};

export const SAGA_ORDER: PosterSpec = {
  title: 'A saga commits locally and compensates on failure',
  legend: ['No two-phase commit across services', 'Every step needs an inverse', 'The outbox makes the row and the event atomic'],
  clusters: [
    { id: 'entry', label: 'Entry' },
    { id: 'orchestrator', label: 'Orchestrator' },
    { id: 'steps', label: 'Local transactions' },
    { id: 'undo', label: 'Compensation' },
  ],
  nodes: [
    { id: 'checkout', symbol: 'mobile', label: 'Checkout', cluster: 'entry' },
    { id: 'saga', symbol: 'worker', label: 'Saga orchestrator', cluster: 'orchestrator' },
    { id: 'outbox', symbol: 'log', label: 'Outbox / event log', cluster: 'orchestrator' },
    { id: 'payment', symbol: 'server', label: 'Payment: charge', cluster: 'steps' },
    { id: 'inventory', symbol: 'server', label: 'Inventory: reserve', cluster: 'steps' },
    { id: 'shipping', symbol: 'server', label: 'Shipping: fails', cluster: 'steps' },
    { id: 'compq', symbol: 'queue', label: 'Compensation queue', cluster: 'undo' },
  ],
  edges: [
    { from: 'checkout', to: 'saga', label: 'place order', step: 1 },
    { from: 'saga', to: 'outbox', label: 'record intent', step: 2 },
    { from: 'saga', to: 'payment', label: 'commit locally', step: 3 },
    { from: 'saga', to: 'inventory', step: 4 },
    { from: 'saga', to: 'shipping', label: 'no slots', step: 5 },
    { from: 'shipping', to: 'compq', label: 'emit failure', step: 6, dashed: true },
    { from: 'compq', to: 'payment', label: 'refund', dashed: true },
  ],
};

export const TOKEN_BUCKET_POSTER: PosterSpec = {
  title: 'One shared bucket, two possible answers',
  legend: ['Token bucket allows bursts, leaky bucket smooths them', 'Always return Retry-After', 'Local counter first, Redis for the global cap'],
  clusters: [
    { id: 'client', label: 'Caller' },
    { id: 'limiter', label: 'Limiter' },
    { id: 'state', label: 'Shared state' },
    { id: 'result', label: 'Outcome' },
  ],
  nodes: [
    { id: 'client', symbol: 'mobile', label: 'Client (API key)', cluster: 'client' },
    { id: 'gw', symbol: 'apiGateway', label: 'Gateway', cluster: 'limiter' },
    { id: 'bucket', symbol: 'lock', label: '100 burst, 10/s refill', cluster: 'limiter' },
    { id: 'redis', symbol: 'kv', label: 'Redis counter (Lua)', cluster: 'state' },
    { id: 'upstream', symbol: 'server', label: 'Upstream service', cluster: 'result' },
    { id: 'reject', symbol: 'push', label: '429 + Retry-After', cluster: 'result' },
  ],
  edges: [
    { from: 'client', to: 'gw', label: 'request', step: 1 },
    { from: 'gw', to: 'bucket', label: 'take 1 token', step: 2 },
    { from: 'bucket', to: 'redis', label: 'atomic decrement', step: 3 },
    { from: 'redis', to: 'upstream', label: 'token available', step: 4 },
    { from: 'redis', to: 'reject', label: 'bucket empty', step: 5, dashed: true },
  ],
};

export const KAPPA_VS_LAMBDA: PosterSpec = {
  title: 'Two paths over the same event log',
  legend: ['Lambda: batch plus stream, two codebases', 'Kappa: one streaming path, replay to backfill', 'Watermarks decide when late data is dropped'],
  clusters: [
    { id: 'source', label: 'Source of events' },
    { id: 'batch', label: 'Batch path' },
    { id: 'stream', label: 'Streaming path' },
    { id: 'serve', label: 'Serving' },
  ],
  nodes: [
    { id: 'log', symbol: 'log', label: 'Event log (Kafka)', cluster: 'source' },
    { id: 'spark', symbol: 'worker', label: 'Nightly Spark job', cluster: 'batch' },
    { id: 'warehouse', symbol: 'columnar', label: 'Warehouse table', cluster: 'batch' },
    { id: 'flink', symbol: 'worker', label: 'Flink windows', cluster: 'stream' },
    { id: 'serving', symbol: 'kv', label: 'Serving store', cluster: 'stream' },
    { id: 'dash', symbol: 'search', label: 'Dashboard / API', cluster: 'serve' },
  ],
  edges: [
    { from: 'log', to: 'spark', label: 'replay a full day', step: 1 },
    { from: 'spark', to: 'warehouse', label: 'shuffle + reduce', step: 2 },
    { from: 'log', to: 'flink', label: 'continuous, watermarked', step: 3 },
    { from: 'flink', to: 'serving', label: 'upsert', step: 4 },
    { from: 'warehouse', to: 'dash', label: 'exact, hours late', step: 5 },
    { from: 'serving', to: 'dash', label: 'approximate, seconds late', step: 6 },
  ],
};

export const HASH_RING_POSTER: PosterSpec = {
  title: 'A key walks clockwise to the first virtual node',
  legend: ['Modulo rehash moves nearly every key', 'Consistent hashing moves about 1/N', 'Virtual nodes even out uneven hardware'],
  clusters: [
    { id: 'key', label: 'Key' },
    { id: 'hash', label: 'Hash step' },
    { id: 'ring', label: 'Ring' },
    { id: 'nodes', label: 'Physical nodes' },
  ],
  nodes: [
    { id: 'key', symbol: 'kv', label: 'key user:8421', cluster: 'key' },
    { id: 'hashfn', symbol: 'worker', label: 'hash → 0..2^32', cluster: 'hash' },
    { id: 'pos', symbol: 'ring', label: 'Position 0x7f2a', cluster: 'ring' },
    { id: 'vnodes', symbol: 'ring', label: '128 vnodes per node', cluster: 'ring' },
    { id: 'na', symbol: 'server', label: 'node-a', cluster: 'nodes' },
    { id: 'nb', symbol: 'server', label: 'node-b (owner)', cluster: 'nodes' },
    { id: 'nc', symbol: 'server', label: 'node-c (joining)', cluster: 'nodes' },
  ],
  edges: [
    { from: 'key', to: 'hashfn', label: 'hash the key', step: 1 },
    { from: 'hashfn', to: 'pos', label: 'land on the ring', step: 2 },
    { from: 'pos', to: 'vnodes', label: 'walk clockwise' },
    { from: 'pos', to: 'nb', label: 'first vnode ≥ hash', step: 3 },
    { from: 'nb', to: 'nc', label: 'hands over ~1/N keys', dashed: true },
    { from: 'na', to: 'nc', dashed: true },
  ],
};

export const AUTH_SESSION_VS_JWT: PosterSpec = {
  title: 'Opaque session or signed token: who stores the truth',
  legend: ['Session: instant revoke, one lookup per request', 'JWT: no lookup, revocation is hard', 'Refresh rotation detects a stolen token'],
  clusters: [
    { id: 'client', label: 'Client' },
    { id: 'edge', label: 'Edge' },
    { id: 'session', label: 'Opaque session' },
    { id: 'token', label: 'Stateless token' },
  ],
  nodes: [
    { id: 'browser', symbol: 'user', label: 'Browser', cluster: 'client' },
    { id: 'gw', symbol: 'apiGateway', label: 'API gateway', cluster: 'edge' },
    { id: 'store', symbol: 'kv', label: 'Session store (Redis)', cluster: 'session' },
    { id: 'cookie', symbol: 'lock', label: 'HttpOnly SameSite cookie', cluster: 'session' },
    { id: 'idp', symbol: 'idp', label: 'IdP (OAuth2 / OIDC)', cluster: 'token' },
    { id: 'jwt', symbol: 'lock', label: 'Signed JWT, exp 10m', cluster: 'token' },
  ],
  edges: [
    { from: 'browser', to: 'gw', label: 'POST /login', step: 1 },
    { from: 'gw', to: 'store', label: 'create session id', step: 2 },
    { from: 'store', to: 'cookie', label: 'Set-Cookie' },
    { from: 'gw', to: 'idp', label: 'authorization code', step: 3 },
    { from: 'idp', to: 'jwt', label: 'access + refresh', step: 4 },
  ],
};

export const GEOHASH_NEIGHBORS: PosterSpec = {
  title: 'A radius always spans more than one cell',
  legend: ['Precision 6 ≈ 1.2km × 0.6km', 'Query the centre plus eight neighbours', 'Split hot cells instead of scanning them'],
  clusters: [
    { id: 'client', label: 'Client' },
    { id: 'index', label: 'Geo index' },
    { id: 'cells', label: 'Cells scanned' },
    { id: 'rank', label: 'Ranking' },
  ],
  nodes: [
    { id: 'app', symbol: 'mobile', label: 'App at 12.97, 77.59', cluster: 'client' },
    { id: 'encode', symbol: 'mapCell', label: 'Geohash precision 6', cluster: 'index' },
    { id: 'geokv', symbol: 'kv', label: 'One sorted set per cell', cluster: 'index' },
    { id: 'center', symbol: 'mapCell', label: 'Centre cell', cluster: 'cells' },
    { id: 'ring8', symbol: 'mapCell', label: 'Eight neighbours', cluster: 'cells' },
    { id: 'hot', symbol: 'mapCell', label: 'Hot downtown cell', cluster: 'cells' },
    { id: 'ranker', symbol: 'worker', label: 'Filter + rank', cluster: 'rank' },
  ],
  edges: [
    { from: 'app', to: 'encode', label: 'encode lat / lng', step: 1 },
    { from: 'encode', to: 'geokv', label: 'cell key' },
    { from: 'geokv', to: 'center', label: 'range scan', step: 2 },
    { from: 'geokv', to: 'ring8', label: 'cover the radius', step: 3 },
    { from: 'center', to: 'ranker', label: 'candidates', step: 4 },
    { from: 'hot', to: 'ranker', label: 'sub-divide first', dashed: true },
  ],
};

export const TRACE_LINE: PosterSpec = {
  title: 'One trace id crosses every hop',
  legend: ['RED: rate, errors, duration', 'Exemplars link a metric spike to a trace', 'High-cardinality labels blow up cost'],
  clusters: [
    { id: 'client', label: 'Client' },
    { id: 'edge', label: 'Edge' },
    { id: 'services', label: 'Services' },
    { id: 'signals', label: 'Signals' },
  ],
  nodes: [
    { id: 'client', symbol: 'mobile', label: 'Client sets traceparent', cluster: 'client' },
    { id: 'gw', symbol: 'apiGateway', label: 'Gateway span', cluster: 'edge' },
    { id: 'checkout', symbol: 'server', label: 'Checkout span', cluster: 'services' },
    { id: 'worker', symbol: 'worker', label: 'Async worker span', cluster: 'services' },
    { id: 'db', symbol: 'sql', label: 'DB span 210ms', cluster: 'signals' },
    { id: 'collector', symbol: 'trace', label: 'Collector + backend', cluster: 'signals' },
  ],
  edges: [
    { from: 'client', to: 'gw', label: '00-abc123-...', step: 1 },
    { from: 'gw', to: 'checkout', label: 'child span', step: 2 },
    { from: 'checkout', to: 'worker', label: 'span link' },
    { from: 'checkout', to: 'db', label: 'slowest child', step: 3 },
    { from: 'db', to: 'collector', label: 'export', dashed: true },
    { from: 'gw', to: 'collector', label: 'metrics + exemplars', dashed: true },
  ],
};

export const FENCING_TOKEN: PosterSpec = {
  title: 'A lease can expire while its holder is paused',
  legend: ['TTL alone is not mutual exclusion', 'The store must reject stale tokens', 'Tokens must increase monotonically'],
  clusters: [
    { id: 'workers', label: 'Workers' },
    { id: 'lock', label: 'Lock service' },
    { id: 'guard', label: 'Fencing' },
    { id: 'store', label: 'Protected resource' },
  ],
  nodes: [
    { id: 'wa', symbol: 'worker', label: 'Worker A (GC paused)', cluster: 'workers' },
    { id: 'wb', symbol: 'worker', label: 'Worker B', cluster: 'workers' },
    { id: 'lease', symbol: 'lock', label: 'Lease seat:42, TTL 10s', cluster: 'lock' },
    { id: 'token', symbol: 'ring', label: 'Token 33 → 34', cluster: 'guard' },
    { id: 'row', symbol: 'sql', label: 'Seat row', cluster: 'store' },
  ],
  edges: [
    { from: 'wa', to: 'lease', label: 'acquire, token 33', step: 1 },
    { from: 'wb', to: 'lease', label: 'acquire after expiry', step: 2 },
    { from: 'lease', to: 'token', label: 'issue token 34', step: 3 },
    { from: 'token', to: 'row', label: 'write if token ≥ last', step: 4 },
    { from: 'wa', to: 'row', label: 'stale token 33 rejected', dashed: true },
  ],
};

export const RAFT_LOG: PosterSpec = {
  title: 'Committed means replicated on a majority',
  legend: ['A majority, not everyone, must ack', 'A new leader needs the most complete log', 'Randomized timeouts avoid split votes'],
  clusters: [
    { id: 'client', label: 'Client' },
    { id: 'leader', label: 'Leader (term 7)' },
    { id: 'followers', label: 'Followers' },
    { id: 'apply', label: 'Applied' },
  ],
  nodes: [
    { id: 'client', symbol: 'server', label: 'Client write', cluster: 'client' },
    { id: 'leader', symbol: 'server', label: 'Leader', cluster: 'leader' },
    { id: 'log', symbol: 'log', label: 'Log index 12', cluster: 'leader' },
    { id: 'f1', symbol: 'server', label: 'Follower 1', cluster: 'followers' },
    { id: 'f2', symbol: 'server', label: 'Follower 2', cluster: 'followers' },
    { id: 'f3', symbol: 'server', label: 'Follower 3 (behind)', cluster: 'followers' },
    { id: 'sm', symbol: 'sql', label: 'State machine', cluster: 'apply' },
  ],
  edges: [
    { from: 'client', to: 'leader', label: 'propose', step: 1 },
    { from: 'leader', to: 'log', label: 'append uncommitted', step: 2 },
    { from: 'log', to: 'f1', label: 'AppendEntries', step: 3 },
    { from: 'log', to: 'f2' },
    { from: 'log', to: 'f3', label: 'retry from index 9', dashed: true },
    { from: 'f2', to: 'sm', label: 'majority acked → commit', step: 4 },
  ],
};

export const MERKLE_SHARDS: PosterSpec = {
  title: 'Compare hashes, not rows',
  legend: ['Equal roots means nothing to send', 'Cost is log(n) comparisons', 'Used by Cassandra and Dynamo anti-entropy'],
  clusters: [
    { id: 'a', label: 'Replica A' },
    { id: 'tree', label: 'Merkle tree' },
    { id: 'b', label: 'Replica B' },
    { id: 'repair', label: 'Repair' },
  ],
  nodes: [
    { id: 'ra', symbol: 'sql', label: 'Range on replica A', cluster: 'a' },
    { id: 'root', symbol: 'ring', label: 'Root hash', cluster: 'tree' },
    { id: 'children', symbol: 'ring', label: 'Child hashes', cluster: 'tree' },
    { id: 'rb', symbol: 'sql', label: 'Range on replica B', cluster: 'b' },
    { id: 'repair', symbol: 'worker', label: 'Repair job', cluster: 'repair' },
  ],
  edges: [
    { from: 'ra', to: 'root', label: 'hash the range', step: 1 },
    { from: 'root', to: 'children', label: 'split in halves', step: 2 },
    { from: 'rb', to: 'root', label: 'compare roots', step: 3 },
    { from: 'children', to: 'repair', label: 'only differing subtree', step: 4 },
    { from: 'repair', to: 'rb', label: 'stream missing rows', dashed: true },
  ],
};

export const REGISTRY_BETWEEN_LB: PosterSpec = {
  title: 'How a caller finds a healthy instance',
  legend: ['Deregister before shutdown or you serve 502s', 'Client-side saves a hop but adds client logic', 'Health check the dependency, not just the port'],
  clusters: [
    { id: 'caller', label: 'Caller' },
    { id: 'registry', label: 'Discovery' },
    { id: 'balance', label: 'Balancing' },
    { id: 'instances', label: 'Instances' },
  ],
  nodes: [
    { id: 'order', symbol: 'server', label: 'Order service', cluster: 'caller' },
    { id: 'registry', symbol: 'search', label: 'Registry (Consul)', cluster: 'registry' },
    { id: 'health', symbol: 'worker', label: 'Health checker', cluster: 'registry' },
    { id: 'clientlb', symbol: 'loadBalancerL7', label: 'Client-side balancer', cluster: 'balance' },
    { id: 'serverlb', symbol: 'loadBalancerL4', label: 'Server-side LB', cluster: 'balance' },
    { id: 'p1', symbol: 'server', label: 'payment-1 healthy', cluster: 'instances' },
    { id: 'p2', symbol: 'server', label: 'payment-2 draining', cluster: 'instances' },
    { id: 'p3', symbol: 'server', label: 'payment-3 warming', cluster: 'instances' },
  ],
  edges: [
    { from: 'order', to: 'registry', label: 'who serves payments?', step: 1 },
    { from: 'registry', to: 'health', label: 'probe every 5s' },
    { from: 'registry', to: 'clientlb', label: 'endpoint list', step: 2 },
    { from: 'clientlb', to: 'p1', label: 'least loaded', step: 3 },
    { from: 'clientlb', to: 'p2', label: 'deregistered', dashed: true },
    { from: 'serverlb', to: 'p3', label: 'added after warm-up' },
  ],
};

export const BLUE_GREEN: PosterSpec = {
  title: 'Shift weight, watch the SLO, roll back by weight',
  legend: ['Both versions must accept the same schema', 'Drain connections before killing v1', 'Rollback is a weight change, not a redeploy'],
  clusters: [
    { id: 'users', label: 'Users' },
    { id: 'router', label: 'Traffic router' },
    { id: 'blue', label: 'Blue (v1)' },
    { id: 'green', label: 'Green (v2)' },
  ],
  nodes: [
    { id: 'users', symbol: 'user', label: 'All users', cluster: 'users' },
    { id: 'router', symbol: 'loadBalancerL7', label: 'Weighted router', cluster: 'router' },
    { id: 'canary', symbol: 'worker', label: 'Canary analysis', cluster: 'router' },
    { id: 'v1', symbol: 'server', label: 'v1 pool', cluster: 'blue' },
    { id: 'v2', symbol: 'server', label: 'v2 pool', cluster: 'green' },
    { id: 'slo', symbol: 'trace', label: 'Error rate + latency', cluster: 'green' },
  ],
  edges: [
    { from: 'users', to: 'router', label: 'all traffic', step: 1 },
    { from: 'router', to: 'canary', label: 'compare cohorts' },
    { from: 'router', to: 'v1', label: '90%', step: 2 },
    { from: 'router', to: 'v2', label: '10% canary', step: 3 },
    { from: 'v2', to: 'slo', label: 'watch the SLO', step: 4 },
    { from: 'slo', to: 'v1', label: 'regression: weight 0', dashed: true },
  ],
};
