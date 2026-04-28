package br.com.importer.repository;

import org.springframework.jdbc.core.JdbcTemplate;

import java.util.List;

public class DesempenhoEquipeRepository {

    private final JdbcTemplate jdbc;

    public DesempenhoEquipeRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    /**
     * Insere desempenhos de equipe em batch.
     * Cada array: [
     *   totalEliminacoes, totalTorresDestruidas, totalInibidoresDestruidos,
     *   totalDragoesAbatidos, totalArautosAbatidos, totalBaroesAbatidos,
     *   fkEquipe, fkJogo
     * ]
     */
    public int[] insertBatch(List<Object[]> batch) {
        return jdbc.batchUpdate(
            "INSERT IGNORE INTO desempenho_equipe " +
            "(totalEliminacoes, totalTorresDestruidas, totalInibidoresDestruidos, " +
            " totalDragoesAbatidos, totalArautosAbatidos, totalBaroesAbatidos, " +
            " fkEquipe, fkJogo) " +
            "VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            batch
        );
    }
}
