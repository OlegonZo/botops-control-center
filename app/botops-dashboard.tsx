"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";

type Status = "Running" | "Paused" | "Complete" | "Blocked";
type View = "Overview" | "Runbooks" | "Architecture";

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
    sample: "24 closed Â· 1 open",
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
    result: "Interim âˆ’",
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
}: {
  selected: Bot;
  selectedId: string;
  setSelectedId: (id: string) => void;
  briefVisible: boolean;
  setBriefVisible: (value: boolean) => void;
}) {
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
          <p className="sync-time">Demo snapshot Â· 23 Jul 2026</p>
        </div>
      </section>

      <section className="metrics" aria-label="Fleet summary">
        {[
          ["Active agents", "1 / 4", "01", "One collecting evidence"],
          ["Fresh signals", "24h", "25", "Forward-test cohort"],
          ["Open incidents", "âˆ’1 today", "01", "RPC provider throttling"],
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
                      {bot.venue} Â· {bot.strategy}
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
                <span className="arrow">â†’</span>
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
                onClick={() => setBriefVisible(!briefVisible)}
              >
                {briefVisible ? "HIDE OPS BRIEF" : "GENERATE OPS BRIEF"}
              </button>
              {briefVisible && (
                <p className="brief">
                  <strong>Recommended next action:</strong> {selected.next} This
                  is a deterministic demo brief; OpenAI enrichment is
                  intentionally disconnected until a local key is configured.
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
        <span className="demo-pill">3 ACTIVE RUNBOOKS</span>8÷m­¢G§²ÚîÆ­yÖ7BÖFöÔ’ã"ãb‡&V7D’ã"ãb’’‡&V7B×6W'fW"ÖFöÒ×vV'6´’ã"ãb‡&V7BÖFöÔ’ã"ãb‡&V7D’ã"ãb’’‡&V7D’ã"ãb’‡vV'6´Rã‚ãB†W6'V–ÆDã#‚ã’’’‡&V7D’ã"ãb’‡G—W67&—DRã’ã2’‡f—FT‚ãã2„G—W2öæöFT#"ã’ã’’†W6'V–ÆDã#‚ã’†¦—F”"ãrã’‡FW'6W$RãC’ã’‡G7„Bã#2ã’“ ¢FWVæFVæ6–W3 ¢tVç–2÷&V7Bs¢ãã"†æW‡Dbã"ãb„&&VÂö6÷&Trã#’ãr’‡&V7BÖFöÔ’ã"ãb‡&V7D’ã"ãb’’‡&V7D’ã"ãb’’‡&V7BÖFöÔ’ã"ãb‡&V7D’ã"ãb’’‡&V7D’ã"ãb¢tfW&6VÂöörs¢ã‚ã`¢tf—FV§2÷ÇVv–â×&V7Bs¢bãã"‡f—FT‚ãã2„G—W2öæöFT#"ã’ã’’†W6'V–ÆDã#‚ã’†¦—F”"ãrã’‡FW'6W$RãC’ã’‡G7„Bã#2ã’¢–ÖvR×6—¦S¢"ãã ¢—FG"æ§3¢"ãBã ¢Öv–2×7G&–æs¢ã3ã#¢&V7C¢’ã"ã`¢&V7BÖFöÓ¢’ã"ãb‡&V7D’ã"ãb¢f—FS¢‚ãã2„G—W2öæöFT#"ã’ã’’†W6'V–ÆDã#‚ã’†¦—F”"ãrã’‡FW'6W$RãC’ã’‡G7„Bã#2ã¢f—FR×ÇVv–âÖ6öÖÖöæ§3¢ãã@¢f—FR×G66öæf–r×F‡3¢bãã‡G—W67&—DRã’ã2’‡f—FT‚ãã2„G—W2öæöFT#"ã’ã’’†W6'V–ÆDã#‚ã’†¦—F”"ãrã’‡FW'6W$RãC’ã’‡G7„Bã#2ã’¢vV"×f—FÇ3¢Bã"ã@¢÷F–öæÄFWVæFVæ6–W3 ¢tf—FV§2÷ÇVv–â×'62s¢ãRã#b‡&V7BÖFöÔ’ã"ãb‡&V7D’ã"ãb’’‡&V7B×6W'fW"ÖFöÒ×vV'6´’ã"ãb‡&V7BÖFöÔ’ã"ãb‡&V7D’ã"ãb’’‡&V7D’ã"ãb’‡vV'6´Rã‚ãB†W6'V–ÆDã#‚ã’’’‡&V7D’ã"ãb’‡f—FT‚ãã2„G—W2öæöFT#"ã’ã’’†W6'V–ÆDã#‚ã’†¦—F”"ãrã’‡FW'6W$RãC’ã’‡G7„Bã#2ã’¢&V7B×6W'fW"ÖFöÒ×vV'6³¢’ã"ãb‡&V7BÖFöÔ’ã"ãb‡&V7D’ã"ãb’’‡&V7D’ã"ãb’‡vV'6´Rã‚ãB†W6'V–ÆDã#‚ã’¢G&ç6—F—fUVW$FWVæFVæ6–W3 ¢ÒæW‡@¢Ò7W÷'G2Ö6öÆ÷ ¢ÒG—W67&—@ ¢f—FR×ÇVv–âÖ6öÖÖöæ§4ããC ¢FWVæFVæ6–W3 ¢6÷&ã¢‚ãrã ¢Öv–2×7G&–æs¢ã3ã#¢f—FR×ÇVv–âÖG–æÖ–2Ö–×÷'C¢ãbã  ¢f—FR×ÇVv–âÖG–æÖ–2Ö–×÷'Dãbã ¢FWVæFVæ6–W3 ¢6÷&ã¢‚ãrã ¢W2ÖÖöGVÆRÖÆW†W#¢ãrã ¢f7BÖvÆö#¢2ã2ã0¢Öv–2×7G&–æs¢ã3ã# ¢f—FR×G66öæf–r×F‡4bãã‡G—W67&—DRã’ã2’‡f—FT‚ãã2„G—W2öæöFT#"ã’ã’’†W6'V–ÆDã#‚ã’†¦—F”"ãrã’‡FW'6W$RãC’ã’‡G7„Bã#2ã’“ ¢FWVæFVæ6–W3 ¢FV'Vs¢BãBã0¢vÆö'&Wƒ¢ãã ¢G66öæf6³¢2ããb‡G—W67&—DRã’ã2¢f—FS¢‚ãã2„G—W2öæöFT#"ã’ã’’†W6'V–ÆDã#‚ã’†¦—F”"ãrã’‡FW'6W$RãC’ã’‡G7„Bã#2ã¢G&ç6—F—fUVW$FWVæFVæ6–W3 ¢Ò7W÷'G2Ö6öÆ÷ ¢ÒG—W67&—@ ¢f—FT‚ãã2„G—W2öæöFT#"ã’ã’’†W6'V–ÆDã#‚ã’†¦—F”"ãrã’‡FW'6W$RãC’ã’‡G7„Bã#2ã“ ¢FWVæFVæ6–W3 ¢Æ–v‡Fæ–æv773¢ã32ã ¢–6öÖF6ƒ¢BããP¢÷7F773¢‚ãRã# ¢&öÆÆF÷vã¢ãã¢F–ç–vÆö&'“¢ã"ãp¢÷F–öæÄFWVæFVæ6–W3 ¢tG—W2öæöFRs¢#"ã’ã¢W6'V–ÆC¢ã#‚ã¢g6WfVçG3¢"ã2ã0¢¦—F“¢"ãrã ¢FW'6W#¢RãC’ã ¢G7ƒ¢Bã#2ã ¢f—FVgTãã2‡f—FT‚ãã2„G—W2öæöFT#"ã’ã’’†W6'V–ÆDã#‚ã’†¦—F”"ãrã’‡FW'6W$RãC’ã’‡G7„Bã#2ã’“ ¢÷F–öæÄFWVæFVæ6–W3 ¢f—FS¢‚ãã2„G—W2öæöFT#"ã’ã’’†W6'V–ÆDã#‚ã’†¦—F”"ãrã’‡FW'6W$RãC’ã’‡G7„Bã#2ã ¢vF6‡6´"ãRã# ¢FWVæFVæ6–W3 ¢w&6VgVÂÖg3¢Bã"ã ¢vV"×f—FÇ4Bã"ãC¢·Ð ¢vV'6²×6÷W&6W42ãRã¢·Ð ¢vV'6´Rã‚ãB†W6'V–ÆDã#‚ã“ ¢FWVæFVæ6–W3 ¢tG—W2öW7G&VRs¢ãã¢tG—W2ö§6öâ×66†VÖs¢rããP¢tvV&76VÖ&Ç–§2ö7Bs¢ãBã¢tvV&76VÖ&Ç–§2÷v6ÒÖVF—Bs¢ãBã¢tvV&76VÖ&Ç–§2÷v6Ò×'6W"s¢ãBã¢6÷&ã¢‚ãrã ¢6÷&âÖ–×÷'B×†6W3¢ããB†6÷&ä‚ãrã¢'&÷w6W'6Æ—7C¢Bã#‚ãp¢6‡&öÖR×G&6RÖWfVçC¢ãã@¢Væ†æ6VB×&W6öÇfS¢Rã#Bã0¢W2ÖÖöGVÆRÖÆW†W#¢"ã2ã¢W6Æ–çB×66÷S¢Rãã¢WfVçG3¢2ã2ã ¢w&6VgVÂÖg3¢Bã"ã¢ÆöFW"×'VææW#¢Bã2ã ¢Ö–ÖRÖF#¢ãSBã ¢Ö–æ–Ö—¦W"×vV'6²×ÇVv–ã¢Rãbã†W6'V–ÆDã#‚ã’‡vV'6´Rã‚ãB†W6'V–ÆDã#‚ã’¢æVòÖ7–æ3¢"ãbã ¢66†VÖ×WF–Ç3¢Bã2ã0¢F&ÆS¢"ã2ã0¢vF6‡6³¢"ãRã ¢vV'6²×6÷W&6W3¢2ãRã¢G&ç6—F—fUVW$FWVæFVæ6–W3 ¢ÒtÖ–æ–g’Ö‡FÖÂöæöFRp¢Òt7v2ö6÷&Rp¢Òt7v2ö772p¢Òt7v2ö‡FÖÂp¢Ò6ÆVâÖ770¢Ò776ææð¢Ò776ð¢ÒW6'V–Æ@¢Ò‡FÖÂÖÖ–æ–f–W"×FW'6W ¢ÒÆ–v‡Fæ–æv770¢Ò÷7F770¢ÒVvÆ–g’Ö§0 ¢v†–6‚Ö&÷†VB×&–Ö—F—fTãã ¢FWVæFVæ6–W3 ¢—2Ö&–v–çC¢ãã ¢—2Ö&ööÆVâÖö&¦V7C¢ã"ã ¢—2ÖçVÖ&W"Öö&¦V7C¢ãã¢—2×7G&–æs¢ãã¢—2×7–Ö&öÃ¢ãã ¢v†–6‚Ö'V–ÇF–â×G—Tã"ã ¢FWVæFVæ6–W3 ¢6ÆÂÖ&÷VæC¢ãã@¢gVæ7F–öâç&÷F÷G—RææÖS¢ã"ã ¢†2×F÷7G&–æwFs¢ãã ¢—2Ö7–æ2ÖgVæ7F–öã¢"ãã¢—2ÖFFRÖö&¦V7C¢ãã ¢—2Öf–æÆ—¦F–öç&Vv—7G'“¢ãã¢—2ÖvVæW&F÷"ÖgVæ7F–öã¢ãã ¢—2×&VvWƒ¢ã"ã¢—2×vV·&Vc¢ãã¢—6'&“¢"ããP¢v†–6‚Ö&÷†VB×&–Ö—F—fS¢ãã¢v†–6‚Ö6öÆÆV7F–öã¢ãã ¢v†–6‚×G—VBÖ'&“¢ãã#  ¢v†–6‚Ö6öÆÆV7F–öäãã# ¢FWVæFVæ6–W3 ¢—2ÖÖ¢"ãã0¢—2×6WC¢"ãã0¢—2×vV¶Ö¢"ãã ¢—2×vV·6WC¢"ãã@ ¢v†–6‚×G—VBÖ'&”ãã## ¢FWVæFVæ6–W3 ¢f–Æ&ÆR×G—VBÖ'&—3¢ããp¢6ÆÂÖ&–æC¢ãã¢6ÆÂÖ&÷VæC¢ãã@¢f÷"ÖV6ƒ¢ã2ãP¢vWB×&÷Fó¢ãã¢v÷C¢ã"ã ¢†2×F÷7G&–æwFs¢ãã  ¢v†–6„"ãã# ¢FWVæFVæ6–W3 ¢—6W†S¢"ãã  ¢v÷&B×w&ã"ãS¢·Ð ¢v÷&¶W&Dã##cSRã ¢÷F–öæÄFWVæFVæ6–W3 ¢t6Æ÷VFfÆ&R÷v÷&¶W&BÖF'v–âÓcBs¢ã##cSRã¢t6Æ÷VFfÆ&R÷v÷&¶W&BÖF'v–âÖ&ÓcBs¢ã##cSRã¢t6Æ÷VFfÆ&R÷v÷&¶W&BÖÆ–çW‚ÓcBs¢ã##cSRã¢t6Æ÷VFfÆ&R÷v÷&¶W&BÖÆ–çW‚Ö&ÓcBs¢ã##cSRã¢t6Æ÷VFfÆ&R÷v÷&¶W&B×v–æF÷w2ÓcBs¢ã##cSRã ¢w&ævÆW$Bã“"ã ¢FWVæFVæ6–W3 ¢t6Æ÷VFfÆ&Rö·bÖ76WBÖ†æFÆW"s¢ãRã ¢t6Æ÷VFfÆ&R÷VæVçb×&W6WBs¢"ãbã‡VæVçd"ãã×&2ã#B’‡v÷&¶W&Dã##cSRã¢&Æ¶S2×v6Ó¢"ããP¢W6'V–ÆC¢ã#rã0¢Ö–æ–fÆ&S¢Bã##cSRã ¢F‚×Fò×&VvW‡¢bã2ã ¢VæVçc¢"ãã×&2ã#@¢v÷&¶W&C¢ã##cSRã¢÷F–öæÄFWVæFVæ6–W3 ¢g6WfVçG3¢"ã2ã0¢G&ç6—F—fUVW$FWVæFVæ6–W3 ¢Ò'VffW'WF–À¢ÒWFbÓ‚×fÆ–FFP ¢w4‚ã‚ã¢·Ð ¢–ÆÆ—7D2ãã¢·Ð ¢–ö7Fò×VWVTãã¢·Ð ¢–övÖÆ–÷WD2ã"ã¢·Ð ¢–÷V6‚Ö6÷&Tã2ã3 ¢FWVæFVæ6–W3 ¢t÷–ç72öW†6WF–öâs¢ã"ã0¢W'&÷"×7F6²×'6W"ÖW3¢ããP ¢–÷V6„BããÖ&WFã ¢FWVæFVæ6–W3 ¢t÷–ç72ö6öÆ÷'2s¢Bãã`¢t÷–ç72öGV×W"s¢ãbãP¢t7VVBÖ†–v†Æ–v‡Bö6÷&Rs¢ã"ãp¢6öö¶–S¢ãã¢–÷V6‚Ö6÷&S¢ã2ã0 ¢¦öB×fÆ–FF–öâÖW'&÷$Bãã"‡¦öDBãBã2“ ¢FWVæFVæ6–W3 ¢¦öC¢BãBã0 ¢¦öDBãBã3¢·Ð