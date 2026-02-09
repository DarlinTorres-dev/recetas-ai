import OpenAI from "openai";

/**
 * Ruta /api/ask para generar recetas con OpenAI
 * Compatible con:
 * - Cloudflare Workers (ENV.OPENAI_API_KEY)
 * - Node local (process.env.OPENAI_API_KEY)
 */
export async function askRoute(request, ENV = {}) {
  // Solo POST
  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    // Leer body
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

    // === Obtener API KEY de forma SEGURA ===
    let apiKey;

    // Cloudflare Workers
    if (ENV && ENV.OPENAI_API_KEY) {
      apiKey = ENV.OPENAI_API_KEY;
    }
    // Node local
    else if (
      typeof process !== "undefined" &&
      process.env &&
      process.env.OPENAI_API_KEY
    ) {
      apiKey = process.env.OPENAI_API_KEY;
    }

    if (!apiKey) {
      console.error("OPENAI_API_KEY no configurada");
      return new Response(
        JSON.stringify({ error: "OPENAI_API_KEY no configurada" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    console.log("OPENAI_API_KEY detectada");

    // === Cliente OpenAI (OBLIGATORIO pasar fetch en Workers) ===
    const client = new OpenAI({
      apiKey,
      fetch
    });

    // === Llamada a OpenAI (API nueva Responses) ===
    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "system",
          content:
            "Eres un chef experto que da recetas claras, detalladas y fáciles de seguir."
        },
        {
          role: "user",
          content: `Dame una receta para: ${question}`
        }
      ],
      temperature: 0.7,
      max_output_tokens: 500
    });

    const answer =
      response.output_text ||
      "No se pudo generar la receta.";

    return new Response(
      JSON.stringify({ answer }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" }
      }
    );
  } catch (err) {
    console.error("Error en /api/ask:", err);

    return new Response(
      JSON.stringify({
        error: "Error al generar la receta",
        details: err?.message || "Error desconocido"
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
}
