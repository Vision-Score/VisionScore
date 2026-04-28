package br.com.importer.service;

import br.com.importer.util.EnvLoader;
import software.amazon.awssdk.core.ResponseInputStream;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectResponse;
import software.amazon.awssdk.services.s3.model.ListObjectsV2Request;
import software.amazon.awssdk.services.s3.model.S3Object;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Serviço responsável por interagir com o Amazon S3.
 * Lista arquivos XLSX no bucket e os disponibiliza como InputStream.
 */
public class S3Service {

    private final S3Client s3Client;
    private final String bucketName;
    private final String prefix;

    public S3Service(S3Client s3Client) {
        this.s3Client  = s3Client;
        this.bucketName = EnvLoader.get("S3_BUCKET_NAME");
        this.prefix     = EnvLoader.get("S3_PREFIX", "");

        if (bucketName == null || bucketName.isBlank()) {
            throw new IllegalStateException("S3_BUCKET_NAME não definido no arquivo .env");
        }
    }

    /**
     * Lista todas as chaves de arquivos .xlsx no bucket (com paginação automática).
     */
    public List<String> listarArquivosXlsx() {
        System.out.println("[S3Service] Listando arquivos .xlsx no bucket: " + bucketName
                + (prefix.isBlank() ? "" : " | prefixo: " + prefix));

        ListObjectsV2Request.Builder requestBuilder = ListObjectsV2Request.builder()
                .bucket(bucketName);

        if (!prefix.isBlank()) {
            requestBuilder.prefix(prefix);
        }

        List<String> arquivos = s3Client.listObjectsV2Paginator(requestBuilder.build())
                .contents()
                .stream()
                .map(S3Object::key)
                .filter(key -> key.toLowerCase().endsWith(".xlsx"))
                .collect(Collectors.toList());

        System.out.println("[S3Service] " + arquivos.size() + " arquivo(s) .xlsx encontrado(s).");
        arquivos.forEach(k -> System.out.println("  → " + k));

        return arquivos;
    }

    /**
     * Faz download de um arquivo do S3 e retorna o InputStream para leitura direta.
     * O caller é responsável por fechar o stream.
     */
    public ResponseInputStream<GetObjectResponse> download(String key) {
        System.out.println("[S3Service] Baixando: " + key);

        GetObjectRequest request = GetObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .build();

        return s3Client.getObject(request);
    }
}
