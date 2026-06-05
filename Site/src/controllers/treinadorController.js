var treinadorModel = require("../models/treinadorModel");

function getEstrategiasPorTreinador(req, res) {
    var id = req.params.id;

    if (id == undefined) {
        res.status(400).send("Seu id está indefinido!");
    } else {
        treinadorModel.getEstrategiasPorTreinador(id)
            .then(function (resultado) {
                if (resultado.length > 0) {
                    res.status(200).json(resultado);
                } else {
                    res.status(204).send("Nenhuma estratégia encontrada!");
                }
            })
            .catch(function (erro) {
                console.log(erro);
                res.status(500).json(erro.sqlMessage);
            });
    }
}

function criarEstrategia(req, res) {
    var fk_treinador = req.body.fkTreinadorServer || req.body.fk_treinador;
    var titulo = req.body.tituloServer || req.body.titulo;
    var texto = req.body.textoServer || req.body.texto || req.body.conteudoServer || req.body.conteudo;

    if (fk_treinador == undefined) {
        res.status(400).send("O id do treinador (fk_treinador) está indefinido!");
    } else if (titulo == undefined) {
        res.status(400).send("O título da estratégia está indefinido!");
    } else if (texto == undefined) {
        res.status(400).send("O conteúdo da estratégia está indefinido!");
    } else {
        treinadorModel.criarEstrategia(fk_treinador, titulo, texto)
            .then(function (resultado) {
                res.status(200).json(resultado);
            })
            .catch(function (erro) {
                console.log(erro);
                res.status(500).json(erro.sqlMessage);
            });
    }
}

function atualizarEstrategia(req, res) {
    var id = req.params.id;
    var titulo = req.body.tituloServer || req.body.titulo;
    var texto = req.body.textoServer || req.body.texto || req.body.conteudoServer || req.body.conteudo;

    if (id == undefined) {
        res.status(400).send("Seu id está indefinido!");
    } else if (titulo == undefined) {
        res.status(400).send("O título da estratégia está indefinido!");
    } else if (texto == undefined) {
        res.status(400).send("O conteúdo da estratégia está indefinido!");
    } else {
        treinadorModel.atualizarEstrategia(id, titulo, texto)
            .then(function (resultado) {
                res.status(200).json(resultado);
            })
            .catch(function (erro) {
                console.log(erro);
                res.status(500).json(erro.sqlMessage);
            });
    }
}

function deletarEstrategia(req, res) {
    var id = req.params.id;

    if (id == undefined) {
        res.status(400).send("Seu id está indefinido!");
    } else {
        treinadorModel.deletarEstrategia(id)
            .then(function (resultado) {
                res.status(200).json(resultado);
            })
            .catch(function (erro) {
                console.log(erro);
                res.status(500).json(erro.sqlMessage);
            });
    }
}

module.exports = {
    getEstrategiasPorTreinador,
    criarEstrategia,
    atualizarEstrategia,
    deletarEstrategia
}