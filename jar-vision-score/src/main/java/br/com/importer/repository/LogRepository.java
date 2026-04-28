package br.com.importer.repository;

import org.springframework.jdbc.core.JdbcTemplate;

public class LogRepository {

    private final JdbcTemplate jdbc;

    public LogRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    /**
     * Insere um registro de log no banco.
     *
     * @param arquivo         nome do arquivo processado
     * @param status          "SUCESSO" ou "FALHA"
     * @param mensagem        descrição detalhada
     * @param linhasLidas     total de linhas lidas do arquivo
     * @param linhasInseridas total de linhas efetivamente inseridas
     */
    public void inserir(String arquivo, String status, String mensagem,
                        int linhasLidas, int linhasInseridas) {
        jdbc.update(
            "INSERT INTO log (arquivo, status, mensagem, linhasLidas, linhasInseridas) " +
            "VALUES (?, ?, ?, ?, ?)",
            arquivo, status, mensagem, linhasLidas, linhasInseridas
        );
    }
}
