package school.sptech.model;

import java.time.LocalDate;
import java.time.LocalTime;

public class Log {
    private String arquivo;
    private String status;
    private String mensagem;
    private Integer linhasLidas;
    private Integer linhasInseridas;

    public String getArquivo() {
        return arquivo;
    }

    public void setArquivo(String arquivo) {
        this.arquivo = arquivo;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getMensagem() {
        return mensagem;
    }

    public void setMensagem(String mensagem) {
        this.mensagem = mensagem;
    }

    public Integer getLinhasLidas() {
        return linhasLidas;
    }

    public void setLinhasLidas(Integer linhasLidas) {
        this.linhasLidas = linhasLidas;
    }

    public Integer getLinhasInseridas() {
        return linhasInseridas;
    }

    public void setLinhasInseridas(Integer linhasInseridas) {
        this.linhasInseridas = linhasInseridas;
    }
}
