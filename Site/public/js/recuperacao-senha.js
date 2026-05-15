const inputEmail = document.getElementById('input-email');
const btnRecuperarSenha = document.getElementById('btn-recuperar-senha');

let emailPreenchido = false;

const validarCampoEmail = () => {
    const spanErroEmail = document.getElementById('span-invalido-email');
    const email = inputEmail.value;

    if (email.trim() === "" || !email.includes('@') || !email.endsWith('.com')) {
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

const validacaoBotaoLogin = () => {
    if (emailPreenchido) {
        btnRecuperarSenha.disabled = false;
        btnRecuperarSenha.classList.remove('botao-desabilitado');
    } else {
        btnRecuperarSenha.disabled = true;
        btnRecuperarSenha.classList.add('botao-desabilitado');
    }
}

inputEmail.addEventListener('input', validarCampoEmail);