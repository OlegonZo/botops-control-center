# BotOps Control Center

An operations-first portfolio project for monitoring automated research
systems. It keeps process health, evidence quality, and strategy performance
separate - because a running bot is not proof of an edge.

**Live demo:** [botops-control-center-oleg.o38057979.chatgpt.site](https://botops-control-center-oleg.o38057979.chatgpt.site)
**Repository:** [OlegonZo/botops-control-center](https://github.com/OlegonZo/botops-control-center)

## Narrated demo video

https://github.com/user-attachments/assets/b0a91b8a-6f0b-4c52-81f5-b79fd0aa2c9d

[Download WebM](./demo/botops-control-center-demo-narrated.webm) · [Download MP4](./demo/botops-control-center-demo-male-soft-voice.mp4)

The 38-second walkthrough covers Overview, Fleet pulse, guarded operations,
Runbooks, and Architecture using demo telemetry only. It does not place orders
or use live capital.

## Why this is a useful engineering sample

The project demonstrates an end-to-end slice of production-minded work:

- a responsive operator dashboard for a four-system fleet;
- freshness, closed/open sample accounting, and preregistered evidence gates;
- incident context and three recovery runbooks;
- typed server endpoints for health metadata and guarded AI operations briefs;
- server-only `OPENAI_API_KEY` handling with a deterministic no-key demo mode;
- request limiting and generic error responses around the AI boundary;
- build and runtime tests plus GitHub Actions CI.

All dashboard values are explicitly marked as demo telemetry. The application
does not place orders, connect to exchanges, or expose secrets in the browser.

## 60-second walkthrough

1. **Overview:** select a system in Fleet pulse and inspect process state,
   freshness, sample maturity, and guardrails.
2. **Ops brief:** press **Generate ops brief**. Without a hosted key the app
   returns a safe deterministic demo brief; with a server-side key it can use
   the OpenAI Responses API without exposing credentials to the browser.
3. **Runbooks:** show stale-heartbeat, rate-limit, and unexpected-PnL recovery
   procedures.
4. **Architecture:** explain the read-only telemetry path and explicit
   boundary between operational reliability and strategy evidence.

## Stack

React 19, TypeScript, Next-compatible routing through vinext, Cloudflare
Workers, CSS, OpenAI Responses API (optional runtime integration), and Node's
built-in test runner.

## Local development

```powershell
pnpm install
pnpm dev
```

The app runs without credentials. To exercise the optional AI path locally,
copy `.env.example` to `.env.local` and add a key there. Never commit
`.env.local`; it is ignored by Git.

## Validation

```powershell
pnpm build
node --test tests/rendered-html.test.mjs
```

GitHub Actions runs the same build and test checks for pushes and pull
requests.

## Product principle

> Instrument first. Calculate offline. Tune only after the preregistered
> evidence threshold is met.

## Portfolio talking points

- I designed the dashboard around operational decisions, not vanity metrics.
- I separated demo telemetry from claims about strategy performance.
- I kept the AI boundary server-side, rate-limited, and safe when no key is
  configured.
- I shipped documentation, tests, CI, and a public deployment together.
