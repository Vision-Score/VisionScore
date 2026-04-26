package school.sptech.service.carga;

import org.springframework.beans.factory.annotation.Autowired;
import school.sptech.model.DesempenhoJogador;
import school.sptech.repository.DesempenhoJogadorRepository;
import school.sptech.service.LogService;
import school.sptech.service.excel.DesempenhoJogadorExcelService;
import school.sptech.service.s3.S3Service;

import java.io.InputStream;
import java.util.List;

public class DesempenhoJogadorCargaService {
    @Autowired
    private S3Service s3Service;
    @Autowired
    private DesempenhoJogadorExcelService desempenhoJogadorExcelService;
    @Autowired
    private DesempenhoJogadorRepository jogadorRepository;
    @Autowired
    private LogService logService;

    public void executar(String bucket, String nomeArquivo) {
        int linhasLidas = 0;
        int linhasInseridas = 0;

        try {
            InputStream stream = s3Service.baixarArquivo(bucket, nomeArquivo);

            List<DesempenhoJogador> desempenhoJogadores =
                    desempenhoJogadorExcelService.lerDesempenhoJogador(stream);
            linhasLidas = desempenhoJogadores.size();

            for (DesempenhoJogador desempenhoJogador : desempenhoJogadores) {
                jogadorRepository.inserir(desempenhoJogador);
                linhasInseridas++;
            }

            logService.registrarSucesso(nomeArquivo, linhasLidas, linhasInseridas);
        } catch (Exception e) {
            logService.registrarErro(nomeArquivo, e.getMessage(), linhasLidas);
        }
    }
}
