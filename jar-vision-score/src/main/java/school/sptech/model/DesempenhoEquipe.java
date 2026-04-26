package school.sptech.model;

public class DesempenhoEquipe {
    private Integer totalCampeoesEliminados;
    private Integer totalTorresDestruidas;
    private Integer totalInibidoresDestruidos;
    private Integer totalDragoesAbatidos;
    private Integer totalArautosAbatidos;
    private Integer totalBaroesAbatidos;
    private Integer idEquipe;
    private Integer idPartida;

    public DesempenhoEquipe(Integer totalCampeoesEliminados, Integer totalTorresDestruidas,
                            Integer totalInibidoresDestruidos, Integer totalDragoesAbatidos,
                            Integer totalArautosAbatidos, Integer totalBaroesAbatidos,
                            Integer idEquipe, Integer idPartida) {
        this.totalCampeoesEliminados = totalCampeoesEliminados;
        this.totalTorresDestruidas = totalTorresDestruidas;
        this.totalInibidoresDestruidos = totalInibidoresDestruidos;
        this.totalDragoesAbatidos = totalDragoesAbatidos;
        this.totalArautosAbatidos = totalArautosAbatidos;
        this.totalBaroesAbatidos = totalBaroesAbatidos;
        this.idEquipe = idEquipe;
        this.idPartida = idPartida;
    }

    public Integer getTotalCampeoesEliminados() {
        return totalCampeoesEliminados;
    }

    public void setTotalCampeoesEliminados(Integer totalCampeoesEliminados) {
        this.totalCampeoesEliminados = totalCampeoesEliminados;
    }

    public Integer getTotalTorresDestruidas() {
        return totalTorresDestruidas;
    }

    public void setTotalTorresDestruidas(Integer totalTorresDestruidas) {
        this.totalTorresDestruidas = totalTorresDestruidas;
    }

    public Integer getTotalInibidoresDestruidos() {
        return totalInibidoresDestruidos;
    }

    public void setTotalInibidoresDestruidos(Integer totalInibidoresDestruidos) {
        this.totalInibidoresDestruidos = totalInibidoresDestruidos;
    }

    public Integer getTotalDragoesAbatidos() {
        return totalDragoesAbatidos;
    }

    public void setTotalDragoesAbatidos(Integer totalDragoesAbatidos) {
        this.totalDragoesAbatidos = totalDragoesAbatidos;
    }

    public Integer getTotalArautosAbatidos() {
        return totalArautosAbatidos;
    }

    public void setTotalArautosAbatidos(Integer totalArautosAbatidos) {
        this.totalArautosAbatidos = totalArautosAbatidos;
    }

    public Integer getTotalBaroesAbatidos() {
        return totalBaroesAbatidos;
    }

    public void setTotalBaroesAbatidos(Integer totalBaroesAbatidos) {
        this.totalBaroesAbatidos = totalBaroesAbatidos;
    }

    public Integer getIdEquipe() {
        return idEquipe;
    }

    public Integer getIdPartida() {
        return idPartida;
    }
}
