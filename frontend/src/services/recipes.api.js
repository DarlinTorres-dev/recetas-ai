export async function getRecipes() {
  const res = await fetch("/api/recipes");

  if (!res.ok) {
    throw new Error("Error al cargar recetas");
  }

  return res.json();
}
