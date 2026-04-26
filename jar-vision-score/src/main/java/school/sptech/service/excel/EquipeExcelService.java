package school.sptech.service.excel;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import school.sptech.model.Equipe;

import java.io.InputStream;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class EquipeExcelService {

    @Autowired
    private ExcelService excelService;

    public List<Equipe> lerEquipe(InputStream inputStream) throws Exception {
        List<Map<String, String>> linhas = excelService.lerLinhas(inputStream);
        List<Equipe> equipes = new ArrayList<>();

        for (Map<String, String> linha : linhas) {
            if (linha.get("nome") == null || linha.get("nome").isBlank()) continue;

            String nome = linha.get("nome").trim();
            String sigla = linha.get("sigla").trim();
            LocalDate dtCriacao = LocalDate.parse(linha.get("dtCriacao").trim(),
                    DateTimeFormatter.ofPattern("dd/MM/yyyy"));

            Equipe equipe = new Equipe(nome, sigla, dtCriacao);

            equipes.add(equipe);
        }

        return equipes;
    }
}
