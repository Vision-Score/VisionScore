package school.sptech.service.excel;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import school.sptech.model.Treinador;

import java.io.InputStream;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class TreinadorExcelService {

    @Autowired
    private ExcelService excelService;

    public List<Treinador> lerTreinador(InputStream inputStream) throws Exception {
        List<Map<String, String>> linhas = excelService.lerLinhas(inputStream);
        List<Treinador> treinadores = new ArrayList<>();

        for (Map<String, String> linha : linhas) {
            if (linha.get("nome") == null || linha.get("nome").isBlank()) continue;

            String nome = linha.get("nome").trim();
            String email = linha.get("email").trim();
            String senha = linha.get("senha").trim();
            LocalDate dtCriacao = LocalDate.parse(linha.get("dtCriacao").trim(),
                    DateTimeFormatter.ofPattern("dd/MM/yyyy"));
            LocalDate ultimoLogin = LocalDate.parse(linha.get("ultimoLogin").trim(),
                    DateTimeFormatter.ofPattern("dd/MM/yyyy"));
            Integer idEquipe = Integer.parseInt(linha.get("idEquipe").trim());

            Treinador treinador = new Treinador(nome, email, senha, dtCriacao, ultimoLogin,
                    idEquipe);

            treinadores.add(treinador);
        }

        return treinadores;
    }
}
