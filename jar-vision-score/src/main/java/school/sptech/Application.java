package school.sptech;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import school.sptech.service.carga.CargaService;

@SpringBootApplication
public class Application {

    @Autowired
    private CargaService cargaService;

    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }

    @Bean
    public CommandLineRunner executar() {
        return args -> cargaService.executarTodasAsCargas();
    }
}
