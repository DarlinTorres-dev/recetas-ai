import { useState } from "react";

export default function Home() {
  const [question, setQuestion] = useState("");
  const [recipe, setRecipe] = useState("");

  const handleAsk = () => {
    // luego esto llamará al backend
    setRecipe("Aquí aparecerá tu receta generada por la IA 🍝");
  };

  return (
    <div style={{ maxWidth: "600px", margin: "2rem auto" }}>
      <h1>🍽️ Recetas AI</h1>

      <input
        type="text"
        placeholder="¿Qué puedo cocinar hoy?"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        style={{ width: "100%", padding: "0.5rem" }}
      />

      <button onClick={handleAsk} style={{ marginTop: "1rem" }}>
        Preguntar a la IA
      </button>

      {recipe && (
        <div style={{ marginTop: "2rem" }}>
          <h3>Resultado</h3>
          <p>{recipe}</p>
        </div>
      )}
    </div>
  );
}
