package school.sptech.service.carga;

import org.springframework.beans.factory.annotation.Autowired;
import school.sptech.model.Partida;
import school.sptech.repository.PartidaRepository;
import school.sptech.service.LogService;
import school.sptech.service.excel.PartidaExcelService;
import school.sptech.service.s3.S3Service;

import java.io.InputStream;
import java.util.List;

public class PartidaCargaService {
    @Autowired
    private S3Service s3Service;
    @Autowired
    private PartidaExcelService partidaExcelService;
    @Autowired
    private PartidaRepository partidaRepository;
    @Autowired
    private LogService logService;

    public void executar(String bucket, String nomeArquivo) {
        int linhasLidas = 0;
        int linhasInseridas = 0;

        try {
            InputStream stream = s3Service.baixarArquivo(bucket, nomeArquivo);

            List<Partida> partidas = partidaExcelService.lerPartida(stream);
            linhasLidas = partidas.size();

            for (Partida partida : partidas) {
                partidaRepository.inserir(partida);
                linhasInseridas++;
            }

            logService.registrarSucesso(nomeArquivo, linhasLidas, linhasInseridas);
        } catch (Exception e) {
            logService.registrarErro(nomeArquivo, e.getMessage(), linhasLidas);
        }
    }
}
