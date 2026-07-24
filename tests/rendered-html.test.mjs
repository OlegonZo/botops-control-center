import assert from "node:assert/strict";
import test from "node:test";

const workerUrl = new URL("../dist/server/index.js", import.meta.url);
workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
const { default: worker } = await import(workerUrl.href);

const env = {
  ASSETS: {
    fetch: async () => new Response("Not found", { status: 404 }),
  },
};

const ctx = {
  waitUntil() {},
  passThroughOnException() {},
};

test("server-renders the BotOps dashboard shell", async () => {
  const response = await worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    env,
    ctx,
  );

  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>BotOps Control Center/);
  assert.match(html, /Know what is running/);
  assert.match(html, /DEMO TELEMETRY/);
  assert.match(html, /Fleet pulse/);
  assert.match(html, /No order placement/);
  assert.doesNotMatch(html, /codex-preview/);
  assert.doesNotMatch(html, /react-loading-skeleton/);
});

test("health endpoint exposes safe demo metadata", async () => {
  const response = await worker.fetch(
    new Request("http://localhost/api/health"),
    env,
    ctx,
  );

  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(body.status, "ok");
  assert.equal(body.mode, "demo");
  assert.equal(body.service, "botops-control-center");
  assert.equal(Object.hasOwn(body, "apiKey"), false);
});

test("brief endpoint returns a safe demo fallback without runtime configuration", async () => {
  const response = await worker.fetch(
    new Request("http://localhost/api/brief", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ botId: "move15" }),
    }),
    env,
    ctx,
  );

  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(Object.hasOwn(body, "apiKey"), false);
  assert.equal(body.mode, "demo");
  assert.match(body.brief, /Operational fact/i);
});

