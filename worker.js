export default {
  async fetch(request) {
    const url = new URL(request.url);

    // Proxy para el backend local
    if (url.pathname.startsWith("/api")) {
      return fetch("http://localhost:8788" + url.pathname, {
        method: request.method,
        headers: request.headers,
        body: request.body
      });
    }

    return new Response("Recetas AI Worker funcionando");
  }
};
