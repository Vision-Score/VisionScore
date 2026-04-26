package school.sptech.service.excel;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import school.sptech.model.DesempenhoEquipe;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class DesempenhoEquipeExcelService {

    @Autowired
    private ExcelService excelService;

    public List<DesempenhoEquipe> lerDesempenhoEquipe(InputStream inputStream) throws Exception {
        List<Map<String, String>> linhas = excelService.lerLinhas(inputStream);
        List<DesempenhoEquipe> desempenhoEquipes = new ArrayList<>();

        for (Map<String, String> linha : linhas) {
            if (linha.get("totalCampeoesEliminados") == null || linha.get(
                    "totalCampeoesEliminados").isBlank()) continue;

            Integer totalCampeoesEliminados = Integer.parseInt(linha.get("totalCampeoesEliminados"
            ).trim());
            Integer totalTorresDestruidas =
                    Integer.parseInt(linha.get("totalTorresDestruidas").trim());
            Integer totalInibidoresDestruidos = Integer.parseInt(linha.get(
                    "totalInibidoresDestruidos").trim());
            Integer totalDragoesAbatidos =
                    Integer.parseInt(linha.get("totalDragoesAbatidos").trim());
            Integer totalArautosAbatidos =
                    Integer.parseInt(linha.get("totalArautosAbatidos").trim());
            Integer totalBaroesAbatidos = Integer.parseInt(linha.get("totalBaroesAbatidos").trim());
            Integer idEquipe = Integer.parseInt(linha.get("idEquipe").trim());
            Integer idPartida = Integer.parseInt(linha.get("idPartida").trim());

            DesempenhoEquipe desempenhoEquipe = new DesempenhoEquipe(totalCampeoesEliminados,
                    totalTorresDestruidas, totalInibidoresDestruidos, totalDragoesAbatidos,
                    totalArautosAbatidos, totalBaroesAbatidos, idEquipe, idPartida);

            desempenhoEquipes.add(desempenhoEquipe);
        }

        return desempenhoEquipes;
    }

}
