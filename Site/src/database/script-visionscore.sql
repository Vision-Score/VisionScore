DROP DATABASE IF EXISTS vision_score;
CREATE DATABASE IF NOT EXISTS vision_score;
USE vision_score;

CREATE TABLE  cadastro (
id_usuario INT PRIMARY KEY AUTO_INCREMENT,
nome VARCHAR(100),
telefone VARCHAR(20),
email VARCHAR(100) unique,
senha VARCHAR(100),
cod_equipe VARCHAR(30) unique
);

select * from cadastro;

CREATE TABLE equipe (
id_equipe int NOT NULL AUTO_INCREMENT PRIMARY KEY,
nome varchar(100),
sigla varchar(10),
dtCriacao datetime
);

CREATE TABLE treinador (
idTreinador int NOT NULL AUTO_INCREMENT,
nome varchar(100),
email varchar(150),
senha varchar(255),
dtCriacao datetime,
ultimoLogin datetime,
fkEquipe int NOT NULL,
PRIMARY KEY (idTreinador, fkEquipe),
CONSTRAINT fk_usuario_equipe1 
	FOREIGN KEY (fkEquipe) 
		REFERENCES equipe (id_equipe)
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
idJogo int NOT NULL AUTO_INCREMENT PRIMARY KEY,
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