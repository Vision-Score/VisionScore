package br.com.importer.service;

import br.com.importer.util.EnvLoader;
import org.springframework.jdbc.core.JdbcTemplate;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;

/**
 * Sincroniza imagens de jogadores e equipes do PandaScore
 * e persiste nas tabelas imagem_jogador e imagem_equipe.
 */
public class ImagemService {

    private static final String BASE_URL   = "https://api.pandascore.co";
    private static final int    PAGE_SIZE  = 100;

    private final JdbcTemplate jdbcTemplate;
    private final String       token;

    public ImagemService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
        this.token        = "7bfgUWCabLmRaeG93MRjn8hasq0lpq2W8ht2LxAugmP1jGvymDk"; // ← chumbado
    }

    // =========================================================================
    //  Ponto de entrada
    // =========================================================================

    public void executar() {
        System.out.println("\n[ImagemService] Iniciando sincronização de imagens...");

        criarTabelas();
        sincronizarJogadores();
        sincronizarEquipes();

        System.out.println("[ImagemService] ✓ Sincronização de imagens concluída!");
    }

    // =========================================================================
    //  Criação das tabelas
    // =========================================================================

    private void criarTabelas() {
        jdbcTemplate.execute("""
            CREATE TABLE IF NOT EXISTS imagem_jogador (
                nomeJogador VARCHAR(100) PRIMARY KEY,
                urlImagem   TEXT
            )
        """);

        jdbcTemplate.execute("""
            CREATE TABLE IF NOT EXISTS imagem_equipe (
                slugEquipe  VARCHAR(100) PRIMARY KEY,
                nomeEquipe  VARCHAR(100),
                urlImagem   TEXT
            )
        """);

        System.out.println("[ImagemService] ✓ Tabelas verificadas.");
    }

    // =========================================================================
    //  Jogadores
    // =========================================================================

    private void sincronizarJogadores() {
        System.out.println("[ImagemService] Sincronizando jogadores...");

        List<Object[]> batch = new ArrayList<>();
        int page = 1;

        while (true) {
            System.out.printf("[ImagemService] jogadores → página %d...%n", page);
            String json = fetchPagina("/lol/players", page);
            if (json == null || json.equals("[]")) break;

            List<String[]> registros = parseJogadores(json);
            if (registros.isEmpty()) break;

            for (String[] r : registros) {
                batch.add(new Object[]{r[0], r[1]}); // nomeJogador, urlImagem
            }

            if (registros.size() < PAGE_SIZE) break;
            page++;
        }

        jdbcTemplate.batchUpdate("""
            INSERT INTO imagem_jogador (nomeJogador, urlImagem)
            VALUES (?, ?)
            ON DUPLICATE KEY UPDATE urlImagem = VALUES(urlImagem)
        """, batch);

        System.out.printf("[ImagemService] jogadores ✓ → %d registros sincronizados.%n", batch.size());
    }

    // =========================================================================
    //  Equipes
    // =========================================================================

    private void sincronizarEquipes() {
        System.out.println("[ImagemService] Sincronizando equipes...");

        List<Object[]> batch = new ArrayList<>();
        int page = 1;

        while (true) {
            System.out.printf("[ImagemService] equipes → página %d...%n", page);
            String json = fetchPagina("/lol/teams", page);
            if (json == null || json.equals("[]")) break;

            List<String[]> registros = parseEquipes(json);
            if (registros.isEmpty()) break;

            for (String[] r : registros) {
                batch.add(new Object[]{r[0], r[1], r[2]}); // slugEquipe, nomeEquipe, urlImagem
            }

            if (registros.size() < PAGE_SIZE) break;
            page++;
        }

        jdbcTemplate.batchUpdate("""
            INSERT INTO imagem_equipe (slugEquipe, nomeEquipe, urlImagem)
            VALUES (?, ?, ?)
            ON DUPLICATE KEY UPDATE nomeEquipe = VALUES(nomeEquipe), urlImagem = VALUES(urlImagem)
        """, batch);

        System.out.printf("[ImagemService] equipes ✓ → %d registros sincronizados.%n", batch.size());
    }

    // =========================================================================
    //  HTTP
    // =========================================================================

    private String fetchPagina(String endpoint, int page) {
        try {
            String urlStr = String.format("%s%s?page[size]=%d&page[number]=%d",
                    BASE_URL, endpoint, PAGE_SIZE, page);

            HttpURLConnection conn = (HttpURLConnection) new URL(urlStr).openConnection();
            conn.setRequestProperty("Authorization", "Bearer " + token);
            conn.setRequestProperty("Accept", "application/json");
            conn.setConnectTimeout(10_000);
            conn.setReadTimeout(30_000);

            try (BufferedReader reader = new BufferedReader(
                    new InputStreamReader(conn.getInputStream()))) {
                StringBuilder sb = new StringBuilder();
                String line;
                while ((line = reader.readLine()) != null) sb.append(line);
                return sb.toString();
            }
        } catch (Exception e) {
            System.err.println("[ImagemService] Erro ao buscar página " + page + ": " + e.getMessage());
            return null;
        }
    }

    // =========================================================================
    //  Parsers JSON (manual, sem dependência externa)
    // =========================================================================

    private List<String[]> parseJogadores(String json) {
        List<String[]> result = new ArrayList<>();
        for (String obj : splitObjetos(json)) {
            String nome = extrairCampo(obj, "name");
            String url  = extrairCampo(obj, "image_url");
            if (nome != null && !nome.isBlank())
                result.add(new String[]{nome, url});
        }
        return result;
    }

    private List<String[]> parseEquipes(String json) {
        List<String[]> result = new ArrayList<>();
        for (String obj : splitObjetos(json)) {
            String slug = extrairCampo(obj, "slug");
            String nome = extrairCampo(obj, "name");
            String url  = extrairCampo(obj, "image_url");
            if (slug != null && !slug.isBlank())
                result.add(new String[]{slug, nome, url});
        }
        return result;
    }

    /**
     * Extrai o valor de um campo simples de string no JSON.
     * Não usa biblioteca externa — suficiente para campos planos.
     */
    private String extrairCampo(String obj, String campo) {
        String chave = "\"" + campo + "\":";
        int idx = obj.indexOf(chave);
        if (idx < 0) return null;

        int inicio = idx + chave.length();
        while (inicio < obj.length() && obj.charAt(inicio) == ' ') inicio++;

        if (obj.charAt(inicio) == '"') {
            int fim = obj.indexOf('"', inicio + 1);
            return fim < 0 ? null : obj.substring(inicio + 1, fim);
        }
        if (obj.startsWith("null", inicio)) return null;
        return null;
    }

    /**
     * Divide o array JSON em objetos individuais de forma simples.
     */
    private List<String> splitObjetos(String json) {
        List<String> objs = new ArrayList<>();
        int depth = 0, start = -1;
        for (int i = 0; i < json.length(); i++) {
            char c = json.charAt(i);
            if (c == '{') { if (depth++ == 0) start = i; }
            else if (c == '}') { if (--depth == 0 && start >= 0) objs.add(json.substring(start, i + 1)); }
        }
        return objs;
    }
}