var database = require("../database/config")

function listarElenco(id) {
    console.log("ACESSEI O JOGADORES MODEL \n function listarElenco(): ", id)
    var instrucaoSql = `
        SELECT * FROM vw_stats_elenco_atual WHERE fkEquipe = ${id};
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function getMediasGerais() {
    console.log("ACESSEI O JOGADORES MODEL \n function getMediasGerais()")
    var instrucaoSql = `
        select * from vw_medias_por_role;
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    listarElenco,
    getMediasGerais
}