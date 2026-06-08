drop database if exists visionscore;
CREATE DATABASE IF NOT EXISTS visionscore;
USE visionscore;


CREATE TABLE equipe (
id_equipe int NOT NULL AUTO_INCREMENT PRIMARY KEY,
nome varchar(100),
sigla varchar(10),
dtCriacao datetime
);

CREATE TABLE cadastro (
    id_usuario INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100),
    telefone VARCHAR(20),
    email VARCHAR(100) UNIQUE,
    senha VARCHAR(100),
    notificar TINYINT,
    CONSTRAINT chk_notificar CHECK (notificar IN (0,1)),
    cargo TINYINT,
    CONSTRAINT chk_cargo CHECK (cargo IN (1 , 2, 3)),
    fk_equipe INT,
    FOREIGN KEY (fk_equipe)
        REFERENCES equipe (id_equipe),
    fk_gestor INT DEFAULT NULL,
    FOREIGN KEY (fk_gestor)
        REFERENCES cadastro (id_usuario),
    fk_treinador INT DEFAULT NULL,
    FOREIGN KEY (fk_treinador)
        REFERENCES cadastro (id_usuario)
);

select * from cadastro;

CREATE TABLE estrategia (
    id_estrategia INT PRIMARY KEY AUTO_INCREMENT,
    titulo VARCHAR(200),
    dt_criacao DATE DEFAULT (current_date),
    conteudo TEXT,
    fk_treinador INT NOT NULL,
    FOREIGN KEY (fk_treinador)
        REFERENCES cadastro (id_usuario)
);

CREATE TABLE jogador (
idJogador int NOT NULL AUTO_INCREMENT PRIMARY KEY,
nome varchar(100),
funcao varchar(20),
data_criacao datetime
);

CREATE TABLE log (
idLog int NOT NULL AUTO_INCREMENT PRIMARY KEY,
arquivo varchar(100),
status char(7),
mensagem varchar(200),
linhasLidas int,
linhasInseridas int
);

CREATE TABLE confronto (
idConfronto int NOT NULL AUTO_INCREMENT PRIMARY KEY
);

CREATE TABLE liga (
idLiga int NOT NULL AUTO_INCREMENT PRIMARY KEY,
nome varchar(100)
);

CREATE TABLE torneio (
idTorneio int NOT NULL AUTO_INCREMENT PRIMARY KEY,
nome varchar(100),
fkLiga int NOT NULL,
CONSTRAINT fk_torneio_liga1 
	FOREIGN KEY (fkLiga)
		REFERENCES liga (idLiga)
);

CREATE TABLE series (
idSeries int NOT NULL AUTO_INCREMENT PRIMARY KEY,
nome varchar(100),
fkTorneio int NOT NULL,
CONSTRAINT fk_serie_torneio1 
	FOREIGN KEY (fkTorneio) 
		REFERENCES torneio (idTorneio)
);

CREATE TABLE jogo (
idJogo int NOT NULL PRIMARY KEY,
dtJogo datetime,
duracaoSegundos int,
fkEquipeVencedora int,
fkConfronto int NOT NULL,
fkSerie int NOT NULL,
CONSTRAINT fk_jogo_equipe_vencedora1 
	FOREIGN KEY (fkEquipeVencedora) 
		REFERENCES equipe (id_equipe),
CONSTRAINT fk_jogo_serie1 
	FOREIGN KEY (fkSerie) 
		REFERENCES series (idSeries),
CONSTRAINT fk_jogo_confronto1 
	FOREIGN KEY (fkConfronto) 
		REFERENCES confronto (idConfronto)
);

select * from jogo;

-- Top 10 equipes com maior taxa de vitória e tempo médio de jogo
SELECT 
    e.nome as equipe,
    COUNT(*) as jogos,
    SUM(CASE WHEN j.fkEquipeVencedora = e.id_equipe THEN 1 ELSE 0 END) as vitorias,
    ROUND(SUM(CASE WHEN j.fkEquipeVencedora = e.id_equipe THEN 1 ELSE 0 END) / COUNT(*) * 100, 1) as taxa_vitoria,
    ROUND(AVG(j.duracaoSegundos) / 60, 1) as tempo_medio_minutos,
    ROUND(MIN(j.duracaoSegundos) / 60, 1) as jogo_mais_rapido,
    ROUND(MAX(j.duracaoSegundos) / 60, 1) as jogo_mais_longo
FROM equipe e
JOIN desempenho_equipe de ON e.id_equipe = de.fkEquipe
JOIN jogo j ON de.fkJogo = j.idJogo
GROUP BY e.id_equipe, e.nome
HAVING COUNT(*) > 10
ORDER BY taxa_vitoria DESC
LIMIT 10;

CREATE TABLE desempenho_equipe (
idDesempenhoEquipe int NOT NULL AUTO_INCREMENT,
totalEliminacoes int,
totalTorresDestruidas int,
totalInibidoresDestruidos int,
totalDragoesAbatidos int,
totalArautosAbatidos int,
totalBaroesAbatidos int,
fkEquipe int NOT NULL,
fkJogo int NOT NULL,
PRIMARY KEY (idDesempenhoEquipe, fkEquipe, fkJogo),
CONSTRAINT fk_desempenho_equipe_equipe1 
	FOREIGN KEY (fkEquipe) 
		REFERENCES equipe (id_equipe),
CONSTRAINT fk_desempenho_equipe_jogo1 
	FOREIGN KEY (fkJogo) 
		REFERENCES jogo (idJogo)
);

CREATE TABLE desempenho_jogador (
idDesempenhoJogador int NOT NULL AUTO_INCREMENT,
vitoria tinyint,
nomeCampeao varchar(50),
eliminacaoCampeao int,
qtdMortes int,
qtdAssistencias int,
totalTropasAbatidas int,
qtdOuroObtido int,
nivelJogador int,
totalDanoCausado int,
totalDanoCausadoCampeaoInimigo int,
totalDanoRecebido int,
qtdSentinelasPosicionadas int,
eliminacoesConsecutivas int,
eliminacoesMultiplas int,
fkJogo int NOT NULL,
fkJogador int NOT NULL,
fkEquipe int NOT NULL,
PRIMARY KEY (idDesempenhoJogador, fkJogo, fkJogador, fkEquipe),
CONSTRAINT fk_desempenho_jogador_jogador1 
	FOREIGN KEY (fkJogador) 
		REFERENCES jogador (idJogador),
CONSTRAINT fk_desempenho_jogador_equipe1 
	FOREIGN KEY (fkEquipe) 
		REFERENCES equipe (id_equipe),
CONSTRAINT fk_desempenho_jogador_jogo1 
	FOREIGN KEY (fkJogo) 
		REFERENCES jogo (idJogo)
);


CREATE TABLE evento (
idEvento int NOT NULL AUTO_INCREMENT PRIMARY KEY,
tempoEventoSegundos int,
tipoEvento varchar(50),
tipoDragao varchar(30),
fkJogo int NOT NULL,
fkMatador int,
fkEliminado int,
CONSTRAINT fk_evento_jogo1 
	FOREIGN KEY (fkJogo) 
		REFERENCES jogo (idJogo),
CONSTRAINT fk_evento_jogador_matador1 
	FOREIGN KEY (fkMatador) 
		REFERENCES jogador (idJogador),
CONSTRAINT fk_evento_jogador_eliminado1 
	FOREIGN KEY (fkEliminado) 
		REFERENCES jogador (idJogador)
);

CREATE TABLE eventoAssistentes (
fkEvento int NOT NULL,
fkJogador int NOT NULL,
PRIMARY KEY (fkEvento, fkJogador),
CONSTRAINT fk_evento_assistentes_evento1 
	FOREIGN KEY (fkEvento) 
		REFERENCES evento (idEvento),
CONSTRAINT fk_evento_assistentes_jogador1 
	FOREIGN KEY (fkJogador) 
		REFERENCES jogador (idJogador)
);

-- CRIAR VIEWS APÓS IMPORTAÇÃO.
-- View 1: Elenco atual
CREATE OR REPLACE VIEW vw_elenco_atual AS
SELECT 
    j.idJogador,
    j.nome,
    j.funcao,
    dj.fkEquipe
FROM desempenho_jogador dj
JOIN jogador j ON j.idJogador = dj.fkJogador
JOIN (
    SELECT fkEquipe, MAX(fkJogo) AS ultimoJogo
    FROM desempenho_jogador
    GROUP BY fkEquipe
) ult ON ult.fkEquipe = dj.fkEquipe AND ult.ultimoJogo = dj.fkJogo;

-- View 2: Power pick por jogador/equipe
CREATE OR REPLACE VIEW vw_power_pick AS
SELECT 
    fkJogador,
    fkEquipe,
    nomeCampeao AS powerPick,
    COUNT(*) AS vezesJogado
FROM desempenho_jogador
GROUP BY fkJogador, fkEquipe, nomeCampeao
ORDER BY fkJogador, fkEquipe, vezesJogado DESC;

-- View 3: Stats + power pick do elenco atual (com KP% e foto)
CREATE OR REPLACE VIEW vw_stats_elenco_atual AS
SELECT 
    j.idJogador,
    j.nome,
    j.funcao,
    dj.fkEquipe,
    ROUND(AVG(dj.eliminacaoCampeao), 1)                                                                        AS mediaElims,
    ROUND(AVG(dj.qtdMortes), 1)                                                                                AS mediaMortes,
    ROUND(AVG(dj.qtdAssistencias), 1)                                                                          AS mediaAssists,
    ROUND(AVG(dj.totalDanoCausadoCampeaoInimigo), 0)                                                           AS mediaDano,
    ROUND(AVG(dj.qtdOuroObtido), 0)                                                                            AS mediaOuro,
    ROUND(AVG(dj.totalTropasAbatidas), 1)                                                                      AS mediaCS,
    ROUND(AVG(dj.qtdSentinelasPosicionadas), 1)                                                                AS mediaWards,
    ROUND(AVG((dj.eliminacaoCampeao + dj.qtdAssistencias) / NULLIF(de.totalEliminacoes, 0) * 100), 1)         AS mediaKP,
    pp.powerPick,
    ij.urlImagem                                                                                               AS urlFotoJogador
FROM desempenho_jogador dj
JOIN jogador j ON j.idJogador = dj.fkJogador
JOIN desempenho_equipe de ON de.fkJogo = dj.fkJogo AND de.fkEquipe = dj.fkEquipe
LEFT JOIN imagem_jogador ij ON ij.nomeJogador = j.nome
JOIN (
    SELECT fkJogador, fkEquipe, MIN(powerPick) AS powerPick
    FROM vw_power_pick vp1
    WHERE vezesJogado = (
        SELECT MAX(vezesJogado) 
        FROM vw_power_pick vp2
        WHERE vp2.fkJogador = vp1.fkJogador 
        AND vp2.fkEquipe = vp1.fkEquipe
    )
    GROUP BY fkJogador, fkEquipe
) pp ON pp.fkJogador = j.idJogador AND pp.fkEquipe = dj.fkEquipe
WHERE j.idJogador IN (
    SELECT idJogador FROM vw_elenco_atual WHERE fkEquipe = dj.fkEquipe
)
GROUP BY j.idJogador, j.nome, j.funcao, dj.fkEquipe, pp.powerPick, ij.urlImagem;

-- View 4: Médias por role (com KP%)
CREATE OR REPLACE VIEW vw_medias_por_role AS
SELECT
    j.funcao,
    ROUND(AVG(dj.eliminacaoCampeao), 2)                                                                        AS mediaElims,
    ROUND(AVG(dj.qtdMortes), 2)                                                                                AS mediaMortes,
    ROUND(AVG(dj.qtdAssistencias), 2)                                                                          AS mediaAssists,
    ROUND(AVG(dj.totalDanoCausadoCampeaoInimigo), 0)                                                           AS mediaDano,
    ROUND(AVG(dj.totalTropasAbatidas), 1)                                                                      AS mediaCS,
    ROUND(AVG(dj.qtdOuroObtido), 0)                                                                            AS mediaOuro,
    ROUND(AVG(dj.nivelJogador), 1)                                                                             AS mediaNivel,
    ROUND(AVG(dj.totalDanoRecebido), 0)                                                                        AS mediaDanoRecebido,
    ROUND(AVG(dj.qtdSentinelasPosicionadas), 1)                                                                AS mediaWards,
    ROUND(AVG(dj.eliminacoesConsecutivas), 2)                                                                  AS mediaElimConsec,
    ROUND(AVG(dj.eliminacoesMultiplas), 2)                                                                     AS mediaElimMultiplas,
    ROUND(AVG((dj.eliminacaoCampeao + dj.qtdAssistencias) / NULLIF(de.totalEliminacoes, 0) * 100), 1)         AS mediaKP,
    COUNT(*)                                                                                                    AS totalPartidas
FROM desempenho_jogador dj
JOIN jogador j ON j.idJogador = dj.fkJogador
JOIN desempenho_equipe de ON de.fkJogo = dj.fkJogo AND de.fkEquipe = dj.fkEquipe
GROUP BY j.funcao;

-- View 5: Destaque da ultima partida (com foto)
CREATE OR REPLACE VIEW vw_destaque_ultimo_confronto AS
SELECT
    j.idJogador,
    j.nome,
    j.funcao,
    dj.fkEquipe,
    dj.eliminacaoCampeao                                                                AS kills,
    dj.qtdMortes                                                                        AS mortes,
    dj.qtdAssistencias                                                                  AS assists,
    dj.totalDanoCausadoCampeaoInimigo                                                   AS dano,
    dj.qtdOuroObtido                                                                    AS ouro,
    dj.nomeCampeao,
    ROUND((dj.eliminacaoCampeao + dj.qtdAssistencias) / NULLIF(dj.qtdMortes, 0), 2)   AS kda,
    e2.nome                                                                             AS adversario,
    eAtual.nome                                                                         AS nomeEquipe,
    g.dtJogo,
    CASE WHEN g.fkEquipeVencedora = dj.fkEquipe THEN 'Vitória' ELSE 'Derrota' END      AS resultado,
    ij.urlImagem                                                                        AS urlFotoJogador
FROM desempenho_jogador dj
JOIN jogador j ON j.idJogador = dj.fkJogador
JOIN jogo g ON g.idJogo = dj.fkJogo
JOIN desempenho_equipe de2 ON de2.fkJogo = g.idJogo AND de2.fkEquipe != dj.fkEquipe
JOIN equipe e2 ON e2.id_equipe = de2.fkEquipe
JOIN equipe eAtual ON eAtual.id_equipe = dj.fkEquipe
LEFT JOIN imagem_jogador ij ON ij.nomeJogador = j.nome
WHERE dj.fkJogo = (
    SELECT MAX(fkJogo) FROM desempenho_jogador WHERE fkEquipe = dj.fkEquipe
)
ORDER BY kda DESC;

SELECT COUNT(*) FROM imagem_equipe WHERE urlImagem LIKE '%/player/%';
SELECT COUNT(*) FROM imagem_jogador WHERE urlImagem LIKE '%/team/%';
SELECT COUNT(*) FROM imagem_equipe WHERE urlImagem IS NULL;

SELECT DISTINCT nomeCampeao 
FROM desempenho_jogador 
ORDER BY nomeCampeao;

-- ADICIONAR AO JAR ANTES DO PRIMEIRO INSERT.
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE eventoAssistentes;
TRUNCATE TABLE evento;
TRUNCATE TABLE desempenho_jogador;
TRUNCATE TABLE desempenho_equipe;
TRUNCATE TABLE jogo;
TRUNCATE TABLE confronto;
TRUNCATE TABLE series;
TRUNCATE TABLE torneio;
TRUNCATE TABLE liga;
TRUNCATE TABLE jogador;
TRUNCATE TABLE equipe;
SET FOREIGN_KEY_CHECKS = 1;

SELECT 
    t.nome as torneio,
    (SELECT s2.nome FROM series s2 
     JOIN jogo j2 ON j2.fkSerie = s2.idSeries 
     WHERE s2.fkTorneio = t.idTorneio 
     GROUP BY s2.nome 
     ORDER BY COUNT(*) DESC LIMIT 1) as serie,
    COUNT(*) as jogos,
    ROUND(SUM(CASE WHEN j.fkEquipeVencedora = 84 THEN 1 ELSE 0 END) / COUNT(*) * 100, 1) as winrate,
    MAX(j.dtJogo) as dtReferencia
FROM jogo j
JOIN series s ON j.fkSerie = s.idSeries
JOIN torneio t ON s.fkTorneio = t.idTorneio
JOIN desempenho_equipe de ON de.fkJogo = j.idJogo AND de.fkEquipe = 84
GROUP BY t.idTorneio, t.nome
HAVING COUNT(*) > 2
ORDER BY dtReferencia DESC
LIMIT 5;

SELECT 
    j.idJogo,
    j.dtJogo,
    CASE WHEN j.fkEquipeVencedora = 84 THEN 'V' ELSE 'D' END as resultado,
    e.nome as adversario
FROM jogo j
JOIN desempenho_equipe de ON de.fkJogo = j.idJogo AND de.fkEquipe = 84
JOIN desempenho_equipe de2 ON de2.fkJogo = j.idJogo AND de2.fkEquipe != 84
JOIN equipe e ON e.id_equipe = de2.fkEquipe
ORDER BY j.dtJogo DESC
LIMIT 5;

-- View 1: mais leve, sem first blood
CREATE OR REPLACE VIEW vw_medias_gerais AS
SELECT
    ROUND(AVG(stats.total_dano / NULLIF(stats.total_ouro, 0)), 4) AS media_dano_por_gold,
    ROUND(SUM(CASE WHEN j.fkEquipeVencedora = stats.fkEquipe THEN 1 ELSE 0 END) / COUNT(*) * 100, 1) AS media_winrate,
    ROUND(AVG(de.totalDragoesAbatidos + de.totalBaroesAbatidos + de.totalArautosAbatidos), 2) AS media_objetivos,
    ROUND(AVG(stats.total_wards / NULLIF(j.duracaoSegundos / 60.0, 0)), 4) AS media_visao_por_minuto,
    ROUND(SUM(CASE WHEN (de.totalDragoesAbatidos + de.totalBaroesAbatidos + de.totalArautosAbatidos) > 3
                   AND j.fkEquipeVencedora = stats.fkEquipe THEN 1 ELSE 0 END)
          / NULLIF(SUM(CASE WHEN (de.totalDragoesAbatidos + de.totalBaroesAbatidos + de.totalArautosAbatidos) > 3
                            THEN 1 ELSE 0 END), 0) * 100, 1) AS media_conversao_objetivos
FROM (
    SELECT fkJogo, fkEquipe,
        SUM(totalDanoCausadoCampeaoInimigo) AS total_dano,
        SUM(qtdOuroObtido) AS total_ouro,
        SUM(qtdSentinelasPosicionadas) AS total_wards
    FROM desempenho_jogador
    GROUP BY fkJogo, fkEquipe
) AS stats
JOIN desempenho_equipe de ON de.fkJogo = stats.fkJogo AND de.fkEquipe = stats.fkEquipe
JOIN jogo j ON j.idJogo = stats.fkJogo;

CREATE OR REPLACE VIEW vw_media_first_blood AS
SELECT
    ROUND(COUNT(DISTINCT fb.fkJogo) / COUNT(DISTINCT j.idJogo) * 100, 1) AS media_first_blood_rate
FROM jogo j
LEFT JOIN (
    SELECT fkJogo, MIN(tempoEventoSegundos) AS primeiro_kill
    FROM evento
    WHERE tipoEvento = 'player_kill'
    GROUP BY fkJogo
) fb ON fb.fkJogo = j.idJogo;

select * from vw_media_first_blood;

select * from vw_medias_gerais;	

CREATE OR REPLACE VIEW vw_kpis_por_equipe AS
SELECT
    stats.fkEquipe,
    ROUND(AVG(stats.total_dano / NULLIF(stats.total_ouro, 0)), 4) AS dano_por_gold,
    ROUND(SUM(CASE WHEN j.fkEquipeVencedora = stats.fkEquipe THEN 1 ELSE 0 END) / COUNT(*) * 100, 1) AS winrate,
    ROUND(AVG(de.totalDragoesAbatidos + de.totalBaroesAbatidos + de.totalArautosAbatidos), 2) AS objetivos,
    ROUND(AVG(stats.total_wards / NULLIF(j.duracaoSegundos / 60.0, 0)), 4) AS visao_por_minuto,
    ROUND(SUM(CASE WHEN (de.totalDragoesAbatidos + de.totalBaroesAbatidos + de.totalArautosAbatidos) > 3
                   AND j.fkEquipeVencedora = stats.fkEquipe THEN 1 ELSE 0 END)
          / NULLIF(SUM(CASE WHEN (de.totalDragoesAbatidos + de.totalBaroesAbatidos + de.totalArautosAbatidos) > 3
                            THEN 1 ELSE 0 END), 0) * 100, 1) AS conversao_objetivos,
    ROUND(SUM(CASE WHEN fb.fkEquipe = stats.fkEquipe THEN 1 ELSE 0 END) / COUNT(*) * 100, 1) AS first_blood_rate
FROM (
    SELECT fkJogo, fkEquipe,
        SUM(totalDanoCausadoCampeaoInimigo) AS total_dano,
        SUM(qtdOuroObtido) AS total_ouro,
        SUM(qtdSentinelasPosicionadas) AS total_wards
    FROM desempenho_jogador
    GROUP BY fkJogo, fkEquipe
) AS stats
JOIN desempenho_equipe de ON de.fkJogo = stats.fkJogo AND de.fkEquipe = stats.fkEquipe
JOIN jogo j ON j.idJogo = stats.fkJogo
LEFT JOIN (
    SELECT e.fkJogo, dj.fkEquipe
    FROM evento e
    JOIN (
        SELECT fkJogo, MIN(tempoEventoSegundos) AS primeiro_kill
        FROM evento
        WHERE tipoEvento = 'player_kill'
        GROUP BY fkJogo
    ) primeiro ON primeiro.fkJogo = e.fkJogo AND primeiro.primeiro_kill = e.tempoEventoSegundos
    JOIN desempenho_jogador dj ON dj.fkJogador = e.fkMatador AND dj.fkJogo = e.fkJogo
    WHERE e.tipoEvento = 'player_kill'
) fb ON fb.fkJogo = stats.fkJogo
GROUP BY stats.fkEquipe;

SELECT * FROM vw_kpis_por_equipe WHERE fkEquipe = 84;

SELECT 
    s.*,
    e.nome AS nomeEquipe,
    e.sigla
FROM vw_stats_elenco_atual s
JOIN equipe e ON e.id_equipe = s.fkEquipe
WHERE s.idJogador = 222
ORDER BY s.fkEquipe DESC
LIMIT 1;

SELECT 	
    DISTINTCT(j.idJogador),
    j.nome,
    j.funcao,
    ea.fkEquipe,
    ij.urlImagem AS urlFotoJogador
FROM jogador j
JOIN vw_elenco_atual ea ON ea.idJogador = j.idJogador
LEFT JOIN imagem_jogador ij ON ij.nomeJogador = j.nome
WHERE j.funcao = "top"
ORDER BY j.nome;

