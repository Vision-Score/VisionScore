package school.sptech.model;

public class Torneio {
    private String nome;
    private Integer idLiga;

    public Torneio(String nome, Integer idLiga) {
        this.nome = nome;
        this.idLiga = idLiga;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public Integer getIdLiga() {
        return idLiga;
    }
}
