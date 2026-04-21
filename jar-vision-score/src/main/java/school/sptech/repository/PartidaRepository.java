package school.sptech.repository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import school.sptech.model.Partida;

@Repository
public class PartidaRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public void inserir(Partida partida) {
        String sql = """
                INSERT INTO partida (dtPartida, fkJogo) VALUES (?, ?)
                """;

        jdbcTemplate.update(sql, partida.getDtPartida(), partida.getIdJogo());
    }
}
