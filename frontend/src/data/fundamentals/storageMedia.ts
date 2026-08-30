import { ArchitectureTopic, emptyContent } from '../systemDesignTypes';

export const storageMediaTopic: ArchitectureTopic = {
  id: 'storage-media',
  title: 'Object Storage, Blobs and Media Pipelines',
  description:
    'Where files actually live once they are too large for a database row, and how an uploaded video becomes something a phone on a train can play.',
  difficulty: 'Intermediate',
  progress: 0,
  icon: 'HardDrive',
  color: 'bg-orange-600',
  section: 'fundamentals',
  track: 'classic',
  prerequisites: ['databases', 'cdn'],
  estimatedMinutes: 65,
  order: 7,
  content: emptyContent({
    overview:
      'Object storage is the answer to a question relational databases answer badly: where do you put a 4 GB video, a 12 MP photo, or ten billion small thumbnails. An object store gives up the file system abstractions you are used to, directories, partial writes, rename, in exchange for effectively unlimited capacity, eleven nines of durability, and a flat key space you address over HTTP. Everything else in this lesson follows from that trade. Because objects are immutable and addressed by key, uploads must bypass your servers, transformations must happen out of band, and the database stores only a pointer.',
    whyItExists:
      'A database row is designed to be read, locked, and rewritten inside a transaction, which is the wrong shape for a blob measured in megabytes. Storing large binaries in Postgres bloats the write-ahead log, destroys the buffer cache hit ratio, and makes every backup and replica rebuild proportional to your media volume rather than your data volume. Object storage separates the two so the database stays small and fast.',
    problemStatement: {
      prompt:
        'Users upload photos up to 25 MB and videos up to 2 GB from mobile networks that drop constantly. Each upload must be available for playback within roughly a minute, in several resolutions, worldwide, and the whole thing must not fall over when a launch pushes 5,000 uploads per minute. Design the storage and processing path, and state exactly what the database stores.',
      inScope: [
        'Block, file, and object storage, and when each is the right shape',
        'Presigned uploads, multipart uploads, and resumability',
        'The transcode pipeline and how it is triggered',
        'Storage classes, lifecycle policies, and what they really cost',
      ],
      outOfScope: [
        'Edge caching and delivery specifics (see the CDN lesson)',
        'Relational schema design and indexing (see the Databases lesson)',
        'Recommendation and ranking of the media (see Search and Feeds)',
        'Codec internals and encoder tuning',
      ],
    },
    assumptions: [
      'Objects are written once and read many times; in-place mutation is never required',
      'A few seconds between upload completion and playback availability is acceptable',
      'The database remains the source of truth for metadata; the object store holds only bytes',
    ],
    whenToUse: [
      'Any user-uploaded file: photos, video, audio, documents, avatars',
      'Generated artefacts you can recompute but would rather not: thumbnails, PDF exports, model checkpoints',
      'Append-only data lakes and log archives read by batch jobs rather than by request handlers',
    ],
    functionalRequirements: [
      { title: 'Upload without proxying', detail: 'The client sends bytes directly to the store using a short-lived presigned URL, so no application server touches the payload.' },
      { title: 'Survive a dropped connection', detail: 'A 2 GB upload that fails at 80% resumes from the last completed part rather than restarting.' },
      { title: 'Derive renditions', detail: 'One source object produces thumbnails and multiple encoded resolutions without blocking the upload response.' },
      { title: 'Serve privately', detail: 'The bucket is not public; reads go through signed URLs or a CDN with signed cookies, and access can be revoked.' },
    ],
    nonFunctionalRequirements: [
      { title: 'Durability', detail: 'Around 99.999999999% annual object durability, achieved by erasure coding across at least three availability zones.' },
      { title: 'Availability', detail: 'Roughly 99.9% to 99.99% for reads, which is materially lower than durability; the bytes survive even when the API is briefly unreachable.' },
      { title: 'Latency', detail: 'First byte in 20 to 100 ms from the same region, which is why a CDN sits in front of anything user facing.' },
      { title: 'Cost shape', detail: 'Storage is cheap per GB, requests are cheap per thousand, and cross-region egress is the line item that surprises people.' },
    ],
    estimates: [
      { label: 'Photo storage per year', value: '1M uploads/day × 3 MB × 365 ≈ 1.1 PB', note: 'Renditions typically add 40 to 60% on top of the originals' },
      { label: 'Video transcode cost', value: '1 min of 1080p ≈ 1 to 2 min of CPU per rendition', note: 'Five renditions means roughly 5 to 10 CPU-minutes per source minute' },
      { label: 'Multipart part size', value: '8 MB parts, 10,000 part limit', note: 'That ceiling puts a 2 GB file at 250 parts, comfortably inside the limit' },
      { label: 'Upload burst', value: '5,000 uploads/min ≈ 83 concurrent PUTs', note: 'Trivial for the object store, fatal if you proxy them through application servers' },
      { label: 'Storage class saving', value: 'Infrequent access is roughly 45% cheaper per GB', note: 'It charges a per-GB retrieval fee, so it loses money on anything read more than about monthly' },
      { label: 'Metadata row size', value: '~300 bytes per object', note: 'A petabyte of media is only a few GB of Postgres, which is the entire point of the split' },
    ],
    concepts: [
      'Block versus file versus object storage',
      'Flat key space, key prefixes, and the illusion of folders',
      'Presigned URLs and direct-to-store upload',
      'Multipart upload, part size, and resumability',
      'Erasure coding and replication factor',
      'Read-after-write versus eventual consistency for overwrites',
      'Storage classes and lifecycle transitions',
      'Content addressing and deduplication',
      'Adaptive bitrate streaming, HLS and DASH manifests',
    ],
    comparisons: [
      {
        title: 'Three shapes of storage',
        headers: ['Type', 'How it works', 'Interface', 'Use when', 'Avoid when'],
        rows: [
          [
            'Block (EBS, SAN)',
            'Exposes raw fixed-size blocks; a file system such as ext4 is layered on top and the operating system caches and schedules the IO',
            'Attached device, one writer',
            'Database data directories, anything needing random writes and low latency',
            'You need many machines writing the same data, or capacity beyond one volume',
          ],
          [
            'File (NFS, EFS)',
            'A shared hierarchical namespace with POSIX semantics, locking, and permissions, served over a network protocol',
            'Mounted path, many readers and writers',
            'Legacy applications that expect a real file system, shared build or home directories',
            'Very high throughput or very large scale; metadata operations become the bottleneck',
          ],
          [
            'Object (S3, GCS, R2)',
            'Immutable blobs in a flat key space, replicated or erasure coded across zones, addressed over HTTP',
            'GET, PUT, DELETE by key',
            'Media, backups, data lakes, static assets, anything write-once read-many',
            'You need to modify part of a file in place, or you need single-digit millisecond reads',
          ],
        ],
        note: 'The practical rule: block for databases, object for everything a user uploads or downloads, file only when something legacy forces your hand.',
      },
      {
        title: 'Storage classes and what they are actually for',
        headers: ['Class', 'Retrieval', 'Relative cost per GB', 'Use when'],
        rows: [
          ['Standard', 'Immediate, no retrieval fee', '1.0×', 'Anything on a read path today: recent uploads, active assets'],
          ['Infrequent access', 'Immediate, per-GB retrieval fee', '~0.55×', 'Read less than about once a month, but must be instant when read'],
          ['Intelligent tiering', 'Immediate, small per-object monitoring fee', '1.0× falling to ~0.55×', 'Access patterns you genuinely cannot predict; it moves objects for you'],
          ['Archive / Glacier', 'Minutes to hours, higher retrieval fee', '~0.1×', 'Compliance retention, old originals kept only in case of re-encode'],
          ['Deep archive', 'Up to 12 hours', '~0.04×', 'Legal holds and disaster copies you expect never to read'],
        ],
        note: 'Lifecycle rules automate the transitions, for example Standard for 30 days, infrequent access to 90, archive after a year. Watch the minimum storage duration: deleting an archived object after a week can still bill you for months.',
      },
      {
        title: 'Upload strategies',
        headers: ['Strategy', 'Path the bytes take', 'Use when', 'Avoid when'],
        rows: [
          ['Proxy through the API', 'Client to application server to object store', 'Small files under about 1 MB where you must inspect content synchronously', 'Anything larger; you are paying for bandwidth twice and blocking a worker for the duration'],
          ['Presigned PUT', 'Client straight to the object store with a signed, expiring URL', 'Single-shot uploads up to a few hundred MB', 'The network is unreliable, or the file is large enough that a failure is likely'],
          ['Multipart upload', 'Client uploads independent parts, then commits a manifest', 'Files above roughly 100 MB, or any mobile upload', 'Tiny files, where the extra round trips dominate'],
          ['Resumable session', 'A session URL tracks the committed byte offset across reconnects', 'Very large files on hostile networks', 'You need parallel part uploads, which multipart does better'],
        ],
      },
    ],
    architecture:
      'The client asks the API for an upload ticket, and the API creates a pending row in Postgres holding a generated object key, then returns a presigned multipart upload for that exact key. The bytes go straight from the device to the object store, never touching an application server. When the client commits the upload, the store emits an object-created event onto a queue, and a pool of transcode workers picks it up, writes renditions back under sibling keys, and updates the metadata row to ready. Reads never hit the bucket directly: a CDN sits in front with signed URLs, so the origin sees only cache fills. The database holds roughly 300 bytes per object, so a petabyte of media corresponds to a few gigabytes of rows.',
    diagrams: [
      { id: 'pipeline', title: 'Upload, event, transcode, deliver', kind: 'excalidraw', src: 'media-pipeline' },
      { id: 'anim', title: 'A 2 GB upload that drops halfway', kind: 'animation', src: 's3-put' },
    ],
    walkthrough: [
      {
        title: 'The database stores a pointer, never the bytes',
        description:
          'Decide the split before anything else. Postgres gets a media row with an id, an object key, an owner, a content type, a byte size, a checksum, and a status. The object store gets the bytes. This keeps the database proportional to the number of files rather than their size, which means backups stay minutes rather than hours and a replica can be rebuilt without moving a petabyte. It also means a media row can exist in a pending state before any bytes arrive, which is what makes the next step possible.',
      },
      {
        title: 'Mint a presigned upload instead of proxying',
        description:
          'The API generates the object key itself, typically something like media/2026/08/{uuid}, writes the pending row, and signs a URL that grants permission to write that one key for the next fifteen minutes. The client uploads directly. Nothing about a 2 GB transfer touches your servers, so a burst of 5,000 uploads per minute costs you 5,000 cheap signing calls rather than 5,000 occupied request workers. Constrain the signature with a content-length range and a content type so a signed URL for an avatar cannot be used to store a movie.',
        animation: 's3-put',
      },
      {
        title: 'Break large files into parts so failures are cheap',
        description:
          'Above about 100 MB, initiate a multipart upload and hand the client signed URLs for 8 MB parts. Each part is uploaded independently and returns an ETag, and the client can retry a single failed part or upload several in parallel. When every part is in, the client sends a complete request with the list of part numbers and ETags and the store assembles them server-side. A dropped connection at 80% of a 2 GB file costs you one 8 MB part, not 1.6 GB.',
      },
      {
        title: 'Let the store announce the upload, do not trust the client',
        description:
          'The client calling your API to say "I finished" is an optimisation, not a source of truth, because a client that crashes after the last part still produced a complete object. Configure the bucket to emit an object-created event to a queue and treat that as the trigger. Now the pipeline is driven by something that actually observed the bytes, and an abandoned multipart upload simply expires under a lifecycle rule after a day.',
      },
      {
        title: 'Transcode out of band, in a fan-out',
        description:
          'A worker consumes the event, downloads the source, probes it, and emits one job per rendition so a 1080p, 720p, 480p, and audio-only encode run on separate workers in parallel rather than serially on one. Each finished rendition is written under a sibling key and recorded. Only when every required rendition exists does the status flip to ready. Jobs must be idempotent, keyed on source object plus rendition, because a redelivered queue message is normal and re-encoding the same output twice must be harmless.',
      },
      {
        title: 'Deliver through a CDN, never from the bucket',
        description:
          'Point a CDN at the bucket as origin and serve signed URLs or signed cookies with a short expiry. The bucket itself stays private, egress from the origin drops to cache fills only, and playback latency becomes a local edge round trip rather than a cross-region one. For video, the player fetches an HLS or DASH manifest listing the available renditions and switches bitrate segment by segment as the phone moves between good and bad signal.',
      },
      {
        title: 'Age the data down through storage classes',
        description:
          'Almost all reads happen in the first week. Write a lifecycle policy that keeps objects in Standard for 30 days, moves them to infrequent access at 30, and archives originals after a year while keeping the renditions hot. Add a rule that aborts incomplete multipart uploads after one day, because unfinished parts are invisible in a normal object listing and quietly bill you forever.',
      },
    ],
    deepDives: [
      {
        title: 'Why object storage gives up the file system',
        body:
          'An object store has no directories, no rename, no append, and no partial write. The key media/2026/08/cat.jpg contains slashes but the store sees one flat string; listing a prefix is a range scan over a sorted key index rather than a directory read. Every one of those omissions buys scale. Without directories there is no tree to lock or rebalance, so the namespace shards across thousands of machines by key range. Without in-place mutation an object is immutable once written, which means it can be erasure coded across zones, cached anywhere without invalidation logic, and served by any replica. The cost lands on you: to change one byte you rewrite the whole object, and to organise data you design a key naming scheme up front, because there is no mv to fix it later.',
      },
      {
        title: 'Erasure coding, and why durability is not availability',
        body:
          'Eleven nines of durability does not come from keeping eleven copies. A typical scheme splits an object into k data fragments and computes m parity fragments, for example 6 data and 3 parity, then spreads all nine across at least three availability zones. Any six fragments reconstruct the object, so the system survives losing an entire zone plus a disk, at a storage overhead of 1.5× rather than the 3× that plain replication would cost. Note that this is a statement about the bytes, not about the service. Durability of 99.999999999% and availability of 99.9% coexist happily: the data is essentially never lost, but the API can be unreachable for roughly nine hours a year. If your read path cannot tolerate that, you need a CDN in front and a cached fallback, not a second copy of the bytes.',
      },
      {
        title: 'Consistency, and the read-after-write you actually get',
        body:
          'Modern object stores give strong read-after-write consistency for new objects: PUT a key, GET it immediately, and you get the bytes. What remains subtle is everything around that. Overwriting an existing key is atomic in the sense that you get either the old object or the new one, never a mixture, but a CDN or browser holding the old copy will keep serving it until its TTL expires, which is why overwriting a key is a bad idea for anything cached. The standard fix is to treat keys as immutable and version them, writing avatar/{userId}/{uuid}.jpg and updating the pointer in the database, so a new upload produces a new URL that no cache has ever seen. Listing is also weaker than point reads; a freshly written key can be absent from a prefix listing briefly, which is why pipelines are driven by events rather than by polling a listing.',
      },
      {
        title: 'The transcode pipeline as a fan-out of idempotent jobs',
        body:
          'Transcoding is CPU bound and slow: roughly one to two minutes of CPU per minute of 1080p source per rendition, so five renditions of a ten minute video is on the order of an hour of CPU. That has to be a fan-out. The object-created event produces one job per rendition on a queue, workers scale on queue depth, and each job writes exactly one output key derived deterministically from the source id and the rendition name. Determinism is what makes redelivery safe, and redelivery is guaranteed because queues are at-least-once. Long jobs also need heartbeating: a worker that takes twenty minutes must extend its visibility timeout or the queue will hand the same job to a second worker and you will pay twice. Failed jobs go to a dead letter queue with the source key so a bad codec can be replayed after a fix, and the media row stays in a processing state, which is far better than a video that silently never appears.',
      },
      {
        title: 'Adaptive bitrate, and why one file is not enough',
        body:
          'A single 1080p file is unplayable on a phone that drops to 500 kbps in a tunnel, and wasteful on a laptop that could take 4K. Adaptive bitrate solves this by encoding the source into a ladder, perhaps 240p at 400 kbps up to 1080p at 5 Mbps, and then cutting each rendition into segments of two to ten seconds. A manifest, an m3u8 for HLS or an MPD for DASH, lists the ladder and the segments. The player measures its own throughput and buffer level and picks the next segment independently, so quality steps down mid-playback instead of stalling. This is also why segments are ideal CDN objects: they are small, immutable, and requested in a predictable order, so an edge can prefetch and a popular video is served almost entirely from cache.',
      },
      {
        title: 'Deduplication, content addressing, and the delete problem',
        body:
          'Hashing the content and using the digest as the key, for example blobs/sha256/{digest}, means the same file uploaded by a thousand users is stored once. On a photo sharing product with heavy resharing this can cut storage by 30% or more, and it makes uploads idempotent for free, since re-uploading identical bytes writes the same key. The complication is deletion. You can no longer delete when one user deletes their copy, because others still reference the blob, so you need reference counting in the database or an asynchronous mark-and-sweep that lists blobs with no referencing rows. Content addressing also breaks per-user encryption keys, since two users encrypting the same photo produce different bytes. Most products therefore dedupe only for public or system-generated assets and skip it for private user media.',
      },
      {
        title: 'The costs that surprise people',
        body:
          'Storage at roughly 0.02 dollars per GB per month is rarely the problem. Egress is: moving 1 PB out to the internet can cost tens of thousands of dollars, which is the single strongest argument for a CDN, since a 95% cache hit ratio removes 95% of origin egress. Request pricing bites differently, punishing many small objects, so ten billion thumbnails cost more in PUTs and GETs than in bytes and are often better packed into sprite sheets or a small-object store. Cross-region replication doubles storage and adds transfer on every write. And the invisible one is incomplete multipart uploads, which do not appear in a listing but are billed, so a lifecycle rule aborting them after a day is one of the highest value three lines of configuration you will ever write.',
      },
    ],
    tradeoffs: [
      'Object storage buys unlimited capacity and durability by giving up in-place mutation and POSIX semantics.',
      'Presigned direct upload removes your servers from the data path and moves validation to after the bytes have already landed.',
      'Deduplication cuts storage materially and makes deletion a reference counting problem.',
      'Colder storage classes cut per-GB cost and add a retrieval fee plus a minimum billing duration.',
      'More renditions improve playback on bad networks and multiply both transcode CPU and stored bytes.',
    ],
    bottlenecks: [
      'Proxying uploads through application servers, so one large upload occupies a worker for minutes.',
      'Serial transcoding, where a ten minute video blocks a worker for an hour instead of fanning out.',
      'Serving reads straight from the bucket, so origin egress scales with traffic instead of with cache misses.',
      'Sequential key prefixes concentrating writes on one partition of the store key space.',
      'Orphaned objects and abandoned multipart uploads accumulating with no lifecycle rule to reap them.',
    ],
    scalingPath: [
      { scale: 'Prototype', focus: 'One bucket, presigned PUT, synchronous thumbnailing, public read, no lifecycle rules' },
      { scale: 'One region', focus: 'Multipart uploads, event-driven transcode workers on a queue, CDN with signed URLs, lifecycle to infrequent access' },
      { scale: 'Global', focus: 'Multi-region buckets with replication, per-region CDN origins, dedup on public assets, archive tier for originals, cost dashboards per prefix' },
    ],
    interviewScript: [
      '"The database stores a key, a size, a checksum, and a status. The bytes go to object storage, so Postgres stays a few gigabytes even at a petabyte of media."',
      '"Uploads are presigned and go directly from the device to the bucket, because proxying 2 GB through an application server wastes a worker and pays for the bandwidth twice."',
      '"Anything over about 100 MB uses multipart with 8 MB parts, so a drop at 80% costs one part rather than the whole file."',
      '"The pipeline is triggered by the bucket object-created event, not by the client, because a client can crash after the last part succeeds."',
      '"Transcoding fans out one job per rendition, and each job is idempotent on source id plus rendition, since the queue is at-least-once."',
      '"Reads go through a CDN with signed URLs. At a 95% hit ratio that removes 95% of origin egress, which is the dominant cost at this scale."',
    ],
    commonMistakes: [
      'Storing blobs in the database, which bloats the write-ahead log and makes every backup and replica rebuild proportional to media volume.',
      'Proxying large uploads through the API tier and then wondering why a launch exhausts the worker pool.',
      'Treating the client callback as proof the upload completed, so crashed clients leave rows stuck in pending forever.',
      'Overwriting an existing key for a new avatar, so caches and CDNs serve the old image until their TTL expires.',
      'Making the bucket public because signed URLs seemed like extra work, then discovering the whole namespace is enumerable.',
      'Never configuring a lifecycle rule to abort incomplete multipart uploads, which are billed but invisible in a listing.',
      'Transcoding synchronously inside the upload request, so a large video times out at the load balancer.',
    ],
    relatedTopics: ['cdn', 'databases', 'message-queues', 'youtube', 'instagram'],
    examples: [
      'Instagram stores photos in object storage and keeps only a small metadata row per post, so the relational tier stays tiny relative to the media',
      'YouTube fans a single upload out into a ladder of renditions and serves segmented adaptive bitrate streams from edge caches',
      'Dropbox content-addresses file blocks so an identical file shared across many accounts is stored once and deduplicated on upload',
    ],
    practicePrompt:
      'Design the upload and playback path for a product where users post 60 second videos from mobile. State the object key scheme, what the database row contains, how the transcode pipeline is triggered, and what a user sees in the 40 seconds between finishing an upload and the video being playable.',
    followUps: [
      {
        question: 'Why not just store files in the database as BLOBs?',
        answer:
          'Because every large value flows through the write-ahead log, replication stream, and backups. A petabyte of media turns a ten minute backup into a multi-day one and makes rebuilding a replica impractical. Large values also evict useful pages from the buffer cache, so unrelated queries slow down. Object storage keeps the database proportional to the number of files rather than their size, which is typically a few hundred bytes per object instead of several megabytes.',
        category: 'Design',
        difficulty: 'easy',
      },
      {
        question: 'How does a presigned URL stay safe if anyone who has it can upload?',
        answer:
          'The signature is scoped, not general. It authorises one HTTP method against one exact key, expires in minutes, and can additionally constrain content type and a content length range. So a leaked URL lets someone write that single object during a short window and nothing else. Because your API generates the key rather than accepting one from the client, a user cannot direct the upload at another user prefix, and the pending database row means an unexpected object with no row is easy to detect and reap.',
        category: 'Security',
        difficulty: 'medium',
      },
      {
        question: 'What happens if the client uploads all the parts and then crashes before committing?',
        answer:
          'The parts sit in the store as an incomplete multipart upload. They are billed, they do not appear in a normal object listing, and no object-created event fires, so your pipeline never runs and the media row stays pending. Two things fix this: a lifecycle rule that aborts incomplete multipart uploads after one day, and a sweeper that expires pending rows older than a few hours. Without the lifecycle rule the invisible parts accumulate indefinitely.',
        category: 'Operations',
        difficulty: 'medium',
      },
      {
        question: 'Should the client or the server decide the object key?',
        answer:
          'The server, always. A client-chosen key lets one user write into another user prefix, overwrite an existing object, or create keys that break your prefix conventions. The server generates something like media/{yyyy}/{mm}/{uuid}, writes the pending row, and signs a URL for exactly that key. As a side effect the key is unguessable, which means even a misconfigured bucket is not trivially enumerable, and the key is opaque so you can change your layout later without the client knowing.',
        category: 'Security',
        difficulty: 'easy',
      },
      {
        question: 'Why trigger processing from a bucket event instead of an API call from the client?',
        answer:
          'Because the bucket event is the only signal that actually observed the bytes. A client can complete the final part and then lose its connection, be killed by the operating system, or simply be a hostile client that never calls you. Bucket events also give you at-least-once delivery into a queue for free, so a worker crash retries rather than losing the job. Keep the client callback as a latency optimisation for the user interface, but never as the trigger of record.',
        category: 'Pipeline',
        difficulty: 'medium',
      },
      {
        question: 'How do you make transcode jobs safe under at-least-once delivery?',
        answer:
          'Derive the output key deterministically from the source id and the rendition name, so re-running a job overwrites the same object with identical bytes and nothing downstream notices. Record completion in the database with an upsert keyed on the same pair rather than an insert. Long jobs must also heartbeat and extend their visibility timeout, otherwise the queue assumes the worker died at the timeout and dispatches a duplicate that competes with a job still running.',
        category: 'Pipeline',
        difficulty: 'hard',
      },
      {
        question: 'A user replaces their avatar and the old one keeps showing. Why?',
        answer:
          'You overwrote the key, and the CDN and browser are still holding the previous response until its TTL expires. Purging the edge works but is slow and rate limited. The correct fix is to stop overwriting: write a new key containing a uuid or content hash, update the pointer in the database, and let the old object be reaped by a lifecycle rule. A URL that no cache has ever seen cannot serve a stale copy, which lets you keep long cache lifetimes.',
        category: 'Consistency',
        difficulty: 'medium',
      },
      {
        question: 'What actually dominates the bill at a petabyte of media?',
        answer:
          'Egress, not storage. A petabyte at rest is on the order of twenty thousand dollars a month, while pushing a petabyte to the internet can be several times that, which is why a CDN at a 95% hit ratio pays for itself immediately. Request pricing matters separately when you have billions of small objects, since you are charged per thousand operations regardless of size. Cross-region replication quietly doubles storage and adds transfer on every write.',
        category: 'Cost',
        difficulty: 'medium',
      },
      {
        question: 'When is deduplication worth the complexity?',
        answer:
          'When the same bytes genuinely recur, such as public assets, system-generated files, or a product with heavy resharing, where it can cut storage by 30% or more. It costs you a reference count or a mark-and-sweep collector, because you can no longer delete a blob when one owner deletes their copy. It is usually not worth it for private user media, both because collisions are rare and because per-user encryption produces different ciphertext for identical plaintext, which defeats it entirely.',
        category: 'Design',
        difficulty: 'hard',
      },
      {
        question: 'How do you keep media private without proxying every read?',
        answer:
          'Keep the bucket private and put a CDN in front with signed URLs or signed cookies carrying a short expiry, so the edge validates the signature and your servers only ever mint tokens. For video, sign the manifest and use short-lived segment tokens so a shared link stops working within minutes. When authorisation is genuinely complex, have the API make the decision and issue the signature, but never let the bytes themselves flow through your application tier.',
        category: 'Security',
        difficulty: 'hard',
      },
    ],
  }),
};
