# Interview pitch

## 30-second version

"I built BotOps Control Center as an operations-first dashboard for automated
research systems. The key design decision was to keep process reliability
separate from strategy evidence: the UI shows freshness, closed versus open
outcomes, guardrails, incidents, and recovery runbooks instead of implying
profitability from a small sample. I added typed server endpoints, a guarded
server-only OpenAI brief path, no-key demo behavior, tests, CI, and a public
Cloudflare-ready deployment."

## If asked what you personally solved

- Defined the operator-facing data model and status vocabulary.
- Implemented the dashboard interactions and responsive layout.
- Added a constrained `/api/brief` endpoint with known IDs, rate limiting,
  generic errors, and no secret exposure.
- Added regression tests for HTML rendering, health metadata, and the safe
  no-key fallback.
- Documented runbooks and the evidence policy so another engineer can operate
  the system without guessing.

## If asked what you would do next

"I would replace the fixture layer with a versioned telemetry contract, add
structured logs and durable incident history, instrument latency and error
budgets, and deploy the AI key as a managed runtime secret with usage alerts.
Only after the evidence plan is complete would I consider any strategy
changes."
