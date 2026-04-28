package br.com.importer.repository;

import org.springframework.jdbc.core.JdbcTemplate;

import java.util.List;

public class EventoRepository {

    private final JdbcTemplate jdbc;

    public EventoRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    /**
     * Insere eventos em batch ignorando duplicatas.
     * Cada array: [idEvento, tempoEventoSegundos, tipoEvento, tipoDragao, fkJogo, fkMatador, fkEliminado]
     */
    public int[] insertBatch(List<Object[]> batch) {
        return jdbc.batchUpdate(
            "INSERT IGNORE INTO evento " +
            "(idEvento, tempoEventoSegundos, tipoEvento, tipoDragao, fkJogo, fkMatador, fkEliminado) " +
            "VALUES (?, ?, ?, ?, ?, ?, ?)",
            batch
        );
    }

    /**
     * Insere assistentes de eventos em batch ignorando duplicatas.
     * Cada array: [fkEvento, fkJogador]
     */
    public int[] insertAssistentesBatch(List<Object[]> batch) {
        return jdbc.batchUpdate(
            "INSERT IGNORE INTO eventoAssistentes (fkEvento, fkJogador) VALUES (?, ?)",
            batch
        );
    }
}
