var database = require("../database/config")

function getEstrategiasPorTreinador(id) {
    var instrucaoSql = `
        SELECT id_estrategia, titulo, conteudo, fk_treinador, DATE_FORMAT(dt_criacao, '%d/%m/%Y') as dt_criacao FROM estrategia WHERE fk_treinador = ${id};
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function criarEstrategia(fk_treinador, titulo, texto) {
    var instrucaoSql = `
        INSERT INTO estrategia (fk_treinador, titulo, conteudo) VALUES (${fk_treinador}, '${titulo}', '${texto}');
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function atualizarEstrategia(id, titulo, texto) {
    var instrucaoSql = `
        UPDATE estrategia SET titulo = '${titulo}', conteudo = '${texto}' WHERE id_estrategia = ${id};
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function deletarEstrategia(id) {
    var instrucaoSql = `
        DELETE FROM estrategia WHERE id_estrategia = ${id};
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    getEstrategiasPorTreinador,
    criarEstrategia,
    atualizarEstrategia,
    deletarEstrategia
}