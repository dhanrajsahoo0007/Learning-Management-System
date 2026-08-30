import { ArchitectureTopic, emptyContent } from '../systemDesignTypes';

export const authTopic: ArchitectureTopic = {
  id: 'auth',
  title: 'Authentication and Authorization',
  description:
    'Sessions, opaque tokens, and JWTs; refresh rotation with reuse detection; OAuth2 with PKCE; and RBAC, ABAC, and ReBAC.',
  difficulty: 'Intermediate',
  progress: 0,
  icon: 'Shield',
  color: 'bg-emerald-600',
  section: 'fundamentals',
  track: 'classic',
  prerequisites: ['http-rpc'],
  estimatedMinutes: 80,
  order: 17,
  content: emptyContent({
    overview:
      'Authentication answers who is calling, and authorization answers whether that caller may perform this action on this resource. They are separate systems that share a credential, and most production incidents come from confusing them or from getting the credential storage wrong. The design space reduces to one question with expensive consequences: does the server keep the truth about a live session, or does the token carry it.',
    whyItExists:
      'HTTP is stateless, so every request must independently prove who is making it, and a password cannot be sent on every request. Tokens and sessions exist to convert one expensive login into many cheap, verifiable requests with a bounded lifetime.',
    problemStatement: {
      prompt:
        'A product has a web app, an iOS app, a partner API, and forty internal services behind a gateway. Design the credential a caller presents, where the truth about that credential lives, how a compromised session is revoked within seconds, and where the permission check for "may this user read invoice 918" actually runs.',
      inScope: [
        'Credential types: session cookie, opaque token, JWT, API key, mTLS',
        'Refresh tokens, rotation, reuse detection, and revocation',
        'OAuth2 authorization code with PKCE, OIDC, and SSO',
        'Cookie flags, CSRF and XSS, and the authorization models',
      ],
      outOfScope: [
        'Password hashing parameter tuning and credential-stuffing defence in depth',
        'Multi-factor enrolment and recovery flows',
        'Key management ceremonies and hardware security modules',
        'Rate limiting the login endpoint (see rate limiting)',
      ],
    },
    assumptions: [
      'Everything is served over TLS, so a bearer credential is not readable on the wire',
      'The web client and the API share a registrable domain, so a first-party cookie is available',
      'A shared low-latency store exists for sessions, refresh tokens, and deny lists',
    ],
    whenToUse: [
      'Any request that reads or writes data belonging to a specific person or tenant',
      'Machine-to-machine calls between services, where identity must not be an internal IP address',
      'Third-party integrations that need scoped access to a user data without holding the password',
    ],
    functionalRequirements: [
      { title: 'Establish a session', detail: 'Exchange a password, an SSO assertion, or an authorization code for a short-lived access credential.' },
      { title: 'Verify on every request', detail: 'Resolve the credential to a subject, a tenant, and a scope set in well under a millisecond.' },
      { title: 'Renew without re-prompting', detail: 'A long-lived rotating refresh token mints new access tokens for up to 30 days.' },
      { title: 'Revoke', detail: 'Log out one device or every device, and terminate a stolen session within seconds rather than at expiry.' },
    ],
    nonFunctionalRequirements: [
      { title: 'Verification latency', detail: 'Under 200 µs for a local signature check, under 1 ms if a session store is consulted.' },
      { title: 'Revocation window', detail: 'Bounded and stated: 15 minutes with a stateless JWT, immediate with a server-side session.' },
      { title: 'Blast radius of theft', detail: 'A stolen access token expires quickly; a stolen refresh token is detectable and self-destructs on reuse.' },
      { title: 'Login throughput isolation', detail: 'Password hashing is deliberately slow, so login must not share a thread pool with ordinary reads.' },
    ],
    estimates: [
      { label: 'Access token lifetime', value: '15 min', note: 'Bounds the usefulness of a stolen token to 900 s' },
      { label: 'Refresh token lifetime', value: '30 d, rotated on use', note: 'One refresh call per 15 min per active session' },
      { label: 'JWT on the wire', value: '400–900 B', note: '800 B at 10k rps ≈ 8 MB/s of pure header overhead' },
      { label: 'RS256 verification', value: '≈ 150 µs', note: '10k rps ≈ 1.5 CPU-seconds per second; HS256 is ~2 µs' },
      { label: 'bcrypt cost 12', value: '≈ 250 ms per login', note: '≈ 4 logins/s per core, so it needs its own pool' },
    ],
    concepts: [
      'Session cookie versus bearer token',
      'JWT structure: header, payload, signature',
      'Refresh token rotation and reuse detection',
      'HttpOnly, Secure, SameSite',
      'CSRF versus XSS',
      'OAuth2 authorization code with PKCE',
      'OIDC id_token versus access_token',
      'RBAC, ABAC, and ReBAC',
    ],
    comparisons: [
      {
        title: 'Five credentials and what each one costs you',
        headers: ['Credential', 'How it works', 'Use when', 'Avoid when'],
        rows: [
          [
            'Session cookie',
            'An opaque random id in a cookie; the server looks it up in a session store on every request and holds all the truth',
            'First-party web apps that need instant revocation and no client-side token handling',
            'Cross-domain clients, mobile apps, or when you cannot afford a store lookup per request',
          ],
          [
            'Opaque bearer token',
            'A random string in the Authorization header, resolved server-side exactly like a session id',
            'Mobile and API clients that need revocable tokens without cookie semantics',
            'You want stateless verification at the edge with no shared store',
          ],
          [
            'JWT',
            'Base64url header.payload.signature; the receiver verifies the signature with a public key and trusts the claims inside',
            'Fan-out across many services or regions where a shared session store would be a bottleneck',
            'You need to revoke before exp, or the payload contains data that changes',
          ],
          [
            'API key',
            'A long-lived secret identifying an application rather than a person, hashed at rest and matched on use',
            'Server-to-server partner integrations and simple developer onboarding',
            'It would end up in a browser, a mobile binary, or a public repository',
          ],
          [
            'mTLS',
            'Both sides present certificates during the TLS handshake, so identity is bound to the connection rather than the message',
            'Service-to-service identity inside a mesh, where certificates rotate automatically',
            'Human clients or third parties who cannot manage certificate lifecycle',
          ],
        ],
        note: 'The whole table is one axis: how much of the truth lives on the server. Sessions and opaque tokens keep all of it, JWTs keep none, and everything else is a compromise between revocation speed and lookup cost.',
      },
      {
        title: 'Authorization models',
        headers: ['Model', 'How the decision is made', 'Use when', 'Avoid when'],
        rows: [
          [
            'RBAC',
            'A subject holds roles; a role grants a fixed set of permissions. The check is a set membership test',
            'Coarse organisational permissions: admin, member, viewer',
            'Permissions depend on the specific resource, which produces a role explosion',
          ],
          [
            'ABAC',
            'A policy evaluates attributes of subject, resource, action, and environment: department equals owner department and time is inside business hours',
            'Rules that are naturally conditional, such as region or data classification',
            'Nobody can predict the outcome, because the policy set has grown beyond review',
          ],
          [
            'ReBAC (Zanzibar-style)',
            'Store relationship tuples like document:918#viewer@user:4471 and answer by traversing them, so groups and folders inherit naturally',
            'Sharing, nesting, and per-object permissions — documents, repositories, folders',
            'Permissions are flat and organisational, where RBAC is far cheaper to run',
          ],
        ],
        note: 'Real systems combine them: RBAC for the coarse tenant role, ReBAC for per-object sharing, and ABAC conditions layered on top.',
      },
    ],
    architecture:
      'The gateway terminates TLS, validates the credential once, and forwards a small verified identity header set plus a short-lived internal token to the service behind it. Web clients hold a refresh token in an HttpOnly, Secure, SameSite cookie scoped to the refresh path and keep the 15-minute access token in memory only, while service-to-service calls use mTLS identities issued by the mesh. Coarse role checks happen at the gateway, and per-object authorization stays in the owning service, which is the only component that knows the resource.',
    diagrams: [
      { id: 'sj', title: 'Who stores the truth', kind: 'excalidraw', src: 'auth-session-vs-jwt' },
    ],
    apis: [
      {
        method: 'POST',
        path: '/v1/login',
        description: 'Exchanges a password for a short-lived access token and sets a rotating refresh token cookie.',
        request:
          'POST /v1/login\nContent-Type: application/json\n\n{ "email": "dev@example.com", "password": "correct-horse-battery", "device_id": "d_ios_9a1" }',
        response:
          '200 OK\nSet-Cookie: rt=rt_7f19c2ab; HttpOnly; Secure; SameSite=Strict; Path=/v1/token; Max-Age=2592000\nContent-Type: application/json\n\n{\n  "access_token": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjIwMjUtMDEifQ...",\n  "token_type": "Bearer",\n  "expires_in": 900,\n  "user": { "id": "u_4471", "email": "dev@example.com", "tenant_id": "t_88" }\n}',
        errors:
          '401 invalid_credentials — returned identically for an unknown email and a wrong password, so the endpoint cannot be used to enumerate accounts, and after an identical hashing delay so timing cannot either.\n403 mfa_required — body carries { "mfa_token": "mt_c81", "methods": ["totp"] } to continue the flow.\n429 rate_limited — 5 attempts per account per 15 minutes plus a per-IP limit; see the rate limiting lesson for the algorithm.',
      },
      {
        method: 'POST',
        path: '/v1/token/refresh',
        description: 'Rotates the refresh token and mints a new access token. The old refresh token is invalidated by this call.',
        request:
          'POST /v1/token/refresh\nCookie: rt=rt_7f19c2ab\n\n(no body: the refresh token is never placed anywhere JavaScript can read it)',
        response:
          '200 OK\nSet-Cookie: rt=rt_b40e8817; HttpOnly; Secure; SameSite=Strict; Path=/v1/token; Max-Age=2592000\nContent-Type: application/json\n\n{ "access_token": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjIwMjUtMDEifQ...", "token_type": "Bearer", "expires_in": 900 }',
        errors:
          '401 invalid_grant — expired, unknown, or already-revoked refresh token; the client must send the user back to login.\n401 token_reuse_detected — this token was already exchanged, which means either a replay or a theft. The entire token family for that device is revoked and every session for the user is terminated.',
      },
      {
        method: 'GET',
        path: '/v1/me',
        description: 'Resolves the presented access token to the current subject, tenant, roles, and granted scopes.',
        request: 'GET /v1/me\nAuthorization: Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjIwMjUtMDEifQ...',
        response:
          '200 OK\nCache-Control: no-store\n\n{\n  "id": "u_4471",\n  "email": "dev@example.com",\n  "tenant_id": "t_88",\n  "roles": ["member", "billing_admin"],\n  "token": { "jti": "jt_91f", "exp": 1735690500, "scope": "profile invoices:read" }\n}',
        errors:
          '401 token_expired — past the exp claim; the client should refresh once and retry exactly once.\n401 invalid_token — signature verification failed or the kid header names an unknown key.\n403 insufficient_scope — the token is valid but lacks a required scope, with WWW-Authenticate: Bearer scope="profile".',
      },
      {
        method: 'POST',
        path: '/v1/logout',
        description: 'Revokes the refresh token family for this device, or for every device, and clears the cookie.',
        request:
          'POST /v1/logout\nAuthorization: Bearer eyJhbGciOiJSUzI1NiJ9...\nCookie: rt=rt_b40e8817\nContent-Type: application/json\n\n{ "all_devices": false }',
        response:
          '204 No Content\nSet-Cookie: rt=; HttpOnly; Secure; SameSite=Strict; Path=/v1/token; Max-Age=0',
        errors:
          '401 invalid_token — there is nothing to revoke for an unauthenticated caller.\nNote: the already-issued access token stays cryptographically valid until exp, so logout also adds its jti to a deny list with a TTL equal to the remaining 15 minutes. That deny list is the only stateful part of an otherwise stateless design.',
      },
    ],
    walkthrough: [
      {
        title: 'Prove identity once, expensively',
        description:
          'The login endpoint compares the submitted password against a bcrypt or Argon2 hash, which takes around 250 milliseconds by design so that an offline attacker gains no speed advantage. Because that cost is deliberate, login runs in its own thread pool and behind its own rate limit, or a credential-stuffing run becomes a denial of service. The response is identical for an unknown email and a wrong password, and takes the same time, so the endpoint reveals nothing about which accounts exist.',
      },
      {
        title: 'Issue a short access token and a long refresh token',
        description:
          'The server returns a 15-minute access token that the client keeps in memory and sends on every request, plus a 30-day refresh token whose only purpose is to mint new access tokens. Splitting them is the central compromise of modern auth: verification stays cheap and stateless for 15 minutes at a time, while the long-lived credential is used rarely, travels to exactly one endpoint, and can be revoked in a store small enough to be fast.',
      },
      {
        title: 'Store each one where its attacker cannot reach',
        description:
          'The refresh token goes into a cookie marked HttpOnly, Secure, and SameSite, scoped by Path to the refresh endpoint, so script cannot read it, it never crosses plain HTTP, and it is not attached to cross-site requests. The access token lives in a JavaScript variable rather than localStorage, so it dies with the tab and is not sitting in persistent storage waiting for the next cross-site scripting bug.',
      },
      {
        title: 'Verify on every request at the gateway',
        description:
          'The gateway checks the signature using the public key identified by the kid header, then checks exp, iss, and aud, then checks the jti against a small deny list of revoked tokens. On success it strips the client credential and forwards a verified identity header set plus an internal token, so no downstream service ever re-parses an untrusted credential. Verification is roughly 150 microseconds for RS256, which is why keys are cached and rotated by kid rather than fetched per request.',
      },
      {
        title: 'Rotate the refresh token and watch for reuse',
        description:
          'Every refresh call returns a new refresh token and invalidates the one presented, keeping a record that links them into a family. If a token that was already exchanged is ever presented again, exactly two explanations exist: a client retried, or someone stole it. The server assumes theft, revokes the whole family, and forces a fresh login, which turns a silent long-term compromise into a single visible logout.',
      },
      {
        title: 'Authorize where the resource lives',
        description:
          'The gateway can enforce coarse facts it already holds, such as whether the caller has the billing_admin role and a valid scope. It cannot decide whether user 4471 may read invoice 918, because it does not know who owns that invoice. That check belongs to the invoice service, which reads the relationship or the ownership column, so the deny is correct even when a request arrives by an unexpected path.',
      },
    ],
    deepDives: [
      {
        title: 'A JWT is a signed claim, not a session',
        body:
          'A JWT is three base64url segments: a header naming the algorithm and key id, a payload of claims, and a signature over the first two. The standard claims carry the meaning — sub is the subject, iss the issuer, aud the intended audience, exp the expiry, iat the issue time, and jti a unique id. Verification is local: check the signature with the issuer public key, then check exp, iss, and aud. That locality is the entire value, because forty services in three regions can each verify without a shared store. It is also the entire problem. Nothing in the token can be withdrawn, so a token issued at 12:00 with a 12:15 expiry remains valid until 12:15 even if you delete the user at 12:01. Revocation therefore requires state, which is why real deployments keep a jti deny list with a TTL equal to the access token lifetime and accept a bounded window instead of pretending there is none.',
      },
      {
        title: 'Refresh token rotation with reuse detection',
        body:
          'A static 30-day refresh token that is stolen gives an attacker 30 days of access with no signal. Rotation changes the economics: every refresh returns a new token and marks the presented one as spent, storing both in a linked family. If a spent token is presented again, the server cannot tell whether the legitimate client or the attacker is holding the newer one, so it revokes the entire family and requires a login. The attacker loses access, the user notices one unexpected logout, and you get an alert. Two implementation details matter. A short grace window of a few seconds handles a client that retried after a dropped response, otherwise flaky mobile networks cause spurious logouts. And rotation must be atomic — a compare-and-set on the token row — or two concurrent refreshes from the same client will each invalidate the other.',
      },
      {
        title: 'Cookie flags, and which attack each one stops',
        body:
          'HttpOnly removes the cookie from document.cookie, so injected script cannot read the value; it stops token exfiltration through cross-site scripting but does nothing about a script that simply issues requests. Secure prevents the cookie from being sent over plain HTTP, stopping a network attacker who downgrades a single request. SameSite controls whether the cookie is attached to requests initiated from other sites: Strict never attaches it cross-site and defeats cross-site request forgery outright, while Lax attaches it on top-level navigations, which keeps ordinary login links working and is the modern browser default. Path narrows the exposure surface so the refresh cookie is only sent to the refresh endpoint. None of these help if the token is in localStorage, because localStorage has no flags at all.',
      },
      {
        title: 'CSRF and XSS are different problems with different fixes',
        body:
          'Cross-site request forgery abuses the browser habit of attaching cookies automatically: a form on a malicious page posts to your transfer endpoint and the browser helpfully includes the session cookie. The attacker never reads anything, they only cause an action, which is why the defence is proving intent — SameSite cookies plus a per-session CSRF token echoed in a header that a cross-site form cannot set. Cross-site scripting is worse, because attacker code runs inside your origin. It can read localStorage, so a token there is gone immediately; but even an HttpOnly cookie does not save you, since the script can call your API with the cookie attached and read the response. This is the honest summary: HttpOnly cookies beat localStorage against XSS by removing token theft, but neither prevents an XSS from acting as the user, so output encoding and a strict Content-Security-Policy remain the real defence.',
      },
      {
        title: 'OAuth2 authorization code with PKCE, step by step',
        body:
          'The client generates a random verifier and sends its SHA-256 hash as the code_challenge on the authorization request, along with client_id, redirect_uri, scope, and a state value. The user authenticates at the provider and consents, and the provider redirects back to redirect_uri with a single-use code. The client then posts that code to the token endpoint together with the original verifier; the provider hashes the verifier and compares it to the stored challenge, and only then returns tokens. This is what makes an intercepted code useless: whoever grabbed it from a redirect, a system log, or a hijacked custom URL scheme cannot produce the verifier. The state value is a separate defence, tying the callback to the session that started it so an attacker cannot inject their own code. PKCE is now recommended for every client type, not just mobile, and the implicit flow that returned tokens in a URL fragment is deprecated because those tokens leaked through history and referrers.',
      },
      {
        title: 'OIDC, SSO, and what the id_token is for',
        body:
          'OAuth2 grants access to resources and says nothing about who the user is; an access token is deliberately opaque to the client. OpenID Connect adds an id_token, a JWT about the authentication event itself, containing sub, the issuer, the audience, the time of authentication, and the nonce that binds it to your request. The rule is simple: the id_token is for your application to learn the identity and must be validated locally; the access token is for calling APIs and must never be parsed by the client. SAML solves the same enterprise problem a decade earlier with signed XML assertions posted through the browser to a service provider, and it persists because identity providers and enterprise procurement standardised on it. In both cases single sign-on means the identity provider holds the long-lived session and each application receives a short-lived assertion, which is also why single logout is hard: every application has its own session to tear down.',
      },
    ],
    tradeoffs: [
      'Server-side sessions give instant revocation and cost a store lookup on every request.',
      'JWTs verify locally with no shared state and cannot be withdrawn before exp.',
      'Longer access token lifetimes reduce refresh traffic and widen the theft window proportionally.',
      'Checking permissions at the gateway is uniform and cheap; only the owning service knows the resource.',
    ],
    bottlenecks: [
      'The session store, which every request consults and whose outage logs everyone out.',
      'Password hashing at 250 ms per attempt, which saturates a shared pool during a credential-stuffing run.',
      'RS256 verification at high request rates, consuming whole cores unless keys and results are cached.',
      'A ReBAC permission service on the read path, which must be cached because it is consulted per object.',
    ],
    scalingPath: [
      { scale: 'Prototype', focus: 'Opaque session id in an HttpOnly cookie, sessions in Postgres, RBAC roles on the user row' },
      { scale: 'One region', focus: 'Gateway validates a 15-minute JWT, rotating refresh cookie, session and deny list in Redis, per-object checks in services' },
      { scale: 'Global', focus: 'OIDC provider with per-region key distribution by kid, mTLS between services, ReBAC service with cached decisions and audit logging' },
    ],
    interviewScript: [
      '"First question: does the server keep the truth about a live session, or does the token carry it. Everything else follows."',
      '"For the web app I use a 15-minute access token in memory and a rotating refresh token in an HttpOnly, Secure, SameSite cookie."',
      '"I cannot revoke a JWT before exp, so I keep a jti deny list with a 15-minute TTL and state that window explicitly."',
      '"Refresh tokens rotate on every use, and reuse of a spent token revokes the whole family — that is my theft detector."',
      '"Third-party access is authorization code with PKCE, so an intercepted code is useless without the verifier."',
      '"Coarse roles are checked at the gateway, but may-user-read-invoice-918 stays in the invoice service, because only it knows the owner."',
    ],
    commonMistakes: [
      'Storing tokens in localStorage, where any cross-site scripting bug reads them directly.',
      'Claiming JWTs are revocable without mentioning a deny list or a short expiry.',
      'Trusting the alg header, which historically allowed an attacker to downgrade to none.',
      'Issuing a refresh token that never rotates, so theft grants 30 silent days.',
      'Putting per-object authorization at the gateway, which cannot know who owns the resource.',
      'Returning different errors or different response times for unknown email and wrong password.',
    ],
    relatedTopics: ['http-rpc', 'api-gateway', 'rate-limiting', 'reliability', 'gmail'],
    examples: [
      'Google issues OIDC id_tokens and short-lived access tokens, and requires PKCE for installed applications',
      'Google Zanzibar stores relationship tuples and answers billions of per-object permission checks for Drive and YouTube',
      'Stripe uses long-lived secret API keys for server-to-server calls and restricted keys to narrow scope per integration',
    ],
    practicePrompt:
      'You must sign out one stolen session within five seconds while forty services verify JWTs locally. Describe exactly what you store, where, and for how long.',
    followUps: [
      {
        question: 'Why can you not revoke a JWT before it expires?',
        answer:
          'Because verification is purely local arithmetic over the token itself. A service checks the signature and the exp claim and asks nobody, which is exactly why JWTs scale across services and regions. Nothing about that computation consults your database, so deleting the user changes no verification outcome. The practical answer is a short expiry of 5 to 15 minutes plus a jti deny list with a matching TTL, which reintroduces a small amount of state in exchange for a bounded revocation window.',
        category: 'Tokens',
        difficulty: 'medium',
      },
      {
        question: 'What does refresh token rotation actually detect?',
        answer:
          'Theft. Each refresh returns a new token and marks the presented one spent, recording both in a family. If a spent token is presented again, either the legitimate client retried or an attacker is replaying a copy, and the server cannot distinguish them, so it revokes the whole family. The attacker loses access, the user sees one unexpected logout, and you get a signal. Without rotation, a stolen 30-day token gives 30 days of undetected access.',
        category: 'Tokens',
        difficulty: 'medium',
      },
      {
        question: 'Which attack does each cookie flag stop?',
        answer:
          'HttpOnly hides the cookie from document.cookie, stopping token exfiltration by injected script. Secure prevents it being sent over plain HTTP, stopping a downgrade attack. SameSite controls whether it rides along on cross-site requests, and Strict defeats cross-site request forgery outright while Lax allows top-level navigations so login links keep working. Path limits which endpoints ever receive it, which is why a refresh cookie is scoped to the refresh route.',
        category: 'Browser',
        difficulty: 'easy',
      },
      {
        question: 'Why do localStorage tokens lose to XSS in a way cookies do not?',
        answer:
          'localStorage has no protective flags, so any script running in your origin reads the token and sends it anywhere, giving the attacker a credential usable outside the browser for its full lifetime. An HttpOnly cookie cannot be read at all, so theft is off the table. The honest caveat is that XSS is still severe with cookies, because the script can call your API from the page and the browser attaches the cookie for it — it just cannot take the credential away with it.',
        category: 'Browser',
        difficulty: 'medium',
      },
      {
        question: 'Walk through the PKCE flow.',
        answer:
          'The client generates a random verifier, hashes it with SHA-256, and sends that as code_challenge with the authorization request along with state. The user authenticates and consents, and the provider redirects back with a single-use code. The client posts the code plus the original verifier to the token endpoint; the provider re-hashes the verifier and compares it to the stored challenge before issuing tokens. An intercepted code is therefore worthless, because the interceptor never saw the verifier.',
        category: 'OAuth',
        difficulty: 'hard',
      },
      {
        question: 'What is the difference between an id_token and an access_token?',
        answer:
          'The id_token is an OIDC JWT about the authentication event, containing sub, iss, aud, the authentication time, and the nonce. It is for your application to learn who logged in and must be validated locally. The access_token is a credential for calling APIs and should be treated as opaque by the client, since its format is the resource server business. Parsing an access token in client code is a common bug that breaks the moment the provider changes format.',
        category: 'OAuth',
        difficulty: 'medium',
      },
      {
        question: 'When does RBAC stop being enough?',
        answer:
          'When permissions depend on the specific resource rather than on the person. Roles can express admin and viewer, but "may read the invoices of the tenants in my region that I was explicitly shared into" turns into thousands of synthetic roles nobody can audit. That is the signal to move to ABAC for conditional rules or ReBAC for per-object sharing, usually keeping RBAC for the coarse tenant-level role because it is far cheaper to evaluate.',
        category: 'Authorization',
        difficulty: 'medium',
      },
      {
        question: 'How does a Zanzibar-style ReBAC system answer a check?',
        answer:
          'It stores relationship tuples such as document:918#viewer@user:4471, or document:918#viewer@group:eng#member, and answers a check by traversing those relations, following group membership and folder inheritance transitively. That gives correct answers for nested sharing without materialising every permission. The costs are a service on the read path and consistency: Zanzibar issues zookies so a caller can require a decision at least as fresh as the write it just made.',
        category: 'Authorization',
        difficulty: 'hard',
      },
      {
        question: 'Should the gateway or the service check permissions?',
        answer:
          'Both, for different things. The gateway holds the credential and the coarse facts — is the token valid, does the caller have the required scope and tenant role — so putting that there avoids forty reimplementations. It cannot answer whether this user may read invoice 918, because it does not know who owns invoice 918. Per-object authorization belongs to the owning service, which is also the only place that stays correct when a request arrives through an internal path that bypasses the gateway.',
        category: 'Architecture',
        difficulty: 'medium',
      },
      {
        question: 'Why is mTLS preferred between internal services over shared secrets?',
        answer:
          'Because identity is bound to the connection and to a certificate with a short lifetime that the mesh rotates automatically, rather than to a static string that ends up in environment variables, CI logs, and Slack. Both sides verify each other, so a compromised service cannot impersonate a neighbour, and revocation is a certificate authority operation rather than a coordinated secret rollout. The cost is certificate lifecycle machinery, which is why it suits infrastructure with a mesh and not third-party human clients.',
        category: 'Service identity',
        difficulty: 'hard',
      },
    ],
  }),
};
