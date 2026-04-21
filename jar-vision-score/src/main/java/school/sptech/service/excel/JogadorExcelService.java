package school.sptech.service.excel;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import school.sptech.model.Jogador;

import java.io.InputStream;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class JogadorExcelService {

    @Autowired
    private ExcelService excelService;

    public List<Jogador> lerJogador(InputStream inputStream) throws Exception {
        List<Map<String, String>> linhas = excelService.lerLinhas(inputStream);
        List<Jogador> jogadores = new ArrayList<>();

        for (Map<String, String> linha : linhas) {
            if (linha.get("nome") == null || linha.get("nome").isBlank()) continue;

            String nome = linha.get("nome").trim();
            String funcao = linha.get("funcao").trim();
            LocalDate dtCriacao = LocalDate.parse(linha.get("dtCriacao").trim(),
                    DateTimeFormatter.ofPattern("dd/MM/yyyy"));
            Integer idEquipe = Integer.parseInt(linha.get("idEquipe").trim());

            Jogador jogador = new Jogador(nome, funcao, dtCriacao, idEquipe);

            jogadores.add(jogador);
        }

        return jogadores;
    }
}
