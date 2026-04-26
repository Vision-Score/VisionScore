package school.sptech.repository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import school.sptech.model.Evento;

@Repository
public class EventoRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public void inserir(Evento evento) {
        String sql = """
                INSERT INTO evento (tempoEventoSegundos,
                tipoEvento,
                tipoDragao,
                fkDesempenhoMatador,
                fkMatador,
                fkEquipeMatador,
                fkDesempenhoEliminado,
                fkJogadorEliminado,
                fkEquipeEliminado) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                """;

        jdbcTemplate.update(sql,
                evento.getTempoEventoSegundo(),
                evento.getTipoEvento(),
                evento.getTipoDragao(),
                evento.getIdDesempenhoMatador(),
                evento.getIdMatador(),
                evento.getIdEquipeMatador(),
                evento.getIdDesempenhoEliminado(),
                evento.getIdJogadorEliminado(),
                evento.getIdEquipeEliminado()
        );
    }
}
