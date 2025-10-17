package com.ChronicleGremlin.health_diary_backend.service;


import jakarta.annotation.PostConstruct;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Value("${app.frontend.baseUrl}")
    private String frontendBaseUrl;

    @PostConstruct
    public void init() {
        if (mailSender instanceof JavaMailSenderImpl) {
            JavaMailSenderImpl mailSenderImpl = (JavaMailSenderImpl) mailSender;
            logger.info("Email Configuration:");
            logger.info("Host: {}", mailSenderImpl.getHost());
            logger.info("Port: {}", mailSenderImpl.getPort());
            logger.info("Username: {}", mailSenderImpl.getUsername());
            logger.info("Protocol: {}", mailSenderImpl.getProtocol());
            logger.info("Default encoding: {}", mailSenderImpl.getDefaultEncoding());
        }
    }

    public void sendVerificationEmail(String to, String token) throws MessagingException {
        logger.info("Starting email verification process for: {}", to);
        logger.info("Using frontend base URL: {}", frontendBaseUrl);
        logger.info("Using from email: {}", fromEmail);

        try {
            logger.debug("Creating MIME message");
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject("Please verify your email");

            String verificationUrl = frontendBaseUrl + "/verify-email?token=" + token;
            String emailContent = String.format(
                    "<div style='font-family: Arial, sans-serif; padding: 20px;'>" +
                            "<h2>Welcome to your Health Diary!</h2>" +
                            "<p>Thank you for registering. Please click the link below to verify your email address:</p>" +
                            "<p><a href='%s'>Verify Email</a></p>" +
                            "<p>If you did not create an account, please ignore this email.</p>" +
                            "</div>",
                    verificationUrl
            );

            helper.setText(emailContent, true);
            logger.info("Verification URL generated: {}", verificationUrl);

            logger.info("Attempting to send email...");
            mailSender.send(message);
            logger.info("Verification email sent successfully to: {}", to);
        } catch (Exception e) {
            logger.error("Failed to send verification email to: {}", to, e);
            throw new MessagingException("Failed to send verification email: " + e.getMessage(), e);
        }
    }
}

