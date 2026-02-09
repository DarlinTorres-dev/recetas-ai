import { healthRoutes } from "./routes/health.routes";
import { recipesRoute } from "./routes/recipes.route";

/**
 * Router principal de la app
 */
export function router(request) {
  const url = new URL(request.url);
  const method = request.method;

  // === Manejar CORS preflight ===
  if (method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  // === Health routes ===
  const healthResponse = healthRoutes({ url, method });
  if (healthResponse) {
    // Agregamos CORS en la respuesta
    healthResponse.headers.set("Access-Control-Allow-Origin", "*");
    return healthResponse;
  }

  // === Recipes route ===
  if (url.pathname === "/api/recipes") {
    const res = recipesRoute(request);
    // Agregamos CORS en la respuesta
    res.headers.set("Access-Control-Allow-Origin", "*");
    return res;
  }

  // === Not found ===
  return new Response(
    JSON.stringify({ error: "Not Found" }),
    {
      status: 404,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*", // CORS también para 404
      },
    }
  );
}
