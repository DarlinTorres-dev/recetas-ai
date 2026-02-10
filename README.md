# 🍽️ Recetas AI

Aplicación web para generar recetas de cocina utilizando **inteligencia artificial**, además de consultar recetas predefinidas.  
Proyecto desarrollado con fines de **práctica profesional y portafolio**, aplicando una arquitectura moderna y desacoplada.

La IA funciona **sin límites ni costos**, usando modelos locales mediante **Ollama**.

---

## 🚀 Funcionalidades

- 🤖 Generación de recetas con IA local (Ollama + LLaMA 3)
- 📝 Historial de preguntas y respuestas guardado en el navegador (LocalStorage)
- 📋 Listado de recetas base desde el backend
- ⚡ Backend ligero con Cloudflare Workers
- 🌐 Frontend moderno con React
- 🔒 Sin uso de APIs de pago ni claves externas

---

## 🧱 Stack Tecnológico

### Frontend
- React
- Vite
- JavaScript
- Fetch API
- LocalStorage

### Backend
- Cloudflare Workers
- Wrangler
- JavaScript
- Ollama (IA local)

---

## 🏗️ Arquitectura

El proyecto sigue una **arquitectura desacoplada**:

- **Frontend**
  - Consume el backend vía HTTP (`/api/recipes` y `/api/ask`)

- **Backend (Worker)**
  - Actúa como API gateway
  - Maneja CORS y rutas
  - Se comunica con Ollama local

- **IA Local**
  - Ollama ejecutando modelos como `llama3`
  - Sin límites de uso ni costos

Esta arquitectura permite:
- Escalabilidad
- Fácil mantenimiento
- Sustitución futura de la IA sin modificar el frontend

---

## 🧠 IA Local (Ollama)

### Requisitos
- Tener Ollama instalado
- Descargar un modelo, por ejemplo:

```bash
ollama pull llama3
restricciones

👨‍💻 Autor

Darlin Torres
Proyecto de práctica y aprendizaje en desarrollo web moderno e inteligencia artificial.
