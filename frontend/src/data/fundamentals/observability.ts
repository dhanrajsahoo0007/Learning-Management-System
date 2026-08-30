import { ArchitectureTopic, emptyContent } from '../systemDesignTypes';

export const observabilityTopic: ArchitectureTopic = {
  id: 'observability',
  title: 'Observability',
  description: 'Metrics, logs, and traces: what each one can and cannot answer, why cardinality is the bill, and how an error budget decides whether you ship.',
  difficulty: 'Intermediate',
  progress: 0,
  icon: 'Eye',
  color: 'bg-emerald-800',
  section: 'fundamentals',
  track: 'classic',
  prerequisites: ['reliability'],
  estimatedMinutes: 70,
  order: 22,
  content: emptyContent({
    overview:
      'Observability is the ability to answer a question you did not anticipate, using data the system already emits. In practice it is three signals with different cost curves: metrics are cheap, pre-aggregated, and cannot tell you about one request; logs are expensive, unaggregated, and can; traces are sampled and tell you where in a chain of twenty services the latency went. The engineering work is deciding what each signal is allowed to cost.',
    whyItExists:
      'Once a request crosses a dozen processes, no single machine holds the story, and a stack trace on one host explains nothing. Observability exists so that a symptom a user reports can be turned into a specific line of code in a specific service without redeploying anything.',
    problemStatement: {
      prompt:
        'A user reports that checkout is slow, but every service dashboard shows a healthy average latency. You have 40 services, 50,000 requests per second, and a monthly telemetry bill that already exceeds your compute bill. Design the signals you emit, what you keep, and how you alert.',
      inScope: [
        'Metrics, logs, and traces, and what each one is good and bad at',
        'Cardinality, histograms, and correct percentile computation',
        'Trace context propagation and sampling strategy',
        'RED, USE, and SLO error budgets driving alerts and releases',
      ],
      outOfScope: [
        'Choosing between specific vendors and their pricing pages',
        'Log parsing grammars and regex extraction rules',
        'Security auditing and compliance retention requirements',
        'Business intelligence and product analytics pipelines',
      ],
    },
    assumptions: [
      'Services run many replicas, so per-instance data must be aggregated to be meaningful',
      'Telemetry storage cost grows with unique series and with raw log bytes, not with request count alone',
      'Every service can be instrumented, and a shared library propagates context automatically',
    ],
    whenToUse: [
      'Any system where a request touches more than two processes',
      'Debugging tail latency, which averages structurally hide',
      'Making release decisions from a measured reliability target rather than from intuition',
    ],
    functionalRequirements: [
      { title: 'Emit the three signals', detail: 'Counters, gauges, and histograms; structured logs with a trace id; spans for every outbound call.' },
      { title: 'Propagate context', detail: 'A W3C traceparent header carried across every HTTP, gRPC, and queue hop, including async boundaries.' },
      { title: 'Query across signals', detail: 'From a metric spike to an exemplar trace to that request logs, without a manual id hunt.' },
      { title: 'Alert on user-visible symptoms', detail: 'Page on error rate and latency against an SLO, not on CPU or on a single restarted pod.' },
    ],
    nonFunctionalRequirements: [
      { title: 'Overhead', detail: 'Instrumentation must cost under 2% of CPU and add under 1 ms to p99 per hop.' },
      { title: 'Cost ceiling', detail: 'Telemetry spend bounded by series count and log bytes, with a hard cardinality limit enforced at ingest.' },
      { title: 'Freshness', detail: 'Metrics visible within 30 seconds, so an alert fires while the incident is still happening.' },
      { title: 'Retention', detail: 'High-resolution data for 15 days, downsampled rollups for 13 months of capacity planning.' },
    ],
    estimates: [
      { label: 'Baseline series count', value: '40 svc x 25 routes x 6 statuses x 10 pods = 60,000 combos', note: 'A 12-bucket histogram is 14 series per combo, so about 840,000 active series' },
      { label: 'Memory for those series', value: '840k x 3 KB ≈ 2.5 GB', note: 'Roughly the per-series RAM cost of a Prometheus-style head block' },
      { label: 'Adding a user_id label', value: '840k x 500k users = 4.2 x 10^11 series', note: 'Cardinality is multiplicative, so one label ends the system' },
      { label: 'Log volume', value: '50k rps x 2 lines x 800 B = 80 MB/s ≈ 6.9 TB/day', note: 'At typical ingest pricing this is the single largest telemetry line item' },
      { label: 'Error budget at 99.9%', value: '43 min 12 s per 30 days', note: '0.1% of 43,200 minutes — the total unreliability you are allowed to spend' },
    ],
    concepts: [
      'Metrics, logs, traces, profiles',
      'Cardinality explosion',
      'Counter, gauge, histogram',
      'Percentiles are not averageable',
      'Spans, parent id, traceparent',
      'Head versus tail sampling',
      'Exemplars linking metric to trace',
      'RED, USE, SLI, SLO, error budget',
    ],
    comparisons: [
      {
        title: 'The four signals',
        headers: ['Signal', 'What it answers', 'Cost', 'Use when', 'Avoid when'],
        rows: [
          [
            'Metrics',
            '"Is it broken, and since when?" — aggregate rate, error ratio, latency distribution over time',
            'Cheapest: cost scales with unique series, not with request volume',
            'Dashboards, alerting, capacity planning, anything continuous',
            'You need the details of one specific request or user',
          ],
          [
            'Logs',
            '"What exactly happened in this one execution?" — the values, the branch taken, the error message',
            'Most expensive: cost scales with raw bytes, typically terabytes per day',
            'Debugging a known request, audit trails, rare error detail',
            'You want a rate or a percentile — computing it from logs is slow and costly',
          ],
          [
            'Traces',
            '"Which of the twenty hops was slow, and what called what?" — causal latency breakdown',
            'Moderate: controlled by sampling, but every span carries attributes',
            'Latency investigation across services, discovering unexpected dependencies',
            'You need every request retained, or the system is a single process',
          ],
          [
            'Profiles',
            '"Which function burned the CPU or held the memory?" — code-level attribution',
            'Low and continuous: periodic stack sampling at roughly 100 Hz',
            'A service is CPU or allocation bound and traces stop at the service edge',
            'The problem is I/O wait, lock contention across hosts, or a downstream dependency',
          ],
        ],
        note: 'They are complementary, not competing. The mature pattern is alert on metrics, jump to a trace through an exemplar, then read the logs for that trace id.',
      },
    ],
    architecture:
      'Each process emits metrics to a scrape endpoint or a push gateway, writes structured JSON logs to stdout, and starts a span for every inbound and outbound call. A collector sitting beside the workload — an OpenTelemetry collector as a sidecar or node agent — batches, enriches, samples, and forwards to separate backends, because time series, log, and trace storage have genuinely different shapes. The single thread stitching them together is the trace id, present on every span, stamped into every log line, and attached to metric samples as an exemplar.',
    diagrams: [
      { id: 'trace', title: 'One trace id crosses every hop', kind: 'excalidraw', src: 'trace-line' },
    ],
    walkthrough: [
      {
        title: 'The edge starts a trace and names the request',
        description:
          'The first service to see the request checks for an incoming traceparent header and, finding none, generates a 16-byte trace id and an 8-byte span id. That trace id is now the identity of this checkout attempt, and it will appear on every span, log line, and exemplar produced anywhere in the system for the next two seconds. Everything else in observability is a way of grouping data by this identifier or by the labels attached to it.',
      },
      {
        title: 'Every hop propagates context and creates a child span',
        description:
          'When the checkout service calls payments, it sends traceparent with the same trace id and its own span id as the parent, and payments creates a child span. The parent-child relationship is what turns a flat list of timings into a tree you can read, showing that a 900 millisecond checkout was 850 milliseconds waiting on one inventory call. The failure mode is a hop that drops the header — usually a queue consumer or a thread pool — which severs the trace and leaves an orphan subtree.',
      },
      {
        title: 'Metrics record the aggregate cheaply',
        description:
          'Alongside the span, each service increments a request counter labelled by route and status code and observes the duration into a histogram. This costs a few atomic increments and, unlike a log line, its storage cost does not grow with traffic — a service handling ten times the requests produces exactly the same number of time series. This is why metrics carry alerting and dashboards, and why adding a high-cardinality label to them is so damaging.',
      },
      {
        title: 'Alerts fire on RED and USE symptoms',
        description:
          'For each service you watch RED — request rate, error rate, and duration distribution — because those three describe what a caller experiences. For each resource behind it you watch USE — utilisation, saturation, and errors — because those describe why. The page goes out on the RED signals breaching the SLO burn rate; the USE signals appear on the dashboard the responder opens, but they do not wake anybody up on their own.',
      },
      {
        title: 'An exemplar takes you from the graph to one request',
        description:
          'The p99 latency panel jumps from 180 milliseconds to 2.1 seconds. Because the histogram bucket recorded an exemplar — a trace id attached to one sample that landed in that bucket — the responder clicks a point on the chart and lands directly in a real slow trace. Without exemplars this step is a manual hunt through logs filtered by timestamp and latency, which is the difference between a two minute and a forty minute investigation.',
      },
      {
        title: 'Logs supply the last mile of detail',
        description:
          'The trace shows that the inventory call took 1.9 seconds; the logs for that trace id in the inventory service show a retry loop against a replica with a saturated connection pool. Only logs carry the specific values — which SKU, which shard, which pool — and this is precisely why they are worth their cost when queried by trace id, and not worth it when used as a substitute for metrics.',
      },
    ],
    deepDives: [
      {
        title: 'Cardinality is the bill',
        body:
          'A metric costs storage per unique combination of label values, and combinations multiply. Forty services, twenty-five routes each, six status codes, and ten pods gives 60,000 combinations; a duration histogram with twelve buckets plus a sum and a count is fourteen series per combination, so 840,000 active series at roughly three kilobytes of memory each, about 2.5 gigabytes. Now add a user_id label with 500,000 monthly users: the theoretical series count becomes 4.2 x 10^11, and even the reachable subset destroys the ingest path. The rule is that labels may only take values from a small bounded set — route templates, not raw URLs; status classes, not error strings; never user, order, request, or session identifiers. Those belong on logs and spans, where the cost is per event rather than per unique series.',
      },
      {
        title: 'Why you need histograms, and why averaging percentiles is wrong',
        body:
          'A gauge reporting "p99 latency" per instance cannot be combined across instances, because a percentile is not a linear function of its inputs. If instance A serves 10,000 requests with a p99 of 100 milliseconds and instance B serves 10 requests with a p99 of 5 seconds, the mean of the two p99 values is 2.55 seconds, which describes nothing that happened. A histogram fixes this by shipping bucket counts — requests under 10 ms, under 25 ms, under 50 ms and so on — which are plain counters and therefore additive. You sum the buckets across every instance first, then interpolate the quantile from the merged distribution. The accuracy of the answer is limited by bucket boundaries, so place them around the latencies you care about rather than uniformly.',
      },
      {
        title: 'Trace context propagation and where it breaks',
        body:
          'The W3C traceparent header carries four fields in one string: version, 32 hex characters of trace id, 16 hex characters of the current span id, and one byte of flags whose low bit says whether this trace is sampled. A callee reads it, records the incoming span id as its parent, and emits a new span id downstream. Because the sampled bit travels with the request, the whole trace is either kept or dropped consistently rather than half-recorded. Propagation breaks at boundaries the instrumentation library does not own: a message published to a queue must copy traceparent into the message headers, a thread handed to an executor must carry the context object, and a batch job must decide whether it continues the trace or links to it. Every broken hop is a trace that stops exactly where the interesting part starts.',
      },
      {
        title: 'Head sampling versus tail sampling',
        body:
          'Head sampling makes the keep-or-drop decision at the first service, before anything is known — typically keep one percent, which at 50,000 requests per second and twenty spans each leaves 10,000 spans per second instead of a million. It is cheap and consistent, and it throws away almost every error and every slow request, because those are rare by definition. Tail sampling buffers all spans of a trace in the collector for a few seconds, waits for the trace to complete, then decides using the outcome: keep everything that errored, everything over one second, and one percent of the healthy remainder. It gives you the traces you actually want at the cost of a stateful collector holding several gigabytes of in-flight spans and a hard timeout for traces that never finish.',
      },
      {
        title: 'The error budget decides whether you ship',
        body:
          'An SLI is a measured ratio, such as the fraction of checkout requests served successfully in under 300 milliseconds. An SLO is the target for it, say 99.9% over 30 days, which grants an error budget of 0.1% — 43 minutes and 12 seconds of failure per month. The budget converts reliability from an argument into arithmetic: if a release burned 8 minutes of budget on Monday, you have 35 left and can keep shipping. If you have consumed 40 minutes by the tenth of the month, feature work stops and stability work starts, by prior agreement rather than by negotiation during an incident. Alerting follows the same logic through burn rate — page when the budget is being consumed fourteen times faster than sustainable, warn at six times over a longer window.',
      },
      {
        title: 'Continuous profiling, the fourth signal',
        body:
          'A trace tells you a service spent 400 milliseconds on CPU; it does not tell you which function. Continuous profiling samples stack traces from every production process at a low frequency, around 100 hertz, and aggregates them into flame graphs labelled with service, version, and pod, at an overhead usually under one percent of CPU. Because it runs all the time rather than only when someone attaches a profiler, you can compare this week to last week and attribute a regression to a specific deploy and a specific function — a JSON serialiser that started copying, a regex compiled inside a loop. Allocation and lock profiles work the same way and cover memory growth and contention that CPU sampling misses.',
      },
    ],
    tradeoffs: [
      'More labels give sharper queries and multiply series count and cost.',
      'Head sampling is cheap and consistent but discards the rare traces you need most.',
      'Longer retention aids capacity planning and dominates storage spend, so downsample after two weeks.',
      'Rich logs answer anything and are the largest bill; narrow logs are cheap and leave gaps at 3 a.m.',
    ],
    bottlenecks: [
      'A single high-cardinality label overwhelming the metrics ingest path.',
      'Log ingest saturating at multiple terabytes per day, causing silent drops during exactly the incident you are debugging.',
      'Tail-sampling collectors running out of memory holding in-flight spans.',
      'Instrumentation overhead on hot paths, especially synchronous log writes and unbatched span export.',
    ],
    scalingPath: [
      { scale: 'Prototype', focus: 'Structured JSON logs with a request id, plus RED metrics on every endpoint' },
      { scale: 'One region', focus: 'Full tracing with W3C propagation, histograms with exemplars, SLOs and burn-rate alerts on the top five journeys' },
      { scale: 'Global', focus: 'Per-region collectors with tail sampling, downsampled long-term rollups, enforced cardinality limits, and continuous profiling' },
    ],
    interviewScript: [
      '"Metrics tell me something is wrong, traces tell me where, and logs tell me why — I will emit all three and link them by trace id."',
      '"Latency goes into a histogram, because bucket counts are additive across instances and averaged percentiles are meaningless."',
      '"No user id or request id on a metric label — 500,000 users multiplies my series count into the hundreds of billions."',
      '"Every hop propagates traceparent, including the queue consumers, or the trace stops at the interesting boundary."',
      '"Head sampling at one percent for volume, plus tail sampling to keep every error and everything over a second."',
      '"I alert on the SLO burn rate for user-visible symptoms; CPU saturation is a dashboard, not a page."',
    ],
    commonMistakes: [
      'Putting a user id, order id, or raw URL into a metric label.',
      'Averaging per-instance p99 values and reporting the result as a p99.',
      'Alerting on causes such as CPU or pod restarts instead of user-visible symptoms.',
      'Using logs to compute rates and percentiles that a counter would provide for a thousandth of the cost.',
      'Dropping trace context at asynchronous boundaries and wondering why traces end mid-flow.',
      'Setting an SLO nobody has agreed to act on, so the error budget never changes any decision.',
    ],
    relatedTopics: ['reliability', 'deployments', 'batch-stream', 'rate-limiting'],
    examples: [
      'OpenTelemetry standardises the SDKs and the W3C traceparent format so instrumentation is not vendor-specific',
      'Prometheus stores metrics as label sets, which is why its documentation warns explicitly about cardinality',
      'Google published the SRE error budget model, where exhausting the budget freezes feature releases by agreement',
    ],
    practicePrompt:
      'Given 50,000 requests per second across 40 services and a fixed telemetry budget, decide the sampling rate, the metric labels you allow, and the log retention you can afford.',
    followUps: [
      {
        question: 'What is cardinality explosion, concretely?',
        answer:
          'Metric storage costs per unique label combination, and combinations multiply rather than add. A histogram already costs about fourteen series per combination, so forty services with twenty-five routes, six status codes, and ten pods is already 840,000 series. Adding a user_id label with 500,000 users multiplies that by 500,000, which is a number no time series database will ingest, so identifiers belong on spans and logs instead.',
        category: 'Metrics',
        difficulty: 'medium',
      },
      {
        question: 'Why can you not average p99 across instances?',
        answer:
          'A percentile is a property of a distribution, not a value you can take the mean of. An instance serving 10,000 requests at a 100 millisecond p99 and one serving 10 requests at a 5 second p99 average to 2.55 seconds, which no user experienced. The correct approach is to export histogram bucket counts, sum those counters across instances, and compute the quantile from the merged distribution.',
        category: 'Metrics',
        difficulty: 'hard',
      },
      {
        question: 'When do you choose a counter, a gauge, or a histogram?',
        answer:
          'A counter only increases and answers rate questions, so requests, errors, and bytes sent are counters and you take their derivative at query time. A gauge is a point-in-time value that can go up or down, such as queue depth, connection pool size, or memory in use. A histogram records a distribution of observed values in buckets and is the only correct choice for latency or payload size, because it lets you compute quantiles after aggregation.',
        category: 'Metrics',
        difficulty: 'easy',
      },
      {
        question: 'How does trace context propagate across an async boundary?',
        answer:
          'The producer serialises the current traceparent into the message headers or payload metadata, and the consumer extracts it and starts a span whose parent is the producer span. For fan-out cases where one consumer batch handles messages from many traces, the span link relationship is used instead of parent-child, so the batch span references several traces without pretending to belong to one. Missing this step is the most common cause of traces that stop at the queue.',
        category: 'Tracing',
        difficulty: 'hard',
      },
      {
        question: 'What are exemplars and why do they matter?',
        answer:
          'An exemplar is a trace id attached to a single observation inside a histogram bucket, so a metric data point carries a pointer to one real request that produced it. When the p99 panel spikes, you click the spike and land in an actual slow trace instead of guessing at a log query filtered by timestamp. It is the cheapest possible bridge between the aggregate and the individual, and it cuts investigation time from tens of minutes to a couple.',
        category: 'Tracing',
        difficulty: 'medium',
      },
      {
        question: 'What is the difference between RED and USE?',
        answer:
          'RED — rate, errors, duration — describes a service from the caller point of view and is what you alert on, because it maps directly to user experience. USE — utilisation, saturation, errors — describes a resource such as a CPU, a disk, or a connection pool, and explains why the RED numbers moved. The rule of thumb is that RED pages people and USE is what those people look at once they are awake.',
        category: 'Practice',
        difficulty: 'easy',
      },
      {
        question: 'How do you use an error budget to decide whether to ship?',
        answer:
          'Convert the SLO into a concrete allowance: 99.9% over 30 days is 43 minutes and 12 seconds of failure. Track consumption continuously, so after a bad release burns 20 of those minutes the team knows it has 23 left. The agreement made in advance is what gives it force — while budget remains, ship; once it is exhausted, feature work pauses in favour of reliability work, with no per-incident negotiation.',
        category: 'SLO',
        difficulty: 'medium',
      },
      {
        question: 'Why alert on symptoms rather than causes?',
        answer:
          'Cause-based alerts have a poor ratio of pages to real user impact: a pod restarting, a CPU at 90%, or a full disk on one replica often changes nothing a customer can see, and each false page erodes trust in the whole alerting system. Symptom alerts on error ratio and latency against the SLO fire exactly when users are affected, including for causes nobody predicted. Keep the cause metrics — they belong on the dashboard the responder opens, not on the pager.',
        category: 'Practice',
        difficulty: 'medium',
      },
      {
        question: 'How do you reduce log cost without going blind?',
        answer:
          'Log at info for state transitions rather than for every step, and sample repetitive success lines aggressively while keeping every error and every line belonging to a sampled trace. Move anything you were counting in logs into a counter, since a rate computed from a metric costs a rounding error compared with scanning terabytes. Then tier storage: searchable hot retention for a week or two, cheap object storage for the compliance tail.',
        category: 'Logs',
        difficulty: 'medium',
      },
      {
        question: 'Where does continuous profiling fit?',
        answer:
          'It picks up where traces stop. A span can tell you a service burned 400 milliseconds of CPU inside itself, but only a profile attributes that to a function — a regex compiled per request, a serialiser copying buffers. Sampling stacks at around 100 hertz in production costs under one percent of CPU and, because it is always on, lets you diff a flame graph against last week and pin a regression to one deploy.',
        category: 'Profiling',
        difficulty: 'hard',
      },
    ],
  }),
};
