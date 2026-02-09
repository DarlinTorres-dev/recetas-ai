import { getRecipes } from "../services/recipes.service";

export function recipesRoute(request) {
  if (request.method !== "GET") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const recipes = getRecipes();

  return new Response(JSON.stringify(recipes), {
    headers: { "Content-Type": "application/json" }
  });
}
