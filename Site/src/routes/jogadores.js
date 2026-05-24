var express = require("express");
var router = express.Router();

var jogadoresController = require("../controllers/jogadoresController");

// Rota para buscar todas as equipes
router.get("/listarElenco/:id", function (req, res) {
    jogadoresController.listarElenco(req, res);
});


module.exports = router;