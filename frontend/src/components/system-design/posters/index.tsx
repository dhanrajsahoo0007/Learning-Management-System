import type { FC } from 'react';
import { TinderArchitecturePoster } from '@/assets/diagrams/tinder/TinderArchitecturePoster';
import { ArchitectureCanvas, type PosterSpec } from '../symbols';
import { BloomBitsPoster, InterviewClockPoster, SnowflakeBitsPoster } from './custom';
import * as specs from './specs';

function fromSpec(spec: PosterSpec): FC {
  return function SpecPoster() {
    return <ArchitectureCanvas spec={spec} />;
  };
}

export const POSTERS: Record<string, FC> = {
  'tinder-architecture': TinderArchitecturePoster,
  'interview-clock': InterviewClockPoster,
  'snowflake-bits': SnowflakeBitsPoster,
  'bloom-bits': BloomBitsPoster,
  'storage-layers': fromSpec(specs.STORAGE_LAYERS),
  'db-families': fromSpec(specs.DB_FAMILIES),
  'cache-aside': fromSpec(specs.CACHE_ASIDE),
  'cdn-path': fromSpec(specs.CDN_PATH),
  'lb-layers': fromSpec(specs.LB_LAYERS),
  'gateway-hop': fromSpec(specs.GATEWAY_HOP),
  'queue-vs-log': fromSpec(specs.QUEUE_VS_LOG),
  'search-vs-feed': fromSpec(specs.SEARCH_VS_FEED),
  'ws-gateway': fromSpec(specs.WS_GATEWAY),
  'retry-storm': fromSpec(specs.RETRY_STORM),
  'media-pipeline': fromSpec(specs.MEDIA_PIPELINE),
  'dns-walk': fromSpec(specs.DNS_WALK),
  'http2-vs-http1': fromSpec(specs.HTTP2_VS_HTTP1),
  'replication-quorum': fromSpec(specs.REPLICATION_QUORUM),
  'shard-router': fromSpec(specs.SHARD_ROUTER),
  'saga-order': fromSpec(specs.SAGA_ORDER),
  'token-bucket': fromSpec(specs.TOKEN_BUCKET_POSTER),
  'kappa-vs-lambda': fromSpec(specs.KAPPA_VS_LAMBDA),
  'hash-ring': fromSpec(specs.HASH_RING_POSTER),
  'auth-session-vs-jwt': fromSpec(specs.AUTH_SESSION_VS_JWT),
  'geohash-neighbors': fromSpec(specs.GEOHASH_NEIGHBORS),
  'trace-line': fromSpec(specs.TRACE_LINE),
  'fencing-token': fromSpec(specs.FENCING_TOKEN),
  'raft-log': fromSpec(specs.RAFT_LOG),
  'merkle-shards': fromSpec(specs.MERKLE_SHARDS),
  'registry-between-lb': fromSpec(specs.REGISTRY_BETWEEN_LB),
  'blue-green': fromSpec(specs.BLUE_GREEN),
};
