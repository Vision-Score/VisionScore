const inputNome = document.getElementById('input-nome');
const inputTelefone = document.getElementById('input-telefone');
const inputEmail = document.getElementById('input-email');
const inputSenha = document.getElementById('input-senha');
const inputEmpresa = document.getElementById('input-empresa');
const botaoCadastrar = document.getElementById('btn-cadastrar');


const mostrarNotificacao = (mensagem, acao = null) => {
    document.getElementById('modal-mensagem').textContent = mensagem;
    const modal = document.querySelector('.modal');
    const btnOk = document.getElementById('modal-btn');
    if (acao) {
        modal.classList.remove('modal-erro');
        btnOk.style.display = 'none';
        setTimeout(() => {
            document.getElementById('overlay').classList.remove('overlay-visivel');
            acao();
        }, 2000);
    } else {
        modal.classList.add('modal-erro');
        btnOk.style.display = 'block';
    }
    document.getElementById('overlay').classList.add('overlay-visivel');
};

document.getElementById('modal-btn').addEventListener('click', () => {
    document.getElementById('overlay').classList.remove('overlay-visivel');
});


function cadastrar() {
    var nomeVar = inputNome.value;
    var telefoneVar = inputTelefone.value;
    var emailVar = inputEmail.value;
    var senhaVar = inputSenha.value;
    var empresaVar = inputEmpresa.value;

    var loader = document.querySelector('.loader');
    loader.style.display = 'flex';

    if (nomeVar == "" || emailVar == "" || senhaVar == "" || empresaVar == "") {
        mostrarNotificacao("Preencha todos os campos obrigatórios.");
        loader.style.display = 'none';
        return false;
    }

    if (!emailVar.includes('@') || !emailVar.endsWith('.com')) {
    mostrarNotificacao("Formato de e-mail inválido.");
    loader.style.display = 'none';
    return false;
}

    fetch("/usuarios/cadastrar", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            nomeServer: nomeVar,
            telefoneServer: telefoneVar,
            emailServer: emailVar,
            senhaServer: senhaVar,
            codEquipeServer: empresaVar
        })
    }).then(function (resposta) {
        console.log("Entrei no then do cadastro!");

        if (resposta.ok) {
            setTimeout(() => {
                loader.style.display = 'none';
                mostrarNotificacao("Cadastro realizado com sucesso! Redirecionando para o login...", () => {
                    window.location.href = "login.html";
                });
            }, 1000);
        } else {
            resposta.text().then(texto => {
                loader.style.display = 'none';
                if (texto.includes("Duplicate entry")) {
                    if (texto.includes("cod_equipe")) {
                        mostrarNotificacao("Código de equipe já cadastrado.");
                    } else {
                        mostrarNotificacao("E-mail já cadastrado.");
                    }
                }
            });
        }
    }).catch(function (erro) {
        loader.style.display = 'none';
        console.error(erro);
        alert("Erro ao tentar realizar cadastro.");
    });

    return false;
}

botaoCadastrar.addEventListener('click', cadastrar);
