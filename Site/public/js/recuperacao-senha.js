const inputEmail = document.getElementById('input-email');
const btnRecuperarSenha = document.getElementById('btn-recuperar-senha');

let emailPreenchido = false;
let codigoGerado = '';

// ─── Utilitários ───────────────────────────────────────────────

const mostrarNotificacao = (msg) => {
    document.getElementById('modal-msg').textContent = msg;
    document.getElementById('overlay').classList.add('overlay-visivel');
};

// ─── Etapa 1: Validação e envio do e-mail ──────────────────────

const validacaoBotaoEmail = () => {
    if (emailPreenchido) {
        btnRecuperarSenha.disabled = false;
        btnRecuperarSenha.classList.remove('botao-desabilitado');
    } else {
        btnRecuperarSenha.disabled = true;
        btnRecuperarSenha.classList.add('botao-desabilitado');
    }
};

const validarCampoEmail = () => {
    const spanErroEmail = document.getElementById('span-invalido-email');
    const email = inputEmail.value;

    if (email.trim() === '' || !email.includes('@') || !email.endsWith('.com')) {
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
};

const enviarEmail = async () => {
    const email = inputEmail.value;

    // Ativa loading no botão
    btnRecuperarSenha.disabled = true;
    btnRecuperarSenha.innerHTML = '<i class="fa-solid fa-arrow-rotate-right"></i>';

    try {
        const response = await fetch('/usuarios/recuperar-senha', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ emailServer: email })
        });

        if (response.ok) {
            const data = await response.json();
            codigoGerado = data.codigo; // código retornado pelo servidor
            renderizarEtapaCodigo(email);
        } else if (response.status === 404) {
            mostrarNotificacao('E-mail não encontrado em nossa base de dados.');
            btnRecuperarSenha.disabled = false;
            btnRecuperarSenha.innerHTML = 'Enviar Código de Recuperação';
        } else {
            mostrarNotificacao('Erro ao processar a solicitação. Tente novamente.');
            btnRecuperarSenha.disabled = false;
            btnRecuperarSenha.innerHTML = 'Enviar Código de Recuperação';
        }
    } catch (error) {
        mostrarNotificacao('Erro de conexão com o servidor.');
        btnRecuperarSenha.disabled = false;
        btnRecuperarSenha.innerHTML = 'Enviar Código de Recuperação';
    }
};

// ─── Etapa 2: Formulário de código (renderizado por JS) ────────

const renderizarEtapaCodigo = (email) => {
    const emailForm = document.getElementById('email-form');

    // Cria o formulário de código dinamicamente
    const codeForm = document.createElement('form');
    codeForm.id = 'code-form';
    codeForm.innerHTML = `
        <div class="container-texto">
            <h2>Insira o Código</h2>
            <p>Insira o código que foi gerado para <strong style="color: var(--cor-clara)">${email}</strong> e crie uma nova senha.</p>
        </div>

        <div class="code-input-container" id="code-input-container">
            <input name="d1" type="text" autocomplete="off" placeholder="" maxlength="1">
            <input name="d2" type="text" autocomplete="off" placeholder="" maxlength="1">
            <input name="d3" type="text" autocomplete="off" placeholder="" maxlength="1">
            <input name="d4" type="text" autocomplete="off" placeholder="" maxlength="1">
            <input name="d5" type="text" autocomplete="off" placeholder="" maxlength="1">
        </div>

        <div class="container-botao">
            <button type="button" id="btn-verificar-codigo" class="botao-desabilitado" disabled>
                Verificar Código
            </button>
            <a href="./login.html">Voltar ao Login</a>
        </div>

        <a href="./index.html" class="link-voltar">
            <i class="fa-solid fa-arrow-left"></i>
            Voltar para o site institucional
        </a>
    `;

    // Troca com animação
    emailForm.style.animation = 'none';
    emailForm.style.opacity = '0';
    emailForm.style.transform = 'translateY(-20px)';
    emailForm.style.transition = 'all 0.4s ease';

    setTimeout(() => {
        emailForm.replaceWith(codeForm);
        codeForm.style.animation = 'fadeSlideUp 0.8s ease-in-out';
        inicializarInputsCodigo(codeForm);
    }, 400);
};

const inicializarInputsCodigo = (codeForm) => {
    const inputs = codeForm.querySelectorAll('input');
    const btnVerificar = document.getElementById('btn-verificar-codigo');

    inputs.forEach((input, index) => {
        // Só aceita dígitos
        input.addEventListener('keypress', (e) => {
            if (!/[0-9]/.test(e.key)) e.preventDefault();
        });

        input.addEventListener('input', () => {
            // Avança para o próximo campo
            if (input.value.length >= input.maxLength && inputs[index + 1]) {
                inputs[index + 1].focus();
            }

            // Gerencia estado do botão
            const todosPreenchidos = Array.from(inputs).every(i => i.value.length === 1);
            btnVerificar.disabled = !todosPreenchidos;
            btnVerificar.classList.toggle('botao-desabilitado', !todosPreenchidos);

            // Feedback visual por campo
            input.classList.toggle('invalid-code', input.value.length < input.maxLength);
        });

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && input.value.length === 0 && inputs[index - 1]) {
                inputs[index - 1].focus();
            }
        });
    });

    btnVerificar.addEventListener('click', () => verificarCodigo(codeForm, inputs));
};

const verificarCodigo = (codeForm, inputs) => {
    const codigoDigitado = Array.from(inputs).map(i => i.value).join('');

    if (codigoDigitado === codigoGerado) {
        renderizarEtapaNovaSenha();
    } else {
        // Animação de erro nos inputs
        inputs.forEach(input => {
            input.classList.add('invalid-code');
            input.value = '';
        });
        inputs[0].focus();
        mostrarNotificacao('Código incorreto. Verifique e tente novamente.');
    }
};

// ─── Etapa 3: Formulário de nova senha (renderizado por JS) ────

const renderizarEtapaNovaSenha = () => {
    const codeForm = document.getElementById('code-form');

    const senhaForm = document.createElement('form');
    senhaForm.id = 'senha-form';
    senhaForm.innerHTML = `
        <div class="container-texto">
            <h2>Nova Senha</h2>
            <p>Escolha uma senha forte para proteger seu acesso.</p>
        </div>

        <div class="input-container">
            <div class="input-flutuante">
                <input type="password" placeholder="" id="input-nova-senha" autocomplete="new-password">
                <label for="input-nova-senha">Nova senha</label>
            </div>
            <span class="span-invalido" id="span-invalido-senha" style="color: var(--cor-erro); font-size: 0.8rem; display: none;">
                A senha deve ter pelo menos 6 caracteres
            </span>

            <div class="input-flutuante" style="margin-top: 1rem">
                <input type="password" placeholder="" id="input-confirmar-senha" autocomplete="new-password">
                <label for="input-confirmar-senha">Confirmar nova senha</label>
            </div>
            <span class="span-invalido" id="span-invalido-confirmacao" style="color: var(--cor-erro); font-size: 0.8rem; display: none;">
                As senhas não coincidem
            </span>
        </div>

        <div class="container-botao">
            <button type="button" id="btn-salvar-senha" class="botao-desabilitado" disabled>
                Salvar Nova Senha
            </button>
            <a href="./login.html">Voltar ao Login</a>
        </div>

        <a href="./index.html" class="link-voltar">
            <i class="fa-solid fa-arrow-left"></i>
            Voltar para o site institucional
        </a>
    `;

    codeForm.style.transition = 'all 0.4s ease';
    codeForm.style.opacity = '0';
    codeForm.style.transform = 'translateY(-20px)';

    setTimeout(() => {
        codeForm.replaceWith(senhaForm);
        senhaForm.style.animation = 'fadeSlideUp 0.8s ease-in-out';
        inicializarInputsSenha(senhaForm);
    }, 400);
};

const inicializarInputsSenha = (senhaForm) => {
    const inputNovaSenha = document.getElementById('input-nova-senha');
    const inputConfirmarSenha = document.getElementById('input-confirmar-senha');
    const spanSenha = document.getElementById('span-invalido-senha');
    const spanConfirmacao = document.getElementById('span-invalido-confirmacao');
    const btnSalvar = document.getElementById('btn-salvar-senha');

    // Aplica estilo de label flutuante nos novos inputs (mesmo CSS do email-form)
    [inputNovaSenha, inputConfirmarSenha].forEach(input => {
        input.style.cssText = `
            font-size: 1.15rem;
            background: transparent;
            border: none;
            border-bottom: solid 2px var(--descricao);
            outline: none;
            padding: 0.7rem 0.3rem;
            width: 100%;
            color: var(--cor-clara);
            transition: all 0.5s;
        `;

        input.addEventListener('focus', () => {
            input.style.borderBottom = 'solid 2px var(--cor-segundaria)';
            input.nextElementSibling.style.top = '-10px';
            input.nextElementSibling.style.left = '0';
            input.nextElementSibling.style.fontSize = '1rem';
            input.nextElementSibling.style.color = 'var(--cor-segundaria)';
            input.nextElementSibling.style.fontWeight = '500';
        });

        input.addEventListener('blur', () => {
            if (!input.value) {
                input.style.borderBottom = 'solid 2px var(--descricao)';
                input.nextElementSibling.style.top = '15px';
                input.nextElementSibling.style.left = '5px';
                input.nextElementSibling.style.fontSize = '1.3rem';
                input.nextElementSibling.style.color = 'var(--cor-clara)';
                input.nextElementSibling.style.fontWeight = 'normal';
            }
        });
    });

    // Garante posicionamento inicial do label (igual ao CSS original)
    [inputNovaSenha, inputConfirmarSenha].forEach(input => {
        const label = input.nextElementSibling;
        label.style.position = 'absolute';
        label.style.left = '5px';
        label.style.top = '15px';
        label.style.fontSize = '1.3rem';
        label.style.pointerEvents = 'none';
        label.style.color = 'var(--cor-clara)';
        label.style.transition = 'all 0.5s';
    });

    const validarSenhas = () => {
        const senha = inputNovaSenha.value;
        const confirmacao = inputConfirmarSenha.value;
        let valido = true;

        if (senha.length < 6) {
            spanSenha.style.display = 'block';
            inputNovaSenha.style.borderBottom = 'solid 2px var(--cor-erro)';
            valido = false;
        } else {
            spanSenha.style.display = 'none';
            inputNovaSenha.style.borderBottom = 'solid 2px var(--cor-segundaria)';
        }

        if (confirmacao && senha !== confirmacao) {
            spanConfirmacao.style.display = 'block';
            inputConfirmarSenha.style.borderBottom = 'solid 2px var(--cor-erro)';
            valido = false;
        } else if (confirmacao) {
            spanConfirmacao.style.display = 'none';
            inputConfirmarSenha.style.borderBottom = 'solid 2px var(--cor-segundaria)';
        }

        const tudoOk = valido && senha.length >= 6 && senha === confirmacao;
        btnSalvar.disabled = !tudoOk;
        btnSalvar.classList.toggle('botao-desabilitado', !tudoOk);
    };

    inputNovaSenha.addEventListener('input', validarSenhas);
    inputConfirmarSenha.addEventListener('input', validarSenhas);

    btnSalvar.addEventListener('click', () => salvarNovaSenha(inputNovaSenha.value));
};

const salvarNovaSenha = async (novaSenha) => {
    const email = inputEmail.value;
    const btnSalvar = document.getElementById('btn-salvar-senha');

    btnSalvar.disabled = true;
    btnSalvar.innerHTML = '<i class="fa-solid fa-arrow-rotate-right"></i>';

    try {
        const response = await fetch('/usuarios/atualizar-senha', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ emailServer: email, novaSenhaServer: novaSenha })
        });

        if (response.ok) {
            mostrarNotificacao('Senha atualizada com sucesso! Você será redirecionado ao login.');
            setTimeout(() => {
                window.location.href = './login.html';
            }, 2500);
        } else {
            mostrarNotificacao('Erro ao salvar a senha. Tente novamente.');
            btnSalvar.disabled = false;
            btnSalvar.innerHTML = 'Salvar Nova Senha';
        }
    } catch (error) {
        mostrarNotificacao('Erro de conexão com o servidor.');
        btnSalvar.disabled = false;
        btnSalvar.innerHTML = 'Salvar Nova Senha';
    }
};

// ─── Inicialização ─────────────────────────────────────────────

inputEmail.addEventListener('input', validarCampoEmail);
btnRecuperarSenha.addEventListener('click', enviarEmail);