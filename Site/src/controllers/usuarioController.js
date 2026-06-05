var usuarioModel = require("../models/usuarioModel");

// Gera e retorna o código; verifica se o e-mail existe no BD
function recuperarSenha(req, res) {
    var email = req.body.emailServer;

    if (email == undefined) {
        return res.status(400).send('E-mail está indefinido!');
    }

    usuarioModel.buscarPorEmail(email)
        .then(function (resultado) {
            if (resultado.length === 0) {
                return res.status(404).send('E-mail não encontrado.');
            }

            // Gera código de 5 dígitos
            const codigo = Math.floor(10000 + Math.random() * 90000).toString();
            console.log(`\n🔑 CÓDIGO DE RECUPERAÇÃO para ${email}: ${codigo}\n`);

            res.json({ codigo });
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
        });
}

function atualizarSenha(req, res) {
    var email = req.body.emailServer;
    var novaSenha = req.body.novaSenhaServer;

    if (email == undefined) {
        return res.status(400).send('E-mail está indefinido!');
    }
    if (novaSenha == undefined) {
        return res.status(400).send('Nova senha está indefinida!');
    }

    usuarioModel.atualizarSenha(email, novaSenha)
        .then(function (resultado) {
            res.json({ mensagem: 'Senha atualizada com sucesso!' });
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
        });
}

function autenticar(req, res) {
    var email = req.body.emailServer;
    var senha = req.body.senhaServer;

    if (email == undefined) {
        res.status(400).send("Seu email está indefinido!");
    } else if (senha == undefined) {
        res.status(400).send("Sua senha está indefinida!");
    } else {
        usuarioModel.autenticar(email, senha)
            .then(function (resultadoAutenticar) {
                console.log(`Resultados encontrados: ${resultadoAutenticar.length}`);

                if (resultadoAutenticar.length == 1) {
                    res.json({
                        id: resultadoAutenticar[0].id,
                        email: resultadoAutenticar[0].email,
                        nome: resultadoAutenticar[0].nome,
                        codEquipe: resultadoAutenticar[0].cod_equipe,
                        cargo: resultadoAutenticar[0].cargo
                    });
                } else if (resultadoAutenticar.length == 0) {
                    res.status(403).send("Email e/ou senha inválido(s)");
                } else {
                    res.status(403).send("Mais de um usuário com o mesmo login e senha!");
                }
            })
            .catch(function (erro) {
                console.log(erro);
                res.status(500).json(erro.sqlMessage);
            });
    }
}

function cadastrar(req, res) {
    // Crie uma variável que vá recuperar os valores do arquivo cadastro.html
    var nome = req.body.nomeServer;
    var telefone = req.body.telefoneServer;
    var email = req.body.emailServer;
    var senha = req.body.senhaServer;
    var codEquipe = req.body.codEquipeServer;
    var cargo = req.body.cargoServer;
    var fk_gestor = req.body.fkGestorServer;

    // Faça as validações dos valores
    if (nome == undefined) {
        res.status(400).send("Seu nome está undefined!");
    } else if (email == undefined) {
        res.status(400).send("Seu email está undefined!");
    } else if (senha == undefined) {
        res.status(400).send("Sua senha está undefined!");
    } else if (codEquipe == undefined) {
        res.status(400).send("Seu código de equipe está undefined!");
    } else if (cargo == undefined) {
        res.status(400).send("Seu cargo está undefined!");
    } else {

        // Passe os valores como parâmetro e vá para o arquivo usuarioModel.js
        // fk_gestor pode ser opcional no payload; será repassado ao model (pode ser null)
        usuarioModel.cadastrar(nome, telefone, email, senha, cargo, codEquipe, fk_gestor)
            .then(
                function (resultado) {
                    res.json(resultado);
                }
            ).catch(
                function (erro) {
                    console.log(erro);
                    console.log(
                        "\nHouve um erro ao realizar o cadastro! Erro: ",
                        erro.sqlMessage
                    );
                    res.status(500).json(erro.sqlMessage);
                }
            );
    }
}

function buscarUsuariosPorGerente(req, res) {
    var idGerente = req.params.idGerente;

    if (idGerente == undefined) {
        res.status(400).send("Seu id está indefinido!");
    } else {
        usuarioModel.buscarUsuariosPorGerente(idGerente)
            .then(function (resultado) {
                if (resultado.length > 0) {
                    res.status(200).json(resultado);
                } else {
                    res.status(204).send("Nenhum usuário encontrado!");
                }
            })
            .catch(function (erro) {
                console.log(erro);
                res.status(500).json(erro.sqlMessage);
            });
    }
}

function atualizar(req, res) {
    var idUsuario = req.params.idUsuario;
    var nome = req.body.nomeServer;
    var telefone = req.body.telefoneServer;
    var email = req.body.emailServer;
    var senha = req.body.senhaServer;
    var cargo = req.body.cargoServer;


    usuarioModel.atualizar(idUsuario, nome, telefone, email, senha, cargo)
        .then(function (resultado) {
            res.json(resultado);
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
        });

}

function deletar(req, res) {
    var idUsuario = req.params.idUsuario;

    if (idUsuario == undefined) {
        res.status(400).send("Seu id está indefinido!");
    } else {

        usuarioModel.deletar(idUsuario)
            .then(function (resultado) {
                res.json(resultado);
            })
            .catch(function (erro) {
                console.log(erro);
                res.status(500).json(erro.sqlMessage);
            });
    }
}

module.exports = {
    autenticar,
    cadastrar,
    buscarUsuariosPorGerente,
    atualizar,
    deletar
}