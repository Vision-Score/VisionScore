package school.sptech.service.carga;

import org.springframework.beans.factory.annotation.Autowired;
import school.sptech.model.Evento;
import school.sptech.repository.EventoRepository;
import school.sptech.service.LogService;
import school.sptech.service.excel.EventoExcelService;
import school.sptech.service.s3.S3Service;

import java.io.InputStream;
import java.util.List;

public class EventoCargaService {
    @Autowired
    private S3Service s3Service;
    @Autowired
    private EventoExcelService eventoExcelService;
    @Autowired
    private EventoRepository eventoRepository;
    @Autowired
    private LogService logService;

    public void executar(String bucket, String nomeArquivo) {
        int linhasLidas = 0;
        int linhasInseridas = 0;

        try {
            InputStream stream = s3Service.baixarArquivo(bucket, nomeArquivo);

            List<Evento> eventos = eventoExcelService.lerEvento(stream);
            linhasLidas = eventos.size();

            for (Evento evento : eventos) {
                eventoRepository.inserir(evento);
                linhasInseridas++;
            }

            logService.registrarSucesso(nomeArquivo, linhasLidas, linhasInseridas);
        } catch (Exception e) {
            logService.registrarErro(nomeArquivo, e.getMessage(), linhasLidas);
        }
    }
}
