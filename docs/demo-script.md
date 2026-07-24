# BotOps Control Center - 60-second demo script

Use this script for a short screen recording or a live walkthrough. Keep the
browser on the public demo and do not show local environment files or API keys.

## 0-10 seconds - Problem

"A bot being online does not mean its result is trustworthy. This control
center separates process health, evidence quality, and the next safe action."

## 10-25 seconds - Fleet pulse

Select **MEXC Move15 Research**. Point out the process status, freshness,
closed/open sample split, and the **Paper only** guardrail.

Say: "The operator can see what is running and what still cannot be
concluded."

## 25-38 seconds - Safe AI boundary

Press **Generate ops brief**. Show the three short bullets.

Say: "The brief endpoint accepts only known system IDs, has a no-key demo
fallback, and keeps the OpenAI key on the server. It never sends a secret to
the browser."

## 38-50 seconds - Recovery playbooks

Open **Runbooks** and show stale heartbeat, rate-limit storm, and unexpected
PnL. Emphasize: observe, isolate, restart once, then verify freshness.

## 50-60 seconds - Engineering close

Open **Architecture**. Say: "The sample includes typed health metadata,
server-rendered routing, tests, CI, and a Cloudflare-ready deployment. The
important design choice is refusing to call a small demo sample profitable."

## Recording checklist

- Hide browser bookmarks, personal email, API keys, and local file paths.
- Use a 1280x720 or 1440x900 browser window.
- Move the cursor slowly and pause one second after each click.
- Export as MP4 or GIF and link it near the top of the GitHub README.
