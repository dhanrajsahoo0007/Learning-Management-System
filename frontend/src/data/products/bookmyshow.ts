import { ArchitectureTopic, emptyContent } from '../systemDesignTypes';

const BOOK_SEQUENCE = `sequenceDiagram
  participant User
  participant Seats
  participant Pay
  User->>Seats: POST holds
  Seats-->>User: holdId expires 8m
  User->>Pay: pay
  Pay-->>Seats: capture
  Seats->>Seats: confirm seats
  Seats-->>User: tickets`;

const ER_DIAGRAM = `erDiagram
  CINEMAS ||--o{ AUDIS : has
  AUDIS ||--o{ SHOWS : schedules
  SHOWS ||--o{ SEATS : layouts
  SHOWS ||--o{ HOLDS : reserves
  HOLDS ||--o{ TICKETS : becomes`;

export const bookmyshowTopic: ArchitectureTopic = {
  id: 'bookmyshow',
  title: 'BookMyShow',
  description: 'Show catalog, a seat map with timed holds, payment, and tickets that two people cannot own.',
  difficulty: 'Advanced',
  progress: 0,
  icon: 'Ticket',
  color: 'bg-rose-600',
  section: 'products',
  track: 'classic',
  prerequisites: ['databases', 'reliability', 'caching', 'paytm'],
  estimatedMinutes: 70,
  order: 38,
  content: emptyContent({
    overview:
      'BookMyShow is scarce inventory. Discovery can be stale. A seat hold is a timed reservation. Confirm is a compare-and-set on those seats plus a payment. Two users must never walk into the same seat.',
    whyItExists:
      'People pick seats for a show and pay. The cinema cannot overbook a physical chair.',
    whenToUse: ['Inventory + booking', 'Timed locks', 'Contrast with Zomato (food is not a unique seat)'],
    problemStatement: {
      prompt:
        'Design a movie booking product like BookMyShow. Users browse movies and showtimes, pick seats on a map, pay, and receive tickets. Two customers cannot buy the same seat.',
      inScope: [
        'City / movie / show catalog',
        'Seat map with available / held / sold',
        'Timed hold (e.g. 8 minutes)',
        'Payment and confirm',
        'My bookings and QR ticket',
        'Cancel / refund per policy',
      ],
      outOfScope: [
        'Live events scale-out (mention as a follow-up)',
        'Food and beverage combo inventory',
        'Cinema POS sync protocol details',
        'Full wallet design (see Paytm)',
      ],
    },
    assumptions: [
      'A show has a few hundred seats, not millions. The hard part is contention on a hot show, not the row count.',
      'Opening weekend of a blockbuster is a thundering herd on one show_id.',
      'Payment can take longer than you wish — hence the hold TTL.',
      'The cinema is the source of truth for the layout; we own the booking lock.',
    ],
    functionalRequirements: [
      { title: 'Browse', detail: 'Cities, movies, dates, cinemas, showtimes.' },
      { title: 'Seat map', detail: 'Available, held by me, held by others, sold.' },
      { title: 'Hold', detail: 'Reserve N seats for a few minutes.' },
      { title: 'Pay and confirm', detail: 'On success, seats become tickets.' },
      { title: 'Ticket', detail: 'QR, show details, cancel window.' },
      { title: 'Admin', detail: 'Block seats, houseful, layout changes.' },
    ],
    nonFunctionalRequirements: [
      { title: 'No double book', detail: 'A seat has at most one confirmed ticket.' },
      { title: 'Hold expiry', detail: 'TTL is exact enough that the next user can take the seat.' },
      { title: 'Hot show', detail: 'Opening night map must stay interactive.' },
      { title: 'Pay timeout', detail: 'If pay dies, the hold expires and money is voided.' },
      { title: 'Browse freshness', detail: 'Show lists can be cached. The map cannot be a 5-minute CDN page.' },
    ],
    estimates: [
      { label: 'Seats per show', value: '~100–400', note: 'A Redis hash or a small SQL table per show is enough.' },
      { label: 'Hot show QPS', value: 'Huge on the map', note: 'Cache the layout; live-hold the occupancy.' },
      { label: 'Hold TTL', value: '6–10 minutes', note: 'Must exceed the payment UX.' },
      { label: 'Catalog', value: 'Modest', note: 'Not Netflix. SQL plus a city cache is fine.' },
    ],
    concepts: ['Timed hold', 'Seat CAS', 'Layout vs occupancy', 'Houseful', 'Idempotent confirm'],
    walkthrough: [
      {
        title: 'Browse',
        description:
          'City and movie are cached. Showtimes are a query on shows. “Filling fast” can be a cached occupancy bucket, not a lock.',
      },
      {
        title: 'Hold seats',
        description:
          'Compare-and-set each seat from free → held(user, expire_at). If any seat fails, release the ones you took and 409. Return a hold_id.',
        diagram: BOOK_SEQUENCE,
      },
      {
        title: 'Pay and confirm',
        description:
          'Authorize/capture. If seats are still held by this user, CAS held → sold and write tickets. If the hold expired, void pay and tell the user to reselect.',
      },
    ],
    apis: [
      {
        method: 'GET',
        path: '/v1/shows',
        description: 'Showtimes for a movie in a city/date.',
        request: `{\n  "movieId": "mv_1",\n  "city": "BLR",\n  "date": "2026-08-30"\n}`,
        response: `{\n  "shows": [{ "id": "sh_9", "cinema": "PVR", "time": "21:00", "fill": 0.7 }]\n}`,
      },
      {
        method: 'GET',
        path: '/v1/shows/:id/seats',
        description: 'Layout plus live occupancy. Held-by-others is opaque.',
        response: `{\n  "seats": [{ "id": "A1", "state": "free" }, { "id": "A2", "state": "sold" }]\n}`,
      },
      {
        method: 'POST',
        path: '/v1/holds',
        description: 'Timed reserve. Idempotent on the checkout session.',
        request: `{\n  "showId": "sh_9",\n  "seatIds": ["A1", "A2"]\n}`,
        response: `{\n  "holdId": "h_3",\n  "expiresAt": "2026-08-30T11:20:00Z"\n}`,
        errors: `{\n  "409": "Seat taken",\n  "429": "Too many holds"\n}`,
      },
      {
        method: 'POST',
        path: '/v1/holds/:id/confirm',
        description: 'Called after payment success (or by the payment webhook).',
        response: `{\n  "ticketIds": ["tk_1", "tk_2"]\n}`,
        errors: `{\n  "410": "Hold expired",\n  "402": "Payment not captured"\n}`,
      },
      {
        method: 'GET',
        path: '/v1/tickets',
        description: 'My bookings.',
        response: `{\n  "tickets": [{ "id": "tk_1", "seat": "A1", "qr": "…" }]\n}`,
      },
    ],
    dataModel: [
      {
        name: 'shows',
        primaryKey: ['show_id'],
        columns: [
          { name: 'show_id', type: 'uuid' },
          { name: 'audi_id', type: 'uuid' },
          { name: 'movie_id', type: 'uuid' },
          { name: 'starts_at', type: 'timestamptz' },
        ],
      },
      {
        name: 'seat_state',
        primaryKey: ['show_id', 'seat_id'],
        columns: [
          { name: 'show_id', type: 'uuid' },
          { name: 'seat_id', type: 'text' },
          { name: 'state', type: 'enum', notes: 'free | held | sold' },
          { name: 'hold_id', type: 'uuid' },
          { name: 'expire_at', type: 'timestamptz' },
        ],
        notes: 'The contention table. Redis hash is a good v2; SQL with CAS works at v1.',
      },
      {
        name: 'holds',
        primaryKey: ['hold_id'],
        columns: [
          { name: 'hold_id', type: 'uuid' },
          { name: 'user_id', type: 'uuid' },
          { name: 'show_id', type: 'uuid' },
          { name: 'seat_ids', type: 'text[]' },
          { name: 'expires_at', type: 'timestamptz' },
        ],
      },
      {
        name: 'tickets',
        primaryKey: ['ticket_id'],
        columns: [
          { name: 'ticket_id', type: 'uuid' },
          { name: 'show_id', type: 'uuid' },
          { name: 'seat_id', type: 'text' },
          { name: 'user_id', type: 'uuid' },
          { name: 'payment_id', type: 'uuid' },
        ],
        indexes: ['UNIQUE (show_id, seat_id)'],
      },
    ],
    architecture:
      'Catalog and show lists are cached. Seat map reads layout (cold) plus occupancy (hot, per show). Hold/confirm is a small service with CAS on seat_state. Payments go through the wallet/PSP; confirm is idempotent from the webhook. A sweeper expires holds. Tickets are immutable after confirm.',
    diagram: `flowchart TB
    App --> Catalog
    App --> Seats
    Seats --> Occupancy[(Seat state)]
    App --> Pay
    Pay --> Seats
    Seats --> Tickets
    Sweeper --> Occupancy`,
    diagrams: [{ id: 'er', title: 'Entity relationships', kind: 'mermaid', src: ER_DIAGRAM }],
    deepDives: [
      {
        title: 'Layout vs occupancy',
        body: 'The chair graph (rows, aisles, prices) almost never changes. Cache it. The live map is a compact state vector per show. Do not send the full cinema CAD on every poll.',
      },
      {
        title: 'CAS the seat',
        body: 'UPDATE seat_state SET state=held WHERE show AND seat AND state=free. Check row count. Unique (show, seat) on tickets is the last line of defense if two confirms race.',
      },
      {
        title: 'TTL sweeper',
        body: 'Expire_at on the hold. A job or Redis key expiry returns seats to free. Confirm must re-check expire_at. Payment after expiry voids.',
      },
      {
        title: 'Opening-night herd',
        body: 'One show_id is the shard. Keep the state in Redis with SQL as backup, serialize holds per show (or per row group), and cache the map for readers with a short TTL plus pub/sub invalidation.',
      },
    ],
    tradeoffs: [
      'Longer hold TTL: better pay UX, more wasted seats.',
      'Redis occupancy vs SQL-only (ops vs simplicity).',
      'Opaque “held” vs showing a countdown on someone else’s seat (don’t).',
    ],
    bottlenecks: ['One blockbuster show', 'Payment gateway slowness eating the TTL', 'Seat-map polls'],
    scalingPath: [
      { scale: 'v1', focus: 'SQL seat_state with transactions and a unique ticket constraint.' },
      { scale: 'v2', focus: 'Redis occupancy, sweeper, catalog cache.' },
      { scale: 'blockbuster', focus: 'Per-show in-memory lock, pub/sub map, queue on hold.' },
    ],
    interviewScript: [
      '“Discovery can be stale. The seat is a CAS with a TTL.”',
      '“Payment success without a live hold is a void, not a ticket.”',
      '“UNIQUE (show, seat) on tickets is the backstop.”',
    ],
    commonMistakes: [
      'Checking seats then inserting without CAS',
      'No hold TTL',
      'CDN-caching the live map for 5 minutes',
      'Deleting journal/tickets on cancel instead of a refund row',
    ],
    relatedTopics: ['paytm', 'zomato', 'reliability', 'airbnb'],
    examples: ['BookMyShow', 'Fandango'],
    practicePrompt: 'Two users tap A12 at the same millisecond on opening night. Walk both through seat_state and tickets.',
    followUps: [
      {
        question: 'Hold expired while the bank page was open. The charge succeeds.',
        category: 'matching',
        difficulty: 'hard',
        answer:
          'Confirm sees a dead hold, does not write tickets, and refunds/voids. Show a “seats lost, money back” state. Never create a ticket without a successful CAS.',
      },
      {
        question: 'How do you stop a bot from holding the whole house?',
        category: 'abuse',
        difficulty: 'medium',
        answer:
          'Cap holds per user/device, captcha on hot shows, short TTL, and release unused holds fast. Inventory abuse is the product, not just QPS.',
      },
      {
        question: 'Concert of 40k GA (no seats). What changes?',
        category: 'scale',
        difficulty: 'medium',
        answer:
          'A counter, not a seat map. Reserve N from remaining with the same TTL + unique tickets. Still idempotent confirm. The map UI goes away; the lock does not.',
      },
      {
        question: 'Cinema blocks a row after 50 tickets sold.',
        category: 'matching',
        difficulty: 'medium',
        answer:
          'Admin sets those seats to a blocked state. Already sold tickets stay. Held seats get cancelled and notified. Layout version bumps so clients reload.',
      },
      {
        question: 'Why not treat this like Zomato inventory of a thali?',
        category: 'scale',
        difficulty: 'easy',
        answer:
          'Thalis are fungible. Seats are unique and visible on a map. You need identity per seat, not just a counter — except for GA events.',
      },
      {
        question: 'Where does Paytm fit?',
        category: 'matching',
        difficulty: 'easy',
        answer:
          'The wallet/PSP is the rail. BookMyShow owns hold and ticket uniqueness. The payment webhook calls confirm. Do not let the PSP be the seat lock.',
      },
    ],
  }),
};
