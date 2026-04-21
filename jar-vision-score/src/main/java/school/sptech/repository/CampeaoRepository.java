package school.sptech.repository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import school.sptech.model.Campeao;

@Repository
public class CampeaoRepository {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    public void inserir(Campeao campeao) {
        String sql = """
               INSERT INTO campeao (nome) VALUES (?)
                """;

        jdbcTemplate.update(campeao.getNome());
    }
}
