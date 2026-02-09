import { healthRoutes } from "./routes/health.routes";
import { recipesRoute } from "./routes/recipes.route";
import { askRoute } from "./routes/ask.route";

export async function router(request, ENV = {}) {
  const url = new URL(request.url);
  const method = request.method;

  // CORS preflight
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

  const healthResponse = healthRoutes({ url, method });
  if (healthResponse) {
    healthResponse.headers.set("Access-Control-Allow-Origin", "*");
    return healthResponse;
  }

  if (url.pathname === "/api/recipes") {
    const res = recipesRoute(request);
    res.headers.set("Access-Control-Allow-Origin", "*");
    return res;
  }

  if (url.pathname === "/api/ask") {
    const res = await askRoute(request, ENV);
    res.headers.set("Access-Control-Allow-Origin", "*");
    return res;
  }

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
