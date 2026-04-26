package school.sptech.model;

import java.time.LocalDate;

public class Jogador {
    private String nome;
    private String funcao;
    private LocalDate dtCriacao;
    private Integer idEquipe;

    public Jogador(String nome, String funcao, LocalDate dtCriacao, Integer idEquipe) {
        this.nome = nome;
        this.funcao = funcao;
        this.dtCriacao = dtCriacao;
        this.idEquipe = idEquipe;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getFuncao() {
        return funcao;
    }

    public void setFuncao(String funcao) {
        this.funcao = funcao;
    }

    public LocalDate getDtCriacao() {
        return dtCriacao;
    }

    public void setDtCriacao(LocalDate dtCriacao) {
        this.dtCriacao = dtCriacao;
    }

    public Integer getIdEquipe() {
        return idEquipe;
    }
}
