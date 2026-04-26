package school.sptech.repository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import school.sptech.model.Torneio;

@Repository
public class TorneioRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public void inserir(Torneio torneio) {
        String sql = """
                INSERT INTO torneio (nome, fkLiga) VALUES (?, ?)
                """;

        jdbcTemplate.update(sql, torneio.getNome(), torneio.getIdLiga());
    }
}
