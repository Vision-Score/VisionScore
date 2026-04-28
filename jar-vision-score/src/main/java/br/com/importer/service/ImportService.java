package br.com.importer.service;

import br.com.importer.repository.*;
import br.com.importer.util.EnvLoader;
import software.amazon.awssdk.core.ResponseInputStream;
import software.amazon.awssdk.services.s3.model.GetObjectResponse;

import java.util.*;

import static br.com.importer.service.ExcelParserService.*;

/**
 * Orquestra o processo de importação: baixa cada XLSX do S3,
 * lê as linhas em modo streaming e persiste no banco MySQL na ordem
 * correta para respeitar as chaves estrangeiras.
 *
 * Ordem de processamento:
 *   1. game_metadata.xlsx      → liga, torneio, series, confronto, jogo
 *   2. game_players_stats.xlsx → equipe, jogador, desempenhoEquipe, desempenhoJogador
 *   3. game_events.xlsx        → evento, eventoAssistente
 */
public class ImportService {

    // Identificadores dos arquivos esperados no S3
    private static final String FILE_METADATA     = "game_metadata";
    private static final String FILE_PLAYERS_STATS = "game_players_stats";
    private static final String FILE_EVENTS        = "game_events";

    private final S3Service                  s3Service;
    private final ExcelParserService         parser;
    private final LigaRepository             ligaRepo;
    private final TorneioRepository          torneioRepo;
    private final SeriesRepository           seriesRepo;
    private final ConfrontoRepository        confrontoRepo;
    private final JogoRepository             jogoRepo;
    private final EquipeRepository           equipeRepo;
    private final JogadorRepository          jogadorRepo;
    private final DesempenhoEquipeRepository desempenhoEquipeRepo;
    private final DesempenhoJogadorRepository desempenhoJogadorRepo;
    private final EventoRepository           eventoRepo;
    private final LogRepository              logRepo;

    private final int  batchSize;
    private final long maxLinhas; // 0 = sem limite; > 0 = modo de teste

    public ImportService(S3Service s3Service,
                         ExcelParserService parser,
                         LigaRepository ligaRepo,
                         TorneioRepository torneioRepo,
                         SeriesRepository seriesRepo,
                         ConfrontoRepository confrontoRepo,
                         JogoRepository jogoRepo,
                         EquipeRepository equipeRepo,
                         JogadorRepository jogadorRepo,
                         DesempenhoEquipeRepository desempenhoEquipeRepo,
                         DesempenhoJogadorRepository desempenhoJogadorRepo,
                         EventoRepository eventoRepo,
                         LogRepository logRepo) {
        this.s3Service             = s3Service;
        this.parser                = parser;
        this.ligaRepo              = ligaRepo;
        this.torneioRepo           = torneioRepo;
        this.seriesRepo            = seriesRepo;
        this.confrontoRepo         = confrontoRepo;
        this.jogoRepo              = jogoRepo;
        this.equipeRepo            = equipeRepo;
        this.jogadorRepo           = jogadorRepo;
        this.desempenhoEquipeRepo  = desempenhoEquipeRepo;
        this.desempenhoJogadorRepo = desempenhoJogadorRepo;
        this.eventoRepo            = eventoRepo;
        this.logRepo               = logRepo;
        this.batchSize  = EnvLoader.getInt("BATCH_SIZE", 500);
        this.maxLinhas  = EnvLoader.getInt("MAX_LINHAS_TESTE", 0);
        if (this.maxLinhas > 0) {
            System.out.println("[ImportService] ⚠ MODO TESTE: processando apenas " + maxLinhas + " linhas por arquivo.");
        }
    }

    // =========================================================================
    //  Ponto de entrada
    // =========================================================================

    public void executar() {
        List<String> arquivos = s3Service.listarArquivosXlsx();

        if (arquivos.isEmpty()) {
            System.out.println("[ImportService] Nenhum arquivo .xlsx encontrado no bucket.");
            return;
        }

        // Ordena para garantir a ordem correta de processamento independente do S3
        arquivos.sort(Comparator.comparingInt(this::prioridadeArquivo));

        for (String key : arquivos) {
            processarArquivo(key);
        }

        System.out.println("\n[ImportService] ✓ Importação concluída!");
    }

    // =========================================================================
    //  Roteador de arquivos
    // =========================================================================

    private void processarArquivo(String key) {
        String nomeArquivo = key.contains("/") ? key.substring(key.lastIndexOf('/') + 1) : key;
        System.out.println("\n[ImportService] ━━━ Processando: " + nomeArquivo + " ━━━");

        try (ResponseInputStream<GetObjectResponse> stream = s3Service.download(key)) {

            if (nomeArquivo.contains(FILE_METADATA)) {
                processarMetadata(nomeArquivo, stream);
            } else if (nomeArquivo.contains(FILE_PLAYERS_STATS)) {
                processarPlayersStats(nomeArquivo, stream);
            } else if (nomeArquivo.contains(FILE_EVENTS)) {
                processarEvents(nomeArquivo, stream);
            } else {
                System.out.println("[ImportService] Arquivo ignorado (nome não reconhecido): " + nomeArquivo);
            }

        } catch (Exception e) {
            System.err.println("[ImportService] ERRO ao processar " + nomeArquivo + ": " + e.getMessage());
            logRepo.inserir(nomeArquivo, "FALHA", e.getMessage(), 0, 0);
        }
    }

    private int prioridadeArquivo(String key) {
        if (key.contains(FILE_METADATA))      return 1;
        if (key.contains(FILE_PLAYERS_STATS)) return 2;
        if (key.contains(FILE_EVENTS))        return 3;
        return 99;
    }

    // =========================================================================
    //  1. game_metadata.xlsx → liga, torneio, series, confronto, jogo
    // =========================================================================

    private void processarMetadata(String nomeArquivo, java.io.InputStream stream) {
        // Conjuntos para deduplicação em memória
        Set<Integer> ligasVistas       = new HashSet<>();
        Set<Integer> torneiosVistos    = new HashSet<>();
        Set<Integer> seriesVistas      = new HashSet<>();
        Set<Integer> confrontosVistos  = new HashSet<>();

        List<Object[]> batchLiga      = new ArrayList<>();
        List<Object[]> batchTorneio   = new ArrayList<>();
        List<Object[]> batchSeries    = new ArrayList<>();
        List<Object[]> batchConfronto = new ArrayList<>();
        List<Object[]> batchJogo      = new ArrayList<>();

        long[] contador = {0, 0}; // [lidas, inseridas]

        long linhasLidas = parser.processar(stream, row -> {
            contador[0]++;

            Integer ligaId      = toInt(row.get("league_id"));
            String  ligaNome    = row.get("league_name");
            Integer tornId      = toInt(row.get("tournament_id"));
            String  tornNome    = row.get("tournament_name");
            Integer seriesId    = toInt(row.get("series_id"));
            String  seriesNome  = row.get("series_name");
            Integer matchId     = toInt(row.get("match_id"));
            Integer gameId      = toInt(row.get("game_id"));
            String  dtJogo      = toDateTime(row.get("date"));

            // Acumula entidades únicas
            if (ligaId != null && ligasVistas.add(ligaId))
                batchLiga.add(new Object[]{ligaId, ligaNome});

            if (tornId != null && torneiosVistos.add(tornId))
                batchTorneio.add(new Object[]{tornId, tornNome, ligaId});

            if (seriesId != null && seriesVistas.add(seriesId))
                batchSeries.add(new Object[]{seriesId, seriesNome, tornId});

            if (matchId != null && confrontosVistos.add(matchId))
                batchConfronto.add(new Object[]{matchId});

            if (gameId != null)
                batchJogo.add(new Object[]{gameId, dtJogo, matchId, seriesId});

            // Envia quando atingir o batchSize
            flushSe(batchLiga,      batchSize, () -> ligaRepo.insertBatch(batchLiga));
            flushSe(batchTorneio,   batchSize, () -> torneioRepo.insertBatch(batchTorneio));
            flushSe(batchSeries,    batchSize, () -> seriesRepo.insertBatch(batchSeries));
            flushSe(batchConfronto, batchSize, () -> confrontoRepo.insertBatch(batchConfronto));
            flushSe(batchJogo,      batchSize, () -> jogoRepo.insertBatch(batchJogo));

            if (contador[0] % 10000 == 0)
                System.out.printf("[ImportService] metadata → %,d linhas processadas%n", contador[0]);
        }, maxLinhas);

        // Flush final dos lotes restantes
        flush(batchLiga,      () -> ligaRepo.insertBatch(batchLiga));
        flush(batchTorneio,   () -> torneioRepo.insertBatch(batchTorneio));
        flush(batchSeries,    () -> seriesRepo.insertBatch(batchSeries));
        flush(batchConfronto, () -> confrontoRepo.insertBatch(batchConfronto));
        flush(batchJogo,      () -> jogoRepo.insertBatch(batchJogo));

        System.out.printf("[ImportService] metadata ✓ → %,d linhas lidas | ligas=%d, torneios=%d, series=%d, confrontos=%d, jogos=%d%n",
                linhasLidas, ligasVistas.size(), torneiosVistos.size(),
                seriesVistas.size(), confrontosVistos.size(), linhasLidas);

        logRepo.inserir(nomeArquivo, "SUCESSO",
                String.format("ligas=%d, torneios=%d, series=%d, confrontos=%d, jogos=%d",
                        ligasVistas.size(), torneiosVistos.size(),
                        seriesVistas.size(), confrontosVistos.size(), linhasLidas),
                (int) linhasLidas, (int) linhasLidas);
    }

    // =========================================================================
    //  2. game_players_stats.xlsx → equipe, jogador, desempenhoEquipe, desempenhoJogador
    // =========================================================================

    private void processarPlayersStats(String nomeArquivo, java.io.InputStream stream) {
        Set<Integer> equipesVistas    = new HashSet<>();
        Set<Integer> jogadoresVistos  = new HashSet<>();
        Set<String>  desempEquipeVist = new HashSet<>(); // "gameId_teamId"

        List<Object[]> batchEquipe          = new ArrayList<>();
        List<Object[]> batchJogador         = new ArrayList<>();
        List<Object[]> batchDesempEquipe    = new ArrayList<>();
        List<Object[]> batchDesempJogador   = new ArrayList<>();

        long[] contador = {0};

        long linhasLidas = parser.processar(stream, row -> {
            contador[0]++;

            Integer gameId      = toInt(row.get("game_id"));
            Integer playerId    = toInt(row.get("player_id"));
            String  playerNome  = row.get("player_name");
            Integer teamId      = toInt(row.get("team_id"));
            String  teamNome    = row.get("team_name");
            String  teamSigla   = row.get("team_acronym");
            String  role        = row.get("role");
            byte    win         = toBooleanTinyInt(row.get("win"));
            String  campNome    = row.get("champion_name");

            // Stats de equipe (repetidos para cada jogador → deduplicar)
            int teamKills      = toIntOrZero(row.get("team_kills"));
            int towerKills     = toIntOrZero(row.get("tower_kills"));
            int inhibKills     = toIntOrZero(row.get("inhibitor_kills"));
            int dragonKills    = toIntOrZero(row.get("dragon_kills"));
            int heraldKills    = toIntOrZero(row.get("herald_kills"));
            int baronKills     = toIntOrZero(row.get("baron_kills"));

            // Stats individuais do jogador
            int playerKills    = toIntOrZero(row.get("player_kills"));
            int playerDeaths   = toIntOrZero(row.get("player_deaths"));
            int playerAssists  = toIntOrZero(row.get("player_assists"));
            int minions        = toIntOrZero(row.get("total_minions_killed"));
            int gold           = toIntOrZero(row.get("gold_earned"));
            int level          = toIntOrZero(row.get("level"));
            int totalDmg       = toIntOrZero(row.get("total_damage_dealt"));
            int dmgChamps      = toIntOrZero(row.get("total_damage_dealt_to_champions"));
            int dmgTaken       = toIntOrZero(row.get("total_damage_taken"));
            int wards          = toIntOrZero(row.get("wards_placed"));
            int killSpree      = toIntOrZero(row.get("largest_killing_spree"));
            int multiKill      = toIntOrZero(row.get("largest_multi_kill"));

            // Equipe
            if (teamId != null && equipesVistas.add(teamId))
                batchEquipe.add(new Object[]{teamId, teamNome, teamSigla});

            // Jogador
            if (playerId != null && jogadoresVistos.add(playerId))
                batchJogador.add(new Object[]{playerId, playerNome, role});

            // Desempenho da equipe (uma vez por jogo+equipe)
            String chaveEquipeJogo = gameId + "_" + teamId;
            if (gameId != null && teamId != null && desempEquipeVist.add(chaveEquipeJogo)) {
                batchDesempEquipe.add(new Object[]{
                    teamKills, towerKills, inhibKills, dragonKills, heraldKills, baronKills,
                    teamId, gameId
                });
            }

            // Desempenho do jogador (sempre insere, um por jogador por jogo)
            if (gameId != null && playerId != null) {
                batchDesempJogador.add(new Object[]{
                    win, campNome, playerKills, playerDeaths, playerAssists,
                    minions, gold, level, totalDmg, dmgChamps, dmgTaken,
                    wards, killSpree, multiKill,
                    gameId, playerId, teamId
                });
            }

            flushSe(batchEquipe,        batchSize, () -> equipeRepo.insertBatch(batchEquipe));
            flushSe(batchJogador,       batchSize, () -> jogadorRepo.insertBatch(batchJogador));
            flushSe(batchDesempEquipe,  batchSize, () -> desempenhoEquipeRepo.insertBatch(batchDesempEquipe));
            flushSe(batchDesempJogador, batchSize, () -> desempenhoJogadorRepo.insertBatch(batchDesempJogador));

            if (contador[0] % 50000 == 0)
                System.out.printf("[ImportService] players_stats → %,d linhas processadas%n", contador[0]);
        }, maxLinhas);

        flush(batchEquipe,        () -> equipeRepo.insertBatch(batchEquipe));
        flush(batchJogador,       () -> jogadorRepo.insertBatch(batchJogador));
        flush(batchDesempEquipe,  () -> desempenhoEquipeRepo.insertBatch(batchDesempEquipe));
        flush(batchDesempJogador, () -> desempenhoJogadorRepo.insertBatch(batchDesempJogador));

        System.out.printf("[ImportService] players_stats ✓ → %,d linhas lidas | equipes=%d, jogadores=%d%n",
                linhasLidas, equipesVistas.size(), jogadoresVistos.size());

        logRepo.inserir(nomeArquivo, "SUCESSO",
                String.format("equipes=%d, jogadores=%d, desempEquipe=%d, desempJogador=%d",
                        equipesVistas.size(), jogadoresVistos.size(),
                        desempEquipeVist.size(), linhasLidas),
                (int) linhasLidas, (int) linhasLidas);
    }

    // =========================================================================
    //  3. game_events.xlsx → evento, eventoAssistente
    // =========================================================================

    private void processarEvents(String nomeArquivo, java.io.InputStream stream) {
        List<Object[]> batchEvento     = new ArrayList<>();
        List<Object[]> batchAssistente = new ArrayList<>();
        long[] contador = {0, 0}; // [eventos, assistentes]

        long linhasLidas = parser.processar(stream, row -> {
            Integer eventoId  = toInt(row.get("id"));
            Integer gameId    = toInt(row.get("game_id"));
            Integer tempo     = toIntOrNull(row.get("timestamp"));
            String  tipo      = row.get("event_type");
            Integer killerId  = toInt(row.get("killer_id"));   // pode ser null
            Integer killedId  = toInt(row.get("killed_id"));   // pode ser null
            String  drakeType = row.get("drake_type");
            String  assists   = row.get("assisting_player_ids");

            if (eventoId == null || gameId == null) return;

            // Normaliza campos opcionais
            if (drakeType != null && drakeType.isBlank()) drakeType = null;

            batchEvento.add(new Object[]{
                eventoId, tempo, tipo, drakeType, gameId, killerId, killedId
            });
            contador[0]++;

            // Assistentes (pode ser [] ou [23] ou [29, 22])
            List<Integer> assistIds = toPlayerIdList(assists);
            for (Integer aid : assistIds) {
                batchAssistente.add(new Object[]{eventoId, aid});
                contador[1]++;
            }

            flushSe(batchEvento,     batchSize, () -> eventoRepo.insertBatch(batchEvento));
            flushSe(batchAssistente, batchSize, () -> eventoRepo.insertAssistentesBatch(batchAssistente));

            if (contador[0] % 100000 == 0)
                System.out.printf("[ImportService] events → %,d eventos processados%n", contador[0]);
        }, maxLinhas);

        flush(batchEvento,     () -> eventoRepo.insertBatch(batchEvento));
        flush(batchAssistente, () -> eventoRepo.insertAssistentesBatch(batchAssistente));

        System.out.printf("[ImportService] events ✓ → %,d linhas lidas | eventos=%d, assistentes=%d%n",
                linhasLidas, contador[0], contador[1]);

        logRepo.inserir(nomeArquivo, "SUCESSO",
                String.format("eventos=%d, assistentes=%d", contador[0], contador[1]),
                (int) linhasLidas, (int) contador[0]);
    }

    // =========================================================================
    //  Utilitários de batch
    // =========================================================================

    /**
     * Envia o lote se atingiu o tamanho configurado e limpa a lista.
     */
    private void flushSe(List<Object[]> lote, int tamanho, Runnable acao) {
        if (lote.size() >= tamanho) {
            acao.run();
            lote.clear();
        }
    }

    /**
     * Envia o lote se não estiver vazio e limpa a lista.
     */
    private void flush(List<Object[]> lote, Runnable acao) {
        if (!lote.isEmpty()) {
            acao.run();
            lote.clear();
        }
    }

    private static Integer toIntOrNull(String valor) {
        return toInt(valor);
    }
}
