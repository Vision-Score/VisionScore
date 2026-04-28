package br.com.importer.repository;

import org.springframework.jdbc.core.JdbcTemplate;

import java.util.List;

public class LigaRepository {

    private final JdbcTemplate jdbc;

    public LigaRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    /**
     * Insere ligas em batch ignorando duplicatas (idLiga é PK).
     * Cada array: [idLiga, nome]
     */
    public int[] insertBatch(List<Object[]> batch) {
        return jdbc.batchUpdate(
            "INSERT IGNORE INTO liga (idLiga, nome) VALUES (?, ?)",
            batch
        );
    }
}
