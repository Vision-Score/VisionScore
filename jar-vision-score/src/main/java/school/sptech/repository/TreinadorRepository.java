package school.sptech.repository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import school.sptech.model.Treinador;

@Repository
public class TreinadorRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public void inserir(Treinador treinador) {
        String sql = """
                INSERIR INTO treinador (nome,
                 email,
                  senha,
                   dtCriacao,
                    ultimoLogin,
                     fkEquipe) VALUES (?, ?, ?, ?, ?, ?)
                """;

        jdbcTemplate.update(sql,
                treinador.getNome(),
                treinador.getEmail(),
                treinador.getSenha(),
                treinador.getDtCriacao(),
                treinador.getUltimoLogin(),
                treinador.getIdEquipe()
        );
    }
}
