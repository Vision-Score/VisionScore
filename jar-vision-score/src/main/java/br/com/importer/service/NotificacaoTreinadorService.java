package br.com.importer.service;

import br.com.importer.repository.TreinadorRepository;
import br.com.importer.repository.TreinadorRepository.Treinador;
import br.com.importer.util.EnvLoader;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

public class NotificacaoTreinadorService {

    private final TreinadorRepository treinadorRepository;
    private final EmailService emailService;

    public NotificacaoTreinadorService(TreinadorRepository treinadorRepository, EmailService emailService) {
        this.treinadorRepository = treinadorRepository;
        this.emailService = emailService;
    }

    public void notificarDadosNovos() {
        boolean emailAtivo = Boolean.parseBoolean(EnvLoader.get("MAIL_ENABLED", "true"));

        if (!emailAtivo) {
            System.out.println("[NotificacaoTreinadorService] Envio de e-mails desativado por MAIL_ENABLED=false.");
            return;
        }

        List<Treinador> treinadores = treinadorRepository.buscarTreinadoresComEmail();

        if (treinadores.isEmpty()) {
            System.out.println("[NotificacaoTreinadorService] Nenhum treinador com e-mail encontrado.");
            return;
        }

        String assunto = "Vision Score | Novos dados disponíveis";

        int enviados = 0;
        int falhas = 0;

        for (Treinador treinador : treinadores) {
            try {
                String mensagem = montarMensagem(treinador.nome());

                emailService.enviarEmail(
                        treinador.email(),
                        assunto,
                        mensagem
                );

                enviados++;
                System.out.println("[NotificacaoTreinadorService] E-mail enviado para: " + treinador.email());

            } catch (Exception e) {
                falhas++;
                System.err.println("[NotificacaoTreinadorService] Falha ao enviar e-mail para "
                        + treinador.email() + ": " + e.getMessage());
            }
        }

        System.out.printf(
                "[NotificacaoTreinadorService] Finalizado. Enviados=%d | Falhas=%d%n",
                enviados,
                falhas
        );
    }

    private String montarMensagem(String nomeTreinador) {
        String dataHora = LocalDateTime.now()
                .format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm"));

        return """
                Olá, %s.

                Novos dados foram importados para o Vision Score.

                Data da atualização: %s

                Acesse o sistema para visualizar as análises mais recentes.

                Atenciosamente,
                Equipe Vision Score
                """.formatted(nomeTreinador, dataHora);
    }
}