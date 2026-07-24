"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";

type Status = "Running" | "Paused" | "Complete" | "Blocked";
type View = "Overview" | "Runbooks" | "Architecture";
type BriefState =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "ready"; text: string; mode: "ai" | "demo" }
  | { kind: "error"; text: string };

type Bot = {
  id: string;
  icon: string;
  name: string;
  strategy: string;
  venue: string;
  status: Status;
  freshness: string;
  evidence: string;
  result: string;
  accent: string;
  process: string;
  sample: string;
  guardrail: string;
  next: string;
};

const bots: Bot[] = [
  {
    id: "move15",
    icon: "M15",
    name: "MEXC Move15 Research",
    strategy: "forward cohort",
    venue: "MEXC",
    status: "Running",
    freshness: "12 sec",
    evidence: "25 / 60 signals",
    result: "Collecting",
    accent: "#b7f34c",
    process: "Healthy",
    sample: "24 closed В· 1 open",
    guardrail: "Paper only",
    next: "Hold parameters until the preregistered sample is complete.",
  },
  {
    id: "hyper",
    icon: "HL",
    name: "Hyperliquid Edge",
    strategy: "15m exit study",
    venue: "Hyperliquid",
    status: "Paused",
    freshness: "3 days",
    evidence: "10 / 30 positions",
    result: "Interim в€’",
    accent: "#f1be58",
    process: "Stopped",
    sample: "Small sample",
    guardrail: "No live capital",
    next: "Review exits offline before any restart or parameter change.",
  },
  {
    id: "poly",
    icon: "PM",
    name: "Polymarket Reward Shadow",
    strategy: "guarded v4",
    venue: "Polymarket",
    status: "Complete",
    freshness: "5 days",
    evidence: "2 round trips",
    result: "Run complete",
    accent: "#5ce1e6",
    process: "Exited cleanly",
    sample: "5 markets",
    guardrail: "Six-hour cap",
    next: "Archive the cohort; insufficient evidence for an edge claim.",
  },
  {
    id: "solana",
    icon: "SOL",
    name: "Solana Wallet Radar",
    strategy: "holder telemetry",
    venue: "Solana",
    status: "Blocked",
    freshness: "3 days",
    evidence: "RPC degraded",
    result: "HTTP 429",
    accent: "#f27272",
    process: "Backoff active",
    sample: "Read-only monitor",
    guardrail: "Cost ceiling",
    next: "Rotate the RPC plan or reduce cadence before resuming.",
  },
];

const incidents = [
  {
    time: "15:14 UTC",
    severity: "INFO",
    title: "Move15 heartbeat accepted",
    copy: "Snapshot schema valid; one paper position remains open.",
    color: "#b7f34c",
  },
  {
    time: "12:42 UTC",
    severity: "GUARD",
    title: "Evidence threshold protected",
    copy: "Performance comparison remains NOT_EVALUATED below 60 signals.",
    color: "#f1be58",
  },
  {
    time: "20 JUL",
    severity: "WARN",
    title: "Solana RPC throttled",
    copy: "429 response triggered exponential backoff and stopped polling.",
    color: "#f27272",
  },
];

const runbooks = [
  {
    index: "RB-01",
    title: "Stale heartbeat",
    copy: "Recover a process without creating duplicate workers.",
    steps: [
      "Confirm timestamp and parent/child process tree",
      "Inspect stderr before restarting",
      "Restart once and verify two fresh heartbeats",
    ],
  },
  {
    index: "RB-02",
    title: "Rate-limit storm",
    copy: "Reduce external pressure while preserving evidence integrity.",
    steps: [
      "Capture provider response and retry-after",
      "Enable capped exponential backoff",
      "Resume only after a clean read-only probe",
    ],
  },
  {
    index: "RB-03",
    title: "Unexpected PnL",
    copy: "Separate operational errors from strategy performance.",
    steps: [
      "Freeze parameters and execution state",
      "Reconcile fills, fees, open and closed outcomes",
      "Calculate offline before forming a hypothesis",
    ],
  },
];

function statusClass(status: Status) {
  return `status-chip status-${status.toLowerCase()}`;
}

function Overview({
  selected,
  selectedId,
  setSelectedId,
  briefVisible,
  setBriefVisible,
  brief,
  setBrief,
}: {
  selected: Bot;
  selectedId: string;
  setSelectedId: (id: string) => void;
  briefVisible: boolean;
  setBriefVisible: (value: boolean) => void;
  brief: BriefState;
  setBrief: (value: BriefState) => void;
}) {
  async function generateBrief() {
    setBriefVisible(true);
    setBrief({ kind: "loading" });

    try {
      const response = await fetch("/api/brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ botId: selected.id }),
      });
      const payload = (await response.json()) as {
        brief?: unknown;
        error?: unknown;
        mode?: unknown;
      };

      if (
        !response.ok ||
        typeof payload.brief !== "string" ||
        (payload.mode !== "ai" && payload.mode !== "demo")
      ) {
        throw new Error(
          typeof payload.error === "string"
            ? payload.error
            : "The AI summary service is temporarily unavailable.",
        );
      }

      setBrief({ kind: "ready", text: payload.brief, mode: payload.mode });
    } catch (error) {
      setBrief({
        kind: "error",
        text:
          error instanceof Error
            ? error.message
            : "The AI summary service is temporarily unavailable.",
      });
    }
  }

  return (
    <>
      <section className="hero">
        <div>
          <p className="eyebrow">OPERATIONS / RESEARCH AUTOMATION</p>
          <h1>Know what is running. Prove what happened.</h1>
          <p className="hero-copy">
            One evidence-aware command center for process health, data
            freshness, incident response, and guarded research cohorts.
          </p>
        </div>
        <div className="hero-status">
          <span className="live-indicator">CONTROL PLANE HEALTHY</span>
          <p className="sync-time">Demo snapshot В· 23 Jul 2026</p>
        </div>
      </section>

      <section className="metrics" aria-label="Fleet summary">
        {[
          ["Active agents", "1 / 4", "01", "One collecting evidence"],
          ["Fresh signals", "24h", "25", "Forward-test cohort"],
          ["Open incidents", "в€’1 today", "01", "RPC provider throttling"],
          ["Capital at risk", "guarded", "$0", "Paper / shadow only"],
        ].map(([label, delta, value, note]) => (
          <article className="metric-card" key={label}>
            <div className="metric-top">
              <span className="metric-label">{label}</span>
              <span className="metric-delta">{delta}</span>
            </div>
            <div className="metric-value">{value}</div>
            <span className="metric-note">{note}</span>
          </article>
        ))}
      </section>

      <section className="workspace">
        <article className="panel">
          <header className="panel-header">
            <div className="section-heading">
              <span className="section-dot" />
              <h2>Fleet pulse</h2>
            </div>
            <span className="panel-kicker">SELECT A SYSTEM</span>
          </header>
          <div className="bot-list">
            {bots.map((bot) => (
              <button
                type="button"
                className={`bot-row ${selectedId === bot.id ? "selected" : ""}`}
                key={bot.id}
                onClick={() => setSelectedId(bot.id)}
                aria-pressed={selectedId === bot.id}
              >
                <div className="bot-main">
                  <span
                    className="bot-icon"
                    style={{ "--accent": bot.accent } as CSSProperties}
                  >
                    {bot.icon}
                  </span>
                  <span>
                    <span className="bot-name">{bot.name}</span>
                    <span className="bot-meta">
                      {bot.venue} В· {bot.strategy}
                    </span>
                  </span>
                </div>
                <div className="data-cell">
                  <span className={statusClass(bot.status)}>{bot.status}</span>
                </div>
                <div className="data-cell">
                  <strong>{bot.evidence}</strong>
                  <span>freshness {bot.freshness}</span>
                </div>
                <div className="data-cell">
                  <strong>{bot.result}</strong>
                  <span>research state</span>
                </div>
                <span className="arrow">в†’</span>
              </button>
            ))}
          </div>
        </article>

        <div className="right-stack">
          <article className="panel">
            <header className="panel-header">
              <div className="section-heading">
                <span
                  className="section-dot"
                  style={{ background: selected.accent }}
                />
                <h2>System detail</h2>
              </div>
              <span className="panel-kicker">{selected.id}</span>
            </header>
            <div className="detail-body">
              <div className="detail-title">
                <div>
                  <h3>{selected.name}</h3>
                  <p>
                    {selected.venue} / {selected.strategy}
                  </p>
                </div>
                <span className={statusClass(selected.status)}>
                  {selected.status}
                </span>
              </div>
              <div className="detail-grid">
                {[
                  ["Process", selected.process],
                  ["Sample", selected.sample],
                  ["Guardrail", selected.guardrail],
                  ["Freshness", selected.freshness],
                ].map(([label, value]) => (
                  <div className="detail-stat" key={label}>
                    <span className="detail-label">{label}</span>
                    <strong>{value}</strong>
                  </div>
                ))}
              </div>
              <button
                type="button"
                className="brief-button"
                onClick={() => {
                  if (briefVisible && brief.kind !== "loading") {
                    setBriefVisible(false);
                    return;
                  }
                  void generateBrief();
                }}
                disabled={brief.kind === "loading"}
              >
                {brief.kind === "loading"
                  ? "GENERATING AI BRIEF"
                  : briefVisible
                    ? "HIDE OPS BRIEF"
                    : "GENERATE OPS BRIEF"}
              </button>
              {briefVisible && (
                <p className="brief">
                  {brief.kind === "loading" && "Preparing a concise AI operations brief..."}
                  {brief.kind === "ready" && (
                    <>
                      <strong>
                        {brief.mode === "ai"
                          ? "AI operations brief:"
                          : "Demo operations brief:"}
                      </strong>{" "}
                      {brief.text}
                    </>
                  )}
                  {brief.kind === "error" && <>{brief.text}</>}
                </p>
              )}
            </div>
          </article>

          <article className="panel">
            <header className="panel-header">
              <div className="section-heading">
                <span className="section-dot" />
                <h2>Evidence quality</h2>
              </div>
              <span className="panel-kicker">NO HYPE</span>
            </header>
            <div className="evidence-body">
              {[
                ["Data integrity", 92, "#b7f34c"],
                ["Sample maturity", 41, "#f1be58"],
                ["Operational uptime", 76, "#5ce1e6"],
              ].map(([label, value, color]) => (
                <div className="score-row" key={String(label)}>
                  <span className="score-label">{label}</span>
                  <span className="score-track">
                    <span
                      className="score-fill"
                      style={
                        {
                          width: `${value}%`,
                          "--score-color": color,
                        } as CSSProperties
                      }
                    />
                  </span>
                  <span className="score-number">{value}%</span>
                </div>
              ))}
              <p className="evidence-warning">
                <strong>NOT_EVALUATED:</strong> sample size is below the
                preregistered threshold. Open PnL is excluded from realized
                outcomes.
              </p>
            </div>
          </article>

          <article className="panel">
            <header className="panel-header">
              <div className="section-heading">
                <span className="section-dot" />
                <h2>Incident stream</h2>
              </div>
              <span className="panel-kicker">LATEST FIRST</span>
            </header>
            <div className="incident-list">
              {incidents.map((incident) => (
                <div
                  className="incident"
                  key={`${incident.time}-${incident.title}`}
                  style={
                    {
                      "--incident-color": incident.color,
                    } as CSSProperties
                  }
                >
                  <div className="incident-meta">
                    <span className="incident-time">{incident.time}</span>
                    <span className="incident-severity">
                      {incident.severity}
                    </span>
                  </div>
                  <strong>{incident.title}</strong>
                  <p>{incident.copy}</p>
                </div>
              ))}
            </div>
          </article>
        </div>
      </section>
    </>
  );
}

function Runbooks() {
  return (
    <section className="section-page">
      <div className="section-intro">
        <div>
          <p className="eyebrow">OPERATIONS / RESPONSE LIBRARY</p>
          <h1>Recovery should be boring.</h1>
          <p>
            Small, auditable procedures for the failures that actually happen:
            stale workers, rate limits, and unexplained results.
          </p>
        </div>
        <span className="demo-pill">3 ACTIVE RUNBOOKS</span>
      </div>
      <div className="runbook-grid">
        {runbooks.map((runbook) => (
          <article className="runbook-card" key={runbook.index}>
            <span className="runbook-index">{runbook.index}</span>
            <h3>{runbook.title}</h3>
            <p>{runbook.copy}</p>
            <ol className="step-list">
              {runbook.steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </article>
        ))}
      </div>
      <div className="technical-strip">
        <div>
          <span className="tech-label">Recovery principle</span>
          <div className="tech-value">
            Observe в†’ isolate в†’ restart once в†’ verify freshness
          </div>
        </div>
        <div>
          <span className="tech-label">Change policy</span>
          <div className="tech-value">No tuning during incident response</div>
        </div>
        <div>
          <span className="tech-label">Escalation</span>
          <div className="tech-value">
            Preserve stderr and state before intervention
          </div>
        </div>
      </div>
    </section>
  );
}

function Architecture() {
  return (
    <section className="section-page">
      <div className="section-intro">
        <div>
          <p className="eyebrow">ENGINEERING / SYSTEM DESIGN</p>
          <h1>Simple paths. Explicit boundaries.</h1>
          <p>
            Collection, normalization, evidence checks, and presentation stay
            separate so operational health never gets confused with strategy
            edge.
          </p>
        </div>
        <span className="outline-pill">PORTFOLIO BUILD v0.1</span>
      </div>
      <div className="architecture-grid">
        <article className="panel">
          <header className="panel-header">
            <div className="section-heading">
              <span className="section-dot" />
              <h2>Telemetry path</h2>
            </div>
            <span className="panel-kicker">READ ONLY</span>
          </header>
          <div className="architecture-body">
            <div className="system-map">
              {[
                [
                  "01 / Collectors",
                  "Process heartbeats, logs, snapshots, provider status.",
                ],
                [
                  "02 / Normalization API",
                  "Typed health records and consistent freshness rules.",
                ],
                [
                  "03 / Evidence engine",
                  "Closed versus open outcomes, thresholds, guardrails.",
                ],
                [
                  "04 / Control center",
                  "Operator-focused views, incident context, runbooks.",
                ],
              ].map(([title, copy]) => (
                <div className="system-node" key={title}>
                  <strong>{title}</strong>
                  <p>{copy}</p>
                </div>
              ))}
            </div>
          </div>
        </article>
        <article className="panel">
          <header className="panel-header">
            <div className="section-heading">
              <span className="section-dot" />
              <h2>Implementation stack</h2>
            </div>
            <span className="panel-kicker">CLOUDFLARE READY</span>
          </header>
          <div className="architecture-body">
            <p className="hero-copy">
              The demo ships as a responsive React application with a
              server-rendered health endpoint and server-only AI operations
              briefs. Credentials are never exposed to the browser.
            </p>
            <div className="stack-list" style={{ marginTop: 18 }}>
              {[
                "React 19",
                "TypeScript",
                "Next-compatible routing",
                "Cloudflare Workers",
                "Typed API",
                "Accessible UI",
                "Node tests",
                "OpenAI Responses API",
              ].map((tech) => (
                <span className="mini-tag" key={tech}>
                  {tech}
                </span>
              ))}
            </div>
            <div className="detail-grid" style={{ marginTop: 20 }}>
              {[
                ["Rendering", "SSR + client"],
                ["Deployment", "Edge worker"],
                ["Data mode", "Demo fixture"],
                ["Secrets", "Server only"],
              ].map(([label, value]) => (
                <div className="detail-stat" key={label}>
                  <span className="detail-label">{label}</span>
                  <strong>{value}</strong>
                </div>
              ))}
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}

export function BotOpsDashboard() {
  const [view, setView] = useState<View>("Overview");
  const [selectedId, setSelectedId] = useState(bots[0].id);
  const [briefVisible, setBriefVisible] = useState(false);
  const [brief, setBrief] = useState<BriefState>({ kind: "idle" });
  const [apiState, setApiState] = useState("checking");

  const selected = useMemo(
    () => bots.find((bot) => bot.id === selectedId) ?? bots[0],
    [selectedId],
  );

  useEffect(() => {
    fetch("/api/health")
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then(() => setApiState("online"))
      .catch(() => setApiState("offline"));
  }, []);

  useEffect(() => {
    setBriefVisible(false);
    setBrief({ kind: "idle" });
  }, [selectedId]);

  return (
    <div className="shell">
      <header className="topbar">
        <div className="brand">
          <div className="brand-lockup">
            <span className="brand-mark">BO</span>
            <span>BOTOPS</span>
            <span className="slash">//</span>
            <span>CONTROL CENTER</span>
          </div>
        </div>
        <div className="top-actions">
          <span className="demo-pill">DEMO TELEMETRY</span>
          <span className="outline-pill">API {apiState.toUpperCase()}</span>
        </div>
      </header>

      <div className="layout">
        <aside className="sidebar">
          <div>
            <p className="nav-label">Workspace</p>
            <nav className="nav-list" aria-label="Dashboard sections">
              {(["Overview", "Runbooks", "Architecture"] as View[]).map(
                (item) => (
                  <button
                    type="button"
                    key={item}
                    className={`nav-button ${view === item ? "active" : ""}`}
                    onClick={() => setView(item)}
                    aria-current={view === item ? "page" : undefined}
                  >
                    <span>{item}</span>
                    <span className="nav-badge">
                      {item === "Overview"
                        ? "4"
                        : item === "Runbooks"
                          ? "3"
                          : "5"}
                    </span>
                  </button>
                ),
              )}
            </nav>
          </div>
          <div className="side-card">
            <span className="detail-label">Safety mode</span>
            <strong>Read-only by design</strong>
            <p>
              No order placement, secrets, or live-capital controls exist in
              this portfolio demo.
            </p>
          </div>
        </aside>

        <main className="main">
          {view === "Overview" && (
            <Overview
              selected={selected}
              selectedId={selectedId}
              setSelectedId={setSelectedId}
              briefVisible={briefVisible}
              setBriefVisible={setBriefVisible}
              brief={brief}
              setBrief={setBrief}
            />
          )}
          {view === "Runbooks" && <Runbooks />}
          {view === "Architecture" && <Architecture />}

          <footer className="footer">
            <span>
              <strong>BotOps Control Center</strong> В· built for operational
              clarity
            </span>
            <span>Demo data В· no orders В· no investment claims</span>
          </footer>
        </main>
      </div>
    </div>
  );
}

