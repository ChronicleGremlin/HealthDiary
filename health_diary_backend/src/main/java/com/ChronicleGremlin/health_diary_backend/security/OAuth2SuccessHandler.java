package com.ChronicleGremlin.health_diary_backend.security;


import com.ChronicleGremlin.health_diary_backend.model.AuthProvider;
import com.ChronicleGremlin.health_diary_backend.model.User;
import com.ChronicleGremlin.health_diary_backend.service.UserService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.util.Map;
import java.util.Optional;

@Component
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    //Injects the frontend redirect URI application properties.
    @Value("${app.oauth2.authorizedRedirectUris}")
    private String authorizedRedirectUri;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private UserService userService;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {
        try {
            //getting user details like name, email, and picture.
            OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
            Map<String, Object> attributes = oAuth2User.getAttributes();

            String emailAddress = (String) attributes.get("email");
            String name = (String) attributes.get("name");
            String pictureUrl = (String) attributes.get("picture");

            if (emailAddress == null) {
                throw new IllegalArgumentException("Email not found from OAuth2 provider");
            }

            // Checking if user exist and creating or updating user
            Optional<User> existingUser = userService.findByEmailAddress(emailAddress);
            User user = existingUser.orElseGet(() -> {
                User newUser = new User();
                newUser.setEmailAddress(emailAddress);
                newUser.setName(name);
                newUser.setProvider(AuthProvider.GOOGLE);
                newUser.setEmailVerified(true); // Google accounts are pre-verified
                newUser.setPictureUrl(pictureUrl); // Save profile picture from Google
                return newUser;
            });

            // Update user information if they already exist
            if (existingUser.isPresent()) {
                user.setName(name); // Update name in case it changed
                if (pictureUrl != null) {
                    user.setPictureUrl(pictureUrl);
                }
            }

            // Save user to the database
            user = userService.save(user);

            String token = tokenProvider.generateToken(authentication);

            // Redirect to frontend with token
            String redirectUrl = UriComponentsBuilder.fromUriString(authorizedRedirectUri)
                    .queryParam("token", token)
                    .queryParam("userId", user.getId())
                    .build().toUriString();

            getRedirectStrategy().sendRedirect(request, response, redirectUrl);
        } catch (Exception ex) {
            // Log the error
            logger.error("OAuth2 authentication error", ex);

            // Redirect to frontend with error
            String redirectUrl = UriComponentsBuilder.fromUriString(authorizedRedirectUri)
                    .queryParam("error", "OAuth2 authentication failed")
                    .build().toUriString();

            getRedirectStrategy().sendRedirect(request, response, redirectUrl);
        }
    }
}

