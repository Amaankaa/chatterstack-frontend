# ChatterStack — Landing Page Creative Brief + Content Pack

This is a complete prompt and content kit for building a stunning landing page that showcases ChatterStack’s backend craft: real‑time chat with Go, WebSockets, Redis pub/sub, PostgreSQL (RDS), and a production‑ready AWS stack (ECS Fargate + ALB behind CloudFront).

Use this document to shape the narrative, sections, visuals, and interactive code demos. It includes copy drafts, design guidance, and code snippets you can safely display on the site.

---

## One‑Line Value

Build real‑time chat experiences at production scale. Go + WebSockets, Redis pub/sub, Postgres, and an AWS stack you can trust.

## Tagline Options
- Real‑time chat, production‑grade backend.
- WebSockets that scale. Infrastructure that lasts.
- Ship chat features fast — on a battle‑tested backend.

---

## Audience & Outcomes
- Developers evaluating our backend: show clarity, quality, and rigor.
- Hiring managers/peers: highlight architecture, testing, and ops maturity.
- Open‑source curious: easy “try it” demos and clear docs.

Outcomes we want:
- Confidence in architecture and operational discipline.
- Curiosity sparked by live demos and readable code samples.
- Easy path to the repo and API docs.

---

## Page Structure (Sections)

1) Hero
- Headline: “Real‑time chat, production‑grade backend.”
- Sub‑copy: “Go + WebSockets, Redis pub/sub, Postgres, CloudFront/ALB/ECS. Clean architecture, tests, docs. Ready to learn from and build on.”
- Primary CTA: “View on GitHub”
- Secondary CTA: “Read the journey” → link to `TheJourney.md` summary page.

2) Feature Grid (4–6 cards)
- WebSockets that scale: Redis pub/sub relay, hub routing by room and user.
- Clean architecture: delivery/usecase/domain/repository separation.
- Tested & documented: unit/integration tests, OpenAPI + Postman.
- Production infra: CloudFront → ALB → ECS Fargate; RDS Postgres; Secrets & SSM.
- Secure by default: JWT auth, rate limiting, CORS discipline.
- Developer‑friendly: simple envs, blazing‑fast Go.

3) Architecture Overview
- Diagram showing Client → CloudFront → ALB → ECS (API + WS) → RDS + Redis.
- Short bullets for each component’s role.

4) Live‑Feeling Code Showcase
- Copy‑to‑clipboard, tabbed code blocks (curl, fetch, Node/Web, YAML).
- Emphasize CloudFront header nuance (`X-Auth-Token`) and WS query auth.

5) The Journey (Story)
- Pull quotes and highlights from `TheJourney.md` (IAM, CORS, CloudFront headers, persistence, resilience).

6) Call to Action
- “Explore the code” and “Open API docs / Postman” buttons.

7) Footer
- Links: GitHub, API docs, Postman, License.

---

## Visual Direction
- Tone: technical, confident, minimal. Focus on clarity and credibility.
- Palette (suggested):
  - Primary: `#0EA5E9` (sky‑500), Accent: `#22C55E` (emerald‑500)
  - Dark base: `#0B1220`, Card: `#0F172A`, Text: `#E2E8F0`
- Typography: Inter/Geist/SF Pro for UI; JetBrains Mono for code.
- Motion: Subtle shimmer on hero CTA; typewriter effect for hero code.

---

## Copy Blocks (Ready to Use)

- Hero Headline: “Real‑time chat, production‑grade backend.”
- Subhead: “Go + WebSockets, Redis pub/sub, Postgres, and AWS (CloudFront/ALB/ECS). Clean architecture with tests and docs — built to learn from and ship.”
- CTA Primary: “View on GitHub”
- CTA Secondary: “Read our Journey”

Feature Card Snippets:
- WebSockets that scale: “Hub + rooms, fan‑out via Redis pub/sub, instant delivery.”
- Clean architecture: “Delivery, Usecases, Domain, Repos — readable, testable Go.”
- Production infra: “CloudFront → ALB → ECS Fargate; RDS Postgres; Secrets & SSM.”
- Auth & security: “JWT access/refresh, rate limiting, CORS with intent.”
- Docs & tests: “OpenAPI + Postman; unit and integration tests.”

---

## Architecture (ASCII Diagram)

```
Browser / SPA
   │
   ▼
CloudFront (REST + WSS)
   │              
   ▼              
Application Load Balancer (HTTP :8080 / WS :8081)
   │
   ▼
ECS Fargate Service
   ├─ API (Gin, JWT, CORS, Rate Limit)
   └─ WebSocket Hub (rooms, users, Redis relay)

Data Plane
   ├─ RDS PostgreSQL (pgx) — users, rooms, messages
   └─ Redis 7 — cache + pub/sub broadcast
```

Key Nuances:
- CloudFront does not forward `Authorization` for us → use `X-Auth-Token` for REST via CDN.
- WebSocket uses `access_token` in the query string (consistent through the edge).
- CORS headers come from origin; CloudFront passes them through for `/v1/*`.

---

## Showcase: Code Snippets (Safe for Landing Page)

All examples point at our CloudFront domain and demonstrate the real auth and header patterns.

### 1) Login (curl)
```bash
curl -s https://d1176qoi9kdya5.cloudfront.net/v1/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"user@example.com","password":"supersecret"}'
# → { "access_token": "<jwt>", "refresh_token": "<jwt>" }
```

### 2) Authenticated GET via CloudFront (fetch + X-Auth-Token)
```ts
const CF_BASE = 'https://d1176qoi9kdya5.cloudfront.net/v1';

async function getUserByEmail(email: string, accessToken: string) {
  const res = await fetch(`${CF_BASE}/users?email=${encodeURIComponent(email)}`, {
    headers: {
      'Content-Type': 'application/json',
      'X-Auth-Token': accessToken,
    },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}
```

### 3) WebSocket Connect (access_token query)
```ts
const CF_WS = 'wss://d1176qoi9kdya5.cloudfront.net/ws';

function connectWS(accessToken: string, roomIds: string[]) {
  const qs = new URLSearchParams();
  roomIds.forEach((id) => qs.append('room_id', id));
  qs.set('access_token', accessToken);

  const ws = new WebSocket(`${CF_WS}?${qs.toString()}`);
  ws.onopen = () => console.log('WS connected');
  ws.onmessage = (ev) => console.log('WS event', JSON.parse(ev.data));
  ws.onclose = () => console.log('WS closed');
  ws.onerror = (e) => console.error('WS error', e);
  return ws;
}
```

### 4) Send a Message (WS)
```jsonc
{
  "event": "send_message",
  "data": {
    "room_id": "room_1",
    "content": "Hello, world!"
  }
}
```

### 5) Receive a Message (WS)
```jsonc
{
  "event": "receive_message",
  "data": {
    "id": "msg_1",
    "room_id": "room_1",
    "sender_id": "user_123",
    "content": "Hello, world!",
    "attachments": [],
    "status": "SENT",
    "created_at": "2025-12-08T10:12:00Z",
    "updated_at": "2025-12-08T10:12:00Z"
  }
}
```

### 6) Typing Indicators (WS with room_id always present)
```jsonc
// Client → Server
{ "event": "typing_start", "data": { "room_id": "room_1" } }

// Server → Other Clients in room_1
{
  "event": "typing_start",
  "data": {
    "username": "alex",
    "room_id": "room_1"
  }
}
```

### 7) OpenAPI (excerpt)
```yaml
openapi: 3.0.3
servers:
  - url: https://d1176qoi9kdya5.cloudfront.net/v1
components:
  securitySchemes:
    XAuthToken:
      type: apiKey
      in: header
      name: X-Auth-Token
paths:
  /users:
    get:
      security:
        - XAuthToken: []
      parameters:
        - in: query
          name: email
          required: true
          schema: { type: string }
      responses:
        '200': { description: User }
```

### 8) Postman Collection (variables excerpt)
```json
{
  "variable": [
    { "key": "base_cf", "value": "https://d1176qoi9kdya5.cloudfront.net/v1" },
    { "key": "access_token", "value": "" }
  ]
}
```

### 9) CORS Preflight (what you should see)
```http
HTTP/2 200
access-control-allow-origin: https://chatterstack.vercel.app
access-control-allow-headers: Content-Type, Authorization, X-Auth-Token
access-control-allow-methods: GET,POST,PUT,PATCH,DELETE,OPTIONS
access-control-max-age: 600
```

---

## Micro‑Interactions & Demos
- Hero code typewriter that types the WS URL and a `send_message` JSON.
- Copy‑to‑clipboard buttons on every code block.
- Optional “playground” panel that accepts an access token and performs a read‑only `GET /v1/users?email=…` with `X-Auth-Token` (no secrets stored).

---

## SEO & Social Cards
- Title: “ChatterStack — Real‑time Chat Backend (Go, WebSockets, AWS)”
- Description: “Production‑grade chat: Go + WebSockets, Redis pub/sub, Postgres, and AWS (CloudFront/ALB/ECS). Clean architecture, tests, and docs.”
- OpenGraph: Dark hero with network/graph motif; badges for Go, AWS, Redis, Postgres.

---

## Accessibility & Performance
- Respect reduced motion; sufficient contrast; semantic landmarks.
- Defer non‑critical JS; preconnect to fonts; ship code blocks statically.

---

## Implementation Checklist
- [ ] Hero with headline, subhead, CTAs.
- [ ] Feature grid with icons and concise benefits.
- [ ] Architecture diagram (SVG) + short bullets.
- [ ] Tabbed code blocks with copy buttons (curl, fetch, TS, YAML, JSON).
- [ ] Journey highlights section with pull quotes.
- [ ] Footer with links: GitHub, API docs, Postman.
- [ ] Optional: Minimal “try it” panel (read‑only GET) using `X-Auth-Token`.

---

## Useful Links
- API docs: `API_documentation.md`
- OpenAPI: `api/swagger.yaml`
- Postman: `api/postman.json`
- Journey: `TheJourney.md`

This prompt and content pack should give you everything to craft a credible, delightful landing page that tells our technical story and invites developers to explore the code.
