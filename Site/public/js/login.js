const iconeMostrarSenha = document.getElementById('password-icone');
const iconeEsconderSenha = document.getElementById('text-icone');
const inputSenha = document.getElementById('input-senha');
const botaoLogin = document.getElementById('btn-login')

const mostrarSenha = () => {
    inputSenha.type = "text"
    iconeMostrarSenha.style.display = "none"
    iconeEsconderSenha.style.display = "block"
}

const esconderSenha = () => {
    inputSenha.type = "password"
    iconeMostrarSenha.style.display = "block"
    iconeEsconderSenha.style.display = "none"
}

/*  const desabilitarBotao = () => {
    botaoLogin.classList.add('botao-desabilitado')
    botaoLogin.disabled = true
    botaoLogin.innerHTML = '<i class="fa-solid fa-arrow-rotate-right"></i>'
}
*/

iconeMostrarSenha.addEventListener('click', mostrarSenha);
iconeEsconderSenha.addEventListener('click', esconderSenha);
botaoLogin.addEventListener('click', desabilitarBotao)