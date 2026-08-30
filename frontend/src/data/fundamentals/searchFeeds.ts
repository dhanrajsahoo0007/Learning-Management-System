import { ArchitectureTopic, emptyContent } from '../systemDesignTypes';

export const searchFeedsTopic: ArchitectureTopic = {
  id: 'search-feeds',
  title: 'Search and Feeds',
  description:
    'Inverted indexes and posting list intersection, then fan-out on write versus on read — why both are derived data and never a query against the posts table.',
  difficulty: 'Intermediate',
  progress: 0,
  icon: 'Newspaper',
  color: 'bg-rose-600',
  section: 'fundamentals',
  track: 'classic',
  prerequisites: ['databases', 'caching'],
  estimatedMinutes: 75,
  order: 18,
  content: emptyContent({
    overview:
      'Search and feeds look like different products and are the same architectural idea twice: a read pattern that the source-of-truth table cannot serve, so you build a second structure shaped for the query. Search inverts the corpus so a term points at the documents containing it, and answers a multi-word query by intersecting those lists. A feed inverts the follow graph so a user points at the posts they should see, and the only real decision is whether that inversion happens when the post is written or when the feed is read.',
    whyItExists:
      'A relational query cannot rank by text relevance and cannot cheaply sort the union of 200 followees by time, because both require touching and ordering far more rows than the answer contains. Both problems are solved by precomputing a structure whose natural order is the answer order.',
    problemStatement: {
      prompt:
        'A social product has 300 million users, 100 million posts, and accounts ranging from 500 followers to 50 million. Design full-text search over the posts, typeahead over user names, and the home timeline. Say precisely where each read is served from, what is precomputed, and what happens when a 50-million-follower account posts.',
      inScope: [
        'The inverted index, posting lists, intersection, and skip pointers',
        'Analysers, scoring with TF-IDF and BM25, and faceting',
        'Typeahead as a separate prefix or n-gram index',
        'Fan-out on write, fan-out on read, the hybrid, and feed pagination',
      ],
      outOfScope: [
        'Embedding and vector similarity search, which belongs to the AI track',
        'Ranking model training and feature stores',
        'Crawling and link analysis such as PageRank',
        'Elasticsearch cluster operations and shard allocation tuning',
      ],
    },
    assumptions: [
      'The posts table in Postgres is the source of truth and both the search index and the timelines are rebuildable from it',
      'A user follows around 200 accounts and reads roughly 30 items per session',
      'Reads outnumber writes by about 100 to 1, so paying more on the write path is usually the right trade',
    ],
    whenToUse: [
      'Free-text queries with relevance ranking, where a LIKE query cannot use an index',
      'A personalised list assembled from many producers, such as a home timeline or a notification inbox',
      'Typeahead and autocomplete, where the answer must arrive within a keystroke',
    ],
    functionalRequirements: [
      { title: 'Multi-term search', detail: 'Match all query terms, rank by relevance, and highlight the matched text.' },
      { title: 'Faceted filtering', detail: 'Return counts per language, per author type, and per date bucket alongside the results.' },
      { title: 'Typeahead', detail: 'Complete a partial name within a keystroke, tolerating a transposed character.' },
      { title: 'Home timeline', detail: 'Return the newest 30 items across everyone a user follows, with stable pagination.' },
    ],
    nonFunctionalRequirements: [
      { title: 'Read latency', detail: 'p99 under 200 ms for search, under 100 ms for typeahead, under 100 ms for a timeline page.' },
      { title: 'Freshness', detail: 'A new post is searchable within about a second and visible in followers timelines within a few seconds.' },
      { title: 'Write amplification', detail: 'One post from a 50-million-follower account must not create 50 million synchronous writes.' },
      { title: 'Rebuildability', detail: 'The entire index and every timeline can be regenerated from the posts table within hours.' },
    ],
    estimates: [
      { label: 'Index size', value: '100M docs × ~200 terms ≈ 20B postings', note: 'At about 4 bytes per delta-compressed document id that is roughly 80 GB before positions' },
      { label: 'AND intersection', value: '1M-entry list ∩ 5k-entry list', note: 'Skip pointers turn 1M steps into about 5k × log2(1M) ≈ 100k comparisons' },
      { label: 'Fan-out on write', value: '500 followers = 500 inbox writes', note: 'A 50M-follower account is 50M writes; at 100k writes/s that is 500 seconds of tail' },
      { label: 'Fan-out on read', value: '200 followees × 1 query', note: '2 ms each is 400 ms serial, about 25 ms with 20-way parallelism, per feed load' },
      { label: 'Timeline cache', value: '300M users × 800 ids × 8 B ≈ 1.9 TB', note: 'Store ids only and hydrate post bodies from a separate cache' },
    ],
    concepts: [
      'Inverted index: term to posting list',
      'Posting list intersection and skip pointers',
      'Analysers: tokenisation, stemming, stop words',
      'TF-IDF and BM25 scoring',
      'Faceting over doc values',
      'Prefix trie and n-gram typeahead',
      'Fan-out on write vs on read vs hybrid',
      'Derived timelines and cursor pagination',
    ],
    comparisons: [
      {
        title: 'Three ways to build a home timeline',
        headers: ['Type', 'How it works', 'Use when', 'Avoid when'],
        rows: [
          [
            'Fan-out on write (push)',
            'When a post is created, a worker looks up the author followers and appends the post id to each follower inbox list, so a feed read is one list read of 30 ids',
            'Reads dominate heavily and follower counts are bounded, as in a work chat or a small community',
            'A single account has millions of followers, which turns one post into millions of writes',
          ],
          [
            'Fan-out on read (pull)',
            'On feed load, query the newest posts from each followee, merge the sorted lists in memory, and return the top 30',
            'Writes are expensive or rare relative to reads, follower graphs are enormous, or the feed is seldom opened',
            'The feed is opened constantly, since every open costs hundreds of queries and a merge',
          ],
          [
            'Hybrid',
            'Push for ordinary accounts, mark accounts above a threshold such as 100k followers as pull-only, and merge their recent posts into the precomputed list at read time',
            'Real social products, where the follower distribution spans five orders of magnitude',
            'The graph is uniform, in which case the extra merge path is complexity with no payoff',
          ],
        ],
        note: 'The hybrid exists purely because of the tail of the follower distribution. Push is chosen for the 99.9 percent of accounts where it is cheap, and pull for the handful where it is not.',
      },
      {
        title: 'Three different indexes over the same text',
        headers: ['Index', 'How it works', 'Use when', 'Avoid when'],
        rows: [
          [
            'Full-text inverted index',
            'Analysed tokens map to posting lists of document ids with term frequencies and positions, scored by BM25 at query time',
            'Complete words, relevance ranking, phrase queries, and faceting',
            'The user has typed half a word, because "brigh" is not a token in the index',
          ],
          [
            'Prefix trie / completion index',
            'Names are stored as a tree of characters with the best completions attached to each node, so a lookup is a walk of the typed length',
            'Typeahead over a bounded set such as user names, cities, or products',
            'Matching mid-word, since a trie only answers from the start of the string',
          ],
          [
            'Edge n-gram index',
            'At index time each term is expanded into its prefixes, so "bright" also indexes br, bri, brig, brigh, and each becomes an ordinary searchable token',
            'You want prefix matching inside an existing search engine with normal scoring and filters',
            'Index size matters, because a 10-character term becomes roughly 9 extra tokens',
          ],
        ],
      },
    ],
    architecture:
      'Posts are written to Postgres, and change data capture publishes each new post to a log. One consumer analyses the text and updates the inverted index; another consumer resolves the author followers and appends the post id to each follower timeline list in Redis, skipping accounts flagged as pull-only. A feed read takes 30 ids from the precomputed list, merges in recent posts from the handful of pull-only accounts the user follows, hydrates bodies from a post cache, and returns.',
    diagrams: [
      { id: 'derive', title: 'Derived, not queried', kind: 'excalidraw', src: 'search-vs-feed' },
      { id: 'anim', title: 'Fan-out on write', kind: 'animation', src: 'fanout' },
    ],
    walkthrough: [
      {
        title: 'Prove the direct query cannot work',
        description:
          'The tempting feed query is a select over posts where author_id is in a list of 200 followees, ordered by created_at descending, limited to 30. No single index serves it well: an index on author_id finds the rows but leaves the engine to sort a potentially huge union, and an index on created_at scans backwards through everyone else in the world. This is the moment to say the sentence that governs the whole design: a timeline is derived data, not a query against the posts table.',
      },
      {
        title: 'Invert the corpus for search',
        description:
          'Run each post through an analyser that lower-cases, splits on word boundaries, drops stop words, and stems, so "The photos were brightened" becomes photo, brighten. Each resulting term owns a posting list of the document ids containing it, kept sorted, with a term frequency per document and optionally the token positions for phrase matching. The index is a map from term to that list, which is why it can answer "which documents contain brighten" without looking at any document.',
      },
      {
        title: 'Answer an AND query by intersecting',
        description:
          'A query for bright photos loads both posting lists and walks them together, advancing whichever cursor is behind, emitting a document id only when both cursors match. Because the lists are sorted, this is a linear merge, and skip pointers let the long list jump forward instead of stepping. Each surviving document is then scored by BM25 and the top results are collected in a heap of size 30, so the engine never sorts the whole match set.',
      },
      {
        title: 'Add facets and typeahead as separate structures',
        description:
          'Facet counts do not come from the inverted index but from a column-oriented copy of each field, so counting results per language means reading one packed array over the matching document ids. Typeahead is a different index entirely, because a half-typed word is not a token: a prefix trie or an edge n-gram field answers it, tuned for a sub-100 millisecond response on every keystroke rather than for relevance.',
      },
      {
        title: 'Fan out the post to follower inboxes',
        description:
          'When a post is committed, a consumer reads the author follower list and pushes the post id onto each follower timeline, trimming each list to about 800 entries so memory stays bounded. For an account with 500 followers this is 500 small writes, done in a few milliseconds, and a feed read afterwards is a single list read. Accounts above the pull-only threshold are skipped here deliberately, and their posts are merged at read time instead.',
        animation: 'fanout',
      },
      {
        title: 'Paginate with a cursor, then rank',
        description:
          'A feed changes while the user scrolls, so offset-based pagination duplicates and skips items: ten new posts arriving before page two means the last ten items of page one reappear. Instead issue a cursor that encodes a position, such as the newest post id at first load, and return only items older than it, so the page sequence is stable regardless of new writes. Ranking sits on top of that ordered candidate set as a rescoring step, never as a replacement for a deterministic cursor.',
      },
    ],
    deepDives: [
      {
        title: 'How two posting lists actually intersect',
        body:
          'Posting lists are stored sorted by document id and delta-compressed, so a list is a sequence of gaps rather than absolute values. Intersection is a two-cursor merge: compare the current ids, advance the smaller cursor, and emit on equality. That is linear in the sum of the list lengths, which hurts when one term appears in 1,000,000 documents and the other in 5,000. Skip pointers fix the asymmetry by storing, every few hundred entries, the document id at that point and an offset to jump to. The intersection then drives from the short list and, for each of its 5,000 ids, skips forward through the long list, costing roughly 5,000 times log of 1,000,000, about 100,000 comparisons instead of a million steps. This is also why an OR query is far more expensive than an AND: nothing prunes.',
      },
      {
        title: 'The analyser decides what can ever be found',
        body:
          'An analyser is a pipeline: a character filter strips markup, a tokeniser splits the stream into terms, and token filters lower-case, remove stop words, fold accents, and stem. Stemming reduces running, runs, and ran toward a common root, so a query for run matches a document about running. The critical rule is that the same analyser must run at index time and at query time, because the index contains only the analysed form: if the index stored photo and the query searches for photos unstemmed, there is no match and the bug looks like missing data. Analysers are also language-specific, since German compound splitting and Chinese segmentation have nothing to do with splitting English on spaces, and changing an analyser requires a full reindex.',
      },
      {
        title: 'From TF-IDF to BM25 in one paragraph',
        body:
          'Scoring answers how well a document matches, and it rests on two intuitions: a term appearing often in a document is a good sign, and a term appearing in nearly every document is worthless. TF-IDF multiplies term frequency by inverse document frequency, the log of total documents over documents containing the term, so the word the contributes almost nothing while brighten contributes a lot. BM25 keeps that shape and fixes two flaws: term frequency is saturated by a parameter k1 so the twentieth occurrence adds far less than the second, and document length is normalised by a parameter b so a 5,000-word page does not outrank a precise 20-word answer merely by containing more occurrences. Both are computed per matching document at query time, which is why only the intersected candidates are scored.',
      },
      {
        title: 'Typeahead is a different index, not a cheaper search',
        body:
          'Full-text search matches tokens, and a user who has typed brigh has not produced a token, so the main index cannot answer them. There are two standard structures. A prefix trie stores names as a character tree with the top completions precomputed at each node, making a lookup a walk of the typed length plus a read of a small cached list, which comfortably fits the sub-100 millisecond budget. Edge n-grams instead expand each term into all its prefixes at index time, turning prefix matching into ordinary term matching at the cost of roughly nine extra tokens per ten-character term. Either way the operating profile differs sharply from search: one request per keystroke means five to ten times the query volume, the corpus is small and bounded, results are short, and the whole thing should be cached aggressively at the edge.',
      },
      {
        title: 'The celebrity problem, worked with real numbers',
        body:
          'Fan-out on write costs one small write per follower. For an account with 500 followers that is 500 writes, a few milliseconds of work, and a feed read that is a single list lookup. For an account with 50 million followers it is 50 million writes, and at a sustained 100,000 writes per second that is 500 seconds during which some followers have the post and others do not. The hybrid draws a line, typically around 100,000 followers: below it, push at write time; above it, write nothing and record the account as pull-only. A feed read then fetches the precomputed list and separately fetches recent posts from the small number of pull-only accounts the user follows, usually fewer than ten, and merges by time. Cost moves from proportional to follower count to proportional to celebrities-followed, which is bounded by human behaviour.',
      },
      {
        title: 'Paginating a feed that changes while you read it',
        body:
          'Offset pagination assumes a stable list. If page one returns items 0 to 29 and ten new posts arrive before page two requests items 30 to 59, the user sees the last ten items of page one a second time, and deletions cause the mirror problem of silently skipped items. The fix is a cursor that names a position in the ordering rather than a count: encode the newest post id at first load and the last id returned, and each page asks for items older than the last id within the snapshot ceiling. For ranked feeds the cursor must also carry the ranking session, because scores change between requests, so systems typically materialise a candidate list per session and page through that, discarding it after a timeout.',
      },
    ],
    tradeoffs: [
      'Fan-out on write makes reads a single list lookup and makes one celebrity post millions of writes; fan-out on read reverses both.',
      'A larger inverted index with positions and n-grams supports phrase and prefix queries and inflates storage and reindex time.',
      'Aggressive stemming raises recall and lowers precision, so a search for the brand Runners can start matching articles about running.',
      'Ranked feeds engage users more than chronological ones and destroy the simple cursor, forcing a materialised per-session candidate list.',
    ],
    bottlenecks: [
      'Fan-out workers backing up behind one very large follower list, delaying every other author post in the same partition.',
      'OR queries and leading-wildcard queries, which cannot prune and effectively scan whole posting lists.',
      'Timeline memory growth if lists are not trimmed, since 300 million users at 800 ids each is already near two terabytes.',
      'Reindexing after an analyser change, which rewrites the entire corpus while serving live traffic.',
    ],
    scalingPath: [
      { scale: 'Prototype', focus: 'Postgres full-text search and a feed query over followees, with the correct composite index and a cursor' },
      { scale: 'One region', focus: 'A dedicated search index fed by change data capture, timelines pushed into Redis by a queue worker, typeahead in its own index' },
      { scale: 'Global', focus: 'Sharded index with scatter-gather and per-region replicas, hybrid fan-out with a pull-only threshold, timelines materialised near the reader' },
    ],
    interviewScript: [
      '"A timeline is derived data. I will not order by created_at on the posts table for 200 followees."',
      '"Search is an inverted index: term to a sorted posting list, and an AND query intersects two lists with skip pointers."',
      '"Scoring is BM25, which is TF-IDF with saturating term frequency and length normalisation."',
      '"Typeahead is a separate index, because half a word is not a token; I use a prefix trie or edge n-grams."',
      '"Feeds are fan-out on write for normal accounts, so a read is one list lookup of 30 ids."',
      '"Above roughly 100,000 followers I switch that account to pull-only and merge its posts at read time."',
    ],
    commonMistakes: [
      'Serving a home timeline directly from the posts table with an IN clause and an ORDER BY.',
      'Using offset pagination on a feed that is receiving new items.',
      'Applying a different analyser at query time than at index time, then reporting missing documents as a bug.',
      'Fanning out to every follower with no threshold, so one celebrity post stalls the whole pipeline.',
      'Treating the search index as a source of truth instead of a rebuildable projection.',
      'Trying to answer typeahead from the full-text index and wondering why partial words do not match.',
    ],
    relatedTopics: ['databases', 'caching', 'message-queues', 'google-search', 'instagram'],
    examples: [
      'Twitter pushes tweets into per-user Redis timelines and handles very large accounts on the read path instead',
      'Instagram serves the feed from precomputed lists and rescores candidates for ranking rather than re-querying the posts table',
      'Elasticsearch exposes a completion suggester built on a finite state transducer precisely because prefix matching needs its own structure',
    ],
    practicePrompt:
      'Pick the follower threshold at which an account becomes pull-only and justify it with the write cost per post and the number of such accounts a typical user follows.',
    followUps: [
      {
        question: 'What is an inverted index and why is it called that?',
        answer:
          'A forward index maps a document to the terms it contains, which is the natural direction and useless for search. An inverted index reverses that: each analysed term maps to a sorted posting list of the document ids containing it, plus term frequency and often token positions. A query for a term becomes a single lookup, and a multi-term query becomes an intersection of sorted lists. Nothing about the documents themselves needs to be read until the top results are hydrated for display.',
        category: 'Fundamentals',
        difficulty: 'easy',
      },
      {
        question: 'How is an AND query over two terms executed?',
        answer:
          'Both posting lists are loaded and walked with two cursors, advancing whichever document id is smaller and emitting only on equality, which works because the lists are sorted. When one list is far longer, skip pointers stored every few hundred entries let it jump ahead rather than step, so intersecting a 5,000-entry list with a 1,000,000-entry list costs about 100,000 comparisons rather than a million. Surviving candidates are scored with BM25 into a heap of the requested size, so the full match set is never sorted.',
        category: 'Query execution',
        difficulty: 'medium',
      },
      {
        question: 'Why does BM25 beat plain TF-IDF?',
        answer:
          'TF-IDF grows linearly with term frequency, so a page repeating a word fifty times scores far above a precise page that uses it twice, and it has no principled handling of document length. BM25 saturates term frequency through the k1 parameter, so additional occurrences add rapidly diminishing value, and normalises by document length through the b parameter so a long page does not win merely by being long. It keeps the inverse document frequency term, so common words still contribute almost nothing.',
        category: 'Ranking',
        difficulty: 'medium',
      },
      {
        question: 'Why can the full-text index not serve typeahead?',
        answer:
          'Because the index contains complete analysed tokens, and a user who has typed brigh has not produced one, so there is nothing to look up. Prefix matching therefore needs a structure built for it: a trie holding the best completions at each character node, or an edge n-gram field that expands every term into its prefixes at index time. The traffic pattern differs too, since one request per keystroke multiplies query volume by five to ten, which argues for a small, heavily cached, separately scaled index.',
        category: 'Typeahead',
        difficulty: 'easy',
      },
      {
        question: 'Fan-out on write or on read for a home timeline?',
        answer:
          'Push for almost everyone, because reads dominate and a push makes a feed read a single list lookup of 30 ids. Pull for the small number of accounts whose follower count makes pushing absurd, since 50 million followers means 50 million writes, or about 500 seconds at 100,000 writes per second. The hybrid crosses over around 100,000 followers, and read cost then becomes proportional to how many such accounts a user follows, which is bounded in practice at under ten.',
        category: 'Feeds',
        difficulty: 'medium',
      },
      {
        question: 'How do facet counts get computed without scanning documents?',
        answer:
          'Facets are not answered from the inverted index but from doc values, a column-oriented copy of each facetable field stored as a packed array keyed by document id. After the query produces its matching document ids, the engine reads that array for those ids and accumulates counts per value, which is a sequential memory scan rather than a set of lookups. That is why high-cardinality facets are expensive and why facetable fields must be declared up front, since the columnar copy has to exist at index time.',
        category: 'Faceting',
        difficulty: 'hard',
      },
      {
        question: 'What breaks with offset pagination on a feed?',
        answer:
          'The list shifts under the reader. If ten posts arrive between page one and page two, an offset of 30 now points ten items later in a longer list, so the user sees the tail of page one again; deletions cause items to be skipped entirely instead. A cursor fixes it by naming a position rather than a count, typically the last id returned plus a snapshot ceiling taken at first load, so each page is defined relative to items rather than to a moving count.',
        category: 'Pagination',
        difficulty: 'medium',
      },
      {
        question: 'How do you handle deletes and edits in a search index?',
        answer:
          'Index segments are immutable, so a delete is recorded in a tombstone bitmap that filters the document out of results, and an update is a delete plus a fresh insert of the new version. The space is only reclaimed when background merging rewrites the segments without the deleted documents, which means a heavily updated corpus carries real merge overhead. Because the index is a projection fed by change data capture, the safety net is that a corrupted or drifted index can always be rebuilt from the posts table.',
        category: 'Indexing',
        difficulty: 'hard',
      },
      {
        question: 'Ranked or chronological feed, and what does ranking cost architecturally?',
        answer:
          'Ranking usually wins on engagement, but it breaks the property that made pagination easy. A chronological feed has a total order that any request can recompute, so a cursor is just the last id. A ranked feed has scores that change between requests as signals update, so paging cannot be defined by score alone. The standard answer is to materialise a candidate list per session, rank it once, page through the materialised list, and expire it after a few minutes, which adds state and a cache tier that the chronological design does not need.',
        category: 'Feeds',
        difficulty: 'hard',
      },
      {
        question: 'Where does the fan-out work happen, and what if it falls behind?',
        answer:
          'In a consumer group reading new posts from the log, so the write path returns as soon as the post is committed. Falling behind means followers see a delayed post rather than an error, which is the right failure mode, and the alarm should be the age of the oldest unprocessed post rather than the queue depth. Two guards matter: chunk very large follower lists so one author cannot monopolise a partition, and keep the work idempotent, because at-least-once delivery will re-push the same post id and a set or a trimmed sorted list absorbs that harmlessly.',
        category: 'Pipelines',
        difficulty: 'medium',
      },
    ],
  }),
};
