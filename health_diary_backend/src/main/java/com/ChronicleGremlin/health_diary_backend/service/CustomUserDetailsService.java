package com.ChronicleGremlin.health_diary_backend.service;

import com.ChronicleGremlin.health_diary_backend.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class CustomUserDetailsService implements UserDetailsService {
    @Autowired
    private UserService userService;

    @Override
    public UserDetails loadUserByUsername(String emailAddress) throws UsernameNotFoundException {
        System.out.println("=== Loading user by email: " + emailAddress + " ===");

        User user = userService.findByEmailAddress(emailAddress)
                .orElseThrow(() -> {
                    System.out.println("User not found with email: " + emailAddress);
                    return new UsernameNotFoundException("User not found with email: " + emailAddress);
                });

        System.out.println("Found user: " + user.getEmailAddress());
        System.out.println("User password hash: " + user.getPasswordHash());
        System.out.println("User email verified: " + user.isEmailVerified());

        // Use a placeholder password for OAuth2 users
        String password = user.getPasswordHash();
        if (password == null || password.trim().isEmpty()) {
            // Assign a placeholder string to OAuth2 user
            password = "oauth2-user-placeholder";
        }

        // Create a UserDetails object with the user's information
        return new org.springframework.security.core.userdetails.User(
                user.getEmailAddress(),
                password,
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"))
        );
    }
}

