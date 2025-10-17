package com.ChronicleGremlin.health_diary_backend.service;


import com.ChronicleGremlin.health_diary_backend.model.User;
import com.ChronicleGremlin.health_diary_backend.model.dto.UserProfileDTO;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public interface UserService {
    Optional<User> findByEmailAddress(String emailAddress);
    User save(User user);
    boolean existsByEmailAddress(String emailAddress);
    void updateUser(User user);

    User updateUserProfile(String email, UserProfileDTO dto);
}
