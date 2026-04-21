package school.sptech.repository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import school.sptech.model.Liga;

@Repository
public class LigaRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public void inserir(Liga liga) {
        String sql = """
                INSERT INTO liga (nome) VALUES (?)
                """;

        jdbcTemplate.update(sql, liga.getNome());
    }
}
