var jogadoresModel = require("../models/jogadoresModel");

function listarElenco(req, res) {
    var id = req.params.id;

    if (id == undefined) {
        res.status(400).send("Seu id está indefinido!");
    } else {
        jogadoresModel.listarElenco(id)
            .then(function (resultado) {
                if (resultado.length > 0) {
                    res.status(200).json(resultado);
                } else {
                    res.status(204).send("Nenhum jogador encontrado!");
                }
            })
            .catch(function (erro) {
                console.log(erro);
                res.status(500).json(erro.sqlMessage);
            });
    }
}

function getMediasGerais(req, res) {
    jogadoresModel.getMediasGerais()
        .then(function (resultado) {
            if (resultado.length > 0) {
                res.status(200).json(resultado);
            } else {
                res.status(204).send("Nenhum jogador encontrado!");
            }
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
        })
}


module.exports = {
    listarElenco,
    getMediasGerais
}