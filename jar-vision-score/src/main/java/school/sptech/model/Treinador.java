package school.sptech.model;

import java.time.LocalDate;

public class Treinador {
    private String nome;
    private String email;
    private String senha;
    private LocalDate dtCriacao;
    private LocalDate ultimoLogin;
    private Integer idEquipe;

    public Treinador(String nome, String email, String senha, LocalDate dtCriacao,
                     LocalDate ultimoLogin, Integer idEquipe) {
        this.nome = nome;
        this.email = email;
        this.senha = senha;
        this.dtCriacao = dtCriacao;
        this.ultimoLogin = ultimoLogin;
        this.idEquipe = idEquipe;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getSenha() {
        return senha;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }

    public LocalDate getDtCriacao() {
        return dtCriacao;
    }

    public void setDtCriacao(LocalDate dtCriacao) {
        this.dtCriacao = dtCriacao;
    }

    public LocalDate getUltimoLogin() {
        return ultimoLogin;
    }

    public void setUltimoLogin(LocalDate ultimoLogin) {
        this.ultimoLogin = ultimoLogin;
    }

    public Integer getIdEquipe() {
        return idEquipe;
    }
}
