import { getRecipes } from "../services/recipes.service";

export function recipesRoute(request) {
  if (request.method !== "GET") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const recipes = getRecipes();

  return new Response(JSON.stringify(recipes), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    }
  });
}
