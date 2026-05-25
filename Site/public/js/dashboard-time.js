


const usuario = JSON.parse(sessionStorage.getItem("usuario"));
const equipe = JSON.parse(sessionStorage.getItem("time"));
const elenco = JSON.parse(sessionStorage.getItem("elenco"));
const ordem = ["Top", "Jungle", "Mid", "Bot", "Support"];
const elencoOrdenado = elenco.sort((a, b) => ordem.indexOf(a.funcao) - ordem.indexOf(b.funcao));
const mediasGerais = JSON.parse(sessionStorage.getItem("mediasGerais"));

onInit();
function onInit() {
    getHighlightUltimoJogo(equipe.id);
    if (sessionStorage.getItem("mediasGerais")) {
        return;
    }
    document.querySelector(".loader").style.display = "flex";
    getMediasGerais().then(medias => {
        sessionStorage.setItem("mediasGerais", JSON.stringify(medias));
        document.querySelector(".loader").style.display = "none";
    }).catch(error => {
        console.error("Erro ao obter médias gerais:", error);
    });   
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

function getMediasGerais() {
    return fetch("/jogadores/getMediasGerais")
        .then(response => response.json())
        .catch(error => { console.error("Erro ao obter médias gerais:", error); throw error; });
}

function switchPopupJogador(index) {
    if (document.getElementById("popupJogador").classList.contains("hidden")) {
        renderPopupJogador(
            document.getElementById("popupJogador"),
            montarDadosPopup(elencoOrdenado[index], mediasGerais)
        );
    }
    document.getElementById("popupJogador").classList.toggle("hidden");
}

function switchSidebar() {
    document.getElementById("sbBackdrop").classList.toggle("sb-hidden");
}

function switchTeamList() {
    document.getElementById("tlBackdrop").classList.toggle("tl-hidden");
}

function renderizarJogadores(elenco) {
    elenco.forEach((jogador, index) => {
        renderPlayerCard(document.getElementById(`playerCard${index + 1}`), montarDadosCard(jogador));
    });
}

renderTeamList(document.getElementById("teamListContainer"), [
    {
        name: "T1",
        logoUrl: "../assets/icons/t1logo.png"
    },
    {
        name: "Gen.G",
        logoUrl: "../assets/icons/t1logo.png"
    },
    {
        name: "KT Rolster",
        logoUrl: "../assets/icons/t1logo.png"
    },
    {
        name: "Hanwha Life",
        logoUrl: "../assets/icons/t1logo.png"
    },
    {
        name: "DRX",
        logoUrl: "../assets/icons/t1logo.png"
    },
    {
        name: "Liiv SANDBOX",
        logoUrl: "../assets/icons/t1logo.png"
    },
]);
renderSidebar(document.getElementById("sidebarContainer"), "dashboard-time", { name: usuario.nome, role: "Coach", email: usuario.email, imageUrl: "../assets/playerIcons/faker.png", nameTeam: equipe.nome, logoUrl: "../assets/icons/t1logo.png" });
renderTeamProfile(document.getElementById('teamProfile'), { name: equipe.nome, coach: `Coach: ${usuario.nome}`, logoUrl: "../assets/icons/t1logo.png" });
renderizarJogadores(elencoOrdenado);
renderHighlightUltimoJogo(document.getElementById("highlight"), JSON.parse(sessionStorage.getItem("highlightUltimoJogo"))[0]);

