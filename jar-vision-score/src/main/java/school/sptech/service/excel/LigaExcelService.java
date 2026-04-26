package school.sptech.service.excel;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import school.sptech.model.Liga;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class LigaExcelService {

    @Autowired
    private ExcelService excelService;

    public List<Liga> lerLiga(InputStream inputStream) throws Exception{
        List<Map<String, String>> linhas = excelService.lerLinhas(inputStream);
        List<Liga> ligas = new ArrayList<>();

        for (Map<String, String> linha : linhas) {
            if (linha.get("nome") == null || linha.get("nome").isBlank()) continue;

            String nome = linha.get("nome").trim();

            Liga liga = new Liga(nome);
            ligas.add(liga);
        }

        return ligas;
    }
}
