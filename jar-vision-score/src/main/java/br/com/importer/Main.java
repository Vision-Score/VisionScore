package br.com.importer;

import br.com.importer.config.DatabaseConfig;
import br.com.importer.config.S3Provider;
import br.com.importer.repository.*;
import br.com.importer.service.ExcelParserService;
import br.com.importer.service.ImportService;
import br.com.importer.service.S3Service;
import br.com.importer.util.EnvLoader;
import org.springframework.jdbc.core.JdbcTemplate;
import software.amazon.awssdk.services.s3.S3Client;

/**
 * Ponto de entrada da aplicação.
 *
 * Como executar:
 *   java -jar s3-xlsx-importer-1.0.0.jar
 *
 * O arquivo .env deve estar na mesma pasta que o JAR.
 */
public class Main {

    public static void main(String[] args) {
        System.out.println("╔══════════════════════════════════════════╗");
        System.out.println("║       S3 → XLSX → MySQL Importer        ║");
        System.out.println("╚══════════════════════════════════════════╝");

        // 1. Carrega variáveis do arquivo .env
        EnvLoader.load();

        // 2. Inicializa clientes
        System.out.println("\n[Main] Conectando ao banco de dados...");
        JdbcTemplate jdbcTemplate = new DatabaseConfig().getJdbcTemplate();
        jdbcTemplate.execute("SET FOREIGN_KEY_CHECKS = 0");

        System.out.println("[Main] Conectando ao Amazon S3...");
        S3Client s3Client = new S3Provider().getS3Client();

        // 3. Instancia repositórios
        LigaRepository             ligaRepo              = new LigaRepository(jdbcTemplate);
        TorneioRepository          torneioRepo           = new TorneioRepository(jdbcTemplate);
        SeriesRepository           seriesRepo            = new SeriesRepository(jdbcTemplate);
        ConfrontoRepository        confrontoRepo         = new ConfrontoRepository(jdbcTemplate);
        JogoRepository             jogoRepo              = new JogoRepository(jdbcTemplate);
        EquipeRepository           equipeRepo            = new EquipeRepository(jdbcTemplate);
        JogadorRepository          jogadorRepo           = new JogadorRepository(jdbcTemplate);
        DesempenhoEquipeRepository desempenhoEquipeRepo  = new DesempenhoEquipeRepository(jdbcTemplate);
        DesempenhoJogadorRepository desempenhoJogadorRepo = new DesempenhoJogadorRepository(jdbcTemplate);
        EventoRepository           eventoRepo            = new EventoRepository(jdbcTemplate);
        LogRepository              logRepo               = new LogRepository(jdbcTemplate);

        // 4. Instancia serviços
        S3Service           s3Service = new S3Service(s3Client);
        ExcelParserService  parser    = new ExcelParserService();

        ImportService importService = new ImportService(
            s3Service, parser,
            ligaRepo, torneioRepo, seriesRepo, confrontoRepo, jogoRepo,
            equipeRepo, jogadorRepo,
            desempenhoEquipeRepo, desempenhoJogadorRepo,
            eventoRepo, logRepo
        );

        // 5. Executa a importação
        long inicio = System.currentTimeMillis();
        try {
            importService.executar();
            long fim = System.currentTimeMillis();
            System.out.printf("%n[Main] ✓ Importação finalizada em %.1f segundos.%n",
                    (fim - inicio) / 1000.0);
            jdbcTemplate.execute("SET FOREIGN_KEY_CHECKS = 1");
        } catch (Exception e) {
            System.err.println("[Main] ✗ Erro durante a importação: " + e.getMessage());
            e.printStackTrace();
            System.exit(1);
        } finally {
            s3Client.close();
        }
    }
}
