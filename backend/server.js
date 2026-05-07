require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { inicializarBanco } = require("./src/database/initializeDatabase");

const authRoutes = require("./src/presentation/routes/authRoutes");
const clienteRoutes = require("./src/presentation/routes/clienteRoutes");
const projetoRoutes = require("./src/presentation/routes/projetoRoutes");
const contratoRoutes = require("./src/presentation/routes/contratoRoutes");

const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
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

inicializarBanco()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`[SERVER] Sistema iniciado com sucesso em http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("[DB] Falha ao inicializar banco de dados:", error.message);
    process.exit(1);
  });
