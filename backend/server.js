const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3001;

// Exemplo de rota
app.get("/api/teste", (req, res) => {
  res.json({ mensagem: "API funcionando 🚀" });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});