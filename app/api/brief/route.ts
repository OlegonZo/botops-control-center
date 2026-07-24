type BotContext = {
  name: string;
  status: string;
  process: string;
  evidence: string;
  guardrail: string;
  next: string;
};

const model = "gpt-5.6-luna";
const requestWindowMs = 60 * 60 * 1000;
const requestLimit = 12;
const requestLedger = new Map<string, { count: number; resetAt: number }>();

const botContexts: Record<string, BotContext> = {
  move15: {
    name: "MEXC Move15 Research",
    status: "Running",
    process: "Healthy",
    evidence: "25 of 60 signals; 24 closed and 1 open",
    guardrail: "Paper only",
    next: "Hold parameters until the preregistered sample is complete.",
  },
  hyper: {
    name: "Hyperliquid Edge",
    status: "Paused",
    process: "Stopped",
    evidence: "10 of 30 positions; interim result is negative",
    guardrail: "No live capital",
    next: "Review exits offline before any restart or parameter change.",
  },
  poly: {
    name: "Polymarket Reward Shadow",
    status: "Complete",
    process: "Exited cleanly",
    evidence: "Five markets and two round trips",
    guardrail: "Six-hour cap",
    next: "Archive the cohort; there is insufficient evidence for an edge claim.",
  },
  solana: {
    name: "Solana Wallet Radar",
    status: "Blocked",
    process: "Backoff active after an HTTP 429",
    evidence: "Read-only telemetry is degraded",
    guardrail: "Cost ceiling",
    next: "Reduce cadence or rotate the RPC plan before resuming.",
  },
};

function allowRequest(request: Request) {
  const client = request.headers.get("cf-connecting-ip") ?? "anonymous";
  const now = Date.now();
  const current = requestLedger.get(client);

  if (!current || current.resetAt <= now) {
    requestLedger.set(client, { count: 1, resetAt: now + requestWindowMs });
    return true;
  }

  if (current.count >= requestLimit) return false;
  current.count += 1;
  return true;
}

function getOutputText(payload: unknown) {
  if (!payload || typeof payload !== "object") return null;
  const output = (payload as { output?: unknown }).output;
  if (!Array.isArray(output)) return null;

  const parts = output.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const content = (item as { content?: unknown }).content;
    if (!Array.isArray(content)) return [];
    return content.flatMap((part) => {
      if (!part || typeof part !== "object") return [];
      const candidate = part as { type?: unknown; text?: unknown };
      return candidate.type === "output_text" && typeof candidate.text === "string"
        ? [candidate.text]
        : [];
    });
  });

  return parts.join("\n").trim() || null;
}

function getDemoBrief(context: BotContext) {
  return [
    `- Operational fact: ${context.name} is ${context.status.toLowerCase()} and ${context.process.toLowerCase()}.`,
    `- Evidence limit: ${context.evidence}. Guardrail: ${context.guardrail}.`,
    `- Safe next action: ${context.next}`,
  ].join("\n");
}

export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!allowRequest(request)) {
    return Response.json(
      { error: "Brief limit reached. Try again in about an hour." },
      { status: 429 },
    );
  }

  let botId: unknown;
  try {
    botId = (await request.json()).botId;
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const context = typeof botId === "string" ? botContexts[botId] : undefined;
  if (!context) {
    return Response.json({ error: "Unknown system." }, { status: 400 });
  }

  if (!apiKey) {
    return Response.json({ brief: getDemoBrief(context), mode: "demo" });
  }

  const input = [
    "Write a concise operations brief for this portfolio-demo research system.",
    "Do not claim profitability, live trading, investment advice, or certainty.",
    "State the most important operational fact, the evidence limitation, and one safe next action.",
    "Use exactly three short bullet points. Plain language only.",
    "",
    `System: ${context.name}`,
    `Status: ${context.status}`,
    `Process: ${context.process}`,
    `Evidence: ${context.evidence}`,
    `Guardrail: ${context.guardrail}`,
    `Suggested next action: ${context.next}`,
  ].join("\n");

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        input,
        reasoning: { effort: "low" },
        max_output_tokens: 220,
      }),
    });

    if (!response.ok) {
      return Response.json(
        { error: "The AI summary service is temporarily unavailable." },
        { status: 502 },
      );
    }

    const brief = getOutputText(await response.json());
    if (!brief) {
      return Response.json(
        { error: "The AI summary returned no text." },
        { status: 502 },
      );
    }

    return Response.json({ brief, mode: "ai" });
  } catch {
    return Response.json(
      { error: "The AI summary service is temporarily unavailable." },
      { status: 502 },
    );
  }
}

