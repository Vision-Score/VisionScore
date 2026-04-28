package br.com.importer.config;

import br.com.importer.util.EnvLoader;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.AwsSessionCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;

/**
 * Fábrica do cliente S3.
 * Lê as credenciais do arquivo .env via EnvLoader.
 *
 * Suporta dois tipos de credencial:
 *   - Permanente (AKIA...): apenas ACCESS_KEY + SECRET_KEY
 *   - Temporária  (ASIA...): ACCESS_KEY + SECRET_KEY + SESSION_TOKEN (obrigatório)
 */
public class S3Provider {

    public S3Client getS3Client() {
        String accessKey    = EnvLoader.get("AWS_ACCESS_KEY_ID");
        String secretKey    = EnvLoader.get("AWS_SECRET_ACCESS_KEY");
        String sessionToken = EnvLoader.get("AWS_SESSION_TOKEN");
        String region       = EnvLoader.get("AWS_REGION", "us-east-1");

        if (accessKey == null || secretKey == null) {
            throw new IllegalStateException(
                "Credenciais AWS não encontradas. " +
                "Defina AWS_ACCESS_KEY_ID e AWS_SECRET_ACCESS_KEY no arquivo .env"
            );
        }

        // Credenciais temporárias (ASIA...) exigem session token
        StaticCredentialsProvider credentialsProvider;
        if (sessionToken != null && !sessionToken.isBlank()) {
            System.out.println("[S3Provider] Usando credenciais temporárias (com session token).");
            AwsSessionCredentials credentials =
                AwsSessionCredentials.create(accessKey, secretKey, sessionToken);
            credentialsProvider = StaticCredentialsProvider.create(credentials);
        } else {
            System.out.println("[S3Provider] Usando credenciais permanentes (sem session token).");
            AwsBasicCredentials credentials =
                AwsBasicCredentials.create(accessKey, secretKey);
            credentialsProvider = StaticCredentialsProvider.create(credentials);
        }

        return S3Client.builder()
                .region(Region.of(region))
                .credentialsProvider(credentialsProvider)
                .build();
    }
}
