package school.sptech.service.excel;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import school.sptech.model.Jogo;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class JogoExcelService {
    
    @Autowired
    private ExcelService excelService;
    
    public List<Jogo> lerJogo(InputStream inputStream) throws Exception {
        List<Map<String, String>> linhas = excelService.lerLinhas(inputStream);
        List<Jogo> jogos = new ArrayList<>();

        for (Map<String, String> linha : linhas) {
            if (linha.get("fkSerie") == null || linha.get("fkSerie").isBlank()) continue;

            Integer idSerie = Integer.parseInt(linha.get("fkSerie"));

            Jogo jogo = new Jogo(idSerie);

            jogos.add(jogo);
        }

        return jogos;
    }
}
