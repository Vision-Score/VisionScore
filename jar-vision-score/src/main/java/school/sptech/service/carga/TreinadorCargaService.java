package school.sptech.service.carga;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import school.sptech.model.Treinador;
import school.sptech.repository.TreinadorRepository;
import school.sptech.service.LogService;
import school.sptech.service.excel.TreinadorExcelService;
import school.sptech.service.s3.S3Service;

import java.io.InputStream;
import java.util.List;

@Service
public class TreinadorCargaService {

    @Autowired
    private S3Service s3Service;
    @Autowired
    private TreinadorExcelService treinadorExcelService;
    @Autowired
    private TreinadorRepository treinadorRepository;
    @Autowired
    private LogService logService;

    public void executar(String bucket, String nomeArquivo) {
        int linhasLidas = 0;
        int linhasInseridas = 0;

        try {
            InputStream stream = s3Service.baixarArquivo(bucket, nomeArquivo);

            List<Treinador> treinadores = treinadorExcelService.lerTreinador(stream);
            linhasLidas = treinadores.size();

            for (Treinador treinador : treinadores) {
                treinadorRepository.inserir(treinador);
                linhasInseridas++;
            }

            logService.registrarSucesso(nomeArquivo, linhasLidas, linhasInseridas);
        } catch (Exception e) {
            logService.registrarErro(nomeArquivo, e.getMessage(), linhasLidas);
        }
    }
}
