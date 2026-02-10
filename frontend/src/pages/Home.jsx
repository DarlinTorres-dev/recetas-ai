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
  const [loadingAI, setLoadingAI] = useState(false);
  const [expandedItems, setExpandedItems] = useState([]); // nuevo estado para controlar items expandidos

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

    setLoadingAI(true);
    setRecipeResult("");

    try {
      const result = await askAI(question);
      setRecipeResult(result);
      setHistory((prev) => [{ question, result }, ...prev]);
      setQuestion("");
    } catch (err) {
      setRecipeResult(`❌ Error al generar la receta: ${err.message}`);
    } finally {
      setLoadingAI(false);
    }
  };

  // Función para limpiar historial
  const clearHistory = () => {
    setHistory([]);
    setExpandedItems([]);
  };

  // Función para expandir/colapsar items del historial
  const toggleExpand = (index) => {
    setExpandedItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
        {/* Header */}
        <header style={styles.header}>
          <h1 style={styles.title}>Mi Libro de Recetas</h1>
          <p style={styles.subtitle}>Descubre y crea deliciosas recetas</p>
        </header>

        {/* Sección de IA */}
        <section style={styles.aiSection}>
          <h2 style={styles.sectionTitle}>¿Qué cocinarás hoy?</h2>
          
          <div style={styles.searchBox}>
            <input
              type="text"
              placeholder="Ej: Algo rápido con pollo y arroz..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAsk()}
              style={styles.input}
              disabled={loadingAI}
            />
            <button
              onClick={handleAsk}
              style={{...styles.button, ...(loadingAI ? styles.buttonDisabled : {})}}
              disabled={loadingAI}
            >
              {loadingAI ? "Buscando..." : "Buscar receta"}
            </button>
          </div>

          {/* Resultado de la IA */}
          {recipeResult && (
            <div style={styles.resultCard}>
              <div style={styles.resultHeader}>
                <span style={styles.resultIcon}>👨‍🍳</span>
                <h3 style={styles.resultTitle}>Sugerencia del chef</h3>
              </div>
              <p style={styles.resultText}>{recipeResult}</p>
            </div>
          )}
        </section>

        {/* Historial */}
        {history.length > 0 && (
          <section style={styles.historySection}>
            <div style={styles.historyHeader}>
              <h3 style={styles.historyTitle}>Búsquedas recientes</h3>
              <button onClick={clearHistory} style={styles.clearButton}>
                Limpiar historial
              </button>
            </div>
            
            <div style={styles.historyList}>
              {history.map((h, i) => (
                <div key={i} style={styles.historyItem}>
                  <div style={styles.historyQuestionRow}>
                    <div style={styles.historyQuestion}>
                      <span style={styles.historyLabel}>Pregunta:</span>
                      <span>{h.question}</span>
                    </div>
                    <button 
                      onClick={() => toggleExpand(i)}
                      style={styles.toggleButton}
                    >
                      {expandedItems.includes(i) ? "Ver menos" : "Ver más"}
                    </button>
                  </div>
                  
                  {expandedItems.includes(i) && (
                    <div style={styles.historyAnswer}>
                      <span style={styles.historyLabel}>Respuesta:</span>
                      <span>{h.result}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Separador */}
        <div style={styles.divider}></div>

        {/* Lista de recetas guardadas */}
        <section style={styles.recipesSection}>
          <h2 style={styles.sectionTitle}>Recetas guardadas</h2>
          
          {loading && (
            <div style={styles.loadingState}>
              <div style={styles.spinner}></div>
              <p>Cargando recetas...</p>
            </div>
          )}
          
          {error && (
            <div style={styles.errorState}>
              <p>❌ {error}</p>
            </div>
          )}
          
          {!loading && !error && recipes.length === 0 && (
            <div style={styles.emptyState}>
              <p>No hay recetas guardadas todavía</p>
            </div>
          )}
          
          {!loading && !error && recipes.length > 0 && (
            <div style={styles.recipeGrid}>
              {recipes.map((r) => (
                <div key={r.id} style={styles.recipeCard}>
                  <div style={styles.recipeCardHeader}>
                    <h3 style={styles.recipeName}>{r.name}</h3>
                  </div>
                  <div style={styles.recipeCardFooter}>
                    <span style={styles.recipeTime}>
                      <span style={styles.timeIcon}>⏱️</span>
                      {r.time} min
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(to bottom, #fdf8f3 0%, #ffffff 100%)',
    padding: '2rem 1rem',
  },
  wrapper: {
    maxWidth: '900px',
    margin: '0 auto',
  },
  header: {
    textAlign: 'center',
    marginBottom: '3rem',
    paddingBottom: '1.5rem',
    borderBottom: '2px solid #e8d5c4',
  },
  title: {
    fontSize: '2.5rem',
    color: '#2c1810',
    marginBottom: '0.5rem',
    fontWeight: '700',
    letterSpacing: '-0.5px',
  },
  subtitle: {
    fontSize: '1.1rem',
    color: '#8b6f47',
    fontWeight: '400',
  },
  aiSection: {
    backgroundColor: '#ffffff',
    padding: '2rem',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    marginBottom: '2rem',
  },
  sectionTitle: {
    fontSize: '1.5rem',
    color: '#2c1810',
    marginBottom: '1.5rem',
    fontWeight: '600',
  },
  searchBox: {
    display: 'flex',
    gap: '0.75rem',
    marginBottom: '1.5rem',
  },
  input: {
    flex: '1',
    padding: '0.875rem 1rem',
    fontSize: '1rem',
    border: '2px solid #e8d5c4',
    borderRadius: '8px',
    outline: 'none',
    transition: 'border-color 0.2s',
    fontFamily: 'inherit',
  },
  button: {
    padding: '0.875rem 1.75rem',
    fontSize: '1rem',
    fontWeight: '600',
    color: '#ffffff',
    backgroundColor: '#c17a4a',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    whiteSpace: 'nowrap',
  },
  buttonDisabled: {
    backgroundColor: '#d4a574',
    cursor: 'not-allowed',
  },
  resultCard: {
    backgroundColor: '#fdf8f3',
    padding: '1.5rem',
    borderRadius: '8px',
    border: '1px solid #e8d5c4',
  },
  resultHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '1rem',
  },
  resultIcon: {
    fontSize: '1.75rem',
  },
  resultTitle: {
    fontSize: '1.25rem',
    color: '#2c1810',
    fontWeight: '600',
    margin: '0',
  },
  resultText: {
    fontSize: '1rem',
    lineHeight: '1.6',
    color: '#4a3728',
    margin: '0',
    whiteSpace: 'pre-wrap',
  },
  historySection: {
    backgroundColor: '#ffffff',
    padding: '2rem',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    marginBottom: '2rem',
  },
  historyHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
  },
  historyTitle: {
    fontSize: '1.25rem',
    color: '#2c1810',
    fontWeight: '600',
    margin: '0',
  },
  clearButton: {
    padding: '0.5rem 1rem',
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#8b6f47',
    backgroundColor: 'transparent',
    border: '1px solid #e8d5c4',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  historyList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  historyItem: {
    padding: '1rem',
    backgroundColor: '#fdf8f3',
    borderRadius: '8px',
    borderLeft: '3px solid #c17a4a',
  },
  historyQuestionRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '1rem',
  },
  historyQuestion: {
    flex: '1',
    fontSize: '0.95rem',
  },
  toggleButton: {
    padding: '0.4rem 0.875rem',
    fontSize: '0.85rem',
    fontWeight: '500',
    color: '#c17a4a',
    backgroundColor: '#ffffff',
    border: '1px solid #e8d5c4',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    whiteSpace: 'nowrap',
  },
  historyAnswer: {
    marginTop: '0.75rem',
    paddingTop: '0.75rem',
    borderTop: '1px solid #e8d5c4',
    fontSize: '0.95rem',
    color: '#4a3728',
  },
  historyLabel: {
    fontWeight: '600',
    color: '#8b6f47',
    marginRight: '0.5rem',
  },
  divider: {
    height: '1px',
    backgroundColor: '#e8d5c4',
    margin: '3rem 0',
  },
  recipesSection: {
    marginBottom: '2rem',
  },
  loadingState: {
    textAlign: 'center',
    padding: '3rem',
    color: '#8b6f47',
  },
  spinner: {
    width: '40px',
    height: '40px',
    margin: '0 auto 1rem',
    border: '3px solid #e8d5c4',
    borderTop: '3px solid #c17a4a',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  errorState: {
    textAlign: 'center',
    padding: '2rem',
    backgroundColor: '#fff5f5',
    borderRadius: '8px',
    color: '#c53030',
  },
  emptyState: {
    textAlign: 'center',
    padding: '3rem',
    color: '#8b6f47',
    backgroundColor: '#fdf8f3',
    borderRadius: '8px',
  },
  recipeGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '1.25rem',
  },
  recipeCard: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    overflow: 'hidden',
    boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
    transition: 'transform 0.2s, box-shadow 0.2s',
    cursor: 'pointer',
    border: '1px solid #f0e6dc',
  },
  recipeCardHeader: {
    padding: '1.25rem',
    backgroundColor: '#fdf8f3',
    borderBottom: '1px solid #e8d5c4',
  },
  recipeName: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#2c1810',
    margin: '0',
  },
  recipeCardFooter: {
    padding: '1rem 1.25rem',
    display: 'flex',
    alignItems: 'center',
  },
  recipeTime: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.95rem',
    color: '#8b6f47',
    fontWeight: '500',
  },
  timeIcon: {
    fontSize: '1.1rem',
  },
};