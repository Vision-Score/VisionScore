package school.sptech.repository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import school.sptech.model.Log;

@Repository
public class LogRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public void inserir(Log log) {
        String sql = """
                INSERT INTO log (arquivo,
                 status,
                  mensagem,
                   linhasLidas,
                    linhasInseridas
                     ) VALUES (?,?,?,?,?)
                """;

        jdbcTemplate.update(sql,
                log.getArquivo(),
                log.getStatus(),
                log.getMensagem(),
                log.getLinhasLidas(),
                log.getLinhasInseridas()
        );
    }
}
