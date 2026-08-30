import { ArchitectureTopic, emptyContent } from '../systemDesignTypes';

export const deploymentsTopic: ArchitectureTopic = {
  id: 'deployments',
  title: 'Deployments and Release Safety',
  description: 'Rolling, blue-green, canary, flags, and shadow traffic — plus the draining, readiness, and schema rules that decide whether a deploy is invisible or an incident.',
  difficulty: 'Intermediate',
  progress: 0,
  icon: 'Server',
  color: 'bg-stone-700',
  section: 'fundamentals',
  track: 'classic',
  prerequisites: ['load-balancer', 'observability'],
  estimatedMinutes: 65,
  order: 27,
  content: emptyContent({
    overview:
      'A deployment strategy is a plan for having two versions of your software running at the same time without the user noticing. Every strategy — rolling, blue-green, canary — is a different answer to how long that overlap lasts, how much it costs, and how fast you can undo it. Most deploy-time incidents are not caused by the strategy but by the mechanics underneath it: readiness gating, connection draining, and a schema change that only one version understands.',
    whyItExists:
      'Stopping the old version and starting the new one is an outage plus an unbounded blast radius, and a full redeploy is far too slow to serve as a rollback. Progressive delivery exists to make the change gradual, observable, and reversible in seconds.',
    problemStatement: {
      prompt:
        'Sixty instances serve 2,000 requests per second, and you ship several times a day including database migrations. Design a release process where a bad version affects under one percent of traffic, is detected automatically, and is reverted in under a minute without a rebuild.',
      inScope: [
        'Rolling, blue-green, canary, feature flags, and shadow traffic',
        'Readiness gating, draining, PreStop hooks, and in-flight completion',
        'Backward-compatible schema migration as expand, migrate, contract',
        'Automated rollback driven by SLO regression',
      ],
      outOfScope: [
        'CI pipeline construction and build caching',
        'Artefact signing, supply chain, and image scanning policy',
        'Infrastructure provisioning and cluster upgrades',
        'Load balancing algorithms, covered by the load balancer lesson',
      ],
    },
    assumptions: [
      'Two versions of the service will be live simultaneously for at least several minutes',
      'Traffic can be split by weight at a load balancer, ingress, or mesh',
      'You have per-version metrics good enough to compare error rate and latency',
    ],
    whenToUse: [
      'Any service deployed more often than a scheduled maintenance window allows',
      'Changes whose risk cannot be fully established in a test environment, such as performance regressions',
      'Migrations where the old and new code must both work against the same data',
    ],
    functionalRequirements: [
      { title: 'Progressive traffic shift', detail: 'Move traffic to a new version in controlled increments, from 1% to 100%.' },
      { title: 'Automated verification', detail: 'Compare the new version error rate and latency against a control before proceeding.' },
      { title: 'Fast rollback', detail: 'Return to the previous version by changing weights, without rebuilding or redeploying.' },
      { title: 'Zero dropped requests', detail: 'In-flight requests complete during instance replacement, and no caller reaches a stopped process.' },
    ],
    nonFunctionalRequirements: [
      { title: 'Blast radius', detail: 'A bad version is seen by under 1% of requests before automated analysis halts it.' },
      { title: 'Rollback time', detail: 'Under 60 seconds from detection to full restoration of the previous version.' },
      { title: 'Capacity headroom', detail: 'Enough spare capacity to run the overlap, from 25% for rolling to 100% for blue-green.' },
      { title: 'Deploy duration', detail: 'A full roll completes within about ten minutes, so incident fixes are not gated on it.' },
    ],
    estimates: [
      { label: 'Rolling deploy duration', value: '60 instances, 25% surge, 90 s per batch ≈ 6 min', note: 'Four batches of 15; startup, readiness, and drain dominate' },
      { label: 'Blue-green capacity', value: '60 instances become 120 for ~20 min', note: 'Double the compute for the overlap window, not for the whole day' },
      { label: 'Canary sample', value: '1% of 2,000 rps = 20 rps → 18,000 requests in 15 min', note: 'Enough to distinguish a 0.1% baseline error rate from 0.6%' },
      { label: 'Rollback time', value: 'weight change ~30 s vs redeploy ~6 min', note: 'The entire reason the old version is kept running' },
      { label: 'Drain budget', value: 'PreStop sleep 5 s + 30 s grace', note: 'Grace must exceed your longest normal request or in-flight work is cut' },
    ],
    concepts: [
      'Rolling update, surge and unavailable',
      'Blue-green weight switch',
      'Canary with a control group',
      'Feature flag and kill switch',
      'Shadow or dark traffic',
      'Readiness gating and draining',
      'Expand, migrate, contract',
      'Automated rollback on SLO burn',
    ],
    comparisons: [
      {
        title: 'Release strategies',
        headers: ['Strategy', 'How it works', 'Rollback speed', 'Cost', 'Use when'],
        rows: [
          [
            'Rolling',
            'Replace instances in batches governed by maxSurge and maxUnavailable until the whole fleet is new',
            'Minutes — it is another full roll backwards',
            'Low: only the surge headroom, around 25% extra',
            'The default for stateless services with compatible schemas',
          ],
          [
            'Blue-green',
            'Stand up a complete second environment, verify it, then shift the load balancer weight to it',
            'Seconds — flip the weight back',
            'High: double capacity for the overlap window',
            'Risky releases where instant, complete rollback is worth the money',
          ],
          [
            'Canary',
            'Send 1% of traffic to the new version and compare its metrics against a control before widening',
            'Seconds — set the canary weight to zero',
            'Low: a handful of extra instances plus the analysis tooling',
            'You need to learn from production traffic with a small blast radius',
          ],
          [
            'Feature flag',
            'Ship the code disabled and enable the behaviour at runtime per user, cohort, or percentage',
            'Instant — turn the flag off',
            'Low in infrastructure, real in code complexity',
            'Decoupling release from deploy, or needing a kill switch',
          ],
          [
            'Shadow traffic',
            'Mirror real requests to the new version and discard its responses so users never see them',
            'Not applicable — it serves no user traffic',
            'Moderate: full duplicate compute, and side effects must be stubbed',
            'Validating a rewrite or a performance change under real traffic shape',
          ],
        ],
        note: 'These compose. A typical mature pipeline is a canary analysed automatically, promoted by a rolling update, with the risky behaviour behind a flag.',
      },
    ],
    architecture:
      'The load balancer, ingress, or mesh holds a weighted map from a route to one or more versioned backend pools, and a deploy is a sequence of edits to those weights rather than a restart of anything. Each instance joins its pool only after passing readiness and leaves it before it stops accepting connections, so the pool always contains exactly the instances able to serve. An analysis component watches per-version error rate and latency and either advances the weights or sets the new version to zero.',
    diagrams: [
      { id: 'bg', title: 'Shift weight, watch the SLO', kind: 'excalidraw', src: 'blue-green' },
    ],
    walkthrough: [
      {
        title: 'A rolling update replaces the fleet in batches',
        description:
          'You declare two limits: maxSurge, how many instances above the desired count may exist at once, and maxUnavailable, how many below it you tolerate. With sixty instances and a 25% surge the controller starts fifteen new instances, waits for each to pass readiness, drains and removes fifteen old ones, and repeats. At roughly ninety seconds per batch — startup, readiness, drain — the full roll takes about six minutes, which is also how long a rollback takes, since a rollback is just another roll.',
      },
      {
        title: 'Blue-green keeps the old version alive',
        description:
          'Instead of replacing instances in place you stand up a complete second environment at full size, run smoke tests against it directly, then change the load balancer weight from 100/0 to 0/100. Rollback is the same weight change in reverse and takes seconds, because the old environment is still running and warm. The price is exact and unavoidable: for the overlap window you pay for 120 instances instead of 60.',
      },
      {
        title: 'A canary learns from a small slice of real traffic',
        description:
          'Route 1% of requests — 20 per second out of 2,000 — to a small pool running the new version, and compare its error rate, latency, and saturation against a control pool running the old version under the same conditions. After fifteen minutes you have around 18,000 requests, enough to distinguish a 0.1% baseline error rate from 0.6% with confidence. If the comparison passes you widen to 5%, 25%, then 100%; if it fails, the weight goes to zero and no more than a fraction of a percent of users ever saw the bad build.',
      },
      {
        title: 'Feature flags separate deploying from releasing',
        description:
          'The new code path ships to production disabled, so the deploy carries no behavioural risk, and the behaviour is then enabled at runtime for internal users, then one percent, then everyone. Because the toggle is a configuration read rather than a rollout, disabling it takes effect in seconds and works even when the problem is only visible for one customer segment. This is also the only mechanism that gives you a genuine kill switch for a dependency you cannot redeploy quickly.',
      },
      {
        title: 'Shadow traffic tests without exposure',
        description:
          'For a rewrite or a storage engine change, mirror live requests to the new version and throw its responses away, so it experiences the real distribution of payloads, cache behaviour, and concurrency without any user depending on it. The critical detail is side effects: the shadow path must not send emails, charge cards, or write to the production database, so writes go to a copy or are stubbed. Compare its latency and error rate against the primary, and you learn what no synthetic load test will tell you.',
      },
      {
        title: 'The mechanics that make all of them work',
        description:
          'None of the above is safe without instance-level care. Readiness gating keeps a starting instance out of the pool until its caches and connections are ready, so you do not shift traffic onto a cold process. Draining removes an instance from the pool, waits for callers to notice, then lets in-flight requests finish within a grace period longer than your slowest normal request — a PreStop hook with a five second sleep is the usual implementation. Sticky sessions actively fight this, because a session pinned to an instance either breaks when it is replaced or holds the deploy up.',
      },
    ],
    deepDives: [
      {
        title: 'Rolling update arithmetic',
        body:
          'The two knobs determine both speed and risk. maxUnavailable is how much capacity you are willing to lose during the roll: setting it to zero means the new instance must be ready before an old one is removed, which is the safe default and requires surge headroom. maxSurge is how many extra instances may exist, which sets the batch size and therefore the duration. Sixty instances with a 25% surge is four batches of fifteen; if each batch costs ninety seconds of startup, readiness probing, and draining, the roll takes about six minutes. A 10% surge would be ten batches and roughly fifteen minutes. The number matters operationally because it is also your rollback time under this strategy, and because a fifteen minute roll means fifteen minutes with two versions live — which is fifteen minutes during which your database schema must satisfy both.',
      },
      {
        title: 'Blue-green makes rollback a weight change',
        body:
          'The defining property is not the second environment; it is that the previous version stays running and warm while the new one takes traffic. Rollback is therefore an edit to a routing weight that takes effect in seconds, with no image pull, no process start, and no cold cache, which is a fundamentally different risk profile from a rolling deploy where reverting means another six minute roll. Two details are commonly missed. First, the old environment must keep receiving enough traffic or health checking to stay genuinely warm, otherwise the rollback lands on cold connection pools and JIT-cold code. Second, the switch is not instant for existing connections: long-lived websockets and gRPC streams stay on the old environment until they are closed, so the overlap really ends when the last connection drains, not when the weight changes.',
      },
      {
        title: 'Canary analysis needs a control and a sample size',
        body:
          'Comparing the canary against the fleet baseline is a mistake, because the canary is newly started and therefore has cold caches, fresh connection pools, and a different instance age than everything it is measured against. The correct comparison is against a control pool deployed at the same moment with the old version, receiving the same slice of traffic, so version is the only difference. Sample size then decides how long you must wait: distinguishing a 0.1% error rate from 0.6% needs on the order of ten thousand requests, which at 20 requests per second is about fifteen minutes. Choose the metrics in advance — error ratio, p99 latency, and one saturation signal such as CPU or queue depth — and define the failure threshold before you start, otherwise the analysis becomes a human staring at a graph and deciding what they hoped to see.',
      },
      {
        title: 'Feature flags and the debt they accumulate',
        body:
          'A flag turns a deploy into a no-op and a release into a configuration change, which is the single largest reduction in deploy risk available, and it enables things no deploy strategy can: enabling a behaviour for one customer, disabling an expensive code path during an incident, running an A/B experiment. The cost is combinatorial complexity in the code. Every flag doubles the number of paths that theoretically need testing, two interacting flags give four states, and a flag left in place for a year becomes load-bearing configuration that nobody dares remove. The discipline is to treat every release flag as temporary with an owner and an expiry date, to remove it in the sprint after the rollout completes, and to keep long-lived operational kill switches in a separate, explicitly permanent category.',
      },
      {
        title: 'Expand, migrate, contract',
        body:
          'Because two versions run at once, any schema change must be readable and writable by both, which rules out renaming or dropping anything in a single step. The three-phase pattern handles it. Expand: add the new column as nullable, or add the new table, and deploy code that writes both the old and the new shape while still reading the old one. Migrate: backfill existing rows in batches, then deploy code that reads the new shape and falls back to the old. Contract: once no running version reads the old column and the backfill is verified, stop writing it and drop it in a later release. Renaming a column in place instead means every request served by the version that does not know about the rename fails, which for a six minute roll is six minutes of errors on a fraction of traffic that grows as the roll proceeds.',
      },
      {
        title: 'Stateful services break the model',
        body:
          'Stateless instances are interchangeable, which is what makes replacing them safe. A database replica, a Kafka broker, or a sharded cache node is not: it owns data, it has a stable identity, and other members hold opinions about it. Replacement must therefore be ordered and one at a time — Kubernetes StatefulSets exist precisely to give ordinal identity and sequential rollout — and each step must wait for the member to rejoin, catch up its log, and be confirmed in sync before the next one starts, which can take minutes per node. Leader-holding members should be stepped down deliberately before restart so the failover is planned rather than detected. Blue-green does not translate at all, because you cannot duplicate the data cheaply, so rollback for stateful systems means restoring from a snapshot rather than shifting a weight, and that changes the risk calculation for every schema change you make.',
      },
    ],
    tradeoffs: [
      'Blue-green gives seconds of rollback and costs double capacity for the overlap.',
      'A longer canary detects smaller regressions and slows every release down.',
      'Feature flags remove deploy risk and add branching complexity that never fully disappears.',
      'A larger rolling batch finishes faster and exposes more traffic to a bad version at once.',
    ],
    bottlenecks: [
      'Readiness probes that pass before the instance is genuinely warm, so each batch causes a latency spike.',
      'Long-lived connections and sticky sessions that refuse to drain and stall the roll.',
      'A slow backfill making the migrate phase the longest part of a release.',
      'Insufficient surge capacity, forcing maxUnavailable above zero and losing throughput during every deploy.',
    ],
    scalingPath: [
      { scale: 'Prototype', focus: 'A rolling update with maxUnavailable zero, a real readiness probe, and a tested manual rollback' },
      { scale: 'One region', focus: 'Canary with a control pool and automated metric analysis, feature flags for risky behaviour, expand-migrate-contract for every schema change' },
      { scale: 'Global', focus: 'Progressive rollout region by region, automated rollback on SLO burn rate, shadow traffic for rewrites, ordered rollouts for stateful members' },
    ],
    interviewScript: [
      '"Two versions will be live at once, so the schema and the API have to satisfy both — that constrains the change before it constrains the strategy."',
      '"Rolling with maxUnavailable zero is my default: sixty instances at a 25% surge is four batches and about six minutes."',
      '"For a risky release I want rollback to be a weight change, so canary or blue-green, not another six minute roll."',
      '"The canary is compared against a control pool of the same age, not against the fleet baseline."',
      '"Every instance fails readiness, waits for propagation, drains in-flight requests, then exits — that is what removes deploy-time 502s."',
      '"Schema changes go expand, migrate, contract; I never rename a column in a single release."',
    ],
    commonMistakes: [
      'Rolling out a schema rename in one step while two code versions are live.',
      'Comparing a canary against the fleet baseline instead of an equally fresh control pool.',
      'Treating a passing readiness probe as proof the instance is warm.',
      'Terminating instances without draining, then attributing the 502s to the load balancer.',
      'Leaving release flags in the codebase for a year until nobody knows what turning one off does.',
      'Applying blue-green thinking to a stateful system where rollback means restoring a snapshot.',
    ],
    relatedTopics: ['service-discovery', 'reliability', 'observability', 'load-balancer'],
    examples: [
      'Netflix Spinnaker with Kayenta runs automated canary analysis against a control pool rather than a baseline',
      'Argo Rollouts implements weighted canary and blue-green on Kubernetes by editing service selectors and mesh weights',
      'GitHub Scientist popularised shadowing a refactor in production and comparing results without exposing them',
    ],
    practicePrompt:
      'Plan the release of a change that renames a column, for a service on sixty instances at 2,000 requests per second, with no user-visible errors at any point.',
    followUps: [
      {
        question: 'How long does a rolling update take, and why does it matter?',
        answer:
          'It is the number of batches times the time per batch: sixty instances at a 25% surge is four batches, and at ninety seconds each for startup, readiness, and draining that is about six minutes. It matters because it is also your rollback time under this strategy, and because it defines how long two versions are live and therefore how long your schema and API must satisfy both.',
        category: 'Rolling',
        difficulty: 'easy',
      },
      {
        question: 'What do maxSurge and maxUnavailable control?',
        answer:
          'maxSurge is how many instances above the desired count may exist during the roll, which sets the batch size and hence the duration. maxUnavailable is how much capacity you accept losing; setting it to zero means a new instance must be ready before an old one is removed, which avoids a capacity dip but requires surge headroom. Zero unavailable with a modest surge is the safe default for a stateless service.',
        category: 'Rolling',
        difficulty: 'medium',
      },
      {
        question: 'Why is blue-green rollback so much faster?',
        answer:
          'Because the previous version never stopped running. Rollback is an edit to a routing weight that takes effect in seconds, with no image pull, no process start, and no cold caches, whereas rolling back a rolling deploy is a second full roll. The caveats are that the idle environment must stay warm to be a credible rollback target, and that long-lived connections remain on the old side until they close.',
        category: 'Blue-green',
        difficulty: 'medium',
      },
      {
        question: 'Why must a canary be compared against a control pool?',
        answer:
          'Because a freshly started canary differs from the running fleet in ways that have nothing to do with the code: cold caches, new connection pools, empty JIT profiles, and a different instance age. Comparing it to the fleet baseline attributes all of that to the new version. Deploying a control pool of the old version at the same time, receiving the same traffic slice, isolates version as the only variable.',
        category: 'Canary',
        difficulty: 'hard',
      },
      {
        question: 'How long should a canary run?',
        answer:
          'Long enough to collect a statistically meaningful sample for the regression size you care about. Distinguishing a 0.1% baseline error rate from 0.6% takes on the order of ten thousand requests, which at 1% of 2,000 requests per second is roughly fifteen minutes. If you also care about behaviour that only appears under a daily traffic peak or a slow memory leak, the canary has to span that window rather than a fixed fifteen minutes.',
        category: 'Canary',
        difficulty: 'hard',
      },
      {
        question: 'Why is expand-migrate-contract necessary?',
        answer:
          'Because two code versions run against the same database for the duration of the deploy, so the schema must be valid for both. Expand adds the new column and writes both shapes; migrate backfills and switches reads to the new shape with a fallback; contract stops writing and drops the old column in a later release. A single-step rename fails every request handled by whichever version does not know about it, for the full length of the roll.',
        category: 'Migration',
        difficulty: 'medium',
      },
      {
        question: 'What exactly is connection draining?',
        answer:
          'It is the ordered shutdown that stops new work reaching an instance before the instance stops accepting it. The instance is removed from the load balancer pool or fails readiness, then waits long enough for callers and dataplanes to observe the removal — a PreStop hook with a short sleep — then stops accepting new connections while in-flight requests complete inside a grace period longer than the slowest normal request. Skipping the wait is the usual cause of errors during otherwise healthy deploys.',
        category: 'Safety',
        difficulty: 'medium',
      },
      {
        question: 'How do sticky sessions interfere with deploys?',
        answer:
          'A session pinned to a specific instance cannot be moved, so replacing that instance either breaks the session or forces the deploy to wait for it to expire, which can be thirty minutes. Long sessions therefore either extend every roll or produce user-visible failures. The fix is to make instances stateless by moving session state into a shared store such as Redis, or into a signed token held by the client, so any instance can serve any request.',
        category: 'Safety',
        difficulty: 'medium',
      },
      {
        question: 'What triggers an automated rollback?',
        answer:
          'A defined regression in a small set of pre-agreed signals: error ratio versus the control, p99 latency, and an SLO burn rate that indicates the release is consuming the error budget far faster than sustainable. The thresholds and the observation window must be set before the release, and the action should be automatic, because the value comes from reacting within a minute rather than after someone reads a dashboard. Anything that fires often enough to be routinely overridden is mis-tuned.',
        category: 'Rollback',
        difficulty: 'hard',
      },
      {
        question: 'Why are stateful services deployed differently?',
        answer:
          'Because their instances are not interchangeable: each owns data, has a stable identity, and other cluster members depend on it. Rollout must be sequential, with each member rejoining and catching up its replication log before the next restart, which can be minutes per node, and any leader should be stepped down deliberately first. Blue-green does not apply, since the data cannot be cheaply duplicated, so rollback means a snapshot restore rather than a weight change.',
        category: 'Stateful',
        difficulty: 'hard',
      },
    ],
  }),
};
