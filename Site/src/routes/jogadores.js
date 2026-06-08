var express = require("express");
var router = express.Router();

var jogadoresController = require("../controllers/jogadoresController");

// Rota para buscar todas as equipes
router.get("/listarElenco/:id", function (req, res) {
    jogadoresController.listarElenco(req, res);
});

router.get("/getMediasGerais", function (req, res) {
    jogadoresController.getMediasGerais(req, res);
});

router.get("/getHighlightUltimoJogo/:id", function (req, res) {
    jogadoresController.getHighlightUltimoJogo(req, res);
});

router.get("/getMelhoresCampeoes/:id", function (req, res) {
    jogadoresController.getMelhoresCampeoes(req, res);
});

module.exports = router;