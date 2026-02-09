export function healthRoutes({ url, method }) {
  if (url.pathname === "/api/health" && method === "GET") {
    return new Response(
      JSON.stringify({
        status: "ok",
        service: "recetas-ai-api",
        timestamp: new Date().toISOString()
      }),
      {
        headers: { "Content-Type": "application/json" }
      }
    );
  }

  return null;
}
