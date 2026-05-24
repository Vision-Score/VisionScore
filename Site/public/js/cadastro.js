const inputNome = document.getElementById('input-nome');
const inputTelefone = document.getElementById('input-telefone');
const inputEmail = document.getElementById('input-email');
const inputSenha = document.getElementById('input-senha');
const inputEquipe = document.getElementById('input-equipe');
const listaEquipe = document.getElementById('lista-equipes');
const botaoCadastrar = document.getElementById('btn-cadastrar');
const loader = document.querySelector('.loader');

inputTelefone.addEventListener('input', () => {
    let telefone = inputTelefone.value.replace(/\D/g, "");

    telefone = telefone.replace(/^(\d{2})(\d)/, "($1) $2");
    telefone = telefone.replace(/(\d{5})(\d)/, "$1-$2");

    inputTelefone.value = telefone.slice(0, 15);
});

function emailValido(email) {
    const posicaoArroba = email.indexOf("@");
    const posicaoPontoDepoisArroba = email.indexOf(".", posicaoArroba);

    return posicaoArroba > 0 && posicaoPontoDepoisArroba > posicaoArroba + 1;
}

function senhaValida(senha) {
    const temMinimoSeisCaracteres = senha.length >= 6;
    const temNumero = /[0-9]/.test(senha);
    const temMaiuscula = /[A-Z]/.test(senha);
    const temMinuscula = /[a-z]/.test(senha);

    return temMinimoSeisCaracteres && temNumero && temMaiuscula && temMinuscula;
}

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

let timesGlobais = [];

function getTimes() {
    loader.style.display = 'flex';
    fetch("/times/listar")
        .then(function (resposta) {
            if (resposta.ok) {
                resposta.json().then(function (times) {
                    timesGlobais = times;
                    console.log("Times recebidos:", timesGlobais);

                    var options = '';

                    times.forEach(function (time) {
                        options += `<option value="${time.id_equipe}">${time.nome}</option>`;
                    });

                    listaEquipe.innerHTML = options;
                });
            } else {
                console.error("Nenhuma equipe encontrada ou erro na API");
            }
            loader.style.display = 'none';
        })
        .catch(function (erro) {
            console.error(`Erro na requisição de equipes: ${erro.message}`);
            loader.style.display = 'none';
        });
}

window.onload = getTimes;


function cadastrar() {
    var nomeVar = inputNome.value;
    var telefoneVar = inputTelefone.value;
    var emailVar = inputEmail.value;
    var senhaVar = inputSenha.value;
    var empresaVar = inputEquipe.value;

    
    loader.style.display = 'flex';

   if (nomeVar == "" || telefoneVar == "" || emailVar == "" || senhaVar == "" || empresaVar == "") {
    mostrarNotificacao("Preencha todos os campos obrigatórios.");
    loader.style.display = 'none';
    return false;
}

if (empresaVar.trim() === "") {
    mostrarNotificacao("Selecione uma equipe válida na lista.");
    loader.style.display = 'none';
    return false;
}

if (telefoneVar.length !== 15) {
    mostrarNotificacao("Telefone inválido. Use o formato (xx) xxxxx-xxxx.");
    loader.style.display = 'none';
    return false;
}

if (!emailValido(emailVar)) {
    mostrarNotificacao("Formato de e-mail inválido. O e-mail precisa conter @ e ponto após o @.");
    loader.style.display = 'none';
    return false;
}

if (!senhaValida(senhaVar)) {
    mostrarNotificacao("A senha precisa ter no mínimo 6 caracteres, 1 número, 1 letra maiúscula e 1 letra minúscula.");
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
