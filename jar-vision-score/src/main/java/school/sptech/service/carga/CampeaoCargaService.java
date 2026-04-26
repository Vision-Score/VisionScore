package school.sptech.service.carga;

import org.springframework.beans.factory.annotation.Autowired;
import school.sptech.model.Campeao;
import school.sptech.repository.CampeaoRepository;
import school.sptech.service.LogService;
import school.sptech.service.excel.CampeaoExcelService;
import school.sptech.service.s3.S3Service;

import java.io.InputStream;
import java.util.List;

public class CampeaoCargaService {
    @Autowired
    private S3Service s3Service;
    @Autowired
    private CampeaoExcelService campeaoExcelService;
    @Autowired
    private CampeaoRepository campeaoRepository;
    @Autowired
    private LogService logService;

    public void executar(String bucket, String nomeArquivo) {
        int linhasLidas = 0;
        int linhasInseridas = 0;

        try {
            InputStream stream = s3Service.baixarArquivo(bucket, nomeArquivo);

            List<Campeao> campeoes = campeaoExcelService.lerCampeao(stream);
            linhasLidas = campeoes.size();

            for (Campeao campeao : campeoes) {
                campeaoRepository.inserir(campeao);
                linhasInseridas++;
            }

            logService.registrarSucesso(nomeArquivo, linhasLidas, linhasInseridas);
        } catch (Exception e) {
            logService.registrarErro(nomeArquivo, e.getMessage(), linhasLidas);
        }
    }
}


