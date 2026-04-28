package br.com.importer.repository;

import org.springframework.jdbc.core.JdbcTemplate;

import java.util.List;

public class ConfrontoRepository {

    private final JdbcTemplate jdbc;

    public ConfrontoRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    /**
     * Insere confrontos em batch ignorando duplicatas.
     * Cada array: [idConfronto]
     */
    public int[] insertBatch(List<Object[]> batch) {
        return jdbc.batchUpdate(
            "INSERT IGNORE INTO confronto (idConfronto) VALUES (?)",
            batch
        );
    }
}
