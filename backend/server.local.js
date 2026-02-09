// server.local.js
import { router } from "./src/router.js";
import 'dotenv/config';
import http from "http";

const PORT = 8787;

const server = http.createServer(async (req, res) => {
  try {
    const response = await router(req);

    // Pasar headers
    response.headers.forEach((value, key) => res.setHeader(key, value));

    res.statusCode = response.status;
    const body = await response.text();
    res.end(body);
  } catch (err) {
    console.error(err);
    res.statusCode = 500;
    res.end("Internal Server Error");
  }
});

server.listen(PORT, () => {
  console.log(`Servidor Node local corriendo en http://localhost:${PORT}`);
});
