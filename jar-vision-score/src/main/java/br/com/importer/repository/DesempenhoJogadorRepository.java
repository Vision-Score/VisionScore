package br.com.importer.repository;

import org.springframework.jdbc.core.JdbcTemplate;

import java.util.List;

public class DesempenhoJogadorRepository {

    private final JdbcTemplate jdbc;

    public DesempenhoJogadorRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    /**
     * Insere desempenhos de jogador em batch.
     * Cada array: [
     *   vitoria, nomeCampeao, qtdEliminacoes, qtdMortes, qtdAssistencias,
     *   totalTropasAbatidas, totalOuroObtido, nivelJogador,
     *   totalDanoCausado, totalDanoCausadoCampeaoInimigo, totalDanoRecebido,
     *   qtdSentinelasPosicionadas, eliminacoesConsecutivas, eliminacoesMultiplas,
     *   fkJogo, fkJogador, fkEquipe
     * ]
     */
    public int[] insertBatch(List<Object[]> batch) {
        return jdbc.batchUpdate(
                "INSERT IGNORE INTO desempenho_jogador " +
                        "(vitoria, nomeCampeao, eliminacaoCampeao, qtdMortes, qtdAssistencias, " +
                        " totalTropasAbatidas, qtdOuroObtido, nivelJogador, " +
                        " totalDanoCausado, totalDanoCausadoCampeaoInimigo, totalDanoRecebido, " +
                        " qtdSentinelasPosicionadas, eliminacoesConsecutivas, eliminacoesMultiplas, " +
                        " fkJogo, fkJogador, fkEquipe) " +
                        "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            batch
        );
    }
}
