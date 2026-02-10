/**
 * Ruta /api/ask usando IA LOCAL (Ollama)
 * Requisitos:
 * - Ollama corriendo: ollama serve
 * - Modelo descargado: llama3
 * - Ejecutar backend con: wrangler dev --local
 */
export async function askRoute(request) {
  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    const body = await request.json();
    const question = body.question?.trim();

    if (!question) {
      return new Response(
        JSON.stringify({ error: "Pregunta vacía" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    const prompt = `
Eres un chef experto.
Da recetas claras, detalladas y fáciles de seguir.

Pregunta:
${question}

Devuelve la receta paso a paso.
`;

    const ollamaResponse = await fetch("http://127.0.0.1:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama3",
        prompt,
        stream: false
      })
    });

    if (!ollamaResponse.ok) {
      const text = await ollamaResponse.text();
      throw new Error(`Ollama error: ${text}`);
    }

    const data = await ollamaResponse.json();

    return new Response(
      JSON.stringify({
        answer: data.response?.trim() || "Sin respuesta"
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" }
      }
    );
  } catch (err) {
    console.error("Error /api/ask:", err);

    return new Response(
      JSON.stringify({
        error: "Error al generar la receta",
        details: err.message
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
}
