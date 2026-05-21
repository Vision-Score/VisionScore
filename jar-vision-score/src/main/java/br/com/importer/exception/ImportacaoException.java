package br.com.importer.exception;

public class ImportacaoException extends RuntimeException {

    public ImportacaoException(String mensagem) {
        super(mensagem);
    }

    public ImportacaoException(String mensagem, Throwable causa) {
        super(mensagem, causa);
    }
}
