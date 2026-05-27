package br.com.importer.config;

import br.com.importer.util.EnvLoader;
import software.amazon.awssdk.auth.credentials.DefaultCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;

/**
 * Fábrica do cliente S3.
 * Credenciais resolvidas automaticamente via DefaultCredentialsProvider:
 * em produção (EC2), usa a IAM Role anexada à instância via IMDS.
 */
public class S3Provider {

    public S3Client getS3Client() {
        String region = EnvLoader.get("AWS_REGION", "us-east-1");

        System.out.println("[S3Provider] Usando DefaultCredentialsProvider (IAM Role via IMDS).");

        return S3Client.builder()
                .region(Region.of(region))
                .credentialsProvider(DefaultCredentialsProvider.create())
                .build();
    }
}