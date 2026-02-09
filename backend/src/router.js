import { healthRoutes } from "./routes/health.routes";
import { recipesRoute } from "./routes/recipes.route";

/**
 * Router principal de la app
 */
export function router(request) {
  const url = new URL(request.url);
  const method = request.method;

  // Health
  const healthResponse = healthRoutes({ url, method });
  if (healthResponse) return healthResponse;

  // Recipes
  if (url.pathname === "/api/recipes") {
    return recipesRoute(request);
  }

  // Not found
  return new Response(
    JSON.stringify({ error: "Not Found" }),
    {
      status: 404,
      headers: { "Content-Type": "application/json" },
    }
  );
}
