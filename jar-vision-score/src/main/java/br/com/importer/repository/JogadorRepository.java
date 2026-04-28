package br.com.importer.repository;

import org.springframework.jdbc.core.JdbcTemplate;

import java.util.List;

public class JogadorRepository {

    private final JdbcTemplate jdbc;

    public JogadorRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    /**
     * Insere jogadores em batch ignorando duplicatas.
     * Cada array: [idJogador, nome, funcao]
     */
    public int[] insertBatch(List<Object[]> batch) {
        return jdbc.batchUpdate(
            "INSERT IGNORE INTO jogador (idJogador, nome, funcao) VALUES (?, ?, ?)",
            batch
        );
    }
}
