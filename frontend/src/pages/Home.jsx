import { useEffect, useState } from "react";
import { getRecipes } from "../services/recipes.api";

export default function Home() {
  // IA
  const [question, setQuestion] = useState("");
  const [recipeResult, setRecipeResult] = useState("");

  // Recetas
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getRecipes()
      .then(setRecipes)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleAsk = () => {
    // luego esto llamará al backend con IA
    setRecipeResult("Aquí aparecerá tu receta generada por la IA 🍝");
  };

  return (
    <div style={{ maxWidth: "600px", margin: "2rem auto", padding: "1rem" }}>
      <h1>🍽️ Recetas AI</h1>

      {/* Pregunta a la IA */}
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

      {recipeResult && (
        <div style={{ marginTop: "2rem" }}>
          <h3>Resultado IA</h3>
          <p>{recipeResult}</p>
        </div>
      )}

      <hr style={{ margin: "2rem 0" }} />

      {/* Lista de recetas */}
      <h2>📋 Recetas guardadas</h2>

      {loading && <p>⏳ Cargando recetas...</p>}
      {error && <p>❌ {error}</p>}

      {!loading && !error && (
        <ul>
          {recipes.map((r) => (
            <li key={r.id}>
              <strong>{r.name}</strong> — ⏱️ {r.time} min
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
