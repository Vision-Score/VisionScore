package school.sptech.repository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import school.sptech.model.Serie;

@Repository
public class SerieRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public void inserir(Serie serie) {
        String sql = """
                INSERT INTO serie (nome, fkTorneio) VALUES (?, ?)
                """;

        jdbcTemplate.update(sql, serie.getNome(), serie.getIdTorneio());
    }
}
