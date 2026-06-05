var express = require("express");
var router = express.Router();

var usuarioController = require("../controllers/usuarioController");

//Recebendo os dados do html e direcionando para a função cadastrar de usuarioController.js
router.post("/cadastrar", function (req, res) {
    usuarioController.cadastrar(req, res);
})

router.post("/autenticar", function (req, res) {
    usuarioController.autenticar(req, res);
});

router.get("/listarUsuariosPorGerente/:idGerente", function (req, res) {
    usuarioController.buscarUsuariosPorGerente(req, res);
});

router.put("/atualizar/:idUsuario", function (req, res) {
    usuarioController.atualizar(req, res);
});

router.delete("/deletar/:idUsuario", function (req, res) {
    usuarioController.deletar(req, res);
});

router.put("/atualizarPreferenciaNotificacao/:idUsuario", function (req, res) {
    usuarioController.atualizarPreferenciaNotificacao(req, res);
});

module.exports = router;