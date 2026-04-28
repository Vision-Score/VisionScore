const iconeMostrarSenha = document.getElementById('password-icone');
const iconeEsconderSenha = document.getElementById('text-icone');
const inputSenha = document.getElementById('input-senha');
const inputEmail = document.getElementById('input-email');
const botaoLogin = document.getElementById('btn-login');

const loader = document.querySelector('.loader');


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
    loader.style.display = 'flex';
    var emailVar = inputEmail.value;
    var senhaVar = inputSenha.value;

    if (emailVar == "" || senhaVar == "") {
        alert("Preencha o e-mail e a senha.");
        loader.style.display = 'none';
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
                setInterval(() => {
                    loader.style.display = 'none';
                    alert("Login realizado com sucesso! Redirecionando para a plataforma...");
                    sessionStorage.EMAIL_USUARIO = json.email;
                    sessionStorage.NOME_USUARIO = json.nome;
                    sessionStorage.ID_USUARIO = json.id;

                    window.location = "./dashboard/dashboard.html";

                }, 1000);
            });
        } else {
            resposta.text().then(texto => {
                loader.style.display = 'none';
                alert(texto);
            });
        }
    }).catch(function (erro) {
        loader.style.display = 'none';
        console.log(erro);
        alert("Erro ao tentar realizar login.");
    });

    return false;
}

iconeMostrarSenha.addEventListener('click', mostrarSenha);
iconeEsconderSenha.addEventListener('click', esconderSenha);
botaoLogin.addEventListener('click', entrar);