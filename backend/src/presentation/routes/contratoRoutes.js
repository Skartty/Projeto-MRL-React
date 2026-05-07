const express = require("express");
const router = express.Router();
const ContratoController = require("../controllers/ContratoController");
const { authMiddleware, apenasAdmin } = require("../middlewares/authMiddleware");

router.use(authMiddleware);
router.use(apenasAdmin);

router.get("/", (req, res) => ContratoController.listar(req, res));
router.get("/:id", (req, res) => ContratoController.buscarPorId(req, res));
router.post("/", (req, res) => ContratoController.criar(req, res));
router.put("/:id", (req, res) => ContratoController.atualizar(req, res));
router.delete("/:id", (req, res) => ContratoController.deletar(req, res));

module.exports = router;