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
                if (resultado.length >= 1) {
                    res.status(200).json({
                        id: resultado[0].id_equipe,
                        nome: resultado[0].nome,
                        sigla: resultado[0].sigla,
                        dtCriacao: resultado[0].dtCriacao,
                        urlImagem: resultado[0].urlImagem,
                        nomeTreinador: resultado[0].nometreinador
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

function getHighlightUltimoJogo(req, res) {
    var idEquipe = req.params.id;

    if (idEquipe == undefined) {
        res.status(400).send("Seu id está indefinido!");
    } else {
        timesModel.getHighlightUltimoJogo(idEquipe)
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

function getWinrateCampeonatos(req, res) {
    var idEquipe = req.params.id;

    if (idEquipe == undefined) {
        res.status(400).send("Seu id está indefinido!");
    } else {
        timesModel.getWinrateCampeonatos(idEquipe)
            .then(function (resultado) {
                if (resultado.length > 0) {
                    res.status(200).json(resultado);
                } else {
                    res.status(204).send("Nenhum jogo encontrado!");
                }
            })
            .catch(function (erro) {
                console.log(erro);
                res.status(500).json(erro.sqlMessage);
            });
    }
}

function getUltimosCincoJogos(req, res) {
    var idEquipe = req.params.id;

    if (idEquipe == undefined) {
        res.status(400).send("Seu id está indefinido!");
    } else {
        timesModel.getUltimosCincoJogos(idEquipe)
            .then(function (resultado) {
                if (resultado.length > 0) {
                    res.status(200).json(resultado);
                } else {
                    res.status(204).send("Nenhum jogo encontrado!");
                }
            })
            .catch(function (erro) {
                console.log(erro);
                res.status(500).json(erro.sqlMessage);
            });
    }
}

function getMediasGerais(req, res) {
    timesModel.getMediasGerais()
        .then(function (resultado) {
            if (resultado.length > 0) {
                res.status(200).json(resultado);
            } else {
                res.status(204).send("Nenhuma média encontrada!");
            }
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
        });

}

function getMediaFirstBlood(req, res) {

    timesModel.getMediaFirstBlood()
        .then(function (resultado) {
            if (resultado.length > 0) {
                res.status(200).json(resultado);
            } else {
                res.status(204).send("Nenhuma média encontrada!");
            }
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
        });
}


function getMediasPorTime(req, res) {
    var idEquipe = req.params.id;

    if (idEquipe == undefined) {
        res.status(400).send("Seu id está indefinido!");
    } else {
        timesModel.getMediasPorTime(idEquipe)
            .then(function (resultado) {
                if (resultado.length > 0) {
                    res.status(200).json(resultado);
                } else {
                    res.status(204).send("Nenhuma média encontrada!");
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
    getHighlightUltimoJogo,
    getWinrateCampeonatos,
    getUltimosCincoJogos,
    getMediasGerais,
    getMediaFirstBlood,
    getMediasPorTime
}
