export async function GET() {
  return Response.json(
    {
      status: "ok",
      mode: "demo",
      service: "botops-control-center",
      version: "0.1.0",
      checkedAt: new Date().toISOString(),
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
