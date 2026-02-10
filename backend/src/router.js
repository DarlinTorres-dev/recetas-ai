import { healthRoutes } from "./routes/health.routes.js";
import { recipesRoute } from "./routes/recipes.route.js";
import { askRoute } from "./routes/ask.route.js";

/**
 * Router principal del Worker
 * Compatible con:
 * - Cloudflare Workers (wrangler dev / deploy)
 * - IA local vía Ollama
 */
export async function router(request, ENV = {}) {
  const url = new URL(request.url);
  const method = request.method;

  // =========================
  // CORS PREFLIGHT
  // =========================
  if (method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
      }
    });
  }

  // =========================
  // HEALTH CHECK
  // =========================
  const healthResponse = healthRoutes({ url, method });
  if (healthResponse) {
    healthResponse.headers.set("Access-Control-Allow-Origin", "*");
    return healthResponse;
  }

  // =========================
  // RECETAS MOCK / DB
  // =========================
  if (url.pathname === "/api/recipes") {
    const res = await recipesRoute(request);
    res.headers.set("Access-Control-Allow-Origin", "*");
    return res;
  }

  // =========================
  // IA (OLLAMA LOCAL)
  // =========================
  if (url.pathname === "/api/ask") {
    const res = await askRoute(request);
    res.headers.set("Access-Control-Allow-Origin", "*");
    return res;
  }

  // =========================
  // NOT FOUND
  // =========================
  return new Response(
    JSON.stringify({ error: "Not Found" }),
    {
      status: 404,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    }
  );
}
