package school.sptech.service.carga;

import org.springframework.beans.factory.annotation.Autowired;
import school.sptech.model.Serie;
import school.sptech.repository.SerieRepository;
import school.sptech.service.LogService;
import school.sptech.service.excel.SerieExcelService;
import school.sptech.service.s3.S3Service;

import java.io.InputStream;
import java.util.List;

public class SerieCargaService {
    @Autowired
    private S3Service s3Service;
    @Autowired
    private SerieExcelService serieExcelService;
    @Autowired
    private SerieRepository serieRepository;
    @Autowired
    private LogService logService;

    public void executar(String bucket, String nomeArquivo) {
        int linhasLidas = 0;
        int linhasInseridas = 0;

        try {
            InputStream stream = s3Service.baixarArquivo(bucket, nomeArquivo);

            List<Serie> series = serieExcelService.lerSerie(stream);
            linhasLidas = series.size();

            for (Serie serie : series) {
                serieRepository.inserir(serie);
                linhasInseridas++;
            }

            logService.registrarSucesso(nomeArquivo, linhasLidas, linhasInseridas);
        } catch (Exception e) {
            logService.registrarErro(nomeArquivo, e.getMessage(), linhasLidas);
        }
    }
}
