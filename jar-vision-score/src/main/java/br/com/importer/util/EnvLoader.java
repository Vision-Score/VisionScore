package br.com.importer.util;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

/**
 * Carrega variáveis de ambiente a partir de um arquivo .env.
 * O arquivo .env deve estar na mesma pasta onde o JAR é executado.
 */
public class EnvLoader {

    private static final Map<String, String> envVars = new HashMap<>();
    private static boolean loaded = false;

    public static void load() {
        load(".env");
    }

    public static void load(String filename) {
        if (loaded) return;

        try (BufferedReader reader = new BufferedReader(new FileReader(filename))) {
            String line;
            while ((line = reader.readLine()) != null) {
                line = line.trim();

                // Ignora comentários e linhas vazias
                if (line.isEmpty() || line.startsWith("#")) continue;

                int equalIndex = line.indexOf('=');
                if (equalIndex <= 0) continue;

                String key   = line.substring(0, equalIndex).trim();
                String value = line.substring(equalIndex + 1).trim();

                // Remove aspas duplas ou simples opcionais
                if ((value.startsWith("\"") && value.endsWith("\""))
                        || (value.startsWith("'") && value.endsWith("'"))) {
                    value = value.substring(1, value.length() - 1);
                }

                envVars.put(key, value);
            }
            loaded = true;
            System.out.println("[EnvLoader] Arquivo .env carregado com sucesso.");
        } catch (IOException e) {
            System.err.println("[EnvLoader] Aviso: não foi possível carregar o arquivo .env → " + e.getMessage());
            System.err.println("[EnvLoader] Usando variáveis de ambiente do sistema operacional.");
        }
    }

    /**
     * Retorna o valor da variável: primeiro busca no .env, depois no ambiente do SO.
     */
    public static String get(String key) {
        String value = envVars.get(key);
        if (value == null || value.isBlank()) {
            value = System.getenv(key);
        }
        return value;
    }

    /**
     * Retorna o valor da variável ou um valor padrão se não encontrado.
     */
    public static String get(String key, String defaultValue) {
        String value = get(key);
        return (value != null && !value.isBlank()) ? value : defaultValue;
    }

    /**
     * Retorna o valor como inteiro.
     */
    public static int getInt(String key, int defaultValue) {
        String value = get(key);
        if (value == null || value.isBlank()) return defaultValue;
        try {
            return Integer.parseInt(value.trim());
        } catch (NumberFormatException e) {
            return defaultValue;
        }
    }
}
