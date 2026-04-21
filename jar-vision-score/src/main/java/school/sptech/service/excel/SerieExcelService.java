package school.sptech.service.excel;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import school.sptech.model.Serie;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class SerieExcelService {

    @Autowired
    private ExcelService excelService;

    public List<Serie> lerSerie(InputStream inputStream) throws Exception{
        List<Map<String, String>> linhas = excelService.lerLinhas(inputStream);
        List<Serie> series = new ArrayList<>();

        for (Map<String, String> linha : linhas) {
            if (linha.get("nome") == null || linha.get("nome").isBlank()) continue;

            String nome = linha.get("nome").trim();
            Integer idTorneio = Integer.parseInt(linha.get("fkTorneio").trim());

            Serie serie = new Serie(nome, idTorneio);
            series.add(serie);
        }

        return series;
    }
}
