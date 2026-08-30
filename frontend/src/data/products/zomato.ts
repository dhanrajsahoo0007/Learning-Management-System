import { ArchitectureTopic, emptyContent } from '../systemDesignTypes';

const ORDER_SEQUENCE = `sequenceDiagram
  participant User
  participant Order
  participant Vendor
  participant Dispatch
  participant Pay
  User->>Order: POST orders
  Order->>Pay: authorize
  Order->>Vendor: notify
  Vendor-->>Order: accept
  Order->>Dispatch: assign rider
  Dispatch-->>Order: rider_id
  Pay->>Pay: capture`;

const ER_DIAGRAM = `erDiagram
  RESTAURANTS ||--o{ MENUS : lists
  RESTAURANTS ||--o{ ORDERS : receives
  USERS ||--o{ ORDERS : places
  ORDERS ||--|| PAYMENTS : pays
  ORDERS ||--o| ASSIGNMENTS : dispatched`;

export const zomatoTopic: ArchitectureTopic = {
  id: 'zomato',
  title: 'Zomato / Food Delivery',
  description: 'Geo restaurant search, menus, an order state machine, payment hold, and rider dispatch.',
  difficulty: 'Advanced',
  progress: 0,
  icon: 'UtensilsCrossed',
  color: 'bg-red-600',
  section: 'products',
  track: 'classic',
  prerequisites: ['databases', 'reliability', 'realtime', 'uber'],
  estimatedMinutes: 75,
  order: 37,
  content: emptyContent({
    overview:
      'Zomato is a three-sided marketplace: diner, restaurant, rider. Discovery is geo plus a catalog. The order is a state machine tied to a payment hold. Dispatch is Uber-like but with a kitchen SLA.',
    whyItExists:
      'People want nearby food with a live ETA. Restaurants want a ticket they can accept. Riders want a short hop.',
    whenToUse: ['Marketplace + geo + dispatch', 'Order state machines', 'After Uber / before BookMyShow'],
    problemStatement: {
      prompt:
        'Design a food delivery app like Zomato. Users find nearby restaurants, build a cart, pay, and track a rider. Restaurants accept tickets. Riders get assigned hops.',
      inScope: [
        'Geo discovery and menus',
        'Cart and checkout',
        'Order state machine',
        'Payment authorize/capture',
        'Restaurant accept / reject',
        'Rider assign and live location',
        'Ratings',
      ],
      outOfScope: [
        'Dining-out table booking (that is a different product)',
        'Cloud kitchen ERP',
        'Full Paytm wallet internals (reuse the ledger lesson)',
        'Ads on the home feed',
      ],
    },
    assumptions: [
      'Demand is city-peaked (lunch/dinner). Rain spikes ETAs.',
      'A restaurant can accept only so many tickets in a slot.',
      'Riders are shared, not restaurant employees.',
      'Payment is authorized at place and captured on accept (or complete — say your policy).',
    ],
    functionalRequirements: [
      { title: 'Discover', detail: 'Nearby restaurants, filters, search.' },
      { title: 'Menu', detail: 'Items, variants, in-stock flags, photos.' },
      { title: 'Cart / checkout', detail: 'Price snapshot, address, payment.' },
      { title: 'Order', detail: 'Place → accepted → preparing → assigned → picked → delivered.' },
      { title: 'Restaurant app', detail: 'Accept/reject, mark prepared.' },
      { title: 'Rider app', detail: 'Offer, accept, GPS pings, complete.' },
    ],
    nonFunctionalRequirements: [
      { title: 'Discovery p99', detail: 'A few hundred ms. Menu can be cached.' },
      { title: 'Place order', detail: 'Must not double-charge. Idempotent checkout.' },
      { title: 'Dispatch', detail: 'A rider offer in tens of seconds after accept.' },
      { title: 'Location', detail: 'ETA updates every few seconds to the diner.' },
      { title: 'Correctness', detail: 'Reject after accept is a cancellation flow, not a silent drop.' },
    ],
    estimates: [
      { label: 'Peak cities', value: 'Lunch and dinner spikes', note: 'Shard by city.' },
      { label: 'GPS pings', value: 'High', note: 'Same as Uber: do not write SQL per ping.' },
      { label: 'Menu reads', value: 'Huge vs orders', note: 'CDN/cache the menu; orders are the write path.' },
      { label: 'Batching', value: 'A rider may carry two orders', note: 'Dispatch is an assignment problem, not FIFO only.' },
    ],
    concepts: ['Three-sided marketplace', 'Price snapshot', 'Authorize/capture', 'Kitchen SLA', 'Geo dispatch'],
    walkthrough: [
      {
        title: 'Discover and menu',
        description:
          'Geo index of open restaurants, rank by ETA and rating, hydrate cards. Menu is a cached document. Stock-outs are a flag, not a live join on every item.',
        animation: 'geohash',
      },
      {
        title: 'Place',
        description:
          'Idempotency key, snapshot line items and prices, authorize payment, create the order in placed, notify the restaurant. Do not assign a rider yet.',
        diagram: ORDER_SEQUENCE,
      },
      {
        title: 'Accept and dispatch',
        description:
          'Restaurant accepts. Capture or keep the hold per policy. Dispatch offers the hop to nearby free riders (Uber matching). Kitchen time feeds the diner ETA.',
      },
    ],
    apis: [
      {
        method: 'GET',
        path: '/v1/restaurants',
        description: 'Nearby, open, filtered.',
        request: `{\n  "lat": 12.97,\n  "lng": 77.59,\n  "q": "biryani"\n}`,
        response: `{\n  "restaurants": [{ "id": "r_1", "etaMin": 28 }]\n}`,
      },
      {
        method: 'GET',
        path: '/v1/restaurants/:id/menu',
        description: 'Cached menu document.',
        response: `{\n  "items": [{ "id": "i_9", "name": "Chicken dum", "paise": 28000, "inStock": true }]\n}`,
      },
      {
        method: 'POST',
        path: '/v1/orders',
        description: 'Checkout. Idempotent.',
        request: `{\n  "restaurantId": "r_1",\n  "items": [{ "id": "i_9", "qty": 2 }],\n  "addressId": "a_3"\n}`,
        response: `{\n  "id": "o_77",\n  "status": "placed",\n  "totalPaise": 61000\n}`,
        errors: `{\n  "409": "Price changed — refresh cart",\n  "422": "Item out of stock"\n}`,
      },
      {
        method: 'POST',
        path: '/v1/orders/:id/accept',
        description: 'Restaurant accepts and quotes prep minutes.',
        request: `{\n  "prepMin": 15\n}`,
        response: `{\n  "status": "preparing"\n}`,
      },
      {
        method: 'GET',
        path: '/v1/orders/:id/track',
        description: 'Diner track: status plus rider point (from cache).',
        response: `{\n  "status": "picked",\n  "rider": { "lat": 12.98, "lng": 77.60 },\n  "etaMin": 9\n}`,
      },
    ],
    dataModel: [
      {
        name: 'restaurants',
        primaryKey: ['restaurant_id'],
        columns: [
          { name: 'restaurant_id', type: 'uuid' },
          { name: 'geo_cell', type: 'text' },
          { name: 'open', type: 'bool' },
          { name: 'prep_p50_min', type: 'int' },
        ],
        indexes: ['(geo_cell)'],
      },
      {
        name: 'orders',
        primaryKey: ['order_id'],
        columns: [
          { name: 'order_id', type: 'uuid' },
          { name: 'user_id', type: 'uuid' },
          { name: 'restaurant_id', type: 'uuid' },
          { name: 'status', type: 'enum' },
          { name: 'snapshot_json', type: 'jsonb', notes: 'Prices and items at checkout' },
          { name: 'payment_id', type: 'uuid' },
        ],
      },
      {
        name: 'assignments',
        primaryKey: ['order_id'],
        columns: [
          { name: 'order_id', type: 'uuid' },
          { name: 'rider_id', type: 'uuid' },
          { name: 'state', type: 'enum' },
        ],
      },
    ],
    architecture:
      'Discovery reads a geo index and a menu cache. Order service is the state machine and talks to the wallet/PSP (authorize/capture). Restaurant devices get a ticket via push/websocket. Dispatch is a matching service on rider GEO (reuse Uber). Rider GPS goes to Redis; diners poll or subscribe to track. Notifications on each transition.',
    diagram: `flowchart TB
    Diner --> Discovery
    Discovery --> Geo[(Restaurant geo)]
    Diner --> Orders
    Orders --> Pay
    Orders --> VendorApp
    Orders --> Dispatch
    Dispatch --> Riders[(Rider GEO)]
    Rider --> GPS[(Redis last point)]
    Diner --> Track`,
    diagrams: [{ id: 'er', title: 'Entity relationships', kind: 'mermaid', src: ER_DIAGRAM }],
    deepDives: [
      {
        title: 'Price snapshot',
        body: 'Menus change. The order stores the exact items and paise you showed at checkout. If the restaurant changed the price, 409 and refresh. Do not re-read the menu at capture.',
      },
      {
        title: 'When to capture money',
        body: 'Authorize on place so the diner is good for it. Capture on restaurant accept (you will cook) or on delivery (more refunds). Say the policy. Reject/timeout voids the auth.',
      },
      {
        title: 'Dispatch vs Uber',
        body: 'Same GEO matching, but the pickup time is “kitchen ready,” not now. Assign too early and the rider waits. Assign too late and food sits. Use prep_p50 plus live ticket load.',
      },
      {
        title: 'Batching two orders',
        body: 'A second assignment can attach if the restaurant is nearby and both ETAs still work. This is an optimization, not v1. Mention it as a follow-up.',
      },
    ],
    tradeoffs: [
      'Capture on accept vs on delivery.',
      'Showing 28 min ETA that you will miss in rain vs a wider band.',
      'Menu consistency vs restaurant POS lag.',
    ],
    bottlenecks: ['Dinner spike in one geo cell', 'Restaurant tablet offline', 'Rider shortage', 'Menu cache stampedes'],
    scalingPath: [
      { scale: 'v1', focus: 'One city, SQL orders, Google maps, one dispatcher.' },
      { scale: 'v2', focus: 'Geo index, menu cache, payment holds, rider GEO.' },
      { scale: 'many cities', focus: 'City shards, batching, rain-aware ETAs, vendor load shedding.' },
    ],
    interviewScript: [
      '“Three sides: diner, restaurant, rider. The order is a state machine with a payment hold.”',
      '“I will not assign a rider before the kitchen accepts.”',
      '“Menus are cached. Orders store a price snapshot.”',
    ],
    commonMistakes: [
      'Assigning a rider at place',
      'Re-pricing at capture',
      'Writing GPS to SQL',
      'Treating this as only a restaurant search',
    ],
    relatedTopics: ['uber', 'paytm', 'tinder', 'bookmyshow'],
    examples: ['Zomato', 'Swiggy', 'DoorDash'],
    practicePrompt: 'It starts raining in one geohash at 8pm. ETAs blow up and riders vanish. What do you show the diner, and what do you stop promising?',
    followUps: [
      {
        question: 'Restaurant never accepts. What happens to money and the diner?',
        category: 'matching',
        difficulty: 'medium',
        answer:
          'A timeout (e.g. 5–8 min) cancels the order, voids the auth, and offers nearby alternatives. Do not leave a pending charge overnight.',
      },
      {
        question: 'How do you keep menu photos from killing TTFB?',
        category: 'geo',
        difficulty: 'easy',
        answer:
          'CDN. The menu API returns URLs. The restaurant list does not embed every item photo.',
      },
      {
        question: 'Rider cancels after pickup.',
        category: 'matching',
        difficulty: 'hard',
        answer:
          'Order goes to reassign with the food already out. Dispatch uses a smaller radius and a higher incentive. The diner sees “finding another rider.” Payment stays captured. Support is a first-class state, not a tweet.',
      },
      {
        question: 'Idempotent checkout — diner double-taps Pay.',
        category: 'matching',
        difficulty: 'medium',
        answer:
          'Idempotency key from the checkout session. One order, one auth. Same as Paytm.',
      },
      {
        question: 'How much Uber design do you reuse?',
        category: 'geo',
        difficulty: 'easy',
        answer:
          'Rider GEO, offer/accept, GPS cache. You add kitchen time and a three-sided state machine. You do not need surge-for-rides as the first story — you need restaurant load.',
      },
      {
        question: 'Inventory of a limited thali.',
        category: 'scale',
        difficulty: 'medium',
        answer:
          'A small stock counter decremented at place (reservation) and released on cancel. Not a warehouse system. 409 if the last bowl sold during checkout.',
      },
    ],
  }),
};
