export default {
  fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Health check
    if (url.pathname === "/api/health" && request.method === "GET") {
      return new Response(
        JSON.stringify({
          status: "ok",
          service: "recetas-ai-api",
          timestamp: new Date().toISOString(),
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Ruta no encontrada
    return new Response(
      JSON.stringify({ error: "Not Found" }),
      { status: 404, headers: { "Content-Type": "application/json" } }
    );
  },
};
