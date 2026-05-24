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
            labels: ['DPM', 'KDA', 'KP%', 'GPM', 'CSPM', 'G@15', 'Wards/min', 'DtPM', 'Torres'],
            datasets: [{
                label: data.name,
                data: data.radarData || [0, 0, 0, 0, 0, 0, 0, 0, 0],
                borderColor: '#0F8B8B',
                backgroundColor: '#0F8B8B80'
            }]
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
        imageUrl: data.imageUrl || "../assets/playerIcons/faker.png",
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
            margin-top: 4%;
            width: 40%;
            aspect-ratio: 1;
            outline: 2px solid #0F8B8B;
            border-radius: 100%;
            object-fit: cover;
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

    console.log(profileData)
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
                    <input type="text" value="${user.name || ''}">
                </div>
                <div class="editar-contas-modal-campo">
                    <label>Email:</label>
                    <input type="email" value="${user.email || ''}">
                </div>
                <div class="editar-contas-modal-campo">
                    <label>Senha:</label>
                    <input type="password" placeholder="••••••••">
                </div>
            </div>
            <button class="editar-contas-modal-btn-salvar">Salvar</button>
        </div>
    </div>

    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);

    window.abrirModalPerfil = function () {
        document.getElementById('modalPerfilFundo').classList.add('editar-contas-modal-visivel');
    };
    window.fecharModalPerfil = function () {
        document.getElementById('modalPerfilFundo').classList.remove('editar-contas-modal-visivel');
    };

    container.innerHTML = htmlSidebar;

    const teamProfileContainer = document.getElementById('teamProfileSidebar');
    let teamProfileData = {
        name: user.nameTeam,
        coach: 'Coach: ' + user.name,
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
};