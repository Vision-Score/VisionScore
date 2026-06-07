package br.com.importer.service;

import org.springframework.jdbc.core.JdbcTemplate;

import java.util.LinkedHashMap;
import java.util.Map;

public class ViewsBancoDadosService {

    private final JdbcTemplate jdbcTemplate;

    public ViewsBancoDadosService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public void criarViews() {
        System.out.println("\n[ViewsBancoDadosService] Criando views...");

        Map<String, String> views = new LinkedHashMap<>();

        views.put("vw_elenco_atual", """
                CREATE OR REPLACE VIEW vw_elenco_atual AS
                SELECT\s
                    j.idJogador,
                    j.nome,
                    j.funcao,
                    dj.fkEquipe
                FROM desempenho_jogador dj
                JOIN jogador j ON j.idJogador = dj.fkJogador
                JOIN (
                    SELECT fkEquipe, MAX(fkJogo) AS ultimoJogo
                    FROM desempenho_jogador
                    GROUP BY fkEquipe
                ) ult ON ult.fkEquipe = dj.fkEquipe AND ult.ultimoJogo = dj.fkJogo
                """);

        views.put("vw_power_pick", """
                CREATE OR REPLACE VIEW vw_power_pick AS
                SELECT\s
                    fkJogador,
                    fkEquipe,
                    nomeCampeao AS powerPick,
                    COUNT(*) AS vezesJogado
                FROM desempenho_jogador
                GROUP BY fkJogador, fkEquipe, nomeCampeao
                ORDER BY fkJogador, fkEquipe, vezesJogado DESC
                """);

        views.put("vw_stats_elenco_atual", """
                CREATE OR REPLACE VIEW vw_stats_elenco_atual AS
                SELECT\s
                    j.idJogador,
                    j.nome,
                    j.funcao,
                    dj.fkEquipe,
                    ROUND(AVG(dj.eliminacaoCampeao), 1)                                                                        AS mediaElims,
                    ROUND(AVG(dj.qtdMortes), 1)                                                                                AS mediaMortes,
                    ROUND(AVG(dj.qtdAssistencias), 1)                                                                          AS mediaAssists,
                    ROUND(AVG(dj.totalDanoCausadoCampeaoInimigo), 0)                                                           AS mediaDano,
                    ROUND(AVG(dj.qtdOuroObtido), 0)                                                                            AS mediaOuro,
                    ROUND(AVG(dj.totalTropasAbatidas), 1)                                                                      AS mediaCS,
                    ROUND(AVG(dj.qtdSentinelasPosicionadas), 1)                                                                AS mediaWards,
                    ROUND(AVG((dj.eliminacaoCampeao + dj.qtdAssistencias) / NULLIF(de.totalEliminacoes, 0) * 100), 1)         AS mediaKP,
                    pp.powerPick,
                    ij.urlImagem                                                                                               AS urlFotoJogador
                FROM desempenho_jogador dj
                JOIN jogador j ON j.idJogador = dj.fkJogador
                JOIN desempenho_equipe de ON de.fkJogo = dj.fkJogo AND de.fkEquipe = dj.fkEquipe
                LEFT JOIN imagem_jogador ij ON ij.nomeJogador = j.nome
                JOIN (
                    SELECT fkJogador, fkEquipe, MIN(powerPick) AS powerPick
                    FROM vw_power_pick vp1
                    WHERE vezesJogado = (
                        SELECT MAX(vezesJogado)\s
                        FROM vw_power_pick vp2
                        WHERE vp2.fkJogador = vp1.fkJogador\s
                        AND vp2.fkEquipe = vp1.fkEquipe
                    )
                    GROUP BY fkJogador, fkEquipe
                ) pp ON pp.fkJogador = j.idJogador AND pp.fkEquipe = dj.fkEquipe
                WHERE j.idJogador IN (
                    SELECT idJogador FROM vw_elenco_atual WHERE fkEquipe = dj.fkEquipe
                )
                GROUP BY j.idJogador, j.nome, j.funcao, dj.fkEquipe, pp.powerPick, ij.urlImagem
                """);

        views.put("vw_medias_por_role", """
                CREATE OR REPLACE VIEW vw_medias_por_role AS
                SELECT
                    j.funcao,
                    ROUND(AVG(dj.eliminacaoCampeao), 2)                                                                        AS mediaElims,
                    ROUND(AVG(dj.qtdMortes), 2)                                                                                AS mediaMortes,
                    ROUND(AVG(dj.qtdAssistencias), 2)                                                                          AS mediaAssists,
                    ROUND(AVG(dj.totalDanoCausadoCampeaoInimigo), 0)                                                           AS mediaDano,
                    ROUND(AVG(dj.totalTropasAbatidas), 1)                                                                      AS mediaCS,
                    ROUND(AVG(dj.qtdOuroObtido), 0)                                                                            AS mediaOuro,
                    ROUND(AVG(dj.nivelJogador), 1)                                                                             AS mediaNivel,
                    ROUND(AVG(dj.totalDanoRecebido), 0)                                                                        AS mediaDanoRecebido,
                    ROUND(AVG(dj.qtdSentinelasPosicionadas), 1)                                                                AS mediaWards,
                    ROUND(AVG(dj.eliminacoesConsecutivas), 2)                                                                  AS mediaElimConsec,
                    ROUND(AVG(dj.eliminacoesMultiplas), 2)                                                                     AS mediaElimMultiplas,
                    ROUND(AVG((dj.eliminacaoCampeao + dj.qtdAssistencias) / NULLIF(de.totalEliminacoes, 0) * 100), 1)         AS mediaKP,
                    COUNT(*)                                                                                                    AS totalPartidas
                FROM desempenho_jogador dj
                JOIN jogador j ON j.idJogador = dj.fkJogador
                JOIN desempenho_equipe de ON de.fkJogo = dj.fkJogo AND de.fkEquipe = dj.fkEquipe
                GROUP BY j.funcao
                """);

        views.put("vw_destaque_ultimo_confronto", """
                CREATE OR REPLACE VIEW vw_destaque_ultimo_confronto AS
                SELECT
                    j.idJogador,
                    j.nome,
                    j.funcao,
                    dj.fkEquipe,
                    dj.eliminacaoCampeao                                                                AS kills,
                    dj.qtdMortes                                                                        AS mortes,
                    dj.qtdAssistencias                                                                  AS assists,
                    dj.totalDanoCausadoCampeaoInimigo                                                   AS dano,
                    dj.qtdOuroObtido                                                                    AS ouro,
                    dj.nomeCampeao,
                    ROUND((dj.eliminacaoCampeao + dj.qtdAssistencias) / NULLIF(dj.qtdMortes, 0), 2)   AS kda,
                    e2.nome                                                                             AS adversario,
                    eAtual.nome                                                                         AS nomeEquipe,
                    g.dtJogo,
                    CASE WHEN g.fkEquipeVencedora = dj.fkEquipe THEN 'Vitória' ELSE 'Derrota' END      AS resultado,
                    ij.urlImagem                                                                        AS urlFotoJogador
                FROM desempenho_jogador dj
                JOIN jogador j ON j.idJogador = dj.fkJogador
                JOIN jogo g ON g.idJogo = dj.fkJogo
                JOIN desempenho_equipe de2 ON de2.fkJogo = g.idJogo AND de2.fkEquipe != dj.fkEquipe
                JOIN equipe e2 ON e2.id_equipe = de2.fkEquipe
                JOIN equipe eAtual ON eAtual.id_equipe = dj.fkEquipe
                LEFT JOIN imagem_jogador ij ON ij.nomeJogador = j.nome
                WHERE dj.fkJogo = (
                    SELECT MAX(fkJogo) FROM desempenho_jogador WHERE fkEquipe = dj.fkEquipe
                )
                ORDER BY kda DESC
                """);

        views.put("vw_medias_gerais", """
                CREATE OR REPLACE VIEW vw_medias_gerais AS
                SELECT
                    ROUND(AVG(stats.total_dano / NULLIF(stats.total_ouro, 0)), 4) AS media_dano_por_gold,
                    ROUND(SUM(CASE WHEN j.fkEquipeVencedora = stats.fkEquipe THEN 1 ELSE 0 END) / COUNT(*) * 100, 1) AS media_winrate,
                    ROUND(AVG(de.totalDragoesAbatidos + de.totalBaroesAbatidos + de.totalArautosAbatidos), 2) AS media_objetivos,
                    ROUND(AVG(stats.total_wards / NULLIF(j.duracaoSegundos / 60.0, 0)), 4) AS media_visao_por_minuto,
                    ROUND(SUM(CASE WHEN (de.totalDragoesAbatidos + de.totalBaroesAbatidos + de.totalArautosAbatidos) > 3
                                AND j.fkEquipeVencedora = stats.fkEquipe THEN 1 ELSE 0 END)
                        / NULLIF(SUM(CASE WHEN (de.totalDragoesAbatidos + de.totalBaroesAbatidos + de.totalArautosAbatidos) > 3
                                            THEN 1 ELSE 0 END), 0) * 100, 1) AS media_conversao_objetivos
                FROM (
                    SELECT fkJogo, fkEquipe,
                        SUM(totalDanoCausadoCampeaoInimigo) AS total_dano,
                        SUM(qtdOuroObtido) AS total_ouro,
                        SUM(qtdSentinelasPosicionadas) AS total_wards
                    FROM desempenho_jogador
                    GROUP BY fkJogo, fkEquipe
                ) AS stats
                JOIN desempenho_equipe de ON de.fkJogo = stats.fkJogo AND de.fkEquipe = stats.fkEquipe
                JOIN jogo j ON j.idJogo = stats.fkJogo
                """);

        views.put("vw_media_first_blood", """
                CREATE OR REPLACE VIEW vw_media_first_blood AS
                SELECT
                    ROUND(COUNT(DISTINCT fb.fkJogo) / COUNT(DISTINCT j.idJogo) * 100, 1) AS media_first_blood_rate
                FROM jogo j
                LEFT JOIN (
                    SELECT fkJogo, MIN(tempoEventoSegundos) AS primeiro_kill
                    FROM evento
                    WHERE tipoEvento = 'player_kill'
                    GROUP BY fkJogo
                ) fb ON fb.fkJogo = j.idJogo;
                """);

        views.put("vw_kpis_por_equipe", """CREATE OR REPLACE VIEW vw_kpis_por_equipe AS
                SELECT
                    stats.fkEquipe,
                    ROUND(AVG(stats.total_dano / NULLIF(stats.total_ouro, 0)), 4) AS dano_por_gold,
                    ROUND(SUM(CASE WHEN j.fkEquipeVencedora = stats.fkEquipe THEN 1 ELSE 0 END) / COUNT(*) * 100, 1) AS winrate,
                    ROUND(AVG(de.totalDragoesAbatidos + de.totalBaroesAbatidos + de.totalArautosAbatidos), 2) AS objetivos,
                    ROUND(AVG(stats.total_wards / NULLIF(j.duracaoSegundos / 60.0, 0)), 4) AS visao_por_minuto,
                    ROUND(SUM(CASE WHEN (de.totalDragoesAbatidos + de.totalBaroesAbatidos + de.totalArautosAbatidos) > 3
                                AND j.fkEquipeVencedora = stats.fkEquipe THEN 1 ELSE 0 END)
                        / NULLIF(SUM(CASE WHEN (de.totalDragoesAbatidos + de.totalBaroesAbatidos + de.totalArautosAbatidos) > 3
                                            THEN 1 ELSE 0 END), 0) * 100, 1) AS conversao_objetivos,
                    ROUND(SUM(CASE WHEN fb.fkEquipe = stats.fkEquipe THEN 1 ELSE 0 END) / COUNT(*) * 100, 1) AS first_blood_rate
                FROM (
                    SELECT fkJogo, fkEquipe,
                        SUM(totalDanoCausadoCampeaoInimigo) AS total_dano,
                        SUM(qtdOuroObtido) AS total_ouro,
                        SUM(qtdSentinelasPosicionadas) AS total_wards
                    FROM desempenho_jogador
                    GROUP BY fkJogo, fkEquipe
                ) AS stats
                JOIN desempenho_equipe de ON de.fkJogo = stats.fkJogo AND de.fkEquipe = stats.fkEquipe
                JOIN jogo j ON j.idJogo = stats.fkJogo
                LEFT JOIN (
                    SELECT e.fkJogo, dj.fkEquipe
                    FROM evento e
                    JOIN (
                        SELECT fkJogo, MIN(tempoEventoSegundos) AS primeiro_kill
                        FROM evento
                        WHERE tipoEvento = 'player_kill'
                        GROUP BY fkJogo
                    ) primeiro ON primeiro.fkJogo = e.fkJogo AND primeiro.primeiro_kill = e.tempoEventoSegundos
                    JOIN desempenho_jogador dj ON dj.fkJogador = e.fkMatador AND dj.fkJogo = e.fkJogo
                    WHERE e.tipoEvento = 'player_kill'
                ) fb ON fb.fkJogo = stats.fkJogo
                GROUP BY stats.fkEquipe;
            """);
        

        for (Map.Entry<String, String> entry : views.entrySet()) {
            String nomeView = entry.getKey();
            String sql = entry.getValue();
            try {
                jdbcTemplate.execute(sql);
                System.out.println("[ViewsBancoDadosService] " + nomeView + " ✓");
            } catch (Exception e) {
                System.err.println("[ViewsBancoDadosService] Falha ao criar " + nomeView + ": " + e.getMessage());
                throw e;
            }
        }

        System.out.println("[ViewsBancoDadosService] Todas as views criadas ✓");
    }
}
