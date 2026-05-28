const usuario = JSON.parse(sessionStorage.getItem("usuario"));
const equipe = JSON.parse(sessionStorage.getItem("time"));
let strategies = [];

onInit();

function onInit() {
    document.querySelector(".loader").style.display = "flex";
    getTimes();
    
    sessionStorage.getItem("estrategias") ? renderStrategies(document.getElementById("strategiesContainer"), JSON.parse(sessionStorage.getItem("estrategias"))) : getEstrategias();

    console.log(document.getElementById("sidebarContainer"));
    renderSidebar(document.getElementById("sidebarContainer"), "dashboard", {
    name: usuario.nome || usuario.name || "Mitohara",
    role: usuario.cargo == 2 ? "Coach" : "Jogador",
    email: usuario.email || "",
    imageUrl: usuario.imageUrl || "../assets/playerIcons/faker.png",
    nameTeam: equipe.nome || equipe.name || "T1",
    logoUrl: equipe.urlImagem || equipe.logoUrl || "../assets/icons/t1logo.png"
});
}

function getTimes() {
    fetch("/times/listar")
        .then(function (resposta) {
            if (resposta.ok) {
                resposta.json().then(function (times) {
                    const normalizedTimes = times.map(time => ({
                        id: time.id,
                        name: time.name || time.nome,
                        logoUrl: time.logoUrl || "../assets/icons/t1logo.png"
                    }));
                    sessionStorage.setItem("times", JSON.stringify(normalizedTimes));
                    renderTeamList(document.getElementById("teamListContainer"), normalizedTimes);
                    console.log("Times recebidos:", normalizedTimes);
                });
            } else {
                console.error("Nenhuma equipe encontrada ou erro na API");
            }
        })
        .catch(function (erro) {
            console.error(`Erro na requisição de equipes: ${erro.message}`);
        });
}

function getEstrategias() {
    const idTreinador = usuario.id;
    
    if (!idTreinador) {
        console.error("ID do treinador não identificado");
        return;
    }

    fetch(`/treinador/getEstrategiasPorTreinador/${idTreinador}`)
        .then(function (resposta) {
            if (resposta.status === 204) {
                strategies = [];
                renderStrategies(document.getElementById("strategiesContainer"), strategies);
            } else if (resposta.ok) {
                resposta.json().then(function (estrategias) {
                    strategies = estrategias.map(e => ({
                        id: e.id_estrategia,
                        nome: e.titulo,
                        data: formatarData(e.dt_criacao),
                        texto: e.conteudo,
                        icone: "../assets/icons/aim.svg"
                    }));
                    sessionStorage.setItem("estrategias", JSON.stringify(strategies));
                    renderStrategies(document.getElementById("strategiesContainer"), strategies);
                    console.log("Estratégias recebidas:", strategies);
                });
            } else {
                console.error("Erro ao buscar estratégias");
                strategies = [];
                renderStrategies(document.getElementById("strategiesContainer"), strategies);
            }
            document.querySelector(".loader").style.display = "none";
        })
        .catch(function (erro) {
            console.error(`Erro na requisição de estratégias: ${erro.message}`);
            strategies = [];
            renderStrategies(document.getElementById("strategiesContainer"), strategies);
            document.querySelector(".loader").style.display = "none";
        });
}

function formatarData(data) {
    const date = new Date(data);
    const dia = String(date.getDate()).padStart(2, '0');
    const mes = String(date.getMonth() + 1).padStart(2, '0');
    const ano = date.getFullYear();
    return `${dia}/${mes}/${ano}`;
}

function criarEstrategia(titulo, conteudo) {
    const idTreinador = usuario.id;

    if (!titulo || !conteudo) {
        console.error("Título e conteúdo são obrigatórios");
        return Promise.reject("Campos obrigatórios");
    }

    return fetch("/treinador/criarEstrategia", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            tituloServer: titulo,
            textoServer: conteudo,
            fkTreinadorServer: idTreinador
        })
    })
    .then(function (resposta) {
        if (resposta.ok) {
            return resposta.json().then(function () {
                getEstrategias();
                return true;
            });
        } else {
            return resposta.text().then(text => {
                console.error("Erro ao criar estratégia:", text);
                throw new Error(text || resposta.statusText);
            });
        }
    })
    .catch(function (erro) {
        console.error(`Erro na criação de estratégia: ${erro.message}`);
        throw erro;
    });
}

function atualizarEstrategia(id, titulo, conteudo) {
    if (!titulo || !conteudo) {
        console.error("Título e conteúdo são obrigatórios");
        return Promise.reject("Campos obrigatórios");
    }

    return fetch(`/treinador/atualizarEstrategia/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            tituloServer: titulo,
            textoServer: conteudo
        })
    })
    .then(function (resposta) {
        if (resposta.ok) {
            return resposta.json().then(function () {
                getEstrategias();
                return true;
            });
        } else {
            return resposta.text().then(text => {
                console.error("Erro ao atualizar estratégia:", text);
                throw new Error(text || resposta.statusText);
            });
        }
    })
    .catch(function (erro) {
        console.error(`Erro na atualização de estratégia: ${erro.message}`);
        throw erro;
    });
}

function deletarEstrategia(id) {
    return fetch(`/treinador/deletarEstrategia/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(function (resposta) {
        if (resposta.ok) {
            return resposta.json().then(function () {
                getEstrategias();
                return true;
            });
        } else {
            return resposta.text().then(text => {
                console.error("Erro ao deletar estratégia:", text);
                throw new Error(text || resposta.statusText);
            });
        }
    })
    .catch(function (erro) {
        console.error(`Erro na deleção de estratégia: ${erro.message}`);
        throw erro;
    });
}

function removeStrategy(index) {
    const estrategia = strategies[index];
    if (estrategia && estrategia.id) {
        deletarEstrategia(estrategia.id)
            .then(function () {
                console.log("Estratégia deletada com sucesso");
            })
            .catch(function (erro) {
                console.error("Erro ao deletar estratégia:", erro);
                alert("Erro ao deletar estratégia");
            });
    } else {
        strategies.splice(index, 1);
        renderStrategies(document.getElementById("strategiesContainer"), strategies);
    }
}

function switchSidebar() {
    const sbBackdrop = document.getElementById("sbBackdrop");
    console.log(sbBackdrop);
    if (sbBackdrop) {
        sbBackdrop.classList.toggle("sb-hidden");
    }
}

function switchTeamList() {
    const tlBackdrop = document.getElementById("tlBackdrop");
    if (tlBackdrop) {
        tlBackdrop.classList.toggle("tl-hidden");
    }
}


// Handlers para salvar estratégias no modal
window.salvarEstrategia = function () {
    const tituloEl = document.getElementById('strategyModalNome');
    const textoEl = document.getElementById('strategyModalTexto');
    
    if (!tituloEl || !textoEl) return;

    const titulo = tituloEl.value;
    const texto = textoEl.value;
    const modal = document.getElementById('modalStrategyFundo');
    const estrategiaId = modal ? modal.getAttribute('data-estrategia-id') : null;

    if (!titulo || !texto) {
        alert("Preencha todos os campos");
        return;
    }

    if (estrategiaId) {
        atualizarEstrategia(estrategiaId, titulo, texto)
            .then(function () {
                fecharModalStrategy();
            })
            .catch(function (erro) {
                alert("Erro ao atualizar estratégia: " + erro.message);
            });
    }
};

window.salvarNovaEstrategia = function () {
    const tituloEl = document.getElementById('createStrategyTitle');
    const textoEl = document.getElementById('createStrategyContent');

    if (!tituloEl || !textoEl) {
        alert("Campos de entrada não encontrados");
        return;
    }

    const titulo = tituloEl.value || '';
    const texto = textoEl.value || '';

    if (!titulo || !texto) {
        alert("Preencha todos os campos");
        return;
    }

    criarEstrategia(titulo, texto)
        .then(function () {
            fecharModalCreateStrategy();
        })
        .catch(function (erro) {
            alert("Erro ao criar estratégia: " + erro.message);
        });
};
