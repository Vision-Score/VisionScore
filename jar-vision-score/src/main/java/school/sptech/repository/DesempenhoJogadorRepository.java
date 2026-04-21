package school.sptech.repository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import school.sptech.model.DesempenhoJogador;

@Repository
public class DesempenhoJogadorRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public void inserir(DesempenhoJogador desempenhoJogador) {
        String sql = """
                INSERT INTO desempenhoJogador (vitoria,
                eliminacaoCampeoes,
                qtdMortes,
                qtdAssistencias,
                totalLacaiosAbatidos,
                qtdOuroObtido,
                nivelFinal
                totalDanoCausado,
                totalDanoCausadoCampeaoInimigo,
                totalDanoRecebido,
                qtdSentinelasPosicionadas,
                eliminacoesConsecutivas,
                eliminacoesMultiplas,
                fkJogador,
                fkEquipe,
                fkCampeao,
                fkPartida)
                // VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """;

        jdbcTemplate.update(sql,
                desempenhoJogador.getVitoria(),
                desempenhoJogador.getEliminacoesCampeoes(),
                desempenhoJogador.getQtdMortes(),
                desempenhoJogador.getQtdAssistencias(),
                desempenhoJogador.getTotalLacaiosAbatidos(),
                desempenhoJogador.getQtdOuroObtido(),
                desempenhoJogador.getNivelFinal(),
                desempenhoJogador.getTotalDanoCausado(),
                desempenhoJogador.getTotalDanoCausadoCampeaoInimigo(),
                desempenhoJogador.getTotalDanoRecebido(),
                desempenhoJogador.getQtdSentinelasPosicionadas(),
                desempenhoJogador.getEliminacoesConsecutivas(),
                desempenhoJogador.getEliminacoesMultiplas(),
                desempenhoJogador.getIdJogador(),
                desempenhoJogador.getIdEquipe(),
                desempenhoJogador.getIdCampeao(),
                desempenhoJogador.getIdPartida()
        );
    }
}
