export async function getRecipes() {
  const res = await fetch("http://localhost:8787/api/recipes");

  if (!res.ok) {
    throw new Error("Error al cargar recetas");
  }

  return res.json();
}
