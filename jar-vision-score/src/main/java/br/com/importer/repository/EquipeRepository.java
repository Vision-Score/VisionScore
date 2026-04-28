package br.com.importer.repository;

import org.springframework.jdbc.core.JdbcTemplate;

import java.util.List;

public class EquipeRepository {

    private final JdbcTemplate jdbc;

    public EquipeRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    /**
     * Insere equipes em batch ignorando duplicatas.
     * Cada array: [idEquipe, nome, sigla]
     */
    public int[] insertBatch(List<Object[]> batch) {
        return jdbc.batchUpdate(
            "INSERT IGNORE INTO equipe (id_equipe, nome, sigla) VALUES (?, ?, ?)",
            batch
        );
    }
}
