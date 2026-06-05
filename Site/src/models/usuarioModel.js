var database = require("../database/config")

function buscarPorEmail(email) {
    var instrucaoSql = `
        SELECT id_usuario FROM cadastro WHERE email = '${email}';
    `;
    console.log('Executando a instrução SQL: \n' + instrucaoSql);
    return database.executar(instrucaoSql);
}

function atualizarSenha(email, novaSenha) {
    var instrucaoSql = `
        UPDATE cadastro SET senha = '${novaSenha}' WHERE email = '${email}';
    `;
    console.log('Executando a instrução SQL: \n' + instrucaoSql);
    return database.executar(instrucaoSql);
}

function autenticar(email, senha) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function entrar(): ", email, senha)
    var instrucaoSql = `
        SELECT id_usuario AS id, nome, email, telefone, fk_equipe AS cod_equipe, cargo FROM cadastro WHERE email = '${email}' AND senha = '${senha}';
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function cadastrar(nome, telefone, email, senha, cargo, codEquipe, fk_gestor) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function cadastrar():", nome, telefone, email, senha, codEquipe);

    // Insira exatamente a query do banco aqui, lembrando da nomenclatura exata nos valores
    //  e na ordem de inserção dos dados.
    // Prepare values, allowing telefone and fk_gestor to be NULL when not provided
    var fkGestorVal = fk_gestor != undefined && fk_gestor !== null ? `${fk_gestor}` : 'NULL';

    var instrucaoSql = `
        INSERT INTO cadastro (nome, telefone, email, senha, cargo, fk_equipe, fk_gestor) VALUES ('${nome}', '${telefone}', '${email}', '${senha}', ${cargo}, '${codEquipe}', ${fkGestorVal});
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function buscarUsuariosPorGerente(idGerente) {
    console.log("ACESSEI O USUARIO MODEL \n function buscarUsuariosPorGerente(): ", idGerente);
    var instrucaoSql = `SELECT c.id_usuario AS id, c.nome, c.email, c.telefone, c.cargo, CASE c.cargo 
        WHEN 1 THEN 'Gestor'
        WHEN 2 THEN 'Treinador'
        WHEN 3 THEN 'Jogador'
        END AS nomeCargo FROM cadastro c WHERE c.fk_gestor = ${idGerente};`;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function atualizar(idUsuario, nome, telefone, email, senha, cargo) {
    console.log("ACESSEI O USUARIO MODEL \n function atualizar(): ", idUsuario, nome, telefone, email, senha, cargo);

    const campos = [];
    if (nome)     campos.push(`nome = '${nome}'`);
    if (telefone) campos.push(`telefone = '${telefone}'`);
    if (email)    campos.push(`email = '${email}'`);
    if (senha)    campos.push(`senha = '${senha}'`);
    if (cargo)    campos.push(`cargo = ${cargo}`);

    if (campos.length === 0) return Promise.resolve();

    var instrucaoSql = `UPDATE cadastro SET ${campos.join(', ')} WHERE id_usuario = ${idUsuario};`;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function deletar(idUsuario) {
    console.log("ACESSEI O USUARIO MODEL \n function deletar(): ", idUsuario);
    var instrucaoSql = `DELETE FROM cadastro WHERE id_usuario = ${idUsuario};`;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    autenticar,
    cadastrar,
    buscarUsuariosPorGerente,
    atualizar,
    deletar,
    atualizar
};