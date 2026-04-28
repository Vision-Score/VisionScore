package br.com.importer.repository;

import org.springframework.jdbc.core.JdbcTemplate;

import java.util.List;

public class SeriesRepository {

    private final JdbcTemplate jdbc;

    public SeriesRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    /**
     * Insere séries em batch ignorando duplicatas.
     * Cada array: [idSeries, nome, fkTorneio]
     */
    public int[] insertBatch(List<Object[]> batch) {
        return jdbc.batchUpdate(
            "INSERT IGNORE INTO series (idSeries, nome, fkTorneio) VALUES (?, ?, ?)",
            batch
        );
    }
}
