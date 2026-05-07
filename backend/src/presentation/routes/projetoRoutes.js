const express = require("express");
const router = express.Router();
const ProjetoController = require("../controllers/ProjetoController");
const { authMiddleware, apenasAdmin } = require("../middlewares/authMiddleware");

router.use(authMiddleware);
router.use(apenasAdmin);

router.get("/", (req, res) => ProjetoController.listar(req, res));
router.get("/:id", (req, res) => ProjetoController.buscarPorId(req, res));
router.post("/", (req, res) => ProjetoController.criar(req, res));
router.put("/:id", (req, res) => ProjetoController.atualizar(req, res));
router.delete("/:id", (req, res) => ProjetoController.deletar(req, res));

module.exports = router;