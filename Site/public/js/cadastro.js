const inputNome = document.getElementById('input-nome');
const inputTelefone = document.getElementById('input-telefone');
const inputEmail = document.getElementById('input-email');
const inputSenha = document.getElementById('input-senha');
const inputEmpresa = document.getElementById('input-empresa');
const botaoCadastrar = document.getElementById('btn-cadastrar');

function cadastrar() {
    var nomeVar = inputNome.value;
    var telefoneVar = inputTelefone.value;
    var emailVar = inputEmail.value;
    var senhaVar = inputSenha.value;
    var empresaVar = inputEmpresa.value;

    if (nomeVar == "" || emailVar == "" || senhaVar == "" || empresaVar == "") {
        alert("Preencha todos os campos obrigatórios.");
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
            alert("Cadastro realizado com sucesso! Redirecionando para o login...");
            window.location = "./login.html";
        } else {
            resposta.text().then(texto => {
                alert("Erro ao direcionar ao login");
            });
        }
    }).catch(function (erro) {  
        console.error(erro);
        alert("Erro ao tentar realizar cadastro.");
    });

    return false;
}

botaoCadastrar.addEventListener('click', cadastrar);
