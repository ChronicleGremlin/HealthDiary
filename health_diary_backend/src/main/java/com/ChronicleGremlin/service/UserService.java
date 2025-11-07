package com.ChronicleGremlin.service;


import com.ChronicleGremlin.model.User;
import com.ChronicleGremlin.model.dto.UserProfileDTO;
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
