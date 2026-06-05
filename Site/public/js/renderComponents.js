function renderTeamProfile(container, data) {

    const styles = {
        teamProfile: `
            width: 100%;
            height: 100%;
            background-color: #FFFFFF08;
            border: 2px solid #FFFFFF80;
            border-radius: 1vh;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
            gap: 10px;
            box-sizing: border-box;
            padding: 5px;
            overflow: hidden;
            color: #e4e4e4;
        `,
        img: `
            width: 25%;
            aspect-ratio: 1;
            object-fit: contain;
        `,
        teamProfileContent: `
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            justify-content: flex-start;
            min-width: 0;
        `,
        teamName: `
            font-size: clamp(14px, 1.5vw, 20px);
            font-weight: 800;
            font-family: "Montserrat", sans-serif;
            color: #e4e4e4;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            width: 100%;
        `,
        teamCoach: `
            font-size: clamp(12px, 1.2vw, 16px);
            font-weight: 400;
            font-family: "Montserrat", sans-serif;
            color: #e4e4e4;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            width: 100%;
        `
    };

    container.innerHTML = `
        <div style="${styles.teamProfile}">
            <img src="${data.logoUrl}" alt="Logo do ${data.name}" style="${styles.img}">
            <div style="${styles.teamProfileContent}">
                <div style="${styles.teamName}">${data.name}</div>
                <div style="${styles.teamCoach}">${data.coach}</div>
            </div>
        </div>
    `;
};

function renderPopupJogador(container, data) {
    if (!container) return;

    const config = {
        name: data.name || "Jogador",
        imageUrl: data.imageUrl || "../assets/playerIcons/faker.png",
        position: data.position || "Mid",
        teamLogoUrl: data.teamLogoUrl || "../assets/icons/t1logo.png",
        stats: data.stats || [],
        badges: data.badges || [],
        quickStats: data.quickStats || [
            { iconUrl: "../assets/icons/bow.svg", value: "~ 553 DpM" },
            { iconUrl: "../assets/icons/coins.svg", value: "▼250g @ 15" },
            { iconUrl: "../assets/icons/aim.svg", value: "~ 12.3 KDA" }
        ]
    };

    const renderStats = (statsArray) => {
        if (!statsArray || statsArray.length === 0) return '';
        return statsArray.map(stat => {
            const trendClass = stat.trend === 'down' ? 'down' : 'up';
            return `
                <div class="infoBox">
                    <span class="infoLabel">${stat.label}</span>
                    <div class="infoStats">
                        <div class="infoTrend ${trendClass}">
                            <i class="material-icons">arrow_${trendClass}ward</i>
                            <span class="infoPlayerValue">${stat.playerValue}</span>
                        </div>
                        <span class="infoSeparator">|</span>
                        <div class="infoTrend">
                            <span class="infoMedianValue">${stat.medianValue}</span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    };

    const renderBadges = (badgesArray) => {
        if (!badgesArray || badgesArray.length === 0) return '';
        return badgesArray.map(badge => `
            <div class="badge">
                <img src="${badge.imageUrl}" alt="${badge.title}" class="badgeImage">
                <span class="badgeTitle">${badge.title}</span>
            </div>
        `).join('');
    };

    const renderQuickStats = (quickStatsArray) => {
        if (!quickStatsArray || quickStatsArray.length === 0) return '';
        return quickStatsArray.map(stat => `
            <div class="playerInfo">
                <img src="${stat.iconUrl}" alt="Stat Icon">
                <span>${stat.value}</span>
            </div>
        `).join('');
    };

    container.innerHTML = `
        <div class="popupJogadorContent">
            <div class="sideBar">
                <div class="sideUpper" onclick="switchPopupJogador()">
                    <i class="material-icons">arrow_back</i>
                </div>
                <div class="playerIcon">
                    <img src="${config.imageUrl}" alt="${config.name}">
                    <div class="playerPosition">${config.position}</div>
                </div>
                <div class="playerName">${config.name}</div>
                ${renderQuickStats(config.quickStats)}
                <div class="teamlogo">
                    <img src="${config.teamLogoUrl}" alt="Team Logo">
                </div>
            </div>
            <div class="mainContent">
                <div class="mainUpper">
                    <div class="compareButton" onclick="compareJogadores('${config.name}')">
                        <i class="material-icons">compare_arrows</i>
                        <span>Comparar</span>
                    </div>
                </div>
                <div class="mainLower">
                    <div class="mainLowerUpper">
                        <div class="playerInformation">
                            ${renderStats(config.stats)}
                        </div>
                        <div class="radarGraph">
                            <div class="canvasContainer">
                                <canvas id="playerRadarChart"></canvas>
                            </div>
                        </div>
                    </div>
                    <div class="mainLowerLower">
                        ${renderBadges(config.badges)}
                    </div>
                </div>
            </div>
        </div>
    `;

    const ctx = document.getElementById('playerRadarChart');
    new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['DPM', 'Kills', 'Deaths', 'Assists', 'KP%', 'GPM', 'CSPM', 'Wards/min'],
            datasets: [
                {
                    label: data.name,
                    data: data.radarData || [0, 0, 0, 0, 0, 0, 0, 0],
                    borderColor: '#0F8B8B',
                    backgroundColor: '#0F8B8B40'
                },
                {
                    label: 'Média da Role',
                    data: data.radarMediaRole || [0, 0, 0, 0, 0, 0, 0, 0],
                    borderColor: '#ffffff40',
                    backgroundColor: '#ffffff15'
                }
            ]
        },
        options: {
            scales: {
                responsive: true,
                maintainAspectRatio: false,
                r: {
                    min: 0,
                    max: 100,
                    angleLines: {
                        color: '#444'
                    },
                    grid: {
                        color: '#44444460'
                    },
                    pointLabels: {
                        color: '#fff',
                        font: {
                            size: 14,
                            weight: 600,
                            family: "Montserrat"
                        }
                    },
                    ticks: {
                        display: false
                    }
                }
            },
            plugins: {
                legend: false
            }
        }
    });
}

function renderPlayerCard(container, data) {
    if (!container) return;

    container.style.flex = "1";
    container.style.height = "100%";
    container.style.minWidth = "0";

    const config = {
        name: data.name || "Jogador",
        imageUrl: data.imageUrl || data.urlFotoJogador || "../assets/playerIcons/faker.png",
        roleIconUrl: data.roleIconUrl || `../assets/icons/${data.position || 'Top'}_icon.png`,
        stats: data.stats || []
    };

    const styles = {
        playerCard: `
            width: 100%;
            height: 100%;
            position: relative;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: space-evenly;
            padding: 1%;
            background-color: #1F1F1F;
            border-radius: 2vh;
            border: 2px solid #0F8B8B;
            box-shadow: 0px 0px 10px 5px #00000060;
            color: #FFFFFF;
            box-sizing: border-box;
            transition: background-color 0.2s;
        `,
        roleIcon: `
            position: absolute;
            top: 10px;
            left: 10px;
            width: 15%;
            height: auto;
            filter: brightness(0) invert(.9);
        `,
        playerIconContainer: `
            width: 100%;
            height: auto;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        `,
        playerImage: `
            background-color: #00000090;
            display: block;
            margin: 4% auto 0;
            width: 40%;
            aspect-ratio: 1;
            outline: 2px solid #0F8B8B;
            border-radius: 100%;
            object-fit: cover;
            object-position: center center;
        `,
        playerName: `
            width: auto;
            height: auto;
            margin: 2% 0;
            padding: 2%;
            color: #e4e4e4;
            font-family: Open Sans, sans-serif;
            font-weight: 600;
            font-size: 24px;
            line-height: 100%;
            text-align: center;
            display: flex;
            justify-content: center;
            align-items: center;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        `,
        playerInfo: `
            width: 60%;
            height: auto;
            padding: 2% 0;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 15px;
            color: #e4e4e4;
            font-family: "Open Sans", sans-serif;
            font-weight: 600;
            font-size: clamp(12px, 1.2vw, 16px);
            text-align: center;
        `,
        infoText: `
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            height: auto;
            margin-left: -10px;
            margin-bottom: 2px;
            white-space: nowrap;
        `,
        infoIcon: `
            height: 24px;
            aspect-ratio: 1;
            filter: brightness(0) invert(.9);
        `
    };

    const renderStats = (statsArray) => {
        if (!statsArray || statsArray.length === 0) return '';
        return statsArray.map(stat => `
            <div style="${styles.playerInfo}">
                <img src="${stat.iconUrl}" alt="Icon" style="${styles.infoIcon}">
                <span style="${styles.infoText}">${stat.value}</span>
            </div>
        `).join('');
    };

    container.innerHTML = `
        <style>
            .abstractPlayerCard:hover {
                background-color: #0F8B8B10 !important;
                cursor: pointer !important;
            }
        </style>

        <div style="${styles.playerCard}" class="abstractPlayerCard">
            
            <img src="${config.roleIconUrl}" alt="Role" style="${styles.roleIcon}">
            
            <div style="${styles.playerIconContainer}">
                <img src="${config.imageUrl}" alt="${config.name}" style="${styles.playerImage}">
                <div style="${styles.playerName}">${config.name}</div>
            </div>

            ${renderStats(config.stats)}

        </div>
    `;
};

function renderSidebar(container, activePage, profileData) {
    if (!container) return;

    console.log('Populando sidebar com dados do usuário:', profileData);
    const user = profileData;

    const styles = {
        sbBackdrop: `
            width: 100%;
            height: 100%;
            position: fixed;
            top: 0;
            left: 0;
            z-index: 100000;
            background-color: #00000090;
        `,
        sbSidebar: `
            width: 20%;
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: flex-start;
            position: fixed;
            background-color: #1F1F1F;
            left: 0;
            gap: 8%;
            z-index: 100001;
            box-shadow: 0px 0px 10px 5px #00000090;
            animation: sbSlideIn .2s ease-in-out;
        `,
        sbHeader: `
            width: 100%;
            height: 8%;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2% 2%;
            box-sizing: border-box;
        `,
        sbLogo: `
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: start;
        `,
        sbLogoImg: `
            height: 100%;
            aspect-ratio: 1;
            object-fit: cover;
        `,
        sbContent: `
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: start;
            gap: 5px;
        `,
        sbItem: `
            width: 100%;
            height: 16%;
            padding: 0 10%;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            font-family: "Montserrat";
            font-weight: 600;
            font-size: 20px;
            line-height: 210%;
            letter-spacing: 0%;
            color: #e4e4e4;
            gap: 30px;
            box-sizing: border-box;
            cursor: pointer;
        `,
        sbFooter: `
            width: 100%;
            height: 10%;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0 10%;
            border-top: solid 2px #e4e4e4;
            box-sizing: border-box;
        `,
        sbProfile: `
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: start;
            gap: 10px;
        `,
        sbProfileIcon: `
            height: 80%;
            aspect-ratio: 1;
            display: flex;
            align-items: center;
            justify-content: center;
        `,
        sbProfileImg: `
            height: 100%;
            aspect-ratio: 1;
            object-fit: cover;
            border-radius: 100%;
        `,
        sbProfileContent: `
            width: 100%;
            height: 100%;
            margin-top: 5%;
            display: flex;
            flex-direction: column;
            align-items: start;
            justify-content: center;
        `,
        sbProfileName: `
            font-family: Montserrat; 
            font-weight: 600; 
            font-size: 16px; 
            line-height: 100%; 
            letter-spacing: 0%; 
            color: #e4e4e4; 
        `,
        sbProfileRole: `
            font-family: Montserrat; 
            font-weight: 200; 
            font-size: 14px; 
            line-height: 100%; 
            letter-spacing: 0%; 
            color: #e4e4e4; 
        `,
        sbProfileLogout: `
            height: 50%;
            aspect-ratio: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 1vh;
            background-color: #0F8B8B;
            cursor: pointer;
        `,
        sbItemIcon: `
            font-size: 20px;
            color: #e4e4e4;
        `,
        sbItemLabel: `
            font-size: 20px;
            color: #e4e4e4;
            font-family: "Montserrat";
            font-weight: 600;
        `,
    };

    let htmlSidebar = `
    <style>

        *{
            user-select: none;
        }
    
        .sb-backdrop.sb-hidden {
            display: none;
        }

        .sb-item:hover {
            cursor: pointer;
            background-color: #0F8B8B10;
        }

        .sb-item.sb-active {
            background-color: #0F8B8B;
            cursor: default;
        }

        .sb-logout:hover {
            cursor: pointer;
            i {
                filter: brightness(.2);
            }
        }

        @keyframes sbSlideIn {
            from { transform: translateX(-100%); }
            to   { transform: translateX(0%); }
        }

        @keyframes sbSlideOut {
            from { transform: translateX(0%); }
            to   { transform: translateX(-100%); }
        }
    </style>

    <div class="sb-backdrop sb-hidden" id="sbBackdrop" style="${styles.sbBackdrop}" onclick="switchSidebar()">
        <div class="sb-sidebar" id="sbSidebar" style="${styles.sbSidebar}" onclick="event.stopPropagation()">
            <div class="sb-header" style="${styles.sbHeader}">
                <div class="sb-logo" style="${styles.sbLogo}">
                    <img style="${styles.sbLogoImg}" src="../assets/icons/logo_branca.png" alt="">
                </div>
            </div>
            <div id="teamProfileSidebar" style="padding-left: 5%; padding-right: 5%; width: 100%; box-sizing: border-box;"></div>
            <div class="sb-content" style="${styles.sbContent}">
                <div class="sb-item ${activePage === 'dashboard' ? 'sb-active' : ''}" style="${styles.sbItem} onclick="window.location.href = 'dashboard.html'"">
                    <i class="material-icons" style="${styles.sbItemIcon}">dashboard</i>
                    <span class="sb-item-label" style="${styles.sbItemLabel}">Visão Geral</span>
                </div>
                <div class="sb-item ${activePage === 'dashboard-time' ? 'sb-active' : ''}" style="${styles.sbItem} onclick="window.location.href = 'dashboard-time.html'"">
                    <i class="material-icons" style="${styles.sbItemIcon}">group</i>
                    <span class="sb-item-label" style="${styles.sbItemLabel}">Meu Time</span>
                </div>
                <div class="sb-item ${activePage === 'compare' ? 'sb-active' : ''}" style="${styles.sbItem} onclick="window.location.href = 'http://32.196.238.3:4200'"">
                    <i class="material-icons" style="${styles.sbItemIcon}">menu_book</i>
                    <span class="sb-item-label" style="${styles.sbItemLabel}">Comparar</span>
                </div>
                <div class="sb-item ${activePage === 'settings' ? 'sb-active' : ''}" style="${styles.sbItem} onclick="window.location.href = 'editar-contas.html'""> 
                    <i class="material-icons" style="${styles.sbItemIcon}">settings</i>
                    <span class="sb-item-label" style="${styles.sbItemLabel}">Configurações</span>
                </div>
            </div>
            <div class="sb-footer" style="${styles.sbFooter}">
                <div class="sb-profile" style="${styles.sbProfile}">
                    <div class="sb-profile-icon" style="${styles.sbProfileIcon}" onclick="abrirModalPerfil()" title="Editar perfil">
                        <img style="${styles.sbProfileImg}; cursor: pointer;" src="../assets/playerIcons/faker.png" alt="">
                    </div>
                    <div class="sb-profile-content" style="${styles.sbProfileContent}">
                        <div class="sb-profile-name" style="${styles.sbProfileName}">${user.name}</div>
                        <div class="sb-profile-role" style="${styles.sbProfileRole}">${user.role}</div>
                    </div>
                    <div class="sb-logout sb-profile-logout" style="${styles.sbProfileLogout}" onclick="window.location.href='../login.html'">
                        <i class="material-icons" style="font-size: 25px; color: #e4e4e4; transition: all .1s ease-in-out;">logout</i>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `;

    // Modal de perfil
    const modalHtml = `
    <style>
        .editar-contas-modal-fundo {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: #00000090;
            z-index: 200000;
            align-items: center;
            justify-content: center;
        }
        .editar-contas-modal-fundo.editar-contas-modal-visivel {
            display: flex;
        }
        .editar-contas-modal-editar {
            width: 580px;
            padding: 48px 48px 40px 48px;
            background-color: #1F1F1F;
            border-radius: 16px;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 20px;
        }
        .editar-contas-modal-foto {
            width: 100px;
            height: 100px;
            border-radius: 100%;
            border: 3px solid #0F8B8B;
            overflow: hidden;
            flex-shrink: 0;
        }
        .editar-contas-modal-foto img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        .editar-contas-modal-form {
            width: 100%;
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        .editar-contas-modal-campo {
            width: 100%;
            height: 48px;
            display: flex;
            flex-direction: row;
            align-items: center;
            background-color: #003B3B80;
            border: solid 2px #0F8B8B;
            border-radius: 8px;
            overflow: hidden;
        }
        .editar-contas-modal-campo label {
            padding: 0 14px;
            font-family: Montserrat;
            font-weight: 600;
            font-size: 14px;
            color: #e4e4e4;
            white-space: nowrap;
            flex-shrink: 0;
        }
        .editar-contas-modal-campo input,
        .editar-contas-modal-campo select {
            flex: 1;
            height: 100%;
            background-color: transparent;
            border: none;
            outline: none;
            font-family: Montserrat;
            font-weight: 400;
            font-size: 14px;
            color: #e4e4e4;
            padding-right: 12px;
        }
        .editar-contas-modal-campo select {
            cursor: pointer;
            background-color: #003B3B;
        }
        .editar-contas-modal-campo select option {
            background-color: #1F1F1F;
            color: #e4e4e4;
        }
        .editar-contas-modal-btn-salvar {
            width: 100%;
            height: 46px;
            background-color: #003B3B80;
            border: solid 2px #0F8B8B;
            color: #e4e4e4;
            border-radius: 8px;
            font-family: Montserrat;
            font-weight: 700;
            font-size: 16px;
            cursor: pointer;
            transition: 0.3s;
        }
        .editar-contas-modal-btn-salvar:hover {
            background-color: #0F8B8B80;
        }
    </style>

    <div class="editar-contas-modal-fundo" id="modalPerfilFundo" onclick="fecharModalPerfil()">
        <div class="editar-contas-modal-editar" onclick="event.stopPropagation()">
            <div class="editar-contas-modal-foto">
                <img src="${user.imageUrl || '../assets/playerIcons/faker.png'}" alt="Foto do usuário">
            </div>
            <div class="editar-contas-modal-form">
                <div class="editar-contas-modal-campo">
                    <label>Nome:</label>
                    <input type="text" id="editarPerfilNome" value="${user.name || ''}">
                </div>
                <div class="editar-contas-modal-campo">
                    <label>Email:</label>
                    <input type="email" id="editarPerfilEmail" value="${user.email || (JSON.parse(sessionStorage.getItem('usuario')) || {}).email || ''}">
                </div>
                <div class="editar-contas-modal-campo">
                    <label>Senha:</label>
                    <input type="password" id="editarPerfilSenha" placeholder="••••••••">
                </div>
                <div id="editarPerfilError" style="color:#c92a2a; margin-top:8px; display:none; font-size:0.95rem; text-align:center;"></div>
            </div>
            <div style="display:flex; width:100%; gap:12px; margin-top:8px; align-items:center;">
                <div style="flex:0 0 40%; display:flex; align-items:center; justify-content:flex-start;">
                    <label style="display:flex; align-items:center; gap:10px; cursor:pointer;">
                        <div id="notifToggle" data-on="0" style="width:46px; height:26px; border-radius:13px; background:#003B3B80; border:2px solid #0F8B8B; display:flex; align-items:center; padding:2px; box-sizing:border-box; justify-content:flex-start;">
                            <div id="notifThumb" style="width:18px; height:18px; border-radius:50%; background:#e4e4e4; transition:all .2s;"></div>
                        </div>
                        <span style="font-family: Montserrat; font-weight:600; color:#e4e4e4; font-size:14px;">Receber notificações</span>
                    </label>
                </div>
                <div style="flex:1;">
                    <button class="editar-contas-modal-btn-salvar" id="btnSalvarPerfil" onclick="salvarPerfil()">Salvar</button>
                </div>
            </div>
        </div>
    </div>

    `;

    if (!document.getElementById('modalPerfilFundo')) {
        document.body.insertAdjacentHTML('beforeend', modalHtml);
    }

    window.abrirModalPerfil = function () {
        const usuarioSession = JSON.parse(sessionStorage.getItem("usuario")) || {};
        const nomeEl = document.getElementById('editarPerfilNome');
        const emailEl = document.getElementById('editarPerfilEmail');
        if (nomeEl) nomeEl.value = usuarioSession.nome || usuarioSession.name || '';
        if (emailEl) emailEl.value = usuarioSession.email || '';
        if (usuarioSession.notificar == 1) {
            document.getElementById('notifToggle').dataset.on = '1';
            document.getElementById('notifToggle').style.justifyContent = 'flex-end';
        } else {
            document.getElementById('notifToggle').dataset.on = '0';
            document.getElementById('notifToggle').style.justifyContent = 'flex-start';
        }

        document.getElementById('modalPerfilFundo').classList.add('editar-contas-modal-visivel');
    };

    window.fecharModalPerfil = function () {
        document.getElementById('modalPerfilFundo').classList.remove('editar-contas-modal-visivel');
        const errorEl = document.getElementById('editarPerfilError');
        if (errorEl) {
            errorEl.style.display = 'none';
            errorEl.innerText = '';
        }
        const senhaEl = document.getElementById('editarPerfilSenha');
        if (senhaEl) {
            senhaEl.value = '';
        }
    };

    window.salvarPerfil = async function () {
        const nome = document.getElementById('editarPerfilNome')?.value || '';
        const email = document.getElementById('editarPerfilEmail')?.value || '';
        const senha = document.getElementById('editarPerfilSenha')?.value || '';
        const errorEl = document.getElementById('editarPerfilError');

        let loader = document.querySelector('.loader') || document.getElementById('loaderEditarContas');
        if (!loader) {
            const dynamicLoaderHtml = `
            <div class="loader" id="perfilLoader" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; align-items: center; justify-content: center; background-color: rgba(0, 0, 0, 0.8); z-index: 1000000;">
                <span style="width: 70px; height: 70px; border: 6px solid rgba(228, 228, 228, 0.25); border-top-color: #e4e4e4; border-radius: 50%; animation: spin 1s linear infinite;"></span>
            </div>
            <style>
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            </style>
            `;
            document.body.insertAdjacentHTML('beforeend', dynamicLoaderHtml);
            loader = document.getElementById('perfilLoader');
        }
        if (loader) {
            loader.style.position = 'fixed';
            loader.style.zIndex = '1000000';
            loader.style.top = '0';
            loader.style.left = '0';
            loader.style.width = '100%';
            loader.style.height = '100%';
            loader.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
            loader.style.alignItems = 'center';
            loader.style.justifyContent = 'center';
            loader.style.display = 'flex';
        }

        if (!nome || !email) {
            if (errorEl) {
                errorEl.innerText = 'Preencha os campos de nome e email obrigatórios.';
                errorEl.style.display = 'block';
            }
            if (loader) loader.style.display = 'none';
            return;
        }

        const emailValido = (emailStr) => {
            const posicaoArroba = emailStr.indexOf("@");
            const posicaoPontoDepoisArroba = emailStr.indexOf(".", posicaoArroba);
            return posicaoArroba > 0 && posicaoPontoDepoisArroba > posicaoArroba + 1;
        };

        if (!emailValido(email)) {
            if (errorEl) {
                errorEl.innerText = 'Formato de e-mail inválido. O e-mail precisa conter @ e ponto após o @.';
                errorEl.style.display = 'block';
            }
            if (loader) loader.style.display = 'none';
            return;
        }

        if (senha) {
            const senhaValida = (senhaStr) => {
                const temMinimoSeisCaracteres = senhaStr.length >= 6;
                const temNumero = /[0-9]/.test(senhaStr);
                const temMaiuscula = /[A-Z]/.test(senhaStr);
                const temMinuscula = /[a-z]/.test(senhaStr);
                return temMinimoSeisCaracteres && temNumero && temMaiuscula && temMinuscula;
            };

            if (!senhaValida(senha)) {
                if (errorEl) {
                    errorEl.innerText = 'A senha precisa ter no mínimo 6 caracteres, 1 número, 1 letra maiúscula e 1 letra minúscula.';
                    errorEl.style.display = 'block';
                }
                if (loader) loader.style.display = 'none';
                return;
            }
        }

        const usuarioSession = JSON.parse(sessionStorage.getItem("usuario")) || {};
        const idUsuario = usuarioSession.id || usuarioSession.id_usuario;

        if (!idUsuario) {
            if (errorEl) {
                errorEl.innerText = 'Erro: Usuário não identificado na sessão.';
                errorEl.style.display = 'block';
            }
            if (loader) loader.style.display = 'none';
            return;
        }

        const payload = {
            nomeServer: nome,
            emailServer: email
        };
        if (senha) {
            payload.senhaServer = senha;
        }

        try {
            const response = await fetch(`/usuarios/atualizar/${idUsuario}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const text = await response.text();
                throw new Error(text || response.statusText);
            }

            const onOffToggle = document.getElementById('notifToggle');
            const preferencias = onOffToggle.getAttribute('data-on') === '1' ? 1 : 0;
            try {
                const responseNotificacao = await fetch(`/usuarios/atualizar/${idUsuario}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        notificar: preferencias
                    })
                });

                if (!responseNotificacao.ok) {
                    const text = await response.text();
                    throw new Error(text || response.statusText);
                }
            } catch (error) {
                console.error(error);
                if (errorEl) {
                    errorEl.innerText = 'Erro ao atualizar preferências: ' + error.message;
                    errorEl.style.display = 'block';
                }
                throw new Error(error.message || 'Erro ao atualizar preferências');
            }

            usuarioSession.nome = nome;
            usuarioSession.email = email;
            usuarioSession.notificar = preferencias;
            sessionStorage.setItem("usuario", JSON.stringify(usuarioSession));

            fecharModalPerfil();
            window.location.reload();
        } catch (error) {
            console.error(error);
            if (errorEl) {
                errorEl.innerText = 'Erro ao atualizar perfil: ' + error.message;
                errorEl.style.display = 'block';
            }
        } finally {
            if (loader) loader.style.display = 'none';
        }
    };

    // Toggle behavior for notifications in profile modal
    setTimeout(() => {
        const notifToggle = document.getElementById('notifToggle');
        const notifThumb = document.getElementById('notifThumb');
        if (!notifToggle || !notifThumb) return;
        notifToggle.addEventListener('click', () => {
            const isOn = notifToggle.getAttribute('data-on') === '1';
            if (isOn) {
                notifToggle.setAttribute('data-on', '0');
                notifToggle.style.justifyContent = 'flex-start';
            } else {
                notifToggle.setAttribute('data-on', '1');
                notifToggle.style.justifyContent = 'flex-end';
            }
        });
    }, 0);

    container.innerHTML = htmlSidebar;

    const teamProfileContainer = document.getElementById('teamProfileSidebar');
    let teamProfileData = {
        name: user.nameTeam,
        coach: 'Coach: ' + (JSON.parse(sessionStorage.getItem('time')).nomeTreinador || "N/A"),
        logoUrl: user.logoUrl
    };
    renderTeamProfile(teamProfileContainer, teamProfileData);
};

function renderTeamList(container, teams) {

    const styles = {
        tlBackdrop: `
            width: 100%;
            height: 100%;
            position: fixed;
            top: 0;
            left: 0;
            z-index: 100000;
            background-color: #00000090;
        `,
        tlContainer: `
            position: fixed;
            right: 0;
            width: 30%;
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: start;
            background-color: #1F1F1F;
            box-shadow: 0px 0px 10px 5px #00000060;
            z-index: 100001;
        `,
        tlHeader: `
            width: 100%;
            height: 12vh;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 6% 0 3%;
            box-sizing: border-box;
        `,
        tlTitle: `
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: start;
            font-family: Montserrat;
            font-weight: 800;
            font-size: 26px;
            color: #e4e4e4;
        `,
        tlClose: `
            width: auto;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: end;
            cursor: pointer;
        `,
        tlCloseIcon: `
            font-size: 25px;
            color: #e4e4e4;
            transition: all .1s ease-in-out;
            cursor: pointer;
        `,
        tlSearch: `
            width: 100%;
            height: 10%;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0 6% 0 3%;
            box-sizing: border-box;
            position: relative;
        `,
        tlSearchInput: `
            width: 100%;
            height: 100%;
            border-radius: 10px;
            background-color: #003B3B80;
            border: solid 2px #0F8B8B;
            padding: 0 2%;
            box-sizing: border-box;
            font-family: Montserrat;
            font-weight: 400;
            font-size: 18px;
            color: #e4e4e4;
            outline: none;
        `,
        tlSearchIcon: `
            position: absolute;
            right: 8%;
            font-size: 28px;
            color: #e4e4e460;
            transition: all .1s ease-in-out;
            cursor: pointer;
            z-index: 100002;
        `,
        tlContent: `
            width: 90%;
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: start;
            padding: 2% 6% 2% 3%;
            box-sizing: border-box;
            gap: 12px;
            overflow-y: scroll;
        `,
        tlTeam: `
            width: 100%;
            min-height: 10%;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            gap: 10px;
            padding: 0 0 0 2%;
            box-sizing: border-box;
            border-radius: 1vh;
            background-color: #242424;
            border: solid 2px #e4e4e480;
            cursor: pointer;
            transition: border-color .1s ease-in-out;
            flex-shrink: 0;
        `,
        tlTeamImg: `
            width: 32px;
            height: 32px;
            border-radius: 100%;
            object-fit: cover;
        `,
        tlTeamName: `
            width: auto;
            font-family: Open Sans;
            font-weight: 400;
            font-size: 18px;
            color: #e4e4e4;
            flex: 1;
        `,
        tlAnalyzeButton: `
            width: 30%;
            height: 100%;
            min-height: inherit;
            background-color: #e4e4e480;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: end;
            gap: 10px;
            border-radius: 0 1vh 1vh 0;
            transition: background-color .1s ease-in-out;
            padding: 0 2%;
            box-sizing: border-box;
        `,
        tlAnalyzeIcon: `
            font-size: 28px;
            color: #e4e4e460;
            transition: all .1s ease-in-out;
            cursor: pointer;
        `,
    };

    const htmlContent = teams.map(team => `
    <div class="tl-team" style="${styles.tlTeam}" onclick="window.location.href='dashboard-time-adversario.html'">
        <img style="${styles.tlTeamImg}" src="${team.logoUrl}" alt="Logo do ${team.name}">
        <div class="tl-team-name" style="${styles.tlTeamName}">${team.name}</div>
        <div class="tl-analyze-btn" style="${styles.tlAnalyzeButton}">
            <span style="font-family: Montserrat; font-size: 14px; color: #e4e4e460; transition: color .1s ease-in-out;">Analisar</span>
            <i class="material-icons tl-analyze-icon" style="${styles.tlAnalyzeIcon}">arrow_forward_ios</i>
        </div>
    </div>
    `).join('');

    let htmlTeamList = `
    <style>

        .tl-container {
            transition: all .3s ease-in-out;
            animation: slideIn .3s ease-in-out; 
        }

        @keyframes slideIn {
            from {
                transform: translateX(100%);
            }
            to {
                transform: translateX(0%);
            }
        }

        .tl-hidden {
            display: none;
        }

        .tl-close-icon:hover {
            transform: scale(1.1) !important;
        }

        .tl-search-icon:hover {
            color: #e4e4e4 !important;
        }

        .tl-team:hover {
            border: solid 2px #e4e4e4 !important;
        }

        .tl-team:hover .tl-analyze-btn {
            background-color: #e4e4e4 !important;
        }

        .tl-team:hover .tl-analyze-icon {
            color: #242424 !important;
        }

        .tl-team:hover .tl-analyze-btn span {
            color: #242424 !important;
        }
    </style>

    <div class="tl-backdrop tl-hidden" id="tlBackdrop" style="${styles.tlBackdrop}" onclick="switchTeamList()">
    <div class="tl-container" id="tlContainer" style="${styles.tlContainer}" onclick="event.stopPropagation()">
        <div class="tl-header" style="${styles.tlHeader}">
            <div class="tl-title" style="${styles.tlTitle}">Equipes da liga</div>
            <div class="tl-close" style="${styles.tlClose}" onclick="switchTeamList()">
                <i class="material-icons tl-close-icon" style="${styles.tlCloseIcon}">close</i>
            </div>
        </div>
        <div class="tl-search" style="${styles.tlSearch}">
            <input style="${styles.tlSearchInput}" type="text" placeholder="Buscar equipe">
            <i class="material-icons tl-search-icon" style="${styles.tlSearchIcon}">search</i>
        </div>
        <div class="tl-content" style="${styles.tlContent}">
            ${htmlContent}
        </div>
    </div>
    </div>
    `;

    container.innerHTML = htmlTeamList;

    const searchInput = container.querySelector('.tl-search input');
    const contentContainer = container.querySelector('.tl-content');

    const updateTeamCards = filteredTeams => {
        contentContainer.innerHTML = filteredTeams.map(team => `
            <div class="tl-team" style="${styles.tlTeam}" onclick="window.location.href='dashboard-time-adversario.html'">
                <img style="${styles.tlTeamImg}" src="${team.logoUrl}" alt="Logo do ${team.name}">
                <div class="tl-team-name" style="${styles.tlTeamName}">${team.name}</div>
                <div class="tl-analyze-btn" style="${styles.tlAnalyzeButton}">
                    <span style="font-family: Montserrat; font-size: 14px; color: #e4e4e460; transition: color .1s ease-in-out;">Analisar</span>
                    <i class="material-icons tl-analyze-icon" style="${styles.tlAnalyzeIcon}">arrow_forward_ios</i>
                </div>
            </div>
        `).join('');
    };

    if (searchInput) {
        searchInput.addEventListener('input', event => {
            const query = event.target.value.trim().toLowerCase();
            const filtered = teams.filter(team => team.name.toLowerCase().includes(query));
            updateTeamCards(filtered);
        });
    }
};

function renderStrategies(container, strategies) {

    const styles = {
        strategiesContainer: `
            flex: 1;
            height: 30vh;
            max-height: 30vh;
            overflow: hidden;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
            background-color: #1F1F1F;
            border: 2px solid #0F8B8B;
            border-radius: 2vh;
            box-shadow: 0px 0px 10px 5px #00000060;
            color: #fff;
        `,
        strategies: `
            flex: 20;
            height: 100%;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: flex-start;
            padding: 0.75rem;
            gap: 0.75rem;
            box-shadow: inset 0px 0px 10px 5px #00000060;
            color: #fff;
            overflow-x: auto;
            overflow-y: hidden;
            flex-wrap: nowrap;
            box-sizing: border-box;
        `,
        arrowBack: `
            flex: 1%;
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background-color: #0F8B8B;
            border-top-left-radius: 1.2vh;
            border-bottom-left-radius: 1.2vh;
            transition: all .1s ease-in-out;
            cursor: pointer;
        `,
        arrowForward: `
            flex: 1%;
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background-color: #0F8B8B;
            border-top-right-radius: 1.2vh;
            border-bottom-right-radius: 1.2vh;
            transition: all .1s ease-in-out;
            cursor: pointer;
        `,
        arrowIcon: `
            font-size: 32px;
            color: #e4e4e4;
        `,
        emptyStrategies: `
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background-color: #242424;
            border-radius: 2vh;
            gap: 10px;
        `,
        emptyStrategiesText: `
            font-family: 'Montserrat';
            font-weight: 400;
            font-size: 24px;
            line-height: 100%;
            letter-spacing: 0%;
            text-align: center;
            vertical-align: middle;
            color: #ffffff60 !important;
        `,
        emptyStrategiesButton: `
            width: 40%;
            height: 40%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 10px;
            cursor: pointer !important;
            transition: all .1s ease-in-out;
        `,
        createButton: `
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
            border: none;
            border-radius: 2vh;
            background-color: #00000060;
            color: #e4e4e480;
            font-family: 'Montserrat';
            font-weight: 600;
            font-size: 20px;
            line-height: 100%;
            letter-spacing: 0%;
            text-align: center;
            vertical-align: middle;
            transition: all .1s ease-in-out;
            cursor: pointer !important;
            gap: 10px;
        `,
        createButtonIcon: `
            font-size: 24px;
            color: #e4e4e480;
            transition: all .1s ease-in-out;
        `
    };

    let emptyStrategies = `
        <div style="${styles.emptyStrategies}">
            <div style="${styles.emptyStrategiesText}">Você não possui estratégias salvas.</div>
            <div style="${styles.emptyStrategiesButton}">
                <button style="${styles.createButton}"
                    onmouseenter="this.style.backgroundColor='#00000070';this.style.color='#e4e4e4';this.querySelector('i').style.color='#e4e4e4';"
                    onmouseleave="this.style.backgroundColor='#00000060';this.style.color='#e4e4e480';this.querySelector('i').style.color='#e4e4e480';"
                    onclick="renderCreateStrategyModal(); abrirModalCreateStrategy();">
                    <i class="material-icons" style="${styles.createButtonIcon}">note_add</i>Criar estratégia
                </button>
            </div>
        </div>
    `;

    container.style.cssText = styles.strategiesContainer;

    const scrollId = `strategies-scroll-${container.id || 'default'}`;

    container.innerHTML = `
        <div style="${styles.arrowBack}"
            onmouseenter="this.style.backgroundColor='#0F8B8B77';"
            onmouseleave="this.style.backgroundColor='#0F8B8B';"
            onclick="document.getElementById('${scrollId}').scrollBy({ left: -200, behavior: 'smooth' });">
            <i class="material-icons" style="${styles.arrowIcon}">chevron_left</i>
        </div>
        <div id="${scrollId}" style="${styles.strategies}">
            ${strategies.length > 0 ? buildStrategyCards(strategies) : emptyStrategies}
        </div>
        <div style="${styles.arrowForward}"
            onmouseenter="this.style.backgroundColor='#0F8B8B77';"
            onmouseleave="this.style.backgroundColor='#0F8B8B';"
            onclick="document.getElementById('${scrollId}').scrollBy({ left: 200, behavior: 'smooth' });">
            <i class="material-icons" style="${styles.arrowIcon}">chevron_right</i>
        </div>
    `;
};

function buildStrategyCards(strategies) {

    const styles = {
        strategyCard: `
            flex: 1 0 120px;
            min-width: 120px;
            height: calc(100% - 1.5rem);
            padding: 1rem;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 4%;
            background-color: #242424;
            border-radius: 2vh;
            box-shadow: 0px 0px 5px 2.5px #00000060;
            cursor: pointer;
            transition: all .1s ease-in-out;
            color: #fff;
        `,
        strategyCardTitle: `
            font-family: 'Montserrat';
            font-weight: 800;
            font-size: 16px;
            line-height: 100%;
            letter-spacing: 0%;
            text-align: center;
            vertical-align: middle;
        `,
        strategyCardDate: `
            font-family: 'Montserrat';
            font-weight: 200;
            font-size: 16px;
            line-height: 100%;
            letter-spacing: 0%;
            text-align: center;
            vertical-align: middle;
        `,
        strategyCardIcon: `
            flex: 1;
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
        `,
        strategyCardIconImg: `
            width: 48px;
            height: 48px;
            filter: invert(100%);
        `,
        strategyCardActions: `
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-around;
            width: 100%;
            margin-top: auto;
        `,
        actionButton: `
            background-color: #00000040;
            border-radius: 1.2vh;
            border: none;
            cursor: pointer;
            width: 100%;
            height: auto;
            transition: all .1s ease-in-out;
            color: #e4e4e4;
        `
    };

    let result = '';

    for (let i = 0; i < strategies.length; i++) {
        result += `
            <div style="${styles.strategyCard}"
                onmouseenter="this.style.backgroundColor='#2F2F2F';"
                onmouseleave="this.style.backgroundColor='#242424';"
                onclick='renderStrategyModal(${JSON.stringify(strategies[i]).replace(/'/g, "&#39;")}); abrirModalStrategy();'>
                <div style="${styles.strategyCardTitle}">${strategies[i].nome}</div>
                <div style="${styles.strategyCardDate}">${strategies[i].data}</div>
                <div style="${styles.strategyCardIcon}">
                    <img src="${strategies[i].icone}" alt="" style="${styles.strategyCardIconImg}">
                </div>
                <div style="${styles.strategyCardActions}">
                    <button style="${styles.actionButton}"
                        onmouseenter="this.style.backgroundColor='#00000085';this.style.color='#e4e4e4';"
                        onmouseleave="this.style.backgroundColor='#00000040';"
                        onclick="removeStrategy(${i}); event.stopPropagation();">
                        <i class="material-icons">delete</i>
                    </button>
                </div>
            </div>
        `;
    }

    result += `
        <div style="${styles.strategyCard}"
            onmouseenter="this.style.backgroundColor='#2F2F2F';"
            onmouseleave="this.style.backgroundColor='#242424';"
            onclick="renderCreateStrategyModal(); abrirModalCreateStrategy();">
            <div style="flex: 1; display: flex; align-items: center; justify-content: center; width: 100%;">
                <div style="width: 80px; height: 80px; background-color: #00000080; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                    <i class="material-icons" style="font-size: 48px; color: #0F8B8B;">add</i>
                </div>
            </div>
        </div>
    `;

    return result;
};

function renderStrategyModal(strategy) {
    const existingModal = document.getElementById('modalStrategyFundo');
    if (existingModal) {
        existingModal.remove();
    }

    const modalHtml = `
    <style>
        .strategyModalFundo {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: #00000090;
            z-index: 200000;
            align-items: center;
            justify-content: center;
        }
        .strategyModalFundo.strategyModalVisivel {
            display: flex;
        }
        .strategyModalEditar {
            width: 80%;
            height: 80%;
            padding: 48px 48px 40px 48px;
            background-color: #1F1F1F;
            border-radius: 16px;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 20px;
            border: 2px solid #0F8B8B;
            box-shadow: 0px 0px 10px 5px #00000060;
        }
        .strategyModalFoto {
            width: 100px;
            height: 100px;
            border-radius: 16px;
            border: 3px solid #0F8B8B;
            background-color: #242424;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            flex-shrink: 0;
        }
        .strategyModalFoto img {
            width: 60%;
            height: 60%;
            object-fit: contain;
            filter: invert(100%);
        }
        .strategyModalForm {
            width: 100%;
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 15px;
        }
        .strategyModalCampo {
            width: 100%;
            height: 48px;
            display: flex;
            flex-direction: row;
            align-items: center;
            background-color: transparent;
            border-bottom: solid 2px #0F8B8B;
            border-radius: 0;
            overflow: hidden;
            flex-shrink: 0;
        }
        .strategyModalCampo label {
            padding: 0 14px 0 0;
            font-family: Montserrat;
            font-weight: 600;
            font-size: 16px;
            color: #0F8B8B;
            white-space: nowrap;
            flex-shrink: 0;
        }
        .strategyModalCampo input {
            flex: 1;
            height: 100%;
            background-color: transparent;
            border: none;
            outline: none;
            font-family: Montserrat;
            font-weight: 600;
            font-size: 16px;
            color: #e4e4e4;
        }
        .strategyModalTexto {
            flex: 1;
            width: 100%;
            background-color: #003B3B40;
            border: solid 2px #0F8B8B;
            border-radius: 8px;
            padding: 16px;
            font-family: Montserrat;
            font-weight: 400;
            font-size: 14px;
            color: #e4e4e4;
            line-height: 150%;
            resize: none;
            outline: none;
            box-sizing: border-box;
        }
        .strategyModalBtnSalvar {
            width: auto;
            align-self: flex-end;
            height: 46px;
            padding: 0 24px;
            background-color: #003B3B80;
            border: solid 2px #0F8B8B;
            color: #e4e4e4;
            border-radius: 8px;
            font-family: Montserrat;
            font-weight: 700;
            font-size: 16px;
            cursor: pointer;
            transition: 0.3s;
        }
        .strategyModalBtnSalvar:hover {
            background-color: #0F8B8B80;
        }
        .strategyModalBtnCancelar {
            width: auto;
            align-self: flex-end;
            height: 46px;
            padding: 0 24px;
            background-color: transparent;
            border: solid 2px #0F8B8B;
            color: #e4e4e4;
            border-radius: 8px;
            font-family: Montserrat;
            font-weight: 700;
            font-size: 16px;
            cursor: pointer;
            transition: 0.3s;
        }
        .strategyModalBtnCancelar:hover {
            background-color: #003B3B40;
        }
    </style>

    <div class="strategyModalFundo" id="modalStrategyFundo" data-estrategia-id="${strategy.id}" onclick="fecharModalStrategy()">
        <div class="strategyModalEditar" onclick="event.stopPropagation()">
            <div class="strategyModalFoto">
                <img src="${strategy.icone}" alt="Ícone da estratégia">
            </div>
            <div class="strategyModalForm">
                <div class="strategyModalCampo">
                    <label>Nome da Estratégia:</label>
                    <input type="text" id="strategyModalNome" value="${strategy.nome}" readonly>
                </div>
                <div class="strategyModalCampo">
                    <label>Criada em:</label>
                    <input type="text" value="${strategy.data}" readonly style="opacity: 0.7;">
                </div>
                <textarea class="strategyModalTexto" id="strategyModalTexto" readonly>${strategy.texto || ''}</textarea>
            </div>
            
            <div id="strategyModalActionsView" style="display: flex; width: 100%; justify-content: flex-end;">
                <button class="strategyModalBtnSalvar" onclick="toggleEditModeStrategy(true)">Editar Estratégia</button>
            </div>
            
            <div id="strategyModalActionsEdit" style="display: none; width: 100%; justify-content: flex-end; gap: 10px;">
                <button class="strategyModalBtnCancelar" onclick="toggleEditModeStrategy(false)">Cancelar</button>
                <button class="strategyModalBtnSalvar" onclick="salvarEstrategia()">Salvar Alterações</button>
            </div>
        </div>
    </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);

    window.toggleEditModeStrategy = function (editMode) {
        const nomeInput = document.getElementById('strategyModalNome');
        const textoInput = document.getElementById('strategyModalTexto');
        const actionsView = document.getElementById('strategyModalActionsView');
        const actionsEdit = document.getElementById('strategyModalActionsEdit');

        if (editMode) {
            nomeInput.removeAttribute('readonly');
            textoInput.removeAttribute('readonly');

            nomeInput.style.backgroundColor = '#003B3B40';
            textoInput.style.backgroundColor = '#003B3B80';

            actionsView.style.display = 'none';
            actionsEdit.style.display = 'flex';
        } else {
            nomeInput.setAttribute('readonly', true);
            textoInput.setAttribute('readonly', true);

            nomeInput.style.backgroundColor = 'transparent';
            textoInput.style.backgroundColor = '#003B3B40';

            nomeInput.value = strategy.nome || '';
            textoInput.value = strategy.texto || '';

            actionsView.style.display = 'flex';
            actionsEdit.style.display = 'none';
        }
    };

    window.abrirModalStrategy = function () {
        document.getElementById('modalStrategyFundo').classList.add('strategyModalVisivel');
    };
    window.fecharModalStrategy = function () {
        document.getElementById('modalStrategyFundo').classList.remove('strategyModalVisivel');
    };
}

function renderCreateStrategyModal() {
    const existingModal = document.getElementById('modalCreateStrategyFundo');
    if (existingModal) {
        existingModal.remove();
    }

    const modalHtml = `
    <style>
        .createStrategyModalFundo {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: #00000090;
            z-index: 200000;
            align-items: center;
            justify-content: center;
        }
        .createStrategyModalFundo.createStrategyModalVisivel {
            display: flex;
        }
        .createStrategyModalEditar {
            width: 80%;
            height: 80%;
            padding: 48px 48px 40px 48px;
            background-color: #1F1F1F;
            border-radius: 16px;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 20px;
            border: 2px solid #0F8B8B;
            box-shadow: 0px 0px 10px 5px #00000060;
        }
        .createStrategyModalFoto {
            width: 100px;
            height: 100px;
            border-radius: 16px;
            border: 3px solid #0F8B8B;
            background-color: #242424;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            flex-shrink: 0;
        }
        .createStrategyModalFoto img {
            width: 60%;
            height: 60%;
            object-fit: contain;
            filter: invert(100%);
        }
        .createStrategyModalForm {
            width: 100%;
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 15px;
        }
        .createStrategyModalCampo {
            width: 100%;
            height: 48px;
            display: flex;
            flex-direction: row;
            align-items: center;
            background-color: transparent;
            border-bottom: solid 2px #0F8B8B;
            border-radius: 0;
            overflow: hidden;
            flex-shrink: 0;
        }
        .createStrategyModalCampo label {
            padding: 0 14px 0 0;
            font-family: Montserrat;
            font-weight: 600;
            font-size: 16px;
            color: #0F8B8B;
            white-space: nowrap;
            flex-shrink: 0;
        }
        .createStrategyModalCampo input {
            flex: 1;
            height: 100%;
            background-color: #003B3B40;
            border: none;
            outline: none;
            font-family: Montserrat;
            font-weight: 600;
            font-size: 16px;
            color: #e4e4e4;
            padding: 0 12px;
            border-radius: 4px;
        }
        .createStrategyModalTexto {
            flex: 1;
            width: 100%;
            background-color: #003B3B40;
            border: solid 2px #0F8B8B;
            border-radius: 8px;
            padding: 16px;
            font-family: Montserrat;
            font-weight: 400;
            font-size: 14px;
            color: #e4e4e4;
            line-height: 150%;
            resize: none;
            outline: none;
            box-sizing: border-box;
        }
        .createStrategyModalBtnSalvar {
            width: auto;
            align-self: flex-end;
            height: 46px;
            padding: 0 24px;
            background-color: #003B3B80;
            border: solid 2px #0F8B8B;
            color: #e4e4e4;
            border-radius: 8px;
            font-family: Montserrat;
            font-weight: 700;
            font-size: 16px;
            cursor: pointer;
            transition: 0.3s;
        }
        .createStrategyModalBtnSalvar:hover {
            background-color: #0F8B8B80;
        }
        .createStrategyModalBtnCancelar {
            width: auto;
            align-self: flex-end;
            height: 46px;
            padding: 0 24px;
            background-color: transparent;
            border: solid 2px #0F8B8B;
            color: #e4e4e4;
            border-radius: 8px;
            font-family: Montserrat;
            font-weight: 700;
            font-size: 16px;
            cursor: pointer;
            transition: 0.3s;
        }
        .createStrategyModalBtnCancelar:hover {
            background-color: #003B3B40;
        }
    </style>

    <div class="createStrategyModalFundo" id="modalCreateStrategyFundo" onclick="fecharModalCreateStrategy()">
        <div class="createStrategyModalEditar" onclick="event.stopPropagation()">
            <div class="createStrategyModalFoto">
                <img src="../assets/icons/aim.svg" alt="Ícone da estratégia">
            </div>
            <div class="createStrategyModalForm">
                <div class="createStrategyModalCampo">
                    <label>Nome da Estratégia:</label>
                    <input type="text" id="createStrategyTitle" placeholder="Ex: Rush B">
                </div>
                <textarea class="createStrategyModalTexto" id="createStrategyContent" placeholder="Descreva os detalhes da tática..."></textarea>
            </div>
            
            <div style="display: flex; width: 100%; justify-content: flex-end; gap: 10px;">
                <button class="createStrategyModalBtnCancelar" onclick="fecharModalCreateStrategy()">Cancelar</button>
                <button class="createStrategyModalBtnSalvar" onclick="salvarNovaEstrategia()">Criar Estratégia</button>
            </div>
        </div>
    </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);

    window.abrirModalCreateStrategy = function () {
        document.getElementById('modalCreateStrategyFundo').classList.add('createStrategyModalVisivel');
    };
    window.fecharModalCreateStrategy = function () {
        document.getElementById('modalCreateStrategyFundo').classList.remove('createStrategyModalVisivel');
    };
}

function renderHighlightUltimoJogo(container, data) {
    if (!container) return;

    const config = {
        playerName: data.nome || "Jogador",
        playerImageUrl: data.urlFotoJogador || "../assets/playerIcons/faker.png",
        playerPosition: data.funcao || "Mid",
        adversarioTeam: data.adversario || "Adversário",
        dano: data.dano || 0,
        ouro: data.ouro || 0,
        kda: data.kda || "0.00",
        championUrl: data.championUrl || "../assets/cassiopeia_1.jpg"
    };

    container.innerHTML = `
        <div class="mvpTitle">
            <span class="mainTitle">Destaque do último confronto</span>
            <span class="subTitle">vs ${config.adversarioTeam}</span>
        </div>
        <div class="mvpContent">
            <div class="playerIcon">
                <img src="${config.playerImageUrl}" alt="${config.playerName}" style="aspect-ratio: 1/1; object-fit: cover;">
                <div class="playerPosition">${config.playerName}</div>
            </div>
            <div class="itemMvp">
                <img src="../assets/icons/bow.svg" alt="Dano" class="itemIcon">
                <div class="mvpStat" style="font-weight: 900; font-size: 1.4em;">${(config.dano / 1000).toFixed(1)}k de Dano</div>
            </div>
            <div class="itemMvp">
                <img src="../assets/icons/coins.svg" alt="Ouro" class="itemIcon">
                <div class="mvpStat" style="font-weight: 900; font-size: 1.4em;">${(config.ouro / 30).toFixed(1)} GpM</div>
            </div>
            <div class="itemMvp">
                <img src="../assets/icons/aim.svg" alt="KDA" class="itemIcon">
                <div class="mvpStat" style="font-weight: 900; font-size: 1.4em;"> ${config.kda} KDA</div>
            </div>
        </div>
    `;
    container.style.backgroundImage = `url(${config.championUrl})`;
    container.style.backgroundSize = 'cover';
    container.style.backgroundPositionY = 'top';
    container.style.backgroundBlendMode = 'soft-light';
    container.style.backgroundColor = '#00272760';
    container.style.boxShadow = 'inset 10px 100px 60px 10px #00272760, inset 0 0 0 10000px rgba(18, 25, 29, 0.3)';

}

function renderUsuarioEditarContas(container, data, containerPagination = null, pagina = 1) {
    if (!container) return;

    const usuarios = Array.isArray(data) ? data : [];

    if (usuarios.length === 0) {
        container.innerHTML = `
            <div class="usuarios-vazio">
                Você ainda não tem usuários cadastrados. Cadastre sua equipe para começar!
                <div class="usuario-vazio-emoji"><span class="material-symbols-outlined">groups</span></div>
            </div>
        `;
        if (containerPagination) {
            containerPagination.innerHTML = '';
        }
        return;
    }

    const paginaAtual = Number.isInteger(pagina) && pagina > 0 ? pagina : 1;
    const itensPorPagina = 5;
    const totalPaginas = Math.max(1, Math.ceil(usuarios.length / itensPorPagina));
    const paginaCorrigida = Math.min(paginaAtual, totalPaginas);
    const inicio = (paginaCorrigida - 1) * itensPorPagina;
    const fim = inicio + itensPorPagina;
    const usuariosPaginados = usuarios.slice(inicio, fim);

    const formatCargo = (cargo) => {
        switch (cargo) {
            case 2:
                return 'Treinador';
            case 3:
                return 'Jogador';
            default:
                return 'N/A';
        }
    };

    const cardsHtml = usuariosPaginados.map(usuario => `
        <div class="editar-contas-user">
            <div class="id">id: ${usuario.id}</div>
            <div class="foto"><img src="../assets/playerIcons/faker.png" alt="${usuario.nome}"></div>
            <div class="nome">${usuario.nome}</div>
            <div class="cargo"><span class="editar-contas-cargo-badge">${formatCargo(usuario.cargo)}</span></div>
            <div class="status"><span class="editar-contas-status-badge ativo">Ativo</span></div>
            <div class="acoes">
                <button class="editar-contas-btn-editar" onclick="abrirModalEditar(${usuario.id})">Editar</button>
                <button class="editar-contas-btn-excluir" onclick="abrirModalExcluir(${usuario.id})">Deletar</button>
            </div>
        </div>
    `).join('');

    container.innerHTML = cardsHtml;

    if (containerPagination) {
        const paginationHtml = Array.from({ length: totalPaginas }, (_, index) => {
            const page = index + 1;
            const activeClass = page === paginaCorrigida ? ' active' : '';
            return `<div class="editar-contas-pagination-item${activeClass}" onclick="mudarPagina(${page}, this)">${page}</div>`;
        }).join('');

        containerPagination.innerHTML = paginationHtml;
    }
}