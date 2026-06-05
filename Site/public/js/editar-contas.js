async function getUsuarios(idGerente) {
    try {
        const response = await fetch(`/usuarios/listarUsuariosPorGerente/${idGerente}`);
        if (response.status === 204) return [];
        if (!response.ok) {
            console.error("Erro ao buscar usuários: " + response.statusText);
            return [];
        }
        const data = await response.json();
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error("Erro na requisição: " + error.message);
        return [];
    }
}

let users = [];
const loader = document.getElementById('loaderEditarContas');

function showLoader() {
    if (loader) loader.style.display = 'flex';
}

function hideLoader() {
    if (loader) loader.style.display = 'none';
}

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

function formatarTelefoneInput(event) {
    let telefone = event.target.value.replace(/\D/g, "");
    telefone = telefone.replace(/^(\d{2})(\d)/, "($1) $2");
    telefone = telefone.replace(/(\d{5})(\d)/, "$1-$2");
    event.target.value = telefone.slice(0, 15);
}

getUsuarios(JSON.parse(sessionStorage.getItem("usuario")).id)
    .then(fetched => {
        users = fetched;
        const paginationContainer = document.getElementById('editarContasPagination');
        renderUsuarioEditarContas(document.getElementById("editarContasContainer"), users, paginationContainer, 1);
    })
    .finally(() => {
        hideLoader();
    });
console.log(users);
let gerente = JSON.parse(sessionStorage.getItem("usuario"));

renderSidebar(document.getElementById("sidebarContainer"), "", {
    name: gerente.nome,
    role: 'Gerente',
    imageUrl: "../assets/playerIcons/faker.png",
    nameTeam: gerente.nameTeam,
    logoUrl: "../assets/icons/t1logo.png"
});

const paginationContainer = document.getElementById('editarContasPagination');
const criarTelefoneInput = document.getElementById('criarTelefone');
const editarTelefoneInput = document.getElementById('editarTelefone');
if (criarTelefoneInput) criarTelefoneInput.addEventListener('input', formatarTelefoneInput);
if (editarTelefoneInput) editarTelefoneInput.addEventListener('input', formatarTelefoneInput);
renderUsuarioEditarContas(document.getElementById("editarContasContainer"), users, paginationContainer, 1);

function mudarPagina(pagina, element) {
    document.querySelectorAll('.editar-contas-pagination-item').forEach(item => {
        item.classList.remove('active');
    });
    element.classList.add('active');
    renderUsuarioEditarContas(document.getElementById("editarContasContainer"), users, paginationContainer, pagina);
}

function switchSidebar() {
    document.getElementById("sbBackdrop").classList.toggle("sb-hidden");
}

function abrirModalEditar() {
    document.getElementById("modalEditarFundo").classList.add("editar-contas-modal-visivel");
}

function fecharModalEditar() {
    document.getElementById("modalEditarFundo").classList.remove("editar-contas-modal-visivel");
    const errorEl = document.getElementById('editarError');
    if (errorEl) {
        errorEl.style.display = 'none';
        errorEl.innerText = '';
    }
}

let usuarioDeletandoId = null;

function abrirModalExcluir(usuarioId) {
    usuarioDeletandoId = usuarioId;
    document.getElementById("modalExcluirFundo").classList.add("editar-contas-modal-visivel");
}

function fecharModalExcluir() {
    document.getElementById("modalExcluirFundo").classList.remove("editar-contas-modal-visivel");
    usuarioDeletandoId = null;
}

async function confirmarDelecao() {
    if (!usuarioDeletandoId) {
        console.error("ID do usuário não definido");
        return;
    }

    showLoader();

    try {
        await deletarUsuario(usuarioDeletandoId);
        const gerenteSession = JSON.parse(sessionStorage.getItem("usuario")) || {};
        const gerenteId = gerenteSession.id || gerenteSession.id_usuario || null;
        users = await getUsuarios(gerenteId);
        renderUsuarioEditarContas(document.getElementById("editarContasContainer"), users, paginationContainer, 1);
        fecharModalExcluir();
    } catch (error) {
        console.error(error);
        alert('Erro ao deletar usuário: ' + error.message);
    } finally {
        hideLoader();
    }
}

function deletarUsuario(idUsuario) {
    return fetch(`/usuarios/deletar/${idUsuario}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(function (response) {
        if (response.ok) {
            return response.json();
        }
        return response.text().then(text => { throw new Error(text || response.statusText); });
    });
}

function toggleStatus() {
    document.getElementById("toggleAtivo").classList.toggle("ativo");
}

function abrirModalCriarConta() {
    const modal = document.getElementById('modalCriarFundo');
    const errorEl = document.getElementById('criarError');
    if (errorEl) {
        errorEl.style.display = 'none';
        errorEl.innerText = '';
    }
    const nomeIn = document.getElementById('criarNome');
    const emailIn = document.getElementById('criarEmail');
    const senhaIn = document.getElementById('criarSenha');
    const cargoIn = document.getElementById('criarCargo');
    const telefoneIn = document.getElementById('criarTelefone');
    if (nomeIn) nomeIn.value = '';
    if (emailIn) emailIn.value = '';
    if (senhaIn) senhaIn.value = '';
    if (cargoIn) cargoIn.value = '2';
    if (telefoneIn) telefoneIn.value = '';
    if (modal) modal.classList.add('editar-contas-modal-visivel');
}

function fecharModalCriarConta() {
    const modal = document.getElementById('modalCriarFundo');
    if (modal) modal.classList.remove('editar-contas-modal-visivel');
}

async function criarConta() {
    const nome = document.getElementById('criarNome')?.value || '';
    const cargo = document.getElementById('criarCargo')?.value || '';
    const email = document.getElementById('criarEmail')?.value || '';
    const telefone = document.getElementById('criarTelefone')?.value || '';
    const senha = document.getElementById('criarSenha')?.value || '';

    const errorEl = document.getElementById('criarError');
    showLoader();

    if (!nome || !email || !telefone || !senha) {
        if (errorEl) {
            errorEl.innerText = 'Preencha todos os campos obrigatórios.';
            errorEl.style.display = 'block';
            errorEl.style.textAlign = 'center';
        }
        hideLoader();
        return;
    }

    if (telefone.length !== 15) {
        if (errorEl) {
            errorEl.innerText = 'Telefone inválido. Use o formato (xx) xxxxx-xxxx.';
            errorEl.style.display = 'block';
            errorEl.style.textAlign = 'center';
        }
        hideLoader();
        return;
    }

    if (!emailValido(email)) {
        if (errorEl) {
            errorEl.innerText = 'Formato de e-mail inválido. O e-mail precisa conter @ e ponto após o @.';
            errorEl.style.display = 'block';
            errorEl.style.textAlign = 'center';
        }
        hideLoader();
        return;
    }

    if (!senhaValida(senha)) {
        if (errorEl) {
            errorEl.innerText = 'A senha precisa ter no mínimo 6 caracteres, 1 número, 1 letra maiúscula e 1 letra minúscula.';
            errorEl.style.display = 'block';
            errorEl.style.textAlign = 'center';
        }
        hideLoader();
        return;
    }

    const gerenteSession = JSON.parse(sessionStorage.getItem("usuario")) || {};
    const gerenteId = gerenteSession.id || gerenteSession.id_usuario || null;
    const payload = {
        nomeServer: nome,
        emailServer: email,
        senhaServer: senha,
        cargoServer: Number(cargo),
        codEquipeServer: gerenteSession.codEquipe || gerenteSession.cod_equipe || null,
        fkGestorServer: gerenteId,
        telefoneServer: telefone
    };

    try {
        await cadastrarUsuario(payload);
        users = await getUsuarios(gerenteId);
        renderUsuarioEditarContas(document.getElementById("editarContasContainer"), users, paginationContainer, 1);
        fecharModalCriarConta();
    } catch (error) {
        console.error(error);
        if (errorEl) {
            errorEl.innerText = 'Erro ao cadastrar usuário.';
            errorEl.style.display = 'block';
            errorEl.style.textAlign = 'center';
        }
    } finally {
        hideLoader();
    }
}

function cadastrarUsuario(payload) {
    return fetch(`/usuarios/cadastrar`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    }).then(function (response) {
        if (response.ok) {
            return response.json();
        }
        return response.text().then(text => { throw new Error(text || response.statusText); });
    });
}

let usuarioEditandoId = null;

function abrirModalEditar(usuarioId) {
    const usuarioEncontrado = users.find(u => u.id === usuarioId);

    if (!usuarioEncontrado) {
        console.error("Usuário não encontrado");
        return;
    }

    usuarioEditandoId = usuarioId;

    document.getElementById('editarNome').value = usuarioEncontrado.nome || '';
    document.getElementById('editarEmail').value = usuarioEncontrado.email || '';
    document.getElementById('editarTelefone').value = usuarioEncontrado.telefone || '';
    document.getElementById('editarCargo').value = usuarioEncontrado.cargo || '2';

    const errorEl = document.getElementById('editarError');
    if (errorEl) {
        errorEl.style.display = 'none';
        errorEl.innerText = '';
    }

    document.getElementById("modalEditarFundo").classList.add("editar-contas-modal-visivel");
}

async function salvarEdicao() {
    const nome = document.getElementById('editarNome')?.value || '';
    const cargo = document.getElementById('editarCargo')?.value || '';
    const email = document.getElementById('editarEmail')?.value || '';
    const telefone = document.getElementById('editarTelefone')?.value || '';
    const errorEl = document.getElementById('editarError');

    showLoader();

    if (!nome || !email) {
        if (errorEl) {
            errorEl.innerText = 'Preencha os campos de nome e email obrigatórios.';
            errorEl.style.display = 'block';
            errorEl.style.textAlign = 'center';
        }
        hideLoader();
        return;
    }

    if (telefone && telefone.length !== 15) {
        if (errorEl) {
            errorEl.innerText = 'Telefone inválido. Use o formato (xx) xxxxx-xxxx.';
            errorEl.style.display = 'block';
            errorEl.style.textAlign = 'center';
        }
        hideLoader();
        return;
    }

    if (email && !emailValido(email)) {
        if (errorEl) {
            errorEl.innerText = 'Formato de e-mail inválido. O e-mail precisa conter @ e ponto após o @.';
            errorEl.style.display = 'block';
            errorEl.style.textAlign = 'center';
        }
        hideLoader();
        return;
    }

    const payload = {
        nomeServer: nome,
        emailServer: email,
        cargoServer: Number(cargo),
        telefoneServer: telefone
    };

    try {
        await atualizarUsuario(usuarioEditandoId, payload);
        const gerenteSession = JSON.parse(sessionStorage.getItem("usuario")) || {};
        const gerenteId = gerenteSession.id || gerenteSession.id_usuario || null;
        users = await getUsuarios(gerenteId);
        renderUsuarioEditarContas(document.getElementById("editarContasContainer"), users, paginationContainer, 1);
        fecharModalEditar();
        if (errorEl) {
            errorEl.style.display = 'none';
            errorEl.innerText = '';
        }
    } catch (error) {
        console.error(error);
        if (errorEl) {
            errorEl.innerText = 'Erro ao atualizar usuário: ' + error.message;
            errorEl.style.display = 'block';
            errorEl.style.textAlign = 'center';
        }
    } finally {
        hideLoader();
    }
}

function atualizarUsuario(idUsuario, payload) {
    return fetch(`/usuarios/atualizar/${idUsuario}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    }).then(function (response) {
        if (response.ok) {
            return response.json();
        }
        return response.text().then(text => { throw new Error(text || response.statusText); });
    });
}