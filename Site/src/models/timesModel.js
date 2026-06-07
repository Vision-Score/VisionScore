var database = require("../database/config")

function listar() {
    console.log("ACESSEI O TIMES MODEL \n function listar(): ")
    var instrucaoSql = `
        SELECT e.id_equipe, e.nome, ie.urlImagem
        FROM equipe e
        LEFT JOIN imagem_equipe ie ON ie.nomeEquipe = e.nome;
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

function getWinrateCampeonatos(idEquipe) {
    console.log("ACESSEI O TIMES MODEL \n function getWinrateCampeonatos(): ", idEquipe)
    var instrucaoSql = `
        SELECT 
        t.nome as torneio,
        (SELECT s2.nome FROM series s2 
        JOIN jogo j2 ON j2.fkSerie = s2.idSeries 
        WHERE s2.fkTorneio = t.idTorneio 
        GROUP BY s2.nome 
        ORDER BY COUNT(*) DESC LIMIT 1) as serie,
        COUNT(*) as jogos,
        ROUND(SUM(CASE WHEN j.fkEquipeVencedora = ${idEquipe} THEN 1 ELSE 0 END) / COUNT(*) * 100, 1) as winrate,
        MAX(j.dtJogo) as dtReferencia
        FROM jogo j
        JOIN series s ON j.fkSerie = s.idSeries
        JOIN torneio t ON s.fkTorneio = t.idTorneio
        JOIN desempenho_equipe de ON de.fkJogo = j.idJogo AND de.fkEquipe = ${idEquipe}
        GROUP BY t.idTorneio, t.nome
        HAVING COUNT(*) > 2
        ORDER BY dtReferencia DESC
        LIMIT 5;
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function getUltimosCincoJogos(idEquipe) {
    console.log("ACESSEI O TIMES MODEL \n function getUltimosCincoJogos(): ", idEquipe)
    var instrucaoSql = `
        SELECT 
        j.idJogo,
        j.dtJogo,
        CASE WHEN j.fkEquipeVencedora = ${idEquipe} THEN 'V' ELSE 'D' END as resultado,
        e.nome as adversario
        FROM jogo j
        JOIN desempenho_equipe de ON de.fkJogo = j.idJogo AND de.fkEquipe = ${idEquipe}
        JOIN desempenho_equipe de2 ON de2.fkJogo = j.idJogo AND de2.fkEquipe != ${idEquipe}
        JOIN equipe e ON e.id_equipe = de2.fkEquipe
        ORDER BY j.dtJogo DESC
        LIMIT 5;
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function getMediasGerais() {
    console.log("ACESSEI O TIMES MODEL \n function getMediasGerais(): ")
    var instrucaoSql = `
        select * from vw_medias_gerais;	
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function getMediaFirstBlood() {
    console.log("ACESSEI O TIMES MODEL \n function getMediaFirstBlood(): ")
    var instrucaoSql = `
        select * from vw_media_first_blood;
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function getMediasPorTime(idEquipe) {
    console.log("ACESSEI O TIMES MODEL \n function getMediasPorTime(): ")
    var instrucaoSql = `
        SELECT * FROM vw_kpis_por_equipe WHERE fkEquipe = ${idEquipe}
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
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