package school.sptech.repository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import school.sptech.model.Equipe;

@Repository
public class EquipeRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public void inserir(Equipe equipe) {
        String sql = """
                INSERT INTO equipe (nome, sigla, dtCriacao) VALUES (?, ?, ?)
                """;

        jdbcTemplate.update(sql,
                equipe.getNome(),
                equipe.getSigla(),
                equipe.getDtCriacao()
        );
    }
}
