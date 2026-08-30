import { ArchitectureTopic } from './systemDesignTypes';

import { interviewApproachTopic } from './fundamentals/interviewApproach';
import { dnsTopic } from './fundamentals/dns';
import { httpRpcTopic } from './fundamentals/httpRpc';

import { databasesTopic } from './fundamentals/databases';
import { replicationTopic } from './fundamentals/replication';
import { shardingTopic } from './fundamentals/sharding';
import { transactionsTopic } from './fundamentals/transactions';
import { storageMediaTopic } from './fundamentals/storageMedia';
import { cachingTopic } from './fundamentals/caching';
import { cdnTopic } from './fundamentals/cdn';
import { loadBalancerTopic } from './fundamentals/loadBalancer';
import { apiGatewayTopic } from './fundamentals/apiGateway';
import { rateLimitingTopic } from './fundamentals/rateLimiting';
import { messageQueuesTopic } from './fundamentals/messageQueues';
import { batchStreamTopic } from './fundamentals/batchStream';

import { uniqueIdsTopic } from './fundamentals/uniqueIds';
import { consistentHashingTopic } from './fundamentals/consistentHashing';
import { authTopic } from './fundamentals/auth';
import { searchFeedsTopic } from './fundamentals/searchFeeds';
import { realtimeTopic } from './fundamentals/realtime';
import { geospatialTopic } from './fundamentals/geospatial';
import { reliabilityTopic } from './fundamentals/reliability';
import { observabilityTopic } from './fundamentals/observability';
import { distributedLockingTopic } from './fundamentals/distributedLocking';
import { consensusTopic } from './fundamentals/consensus';
import { probabilisticTopic } from './fundamentals/probabilistic';
import { serviceDiscoveryTopic } from './fundamentals/serviceDiscovery';
import { deploymentsTopic } from './fundamentals/deployments';

export const classicFundamentals: ArchitectureTopic[] = [
  interviewApproachTopic,
  dnsTopic,
  httpRpcTopic,

  databasesTopic,
  replicationTopic,
  shardingTopic,
  transactionsTopic,
  storageMediaTopic,
  cachingTopic,
  cdnTopic,
  loadBalancerTopic,
  apiGatewayTopic,
  rateLimitingTopic,
  messageQueuesTopic,
  batchStreamTopic,

  uniqueIdsTopic,
  consistentHashingTopic,
  authTopic,
  searchFeedsTopic,
  realtimeTopic,
  geospatialTopic,
  reliabilityTopic,
  observabilityTopic,
  distributedLockingTopic,
  consensusTopic,
  probabilisticTopic,
  serviceDiscoveryTopic,
  deploymentsTopic,
];
