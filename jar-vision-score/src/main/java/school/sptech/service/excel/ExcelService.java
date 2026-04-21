package school.sptech.service.excel;

import org.apache.poi.ss.usermodel.DataFormatter;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ExcelService {

    public List<Map<String, String>> lerLinhas(InputStream inputStream) throws Exception {
        List<Map<String, String>> linhas = new ArrayList<>();
        Workbook workbook = new XSSFWorkbook(inputStream);
        Sheet sheet = workbook.getSheetAt(0);
        DataFormatter formatter = new DataFormatter();
        Row cabecalho = sheet.getRow(0);

        for (int i = 1; i <= sheet.getLastRowNum(); i++) {
            Row linha = sheet.getRow(i);
            if (linha == null) continue;

            Map<String, String> registro = new HashMap<>();
            for (int j = 0; j < cabecalho.getLastCellNum(); j++) {
                String coluna = formatter.formatCellValue(cabecalho.getCell(j));
                String valor = formatter.formatCellValue(linha.getCell(j));
                registro.put(coluna, valor);
            }

            linhas.add(registro);
        }

        workbook.close();
        return linhas;
    }
}
