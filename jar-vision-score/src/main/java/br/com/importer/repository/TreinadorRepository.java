package br.com.importer.repository;

import org.springframework.jdbc.core.JdbcTemplate;

import java.util.List;

public class TreinadorRepository {

    private final JdbcTemplate jdbcTemplate;

    public TreinadorRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Treinador> buscarTreinadoresComEmail() {
        String sql = """
                SELECT id_usuario, nome, email
                FROM cadastro
                WHERE cargo = 2
                  AND email IS NOT NULL
                  AND TRIM(email) <> ''
                """;

        return jdbcTemplate.query(sql, (rs, rowNum) -> new Treinador(
                rs.getInt("id_usuario"),
                rs.getString("nome"),
                rs.getString("email")
        ));
    }

    public record Treinador(
            Integer id,
            String nome,
            String email
    ) {
    }
}