function montarQuickStats(jogador) {
    return [
        { iconUrl: "../assets/icons/bow.svg", value: `~ ${(jogador.mediaDano / 30).toFixed(1)} DpM` },
        { iconUrl: "../assets/icons/coins.svg", value: `${(jogador.mediaOuro / 30).toFixed(1)} g@15` },
        { iconUrl: "../assets/icons/aim.svg", value: `~ ${((+jogador.mediaElims + +jogador.mediaAssists) / +jogador.mediaMortes).toFixed(1)} KDA` }
    ];
}

function montarStats(jogador, mediaRole) {
    return [
        { label: "Dano por Minuto (DpM)", playerValue: (jogador.mediaDano / 30).toFixed(1), medianValue: (mediaRole.mediaDano / 30).toFixed(1), trend: (jogador.mediaDano / 30) >= (mediaRole.mediaDano / 30) ? "up" : "down" },
        { label: "Abates (Kills)", playerValue: jogador.mediaElims, medianValue: mediaRole.mediaElims, trend: +jogador.mediaElims >= +mediaRole.mediaElims ? "up" : "down" },
        { label: "Mortes (Deaths)", playerValue: jogador.mediaMortes, medianValue: mediaRole.mediaMortes, trend: +jogador.mediaMortes <= +mediaRole.mediaMortes ? "up" : "down" },
        { label: "Assistências (Assists)", playerValue: jogador.mediaAssists, medianValue: mediaRole.mediaAssists, trend: +jogador.mediaAssists >= +mediaRole.mediaAssists ? "up" : "down" },
        { label: "Participação em Abates (KP%)", playerValue: `${jogador.mediaKP}%`, medianValue: `${mediaRole.mediaKP}%`, trend: +jogador.mediaKP >= +mediaRole.mediaKP ? "up" : "down" },
        { label: "Ouro por Minuto (GPM)", playerValue: (jogador.mediaOuro / 30).toFixed(1), medianValue: (mediaRole.mediaOuro / 30).toFixed(1), trend: (jogador.mediaOuro / 30) >= (mediaRole.mediaOuro / 30) ? "up" : "down" },
        { label: "Creep Score por Minuto (CSPM)", playerValue: (jogador.mediaCS / 30).toFixed(1), medianValue: (mediaRole.mediaCS / 30).toFixed(1), trend: (jogador.mediaCS / 30) >= (mediaRole.mediaCS / 30) ? "up" : "down" },
        { label: "Wards por Minuto", playerValue: (jogador.mediaWards / 30).toFixed(2), medianValue: (mediaRole.mediaWards / 30).toFixed(2), trend: (jogador.mediaWards / 30) >= (mediaRole.mediaWards / 30) ? "up" : "down" }
    ];
}

function montarRadar(jogador) {
    return [
        Math.min((jogador.mediaDano / 30) / 10, 100),           // DPM
        Math.min(+jogador.mediaElims * 20, 100),                 // Kills
        Math.max(100 - (+jogador.mediaMortes * 20), 0),          // Deaths (invertido)
        Math.min(+jogador.mediaAssists * 10, 100),               // Assists
        Math.min(+jogador.mediaKP, 100),                         // KP%
        Math.min((jogador.mediaOuro / 30) / 5, 100),             // GPM
        Math.min((jogador.mediaCS / 30) / 0.1, 100),             // CSPM
        Math.min((jogador.mediaWards / 30) * 100, 100)           // Wards/min
    ];
}

function montarRadarMediaRole(mediaRole) {
    return [
        Math.min((mediaRole.mediaDano / 30) / 10, 100),
        Math.min(+mediaRole.mediaElims * 20, 100),
        Math.max(100 - (+mediaRole.mediaMortes * 20), 0),
        Math.min(+mediaRole.mediaAssists * 10, 100),
        Math.min(+mediaRole.mediaKP, 100),
        Math.min((mediaRole.mediaOuro / 30) / 5, 100),
        Math.min((mediaRole.mediaCS / 30) / 0.1, 100),
        Math.min((mediaRole.mediaWards / 30) * 100, 100)
    ];
}

function montarRadarTime(elenco, mediasGerais) {
    const scores = elenco.map(jogador => {
        const mediaRole = mediasGerais.find(m => m.funcao === jogador.funcao);
        const jogadorRadar = montarRadar(jogador);
        const roleRadar = montarRadarMediaRole(mediaRole);
        return jogadorRadar.map((val, i) => val / roleRadar[i]);
    });

    return scores[0].map((_, i) =>
        Math.min((scores.reduce((acc, s) => acc + s[i], 0) / scores.length) * 50, 100)
    );
}

function montarDadosPopup(jogador, mediasGerais) {
    console.log(mediasGerais);
    const mediaRole = mediasGerais.find(m => m.funcao === jogador.funcao);
    return {
        id: jogador.idJogador,
        name: jogador.nome,
        position: jogador.funcao,
        imageUrl: jogador.urlFotoJogador || "../assets/playerIcons/Doran.png",
        teamLogoUrl: "../assets/icons/t1logo.png",
        quickStats: montarQuickStats(jogador),
        stats: montarStats(jogador, mediaRole),
        radarData: montarRadar(jogador),
        radarMediaRole: montarRadarMediaRole(mediaRole),
        powerPick: jogador.powerPick,
        badges: [
            { imageUrl: "../assets/Damage_rating.png", title: "Top Damage" },
            { imageUrl: "../assets/icons/Availability.png", title: "Acumula Gold" },
            { imageUrl: "../assets/icons/Toughness_rating.png", title: "Morre pouco" }
        ]
    };
}

function montarDadosCard(jogador) {
    return {
        name: jogador.nome,
        position: jogador.funcao,
        roleIconUrl: `../assets/icons/${jogador.funcao}_icon.png`,
        imageUrl: jogador.urlFotoJogador || "../assets/playerIcons/Doran.png",
        stats: montarQuickStats(jogador)
    };
}