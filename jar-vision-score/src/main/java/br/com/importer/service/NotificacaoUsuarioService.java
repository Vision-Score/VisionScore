package br.com.importer.service;

import br.com.importer.repository.UsuarioNotificacaoRepository;
import br.com.importer.repository.UsuarioNotificacaoRepository.Usuario;
import br.com.importer.util.EnvLoader;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

public class NotificacaoUsuarioService {

    private final UsuarioNotificacaoRepository usuarioRepository;
    private final EmailService emailService;

    public NotificacaoUsuarioService(UsuarioNotificacaoRepository usuarioRepository, EmailService emailService) {
        this.usuarioRepository = usuarioRepository;
        this.emailService = emailService;
    }

    public void notificarDadosNovos() {
        boolean emailAtivo = Boolean.parseBoolean(EnvLoader.get("MAIL_ENABLED", "true"));

        if (!emailAtivo) {
            System.out.println("[NotificacaoUsuarioService] Envio de e-mails desativado por MAIL_ENABLED=false.");
            return;
        }

        List<Usuario> usuarios = usuarioRepository.buscarUsuariosComNotificacaoAtiva();

        if (usuarios.isEmpty()) {
            System.out.println("[NotificacaoUsuarioService] Nenhum usuário com notificação ativa encontrado.");
            return;
        }

        String assunto = "Vision Score | Novos dados disponíveis";

        int enviados = 0;
        int falhas = 0;

        for (Usuario usuario : usuarios) {
            try {
                String mensagem = montarMensagem(usuario.nome());

                emailService.enviarEmail(
                        usuario.email(),
                        assunto,
                        mensagem
                );

                enviados++;
                System.out.println("[NotificacaoUsuarioService] E-mail enviado para: " + usuario.email());

            } catch (Exception e) {
                falhas++;
                System.err.println("[NotificacaoUsuarioService] Falha ao enviar e-mail para "
                        + usuario.email() + ": " + e.getMessage());
            }
        }

        System.out.printf(
                "[NotificacaoUsuarioService] Finalizado. Enviados=%d | Falhas=%d%n",
                enviados,
                falhas
        );
    }

    private String montarMensagem(String nomeUsuario) {
        String dataHora = LocalDateTime.now()
                .format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm"));

        return """
                Olá, %s.

                Novos dados foram importados para o Vision Score.

                Data da atualização: %s

                Acesse o sistema para visualizar as análises mais recentes.

                Atenciosamente,
                Equipe Vision Score
                """.formatted(nomeUsuario, dataHora);
    }
}
