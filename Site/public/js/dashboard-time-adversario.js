const usuario = JSON.parse(sessionStorage.getItem("usuario"));
const equipe = JSON.parse(sessionStorage.getItem("time"));
const timeAdversario = JSON.parse(sessionStorage.getItem("timeAdversario"));
const mediasGeraisEquipe = JSON.parse(sessionStorage.getItem("mediasGeraisEquipe"));
const mediaFirstBlood = JSON.parse(sessionStorage.getItem("mediaFirstBlood"));

onInit();

async function onInit() {
    const loader = document.querySelector(".loader");
    const bgAntigo = loader.style.backgroundColor;
    loader.style.backgroundColor = "rgba(0, 0, 0, 1)";
    loader.style.display = "flex";

    renderSidebar(document.getElementById("sidebarContainer"), "dashboard-time-adversario", {
        name: usuario?.nome,
        role: usuario?.cargo == 2 ? "Coach" : "Jogador",
        email: usuario?.email,
        imageUrl: "../assets/playerIcons/faker.png",
        nameTeam: equipe?.nome,
        logoUrl: equipe?.urlImagem || "../assets/icons/t1logo.png"
    });

    if (sessionStorage.getItem("times")) {
        renderTeamList(document.getElementById("teamListContainer"), JSON.parse(sessionStorage.getItem("times")));
    } else {
        await getTimes();
    }

    renderMediasGerais(mediasGeraisEquipe);
    renderMediaFirstBlood(mediaFirstBlood);

    let mediasGeraisJogadores = JSON.parse(sessionStorage.getItem("mediasGerais"));
    if (!mediasGeraisJogadores) {
        mediasGeraisJogadores = await getMediasGeraisJogadores();
    }

    if (timeAdversario?.id) {
        const cachedPerfil = sessionStorage.getItem(`timeAdversarioPerfil_${timeAdversario.id}`);
        if (cachedPerfil) {
            renderAdversarioProfile(JSON.parse(cachedPerfil)?.nomeTreinador);
        } else {
            await fetch(`/times/buscar/${timeAdversario.id}`)
                .then(r => r.ok ? r.json() : null)
                .then(data => {
                    sessionStorage.setItem(`timeAdversarioPerfil_${timeAdversario.id}`, JSON.stringify(data));
                    renderAdversarioProfile(data?.nomeTreinador);
                })
                .catch(() => renderAdversarioProfile(null));
        }
        await getMediasPorTime(timeAdversario.id);
        const elenco = await getElencoAdversario(timeAdversario.id);
        renderPerfilDoTimeAdversario(elenco, mediasGeraisJogadores);
        renderElencoAdversario(elenco);
    } else {
        renderAdversarioProfile(null);
    }

    loader.style.display = "none";
    loader.style.backgroundColor = bgAntigo;
}

function renderAdversarioProfile(nomeTreinador) {
    renderTeamProfile(document.getElementById('teamProfile'), {
        name: timeAdversario?.nome || "Adversário",
        coach: nomeTreinador ? `Coach: ${nomeTreinador}` : "",
        logoUrl: timeAdversario?.urlImagem || "../assets/icons/t1logo.png"
    });
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

function renderMediasPorTime(mediasPorTime) {
    const t = Array.isArray(mediasPorTime) ? mediasPorTime[0] : mediasPorTime;
    const g = Array.isArray(mediasGeraisEquipe) ? mediasGeraisEquipe[0] : mediasGeraisEquipe;
    const fb = Array.isArray(mediaFirstBlood) ? mediaFirstBlood[0] : mediaFirstBlood;

    function setKpi(id, valor, media) {
        const el = document.getElementById(id);
        const v = Number(valor), m = Number(media);
        el.classList.remove('acimaMedia', 'abaixoMedia', 'naMedia');
        el.classList.add(v > m ? 'acimaMedia' : v < m ? 'abaixoMedia' : 'naMedia');
    }

    document.getElementById('dadoKpiDPG').innerText = Number(t.dano_por_gold).toFixed(2) + " DpG";
    setKpi('dadoKpiDPG', t.dano_por_gold, g.media_dano_por_gold);
    document.getElementById('dadoKpiVT').innerText = Number(t.winrate).toFixed(0) + "%";
    setKpi('dadoKpiVT', t.winrate, g.media_winrate);
    document.getElementById('dadoKpiObj').innerText = Number(t.objetivos).toFixed(2);
    setKpi('dadoKpiObj', t.objetivos, g.media_objetivos);
    document.getElementById('dadoKpiVPV').innerText = Number(t.visao_por_minuto).toFixed(2) + " VpM";
    setKpi('dadoKpiVPV', t.visao_por_minuto, g.media_visao_por_minuto);
    document.getElementById('dadoKpiFB').innerText = Number(t.first_blood_rate).toFixed(0) + "%";
    setKpi('dadoKpiFB', t.first_blood_rate, fb.media_first_blood_rate);
    document.getElementById('dadoKpiCOV').innerText = Number(t.conversao_objetivos).toFixed(0) + "%";
    setKpi('dadoKpiCOV', t.conversao_objetivos, g.media_conversao_objetivos);
}

function getMediasPorTime(idEquipe) {
    const cacheKey = `mediasPorTimeAdversario_${idEquipe}`;
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) {
        renderMediasPorTime(JSON.parse(cached));
        return Promise.resolve();
    }
    return fetch(`/times/getMediasPorTime/${idEquipe}`)
        .then(function (resposta) {
            if (resposta.ok) {
                resposta.json().then(function (mediasPorTime) {
                    sessionStorage.setItem(cacheKey, JSON.stringify(mediasPorTime));
                    renderMediasPorTime(mediasPorTime);
                    console.log("Medias por time adversário:", mediasPorTime);
                });
            }
        })
        .catch(function (erro) {
            console.error(`Erro na requisição de medias por time: ${erro.message}`);
        });
}

function getTimes() {
    return fetch("/times/listar")
        .then(function (resposta) {
            if (resposta.ok) {
                resposta.json().then(function (times) {
                    const normalizedTimes = times.map(time => ({
                        id: time.id_equipe || time.id,
                        name: time.name || time.nome,
                        logoUrl: time.urlImagem || time.logoUrl || "../assets/icons/t1logo.png"
                    }));
                    sessionStorage.setItem("times", JSON.stringify(normalizedTimes));
                    renderTeamList(document.getElementById("teamListContainer"), normalizedTimes);
                });
            }
        })
        .catch(function (erro) {
            console.error(`Erro na requisição de equipes: ${erro.message}`);
        });
}

function renderPerfilDoTimeAdversario(elenco, mediasGerais) {
    const ordem = ["Top", "Jungle", "Mid", "Bot", "Support"];
    const elencoOrdenado = [...elenco].sort((a, b) => ordem.indexOf(a.funcao) - ordem.indexOf(b.funcao));
    new Chart(document.getElementById("teamRadarChartAdv"), {
        type: 'bar',
        data: {
            labels: ['DPM', 'Kills', 'Deaths', 'Assists', 'KP%', 'GPM', 'CSPM', 'Wards/min'],
            datasets: [{
                label: timeAdversario?.nome || "Adversário",
                data: montarRadarTime(elencoOrdenado, mediasGerais),
                backgroundColor: '#0F8B8B80',
                borderColor: '#0F8B8B',
                borderWidth: 1,
                borderRadius: 4
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
                    ticks: { color: '#fff', font: { family: 'Montserrat', size: 11 } }
                },
                x: {
                    grid: { display: false },
                    ticks: { color: '#fff', font: { family: 'Montserrat', size: 11 } }
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
                }
            }
        }
    });
}

function getMediasGeraisJogadores() {
    return fetch("/jogadores/getMediasGerais")
        .then(function (resposta) {
            if (resposta.ok) {
                return resposta.json().then(function (medias) {
                    sessionStorage.setItem("mediasGerais", JSON.stringify(medias));
                    return medias;
                });
            }
        })
        .catch(function (erro) {
            console.error(`Erro na requisição de médias gerais de jogadores: ${erro.message}`);
        });
}

async function getElencoAdversario(idEquipe) {
    const cacheKey = `elencoAdversario_${idEquipe}`;
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) return JSON.parse(cached);
    try {
        const resposta = await fetch(`/jogadores/listarElenco/${idEquipe}`);
        if (resposta.ok) {
            const elenco = await resposta.json();
            sessionStorage.setItem(cacheKey, JSON.stringify(elenco));
            return elenco;
        }
    } catch (erro) {
        console.error(`Erro na requisição do elenco adversário: ${erro.message}`);
    }
    return [];
}

function renderElencoAdversario(elenco) {
    const ordem = ["Top", "Jungle", "Mid", "Bot", "Support"];
    const elencoOrdenado = [...elenco].sort((a, b) => ordem.indexOf(a.funcao) - ordem.indexOf(b.funcao));
    const cards = document.querySelectorAll('.adversaryCard');
    elencoOrdenado.forEach((jogador, i) => {
        const card = cards[i];
        if (!card) return;
        if (jogador.powerPick && splashImages[jogador.powerPick]) {
            card.style.backgroundImage = `url(${splashImages[jogador.powerPick].replace('/splash/', '/loading/')})`;
        }
        const foto = card.querySelector('.adversaryCardPhoto');
        if (foto) foto.src = jogador.urlFotoJogador || '../assets/playerIcons/faker.png';
        const nome = card.querySelector('.adversaryCardName');
        if (nome) nome.textContent = jogador.nome || '—';
        const champ = card.querySelector('.adversaryCardChampion');
        if (champ) champ.textContent = jogador.powerPick || '—';
        card.style.cursor = 'pointer';
        card.onclick = () => {
            const elencoTime = JSON.parse(sessionStorage.getItem('elenco')) || [];
            const jogadorAliado = elencoTime.find(j => j.funcao === jogador.funcao);
            const params = new URLSearchParams({
                idAdversario: jogador.idJogador,
                idAliado: jogadorAliado?.idJogador || ''
            });
            window.location.href = `http://32.196.238.3:4200?${params.toString()}`;
        };
    });
}

function switchSidebar() {
    const sbBackdrop = document.getElementById("sbBackdrop");
    if (sbBackdrop) sbBackdrop.classList.toggle("sb-hidden");
}

function switchTeamList() {
    const tlBackdrop = document.getElementById("tlBackdrop");
    if (tlBackdrop) tlBackdrop.classList.toggle("tl-hidden");
}
