package school.sptech.service.carga;

import org.springframework.beans.factory.annotation.Autowired;
import school.sptech.model.Equipe;
import school.sptech.repository.EquipeRepository;
import school.sptech.service.LogService;
import school.sptech.service.excel.EquipeExcelService;
import school.sptech.service.s3.S3Service;

import java.io.InputStream;
import java.util.List;

public class EquipeCargaService {
    @Autowired
    private S3Service s3Service;
    @Autowired
    private EquipeExcelService equipeExcelService;
    @Autowired
    private EquipeRepository equipeRepository;
    @Autowired
    private LogService logService;

    public void executar(String bucket, String nomeArquivo) {
        int linhasLidas = 0;
        int linhasInseridas = 0;

        try {
            InputStream stream = s3Service.baixarArquivo(bucket, nomeArquivo);

            List<Equipe> equipes = equipeExcelService.lerEquipe(stream);
            linhasLidas = equipes.size();

            for (Equipe equipe : equipes) {
                equipeRepository.inserir(equipe);
                linhasInseridas++;
            }

            logService.registrarSucesso(nomeArquivo, linhasLidas, linhasInseridas);
        } catch (Exception e) {
            logService.registrarErro(nomeArquivo, e.getMessage(), linhasLidas);
        }
    }
}
