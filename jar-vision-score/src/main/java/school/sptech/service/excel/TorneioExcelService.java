package school.sptech.service.excel;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import school.sptech.model.Torneio;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class TorneioExcelService {

    @Autowired
    private ExcelService excelService;

    public List<Torneio> lerTorneio(InputStream inputStream) throws Exception {
        List<Map<String, String>> linhas = excelService.lerLinhas(inputStream);
        List<Torneio> torneios = new ArrayList<>();

        for (Map<String, String> linha : linhas) {
            if (linha.get("nome") == null || linha.get("nome").isBlank()) continue;

            String nome = linha.get("nome").trim();
            Integer idLiga = Integer.parseInt(linha.get("fkLiga").trim());

            Torneio torneio = new Torneio(nome, idLiga);
            torneios.add(torneio);
        }

        return torneios;
    }
}
