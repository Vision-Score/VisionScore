package school.sptech.model;

import java.time.LocalDate;

public class Partida {
    private LocalDate dtPartida;
    private Integer idJogo;

    public Partida(LocalDate dtPartida, Integer idJogo) {
        this.dtPartida = dtPartida;
        this.idJogo = idJogo;
    }

    public LocalDate getDtPartida() {
        return dtPartida;
    }

    public void setDtPartida(LocalDate dtPartida) {
        this.dtPartida = dtPartida;
    }

    public Integer getIdJogo() {
        return idJogo;
    }
}
