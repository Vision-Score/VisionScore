const iconeMostrarSenha = document.getElementById('password-icone');
const iconeEsconderSenha = document.getElementById('text-icone');
const inputSenha = document.getElementById('input-senha');
const inputEmail = document.getElementById('input-email');
const botaoLogin = document.getElementById('btn-login');

const loader = document.querySelector('.loader');

let emailPreenchido = null;
let senhaPreenchida = null;

const mostrarNotificacao = (mensagem, acao = null) => {
    document.getElementById('modal-mensagem').textContent = mensagem;
    const modal = document.querySelector('.modal');
    const btnOk = document.getElementById('modal-btn');
    if (acao) {
        modal.classList.remove('modal-erro');
        modal.classList.add('modal-sucesso');
        btnOk.style.display = 'none';
        setTimeout(() => {
            document.getElementById('overlay').classList.remove('overlay-visivel');
            acao();
        }, 2000);
    } else {
        modal.classList.remove('modal-sucesso');
        modal.classList.add('modal-erro');
        btnOk.style.display = 'block';
    }
    document.getElementById('overlay').classList.add('overlay-visivel');
};

document.getElementById('modal-btn').addEventListener('click', () => {
    document.getElementById('overlay').classList.remove('overlay-visivel');
});

const mostrarSenha = () => {
    inputSenha.type = "text";
    iconeMostrarSenha.style.display = "none";
    iconeEsconderSenha.style.display = "block";
};

const esconderSenha = () => {
    inputSenha.type = "password";
    iconeMostrarSenha.style.display = "block";
    iconeEsconderSenha.style.display = "none";
};

const validacaoCampoEmail = () => {
    const spanErroEmail = document.getElementById('span-erro-email');
    const email = inputEmail.value;

    if (email.trim() === "" || !email.includes('@') || !email.includes('.')) {
        inputEmail.classList.add('invalido-input');
        spanErroEmail.style.display = 'block';
        inputEmail.nextElementSibling.classList.add('invalido-label');
        emailPreenchido = false;
    } else {
        inputEmail.classList.remove('invalido-input');
        spanErroEmail.style.display = 'none';
        inputEmail.nextElementSibling.classList.remove('invalido-label');
        emailPreenchido = true;
    }

    validacaoBotaoLogin();
}

const validacaoCampoSenha = () => {
    const senha = inputSenha.value;
    const labelSenha = inputSenha.nextElementSibling?.nextElementSibling?.nextElementSibling;
    const spanErroSenha = document.getElementById('span-erro-senha');

    if (senha.length < 1) {
        inputSenha.classList.add('invalido-input');
        labelSenha.classList.add('invalido-label');
        spanErroSenha.style.display = 'block';
        senhaPreenchida = false;
    } else {
        inputSenha.classList.remove('invalido-input');
        labelSenha.classList.remove('invalido-label');
        spanErroSenha.style.display = 'none';
        senhaPreenchida = true;
    }

    validacaoBotaoLogin();
}

const validacaoBotaoLogin = () => {
    if (emailPreenchido && senhaPreenchida) {
        botaoLogin.disabled = false;
        botaoLogin.classList.remove('botao-desabilitado');
    } else {
        botaoLogin.disabled = true;
        botaoLogin.classList.add('botao-desabilitado');
    }
}

async function entrar() {
    loader.style.display = 'flex';
    const emailVar = inputEmail.value;
    const senhaVar = inputSenha.value;

    if (!emailVar || !senhaVar) {
        loader.style.display = 'none';
        mostrarNotificacao("Preencha o e-mail e a senha.");
        return false;
    }

    try {
        const resposta = await fetch("/usuarios/autenticar", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ emailServer: emailVar, senhaServer: senhaVar })
        });

        if (!resposta.ok) {
            mostrarNotificacao(await resposta.text());
            return false;
        }

        let json = await resposta.json();

        const [jsonTime, jsonElenco] = await Promise.all([
            getTime(json.codEquipe).then(r => r.json()),
            getElenco(json.codEquipe).then(r => r.json())
        ]);

        json.nameTeam = jsonTime.nome;

        sessionStorage.setItem("usuario", JSON.stringify(json));
        sessionStorage.setItem("time", JSON.stringify(jsonTime));
        sessionStorage.setItem("elenco", JSON.stringify(jsonElenco));

        window.location.href = json.cargo == 1 ? "/dashboard/editar-contas.html" : "/dashboard/dashboard.html";

    } catch (erro) {
        console.log(erro);
        mostrarNotificacao("Erro ao tentar realizar login.");
    } finally {
        loader.style.display = 'none';
    }
}

function getElenco(idEquipe) {
    return fetch(`/jogadores/listarElenco/${idEquipe}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
    }).then(function (resposta) {
        console.log(resposta);
        return resposta;
    }).catch(function (erro) {
        console.log(erro);
        throw erro;
    });
}

function getTime(idEquipe) {
    return fetch(`/times/buscar/${idEquipe}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
    }).then(function (resposta) {
        console.log(resposta);
        return resposta;
    }).catch(function (erro) {
        console.log(erro);
        throw erro;
    });
}

iconeMostrarSenha.addEventListener('click', mostrarSenha);
iconeEsconderSenha.addEventListener('click', esconderSenha);
botaoLogin.addEventListener('click', entrar);
inputEmail.addEventListener('input', validacaoCampoEmail);
inputSenha.addEventListener('input', validacaoCampoSenha);