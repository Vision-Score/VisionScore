package school.sptech.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import school.sptech.model.Log;
import school.sptech.repository.LogRepository;

@Service
public class LogService {

    @Autowired
    private LogRepository logRepository;

    public void registrarSucesso(String arquivo, Integer linhasLidas, Integer linhasInseridas) {
        Log log = new Log();
        log.setArquivo(arquivo);
        log.setStatus("SUCESSO");
        log.setMensagem("Carga realizada com sucesso");
        log.setLinhasLidas(linhasLidas);
        log.setLinhasInseridas(linhasInseridas);

        logRepository.inserir(log);
    }

    public void registrarErro(String arquivo, String mensagemErro, Integer linhasLidas) {
        Log log = new Log();
        log.setArquivo(arquivo);
        log.setStatus("ERRO");
        log.setMensagem(mensagemErro);
        log.setLinhasLidas(linhasLidas);

        logRepository.inserir(log);
    }
}
