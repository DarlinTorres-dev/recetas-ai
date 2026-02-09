const BASE_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:8787"
    : "";

export async function askAI(question) {
  if (!question.trim()) {
    throw new Error("La pregunta está vacía");
  }

  const res = await fetch(`${BASE_URL}/api/ask`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question })
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Error al generar la receta");
  }

  const data = await res.json();
  return data.answer;
}
