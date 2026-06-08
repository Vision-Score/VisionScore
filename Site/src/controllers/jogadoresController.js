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

function getMelhoresCampeoes(req, res) {
    var id = req.params.id;

    if (id == undefined) {
        res.status(400).send("Seu id está indefinido!");
    } else {
        jogadoresModel.getMelhoresCampeoes(id)
            .then(function (resultado) {
                if (resultado.length > 0) {
                    res.status(200).json(resultado);
                } else {
                    res.status(204).send("Nenhum campeão encontrado!");
                }
            })
            .catch(function (erro) {
                console.log(erro);
                res.status(500).json(erro.sqlMessage);
            });
    }
}

function getJogadoresPorRole(req, res) {
    var role = req.params.role;

    if (role == undefined) {
        res.status(400).send("Seu id ou role está indefinido!");
    } else {
        jogadoresModel.getJogadoresPorRole(role)
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

function getJogadorPorIDeEquipe(req, res) {
    var idJogador = req.params.idJogador;
    var idEquipe = req.params.idEquipe;
    if (idJogador == undefined || idEquipe == undefined) {
        res.status(400).send("Seu idJogador ou idEquipe está indefinido!");
    } else {
        jogadoresModel.getJogadorPorIDeEquipe(idJogador, idEquipe)
            .then(function (resultado) {                
                if (resultado.length > 0) {
                    res.status(200).json(resultado);
                } else {
                    res.status(204).send("Nenhum jogador encontrado para essa equipe!");    
                }
            })
            .catch(function (erro) {
                console.log(erro);
                res.status(500).json(erro.sqlMessage);
            });
    }
}

module.exports = {
    listarElenco,
    getMediasGerais,
    getMelhoresCampeoes,
    getJogadoresPorRole,
    getJogadorPorIDeEquipe
}