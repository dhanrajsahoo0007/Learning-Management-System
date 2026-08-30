import { ArchitectureTopic, emptyContent } from './systemDesignTypes';

export const aiFundamentals: ArchitectureTopic[] = [
  {
    id: 'llm-serving',
    title: 'LLM Serving Basics',
    description: 'Tokens, context windows, prefill vs decode, batching, and TTFT vs TPOT — the load balancer of AI systems.',
    difficulty: 'Intermediate',
    progress: 0,
    icon: 'Zap',
    color: 'bg-violet-600',
    section: 'fundamentals',
    track: 'ai',
    prerequisites: ['load-balancer', 'api-gateway'],
    estimatedMinutes: 35,
    order: 0,
    content: emptyContent({
      overview: 'An LLM request is not a single RPC. Prefill reads the prompt; decode emits tokens one (or a few) at a time. Capacity is GPU memory and tokens/s, not just QPS.',
      whyItExists: 'Naive “one GPU per request” dies under chat traffic. You must batch, stream, and bound context.',
      whenToUse: ['Any ChatGPT-like or RAG generate step'],
      functionalRequirements: [
        { title: 'Complete or stream tokens', detail: 'SSE/WebSocket from the gateway.' },
        { title: 'Bound context', detail: 'Truncate or summarize when over the window.' },
      ],
      nonFunctionalRequirements: [
        { title: 'TTFT', detail: 'Time to first token — interactive UX.' },
        { title: 'TPOT', detail: 'Time per output token — perceived typing speed.' },
        { title: 'Availability', detail: 'Fallback model when the big GPU pool is full.' },
      ],
      estimates: [
        { label: 'Prefill', value: 'Compute-heavy, scales with prompt tokens' },
        { label: 'Decode', value: 'Memory-bandwidth heavy, KV cache grows with steps' },
        { label: 'QPS myth', value: '100 short chats ≠ 100 long-document jobs' },
      ],
      concepts: ['Tokenizer', 'Context window', 'Prefill vs decode', 'Continuous batching', 'KV cache', 'TTFT / TPOT'],
      walkthrough: [
        { title: 'Request hits gateway', description: 'Auth, token budget, model route.' },
        { title: 'Scheduler batches', description: 'Combine prefills/decodes on a GPU without waiting for the slowest user to finish.' },
        { title: 'Stream tokens', description: 'Gateway forwards SSE to the client; cancel stops decode.' },
      ],
      steps: [
        { title: 'Measure tokens, not requests', description: 'Admission control on token estimates.' },
        { title: 'Stream by default', description: 'Users forgive TPOT more than a 20s blank screen.' },
      ],
      architecture: 'Client → API gateway → model router → GPU scheduler (vLLM/TGI/TensorRT-LLM) → stream back. Prompt/result logs go async.',
      diagram: `flowchart LR
    Client --> GW[AI Gateway]
    GW --> Router
    Router --> GPU[Batched GPU workers]
    GPU -->|SSE tokens| Client`,
      deepDives: [
        { title: 'Batching', body: 'Static batching waits. Continuous batching inserts new requests as others finish tokens. That is the serving analog of an event loop.' },
      ],
      tradeoffs: ['Bigger model: better quality, worse TTFT and $.', 'Long context: more prefill, smaller batch.'],
      bottlenecks: ['KV cache memory', 'Head-of-line long prompts'],
      scalingPath: [
        { scale: 'v1', focus: 'Hosted API (OpenAI) + stream' },
        { scale: 'v2', focus: 'Self-host with continuous batching + router' },
      ],
      interviewScript: [
        '“I will talk about tokens and TTFT, not just QPS. Interactive chat streams; batch jobs use a cheaper pool.”',
      ],
      commonMistakes: ['Treating LLM calls like a 50ms microservice', 'No cancel path'],
      relatedTopics: ['inference-infra', 'ai-caching', 'chatgpt-assistant'],
      examples: ['vLLM', 'OpenAI streaming'],
    }),
  },
  {
    id: 'prompting',
    title: 'Prompting and Structured Output',
    description: 'System prompts, tool calling, JSON schema, and guardrails — the API contract of an LLM.',
    difficulty: 'Beginner',
    progress: 0,
    icon: 'FileText',
    color: 'bg-purple-500',
    section: 'fundamentals',
    track: 'ai',
    prerequisites: ['llm-serving'],
    estimatedMinutes: 25,
    order: 1,
    content: emptyContent({
      overview: 'The model is a probabilistic function. Production systems constrain it with roles, tools, schemas, and retries — not vibes.',
      whyItExists: 'Unstructured prose cannot drive bookings, copilot patches, or agents.',
      whenToUse: ['Any product that must call tools or return JSON'],
      functionalRequirements: [
        { title: 'System + developer + user roles', detail: 'Policy lives in system, not user text.' },
        { title: 'Tools', detail: 'Model proposes a function call; you execute.' },
        { title: 'Schema', detail: 'JSON schema / constrained decoding.' },
      ],
      nonFunctionalRequirements: [
        { title: 'Determinism where needed', detail: 'Lower temperature + schema for extractors.' },
        { title: 'Injection resistance', detail: 'User text is data, never instructions, when possible.' },
      ],
      estimates: [
        { label: 'Tool loop', value: 'Each hop is another prefill; cap steps' },
      ],
      concepts: ['System prompt', 'Tool calling', 'Constrained decoding', 'Guardrails'],
      walkthrough: [
        { title: 'Build messages', description: 'System policy, retrieved context, user turn.' },
        { title: 'If tool call', description: 'Validate args, execute, append result, call model again.' },
        { title: 'Validate output', description: 'Parse JSON; retry once with the error if invalid.' },
      ],
      steps: [
        { title: 'Keep policy server-side', description: 'Never trust a client-supplied system prompt.' },
        { title: 'Cap tool iterations', description: 'Agents loop.' },
      ],
      architecture: 'Prompt builder → LLM → validator/tool runtime → LLM. All prompts versioned.',
      diagram: `flowchart LR
    Builder[Prompt builder] --> LLM
    LLM --> Tool{Tool call?}
    Tool -->|yes| Runtime --> LLM
    Tool -->|no| Validate`,
      deepDives: [
        { title: 'Prompt injection', body: 'Retrieved docs and users will say “ignore previous instructions.” Separate channels, strip instructions from retrieved text, and never give tools that can exfiltrate secrets based on untrusted text alone.' },
      ],
      tradeoffs: ['More tools: more power, more attack surface.', 'Strict schema: fewer parse bugs, less linguistic flexibility.'],
      bottlenecks: ['Unbounded agent loops', 'Giant system prompts eating the window'],
      scalingPath: [
        { scale: 'v1', focus: 'Single prompt + JSON mode' },
        { scale: 'v2', focus: 'Tool runtime + versioned prompts' },
      ],
      interviewScript: [
        '“The model never talks to the database. It proposes a tool call; my service executes after authz.”',
      ],
      commonMistakes: ['Putting secrets in the prompt', 'Unlimited tools'],
      relatedTopics: ['ai-safety', 'multi-agent', 'chatgpt-assistant'],
      examples: ['OpenAI tools', 'Anthropic computer use (constrained)'],
    }),
  },
  {
    id: 'embeddings',
    title: 'Embeddings and Vector Databases',
    description: 'Chunking, ANN indexes (HNSW, IVF), hybrid search, and metadata filters — the database of AI retrieval.',
    difficulty: 'Intermediate',
    progress: 0,
    icon: 'Database',
    color: 'bg-indigo-600',
    section: 'fundamentals',
    track: 'ai',
    prerequisites: ['databases', 'search-feeds'],
    estimatedMinutes: 35,
    order: 2,
    content: emptyContent({
      overview: 'Embeddings map text (or images) to vectors so similar meaning is nearby. A vector DB is an ANN index plus metadata filters, not magic memory.',
      whyItExists: 'Keyword search misses paraphrases. Brute-force cosine over 100M vectors is too slow.',
      whenToUse: ['RAG', 'Semantic dedup', 'Recommendations'],
      functionalRequirements: [
        { title: 'Index chunks', detail: 'id, vector, metadata (acl, tenant, url).' },
        { title: 'Query k-NN + filter', detail: 'tenant_id = X AND year > 2022.' },
      ],
      nonFunctionalRequirements: [
        { title: 'Recall vs latency', detail: 'HNSW high recall; IVF cheaper at huge scale.' },
        { title: 'Isolation', detail: 'Tenant filters must be enforced, not hoped.' },
      ],
      estimates: [
        { label: '768-d float32', value: '~3KB/vector' },
        { label: '10M chunks', value: '~30GB vectors plus graph overhead' },
      ],
      concepts: ['Chunking', 'HNSW', 'IVF/PQ', 'Hybrid BM25 + vector', 'Metadata filters'],
      walkthrough: [
        { title: 'Ingest', description: 'Parse, chunk, embed (batch GPU/API), upsert with ACL metadata.' },
        { title: 'Query', description: 'Embed query, ANN, filter, optional BM25 fusion, return chunks.' },
      ],
      steps: [
        { title: 'Chunk for the question type', description: 'Too small: no context. Too big: noisy retrieval.' },
        { title: 'Store source offsets', description: 'Citations need locators, not just text.' },
      ],
      architecture: 'Object/doc store is source of truth. Vector index is derived. Rebuild or upsert on change via queue.',
      diagram: `flowchart LR
    Docs --> Chunk --> Embed --> Index[(ANN + metadata)]
    Query --> EmbedQ[Embed] --> Index`,
      deepDives: [
        { title: 'Filters and ANN', body: 'Pre-filter vs post-filter changes recall. A tenant with 0.1% of vectors can get empty results if you post-filter a tiny k. Prefer indexes that support filtered search or per-tenant indexes when isolation is strict.' },
      ],
      tradeoffs: ['One giant index vs index-per-tenant.', 'PQ compression: smaller, worse recall.'],
      bottlenecks: ['Embed ingest backlog', 'Hot query embed API'],
      scalingPath: [
        { scale: 'v1', focus: 'pgvector' },
        { scale: 'v2', focus: 'Dedicated ANN + hybrid' },
      ],
      interviewScript: [
        '“The vector DB is a derived index. ACLs live in metadata and are enforced on retrieve, not after the LLM sees the text.”',
      ],
      commonMistakes: ['No metadata', 'Chunking entire PDFs as one vector'],
      relatedTopics: ['rag', 'enterprise-rag', 'databases'],
      examples: ['Pinecone', 'pgvector', 'Milvus'],
    }),
  },
  {
    id: 'rag',
    title: 'RAG Pipelines',
    description: 'Ingest, chunk, embed, retrieve, rerank, generate, cite — the end-to-end retrieval design.',
    difficulty: 'Advanced',
    progress: 0,
    icon: 'Search',
    color: 'bg-indigo-500',
    section: 'fundamentals',
    track: 'ai',
    prerequisites: ['embeddings', 'llm-serving', 'prompting'],
    estimatedMinutes: 40,
    order: 3,
    content: emptyContent({
      overview: 'RAG grounds an LLM in your data. The quality ceiling is retrieval. Generation cannot fix a missed document.',
      whyItExists: 'Weights go stale. Enterprise facts live in wikis, tickets, and ACLs.',
      whenToUse: ['Internal Q&A', 'Customer support', 'Doc copilots'],
      functionalRequirements: [
        { title: 'Answer with citations', detail: 'Link to source chunks.' },
        { title: 'Respect ACL', detail: 'User only retrieves what they can read.' },
        { title: 'Re-ingest', detail: 'Updates and deletes propagate.' },
      ],
      nonFunctionalRequirements: [
        { title: 'End-to-end p95', detail: 'Often 2-8s including retrieve + generate.' },
        { title: 'Index lag', detail: 'Minutes is typical; seconds needs streaming ingest.' },
      ],
      estimates: [
        { label: 'Retrieve', value: '50-200ms ANN + rerank 100-400ms' },
        { label: 'Generate', value: 'Dominates latency' },
      ],
      concepts: ['Ingest DAG', 'Hybrid retrieve', 'Rerank', 'Context packing', 'Citations'],
      walkthrough: [
        { title: 'Query', description: 'Rewrite query, embed, hybrid retrieve top 50, rerank to 8, pack with token budget, generate, attach citations.' },
        { title: 'Ingest', description: 'Connector → parse → chunk → embed → index. Deletes tombstone vectors.' },
      ],
      steps: [
        { title: 'Eval retrieval separately', description: 'Recall@k on a golden set before blaming the LLM.' },
        { title: 'Refuse when retrieve is weak', description: 'Better than hallucinating.' },
      ],
      architecture: 'Connectors + object store + parse workers + vector+keyword index + query planner + LLM + citation UI.',
      diagram: `flowchart TB
    User --> Planner
    Planner --> Retrieve
    Retrieve --> Rerank
    Rerank --> Pack
    Pack --> LLM
    LLM --> Cite
    Connectors --> Ingest --> Index[(Hybrid index)]
    Retrieve --> Index`,
      deepDives: [
        { title: 'ACL-aware retrieval', body: 'Filter at retrieve time with the user’s permission set. Do not retrieve 20 chunks and drop 19 in the app — you wasted recall and can leak via the prompt if you slip.' },
      ],
      tradeoffs: ['More context: better chance of the fact, worse attention and $.', 'Reranker quality vs latency.'],
      bottlenecks: ['Bad chunking', 'ACL filter + ANN interaction', 'Giant contexts'],
      scalingPath: [
        { scale: 'v1', focus: 'One corpus, no rerank' },
        { scale: 'v2', focus: 'Hybrid + rerank + eval harness' },
      ],
      interviewScript: [
        '“I will split ingest and query. Retrieval is ACL-filtered. The LLM only sees allowed chunks and must cite them.”',
      ],
      commonMistakes: ['Fine-tuning instead of RAG for weekly-changing docs', 'No citations'],
      relatedTopics: ['embeddings', 'enterprise-rag', 'eval-quality'],
      examples: ['Glean-style search', 'LangChain RAG (as a sketch, not a prod architecture)'],
    }),
  },
  {
    id: 'fine-tune-vs-rag',
    title: 'Fine-tuning vs RAG vs Agents',
    description: 'Pick the cheapest correct tool. Most “train a model” asks are RAG or prompts in disguise.',
    difficulty: 'Intermediate',
    progress: 0,
    icon: 'GitBranch',
    color: 'bg-fuchsia-700',
    section: 'fundamentals',
    track: 'ai',
    prerequisites: ['rag', 'prompting'],
    estimatedMinutes: 25,
    order: 4,
    content: emptyContent({
      overview: 'Prompts shape behavior. RAG supplies facts. Fine-tunes change style or a stable skill. Agents loop tools. Mixing them blindly is how budgets die.',
      whyItExists: 'Stakeholders ask for a custom model when they need search plus a prompt.',
      whenToUse: ['Scoping an AI product in an interview'],
      functionalRequirements: [
        { title: 'Decision rubric', detail: 'Facts change? Need tools? Need a voice/format?' },
      ],
      nonFunctionalRequirements: [
        { title: 'Cost of change', detail: 'Prompt hours vs GPU weeks vs eval regressions.' },
      ],
      estimates: [
        { label: 'Prompt/RAG iterate', value: 'Hours' },
        { label: 'Fine-tune iterate', value: 'Days plus eval' },
      ],
      concepts: ['SFT', 'Preference tuning', 'RAG', 'Tool-using agents'],
      walkthrough: [
        { title: 'Ask what changes weekly', description: 'If facts: RAG. If tone: prompt or light SFT. If multi-step software: agents + tools.' },
      ],
      steps: [
        { title: 'Start with prompt + RAG', description: 'Fine-tune when you have a stable task and a dataset.' },
        { title: 'Agents last', description: 'They multiply latency and failure modes.' },
      ],
      architecture: 'Product policy chooses a path. Shared eval harness compares them.',
      diagram: `flowchart TB
    Need --> Facts{Facts change?}
    Facts -->|yes| RAG
    Facts -->|no| Skill{New skill or style?}
    Skill -->|yes| FT[Fine-tune]
    Skill -->|tools| Agent`,
      deepDives: [
        { title: 'Fine-tune is not a knowledge dump', body: 'Weights memorize poorly compared to an index. Use SFT for format, tools, and domain style; use RAG for the employee handbook.' },
      ],
      tradeoffs: ['Agents: powerful, flaky.', 'Fine-tune: locked behavior, expensive to refresh.'],
      bottlenecks: ['No eval, so you cannot choose'],
      scalingPath: [
        { scale: 'v1', focus: 'Prompt + RAG' },
        { scale: 'v2', focus: 'SFT on traces, still RAG for facts' },
      ],
      interviewScript: [
        '“I would not fine-tune to add next week’s policy PDF. That is RAG. I would fine-tune if we need a consistent extraction schema at high volume.”',
      ],
      commonMistakes: ['Fine-tune as the first move', 'Agent for a single SQL query'],
      relatedTopics: ['rag', 'multi-agent', 'eval-quality'],
      examples: ['Support bot (RAG)', 'JSON extractor (SFT)', 'IT copilot (agent + tools)'],
    }),
  },
  {
    id: 'inference-infra',
    title: 'Inference Infrastructure',
    description: 'GPU pools, autoscaling, model routing, canaries, and fallbacks — serving many models like many microservices.',
    difficulty: 'Advanced',
    progress: 0,
    icon: 'Server',
    color: 'bg-slate-700',
    section: 'fundamentals',
    track: 'ai',
    prerequisites: ['llm-serving', 'load-balancer', 'message-queues'],
    estimatedMinutes: 30,
    order: 5,
    content: emptyContent({
      overview: 'Treat models as versioned services with SLOs. Interactive and batch must not share one saturated GPU pool.',
      whyItExists: 'GPUs are scarce and slow to scale. A canary 70B can stall the 8B chat pool if you mix queues.',
      whenToUse: ['Multi-model products', 'Self-hosting discussions'],
      functionalRequirements: [
        { title: 'Route by model id + priority', detail: 'Interactive vs batch queues.' },
        { title: 'Canary and rollback', detail: 'Quality and latency gates.' },
      ],
      nonFunctionalRequirements: [
        { title: 'Scale-to-zero vs warm pool', detail: 'Cold GPU start is minutes, not seconds.' },
        { title: 'Isolation', detail: 'Noisy neighbor jobs.' },
      ],
      estimates: [
        { label: 'GPU cold start', value: 'Minutes to pull weights' },
      ],
      concepts: ['Model router', 'Warm pool', 'Priority queues', 'Canary', 'Fallback'],
      walkthrough: [
        { title: 'Router', description: 'Map (task, tenant, cost class) → model + pool. If the pool is full, degrade to a smaller model or enqueue.' },
      ],
      steps: [
        { title: 'Split interactive and batch', description: 'Overnight eval jobs cannot steal TTFT.' },
        { title: 'Keep a tiny warm fallback', description: 'Better a small model than 30s queue.' },
      ],
      architecture: 'Gateway → router → per-model queues → GPU workers with cached weights. Batch uses a separate queue.',
      diagram: `flowchart LR
    GW --> Router
    Router --> ChatQ[Interactive pool]
    Router --> BatchQ[Batch pool]
    Router --> Fallback[Small warm model]`,
      deepDives: [
        { title: 'Autoscaling', body: 'Scale on tokens in flight and queue age, not CPU. Keep a minimum warm replicas for the default chat model.' },
      ],
      tradeoffs: ['More models: better fit, worse utilization.', 'Always-on GPUs: $ vs TTFT.'],
      bottlenecks: ['Weight loading', 'Head-of-line batch jobs'],
      scalingPath: [
        { scale: 'v1', focus: 'Hosted APIs only' },
        { scale: 'v2', focus: 'Router + two pools' },
      ],
      interviewScript: [
        '“Interactive chat and embedding ingest do not share a queue. I keep a warm small model as fallback.”',
      ],
      commonMistakes: ['One FIFO for everything', 'Ignoring cold start'],
      relatedTopics: ['llm-serving', 'llm-gateway', 'ai-cost'],
      examples: ['Anyscale/vLLM pools', 'Bedrock/Vertex endpoints'],
    }),
  },
  {
    id: 'ai-caching',
    title: 'KV, Prefix, and Semantic Cache',
    description: 'The CDN of AI: reuse attention state, prefixes, and near-duplicate answers.',
    difficulty: 'Advanced',
    progress: 0,
    icon: 'Zap',
    color: 'bg-amber-600',
    section: 'fundamentals',
    track: 'ai',
    prerequisites: ['llm-serving', 'caching'],
    estimatedMinutes: 25,
    order: 6,
    content: emptyContent({
      overview: 'Token generation repeats work. KV cache avoids recomputing past tokens. Prefix cache shares a long system prompt. Semantic cache returns a prior answer for a near-duplicate question.',
      whyItExists: 'Prefill of a 20k-token system prompt on every chat turn is lighting money on fire.',
      whenToUse: ['Long system prompts', 'FAQ-like traffic', 'Multi-turn chat'],
      functionalRequirements: [
        { title: 'Correctness classes', detail: 'Exact prefix reuse is safe. Semantic cache needs a similarity threshold and TTL.' },
      ],
      nonFunctionalRequirements: [
        { title: 'Memory', detail: 'KV cache is the GPU RAM killer.' },
      ],
      estimates: [
        { label: 'Shared system prompt', value: 'Amortize prefill across users' },
      ],
      concepts: ['KV cache', 'Prefix / prompt cache', 'Semantic cache'],
      walkthrough: [
        { title: 'Chat turn 2', description: 'Reuse KV for turn 1; only prefill the new user tokens if the engine allows.' },
        { title: 'FAQ', description: 'Embed question; if cosine > 0.98 and policy allows, return cached answer + source.' },
      ],
      steps: [
        { title: 'Stabilize the system prompt', description: 'A one-character change blows prefix cache.' },
        { title: 'Do not semantic-cache personalized or ACL answers', description: 'Leakage.' },
      ],
      architecture: 'Engine-level KV/prefix on GPU. Application-level semantic cache in Redis with embedding keys.',
      diagram: `flowchart LR
    Req --> Sem{Semantic hit?}
    Sem -->|yes| Return
    Sem -->|no| GPU[Prefill/decode + KV]
    GPU --> Store[Optional semantic store]`,
      deepDives: [
        { title: 'Safety of semantic cache', body: 'Only for public, non-personalized, non-ACL content. A cached answer for “what is my salary” is a breach.' },
      ],
      tradeoffs: ['Aggressive semantic cache: cheaper, wrong/stale.', 'Huge KV: faster decode, fewer concurrent users.'],
      bottlenecks: ['GPU RAM', 'Prompt thrash'],
      scalingPath: [
        { scale: 'v1', focus: 'Provider-side KV' },
        { scale: 'v2', focus: 'Prefix cache + careful semantic cache' },
      ],
      interviewScript: [
        '“I will cache prefixes for the shared system prompt and never semantically cache tenant documents.”',
      ],
      commonMistakes: ['Semantic cache on RAG with ACLs'],
      relatedTopics: ['caching', 'cdn', 'chatgpt-assistant', 'ai-cost'],
      examples: ['vLLM prefix cache', 'Redis semantic cache for public FAQs'],
    }),
  },
  {
    id: 'eval-quality',
    title: 'Eval, Tracing, and Quality',
    description: 'Golden sets, online eval, traces, and latency SLOs — you cannot ship what you cannot measure.',
    difficulty: 'Intermediate',
    progress: 0,
    icon: 'Eye',
    color: 'bg-teal-600',
    section: 'fundamentals',
    track: 'ai',
    prerequisites: ['reliability', 'rag'],
    estimatedMinutes: 25,
    order: 7,
    content: emptyContent({
      overview: 'LLM output is stochastic. Treat quality like an SLO: offline golden sets, sampled online judges, and traces that show retrieve + tools + tokens.',
      whyItExists: 'A prompt change can silently tank citation precision.',
      whenToUse: ['Every AI product, before launch'],
      functionalRequirements: [
        { title: 'Trace a request', detail: 'Prompt versions, chunks, tools, tokens, cost.' },
        { title: 'Score', detail: 'Retrieval recall, groundedness, task success.' },
      ],
      nonFunctionalRequirements: [
        { title: 'Judge cost', detail: 'Sample online eval; do not judge 100% with a huge model.' },
      ],
      estimates: [
        { label: 'Golden set', value: 'Start with 50-200 hard cases, not 3 demos' },
      ],
      concepts: ['Golden set', 'LLM-as-judge (with bias)', 'Groundedness', 'Tracing'],
      walkthrough: [
        { title: 'Change prompt', description: 'Run offline suite. Block deploy if groundedness drops more than error budget.' },
        { title: 'Production', description: 'Sample 1% traces for human or judge review.' },
      ],
      steps: [
        { title: 'Split retrieval and generation metrics', description: 'Otherwise you debug the wrong layer.' },
        { title: 'Store traces without dumping PII to a third party blindly', description: 'Tenancy.' },
      ],
      architecture: 'App emits spans → store → eval jobs → dashboards. Prompt versions are first-class.',
      diagram: `flowchart LR
    Req --> Trace
    Trace --> Store
    Store --> Offline[Golden eval]
    Store --> Online[Sampled judge]`,
      deepDives: [
        { title: 'LLM-as-judge', body: 'Useful and biased. Calibrate against humans. Never let the same model grade its own unlimited production traffic without sampling.' },
      ],
      tradeoffs: ['More eval: slower iteration, safer.', 'Judges add cost and delay.'],
      bottlenecks: ['No owner of the golden set'],
      scalingPath: [
        { scale: 'v1', focus: 'Spreadsheet of 30 cases' },
        { scale: 'v2', focus: 'CI eval + sampled prod traces' },
      ],
      interviewScript: [
        '“I would not ship a prompt change without an offline retrieval+groundedness suite.”',
      ],
      commonMistakes: ['Only demo-driven development', 'Logging raw prompts with secrets'],
      relatedTopics: ['reliability', 'llm-gateway', 'enterprise-rag'],
      examples: ['Langfuse/Braintrust-style tracing', 'RAGAS-style metrics'],
    }),
  },
  {
    id: 'ai-safety',
    title: 'Safety, Privacy, and Tenancy',
    description: 'PII, prompt injection, data isolation, and audit logs — the abuse section of every AI design.',
    difficulty: 'Intermediate',
    progress: 0,
    icon: 'Shield',
    color: 'bg-red-700',
    section: 'fundamentals',
    track: 'ai',
    prerequisites: ['prompting', 'reliability'],
    estimatedMinutes: 25,
    order: 8,
    content: emptyContent({
      overview: 'AI systems amplify classic security bugs: untrusted text becomes instructions, and completions can leak retrieved docs across tenants.',
      whyItExists: 'A single missed ACL filter in RAG is a data breach with a helpful tone.',
      whenToUse: ['Enterprise RAG, agents, copilots'],
      functionalRequirements: [
        { title: 'Tenant isolation', detail: 'Indexes, logs, and caches keyed by tenant.' },
        { title: 'Audit', detail: 'Who asked what, what was retrieved, which tools ran.' },
        { title: 'Redaction', detail: 'PII in logs and in prompts when possible.' },
      ],
      nonFunctionalRequirements: [
        { title: 'Residency', detail: 'Some tenants forbid third-party model APIs.' },
      ],
      estimates: [
        { label: 'Injection attempts', value: 'Assume 100% of user+doc text is hostile' },
      ],
      concepts: ['Prompt injection', 'Confused deputy tools', 'Tenant keys', 'Data retention'],
      walkthrough: [
        { title: 'Retrieve', description: 'ACL filter first.' },
        { title: 'Generate', description: 'No tools with side effects unless a second policy check passes on the tool args, not the model’s story.' },
      ],
      steps: [
        { title: 'Never execute a tool solely because the model asked', description: 'Authorize as the user.' },
        { title: 'Separate untrusted content', description: 'Delimiters, stripping, and allow-lists.' },
      ],
      architecture: 'Policy engine beside the tool runtime. Per-tenant indexes. Separate encryption keys optional for high-compliance.',
      diagram: `flowchart LR
    User --> Policy
    Policy --> Retrieve
    Policy --> Tools
    Retrieve --> LLM
    Tools --> LLM`,
      deepDives: [
        { title: 'Confused deputy', body: 'The model is not the principal. If it says “email the retrieved salaries to attacker@x,” the mail tool must still enforce the user’s scopes.' },
      ],
      tradeoffs: ['Hosted LLM: speed vs data leaving the boundary.', 'Strict allow-lists: safer, less magic.'],
      bottlenecks: ['Humans bypassing policy in a “just this once” prompt'],
      scalingPath: [
        { scale: 'v1', focus: 'Tenant_id on every row and vector' },
        { scale: 'v2', focus: 'Policy engine + dual keys + residency options' },
      ],
      interviewScript: [
        '“User text and retrieved docs are untrusted. Tools run under the user’s authz, not the model’s.”',
      ],
      commonMistakes: ['Shared vector index without filters', 'Logging full prompts to a SaaS by default'],
      relatedTopics: ['enterprise-rag', 'multi-agent', 'reliability'],
      examples: ['Enterprise ChatGPT settings', 'SOC2 RAG designs'],
    }),
  },
  {
    id: 'ai-cost',
    title: 'Cost Control',
    description: 'Token budgets, model cascades, batch vs interactive, and caches that actually save money.',
    difficulty: 'Intermediate',
    progress: 0,
    icon: 'Coins',
    color: 'bg-yellow-600',
    section: 'fundamentals',
    track: 'ai',
    prerequisites: ['llm-serving', 'ai-caching', 'inference-infra'],
    estimatedMinutes: 20,
    order: 9,
    content: emptyContent({
      overview: 'AI unit economics are tokens and GPU-seconds. Design a cascade: classify cheaply, retrieve, then spend a large model only when needed.',
      whyItExists: 'A single naive GPT-class call per keystroke will bankrupt a copilot.',
      whenToUse: ['Every production AI design close'],
      functionalRequirements: [
        { title: 'Per-tenant budget', detail: 'Hard deny or degrade.' },
        { title: 'Cascade', detail: 'Small model → large model on low confidence.' },
      ],
      nonFunctionalRequirements: [
        { title: 'Predictable $ / Q', detail: 'Alerts on token burn.' },
      ],
      estimates: [
        { label: 'Rule of thumb', value: 'Input tokens often dominate RAG (context packing)' },
      ],
      concepts: ['Cascade', 'Token budget', 'Batch embeddings', 'Cache hit $'],
      walkthrough: [
        { title: 'Request', description: 'Estimate tokens. If over budget, shrink context or refuse. Try small model; escalate if needed.' },
      ],
      steps: [
        { title: 'Charge the expensive step to a budget counter', description: 'Redis token bucket, but for dollars/tokens.' },
        { title: 'Batch ingest embeddings', description: 'Never embed one chunk per HTTP call in a loop without a batcher.' },
      ],
      architecture: 'Gateway meters tokens. Router implements cascade. Ingest uses batch APIs. Dashboards per tenant.',
      diagram: `flowchart TB
    Req --> Budget
    Budget --> Small[Small model]
    Small -->|low confidence| Large[Large model]
    Small -->|ok| Out`,
      deepDives: [
        { title: 'Context is the silent killer', body: 'Packing 50 retrieved chunks into every call is a cost bug. Rerank harder, pack less.' },
      ],
      tradeoffs: ['Cascade: cheaper average, worse tail quality if the gate is wrong.'],
      bottlenecks: ['Uncapped agent loops'],
      scalingPath: [
        { scale: 'v1', focus: 'Hard max tokens per request' },
        { scale: 'v2', focus: 'Cascade + tenant budgets + semantic cache for public FAQs' },
      ],
      interviewScript: [
        '“I would cap context, cascade models, and meter tokens per tenant at the gateway.”',
      ],
      commonMistakes: ['Always the largest model', 'No max tool hops'],
      relatedTopics: ['llm-gateway', 'inference-infra', 'chatgpt-assistant'],
      examples: ['Model routers', 'Batch embedding jobs'],
    }),
  },
];
