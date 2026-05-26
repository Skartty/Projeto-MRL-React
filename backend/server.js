require("dotenv").config();
const fs = require("fs");
const http = require("http");
const https = require("https");
const path = require("path");
const express = require("express");
const cors = require("cors");
const { inicializarBanco } = require("./src/database/initializeDatabase");

const authRoutes = require("./src/presentation/routes/authRoutes");
const clienteRoutes = require("./src/presentation/routes/clienteRoutes");
const projetoRoutes = require("./src/presentation/routes/projetoRoutes");
const contratoRoutes = require("./src/presentation/routes/contratoRoutes");

const app = express();

const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:5173,https://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/clientes", clienteRoutes);
app.use("/api/projetos", projetoRoutes);
app.use("/api/contratos", contratoRoutes);

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ erro: "Erro interno do servidor." });
});

const PORT = process.env.PORT || 3001;
const HTTPS_PORT = process.env.HTTPS_PORT || PORT;

function criarServidor(appInstance) {
  const useHttps = process.env.HTTPS_ENABLED === "true" || process.env.SSL_ENABLED === "true";
  const keyPath = process.env.SSL_KEY_PATH || path.join(__dirname, "certs", "key.pem");
  const certPath = process.env.SSL_CERT_PATH || path.join(__dirname, "certs", "cert.pem");

  if (useHttps && fs.existsSync(keyPath) && fs.existsSync(certPath)) {
    return {
      protocol: "https",
      port: HTTPS_PORT,
      server: https.createServer({
        key: fs.readFileSync(keyPath),
        cert: fs.readFileSync(certPath),
      }, appInstance),
    };
  }

  if (useHttps) {
    console.warn("[SERVER] Certificados SSL nao encontrados. Iniciando em HTTP local.");
  }

  return {
    protocol: "http",
    port: PORT,
    server: http.createServer(appInstance),
  };
}

inicializarBanco()
  .then(() => {
    const { protocol, port, server } = criarServidor(app);
    server.listen(port, () => {
      console.log(`[SERVER] Sistema iniciado com sucesso em ${protocol}://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("[DB] Falha ao inicializar banco de dados:", error.message);
    process.exit(1);
  });
