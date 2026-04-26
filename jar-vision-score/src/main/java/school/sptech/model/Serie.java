package school.sptech.model;

public class Serie {
    private String nome;
    private Integer idTorneio;

    public Serie(String nome, Integer idTorneio) {
        this.nome = nome;
        this.idTorneio = idTorneio;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public Integer getIdTorneio() {
        return idTorneio;
    }
}
