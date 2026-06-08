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

function getMelhoresCampeoes(id) {
    console.log("ACESSEI O JOGADORES MODEL \n function getMelhoresCampeoes(): ", id)
    var instrucaoSql = `SELECT 
            nomeCampeao,
            COUNT(*) AS jogos,
            ROUND(AVG(eliminacaoCampeao), 1) AS media_kills,
            ROUND(AVG((eliminacaoCampeao + qtdAssistencias) / NULLIF(qtdMortes, 0)), 2) AS kda,
            ROUND(SUM(vitoria) / COUNT(*) * 100, 1) AS winrate
            FROM desempenho_jogador
            WHERE fkJogador = ${id}
            GROUP BY nomeCampeao
            ORDER BY (SUM(vitoria) / COUNT(*) * 100) * LOG(COUNT(*) + 1) DESC
            LIMIT 5;
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    listarElenco,
    getMediasGerais,
    getMelhoresCampeoes
}