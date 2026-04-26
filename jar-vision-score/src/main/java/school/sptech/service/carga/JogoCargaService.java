package school.sptech.service.carga;

import org.springframework.beans.factory.annotation.Autowired;
import school.sptech.model.Jogo;
import school.sptech.repository.JogoRepository;
import school.sptech.service.LogService;
import school.sptech.service.excel.JogoExcelService;
import school.sptech.service.s3.S3Service;

import java.io.InputStream;
import java.util.List;

public class JogoCargaService {
    @Autowired
    private S3Service s3Service;
    @Autowired
    private JogoExcelService jogoExcelService;
    @Autowired
    private JogoRepository jogoRepository;
    @Autowired
    private LogService logService;

    public void executar(String bucket, String nomeArquivo) {
        int linhasLidas = 0;
        int linhasInseridas = 0;

        try {
            InputStream stream = s3Service.baixarArquivo(bucket, nomeArquivo);

            List<Jogo> jogos = jogoExcelService.lerJogo(stream);
            linhasLidas = jogos.size();

            for (Jogo jogo : jogos) {
                jogoRepository.inserir(jogo);
                linhasInseridas++;
            }

            logService.registrarSucesso(nomeArquivo, linhasLidas, linhasInseridas);
        } catch (Exception e) {
            logService.registrarErro(nomeArquivo, e.getMessage(), linhasLidas);
        }
    }
}
