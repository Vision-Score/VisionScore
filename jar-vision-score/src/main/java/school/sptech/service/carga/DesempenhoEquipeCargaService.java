package school.sptech.service.carga;

import org.springframework.beans.factory.annotation.Autowired;
import school.sptech.model.DesempenhoEquipe;
import school.sptech.repository.DesempenhoEquipeRepository;
import school.sptech.service.LogService;
import school.sptech.service.excel.DesempenhoEquipeExcelService;
import school.sptech.service.s3.S3Service;

import java.io.InputStream;
import java.util.List;

public class DesempenhoEquipeCargaService {
    @Autowired
    private S3Service s3Service;
    @Autowired
    private DesempenhoEquipeExcelService desempenhoEquipeExcelService;
    @Autowired
    private DesempenhoEquipeRepository desempenhoEquipeRepository;
    @Autowired
    private LogService logService;

    public void executar(String bucket, String nomeArquivo) {
        int linhasLidas = 0;
        int linhasInseridas = 0;

        try {
            InputStream stream = s3Service.baixarArquivo(bucket, nomeArquivo);

            List<DesempenhoEquipe> desempenhoEquipes =
                    desempenhoEquipeExcelService.lerDesempenhoEquipe(stream);
            linhasLidas = desempenhoEquipes.size();

            for (DesempenhoEquipe desempenhoEquipe : desempenhoEquipes) {
                desempenhoEquipeRepository.inserir(desempenhoEquipe);
                linhasInseridas++;
            }

            logService.registrarSucesso(nomeArquivo, linhasLidas, linhasInseridas);
        } catch (Exception e) {
            logService.registrarErro(nomeArquivo, e.getMessage(), linhasLidas);
        }
    }
}
