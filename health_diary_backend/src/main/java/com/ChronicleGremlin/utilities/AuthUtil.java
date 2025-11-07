package com.ChronicleGremlin.utilities;


import com.ChronicleGremlin.model.User;
import com.ChronicleGremlin.security.CustomUserPrincipal;
import com.ChronicleGremlin.service.UserService;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class AuthUtil {
    private final UserService userService;

    public AuthUtil(UserService userService) {
        this.userService = userService;
    }

    public User getUserFromAuthentication() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || authentication.getPrincipal() == null) {
            throw new RuntimeException("No authentication info found.");
        }

        Object principal = authentication.getPrincipal();

        if(principal instanceof CustomUserPrincipal) {
            return ((CustomUserPrincipal) principal).getUser();
        } else if (principal instanceof org.springframework.security.core.userdetails.User) {
            String email = ((org.springframework.security.core.userdetails.User) principal).getUsername();
            return userService.findByEmailAddress(email)
                    .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
        } else {
            throw new RuntimeException("Unknown principal type: " + principal.getClass().getName());
        }
    }
}
