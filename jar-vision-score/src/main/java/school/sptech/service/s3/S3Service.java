package school.sptech.service.s3;

import org.springframework.stereotype.Service;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;

import java.io.InputStream;

@Service
public class S3Service {

    private final S3Client s3Client;

    public S3Service() {
        this.s3Client = S3Client.builder().region(Region.US_EAST_1).build();
    }

    public InputStream baixarArquivo(String bucket, String nomeArquivo) {
        GetObjectRequest request = GetObjectRequest.builder()
                .bucket(bucket)
                .key(nomeArquivo)
                .build();

        return s3Client.getObject(request);
    }
}
