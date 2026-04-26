package school.sptech.model;

public class DesempenhoJogador {
    private Boolean vitoria;
    private Integer eliminacoesCampeoes;
    private Integer qtdMortes;
    private Integer qtdAssistencias;
    private Integer totalLacaiosAbatidos;
    private Integer qtdOuroObtido;
    private Integer nivelFinal;
    private Integer totalDanoCausado;
    private Integer totalDanoCausadoCampeaoInimigo;
    private Integer totalDanoRecebido;
    private Integer qtdSentinelasPosicionadas;
    private Integer eliminacoesConsecutivas;
    private Integer eliminacoesMultiplas;
    private Integer idJogador;
    private Integer idEquipe;
    private Integer idCampeao;
    private Integer idPartida;

    public DesempenhoJogador(Boolean vitoria, Integer eliminacoesCampeoes, Integer qtdMortes,
                             Integer qtdAssistencias, Integer totalLacaiosAbatidos,
                             Integer qtdOuroObtido, Integer nivelFinal, Integer totalDanoCausado,
                             Integer totalDanoCausadoCampeaoInimigo, Integer totalDanoRecebido,
                             Integer qtdSentinelasPosicionadas, Integer eliminacoesConsecutivas,
                             Integer eliminacoesMultiplas, Integer idJogador, Integer idEquipe,
                             Integer idCampeao, Integer idPartida) {
        this.vitoria = vitoria;
        this.eliminacoesCampeoes = eliminacoesCampeoes;
        this.qtdMortes = qtdMortes;
        this.qtdAssistencias = qtdAssistencias;
        this.totalLacaiosAbatidos = totalLacaiosAbatidos;
        this.qtdOuroObtido = qtdOuroObtido;
        this.nivelFinal = nivelFinal;
        this.totalDanoCausado = totalDanoCausado;
        this.totalDanoCausadoCampeaoInimigo = totalDanoCausadoCampeaoInimigo;
        this.totalDanoRecebido = totalDanoRecebido;
        this.qtdSentinelasPosicionadas = qtdSentinelasPosicionadas;
        this.eliminacoesConsecutivas = eliminacoesConsecutivas;
        this.eliminacoesMultiplas = eliminacoesMultiplas;
        this.idJogador = idJogador;
        this.idEquipe = idEquipe;
        this.idCampeao = idCampeao;
        this.idPartida = idPartida;
    }

    public Boolean getVitoria() {
        return vitoria;
    }

    public void setVitoria(Boolean vitoria) {
        this.vitoria = vitoria;
    }

    public Integer getEliminacoesCampeoes() {
        return eliminacoesCampeoes;
    }

    public void setEliminacoesCampeoes(Integer eliminacoesCampeoes) {
        this.eliminacoesCampeoes = eliminacoesCampeoes;
    }

    public Integer getQtdMortes() {
        return qtdMortes;
    }

    public void setQtdMortes(Integer qtdMortes) {
        this.qtdMortes = qtdMortes;
    }

    public Integer getQtdAssistencias() {
        return qtdAssistencias;
    }

    public void setQtdAssistencias(Integer qtdAssistencias) {
        this.qtdAssistencias = qtdAssistencias;
    }

    public Integer getTotalLacaiosAbatidos() {
        return totalLacaiosAbatidos;
    }

    public void setTotalLacaiosAbatidos(Integer totalLacaiosAbatidos) {
        this.totalLacaiosAbatidos = totalLacaiosAbatidos;
    }

    public Integer getQtdOuroObtido() {
        return qtdOuroObtido;
    }

    public void setQtdOuroObtido(Integer qtdOuroObtido) {
        this.qtdOuroObtido = qtdOuroObtido;
    }

    public Integer getNivelFinal() {
        return nivelFinal;
    }

    public void setNivelFinal(Integer nivelFinal) {
        this.nivelFinal = nivelFinal;
    }

    public Integer getTotalDanoCausado() {
        return totalDanoCausado;
    }

    public void setTotalDanoCausado(Integer totalDanoCausado) {
        this.totalDanoCausado = totalDanoCausado;
    }

    public Integer getTotalDanoCausadoCampeaoInimigo() {
        return totalDanoCausadoCampeaoInimigo;
    }

    public void setTotalDanoCausadoCampeaoInimigo(Integer totalDanoCausadoCampeaoInimigo) {
        this.totalDanoCausadoCampeaoInimigo = totalDanoCausadoCampeaoInimigo;
    }

    public Integer getTotalDanoRecebido() {
        return totalDanoRecebido;
    }

    public void setTotalDanoRecebido(Integer totalDanoRecebido) {
        this.totalDanoRecebido = totalDanoRecebido;
    }

    public Integer getQtdSentinelasPosicionadas() {
        return qtdSentinelasPosicionadas;
    }

    public void setQtdSentinelasPosicionadas(Integer qtdSentinelasPosicionadas) {
        this.qtdSentinelasPosicionadas = qtdSentinelasPosicionadas;
    }

    public Integer getEliminacoesConsecutivas() {
        return eliminacoesConsecutivas;
    }

    public void setEliminacoesConsecutivas(Integer eliminacoesConsecutivas) {
        this.eliminacoesConsecutivas = eliminacoesConsecutivas;
    }

    public Integer getEliminacoesMultiplas() {
        return eliminacoesMultiplas;
    }

    public void setEliminacoesMultiplas(Integer eliminacoesMultiplas) {
        this.eliminacoesMultiplas = eliminacoesMultiplas;
    }

    public Integer getIdJogador() {
        return idJogador;
    }

    public Integer getIdEquipe() {
        return idEquipe;
    }

    public Integer getIdCampeao() {
        return idCampeao;
    }

    public Integer getIdPartida() {
        return idPartida;
    }
}
