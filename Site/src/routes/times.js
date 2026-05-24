var express = require("express");
var router = express.Router();

var timesController = require("../controllers/timesController");

// Rota para buscar todas as equipes
router.get("/listar", function (req, res) {
    timesController.listar(req, res);
});

// Rota para buscar uma equipe específica pelo ID que vier na URL
router.get("/buscar/:id", function (req, res) {
    timesController.buscarPorId(req, res);
});

module.exports = router;