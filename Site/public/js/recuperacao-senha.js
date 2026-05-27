const emailForm = document.getElementById('email-form');
const inputEmail = document.getElementById('input-email');
const btnRecuperarSenha = document.getElementById('btn-recuperar-senha');
const btnEnviarCodigo = document.getElementById('btn-enviar-codigo');

const codeForm = document.getElementById('code-form');
const codeFormInput = codeForm.querySelectorAll('input');

let emailPreenchido = false;

let codigoGerado = '';
let codigoDigitado = '';
let codigoPreenchido = false;

const mostrarNotificacao = (msg) => {
    document.getElementById('modal-msg').textContent = msg;
    document.getElementById('overlay').classList.add('overlay-visivel');
};


const validacaoBotaoEmail = () => {
    if (emailPreenchido) {
        btnRecuperarSenha.disabled = false;
        btnRecuperarSenha.classList.remove('botao-desabilitado');
    } else {
        btnRecuperarSenha.disabled = true;
        btnRecuperarSenha.classList.add('botao-desabilitado');
    }
}

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

    validacaoBotaoEmail();
}

// Permite que o usuário avance para o próximo campo automaticamente ao preencher o atual
codeFormInput.forEach((input, index) => {
    const nextInput = codeFormInput[index + 1];

    input.addEventListener('input', () => {
        if (input.value.length >= input.maxLength && nextInput) {
            nextInput.focus();
        }

        if (isPreenchido(codeForm)) {
            codigoPreenchido = true;
            btnEnviarCodigo.disabled = false;
            btnEnviarCodigo.classList.remove('botao-desabilitado');
        } else {
            codigoPreenchido = false;
            btnEnviarCodigo.disabled = true;
            btnEnviarCodigo.classList.add('botao-desabilitado');
        }
    })
})

// Permite que o usuário volte para o campo anterior ao pressionar Backspace
codeFormInput.forEach((input, index) => {
    const previousInput = codeFormInput[index - 1];

    input.addEventListener('keydown', (event) => {
        if (event.key === 'Backspace' && input.value.length === 0 && previousInput) {
            previousInput.focus();
        }
    })
})

// Adiciona classe de erro se o código estiver incompleto
codeFormInput.forEach(input => {
    input.addEventListener('input', () => {
        if (input.value.length < input.maxLength) {
            input.classList.add('invalid-code');
        } else {
            input.classList.remove('invalid-code');
        }
    })
})

const gerarCodigo = () => {
    codigoGerado = '';

    for (let i = 0; i < 5; i++) {
        const numeroAleatorio = Math.floor(Math.random() * 10);
        codigoGerado += numeroAleatorio.toString();
    }

    console.log('Código gerado:', codigoGerado);
}

const pegarValorCodigoDigitado = (form) => {
    return Array.from(form.querySelectorAll('input')).map(input => input.value).join('')
}

const isPreenchido = (form) => {
    return Array.from(form.querySelectorAll('input')).every(input => input.value.length >= input.maxLength);
}

const compararCodigo = () => {
    codigoDigitado = pegarValorCodigoDigitado(codeForm);

    console.log('Código gerado:', codigoGerado);
    console.log('Código digitado:', codigoDigitado);

    if (codigoDigitado === codigoGerado) {
        console.log('Código correto!');
    } else {
        console.log('Código incorreto!');
    }
}


const enviarCodigo = () => {
    if (!codigoPreenchido) return false;

    gerarCodigo();


    console.log('Código enviado com sucesso');
}




// inputEmail.addEventListener('input', validarCampoEmail);
// btnRecuperarSenha.addEventListener('click', enviarCodigo);
btnEnviarCodigo.addEventListener('click', enviarCodigo);