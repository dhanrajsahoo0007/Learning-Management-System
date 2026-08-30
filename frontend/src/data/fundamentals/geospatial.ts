import { ArchitectureTopic, emptyContent } from '../systemDesignTypes';

export const geospatialTopic: ArchitectureTopic = {
  id: 'geospatial',
  title: 'Geospatial Indexing',
  description: 'Why a bounding box cannot use an ordinary index, how geohash and S2 turn a sphere into sortable keys, and why every radius query touches nine cells.',
  difficulty: 'Intermediate',
  progress: 0,
  icon: 'Target',
  color: 'bg-pink-700',
  section: 'fundamentals',
  track: 'classic',
  prerequisites: ['sharding'],
  estimatedMinutes: 70,
  order: 20,
  content: emptyContent({
    overview:
      'Geospatial indexing is the trick of collapsing two dimensions into one so that an ordinary sorted index can answer "what is near me". Every practical scheme — geohash, S2, quadtree, R-tree — does the same two-phase job: a cheap coarse scan over cells that might contain matches, then an exact distance filter in the application. The interesting parts are the edges between cells and the cells that get too hot.',
    whyItExists:
      'A B-tree can answer a range on one column, but proximity is a range on two columns at once, and no composite index can serve both. Space-filling curves give you a single sortable key whose ordering approximately preserves physical closeness, which is enough to make the problem indexable.',
    problemStatement: {
      prompt:
        'A rider opens the app and needs the drivers within two kilometres, ranked by distance, in under 100 milliseconds. There are 200,000 active drivers, each reporting a new position every four seconds. Design the index that answers the proximity query and survives the write rate.',
      inScope: [
        'Why a two-column B-tree cannot serve a bounding box',
        'Geohash, S2 cells, quadtrees, and R-trees',
        'Neighbour scanning and the exact distance filter',
        'Hot cells in dense areas and high-churn moving objects',
      ],
      outOfScope: [
        'Map rendering, tiles, and cartographic projections',
        'Routing and turn-by-turn path finding',
        'Map matching raw GPS traces to road segments',
        'Geofence event pipelines and their delivery semantics',
      ],
    },
    assumptions: [
      'Positions arrive as WGS84 latitude and longitude pairs with metre-level accuracy',
      'Reads outnumber writes for static points of interest; writes dominate for moving vehicles',
      'A query is "within a radius" or "the k nearest", never an arbitrary polygon',
    ],
    whenToUse: [
      'Nearby search over points of interest: restaurants, stores, charging points',
      'Matching moving supply to demand, such as drivers to riders or couriers to orders',
      'Sharding a dataset by region so a query touches one or two partitions instead of all of them',
    ],
    functionalRequirements: [
      { title: 'Radius query', detail: 'Return every point within r metres of a centre, with r ranging from 200 m to 50 km.' },
      { title: 'k nearest neighbours', detail: 'Return the closest k points ordered by true distance, not by cell order.' },
      { title: 'Position update', detail: 'Move an existing object to a new cell cheaply, without rebuilding an index.' },
      { title: 'Bounding box query', detail: 'Return everything inside the rectangle the user currently has on screen.' },
    ],
    nonFunctionalRequirements: [
      { title: 'Read latency', detail: 'Under 100 ms at p99 for a two kilometre radius in the densest city.' },
      { title: 'Write throughput', detail: 'Absorb 50,000 position updates per second without index write amplification.' },
      { title: 'Accuracy', detail: 'No false negatives: a point inside the radius must never be missed at the cell boundary.' },
      { title: 'Even load', detail: 'One dense downtown cell must not become 40 times the work of an average cell.' },
    ],
    estimates: [
      { label: 'Geohash precision 6 cell', value: '1.2 km x 0.6 km', note: 'About 0.7 km2 — the usual choice for a 1-2 km radius' },
      { label: 'Cells scanned per radius query', value: '9', note: 'Centre cell plus 8 neighbours; scanning only the centre can miss half the ring' },
      { label: 'Driver update rate', value: '200k drivers / 4 s = 50k writes/s', note: 'Each write is one sorted-set update, not a B-tree page split' },
      { label: 'Redis GEO memory', value: '1M members ≈ 90 MB', note: 'One sorted-set entry with a short member id costs roughly 90 bytes' },
      { label: 'Candidates before haversine', value: '9 cells x 450 = ~4,000 rows', note: 'Filtered down to roughly 60 true matches in the application' },
    ],
    concepts: [
      'Two-dimensional range is not a B-tree range',
      'Space-filling curves: Z-order and Hilbert',
      'Geohash base32 and prefix containment',
      'S2 cells and cell levels',
      'Quadtree adaptive subdivision',
      'R-tree and GiST bounding boxes',
      'Neighbour scan and the edge problem',
      'Haversine as the exact filter',
    ],
    comparisons: [
      {
        title: 'Ways to index a point on the earth',
        headers: ['Scheme', 'How it works', 'Use when', 'Avoid when'],
        rows: [
          [
            'Geohash',
            'Interleaves the bits of latitude and longitude, then base32-encodes them, so a shared prefix means a shared cell',
            'You need a plain string key that any database can index, sort, and shard on',
            'Cell shape distortion near the poles or the meridian seams matter to you',
          ],
          [
            'S2 cells',
            'Projects the sphere onto six cube faces and orders each face along a Hilbert curve, giving a 64-bit cell id per level',
            'You want better locality, true spherical geometry, and cheap region covering',
            'You need a human-readable key or a library-free implementation',
          ],
          [
            'Quadtree',
            'Recursively splits a square into four children only where the point density is high',
            'Density is very uneven — an empty ocean beside a dense city centre',
            'The tree lives on one machine and the write rate churns its shape constantly',
          ],
          [
            'R-tree',
            'Groups nearby objects into nested minimum bounding rectangles that the search prunes against',
            'You index shapes and polygons, not only points, and need real intersection queries',
            'Write-heavy workloads — rebalancing bounding boxes on every insert is expensive',
          ],
          [
            'PostGIS GiST',
            'An R-tree variant inside Postgres, with ST_DWithin and KNN operators planned by the database',
            'Your data already lives in Postgres and you want SQL joins against it',
            'You need millions of position updates per second on the same rows',
          ],
        ],
        note: 'All five are coarse filters. Every one of them is followed by an exact distance computation on the candidate set.',
      },
    ],
    architecture:
      'Each object is reduced to a single cell key — a geohash string or an S2 cell id — and stored in an index that sorts on that key. A radius query converts the centre point into the cell that contains it at a precision slightly larger than the radius, computes that cell and its eight neighbours, and range-scans each prefix. The application then applies haversine to the returned candidates, discards the ones outside the true circle, and sorts what is left.',
    diagrams: [
      { id: 'cells', title: 'A radius spans more than one cell', kind: 'excalidraw', src: 'geohash-neighbors' },
      { id: 'anim', title: 'Cells covering a radius', kind: 'animation', src: 'geohash' },
    ],
    walkthrough: [
      {
        title: 'The naive query is rejected first',
        description:
          'A query of the form WHERE lat BETWEEN 12.90 AND 12.94 AND lng BETWEEN 77.58 AND 77.62 looks like it should use an index on (lat, lng), and it does — but only for the first column. The engine seeks to the start of the latitude band and then scans every row in it, because longitude is unordered inside a latitude range. In a city with a million points that is hundreds of thousands of rows read to return forty.',
      },
      {
        title: 'Interleave the bits into one key',
        description:
          'Geohash converts latitude and longitude into binary by repeated halving of their ranges, then interleaves the two bit streams — one longitude bit, one latitude bit — and base32-encodes the result. The output is a string such as tdr1vy where every extra character adds five bits and narrows the box. Because the encoding is hierarchical, a prefix is containment: everything inside tdr1v starts with tdr1v.',
        animation: 'geohash',
      },
      {
        title: 'Choose the precision from the radius',
        description:
          'Five characters gives a cell about 4.9 km across, six gives roughly 1.2 km by 0.6 km, and seven gives about 150 m. Pick the shortest prefix whose cell is at least as large as the query radius, so a two kilometre search uses precision 5 and a three hundred metre search uses precision 6. Choosing too fine a precision means covering the circle with hundreds of cells instead of nine.',
      },
      {
        title: 'Scan the centre cell and its eight neighbours',
        description:
          'A circle almost never sits inside one cell, and two points thirty metres apart can fall either side of a boundary and share no prefix at all. The query therefore computes the eight adjacent cells arithmetically from the centre cell and issues nine prefix range scans, or one scan per cell key in a key-value store. Skipping the neighbours is the single most common bug in this design, and it fails silently by returning too few results.',
      },
      {
        title: 'Filter exactly with haversine',
        description:
          'The nine cells form a rough square roughly 3.6 km on a side for precision 6, which is larger than the requested circle, so the candidate set contains points that are genuinely too far away. Haversine gives the great-circle distance between two latitude and longitude pairs and costs a handful of floating point operations, so running it over four thousand candidates is trivial. Only after this filter can results be ranked by distance.',
      },
      {
        title: 'Keep moving objects in a separate store',
        description:
          'A driver reporting every four seconds rewrites its cell key 21,600 times a day, which would shred a disk-backed R-tree with page splits and vacuum pressure. Moving objects belong in an in-memory structure such as a Redis GEO sorted set where an update is a single ZADD, while static points of interest stay in PostGIS where the index is built once and read constantly. The two stores answer the same shape of question with opposite write profiles.',
      },
    ],
    deepDives: [
      {
        title: 'Why a composite B-tree fails at two dimensions',
        body:
          'A B-tree is a total order over one key. An index on (lat, lng) sorts primarily by latitude, so all the points at 12.91 degrees are contiguous regardless of whether they sit in Bangalore or in Africa on the same parallel. A bounding box query can use the latitude predicate to seek, but the longitude predicate becomes a filter applied to every row in that band. With a million rows spread over one degree of latitude, a 0.04 degree band still holds around 40,000 rows, all of which are read and mostly discarded. Space-filling curves fix this by producing one key whose sort order interleaves both dimensions, so physical neighbours are usually index neighbours.',
      },
      {
        title: 'The edge problem is not an edge case',
        body:
          'Geohash prefixes give containment but not proximity. A point at the western edge of cell tdr1v and a point ten metres away in tdr1t share only the prefix tdr1, and at the crossing of a major boundary they may share nothing beyond the first character. For a uniformly distributed query centre, the probability that the requested circle lies entirely inside one precision-6 cell is small — the cell is 1.2 km by 0.6 km and a 500 m radius circle is 1 km across, so most queries straddle at least one boundary. The mechanical fix is always the same: compute the eight neighbours and scan all nine. The cost is nine index seeks instead of one, which is cheap compared to being wrong.',
      },
      {
        title: 'S2 and the Hilbert curve',
        body:
          'S2 projects the sphere onto the six faces of a circumscribed cube, then walks each face with a Hilbert curve rather than the Z-order curve geohash uses. The Hilbert curve has a stronger locality property: consecutive positions on the curve are always adjacent in space, whereas the Z-order curve makes long jumps at power-of-two boundaries, which is exactly what produces geohash seams. S2 cell ids are 64-bit integers at 31 levels of granularity, a level 12 cell being roughly three square kilometres, and the library can compute a minimal covering of an arbitrary region as a handful of cells at mixed levels. That covering is the real advantage — instead of nine equal cells you get a tight set that matches the query shape.',
      },
      {
        title: 'Hot cells in a dense downtown',
        body:
          'Cell size is fixed but density is not. A precision-6 cell over farmland may hold zero drivers while the same cell over a city centre at rush hour holds four thousand, so a scan that is instant in one place is 40 times slower in another, and if the cell key is also the shard key that shard receives 40 times the write traffic. Three mitigations exist and they compose. Use a finer precision in dense regions so the cell splits, which is exactly what a quadtree does automatically. Cap the number of results read per cell and accept an approximate answer, which is acceptable when you only need twenty nearby drivers. Or add a salt to the shard key so a single cell spreads across several partitions, at the cost of querying all of them.',
        animation: 'hot-cell',
      },
      {
        title: 'Quadtrees adapt, R-trees generalise',
        body:
          'A quadtree splits a square into four children whenever a node exceeds a capacity threshold, so subdivision follows density and every leaf holds a bounded number of points. That makes query cost predictable regardless of where the user is, and it is why dense-city dispatch systems favour it. The price is a mutable tree structure: high churn from moving objects triggers constant splits and merges, and the tree is awkward to distribute because its shape is global state. An R-tree instead groups objects into nested minimum bounding rectangles, which lets it index polygons and lines rather than only points, and lets the planner prune whole subtrees that cannot intersect the query. R-trees are what PostGIS GiST indexes actually are, and they are read-optimised.',
      },
      {
        title: 'Moving objects versus static points',
        body:
          'The two workloads look identical in the query and opposite in the write path. Two hundred thousand drivers updating every four seconds is 50,000 writes per second of pure position churn where the previous value has no lasting worth, so the right store is memory-resident, has no durability requirement beyond a few seconds, and can express an update as one operation — a Redis GEO sorted set backed by a geohash score, or a sharded in-memory grid. Restaurants move roughly never, so their index can be a PostGIS GiST index that is expensive to build, joins to menus and reviews, and survives a restart. Designing one store for both is the mistake: you either pay disk write amplification for ephemeral data or lose durability for data you need.',
      },
    ],
    tradeoffs: [
      'Coarser cells mean fewer scans and more candidates to filter; finer cells mean the opposite.',
      'Geohash is a portable string any database can index; S2 has better locality but needs a library on every reader.',
      'A fixed grid is simple and produces hot cells; an adaptive quadtree balances load and adds mutable shared structure.',
      'In-memory geo indexes absorb position churn but lose data on failure unless you also persist elsewhere.',
    ],
    bottlenecks: [
      'A single dense cell whose scan dominates p99 latency for every query in that city.',
      'Position update write amplification against a disk-backed spatial index.',
      'Nine range scans per query multiplying the round trips to a remote store.',
      'Large-radius queries that degrade into a covering of hundreds of cells.',
    ],
    scalingPath: [
      { scale: 'Prototype', focus: 'PostGIS with a GiST index and ST_DWithin — correct, SQL-joinable, and enough to a few thousand queries per second' },
      { scale: 'One region', focus: 'Redis GEO sorted sets for moving objects, PostGIS for static points, precision chosen per query radius' },
      { scale: 'Global', focus: 'Shard by S2 cell prefix with per-city capacity, split hot cells to a finer level, and keep an exact haversine filter at the edge' },
    ],
    interviewScript: [
      '"A bounding box on lat and lng cannot use a composite B-tree, because the second column is unordered inside a range on the first."',
      '"I will reduce each point to one geohash key, so a shared prefix means a shared cell and an ordinary sorted index works."',
      '"Precision 6 is about 1.2 by 0.6 kilometres, so I pick the shortest prefix that covers the radius."',
      '"A circle straddles boundaries, so I scan the centre cell plus its eight neighbours — never just the centre."',
      '"Cells are a coarse filter; haversine over the four thousand candidates gives the exact set and the ranking."',
      '"Drivers churn 50,000 writes a second, so they live in Redis GEO, while restaurants stay in PostGIS."',
    ],
    commonMistakes: [
      'Scanning only the centre cell and silently missing points just over the boundary.',
      'Returning cell-ordered results as if they were distance-ordered.',
      'Choosing a precision far finer than the radius and covering the circle with hundreds of cells.',
      'Assuming a fixed grid distributes load evenly when density varies by two orders of magnitude.',
      'Putting high-frequency driver position updates into a disk-backed R-tree.',
      'Using Euclidean distance on raw degrees, which is wrong by the cosine of the latitude.',
    ],
    relatedTopics: ['sharding', 'databases', 'caching', 'tinder', 'uber'],
    examples: [
      'Uber uses H3, a hexagonal hierarchical grid, because hexagons have uniform neighbour distance unlike squares',
      'Redis ships GEOADD and GEOSEARCH implemented as a sorted set scored by a 52-bit geohash',
      'MongoDB 2dsphere and Elasticsearch geo_point both build on S2 cell coverings under the hood',
    ],
    practicePrompt:
      'Design the nearby-driver query for a city with 8,000 active drivers packed into four square kilometres, and state the cell precision, the number of scans, and the expected candidate count.',
    followUps: [
      {
        question: 'Why can a composite index on (lat, lng) not answer a bounding box efficiently?',
        answer:
          'Because a B-tree imposes a single total order and sorts by latitude first. The engine can seek to the start of the latitude range, but within that range longitude values appear in arbitrary order, so the longitude predicate degrades into a row-by-row filter. You end up reading every point on the same band of parallel, most of which are thousands of kilometres away.',
        category: 'Fundamentals',
        difficulty: 'easy',
      },
      {
        question: 'What exactly is the edge problem, and how do you fix it?',
        answer:
          'Geohash prefixes guarantee containment but not proximity: two points thirty metres apart can sit either side of a cell boundary and share almost no prefix. If you scan only the cell containing the query centre you silently drop everything just outside it. The fix is to compute the eight adjacent cells arithmetically and range-scan all nine, then let the exact distance filter discard the extra area.',
        category: 'Mechanics',
        difficulty: 'medium',
      },
      {
        question: 'How do you choose geohash precision?',
        answer:
          'Match the cell size to the query radius so the nine-cell block comfortably contains the circle. Precision 5 is about 4.9 km across, precision 6 is roughly 1.2 km by 0.6 km, and precision 7 is about 150 m, so a 1 km radius wants precision 6 and a 5 km radius wants precision 5. Going finer than the radius forces you to enumerate a large covering set; going coarser inflates the candidate set you must filter.',
        category: 'Mechanics',
        difficulty: 'medium',
      },
      {
        question: 'Why is S2 preferred over geohash at large scale?',
        answer:
          'S2 orders cells along a Hilbert curve rather than a Z-order curve, and the Hilbert curve keeps consecutive curve positions physically adjacent, so it has no equivalent of the geohash seams at power-of-two boundaries. It also works on a projected sphere rather than a rectangular lat-lng plane, so cells stay comparable in area away from the equator, and it can compute a minimal mixed-level covering of an arbitrary region instead of a fixed nine-cell block.',
        category: 'Mechanics',
        difficulty: 'hard',
      },
      {
        question: 'What is the hot cell problem and how would you handle it?',
        answer:
          'Cells are geometrically uniform but population is not, so one cell over a city centre can hold thousands of objects while its neighbours hold none, making both scan cost and shard write load wildly uneven. Subdividing that region to a finer precision restores a bounded object count per cell, which is what a quadtree does automatically. Where an approximate answer is acceptable you can also cap reads per cell, and where the cell is also the shard key you can salt it across several partitions.',
        category: 'Scaling',
        difficulty: 'hard',
      },
      {
        question: 'Why do you still need haversine after the cell scan?',
        answer:
          'The nine-cell block is a square that circumscribes the requested circle, so a meaningful fraction of the candidates are outside the radius, particularly at the corners. Haversine computes the great-circle distance between two latitude and longitude pairs and costs only a few floating point operations, so filtering four thousand candidates is negligible. It also gives you the distance value needed to rank the results, which the cell key cannot.',
        category: 'Mechanics',
        difficulty: 'easy',
      },
      {
        question: 'When would you use a quadtree instead of a fixed grid?',
        answer:
          'When density varies by orders of magnitude across your coverage area. A quadtree splits a node into four children once it exceeds a capacity threshold, so leaves hold a bounded number of points and query cost is roughly constant whether the user is downtown or in a suburb. The trade is a mutable global tree structure that is harder to distribute and that churns under a high rate of position updates.',
        category: 'Design',
        difficulty: 'medium',
      },
      {
        question: 'How do you serve k nearest neighbours rather than a radius query?',
        answer:
          'Start with a radius guess based on expected density, run the nine-cell scan, and if fewer than k results survive the distance filter, expand to a coarser precision or a wider ring and repeat. Because expansion is geometric you converge in one or two iterations for reasonable guesses. PostGIS and S2 offer better primitives — a GiST KNN operator or an incremental cell-by-cell expansion ordered by minimum possible distance — which avoid re-scanning the inner cells.',
        category: 'Mechanics',
        difficulty: 'hard',
      },
      {
        question: 'Where does the geo index sit relative to your shards?',
        answer:
          'Usually the cell prefix is the shard key, because it keeps physically nearby data on the same node and lets a query touch one or two partitions. The consequence is that geography drives your load distribution, so a shard covering Manhattan carries far more traffic than one covering Wyoming and must be split at a finer cell level. Cross-shard queries appear whenever the nine-cell block spans a partition boundary, so plan for scatter-gather at the edges.',
        category: 'Sharding',
        difficulty: 'hard',
      },
      {
        question: 'Why do driver locations and restaurant locations use different stores?',
        answer:
          'They share a query shape and have opposite write profiles. Two hundred thousand drivers reporting every four seconds is 50,000 writes per second of data that is worthless a minute later, which suits an in-memory sorted set where an update is one operation and durability barely matters. Restaurant coordinates change almost never but need joins to menus, ratings, and opening hours, which suits a PostGIS GiST index built once and read constantly.',
        category: 'Design',
        difficulty: 'medium',
      },
    ],
  }),
};
