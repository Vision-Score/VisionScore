package school.sptech.service.excel;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import school.sptech.model.Evento;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class EventoExcelService {

    @Autowired
    private ExcelService excelService;

    public List<Evento> lerEvento(InputStream inputStream) throws Exception {
        List<Map<String, String>> linhas = excelService.lerLinhas(inputStream);
        List<Evento> eventos = new ArrayList<>();

        for (Map<String, String> linha : linhas) {
            if (linha.get("tempoEventoSegundos") == null || linha.get("tempoEventoSegundos").isBlank())
                continue;

            Integer tempoEventoSegundos = Integer.parseInt(linha.get("tempoEventoSegundos").trim());
            String tipoEvento = linha.get("tipoEvento").trim();
            String tipoDragao = linha.get("tipoDragao").trim();
            Integer idDesempenhoMatador = Integer.parseInt(linha.get("idDesempenhoMatador").trim());
            Integer idMatador = Integer.parseInt(linha.get("idMatador").trim());
            Integer idEquipeMatador = Integer.parseInt(linha.get("idEquipeMatador").trim());
            Integer idDesempenhoEliminado =
                    Integer.parseInt(linha.get("idDesempenhoEliminado").trim());
            Integer idJogadorEliminado = Integer.parseInt(linha.get("idJogadorEliminado").trim());
            Integer idEquipeEliminado = Integer.parseInt(linha.get("idEquipeEliminado").trim());

            Evento evento = new Evento(tempoEventoSegundos, tipoEvento, tipoDragao,
                    idDesempenhoMatador, idMatador, idEquipeMatador, idDesempenhoEliminado,
                    idJogadorEliminado, idEquipeEliminado);

            eventos.add(evento);
        }

        return eventos;
    }
}
