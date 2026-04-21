package school.sptech.service.carga;

import org.springframework.beans.factory.annotation.Autowired;
import school.sptech.model.Jogador;
import school.sptech.repository.JogadorRepository;
import school.sptech.service.LogService;
import school.sptech.service.excel.JogadorExcelService;
import school.sptech.service.s3.S3Service;

import java.io.InputStream;
import java.util.List;

public class JogadorCargaService {
    @Autowired
    private S3Service s3Service;
    @Autowired
    private JogadorExcelService jogadorExcelService;
    @Autowired
    private JogadorRepository jogadorRepository;
    @Autowired
    private LogService logService;

    public void executar(String bucket, String nomeArquivo) {
        int linhasLidas = 0;
        int linhasInseridas = 0;

        try {
            InputStream stream = s3Service.baixarArquivo(bucket, nomeArquivo);

            List<Jogador> jogadores = jogadorExcelService.lerJogador(stream);
            linhasLidas = jogadores.size();

            for (Jogador jogador : jogadores) {
                jogadorRepository.inserir(jogador);
                linhasInseridas++;
            }

            logService.registrarSucesso(nomeArquivo, linhasLidas, linhasInseridas);
        } catch (Exception e) {
            logService.registrarErro(nomeArquivo, e.getMessage(), linhasLidas);
        }
    }
}
