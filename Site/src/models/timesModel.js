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
        SELECT id_equipe, nome, sigla, dtCriacao FROM equipe WHERE id_equipe = '${id}';
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