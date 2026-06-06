package br.com.importer.repository;

import org.springframework.jdbc.core.JdbcTemplate;

import java.util.List;

public class JogoRepository {

    private final JdbcTemplate jdbc;

    public JogoRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    /**
     * Insere jogos em batch ignorando duplicatas.
     * Cada array: [idJogo, dtJogo (String ISO), fkConfronto, fkSerie]
     */
    public int[] insertBatch(List<Object[]> batch) {
        return jdbc.batchUpdate(
            "INSERT INTO jogo (idJogo, dtJogo, fkConfronto, fkSerie) VALUES (?, ?, ?, ?)",
            batch
        );
    }

    /**
     * Atualiza duracaoSegundos e fkEquipeVencedora após processar game_players_stats.
     * Cada array: [duracaoSegundos, fkEquipeVencedora, idJogo]
     */
    public int[] updateDuracaoEVencedor(List<Object[]> batch) {
        return jdbc.batchUpdate(
            "UPDATE jogo SET duracaoSegundos = ?, fkEquipeVencedora = ? WHERE idJogo = ?",
            batch
        );
    }
}
