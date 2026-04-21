package school.sptech.model;

public class Evento {
    private Integer tempoEventoSegundo;
    private String tipoEvento;
    private String tipoDragao;
    private Integer idDesempenhoMatador;
    private Integer idMatador;
    private Integer idEquipeMatador;
    private Integer idDesempenhoEliminado;
    private Integer idJogadorEliminado;
    private Integer idEquipeEliminado;

    public Evento(Integer tempoEventoSegundo, String tipoEvento, String tipoDragao,
                  Integer idDesempenhoMatador, Integer idMatador, Integer idEquipeMatador,
                  Integer idDesempenhoEliminado, Integer idJogadorEliminado,
                  Integer idEquipeEliminado) {
        this.tempoEventoSegundo = tempoEventoSegundo;
        this.tipoEvento = tipoEvento;
        this.tipoDragao = tipoDragao;
        this.idDesempenhoMatador = idDesempenhoMatador;
        this.idMatador = idMatador;
        this.idEquipeMatador = idEquipeMatador;
        this.idDesempenhoEliminado = idDesempenhoEliminado;
        this.idJogadorEliminado = idJogadorEliminado;
        this.idEquipeEliminado = idEquipeEliminado;
    }

    public Integer getTempoEventoSegundo() {
        return tempoEventoSegundo;
    }

    public void setTempoEventoSegundo(Integer tempoEventoSegundo) {
        this.tempoEventoSegundo = tempoEventoSegundo;
    }

    public String getTipoEvento() {
        return tipoEvento;
    }

    public void setTipoEvento(String tipoEvento) {
        this.tipoEvento = tipoEvento;
    }

    public String getTipoDragao() {
        return tipoDragao;
    }

    public void setTipoDragao(String tipoDragao) {
        this.tipoDragao = tipoDragao;
    }

    public Integer getIdDesempenhoMatador() {
        return idDesempenhoMatador;
    }

    public Integer getIdMatador() {
        return idMatador;
    }

    public Integer getIdEquipeMatador() {
        return idEquipeMatador;
    }

    public Integer getIdDesempenhoEliminado() {
        return idDesempenhoEliminado;
    }

    public Integer getIdJogadorEliminado() {
        return idJogadorEliminado;
    }

    public Integer getIdEquipeEliminado() {
        return idEquipeEliminado;
    }
}
