package school.sptech.service.carga;

import org.springframework.beans.factory.annotation.Autowired;
import school.sptech.model.Torneio;
import school.sptech.repository.TorneioRepository;
import school.sptech.service.LogService;
import school.sptech.service.excel.TorneioExcelService;
import school.sptech.service.s3.S3Service;

import java.io.InputStream;
import java.util.List;

public class TorneioCargaService {
    @Autowired
    private S3Service s3Service;
    @Autowired
    private TorneioExcelService torneioExcelService;
    @Autowired
    private TorneioRepository torneioRepository;
    @Autowired
    private LogService logService;

    public void executar(String bucket, String nomeArquivo) {
        int linhasLidas = 0;
        int linhasInseridas = 0;

        try {
            InputStream stream = s3Service.baixarArquivo(bucket, nomeArquivo);

            List<Torneio> torneios = torneioExcelService.lerTorneio(stream);
            linhasLidas = torneios.size();

            for (Torneio torneio : torneios) {
                torneioRepository.inserir(torneio);
                linhasInseridas++;
            }

            logService.registrarSucesso(nomeArquivo, linhasLidas, linhasInseridas);
        } catch (Exception e) {
            logService.registrarErro(nomeArquivo, e.getMessage(), linhasLidas);
        }
    }
}
