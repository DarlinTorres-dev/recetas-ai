import { healthRoutes } from "./routes/health.routes";

/**
 * Router principal de la app
 */
export function router(request) {
  const url = new URL(request.url);
  const method = request.method;

  // Health routes
  const healthResponse = healthRoutes({ url, method });
  if (healthResponse) return healthResponse;

  // Si no coincide ninguna ruta
  return new Response(
    JSON.stringify({ error: "Not Found" }),
    {
      status: 404,
      headers: { "Content-Type": "application/json" },
    }
  );
}
