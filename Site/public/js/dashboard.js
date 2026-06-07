const usuario = JSON.parse(sessionStorage.getItem("usuario"));
const equipe = JSON.parse(sessionStorage.getItem("time"));
let strategies = [];

onInit();

async function onInit() {
    styleAntigo = document.querySelector(".loader").style.backgroundColor;
    document.querySelector(".loader").style.backgroundColor = "rgba(0, 0, 0, 1)" // solução temporaria
    document.querySelector(".loader").style.display = "flex";

    if (sessionStorage.getItem("ultimoscincojogos")) {
        renderUltimosCincoJogos(document.getElementById("lastGamesGraph"), JSON.parse(sessionStorage.getItem("ultimoscincojogos")));
    } else {
        await getUltimosCincoJogos(equipe.id);
    }

    if (sessionStorage.getItem("mediasGeraisEquipe")) {
        renderMediasGerais(JSON.parse(sessionStorage.getItem("mediasGeraisEquipe")));
    } else {
        await getMediasGerais();
    }

    if (sessionStorage.getItem("mediaFirstBlood")) {
        renderMediaFirstBlood(JSON.parse(sessionStorage.getItem("mediaFirstBlood")));
    } else {
        await getMediaFirstBlood();
    }

    if (sessionStorage.getItem("mediasPorTime")) {
        renderMediasPorTime(JSON.parse(sessionStorage.getItem("mediasPorTime")), JSON.parse(sessionStorage.getItem("mediasGeraisEquipe")));
    } else {
        await getMediasPorTime(equipe.id, JSON.parse(sessionStorage.getItem("mediasGeraisEquipe")));
    }

    if (sessionStorage.getItem("times")) {
        renderTeamList(document.getElementById("teamListContainer"), JSON.parse(sessionStorage.getItem("times")));
    } else {
        await getTimes();
    }

    if (sessionStorage.getItem("highlightUltimoJogo")) {
        renderHighlightUltimoJogo(document.getElementById("highlight"), JSON.parse(sessionStorage.getItem("highlightUltimoJogo"))[0]);
    } else {
        await getHighlightUltimoJogo(equipe.id);
    }

    if (sessionStorage.getItem("estrategias")) {
        renderStrategies(document.getElementById("strategiesContainer"), JSON.parse(sessionStorage.getItem("estrategias")));
    } else {
        await getEstrategias();
    }

    if (sessionStorage.getItem("winrateCampeonatos")) {
        renderWinrateChampionships(document.getElementById("winrateChart"), JSON.parse(sessionStorage.getItem("winrateCampeonatos")));
    } else {
        await getWinrateCampeonatos(equipe.id);
    }

    console.log(document.getElementById("sidebarContainer"));
    renderSidebar(document.getElementById("sidebarContainer"), "dashboard", {
        name: usuario.nome || usuario.name || "Mitohara",
        role: usuario.cargo == 2 ? "Coach" : "Jogador",
        email: usuario.email || "",
        imageUrl: usuario.imageUrl || "../assets/playerIcons/faker.png",
        nameTeam: equipe.nome || equipe.name || "T1",
        logoUrl: equipe.urlImagem || equipe.logoUrl || "../assets/icons/t1logo.png"
    });

    document.querySelector(".loader").style.display = "none";
    document.querySelector(".loader").style.backgroundColor = styleAntigo;
}

function renderMediasGerais(mediasGerais) {
    const g = Array.isArray(mediasGerais) ? mediasGerais[0] : mediasGerais;
    document.getElementById('mediaDPG').innerText = "Média global: " + Number(g.media_dano_por_gold).toFixed(2) + " DpG";
    document.getElementById('mediaVT').innerText = "Média global: " + Number(g.media_winrate).toFixed(2) + "%";
    document.getElementById('mediaObj').innerText = "Média global: " + Number(g.media_objetivos).toFixed(2);
    document.getElementById('mediaVPV').innerText = "Média global: " + Number(g.media_visao_por_minuto).toFixed(2) + " VpM";
    document.getElementById('mediaCOV').innerText = "Média global: " + Number(g.media_conversao_objetivos).toFixed(2) + "%";
}

function renderMediaFirstBlood(mediaFirstBlood) {
    const fb = Array.isArray(mediaFirstBlood) ? mediaFirstBlood[0] : mediaFirstBlood;
    document.getElementById('mediaFB').innerText = "Média global: " + fb.media_first_blood_rate + "%";
}

function renderMediasPorTime(mediasPorTime, mediasGerais) {
    const t = Array.isArray(mediasPorTime) ? mediasPorTime[0] : mediasPorTime;
    const g = Array.isArray(mediasGerais) ? mediasGerais[0] : mediasGerais;
    document.getElementById('dadoKpiDPG').innerText = Number(t.dano_por_gold).toFixed(2) + " DpG";
    document.getElementById('dadoKpiDPG').style.textDecorationColor = Number(t.dano_por_gold) > Number(g.media_dano_por_gold) ? "#14AE5C" : "#DF0004";
    document.getElementById('dadoKpiVT').innerText = Number(t.winrate).toFixed(0) + "%";
    document.getElementById('dadoKpiVT').style.textDecorationColor = Number(t.winrate) > Number(g.media_winrate) ? "#14AE5C" : "#DF0004";
    document.getElementById('dadoKpiObj').innerText = Number(t.objetivos).toFixed(2);
    document.getElementById('dadoKpiObj').style.textDecorationColor = Number(t.objetivos) > Number(g.media_objetivos) ? "#14AE5C" : "#DF0004";
    document.getElementById('dadoKpiVPV').innerText = Number(t.visao_por_minuto).toFixed(2) + " VpM";
    document.getElementById('dadoKpiVPV').style.textDecorationColor = Number(t.visao_por_minuto) > Number(g.media_visao_por_minuto) ? "#14AE5C" : "#DF0004";
    document.getElementById('dadoKpiFB').innerText = Number(t.first_blood_rate).toFixed(0) + "%";
    document.getElementById('dadoKpiFB').style.textDecorationColor = Number(t.first_blood_rate) > Number(g.media_first_blood_rate) ? "#14AE5C" : "#DF0004";
    document.getElementById('dadoKpiCOV').innerText = Number(t.conversao_objetivos).toFixed(0) + "%";
    document.getElementById('dadoKpiCOV').style.textDecorationColor = Number(t.conversao_objetivos) > Number(g.media_conversao_objetivos) ? "#14AE5C" : "#DF0004";
}

function getMediasGerais() {
    return fetch(`/times/getMediasGerais`)
        .then(function (resposta) {
            if (resposta.ok) {
                resposta.json().then(function (mediasGerais) {
                    sessionStorage.setItem("mediasGeraisEquipe", JSON.stringify(mediasGerais));
                    renderMediasGerais(mediasGerais);
                    console.log("Medias gerais recebidas:", mediasGerais);
                })
            }
        })
        .catch(function (erro) {
            console.error(`Erro na requisição de medias gerais: ${erro.message}`);
        })
}

function getMediaFirstBlood() {
    return fetch(`/times/getMediaFirstBlood`)
        .then(function (resposta) {
            if (resposta.ok) {
                resposta.json().then(function (mediaFirstBlood) {
                    sessionStorage.setItem("mediaFirstBlood", JSON.stringify(mediaFirstBlood));
                    renderMediaFirstBlood(mediaFirstBlood);
                    console.log("Media first blood recebida:", mediaFirstBlood);
                })
            }
        })
        .catch(function (erro) {
            console.error(`Erro na requisição de media first blood: ${erro.message}`);
        })
}

function getMediasPorTime(idEquipe, mediasGerais) {
    return fetch(`/times/getMediasPorTime/${idEquipe}`)
        .then(function (resposta) {
            if (resposta.ok) {
                resposta.json().then(function (mediasPorTime) {
                    sessionStorage.setItem("mediasPorTime", JSON.stringify(mediasPorTime));
                    renderMediasPorTime(mediasPorTime, mediasGerais);
                    console.log("Medias por time recebidas:", mediasPorTime);
                })
            }
        })
        .catch(function (erro) {
            console.error(`Erro na requisição de medias por time: ${erro.message}`);
        })
}

function getUltimosCincoJogos(idEquipe) {
    return fetch(`/times/getUltimosCincoJogos/${idEquipe}`)
        .then(function (resposta) {
            if (resposta.ok) {
                resposta.json().then(function (ultimosJogos) {
                    sessionStorage.setItem("ultimoscincojogos", JSON.stringify(ultimosJogos));
                    renderUltimosCincoJogos(document.getElementById('lastGamesGraph'), ultimosJogos);
                    console.log("Últimos jogos recebidos:", ultimosJogos);
                })
            }
        })
        .catch(function (erro) {
            console.error(`Erro na requisição de últimos jogos: ${erro.message}`);
        })
}

function renderUltimosCincoJogos(container, ultimosJogos) {
    container.innerHTML = "";
    ultimosJogos.forEach(function (jogo) {
        const jogoElement = document.createElement("div");
        jogoElement.classList.add(jogo.resultado === 'V' ? 'lastGameWin' : 'lastGameLoss');
        jogoElement.innerHTML = jogo.resultado;
        container.appendChild(jogoElement);
    });
}


function getWinrateCampeonatos(idEquipe) {
    return fetch(`/times/getWinrateCampeonatos/${idEquipe}`)
        .then(function (resposta) {
            if (resposta.ok) {
                resposta.json().then(function (winrateCampeonatos) {
                    sessionStorage.setItem("winrateCampeonatos", JSON.stringify(winrateCampeonatos));
                    renderWinrateChampionships(document.getElementById('winrateChart'), winrateCampeonatos);
                    console.log("Winrate campeonatos recebidos:", winrateCampeonatos);
                });
            } else {
                console.error("Nenhum winrate campeonatos encontrado ou erro na API");
            }
        })
        .catch(function (erro) {
            console.error(`Erro na requisição de winrate campeonatos: ${erro.message}`);
        });
}

function renderWinrateChampionships(ctx, winrate) {
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: winrate.map(d => [
                d.torneio.length > 20 ? d.torneio.substring(0, 20) + '...' : d.torneio,
                d.serie
            ]).reverse(),
            datasets: [{
                label: 'Winrate %',
                data: winrate.map(d => d.winrate).reverse(),
                backgroundColor: winrate.map(d => d.winrate >= 50 ? '#0F8B8B80' : '#8B0F0F80').reverse(),
                borderColor: winrate.map(d => d.winrate >= 50 ? '#0F8B8B' : '#8B0F0F').reverse(),
                borderWidth: 1,
                borderRadius: 4,

            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    min: 0,
                    max: 100,
                    grid: { color: '#44444460' },
                    ticks: {
                        color: '#fff',
                        callback: value => value + '%'
                    }
                },
                x: {
                    grid: { display: false },
                    ticks: {
                        color: '#fff',
                        font: {
                            family: 'Montserrat',
                            size: 12
                        },
                        maxRotation: 0,
                        minRotation: 0,
                        maxTicksLimit: 5
                    }
                }
            },
            plugins: {
                legend: { display: false },
                annotation: {
                    annotations: {
                        linha50: {
                            type: 'line',
                            yMin: 50,
                            yMax: 50,
                            borderColor: '#ffffff60',
                            borderWidth: 2,
                            borderDash: [6, 4]
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: ctx => `${ctx.raw}% (${winrate[ctx.dataIndex].jogos} jogos)`
                    }
                }
            }
        }
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
                        logoUrl: time.urlImagem || time.logoUrl || "../assets/icons/t1logo.png"
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
        })
        .catch(function (erro) {
            console.error(`Erro na requisição de estratégias: ${erro.message}`);
            strategies = [];
            renderStrategies(document.getElementById("strategiesContainer"), strategies);
        });
}

function formatarData(data) {
    const date = new Date(data);
    const dia = String(date.getDate()).padStart(2, '0');
    const mes = String(date.getMonth() + 1).padStart(2, '0');
    const ano = date.getFullYear();
    return `${dia}/${mes}/${ano}`;
}

function getHighlightUltimoJogo(idEquipe) {
    return fetch(`/times/getHighlightUltimoJogo/${idEquipe}`)
        .then(response => response.json())
        .then(data => {
            console.log("Destaque do último jogo:", data);
            sessionStorage.setItem("highlightUltimoJogo", JSON.stringify(data));
        })
        .catch(error => { console.error("Erro ao obter destaque do último jogo:", error); throw error; });
}

function criarEstrategia(titulo, conteudo) {
    const idTreinador = usuario.id;

    if (!titulo || !conteudo) {
        console.error("Título e conteúdo são obrigatórios");
        return Promise.reject("Campos obrigatórios");
    }

    document.querySelector(".loader").style.display = "flex";

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
                document.querySelector(".loader").style.display = "none";
                return resposta.text().then(text => {
                    console.error("Erro ao criar estratégia:", text);
                    throw new Error(text || resposta.statusText);
                });
            }
        })
        .catch(function (erro) {
            document.querySelector(".loader").style.display = "none";
            console.error(`Erro na criação de estratégia: ${erro.message}`);
            throw erro;
        });
}

function atualizarEstrategia(id, titulo, conteudo) {
    if (!titulo || !conteudo) {
        console.error("Título e conteúdo são obrigatórios");
        return Promise.reject("Campos obrigatórios");
    }

    document.querySelector(".loader").style.display = "flex";

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
                document.querySelector(".loader").style.display = "none";
                return resposta.text().then(text => {
                    console.error("Erro ao atualizar estratégia:", text);
                    throw new Error(text || resposta.statusText);
                });
            }
        })
        .catch(function (erro) {
            document.querySelector(".loader").style.display = "none";
            console.error(`Erro na atualização de estratégia: ${erro.message}`);
            throw erro;
        });
}

function deletarEstrategia(id) {
    document.querySelector(".loader").style.display = "flex";
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
                document.querySelector(".loader").style.display = "none";
                return resposta.text().then(text => {
                    console.error("Erro ao deletar estratégia:", text);
                    throw new Error(text || resposta.statusText);
                });
            }
        })
        .catch(function (erro) {
            document.querySelector(".loader").style.display = "none";
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
