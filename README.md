# BotOps Control Center

An operations-first portfolio project for monitoring automated trading research
systems. It keeps process health, evidence quality, and strategy performance
separate—because a running bot is not proof of an edge.

## What the demo shows

- Fleet-level process health and freshness
- Closed-vs-open sample accounting
- Preregistered evidence thresholds
- Incident context and operator runbooks
- A typed server health endpoint
- Responsive, accessible interaction
- A safe path for future server-side OpenAI summaries

All dashboard values are explicitly marked as demo telemetry. The application
does not place orders, connect to exchanges, or expose secrets in the browser.

## Stack

React 19, TypeScript, Next-compatible routing through vinext, Cloudflare
Workers, CSS, and Node's built-in test runner.

## Local development

Install dependencies, start the development server, and open the local URL it
prints. The app runs without credentials. A future AI integration can read
`OPENAI_API_KEY` from a local `.env.local` file; never commit that file.

## Product principle

> Instrument first. Calculate offline. Tune only after the preregistered
> evidence threshold is met.
