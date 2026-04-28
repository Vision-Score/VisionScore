package br.com.importer.repository;

import org.springframework.jdbc.core.JdbcTemplate;

import java.util.List;

public class TorneioRepository {

    private final JdbcTemplate jdbc;

    public TorneioRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    /**
     * Insere torneios em batch ignorando duplicatas.
     * Cada array: [idTorneio, nome, fkLiga]
     */
    public int[] insertBatch(List<Object[]> batch) {
        return jdbc.batchUpdate(
            "INSERT IGNORE INTO torneio (idTorneio, nome, fkLiga) VALUES (?, ?, ?)",
            batch
        );
    }
}
