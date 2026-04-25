const iconeMostrarSenha = document.getElementById('password-icone');
const iconeEsconderSenha = document.getElementById('text-icone');
const inputSenha = document.getElementById('input-senha');
const inputEmail = document.getElementById('input-email');
const botaoLogin = document.getElementById('btn-login');

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

function entrar() {
    var emailVar = inputEmail.value;
    var senhaVar = inputSenha.value;

    if (emailVar == "" || senhaVar == "") {
        alert("Preencha o e-mail e a senha.");
        return false;
    }

    fetch("/usuarios/autenticar", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            emailServer: emailVar,
            senhaServer: senhaVar
        })
    }).then(function (resposta) {
        if (resposta.ok) {
            resposta.json().then(json => {
                sessionStorage.EMAIL_USUARIO = json.email;
                sessionStorage.NOME_USUARIO = json.nome;
                sessionStorage.ID_USUARIO = json.id;

                window.location = "./dashboard/cards.html";
            });
        } else {
            resposta.text().then(texto => {
                alert(texto);
            });
        }
    }).catch(function (erro) {
        console.log(erro);
        alert("Erro ao tentar realizar login.");
    });

    return false;
}

iconeMostrarSenha.addEventListener('click', mostrarSenha);
iconeEsconderSenha.addEventListener('click', esconderSenha);
botaoLogin.addEventListener('click', entrar);