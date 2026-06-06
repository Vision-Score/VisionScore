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

router.get("/getHighlightUltimoJogo/:id", function (req, res) {
    timesController.getHighlightUltimoJogo(req, res);
});

router.get("/getWinrateCampeonatos/:id", function (req, res) {
    timesController.getWinrateCampeonatos(req, res);
});

router.get("/getUltimosCincoJogos/:id", function (req, res) {
    timesController.getUltimosCincoJogos(req, res);
});

router.get("/getMediasGerais", function (req, res) {
    timesController.getMediasGerais(req, res);
});

router.get("/getMediaFirstBlood", function (req, res) {
    timesController.getMediaFirstBlood(req, res);
});

router.get("/getMediasPorTime/:id", function (req, res) {
    timesController.getMediasPorTime(req, res);
});

module.exports = router;