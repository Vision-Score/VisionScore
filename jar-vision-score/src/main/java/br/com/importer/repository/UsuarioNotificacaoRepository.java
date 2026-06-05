package br.com.importer.repository;

import org.springframework.jdbc.core.JdbcTemplate;

import java.util.List;

public class UsuarioNotificacaoRepository {

    private final JdbcTemplate jdbcTemplate;

    public UsuarioNotificacaoRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Usuario> buscarUsuariosComNotificacaoAtiva() {
        String sql = """
                SELECT id_usuario, nome, email
                FROM cadastro
                WHERE notificar = 1
                  AND email IS NOT NULL
                  AND TRIM(email) <> ''
                """;

        return jdbcTemplate.query(sql, (rs, rowNum) -> new Usuario(
                rs.getInt("id_usuario"),
                rs.getString("nome"),
                rs.getString("email")
        ));
    }

    public record Usuario(
            Integer id,
            String nome,
            String email
    ) {
    }
}
