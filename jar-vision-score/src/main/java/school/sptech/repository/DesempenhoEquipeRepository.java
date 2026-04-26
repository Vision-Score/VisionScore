package school.sptech.repository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import school.sptech.model.DesempenhoEquipe;

@Repository
public class DesempenhoEquipeRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public void inserir(DesempenhoEquipe desempenhoEquipe) {
        String sql = """
                                INSERT INTO desempenhoEquipe (totalCampeoesEliminados,
                                 totalTorresDestruidas,
                                  totalInibidoresDestruidos,
                                  totalDragoesAbatidos,
                                   totalArautosAbatidos,
                                    totalBaroesAbatidos,
                                     fkEquipe,
                                      fkJogador)
                //                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                """;

        jdbcTemplate.update(sql,
                desempenhoEquipe.getTotalCampeoesEliminados(),
                desempenhoEquipe.getTotalTorresDestruidas(),
                desempenhoEquipe.getTotalInibidoresDestruidos(),
                desempenhoEquipe.getTotalDragoesAbatidos(),
                desempenhoEquipe.getTotalArautosAbatidos(),
                desempenhoEquipe.getTotalBaroesAbatidos(),
                desempenhoEquipe.getIdEquipe(),
                desempenhoEquipe.getIdPartida()
        );
    }
}
