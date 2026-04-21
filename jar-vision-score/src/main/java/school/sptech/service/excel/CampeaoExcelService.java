package school.sptech.service.excel;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import school.sptech.model.Campeao;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class CampeaoExcelService {

    @Autowired
    private ExcelService excelService;

    public List<Campeao> lerCampeao(InputStream inputStream) throws Exception {
        List<Map<String, String>> linhas = excelService.lerLinhas(inputStream);
        List<Campeao> campeoes = new ArrayList<>();

        for (Map<String, String> linha : linhas) {
            if (linha.get("nome") == null || linha.get("nome").isBlank()) continue;

            String nome = linha.get("nome");

            Campeao campeao = new Campeao(nome);

            campeoes.add(campeao);
        }

        return campeoes;
    }
}
