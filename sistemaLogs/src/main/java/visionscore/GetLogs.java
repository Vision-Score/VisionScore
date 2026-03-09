package visionscore;

import java.sql.Array;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class GetLogs {
    public static void LogGenerico (int indexMensagem, int indexRetorno, int indexUser) {

        String nicks[] = {"xX_TopLanER", "MIDORFEED", "r ADCMain", "SUPPyou", "TARZANJUNGLE"};
        String erroMensagem[] = {"Erro ao acessar banco de dados.", "Erro ao carregar informações da Dashboard", "Erro ao carregar informações de Usuário"};
        String retornoErro[] = {"MYSQL EXCEPTION: INCORRECT SYNTAX", "MYSQL EXCEPTION: COULD NOT LOCATE 'abates' TABLE.", "CORS - CONNECTION REFUSED"};

        LocalDateTime dataHora = LocalDateTime.now();


        System.out.println("-----------------------------------------------------------\n");
        System.out.println("[" + dataHora.format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss")) + "] - [" + nicks[indexUser] + "] -" + erroMensagem[indexMensagem]);
        System.out.println(retornoErro[indexRetorno]);
        System.out.println("\n-----------------------------------------------------------");
    };

}
