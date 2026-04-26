package school.sptech.service.excel;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import school.sptech.model.DesempenhoJogador;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class DesempenhoJogadorExcelService {

    @Autowired
    private ExcelService excelService;

    public List<DesempenhoJogador> lerDesempenhoJogador(InputStream inputStream) throws Exception {
        List<Map<String, String>> linhas = excelService.lerLinhas(inputStream);
        List<DesempenhoJogador> desempenhoJogadores = new ArrayList<>();

        for (Map<String, String> linha : linhas) {
            if (linha.get("vitoria") == null || linha.get("vitoria").isBlank()) continue;

            Boolean vitoria = Boolean.parseBoolean(linha.get("vitoria").trim());
            Integer eliminacoesCampeoes = Integer.parseInt(linha.get("eliminacoesCampeoes").trim());
            Integer qtdMortes = Integer.parseInt(linha.get("qtdMortes").trim());
            Integer qtdAssistencias = Integer.parseInt(linha.get("qtdAssistencias").trim());
            Integer totalLacaiosAbatidos =
                    Integer.parseInt(linha.get("totalLacaiosAbatidos").trim());
            Integer qtdOuroObtido = Integer.parseInt(linha.get("qtdOuroObtido").trim());
            Integer nivelFinal = Integer.parseInt(linha.get("nivelFinal").trim());
            Integer totalDanoCausado = Integer.parseInt(linha.get("totalDanoCausado").trim());
            Integer totalDanoCausadoCampeaoInimigo = Integer.parseInt(linha.get(
                    "totalDanoCausadoCampeaoInimigo").trim());
            Integer totalDanoRecebido = Integer.parseInt(linha.get("totalDanoRecebido").trim());
            Integer qtdSentinelasPosicionadas = Integer.parseInt(linha.get(
                    "qtdSentinelasPosicionadas").trim());
            Integer eliminacoesConsecutivas = Integer.parseInt(linha.get("eliminacoesConsecutivas"
            ).trim());
            Integer eliminacoesMultiplas =
                    Integer.parseInt(linha.get("eliminacoesMultiplas").trim());
            Integer idJogador = Integer.parseInt(linha.get("idJogador").trim());
            Integer idEquipe = Integer.parseInt(linha.get("idEquipe").trim());
            Integer idCampeao = Integer.parseInt(linha.get("idCampeao").trim());
            Integer idPartida = Integer.parseInt(linha.get("idPartida").trim());

            DesempenhoJogador desempenhoJogador = new DesempenhoJogador(vitoria,
                    eliminacoesCampeoes, qtdMortes, qtdAssistencias, totalLacaiosAbatidos,
                    qtdOuroObtido, nivelFinal, totalDanoCausado, totalDanoCausadoCampeaoInimigo,
                    totalDanoRecebido, qtdSentinelasPosicionadas, eliminacoesConsecutivas,
                    eliminacoesMultiplas, idJogador, idEquipe, idCampeao, idPartida);

            desempenhoJogadores.add(desempenhoJogador);
        }

        return desempenhoJogadores;
    }
}
