package school.sptech.repository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import school.sptech.model.Jogador;

@Repository
public class JogadorRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public void inserir(Jogador jogador) {
        String sql = """
                INSERT INTO jogador (nome, funcao, dtCriacao, fkEquipe) VALUES (?, ?, ?, ?)
                """;

        jdbcTemplate.update(sql,
                jogador.getNome(),
                jogador.getFuncao(),
                jogador.getDtCriacao(),
                jogador.getIdEquipe()
                );
    }
}
