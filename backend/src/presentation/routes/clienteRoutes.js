const express = require("express");
const router = express.Router();
const ClienteController = require("../controllers/ClienteController");
const { authMiddleware, apenasAdmin } = require("../middlewares/authMiddleware");

router.use(authMiddleware);
router.use(apenasAdmin);

router.get("/", (req, res) => ClienteController.listar(req, res));
router.get("/:id", (req, res) => ClienteController.buscarPorId(req, res));
router.post("/", (req, res) => ClienteController.criar(req, res));
router.put("/:id", (req, res) => ClienteController.atualizar(req, res));
router.delete("/:id", (req, res) => ClienteController.deletar(req, res));

module.exports = router;