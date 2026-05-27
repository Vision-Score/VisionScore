package br.com.importer.service;

import br.com.importer.exception.ImportacaoException;
import br.com.importer.util.EnvLoader;
import jakarta.mail.Authenticator;
import jakarta.mail.Message;
import jakarta.mail.PasswordAuthentication;
import jakarta.mail.Session;
import jakarta.mail.Transport;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;

import java.nio.charset.StandardCharsets;
import java.util.Properties;

public class EmailService {

    private final Session session;
    private final String remetenteEmail;
    private final String remetenteNome;

    public EmailService() {
        String host = EnvLoader.get("MAIL_SMTP_HOST");
        String port = EnvLoader.get("MAIL_SMTP_PORT", "587");
        String auth = EnvLoader.get("MAIL_SMTP_AUTH", "true");
        String startTls = EnvLoader.get("MAIL_SMTP_STARTTLS_ENABLE", "true");

        String username = EnvLoader.get("MAIL_USERNAME");
        String password = EnvLoader.get("MAIL_PASSWORD");

        this.remetenteEmail = EnvLoader.get("MAIL_FROM", username);
        this.remetenteNome = EnvLoader.get("MAIL_FROM_NAME", "Vision Score");

        boolean debug = Boolean.parseBoolean(EnvLoader.get("MAIL_DEBUG", "false"));

        if (host == null || host.isBlank()) {
            throw new ImportacaoException("MAIL_SMTP_HOST não definido no .env");
        }

        if (username == null || username.isBlank()) {
            throw new ImportacaoException("MAIL_USERNAME não definido no .env");
        }

        if (password == null || password.isBlank()) {
            throw new ImportacaoException("MAIL_PASSWORD não definido no .env");
        }

        Properties props = new Properties();
        props.put("mail.smtp.host", host);
        props.put("mail.smtp.port", port);
        props.put("mail.smtp.auth", auth);
        props.put("mail.smtp.starttls.enable", startTls);
        props.put("mail.smtp.connectiontimeout", "10000");
        props.put("mail.smtp.timeout", "10000");
        props.put("mail.smtp.writetimeout", "10000");

        this.session = Session.getInstance(props, new Authenticator() {
            @Override
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(username, password);
            }
        });

        this.session.setDebug(debug);
    }

    public void enviarEmail(String destinatario, String assunto, String mensagem) {
        try {
            MimeMessage email = new MimeMessage(session);

            email.setFrom(new InternetAddress(
                    remetenteEmail,
                    remetenteNome,
                    StandardCharsets.UTF_8.name()
            ));

            email.setRecipients(
                    Message.RecipientType.TO,
                    InternetAddress.parse(destinatario)
            );

            email.setSubject(assunto, StandardCharsets.UTF_8.name());
            email.setText(mensagem, StandardCharsets.UTF_8.name());

            Transport.send(email);

        } catch (Exception e) {
            throw new ImportacaoException("Erro ao enviar e-mail para " + destinatario + ": " + e.getMessage(), e);
        }
    }
}