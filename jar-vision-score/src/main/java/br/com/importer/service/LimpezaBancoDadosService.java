package br.com.importer.service;

import org.springframework.jdbc.core.JdbcTemplate;

import java.util.List;

public class LimpezaBancoDadosService {

    private final JdbcTemplate jdbcTemplate;

    private static final List<String> TABELAS_TRUNCATE = List.of(
            "eventoAssistentes",
            "evento",
            "desempenho_jogador",
            "desempenho_equipe",
            "jogo",
            "confronto",
            "series",
            "torneio",
            "liga",
            "jogador",
            "equipe"
    );

    public LimpezaBancoDadosService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public void limpar() {
        System.out.println("\n[LimpezaBancoDadosService] Limpando tabelas antes do ETL...");

        jdbcTemplate.execute("SET FOREIGN_KEY_CHECKS = 0");

        for (String tabela : TABELAS_TRUNCATE) {
            try {
                jdbcTemplate.execute("TRUNCATE TABLE " + tabela);
                System.out.println("[LimpezaBancoDadosService] TRUNCATE " + tabela + " ✓");
            } catch (Exception e) {
                System.err.println("[LimpezaBancoDadosService] Falha ao truncar " + tabela + ": " + e.getMessage());
                throw e;
            }
        }

        jdbcTemplate.execute("SET FOREIGN_KEY_CHECKS = 1");
        System.out.println("[LimpezaBancoDadosService] Limpeza concluída ✓");
    }
}
