package br.com.importer.repository;

import org.springframework.jdbc.core.JdbcTemplate;

import java.util.List;

public class JogoRepository {

    private final JdbcTemplate jdbc;

    public JogoRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    /**
     * Insere jogos em batch ignorando duplicatas.
     * Cada array: [idJogo, dtJogo (String ISO), fkConfronto, fkSerie]
     */
    public int[] insertBatch(List<Object[]> batch) {
        return jdbc.batchUpdate(
            "INSERT INTO jogo (idJogo, dtJogo, fkConfronto, fkSerie) VALUES (?, ?, ?, ?)",
            batch
        );
    }

    /**
     * Atualiza duracaoSegundos e fkEquipeVencedora em bulk via tabela temporária + UPDATE JOIN.
     * Evita 37k viagens individuais ao banco — substitui updateDuracaoEVencedor.
     * Cada array: [duracaoSegundos, fkEquipeVencedora, idJogo]
     */
    public void updateDuracaoEVencedorBulk(List<Object[]> todos) {
        jdbc.execute(
            "CREATE TEMPORARY TABLE IF NOT EXISTS tmp_jogo_update " +
            "(idJogo INT PRIMARY KEY, duracaoSegundos INT, fkEquipeVencedora INT)"
        );

        // INSERT em batch — com rewriteBatchedStatements o driver combina tudo em
        // um único multi-value INSERT, eliminando as viagens individuais ao banco
        jdbc.batchUpdate(
            "INSERT INTO tmp_jogo_update (duracaoSegundos, fkEquipeVencedora, idJogo) " +
            "VALUES (?, ?, ?)",
            todos
        );

        // Um único UPDATE JOIN atualiza todos os registros internamente no MySQL
        jdbc.execute(
            "UPDATE jogo j " +
            "JOIN tmp_jogo_update t ON j.idJogo = t.idJogo " +
            "SET j.duracaoSegundos = t.duracaoSegundos, " +
            "    j.fkEquipeVencedora = t.fkEquipeVencedora"
        );

        jdbc.execute("DROP TEMPORARY TABLE IF EXISTS tmp_jogo_update");
    }
}
