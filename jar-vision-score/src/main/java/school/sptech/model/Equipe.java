package school.sptech.model;

import java.time.LocalDate;

public class Equipe {
    private String nome;
    private String sigla;
    private LocalDate dtCriacao;

    public Equipe(String nome, String sigla, LocalDate dtCriacao) {
        this.nome = nome;
        this.sigla = sigla;
        this.dtCriacao = dtCriacao;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getSigla() {
        return sigla;
    }

    public void setSigla(String sigla) {
        this.sigla = sigla;
    }

    public LocalDate getDtCriacao() {
        return dtCriacao;
    }

    public void setDtCriacao(LocalDate dtCriacao) {
        this.dtCriacao = dtCriacao;
    }
}
