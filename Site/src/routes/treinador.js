var express = require("express");
var router = express.Router();

var treinadorController = require("../controllers/treinadorController");

router.get("/getEstrategiasPorTreinador/:id", function (req, res) {
    treinadorController.getEstrategiasPorTreinador(req, res);
})

router.post("/criarEstrategia/", function (req, res) {
    treinadorController.criarEstrategia(req, res);
})

router.put("/atualizarEstrategia/:id", function (req, res) {
    treinadorController.atualizarEstrategia(req, res);
})

router.delete("/deletarEstrategia/:id", function (req, res) {
    treinadorController.deletarEstrategia(req, res);
})

module.exports = router;
