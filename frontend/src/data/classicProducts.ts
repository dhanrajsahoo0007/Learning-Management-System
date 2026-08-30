import { ArchitectureTopic, emptyContent } from './systemDesignTypes';
import { tinderTopic } from './products/tinder';
import { youtubeTopic } from './products/youtube';
import { spotifyTopic } from './products/spotify';
import { netflixTopic } from './products/netflix';
import { zoomTopic } from './products/zoom';
import { slackTopic } from './products/slack';
import { gmailTopic } from './products/gmail';
import { googleSearchTopic } from './products/googleSearch';
import { paytmTopic } from './products/paytm';
import { zomatoTopic } from './products/zomato';
import { bookmyshowTopic } from './products/bookmyshow';

export const classicProducts: ArchitectureTopic[] = [
  {
    id: 'url-shortener',
    title: 'URL Shortener',
    description: 'Warm-up design: unique short codes, blazing-fast redirects, and analytics that never block the hot path.',
    difficulty: 'Beginner',
    progress: 0,
    icon: 'Link',
    color: 'bg-slate-700',
    section: 'products',
    track: 'classic',
    prerequisites: ['unique-ids', 'caching', 'databases'],
    estimatedMinutes: 40,
    order: 20,
    content: emptyContent({
      overview: 'Users create a short alias for a long URL. The redirect path is extremely read-heavy and latency-sensitive. Analytics are best-effort.',
      whyItExists: 'Links need to be shareable, measurable, and cheap to resolve at global scale.',
      whenToUse: ['Interview warm-up', 'Teaching IDs, caches, and async analytics'],
      functionalRequirements: [
        { title: 'Shorten', detail: 'Create a short code, optional custom alias, optional expiry.' },
        { title: 'Redirect', detail: 'Resolve code to original URL quickly.' },
        { title: 'Stats', detail: 'Click counts, referrers, time series — not on the redirect critical path.' },
      ],
      nonFunctionalRequirements: [
        { title: 'Redirect p99', detail: '< 50-100ms including cache.' },
        { title: 'High availability on read', detail: 'A missed click count is better than a failed redirect.' },
      ],
      estimates: [
        { label: 'Writes', value: '100 new URLs/s' },
        { label: 'Reads', value: '10k redirects/s peak', note: 'Viral keys dominate' },
        { label: 'Storage', value: '100B URLs × 500B ≈ 50TB plus indexes' },
      ],
      concepts: ['Base62 encoding', 'Snowflake vs hash', '301 vs 302', 'Hot-key cache'],
      walkthrough: [
        { title: 'Create', description: 'API mints a Snowflake id, encodes base62, stores mapping, returns short URL.' },
        { title: 'Redirect', description: 'Edge/CDN or Redis lookup → 302 to long URL. Miss loads DB and fills cache.' },
        { title: 'Analytics', description: 'Emit click event to a queue; aggregators update counts async.' },
      ],
      steps: [
        { title: 'Design the code', description: '7-8 base62 chars from a 64-bit id. Hashing the URL collides and is not enumerable-safe for custom aliases.' },
        { title: 'Split read/write', description: 'Redirect service is cache-first. Create service talks to the primary.' },
      ],
      apis: [
        { method: 'POST', path: '/v1/links', description: '{ longUrl, customAlias? } → { code, shortUrl }' },
        { method: 'GET', path: '/:code', description: '302 Location: longUrl' },
        { method: 'GET', path: '/v1/links/:code/stats', description: 'Aggregated clicks' },
      ],
      dataModel: [
        { name: 'links', columns: ['code PK', 'long_url', 'user_id', 'expires_at', 'created_at'] },
        { name: 'clicks_raw', columns: ['code', 'ts', 'ua', 'country'], notes: 'Append-only, or stream only' },
      ],
      architecture: 'Create API + primary DB. Redirect fleet + Redis + optional CDN. Kafka/SQS for clicks.',
      diagram: `flowchart LR
    User -->|GET /abc| Edge
    Edge --> Redis
    Redis -->|miss| DB[(Mappings)]
    Edge -->|async click| Q[Queue]
    Creator -->|POST| API --> DB`,
      deepDives: [
        { title: '301 vs 302', body: '301 is cached by browsers forever and kills analytics and alias edits. Prefer 302 unless the link is truly immutable.' },
        { title: 'Viral key', body: 'One code can be 10% of traffic. Local in-process cache on the redirect fleet plus Redis.' },
      ],
      tradeoffs: ['Custom aliases need a uniqueness store and abuse checks.', 'Hashing the URL is shorter to explain but worse than IDs.'],
      bottlenecks: ['Hot codes', 'Analytics writes on the redirect path'],
      scalingPath: [
        { scale: '1K', focus: 'One DB table' },
        { scale: '1M', focus: 'Redis + async analytics' },
        { scale: '100M', focus: 'Shard mappings by code prefix, CDN for hottest' },
      ],
      interviewScript: [
        '“I will generate Snowflake ids and base62-encode them.”',
        '“Redirect is cache-aside. Clicks go to a queue, never to a counter increment on the request.”',
      ],
      commonMistakes: ['Using 301 by default', 'SELECT increment on every click'],
      relatedTopics: ['unique-ids', 'caching', 'cdn'],
      examples: ['bit.ly', 't.co'],
      practicePrompt: 'Now redesign this for 10x redirect traffic on 100 celebrity codes.',
    }),
  },
  {
    id: 'news-feed',
    title: 'News Feed / Twitter-like Timeline',
    description: 'Fan-out on write for normal users, pull for celebrities, ranked home timeline, and media via CDN.',
    difficulty: 'Advanced',
    progress: 0,
    icon: 'Newspaper',
    color: 'bg-sky-700',
    section: 'products',
    track: 'classic',
    prerequisites: ['search-feeds', 'caching', 'storage-media'],
    estimatedMinutes: 45,
    order: 21,
    content: emptyContent({
      overview: 'Users post short items. Followers see a home timeline. The hard problem is fan-out, not storing a tweet.',
      whyItExists: 'A social product is a write once, read by many graph problem with a celebrity outlier distribution.',
      whenToUse: ['Twitter/X, Instagram home, LinkedIn feed as a variant'],
      functionalRequirements: [
        { title: 'Post', detail: 'Text + media, delete, like.' },
        { title: 'Follow graph', detail: 'Follow/unfollow.' },
        { title: 'Home timeline', detail: 'Ranked or reverse-chron mix.' },
        { title: 'User timeline', detail: 'A user’s own posts.' },
      ],
      nonFunctionalRequirements: [
        { title: 'Post visible to followers', detail: 'Seconds, not minutes, for normal users.' },
        { title: 'Read p99', detail: '< 200ms for home.' },
      ],
      estimates: [
        { label: 'DAU', value: '100M' },
        { label: 'Posts', value: '10M/day' },
        { label: 'Fan-out trap', value: '1 celebrity × 100M followers' },
      ],
      concepts: ['Hybrid fan-out', 'Timeline cache of ids', 'Hydration', 'Rate limits on post'],
      walkthrough: [
        { title: 'Post', description: 'Write tweet DB. If follower count < threshold, enqueue fan-out jobs. Else mark as celebrity.' },
        { title: 'Home read', description: 'Read precomputed id list, merge celebrity pulls, rank, hydrate from tweet cache.' },
      ],
      steps: [
        { title: 'Store tweets once', description: 'Tweet service is source of truth.' },
        { title: 'Precompute for the many', description: 'Redis/Cassandra list per user.' },
        { title: 'Pull the few', description: 'On read, fetch latest from celebrities you follow.' },
      ],
      apis: [
        { method: 'POST', path: '/v1/tweets', description: 'Create post' },
        { method: 'GET', path: '/v1/timeline/home?cursor=', description: 'Home feed page' },
        { method: 'POST', path: '/v1/follows', description: 'Follow user' },
      ],
      dataModel: [
        { name: 'tweets', columns: ['id', 'author_id', 'text', 'media_ids', 'created_at'] },
        { name: 'follows', columns: ['follower_id', 'followee_id'] },
        { name: 'timeline', columns: ['user_id', 'tweet_id', 'ts'], notes: 'Cache/wide-column, not SQL forever' },
      ],
      architecture: 'Tweet service + graph + fan-out workers + timeline store + tweet cache + media CDN. Ranker can sit on hydrate.',
      diagram: `flowchart TB
    Post --> TweetDB[(Tweets)]
    Post --> Q[Fan-out queue]
    Q --> Workers
    Workers --> TL[(Timeline store)]
    Home --> TL
    Home --> Celebs[Celebrity pull]
    Home --> Cache[(Tweet cache)]`,
      deepDives: [
        { title: 'Hybrid fan-out', body: 'Threshold on follower count. The number is a product/ops choice (e.g. 10k). Interviewers want the split, not the exact cutoff.' },
        { title: 'Ranking vs chron', body: 'v1 chronological is valid. v2: lightweight ranker on the candidate set (last N ids + celebrity pull).' },
      ],
      tradeoffs: ['Push: fast home, expensive write.', 'Pull: cheap write, heavier read.'],
      bottlenecks: ['Celebrity write fan-out', 'Hydration storms'],
      scalingPath: [
        { scale: '1K', focus: 'SQL join on follows' },
        { scale: '1M', focus: 'Redis timelines' },
        { scale: '100M', focus: 'Hybrid + ranker + media CDN' },
      ],
      interviewScript: [
        '“I will not fan-out celebrities. Home is a merge of a precomputed list and a pull of oversized accounts.”',
      ],
      commonMistakes: ['Pushing every tweet to 100M inboxes in the API request'],
      relatedTopics: ['search-feeds', 'instagram', 'linkedin', 'storage-media'],
      examples: ['Twitter', 'Threads'],
      practicePrompt: 'Redesign home for 10x read traffic with the same write volume.',
    }),
  },
  {
    id: 'linkedin',
    title: 'LinkedIn',
    description: 'Professional graph, people search, PYMK, and a slower-moving feed. Graph + search + cache, not a Twitter clone.',
    difficulty: 'Advanced',
    progress: 0,
    icon: 'Briefcase',
    color: 'bg-blue-800',
    section: 'products',
    track: 'classic',
    prerequisites: ['databases', 'search-feeds', 'caching'],
    estimatedMinutes: 50,
    order: 22,
    content: emptyContent({
      overview: 'LinkedIn is a professional identity graph. Profiles are read-heavy. Connections are a bidirectional graph with invitations. Search and PYMK are first-class, not add-ons.',
      whyItExists: 'People need a trusted professional graph, recruiting search, and a feed of career-relevant updates.',
      whenToUse: ['Graph + search interviews', 'When the interviewer says “people you may know”'],
      functionalRequirements: [
        { title: 'Profiles', detail: 'Experience, skills, photo, headline.' },
        { title: 'Connections', detail: 'Invite, accept, ignore, disconnect. Mutual counts.' },
        { title: 'People search', detail: 'Name, company, title, skills, geo.' },
        { title: 'PYMK', detail: 'Suggestions from 2nd degree and similar profiles.' },
        { title: 'Feed', detail: 'Posts, job changes, articles — lower velocity than Twitter.' },
        { title: 'Messaging', detail: '1:1 after connect (InMail is a product variant).' },
      ],
      nonFunctionalRequirements: [
        { title: 'Profile reads', detail: 'Very cacheable, high QPS.' },
        { title: 'Search freshness', detail: 'Title changes should appear in minutes, not a day.' },
        { title: 'Privacy', detail: 'Graph visibility and recruiter seats.' },
      ],
      estimates: [
        { label: 'Users', value: '900M+' },
        { label: 'Edges', value: 'Tens of billions of connections' },
        { label: 'Read:write on profiles', value: 'Highly asymmetric' },
        { label: 'Recruiter search', value: 'Bursty, expensive queries' },
      ],
      concepts: ['Adjacency lists', '2nd-degree explosion', 'Inverted index people search', 'Derived PYMK', 'Profile cache'],
      walkthrough: [
        { title: 'View profile', description: 'CDN photo + Redis profile JSON + fallback SQL.' },
        { title: 'Accept invite', description: 'Transaction writes both adjacency directions, invalidates caches, enqueues graph/PYMK/search updates.' },
        { title: 'People search', description: 'Elastic query with filters, hydrate ids from profile cache.' },
        { title: 'PYMK', description: 'Precompute candidates offline (2nd degree sample + embeddings), rank online with freshness and mutuals.' },
      ],
      steps: [
        { title: 'Model the graph as tables first', description: 'connections(user_a, user_b, status). Shard by user_id for “my connections”.' },
        { title: 'Do not DFS the live graph for PYMK', description: '2nd degree is huge. Precompute.' },
        { title: 'Search is not SQL LIKE', description: 'Inverted index on tokens + filters.' },
      ],
      apis: [
        { method: 'GET', path: '/v1/profiles/:id', description: 'Public profile view' },
        { method: 'POST', path: '/v1/invitations', description: 'Send connection request' },
        { method: 'GET', path: '/v1/search/people?q=&filters=', description: 'People search' },
        { method: 'GET', path: '/v1/pymk', description: 'Suggestions' },
        { method: 'GET', path: '/v1/feed', description: 'Home updates' },
      ],
      dataModel: [
        { name: 'profiles', columns: ['user_id', 'headline', 'company', 'geo', 'updated_at'] },
        { name: 'connections', columns: ['user_id', 'other_id', 'status', 'created_at'], notes: 'Store both directions or query both ways carefully' },
        { name: 'invites', columns: ['from_id', 'to_id', 'status'] },
        { name: 'experience', columns: ['id', 'user_id', 'title', 'company_id', 'start', 'end'] },
      ],
      architecture: 'Profile service + graph service + search index + PYMK batch jobs + feed (hybrid, lower fan-out) + messaging. Photos on CDN.',
      diagram: `flowchart TB
    Client --> GW
    GW --> Profile
    GW --> Graph
    GW --> Search
    GW --> Feed
    Graph --> Adj[(Sharded adjacency)]
    Profile --> Cache[(Profile cache)]
    Search --> ES[(People index)]
    Batch[PYMK batch] --> Graph
    Batch --> Recs[(Suggestion store)]`,
      deepDives: [
        { title: 'Mutual connections without N+1', body: 'Precompute intersection counts for visible cards, or intersect posting lists for the two adjacency sets in the graph service. Never query per-suggestion with a join in the API loop.' },
        { title: 'PYMK candidate generation', body: 'Sample 2nd-degree neighbors, coworkers, education, and later two-tower embeddings. Rank with mutuals, recency, and negative signals (ignored invites).' },
        { title: 'People search', body: 'Index display name n-grams, company, title, skills. Recruiter search adds boolean filters and larger result windows — isolate it so member typeahead stays fast.' },
      ],
      tradeoffs: [
        'Graph DB vs sharded SQL/KV: interviews should start with adjacency tables unless traversal depth is the product.',
        'Feed is secondary to graph+search here; do not spend 30 minutes on celebrity fan-out.',
      ],
      bottlenecks: ['2nd-degree explosion', 'Recruiter query load', 'Hot company pages'],
      scalingPath: [
        { scale: '1K', focus: 'Single SQL graph' },
        { scale: '1M', focus: 'Profile cache + Elastic' },
        { scale: '100M', focus: 'Sharded adjacency, PYMK offline, recruiter cluster' },
      ],
      interviewScript: [
        '“Core is profiles + bidirectional connections. Search and PYMK are derived systems.”',
        '“I will precompute suggestions; I will not walk two hops on the request.”',
      ],
      commonMistakes: ['Treating LinkedIn as only a news feed', 'Live 2nd-degree BFS'],
      relatedTopics: ['search-feeds', 'databases', 'job-matching'],
      examples: ['LinkedIn.com'],
      practicePrompt: 'Add “open to work” visibility that recruiters can filter without leaking to a member’s company.',
    }),
  },
  tinderTopic,
  {
    id: 'airbnb',
    title: 'Airbnb',
    description: 'Geo + date search, calendar inventory, and transactional booking so two guests cannot take the same night.',
    difficulty: 'Advanced',
    progress: 0,
    icon: 'Home',
    color: 'bg-rose-500',
    section: 'products',
    track: 'classic',
    prerequisites: ['databases', 'search-feeds', 'api-gateway', 'storage-media'],
    estimatedMinutes: 50,
    order: 24,
    content: emptyContent({
      overview: 'Airbnb is search plus scarce inventory. Discovery can be eventually consistent. Booking cannot. Photos and maps are CDN problems.',
      whyItExists: 'Hosts list unique homes; guests need to find available dates and pay without double booking.',
      whenToUse: ['Marketplace + calendar', 'Consistency vs search interviews'],
      functionalRequirements: [
        { title: 'Host listings', detail: 'CRUD, photos, amenities, pricing rules.' },
        { title: 'Search', detail: 'Map/list, dates, guests, filters.' },
        { title: 'Availability', detail: 'Night-level inventory, min stay, blocks.' },
        { title: 'Book', detail: 'Instant or request-to-book.' },
        { title: 'Pay, cancel, review', detail: 'After the stay window.' },
      ],
      nonFunctionalRequirements: [
        { title: 'No double book', detail: 'Strong consistency on calendar nights.' },
        { title: 'Search p99', detail: 'A few hundred ms, freshness of minutes is OK.' },
      ],
      estimates: [
        { label: 'Listings', value: 'Millions globally' },
        { label: 'Search QPS', value: 'High, read-heavy' },
        { label: 'Bookings', value: 'Much lower write QPS, high value' },
      ],
      concepts: ['Search index vs system of record', 'Night-level locks', 'Idempotent booking', 'Pricing engine'],
      walkthrough: [
        { title: 'Search', description: 'Query Elastic/geo index with date filters (encoded availability bitmaps or denormalized next-90-day flags). Hydrate listing cards from cache. Prices computed or cached.' },
        { title: 'Book', description: 'Idempotency key. Booking service locks nights in SQL (row per night or daterange exclusion). On success, payment auth, then confirm, then invalidate search docs.' },
      ],
      steps: [
        { title: 'SQL is source of truth for inventory', description: 'Never book in Elastic.' },
        { title: 'Encode availability for search', description: 'Reindex on calendar change via queue.' },
        { title: 'Idempotent POST /bookings', description: 'Mobile retries are certain.' },
      ],
      apis: [
        { method: 'GET', path: '/v1/search?ne=&sw=&checkin=&checkout=&guests=', description: 'Map search' },
        { method: 'GET', path: '/v1/listings/:id', description: 'Detail + calendar snippet' },
        { method: 'POST', path: '/v1/bookings', description: 'Idempotent book' },
      ],
      dataModel: [
        { name: 'listings', columns: ['id', 'host_id', 'lat', 'lng', 'capacity', 'base_price'] },
        { name: 'calendar_nights', columns: ['listing_id', 'date', 'status', 'price'], notes: 'UNIQUE(listing_id, date)' },
        { name: 'bookings', columns: ['id', 'listing_id', 'guest_id', 'start', 'end', 'status'] },
      ],
      architecture: 'Listing service + search cluster + booking service (SQL transactions) + payments + photo CDN + messaging. Calendar updates fan out to the index.',
      diagram: `flowchart TB
    SearchUI --> Index[(Search index)]
    SearchUI --> Cache[(Listing cache)]
    BookUI --> Book[Booking service]
    Book --> Cal[(Calendar SQL)]
    Book --> Pay[Payments]
    Cal --> Q[Index updater] --> Index`,
      deepDives: [
        { title: 'Why dates explode indexes', body: 'A geo index of listings is easy. “Available all nights in a range” is a different key. Options: nightly docs, compressed bitmaps per listing, or filter in a second pass after a wide geo fetch.' },
        { title: 'Double booking', body: 'BEGIN; select nights FOR UPDATE; if any reserved, abort; insert booking; mark nights; COMMIT. Conditional UNIQUE on (listing_id, date) is your last line of defense.' },
        { title: 'v1 vs v2', body: 'v1: Postgres + PostGIS + Stripe + simple in-DB search. v2: split search, booking, payments, and photo pipeline.' },
      ],
      tradeoffs: ['Instant book converts better and needs stricter calendar trust.', 'Request-to-book reduces mistakes, adds latency.'],
      bottlenecks: ['Popular city + holiday search', 'Calendar write vs search lag'],
      scalingPath: [
        { scale: '1K', focus: 'One Postgres' },
        { scale: '1M', focus: 'Elastic + booking service' },
        { scale: '100M', focus: 'Geo-sharded search, night inventory service' },
      ],
      interviewScript: [
        '“Search can be stale by a minute. Booking is transactional on night rows.”',
      ],
      commonMistakes: ['Booking in the search index', 'No idempotency key'],
      relatedTopics: ['databases', 'search-feeds', 'cdn', 'reliability'],
      examples: ['Airbnb', 'Vrbo'],
      practicePrompt: 'Support a listing that is booked by a host block and a guest request at the same second.',
    }),
  },
  {
    id: 'skyscanner',
    title: 'Skyscanner / Flight Search',
    description: 'Scatter-gather over slow airline APIs, aggressive caching, quote expiry, and ranking of messy fares.',
    difficulty: 'Advanced',
    progress: 0,
    icon: 'Plane',
    color: 'bg-indigo-700',
    section: 'products',
    track: 'classic',
    prerequisites: ['caching', 'api-gateway', 'message-queues', 'reliability'],
    estimatedMinutes: 50,
    order: 25,
    content: emptyContent({
      overview: 'Skyscanner is a meta-search engine. You do not own inventory. You fan out to GDS/airlines/OTAs, merge, and send the user away to book. Freshness and timeouts are the design.',
      whyItExists: 'Fares are fragmented. Users want one search box. Providers are slow, rate-limited, and inconsistent.',
      whenToUse: ['Aggregation, hedging, cache hierarchy'],
      functionalRequirements: [
        { title: 'Search', detail: 'OW/RT/multi-city, pax, cabin.' },
        { title: 'Filter/sort', detail: 'Stops, airline, duration, price.' },
        { title: 'Handoff', detail: 'Deep link or redirect with a quote id.' },
        { title: 'Price alerts', detail: 'Watch a route.' },
      ],
      nonFunctionalRequirements: [
        { title: 'Time-to-first-result', detail: 'Stream partial results; do not wait for the slowest airline.' },
        { title: 'Quote validity', detail: 'Minutes, not hours.' },
        { title: 'Provider rate limits', detail: 'A cache miss storm can get you banned.' },
      ],
      estimates: [
        { label: 'Popular routes', value: 'LHR-JFK dominates QPS' },
        { label: 'Provider RTT', value: '300ms-8s' },
        { label: 'Fan-out', value: '10-40 providers per search' },
      ],
      concepts: ['Scatter-gather', 'Hedged requests', 'Quote cache', 'Normalized fare graph'],
      walkthrough: [
        { title: 'Search request', description: 'Normalize airports/dates. Check route cache. If miss, scatter to providers with a deadline.' },
        { title: 'Merge', description: 'Normalize fares into a canonical itinerary model. Rank. Stream batches to the client via SSE.' },
        { title: 'Select', description: 'Return a quote id with TTL. Booking happens off-platform.' },
      ],
      steps: [
        { title: 'Never treat search results as bookable truth', description: 'Revalidate on handoff if you must.' },
        { title: 'Cache by route + date + pax bucket', description: 'Popular routes absorb most QPS.' },
        { title: 'Timeout stragglers', description: 'Show 12 airlines at 1.5s rather than 14 at 8s.' },
      ],
      apis: [
        { method: 'POST', path: '/v1/searches', description: 'Start search, returns searchId' },
        { method: 'GET', path: '/v1/searches/:id/results', description: 'Poll or SSE stream' },
        { method: 'GET', path: '/v1/quotes/:id', description: 'Handoff payload' },
      ],
      dataModel: [
        { name: 'airports', columns: ['iata', 'city', 'tz'] },
        { name: 'cached_quotes', columns: ['route_key', 'payload', 'fetched_at', 'ttl'] },
        { name: 'providers', columns: ['id', 'sla_ms', 'qps_limit'] },
      ],
      architecture: 'Search API → orchestrator → provider adapters (circuit breakers) → merge/rank → cache → SSE to client. Alerts are a batch/cron on cached fares.',
      diagram: `flowchart TB
    Client --> SearchAPI
    SearchAPI --> Cache[(Route cache)]
    SearchAPI --> Orch[Orchestrator]
    Orch --> P1[Airline A]
    Orch --> P2[GDS]
    Orch --> P3[OTA]
    Orch --> Merge[Normalize + rank]`,
      deepDives: [
        { title: 'Scatter-gather', body: 'Issue all provider calls in parallel. Use a per-provider timeout and an overall deadline. Hedging: if a provider is p99-slow, send a second request to a replica or skip.' },
        { title: 'Cache hierarchy', body: 'Hot route+date in Redis (30-120s). Warm fare calendars in a longer store. Origin shield so 10k users searching LHR-JFK tomorrow do not create 10k GDS calls.' },
        { title: 'Calendar vs one-shot', body: 'A month grid is N dates × providers. Precompute popular calendars offline. One-shot search can be live.' },
      ],
      tradeoffs: ['More providers: better coverage, worse tail latency.', 'Longer cache: cheaper, stale prices and angry users.'],
      bottlenecks: ['Provider bans', 'Merge CPU on fat results', 'Weekend traffic spikes'],
      scalingPath: [
        { scale: 'v1', focus: '3 adapters + Redis' },
        { scale: 'v2', focus: 'Streaming UI, hedged calls, calendar precompute' },
        { scale: 'v3', focus: 'Regional search pods near users and providers' },
      ],
      interviewScript: [
        '“I will stream partial results and budget 1.5s. Cache popular routes so providers do not melt.”',
      ],
      commonMistakes: ['Waiting for all providers', 'Storing quotes as if they were tickets'],
      relatedTopics: ['caching', 'reliability', 'api-gateway'],
      examples: ['Skyscanner', 'Kayak', 'Google Flights'],
      practicePrompt: 'A GDS starts taking 12s. Keep p50 time-to-first-itinerary under 1s.',
    }),
  },
  {
    id: 'uber',
    title: 'Uber / Ride Matching',
    description: 'Moving geo supply and demand, ETA matching, trip state machine, surge, and city-level shards.',
    difficulty: 'Advanced',
    progress: 0,
    icon: 'Car',
    color: 'bg-neutral-800',
    section: 'products',
    track: 'classic',
    prerequisites: ['realtime', 'databases', 'unique-ids'],
    estimatedMinutes: 50,
    order: 26,
    content: emptyContent({
      overview: 'Uber matches a rider to a nearby driver in a city. Locations move. The trip is a state machine. Almost all data is local to a city.',
      whyItExists: 'Idle drivers and waiting riders are a real-time geo marketplace.',
      whenToUse: ['Live geo', 'State machines', 'Regional sharding'],
      functionalRequirements: [
        { title: 'Request ride', detail: 'Pickup, dest, product type.' },
        { title: 'Match', detail: 'Offer to drivers, accept, ETA.' },
        { title: 'Track', detail: 'Live location to both parties.' },
        { title: 'Pay and rate', detail: 'On complete.' },
      ],
      nonFunctionalRequirements: [
        { title: 'Match latency', detail: 'Seconds, not minutes.' },
        { title: 'Location freshness', detail: 'Sub-second to a few seconds.' },
      ],
      estimates: [
        { label: 'Location pings', value: 'Drivers every 1-4s × tens of thousands per city' },
        { label: 'Shard', value: 'City or hex region' },
      ],
      concepts: ['Supply heatmap', 'Dispatch', 'Trip FSM', 'Surge', 'City shard'],
      walkthrough: [
        { title: 'Ping', description: 'Driver app sends location to a city ingest; geo index updates cell membership.' },
        { title: 'Request', description: 'Dispatch queries nearby cells, ranks by ETA/fairness, offers one driver, times out, next.' },
        { title: 'Trip', description: 'State: requested → matched → arriving → in_trip → completed. Locations stream over sockets.' },
      ],
      steps: [
        { title: 'Shard by city', description: 'A SF outage should not take down London.' },
        { title: 'Keep the index in memory per city', description: 'Redis/S2 or an in-memory service.' },
      ],
      apis: [
        { method: 'POST', path: '/v1/trips', description: 'Request ride' },
        { method: 'POST', path: '/v1/trips/:id/accept', description: 'Driver accept' },
        { method: 'POST', path: '/v1/locations', description: 'Location ping' },
      ],
      dataModel: [
        { name: 'trips', columns: ['id', 'city', 'rider_id', 'driver_id', 'state', 'polyline'] },
        { name: 'driver_presence', columns: ['driver_id', 'cell', 'lat', 'lng', 'ts'] },
      ],
      architecture: 'City-scoped location service + dispatch + trip service + payments + WS gateways. Global account service is separate.',
      diagram: `flowchart TB
    Driver --> Loc[City location ingest]
    Rider --> Dispatch
    Dispatch --> Loc
    Dispatch --> Trip[(Trip FSM)]
    Trip --> Pay`,
      deepDives: [
        { title: 'Matching is not nearest-neighbor only', body: 'ETA, heading, driver idle time, and surge zones matter. Nearest driver in Euclidean space can be across a river.' },
        { title: 'Surge', body: 'Estimate demand/supply per cell, cap spikes, show a multiplier before request.' },
      ],
      tradeoffs: ['Global dispatch vs city isolation.', 'Offer many drivers at once vs sequential (cancel chaos).'],
      bottlenecks: ['Concert/stadium spikes', 'Location write amplification'],
      scalingPath: [
        { scale: '1 city', focus: 'In-memory geo + SQL trips' },
        { scale: 'N cities', focus: 'Independent city stacks' },
      ],
      interviewScript: [
        '“I will shard by city and keep driver locations in a memory index. The trip row is the source of truth for state.”',
      ],
      commonMistakes: ['Global consistent DB for location pings', 'Ignoring river/road ETA'],
      relatedTopics: ['realtime', 'tinder', 'unique-ids'],
      examples: ['Uber', 'Lyft'],
      practicePrompt: 'A stadium lets out 20k riders. Explain surge, queueing, and driver rebalance.',
    }),
  },
  {
    id: 'whatsapp',
    title: 'WhatsApp / Messaging',
    description: 'Persistent connections, offline inbox, group fan-out, and media that never rides the chat hot path.',
    difficulty: 'Advanced',
    progress: 0,
    icon: 'MessageCircle',
    color: 'bg-green-600',
    section: 'products',
    track: 'classic',
    prerequisites: ['realtime', 'storage-media', 'databases'],
    estimatedMinutes: 45,
    order: 27,
    content: emptyContent({
      overview: 'WhatsApp is a connection and delivery problem. Messages are small. Devices are flaky. Groups multiply fan-out. E2E encryption changes what the server may store.',
      whyItExists: 'People need reliable 1:1 and group chat across poor networks.',
      whenToUse: ['Chat interviews', 'Delivery semantics'],
      functionalRequirements: [
        { title: '1:1 and groups', detail: 'Send, ack, receipt, unread.' },
        { title: 'Offline', detail: 'Queue until the device connects.' },
        { title: 'Media', detail: 'Upload blob, send a pointer.' },
      ],
      nonFunctionalRequirements: [
        { title: 'Online delivery', detail: 'Hundreds of ms.' },
        { title: 'Exactly-once UX', detail: 'At-least-once + client dedup by message id.' },
      ],
      estimates: [
        { label: 'Online sockets', value: 'Hundreds of millions globally' },
        { label: 'Group of 512', value: 'One send → 511 deliveries' },
      ],
      concepts: ['WS gateways', 'Inbox per device', 'Fan-out for groups', 'E2E constraints'],
      walkthrough: [
        { title: 'Send', description: 'Client encrypts, POSTs/WS-sends to chat service with message id. Server writes recipient inboxes and pub/sub to online gateways.' },
        { title: 'Offline', description: 'Inbox store holds ciphertext until ack. Push notification wakes the device.' },
      ],
      steps: [
        { title: 'Separate media', description: 'Signed PUT, then a message with the object key.' },
        { title: 'Per-device inbox', description: 'Multi-device is multiple deliveries.' },
      ],
      apis: [
        { method: 'WS', path: '/v1/chat', description: 'Frames: send, ack, receipt' },
        { method: 'POST', path: '/v1/media/upload-url', description: 'Signed URL' },
      ],
      dataModel: [
        { name: 'messages', columns: ['id', 'chat_id', 'from', 'ciphertext', 'ts'] },
        { name: 'inbox', columns: ['user_id', 'device_id', 'msg_id', 'acked'] },
        { name: 'group_members', columns: ['group_id', 'user_id'] },
      ],
      architecture: 'WS gateway fleet + chat service + durable inbox + pub/sub + media store/CDN. Presence optional and expensive.',
      diagram: `flowchart LR
    A[Phone A] --> GWa[Gateway]
    GWa --> Chat
    Chat --> Inbox[(Inbox)]
    Chat --> Sub[Pub/Sub]
    Sub --> GWb[Gateway]
    GWb --> B[Phone B]`,
      deepDives: [
        { title: 'Delivery vs processing', body: 'The server can guarantee at-least-once delivery of ciphertext. Exactly-once processing is the client dropping duplicate ids.' },
        { title: 'Large groups', body: 'Do not open N DB connections. Fan-out through a queue. For huge broadcasts, use a fan-out service like a feed, not a chat inbox per member in one request.' },
        { title: 'E2E', body: 'Server cannot search message bodies. Backups are client-side. That is a product constraint, not just a checkbox.' },
      ],
      tradeoffs: ['Store plaintext for search vs E2E.', 'Receipts increase write amplification.'],
      bottlenecks: ['Gateway connections', 'Group fan-out', 'Media bandwidth'],
      scalingPath: [
        { scale: 'v1', focus: 'One chat DB + long poll' },
        { scale: 'v2', focus: 'WS fleet + inbox + media store' },
      ],
      interviewScript: [
        '“Live path is gateways. Durability is an inbox. Media is object storage. Clients dedup on message id.”',
      ],
      commonMistakes: ['Chat history only in RAM', 'Sending JPEGs through the socket as payload'],
      relatedTopics: ['realtime', 'storage-media', 'slack'],
      examples: ['WhatsApp', 'Messenger'],
      practicePrompt: 'Add multi-device without breaking E2E.',
    }),
  },
  youtubeTopic,
  {
    id: 'instagram',
    title: 'Instagram',
    description: 'Photo upload pipeline, hybrid feed fan-out, stories with TTL, and a counter service for likes.',
    difficulty: 'Advanced',
    progress: 0,
    icon: 'Camera',
    color: 'bg-fuchsia-600',
    section: 'products',
    track: 'classic',
    prerequisites: ['news-feed', 'storage-media', 'cdn'],
    estimatedMinutes: 45,
    order: 29,
    content: emptyContent({
      overview: 'Instagram combines YouTube-like media with a Twitter-like feed, plus ephemeral stories and a grid profile. Fan-out and counters are the usual deep dives.',
      whyItExists: 'Visual social: upload once, deliver to followers, explore, and expire stories.',
      whenToUse: ['Feed + media combo interviews'],
      functionalRequirements: [
        { title: 'Post photo/video', detail: 'Caption, carousel.' },
        { title: 'Home feed', detail: 'Follow graph + rank.' },
        { title: 'Stories', detail: '24h TTL.' },
        { title: 'Profile grid', detail: 'Owner’s posts.' },
        { title: 'Like/comment', detail: 'High write, approximate counts OK at first.' },
      ],
      nonFunctionalRequirements: [
        { title: 'Upload to first-follower visibility', detail: 'Seconds for normal users.' },
        { title: 'Image p99', detail: 'CDN.' },
      ],
      estimates: [
        { label: 'Photos/day', value: 'Tens to hundreds of millions' },
        { label: 'Likes', value: 'Write-heavy counters' },
      ],
      concepts: ['Hybrid fan-out', 'Story TTL', 'Counter service', 'Explore as a recs product'],
      walkthrough: [
        { title: 'Upload', description: 'Signed URL, image variants, metadata row, fan-out or mark celebrity.' },
        { title: 'Home', description: 'Timeline ids + hydrate + CDN URLs.' },
        { title: 'Story', description: 'Write to a TTL store (Redis + backing). Reads skip expired.' },
      ],
      steps: [
        { title: 'Reuse news-feed hybrid', description: 'Do not reinvent celebrity handling.' },
        { title: 'Move counters out of the post row', description: 'Hot posts will lock the row.' },
      ],
      apis: [
        { method: 'POST', path: '/v1/media', description: 'Complete upload + create post' },
        { method: 'GET', path: '/v1/feed', description: 'Home' },
        { method: 'POST', path: '/v1/likes', description: 'Like post' },
      ],
      dataModel: [
        { name: 'posts', columns: ['id', 'author_id', 'media_keys', 'caption', 'ts'] },
        { name: 'stories', columns: ['id', 'author_id', 'media_key', 'expires_at'] },
        { name: 'counters', columns: ['post_id', 'likes', 'comments'] },
      ],
      architecture: 'Media pipeline + post service + hybrid timelines + stories TTL + counter service + CDN. Explore is batch+online recs.',
      diagram: `flowchart TB
    Upload --> Store
    Store --> Variants
    Variants --> Post
    Post --> Fanout
    Fanout --> Feed[(Timelines)]
    Like --> Counters`,
      deepDives: [
        { title: 'Stories', body: 'TTL is a first-class feature. A wide-column/Redis key with expire is enough. Do not run a global sweeper that deletes millions of SQL rows at midnight.' },
        { title: 'Counters', body: 'Buffer increments in Redis and flush. Read path can be slightly stale.' },
      ],
      tradeoffs: ['Ranked home vs chronological following.', 'Explore quality vs feed latency engineering.'],
      bottlenecks: ['Celebrity posts', 'Like bursts on viral media'],
      scalingPath: [
        { scale: 'v1', focus: 'S3 + SQL feed' },
        { scale: 'v2', focus: 'Hybrid + CDN variants + counters' },
      ],
      interviewScript: [
        '“Media path is signed upload + CDN. Feed is hybrid fan-out. Likes are a counter service.”',
      ],
      commonMistakes: ['Storing like_count on the post row only', 'SQL DELETE for story expiry at scale'],
      relatedTopics: ['news-feed', 'youtube', 'recommendation-system'],
      examples: ['Instagram'],
      practicePrompt: 'Add multi-photo carousels without multiplying fan-out writes by slide count.',
    }),
  },
  spotifyTopic,
  netflixTopic,
  zoomTopic,
  slackTopic,
  gmailTopic,
  googleSearchTopic,
  paytmTopic,
  zomatoTopic,
  bookmyshowTopic,
];
