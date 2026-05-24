var timesModel = require("../models/timesModel");

function listar(req, res) {
    timesModel.listar()
        .then(function (resultado) {
            if (resultado.length > 0) {
                res.status(200).json(resultado);
            } else {
                res.status(204).send("Nenhuma equipe encontrada!");
            }
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
        });
}

function buscarPorId(req, res) {
    var id = req.params.id;

    if (id == undefined) {
        res.status(400).send("Seu id está indefinido!");
    } else {
        timesModel.buscarPorId(id)
            .then(function (resultado) {
                if (resultado.length == 1) {
                    res.status(200).json({
                        id: resultado[0].id_equipe,
                        nome: resultado[0].nome,
                        sigla: resultado[0].sigla,
                        dtCriacao: resultado[0].dtCriacao
                    });
                } else if (resultado.length == 0) {
                    res.status(404).send("Equipe não encontrada!");
                } else {
                    res.status(403).send("Mais de uma equipe com o mesmo id!");
                }
            })
            .catch(function (erro) {
                console.log(erro);
                res.status(500).json(erro.sqlMessage);
            });
    }
}

module.exports = {
    listar,
    buscarPorId,
}
