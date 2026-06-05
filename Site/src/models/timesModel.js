var database = require("../database/config")

function listar() {
    console.log("ACESSEI O TIMES MODEL \n function listar(): ")
    var instrucaoSql = `
        SELECT id_equipe, nome FROM equipe;
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function buscarPorId(id) {
    console.log("ACESSEI O TIMES MODEL \n function buscarPorId(): ", id)
    var instrucaoSql = `
        SELECT e.id_equipe, e.nome, e.sigla, e.dtCriacao, ie.urlImagem,
               c.id_usuario, c.nome AS nometreinador, c.email
        FROM equipe e
        LEFT JOIN imagem_equipe ie ON ie.nomeEquipe = e.nome
        LEFT JOIN cadastro c ON c.fk_equipe = e.id_equipe AND c.cargo = 2
        WHERE e.id_equipe = ${id};
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function getHighlightUltimoJogo(idEquipe) {
    console.log("ACESSEI O TIMES MODEL \n function getHighlightUltimoJogo(): ", idEquipe)
    var instrucaoSql = `
        SELECT * FROM vw_destaque_ultimo_confronto WHERE fkEquipe = ${idEquipe} LIMIT 1;
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    listar,
    buscarPorId,
    getHighlightUltimoJogo
}