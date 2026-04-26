package school.sptech.repository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import school.sptech.model.Jogo;

@Repository
public class JogoRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public void inserir(Jogo jogo) {
        String sql = """
                INSERT INTO jogo (fkSerie) Values (?)
                """;

        jdbcTemplate.update(sql, jogo.getIdSerie());
    }
}
