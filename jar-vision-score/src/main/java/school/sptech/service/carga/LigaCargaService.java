package school.sptech.service.carga;

import org.springframework.beans.factory.annotation.Autowired;
import school.sptech.model.Liga;
import school.sptech.repository.LigaRepository;
import school.sptech.service.LogService;
import school.sptech.service.excel.LigaExcelService;
import school.sptech.service.s3.S3Service;

import java.io.InputStream;
import java.util.List;

public class LigaCargaService {
    @Autowired
    private S3Service s3Service;
    @Autowired
    private LigaExcelService ligaExcelService;
    @Autowired
    private LigaRepository ligaRepository;
    @Autowired
    private LogService logService;

    public void executar(String bucket, String nomeArquivo) {
        int linhasLidas = 0;
        int linhasInseridas = 0;

        try {
            InputStream stream = s3Service.baixarArquivo(bucket, nomeArquivo);

            List<Liga> ligas = ligaExcelService.lerLiga(stream);
            linhasLidas = ligas.size();

            for (Liga liga : ligas) {
                ligaRepository.inserir(liga);
                linhasInseridas++;
            }

            logService.registrarSucesso(nomeArquivo, linhasLidas, linhasInseridas);
        } catch (Exception e) {
            logService.registrarErro(nomeArquivo, e.getMessage(), linhasLidas);
        }
    }
}
