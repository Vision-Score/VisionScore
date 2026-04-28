package br.com.importer.service;

import com.github.pjfanning.xlsx.StreamingReader;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Consumer;

/**
 * Serviço responsável por ler arquivos XLSX com dados no formato CSV dentro de cada célula.
 *
 * Estrutura esperada do XLSX:
 *   - Linha 1 (cabeçalho): coluna A contém todos os nomes de colunas separados por vírgula
 *   - Linhas 2..N (dados):  coluna A contém os valores separados por vírgula (formato CSV)
 *
 * Usa o StreamingReader (excel-streaming-reader) para processar arquivos grandes
 * sem carregar tudo em memória.
 */
public class ExcelParserService {

    private static final int ROW_CACHE_SIZE  = 100;
    private static final int BUFFER_SIZE     = 8192;

    /**
     * Lê o XLSX em modo streaming e invoca o consumer para cada linha de dados.
     * Sem limite de linhas (processa o arquivo completo).
     */
    public long processar(InputStream inputStream, Consumer<Map<String, String>> rowConsumer) {
        return processar(inputStream, rowConsumer, 0);
    }

    /**
     * Lê o XLSX em modo streaming e invoca o consumer para cada linha de dados.
     *
     * @param inputStream stream do arquivo XLSX
     * @param rowConsumer callback chamado para cada linha, recebe um Map<coluna, valor>
     * @param maxLinhas   limite de linhas a processar (0 = sem limite)
     * @return número total de linhas de dados lidas (sem contar o cabeçalho)
     */
    public long processar(InputStream inputStream, Consumer<Map<String, String>> rowConsumer, long maxLinhas) {
        long linhasLidas = 0;

        try (Workbook workbook = StreamingReader.builder()
                .rowCacheSize(ROW_CACHE_SIZE)
                .bufferSize(BUFFER_SIZE)
                .open(inputStream)) {

            Sheet sheet = workbook.getSheetAt(0);
            List<String> headers = null;

            for (Row row : sheet) {
                // Lê o conteúdo da célula A (índice 0)
                String celula = getCellValue(row);
                if (celula == null || celula.isBlank()) continue;

                if (headers == null) {
                    // Primeira linha: cabeçalho
                    headers = parsearCsv(celula);
                    continue;
                }

                // Linha de dados
                List<String> valores = parsearCsv(celula);
                Map<String, String> mapa = mapearColunas(headers, valores);
                rowConsumer.accept(mapa);
                linhasLidas++;

                // Para quando atingir o limite de teste
                if (maxLinhas > 0 && linhasLidas >= maxLinhas) {
                    System.out.printf("[ExcelParser] Limite de teste de %,d linhas atingido. Encerrando leitura.%n", maxLinhas);
                    break;
                }
            }

        } catch (Exception e) {
            throw new RuntimeException("Erro ao processar arquivo XLSX: " + e.getMessage(), e);
        }

        return linhasLidas;
    }

    // -----------------------------------------------------------------------
    //  Helpers privados
    // -----------------------------------------------------------------------

    private String getCellValue(Row row) {
        if (row == null || row.getCell(0) == null) return null;
        return row.getCell(0).getStringCellValue();
    }

    /**
     * Faz parse de uma linha CSV usando Apache Commons CSV.
     * Trata corretamente valores entre aspas que contêm vírgulas (ex: "[29, 22]").
     */
    private List<String> parsearCsv(String linha) {
        try {
            CSVParser parser = CSVParser.parse(linha,
                    CSVFormat.DEFAULT.builder()
                            .setQuote('"')
                            .setTrim(true)
                            .build());

            List<CSVRecord> records = parser.getRecords();
            if (records.isEmpty()) return new ArrayList<>();

            CSVRecord record = records.get(0);
            List<String> campos = new ArrayList<>(record.size());
            for (String campo : record) {
                campos.add(campo);
            }
            return campos;

        } catch (Exception e) {
            // Fallback: split simples por vírgula (para linhas sem campos complexos)
            String[] partes = linha.split(",", -1);
            List<String> campos = new ArrayList<>(partes.length);
            for (String p : partes) campos.add(p.trim());
            return campos;
        }
    }

    /**
     * Mapeia os headers aos valores em um LinkedHashMap (mantém a ordem de inserção).
     */
    private Map<String, String> mapearColunas(List<String> headers, List<String> valores) {
        Map<String, String> mapa = new LinkedHashMap<>();
        for (int i = 0; i < headers.size(); i++) {
            String valor = i < valores.size() ? valores.get(i) : "";
            mapa.put(headers.get(i), valor == null ? "" : valor);
        }
        return mapa;
    }

    // -----------------------------------------------------------------------
    //  Utilitários de conversão de tipos — usados pelos processadores
    // -----------------------------------------------------------------------

    public static Integer toInt(String valor) {
        if (valor == null || valor.isBlank()) return null;
        try {
            // Suporta "21.0" (float como string → inteiro)
            return (int) Double.parseDouble(valor.trim());
        } catch (NumberFormatException e) {
            return null;
        }
    }

    public static int toIntOrZero(String valor) {
        Integer v = toInt(valor);
        return v != null ? v : 0;
    }

    public static byte toBooleanTinyInt(String valor) {
        if (valor == null) return 0;
        return "true".equalsIgnoreCase(valor.trim()) ? (byte) 1 : (byte) 0;
    }

    /**
     * Converte "[23]" ou "[29, 22]" ou "" em uma lista de inteiros.
     */
    public static List<Integer> toPlayerIdList(String valor) {
        List<Integer> ids = new ArrayList<>();
        if (valor == null || valor.isBlank()) return ids;

        // Remove colchetes
        String limpo = valor.trim().replaceAll("[\\[\\]\\s]", "");
        if (limpo.isEmpty()) return ids;

        for (String parte : limpo.split(",")) {
            Integer id = toInt(parte);
            if (id != null) ids.add(id);
        }
        return ids;
    }

    /**
     * Normaliza data: "2019-09-15 10:17:30.487000" → "2019-09-15 10:17:30"
     * O MySQL aceita o formato DATETIME sem microssegundos.
     */
    public static String toDateTime(String valor) {
        if (valor == null || valor.isBlank()) return null;
        // Remove microssegundos se houver
        String limpo = valor.trim();
        if (limpo.contains(".")) {
            limpo = limpo.substring(0, limpo.indexOf('.'));
        }
        return limpo;
    }
}
