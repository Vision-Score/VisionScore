package school.sptech.service.excel;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import school.sptech.model.Partida;

import java.io.InputStream;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class PartidaExcelService {

    @Autowired
    private ExcelService excelService;

    public List<Partida> lerPartida(InputStream inputStream) throws Exception {
        List<Map<String, String>> linhas = excelService.lerLinhas(inputStream);
        List<Partida> partidas = new ArrayList<>();

        for (Map<String, String> linha : linhas) {
            if (linha.get("dtPartida") == null || linha.get("dtPartida").isBlank()) continue;

            LocalDate dtPartida = LocalDate.parse(linha.get("dtPartida").trim(),
                    DateTimeFormatter.ofPattern("dd/MM/yyyy"));

            Integer idJogo = Integer.parseInt(linha.get("fkJogo").trim());

            Partida partida = new Partida(dtPartida, idJogo);
            partidas.add(partida);
        }

        return partidas;
    }
}
