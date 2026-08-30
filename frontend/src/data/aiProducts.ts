import { ArchitectureTopic, emptyContent } from './systemDesignTypes';

export const aiProducts: ArchitectureTopic[] = [
  {
    id: 'chatgpt-assistant',
    title: 'ChatGPT-like Assistant',
    description: 'Sessions, streaming, memory, model routing, and abuse controls for a consumer chat product.',
    difficulty: 'Intermediate',
    progress: 0,
    icon: 'MessageSquare',
    color: 'bg-emerald-600',
    section: 'products',
    track: 'ai',
    prerequisites: ['llm-serving', 'prompting', 'ai-caching', 'ai-safety'],
    estimatedMinutes: 45,
    order: 20,
    content: emptyContent({
      overview: 'A hosted chat product is a session store plus a streaming generate path plus light memory. The model is replaceable; the conversation fabric is the system.',
      whyItExists: 'Users want multi-turn help with low TTFT and some memory, without you training a foundation model.',
      whenToUse: ['Consumer or general assistant interviews'],
      functionalRequirements: [
        { title: 'Threads', detail: 'Create, list, resume, title.' },
        { title: 'Stream replies', detail: 'SSE/WS tokens.' },
        { title: 'Optional tools', detail: 'Browse, code, images — each a service.' },
        { title: 'Memory', detail: 'User-approved long-term facts, not the full transcript forever in the window.' },
      ],
      nonFunctionalRequirements: [
        { title: 'TTFT', detail: 'Interactive.' },
        { title: 'Abuse', detail: 'Rate limits, content policy, jailbreak resistance.' },
      ],
      estimates: [
        { label: 'Turns/day', value: 'High; most are short' },
        { label: 'Context', value: 'Last N turns + summary + memory snippets' },
      ],
      concepts: ['Session store', 'Windowing + summary', 'Router', 'Moderation'],
      walkthrough: [
        { title: 'Send', description: 'Load thread, build window (recent + summary + memory), moderate input, route model, stream tokens, persist assistant message, update summary async if long.' },
      ],
      steps: [
        { title: 'Do not put the entire history in the prompt', description: 'Summarize old turns.' },
        { title: 'Moderation both ways', description: 'Input and output.' },
      ],
      apis: [
        { method: 'POST', path: '/v1/threads/:id/messages', description: 'User message; response is SSE' },
        { method: 'GET', path: '/v1/threads', description: 'List' },
      ],
      dataModel: [
        { name: 'threads', columns: ['id', 'user_id', 'title', 'model'] },
        { name: 'messages', columns: ['id', 'thread_id', 'role', 'content', 'ts'] },
        { name: 'memories', columns: ['user_id', 'fact', 'source_thread'] },
      ],
      architecture: 'Chat API + thread DB + prompt builder + model router + stream gateway + moderation + memory job. Classic LB/cache/queue underneath.',
      diagram: `flowchart TB
    Client -->|SSE| ChatAPI
    ChatAPI --> Threads[(Threads)]
    ChatAPI --> Builder
    Builder --> Router
    Router --> GPU
    ChatAPI --> Mod[Moderation]`,
      deepDives: [
        { title: 'Memory', body: 'Extract facts offline with a small model. Retrieve a handful by embedding at send time. User must be able to delete memories.' },
        { title: 'Cost cascade', body: 'Default small/fast model; escalate on “think harder” or low confidence.' },
      ],
      tradeoffs: ['Long memory: sticky product, privacy risk.', 'Tools: sticky, injection risk.'],
      bottlenecks: ['Context growth', 'Moderation latency'],
      scalingPath: [
        { scale: 'v1', focus: 'Hosted API + Postgres threads + SSE' },
        { scale: 'v2', focus: 'Summary, memory, router, abuse ML' },
      ],
      interviewScript: [
        '“The system is a thread store and a prompt builder. The LLM is a routed dependency with streaming and moderation.”',
      ],
      commonMistakes: ['Unlimited history in the window', 'No rate limits'],
      relatedTopics: ['llm-serving', 'ai-cost', 'llm-gateway'],
      examples: ['ChatGPT', 'Claude.ai'],
      practicePrompt: 'Add file uploads without blowing the context window.',
    }),
  },
  {
    id: 'enterprise-rag',
    title: 'Enterprise RAG Search',
    description: 'Connectors, ACL-aware retrieval, citations, and re-ingest — RAG as a product, not a notebook.',
    difficulty: 'Advanced',
    progress: 0,
    icon: 'Building',
    color: 'bg-indigo-800',
    section: 'products',
    track: 'ai',
    prerequisites: ['rag', 'ai-safety', 'eval-quality', 'message-queues'],
    estimatedMinutes: 50,
    order: 21,
    content: emptyContent({
      overview: 'Enterprise search answers questions over Slack, Drive, and wikis with the same permissions as the source systems. Connectors and ACLs are the product.',
      whyItExists: 'Companies already have knowledge; employees cannot find it, and a public chatbot must not see it.',
      whenToUse: ['Work Q&A', 'Support deflection', 'Compliance-sensitive RAG'],
      functionalRequirements: [
        { title: 'Connectors', detail: 'Drive, Confluence, Slack, tickets.' },
        { title: 'Ask', detail: 'Answer + citations + ACL-safe snippets.' },
        { title: 'Re-ingest', detail: 'Webhooks or crawl deltas.' },
        { title: 'Admin', detail: 'Source toggles, retention, residency.' },
      ],
      nonFunctionalRequirements: [
        { title: 'Zero cross-tenant leak', detail: 'Hard requirement.' },
        { title: 'Index lag SLO', detail: 'e.g. 15 minutes for wiki edits.' },
      ],
      estimates: [
        { label: 'Corpus', value: '10M-1B chunks depending on company' },
        { label: 'Query QPS', value: 'Low vs consumer chat, high value' },
      ],
      concepts: ['Connectors', 'ACL sync', 'Hybrid retrieve', 'Citations', 'Residency'],
      walkthrough: [
        { title: 'Ingest', description: 'Connector fetches a doc + ACL. Parse/chunk/embed. Upsert vectors with principal list or group ids.' },
        { title: 'Ask', description: 'Expand user groups, retrieve with filter, rerank, generate with cite-or-refuse.' },
      ],
      steps: [
        { title: 'Sync ACLs as data', description: 'A renamed Google group must update the index.' },
        { title: 'Cite or refuse', description: 'No source, no answer.' },
      ],
      apis: [
        { method: 'POST', path: '/v1/ask', description: '{ query } → { answer, citations[] }' },
        { method: 'POST', path: '/v1/connectors/:type/sync', description: 'Admin trigger' },
      ],
      dataModel: [
        { name: 'documents', columns: ['id', 'tenant', 'source', 'acl_version', 'uri'] },
        { name: 'chunks', columns: ['id', 'doc_id', 'text', 'vector_ref', 'acl'] },
      ],
      architecture: 'Per-tenant (or filtered) hybrid index + connector workers + query planner + LLM in-residency option + eval + audit log. Built on classic queues and object storage.',
      diagram: `flowchart TB
    Connectors --> Parse
    Parse --> Index[(Hybrid + ACL)]
    User --> Ask
    Ask --> Groups[Group expand]
    Groups --> Index
    Index --> LLM
    LLM --> Audit`,
      deepDives: [
        { title: 'ACL sync', body: 'Store group membership in a fast directory cache. Re-index documents when ACL changes, or store group ids on chunks and expand at query time. Query-time expand is simpler if groups change often.' },
        { title: 'Connectors', body: 'Each connector is a crawl + webhook + checkpoint. Rate-limit yourself so you do not DDoS Drive. Idempotent upserts on source document version.' },
      ],
      tradeoffs: ['Per-tenant indexes: isolation, cost.', 'Shared index + filter: cheaper, easier to get wrong.'],
      bottlenecks: ['ACL expansion', 'Parse of nasty PDFs', 'Re-embed storms'],
      scalingPath: [
        { scale: 'v1', focus: 'One Drive folder, one tenant' },
        { scale: 'v2', focus: 'Connectors + group expand + eval + residency' },
      ],
      interviewScript: [
        '“Connectors write a derived index with ACLs. Ask expands groups, retrieves, cites, and audits. The LLM never sees another tenant’s chunks.”',
      ],
      commonMistakes: ['Post-filter only', 'No delete path'],
      relatedTopics: ['rag', 'ai-safety', 'linkedin'],
      examples: ['Glean', 'enterprise ChatGPT with connectors'],
      practicePrompt: 'A user loses Drive access to a folder. How fast does ask stop citing those files?',
    }),
  },
  {
    id: 'coding-copilot',
    title: 'AI Coding Copilot',
    description: 'Repo context assembly, fill-in-the-middle, and a latency budget tight enough for the editor.',
    difficulty: 'Advanced',
    progress: 0,
    icon: 'Code',
    color: 'bg-zinc-700',
    section: 'products',
    track: 'ai',
    prerequisites: ['llm-serving', 'embeddings', 'ai-cost'],
    estimatedMinutes: 45,
    order: 22,
    content: emptyContent({
      overview: 'A copilot sits in the IDE. Completions need <200-400ms TTFT. Context is the open file, nearby files, and retrieved repo snippets — not the whole monorepo.',
      whyItExists: 'Developers want inline completions and chat over their code without uploading the company IP carelessly.',
      whenToUse: ['Low-latency AI', 'Context packing'],
      functionalRequirements: [
        { title: 'Inline complete', detail: 'FIM / suffix-aware.' },
        { title: 'Chat / edit', detail: 'Multi-file patches with user apply.' },
        { title: 'Repo index', detail: 'Optional semantic retrieve of local code.' },
      ],
      nonFunctionalRequirements: [
        { title: 'Inline TTFT', detail: 'Hard budget; skip retrieve if needed.' },
        { title: 'Privacy', detail: 'On-prem or no-train options for enterprises.' },
      ],
      estimates: [
        { label: 'Keystroke-triggered calls', value: 'Debounce; do not fire every char to a 70B' },
      ],
      concepts: ['FIM', 'Debounce', 'Repo embed index', 'Speculative / small model first'],
      walkthrough: [
        { title: 'Complete', description: 'Debounce → local prefix/suffix → tiny retrieve of open tabs / symbols → small model FIM → show ghost text. Chat path may use a larger model and retrieve.' },
      ],
      steps: [
        { title: 'Two products, two SLOs', description: 'Inline ≠ sidebar chat.' },
        { title: 'Index locally or in a tenant vault', description: 'Do not dump repos into a shared vector DB.' },
      ],
      apis: [
        { method: 'POST', path: '/v1/complete', description: '{ prefix, suffix, language }' },
        { method: 'POST', path: '/v1/chat', description: 'Repo-aware chat' },
      ],
      dataModel: [
        { name: 'repo_index', columns: ['tenant', 'repo', 'path', 'chunk', 'vector'] },
      ],
      architecture: 'IDE plugin → edge complete service (small model, no retrieve or micro-retrieve) → chat service (retrieve + larger model). Tenant repo index.',
      diagram: `flowchart LR
    IDE --> Complete[Fast FIM]
    IDE --> Chat
    Chat --> Index[(Repo index)]
    Chat --> Large[Larger model]`,
      deepDives: [
        { title: 'Latency budget', body: 'If retrieve cannot finish in 40ms, skip it for inline. A slightly dumber completion that appears instantly wins.' },
        { title: 'FIM', body: 'The model must see code after the cursor. Pack suffix; do not only send the prefix.' },
      ],
      tradeoffs: ['Local models: private, weaker.', 'Cloud: smarter, IP policy fights.'],
      bottlenecks: ['Monorepo index freshness', 'Over-triggering completes'],
      scalingPath: [
        { scale: 'v1', focus: 'Prefix-only hosted complete' },
        { scale: 'v2', focus: 'FIM + repo index + two SLOs' },
      ],
      interviewScript: [
        '“Inline complete is a small model with a hard latency budget. Chat can retrieve and spend more tokens.”',
      ],
      commonMistakes: ['One 70B for ghost text', 'Indexing secrets (.env)'],
      relatedTopics: ['ai-cost', 'embeddings', 'llm-serving'],
      examples: ['GitHub Copilot', 'Cursor-like IDEs'],
      practicePrompt: 'Keep inline p95 under 300ms when the repo index is cold.',
    }),
  },
  {
    id: 'recommendation-system',
    title: 'Recommendation System',
    description: 'Candidate generation, ranking, features, and a feedback loop — the AI core of YouTube and Netflix.',
    difficulty: 'Advanced',
    progress: 0,
    icon: 'Sparkles',
    color: 'bg-orange-600',
    section: 'products',
    track: 'ai',
    prerequisites: ['search-feeds', 'message-queues', 'eval-quality'],
    estimatedMinutes: 45,
    order: 23,
    content: emptyContent({
      overview: 'Recs are a funnel: cheap candidate generation (hundreds) then an expensive ranker (dozens) then business rules. Training is a data platform problem.',
      whyItExists: 'Catalogs are too large to browse. Watch/click feedback is the signal.',
      whenToUse: ['YouTube/Netflix/Instagram explore', 'Feed ranking'],
      functionalRequirements: [
        { title: 'Home / next-item', detail: 'Personalized ranked lists.' },
        { title: 'Feedback', detail: 'Impressions, clicks, dwell, skips.' },
      ],
      nonFunctionalRequirements: [
        { title: 'Serve p99', detail: '100-200ms for home.' },
        { title: 'Freshness', detail: 'New viral video in minutes to hours.' },
      ],
      estimates: [
        { label: 'Catalog', value: 'Millions to billions of items' },
        { label: 'Candidates', value: 'Hundreds per request' },
      ],
      concepts: ['Two-tower / ANN retrieval', 'Ranker', 'Features', 'Exploration', 'Feedback loop'],
      walkthrough: [
        { title: 'Serve', description: 'User embedding → ANN item retrieve + other generators (trending, graph) → feature join → ranker → filters (already watched) → return.' },
        { title: 'Learn', description: 'Log impressions/outcomes → train retrieve + rank offline → publish embeddings/models.' },
      ],
      steps: [
        { title: 'Log everything you need to train', description: 'No logs, no model.' },
        { title: 'Separate retrieve and rank', description: 'One giant model over the catalog does not serve in 100ms.' },
      ],
      apis: [
        { method: 'GET', path: '/v1/home', description: 'Ranked items' },
        { method: 'POST', path: '/v1/events', description: 'Impression/click' },
      ],
      dataModel: [
        { name: 'events', columns: ['user_id', 'item_id', 'type', 'ts', 'context'] },
        { name: 'user_emb', columns: ['user_id', 'vector', 'version'] },
        { name: 'item_emb', columns: ['item_id', 'vector', 'version'] },
      ],
      architecture: 'Online: generators + feature store + ranker. Nearline: embed refresh. Offline: training + eval. Classic feed/CDN still deliver the item.',
      diagram: `flowchart TB
    Events --> Train
    Train --> Emb[(Embeddings)]
    Train --> Ranker
    Req --> Gen[Candidate gens]
    Gen --> Emb
    Gen --> Ranker
    Ranker --> Home`,
      deepDives: [
        { title: 'Two-tower retrieve', body: 'User tower and item tower. Items precomputed in ANN. User tower runs online. This is the same ANN idea as RAG, different payload.' },
        { title: 'Feedback loops', body: 'Rankers amplify popular items. Add exploration and diversity constraints or the catalog dies.' },
      ],
      tradeoffs: ['More generators: coverage vs serve time.', 'Heavy ranker: quality vs p99.'],
      bottlenecks: ['Feature join', 'Embedding freshness', 'Bias to popular'],
      scalingPath: [
        { scale: 'v1', focus: 'Popular + recent + CF SQL' },
        { scale: 'v2', focus: 'Two-tower ANN + GBDT/NN ranker' },
      ],
      interviewScript: [
        '“Retrieve hundreds with ANN and heuristics, rank dozens, log outcomes to retrain. I will not score the whole catalog online.”',
      ],
      commonMistakes: ['One model over all items at request time', 'No exploration'],
      relatedTopics: ['youtube', 'instagram', 'embeddings', 'news-feed'],
      examples: ['YouTube', 'Netflix', 'TikTok'],
      practicePrompt: 'A new creator uploads. How do they get any impressions this hour?',
    }),
  },
  {
    id: 'embedding-matching',
    title: 'Tinder-like Matching with Embeddings',
    description: 'Two-tower ranking on top of geo candidates — AI layered on the classic Tinder design.',
    difficulty: 'Advanced',
    progress: 0,
    icon: 'Heart',
    color: 'bg-pink-700',
    section: 'products',
    track: 'ai',
    prerequisites: ['tinder', 'recommendation-system', 'embeddings'],
    estimatedMinutes: 40,
    order: 24,
    content: emptyContent({
      overview: 'Keep geo and prefs as hard filters. Use embeddings to rank who is likely to match, not to search the whole planet.',
      whyItExists: 'Naive “most attractive nearby” is unfair and boring. Learned affinity improves match rate.',
      whenToUse: ['After you can design classic Tinder'],
      functionalRequirements: [
        { title: 'Same swipe product', detail: 'Deck, like, match, chat.' },
        { title: 'Learned rank', detail: 'P(match | user, candidate, context).' },
      ],
      nonFunctionalRequirements: [
        { title: 'Still 50-100ms deck', detail: 'ANN only inside the geo candidate set or a prefiltered set.' },
      ],
      estimates: [
        { label: 'Candidates after geo', value: 'Hundreds, not millions' },
      ],
      concepts: ['Hard filters vs soft rank', 'Two-tower', 'Fairness', 'Online features (activity)'],
      walkthrough: [
        { title: 'Deck', description: 'Geo + prefs + unseen → candidate ids. Score with two-tower or a small ranker using activity and past swipe outcomes. Diversify. Hydrate.' },
        { title: 'Train', description: 'Likes/matches/chat starts as labels. Negative = pass or no-reply.' },
      ],
      steps: [
        { title: 'Do not replace geo with ANN over the world', description: 'Users want nearby.' },
        { title: 'Add exploration', description: 'Avoid local maxima of the same face type.' },
      ],
      apis: [
        { method: 'GET', path: '/v1/recs', description: 'Same as classic, better ranked' },
      ],
      dataModel: [
        { name: 'user_towers', columns: ['user_id', 'vector', 'updated_at'] },
        { name: 'swipe_events', columns: ['from_id', 'to_id', 'label', 'ts'] },
      ],
      architecture: 'Classic Tinder stack + embedding jobs + ranker sidecar. Geo index remains mandatory.',
      diagram: `flowchart LR
    Geo --> Cands[Candidates]
    Cands --> Rank[Two-tower / ranker]
    Rank --> Deck
    Swipes --> Train --> Rank`,
      deepDives: [
        { title: 'Fairness', body: 'Optimize for mutual match probability, not one-sided likes, or the app starves one side of the marketplace.' },
      ],
      tradeoffs: ['More personalization: better matches, filter bubbles.', 'Heavy ranker vs deck SLO.'],
      bottlenecks: ['Sparse new users (cold start)', 'Hot cities'],
      scalingPath: [
        { scale: 'v1', focus: 'Heuristic rank' },
        { scale: 'v2', focus: 'Two-tower on geo candidates' },
      ],
      interviewScript: [
        '“Embeddings rank inside a geo-filtered set. The match atomicity and seen-set do not change.”',
      ],
      commonMistakes: ['ANN the whole world', 'Optimizing only likes'],
      relatedTopics: ['tinder', 'recommendation-system'],
      examples: ['Modern dating recs'],
      practicePrompt: 'Cold-start a user who just installed the app and has zero swipes.',
    }),
  },
  {
    id: 'job-matching',
    title: 'LinkedIn PYMK / Job Matching',
    description: 'Graph + embeddings + search for people-you-may-know and job-candidate retrieval.',
    difficulty: 'Advanced',
    progress: 0,
    icon: 'Briefcase',
    color: 'bg-blue-900',
    section: 'products',
    track: 'ai',
    prerequisites: ['linkedin', 'recommendation-system', 'embeddings'],
    estimatedMinutes: 40,
    order: 25,
    content: emptyContent({
      overview: 'Classic LinkedIn already needed PYMK and people search. AI adds two-tower retrieve and a ranker on graph + profile text + behavior.',
      whyItExists: '2nd-degree sampling is sparse; embeddings find similar careers that the graph has not connected yet.',
      whenToUse: ['After classic LinkedIn'],
      functionalRequirements: [
        { title: 'PYMK', detail: 'Suggestions with reasons (mutuals, same company).' },
        { title: 'Jobs', detail: 'Retrieve jobs for a seeker and seekers for a recruiter.' },
      ],
      nonFunctionalRequirements: [
        { title: 'Explainability', detail: 'Professionals distrust opaque “for you.”' },
        { title: 'Freshness', detail: 'Job posts expire; seekers go stale.' },
      ],
      estimates: [
        { label: 'Jobs', value: 'Millions active' },
        { label: 'Seekers', value: 'Hundreds of millions profiles' },
      ],
      concepts: ['Graph features', 'Two-tower jobs', 'Explainable rank', 'Recruiter inverted index still exists'],
      walkthrough: [
        { title: 'PYMK', description: 'Union of graph samples + embedding ANN + coworkers. Rank with mutuals, recency, and a model. Attach reasons from features, not from the neural net alone.' },
        { title: 'Jobs', description: 'Seeker tower vs job tower. Recruiter still uses boolean search for precision hiring.' },
      ],
      steps: [
        { title: 'Keep inverted search', description: 'Recruiters need boolean control.' },
        { title: 'Offline generate PYMK', description: 'Online only rank and filter.' },
      ],
      apis: [
        { method: 'GET', path: '/v1/pymk', description: 'Suggestions + reasons' },
        { method: 'GET', path: '/v1/jobs/recommended', description: 'Seeker home' },
      ],
      dataModel: [
        { name: 'seeker_emb', columns: ['user_id', 'vector'] },
        { name: 'job_emb', columns: ['job_id', 'vector', 'expires_at'] },
      ],
      architecture: 'Classic LinkedIn services + embedding jobs + ANN + ranker + reason templates. Recruiter search cluster remains.',
      diagram: `flowchart TB
    Graph --> Cands
    ANN --> Cands
    Cands --> Rank
    Rank --> Reasons
    Reasons --> PYMK`,
      deepDives: [
        { title: 'Reasons', body: '“12 mutuals” and “worked at X” come from features. Do not invent a reason from an embedding dimension.' },
      ],
      tradeoffs: ['ANN-only jobs: recall, worse boolean precision for recruiters.'],
      bottlenecks: ['Expired jobs in ANN', 'Graph+ANN union too large'],
      scalingPath: [
        { scale: 'v1', focus: 'Graph PYMK only' },
        { scale: 'v2', focus: 'Embeddings + explanations' },
      ],
      interviewScript: [
        '“Graph for trust, embeddings for recall, boolean search for recruiters, explanations from features.”',
      ],
      commonMistakes: ['Replacing people search with only ANN', 'No expiry on job vectors'],
      relatedTopics: ['linkedin', 'recommendation-system', 'enterprise-rag'],
      examples: ['LinkedIn Jobs', 'PYMK'],
      practicePrompt: 'A recruiter needs “Java AND (AWS OR GCP) NOT intern” — where does the two-tower stop and boolean search start?',
    }),
  },
  {
    id: 'image-gen-platform',
    title: 'Image / Video Generation Platform',
    description: 'Prompt in, GPU workers out, safety in the middle, assets on object storage and CDN.',
    difficulty: 'Intermediate',
    progress: 0,
    icon: 'Image',
    color: 'bg-violet-700',
    section: 'products',
    track: 'ai',
    prerequisites: ['inference-infra', 'storage-media', 'message-queues', 'ai-safety'],
    estimatedMinutes: 40,
    order: 26,
    content: emptyContent({
      overview: 'Generation is a job system. Prompts are queued, GPUs render, safety models filter, and the user polls or subscribes to a job id. This is closer to YouTube transcode than to chat.',
      whyItExists: 'Diffusion/video models take seconds to minutes and cannot run in the API request thread.',
      whenToUse: ['Media gen products'],
      functionalRequirements: [
        { title: 'Submit job', detail: 'Prompt, params, model.' },
        { title: 'Status + asset URL', detail: 'CDN when ready.' },
        { title: 'Safety', detail: 'Input and output filters.' },
      ],
      nonFunctionalRequirements: [
        { title: 'Queue fairness', detail: 'Paid vs free lanes.' },
        { title: 'Idempotent jobs', detail: 'Client retries.' },
      ],
      estimates: [
        { label: 'Job time', value: '2-60s images, minutes video' },
        { label: 'GPU', value: 'Utilization is the business' },
      ],
      concepts: ['Job queue', 'Priority lanes', 'Safety classifiers', 'Asset store'],
      walkthrough: [
        { title: 'Submit', description: 'Moderate prompt. Enqueue job with idempotency key. Return job id.' },
        { title: 'Worker', description: 'Generate, moderate output, write object store, update job, notify websocket.' },
      ],
      steps: [
        { title: 'Never generate in the HTTP handler', description: 'Always a queue.' },
        { title: 'Filter both sides', description: 'Prompt and pixels.' },
      ],
      apis: [
        { method: 'POST', path: '/v1/generations', description: 'Create job' },
        { method: 'GET', path: '/v1/generations/:id', description: 'Status + URLs' },
      ],
      dataModel: [
        { name: 'jobs', columns: ['id', 'user_id', 'status', 'model', 'input_ref', 'asset_keys'] },
      ],
      architecture: 'API → safety → priority queues → GPU workers → object store/CDN. Classic media path after the pixels exist.',
      diagram: `flowchart LR
    User --> API
    API --> SafetyIn
    SafetyIn --> Q[GPU queue]
    Q --> Worker
    Worker --> SafetyOut
    SafetyOut --> S3
    S3 --> CDN`,
      deepDives: [
        { title: 'Fairness', body: 'Free tier shares a low-priority queue. Paid skips ahead. Still cap concurrency per user so one whale cannot drain the fleet.' },
      ],
      tradeoffs: ['More steps/quality: longer queue.', 'Open models: cheaper, harder safety.'],
      bottlenecks: ['GPU backlog', 'Safety false positives'],
      scalingPath: [
        { scale: 'v1', focus: 'One worker pool + S3' },
        { scale: 'v2', focus: 'Priority lanes + multi-model + CDN' },
      ],
      interviewScript: [
        '“This is a job queue in front of GPUs, with safety and object storage. It is not a streaming chat design.”',
      ],
      commonMistakes: ['Synchronous generate in API', 'No output moderation'],
      relatedTopics: ['youtube', 'inference-infra', 'ai-safety'],
      examples: ['Midjourney-style queues', 'Runway'],
      practicePrompt: 'A viral prompt hits 100k jobs. How do you degrade?',
    }),
  },
  {
    id: 'voice-agent',
    title: 'Voice Agent / Call Center Copilot',
    description: 'Streaming STT, LLM, TTS, and barge-in — a real-time pipeline with a 500ms conversation budget.',
    difficulty: 'Advanced',
    progress: 0,
    icon: 'Phone',
    color: 'bg-cyan-700',
    section: 'products',
    track: 'ai',
    prerequisites: ['realtime', 'llm-serving', 'rag', 'prompting'],
    estimatedMinutes: 45,
    order: 27,
    content: emptyContent({
      overview: 'Voice is a streaming graph: audio in → STT partials → turn detector → LLM (tools/RAG) → TTS out. Barge-in cancels TTS. Latency compounds at every hop.',
      whyItExists: 'Phones still matter. Humans interrupt. A 3-second pause feels broken.',
      whenToUse: ['IVR replacement', 'Realtime agents'],
      functionalRequirements: [
        { title: 'Talk', detail: 'Full duplex call or WebRTC.' },
        { title: 'Tools', detail: 'Lookup order, create ticket — authorized.' },
        { title: 'Handoff', detail: 'Warm transfer to a human with summary.' },
      ],
      nonFunctionalRequirements: [
        { title: 'Voice-to-voice', detail: 'Target ~500-800ms when possible.' },
        { title: 'Barge-in', detail: 'Cancel speech immediately.' },
      ],
      estimates: [
        { label: 'STT + LLM first token + TTS chunk', value: 'Each hop eats the budget' },
      ],
      concepts: ['VAD / turn taking', 'Partial STT', 'Speculative LLM', 'TTS chunking'],
      walkthrough: [
        { title: 'User speaks', description: 'Stream audio to STT. On end-of-turn, finalize text, call LLM with tools/RAG, stream TTS as soon as first sentence exists.' },
        { title: 'Interrupt', description: 'VAD detects speech, kill TTS, abort LLM if still prefilling.' },
      ],
      steps: [
        { title: 'Pipeline, do not waterfall full text', description: 'Overlap TTS with remaining LLM tokens.' },
        { title: 'Keep tools tiny', description: 'A 2s CRM call blows the SLO.' },
      ],
      apis: [
        { method: 'WS', path: '/v1/voice', description: 'Audio frames both ways' },
      ],
      dataModel: [
        { name: 'calls', columns: ['id', 'tenant', 'transcript_ref', 'summary'] },
      ],
      architecture: 'Media server → STT → dialog manager → LLM/tools/RAG → TTS → media. Classic realtime gateways plus AI serving.',
      diagram: `flowchart LR
    Mic --> STT
    STT --> DM[Dialog manager]
    DM --> LLM
    LLM --> TTS
    TTS --> Speaker
    Mic -->|barge-in| DM`,
      deepDives: [
        { title: 'Barge-in', body: 'The hardest UX. You need a single owner that can cancel TTS and LLM, otherwise the bot talks over the user.' },
        { title: 'Copilot vs bot', body: 'A copilot whispers to a human agent (higher latency OK). A replacement bot owns the call (latency brutal).' },
      ],
      tradeoffs: ['Accuracy vs interruptibility.', 'RAG on every turn vs after intent classify.'],
      bottlenecks: ['STT lag', 'Tool RTT', 'TTS startup'],
      scalingPath: [
        { scale: 'v1', focus: 'Turn-based, no barge-in' },
        { scale: 'v2', focus: 'Full duplex + cancel + fast tools' },
      ],
      interviewScript: [
        '“I will budget milliseconds per hop and make barge-in a first-class cancel path. Tools are pre-authorized lookups, not general agents.”',
      ],
      commonMistakes: ['Waiting for the full LLM answer before any TTS', 'No interrupt'],
      relatedTopics: ['realtime', 'chatgpt-assistant', 'enterprise-rag'],
      examples: ['Contact-center copilots', 'Realtime voice APIs'],
      practicePrompt: 'User interrupts during the third sentence. What processes die, in what order?',
    }),
  },
  {
    id: 'multi-agent',
    title: 'Multi-Agent Workflow Platform',
    description: 'Planner, tools, memory, and human-in-the-loop — agents as a workflow engine, not a chat toy.',
    difficulty: 'Advanced',
    progress: 0,
    icon: 'Users',
    color: 'bg-purple-800',
    section: 'products',
    track: 'ai',
    prerequisites: ['prompting', 'fine-tune-vs-rag', 'ai-safety', 'message-queues'],
    estimatedMinutes: 45,
    order: 28,
    content: emptyContent({
      overview: 'An agent platform is a state machine. The LLM proposes the next step; a deterministic runtime executes tools, stores state, and asks humans when policy requires it.',
      whyItExists: 'Multi-step work (research, ops, coding) exceeds one prompt, but unbounded autonomy is unsafe and expensive.',
      whenToUse: ['Workflows with tools and approvals'],
      functionalRequirements: [
        { title: 'Run a graph', detail: 'Plan, act, observe, repeat with a cap.' },
        { title: 'Tools marketplace', detail: 'Versioned, permissioned.' },
        { title: 'HITL', detail: 'Approve a PR, a refund, an email.' },
        { title: 'Replay', detail: 'Debug from traces.' },
      ],
      nonFunctionalRequirements: [
        { title: 'Max hops / $', detail: 'Hard stop.' },
        { title: 'Idempotent tools', detail: 'Retries will happen.' },
      ],
      estimates: [
        { label: 'Hops', value: 'Cap at 8-20 depending on product' },
      ],
      concepts: ['Planner vs worker', 'Tool sandbox', 'HITL gates', 'Durable workflow'],
      walkthrough: [
        { title: 'Start run', description: 'Persist goal + state. Planner emits a step. Runtime checks policy, executes tool, appends observation, loops until done, blocked, or cap.' },
        { title: 'HITL', description: 'State = waiting_human. UI shows the proposed action. Resume is a new event on the same run id.' },
      ],
      steps: [
        { title: 'Durable state outside the LLM', description: 'Postgres/workflow engine owns the run.' },
        { title: 'Least-privilege tools', description: 'Per tenant, per user.' },
      ],
      apis: [
        { method: 'POST', path: '/v1/runs', description: 'Start' },
        { method: 'POST', path: '/v1/runs/:id/resume', description: 'Human approval' },
      ],
      dataModel: [
        { name: 'runs', columns: ['id', 'status', 'goal', 'step', 'budget_remaining'] },
        { name: 'steps', columns: ['run_id', 'n', 'thought', 'tool', 'args', 'result'] },
      ],
      architecture: 'API + durable workflow + planner model + tool runtime + policy + trace store. Queues between steps so a crash resumes.',
      diagram: `flowchart TB
    Goal --> Runtime
    Runtime --> Planner
    Planner --> Policy
    Policy --> Tool
    Tool --> Runtime
    Policy -->|HITL| Human --> Runtime`,
      deepDives: [
        { title: 'Why not a free-form chat loop', body: 'Without durable state, a process restart loses the agent. Without a cap, it spends your month’s GPU budget. Without policy, it refunds everyone.' },
      ],
      tradeoffs: ['More autonomy: less human time, more risk.', 'Rigid DAGs: safer, less “agentic.”'],
      bottlenecks: ['Tool latency', 'Planner thrash', 'Human queue'],
      scalingPath: [
        { scale: 'v1', focus: 'Single agent, 5 tools, hop cap' },
        { scale: 'v2', focus: 'Graphs, HITL, sandbox, replay' },
      ],
      interviewScript: [
        '“The LLM is a planner. The runtime is a workflow engine with budgets, authz, and human gates.”',
      ],
      commonMistakes: ['Agent state in memory only', 'Uncapped loops', 'Tools as root'],
      relatedTopics: ['prompting', 'ai-safety', 'ai-cost'],
      examples: ['Ops automations', 'Research agents with approval'],
      practicePrompt: 'Design a refund tool so a prompt injection cannot refund a stranger.',
    }),
  },
  {
    id: 'llm-gateway',
    title: 'LLM Gateway / AI Observability',
    description: 'One entry for many models: auth, budgets, routing, traces, and failover — API gateway for intelligence.',
    difficulty: 'Intermediate',
    progress: 0,
    icon: 'Router',
    color: 'bg-amber-700',
    section: 'products',
    track: 'ai',
    prerequisites: ['api-gateway', 'inference-infra', 'eval-quality', 'ai-cost'],
    estimatedMinutes: 40,
    order: 29,
    content: emptyContent({
      overview: 'Teams will call five model vendors. A gateway gives one SDK, one bill, one trace, and one kill switch. It is the classic API gateway with tokens and quality.',
      whyItExists: 'Without a gateway, every microservice hardcodes keys, models, and logging — until a vendor outage.',
      whenToUse: ['Platform / infra interviews', 'Multi-model products'],
      functionalRequirements: [
        { title: 'Proxy chat/complete/embed', detail: 'OpenAI-compatible is common.' },
        { title: 'Route', detail: 'By model alias, tenant, or experiment.' },
        { title: 'Meter', detail: 'Tokens, $, latency.' },
        { title: 'Trace', detail: 'Optional payload store with redaction.' },
      ],
      nonFunctionalRequirements: [
        { title: 'Failover', detail: 'Vendor A 5xx → vendor B for the same alias.' },
        { title: 'p99 overhead', detail: 'Gateway should add milliseconds, not hundreds.' },
      ],
      estimates: [
        { label: 'Fan-in', value: 'All company AI traffic' },
      ],
      concepts: ['Model alias', 'Budget', 'Shadow traffic', 'Redaction', 'Circuit breaker'],
      walkthrough: [
        { title: 'Call', description: 'Service uses alias “chat-default.” Gateway checks key + budget, picks provider, traces, streams back, records tokens.' },
        { title: 'Outage', description: 'Circuit opens; alias maps to backup provider with a quality warning tag.' },
      ],
      steps: [
        { title: 'Aliases, not raw vendor names, in apps', description: 'So you can swap.' },
        { title: 'Redact before persist', description: 'Traces are a leak surface.' },
      ],
      apis: [
        { method: 'POST', path: '/v1/chat/completions', description: 'Compatible proxy' },
        { method: 'GET', path: '/v1/usage', description: 'Tenant usage' },
      ],
      dataModel: [
        { name: 'aliases', columns: ['name', 'primary', 'fallback', 'experiment'] },
        { name: 'usage', columns: ['tenant', 'day', 'tokens', 'cost'] },
      ],
      architecture: 'Same placement as an API gateway. Talks to many model HTTP APIs. Writes metrics/traces to the observability stack. Enforces budgets in Redis.',
      diagram: `flowchart LR
    Svcs --> GW[LLM Gateway]
    GW --> A[Vendor A]
    GW --> B[Vendor B]
    GW --> Self[Self-host pool]
    GW --> Obs[Traces + usage]`,
      deepDives: [
        { title: 'Shadow traffic', body: 'Fork 1% of requests to a candidate model, compare traces offline, do not show the user. That is how you change the default alias safely.' },
      ],
      tradeoffs: ['Central gateway: control vs a new SPOF — run it like you run the API gateway, multi-AZ.'],
      bottlenecks: ['Trace payload volume', 'A single Redis budget store'],
      scalingPath: [
        { scale: 'v1', focus: 'Key proxy + logs' },
        { scale: 'v2', focus: 'Aliases, budgets, failover, shadow' },
      ],
      interviewScript: [
        '“Applications only know aliases. The gateway owns keys, spend, traces, and failover. It is Envoy for LLMs.”',
      ],
      commonMistakes: ['Each service with its own OpenAI key', 'Storing raw prompts forever'],
      relatedTopics: ['api-gateway', 'eval-quality', 'ai-cost', 'inference-infra'],
      examples: ['LiteLLM-style proxies', 'Internal AI platforms'],
      practicePrompt: 'Vendor A has a 15-minute outage. What do apps see, and what do you not do?',
    }),
  },
];
