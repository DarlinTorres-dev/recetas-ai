// frontend/src/pages/Home.jsx
import { useEffect, useState } from "react";
import { getRecipes } from "../services/recipes.api";
import { askAI } from "../services/recipes.ai";

export default function Home() {
  // Estado para la IA
  const [question, setQuestion] = useState("");
  const [recipeResult, setRecipeResult] = useState("");
  const [history, setHistory] = useState(
    () => JSON.parse(localStorage.getItem("history")) || []
  );
  const [loadingAI, setLoadingAI] = useState(false); // nuevo estado para loader de IA

  // Estado para recetas guardadas
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar recetas al montar el componente
  useEffect(() => {
    getRecipes()
      .then(setRecipes)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // Guardar historial en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem("history", JSON.stringify(history));
  }, [history]);

  // Función para preguntar a la IA
  const handleAsk = async () => {
    if (!question.trim()) return;

    setLoadingAI(true); // activa loader
    setRecipeResult(""); // limpia resultado anterior

    try {
      const result = await askAI(question);
      setRecipeResult(result);
      setHistory((prev) => [{ question, result }, ...prev]);
      setQuestion(""); // limpia el input
    } catch (err) {
      setRecipeResult(`❌ Error al generar la receta: ${err.message}`);
    } finally {
      setLoadingAI(false); // desactiva loader
    }
  };

  // Función para limpiar historial
  const clearHistory = () => setHistory([]);

  return (
    <div style={{ maxWidth: "600px", margin: "2rem auto", padding: "1rem" }}>
      <h1>🍽️ Recetas AI</h1>

      {/* Input para la pregunta a la IA */}
      <input
        type="text"
        placeholder="¿Qué puedo cocinar hoy?"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        style={{ width: "100%", padding: "0.5rem" }}
        disabled={loadingAI} // desactiva input mientras se genera
      />

      <button
        onClick={handleAsk}
        style={{ marginTop: "1rem" }}
        disabled={loadingAI} // desactiva botón mientras se genera
      >
        {loadingAI ? "Generando..." : "Preguntar a la IA"}
      </button>

      {/* Resultado de la IA */}
      {recipeResult && (
        <div style={{ marginTop: "2rem" }}>
          <h3>Resultado IA</h3>
          <p>{recipeResult}</p>
        </div>
      )}

      {/* Historial de preguntas */}
      {history.length > 0 && (
        <div style={{ marginTop: "2rem" }}>
          <h3>
            Historial de Preguntas{" "}
            <button
              onClick={clearHistory}
              style={{
                marginLeft: "1rem",
                padding: "0.2rem 0.5rem",
                fontSize: "0.9rem",
                cursor: "pointer",
              }}
            >
              Limpiar
            </button>
          </h3>
          <ul>
            {history.map((h, i) => (
              <li key={i} style={{ marginBottom: "0.5rem" }}>
                <strong>Q:</strong> {h.question} <br />
                <strong>A:</strong> {h.result}
              </li>
            ))}
          </ul>
        </div>
      )}

      <hr style={{ margin: "2rem 0" }} />

      {/* Lista de recetas guardadas */}
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
