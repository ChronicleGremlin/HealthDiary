package com.ChronicleGremlin.health_diary_backend.service;

import com.ChronicleGremlin.health_diary_backend.model.Calendar;
import com.ChronicleGremlin.health_diary_backend.model.User;
import com.ChronicleGremlin.health_diary_backend.model.dto.UserProfileDTO;
import com.ChronicleGremlin.health_diary_backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    // Assign a default calendar when a new user registers
    private final CalendarService calendarService;

    public UserServiceImpl(UserRepository userRepository, CalendarService calendarService) {
        this.userRepository = userRepository;
        this.calendarService = calendarService;
    }

    @Override
    public Optional<User> findByEmailAddress(String emailAddress) {
        return userRepository.findByEmailAddress(emailAddress);
    }

    @Override
    public User save(User user) {
        // Save the user in database first
        User savedUser = userRepository.save(user);

        // Create and save a calendar for the user if they don't have one
        if (savedUser.getCalendar() == null) {
            Calendar calendar = new Calendar();
            calendar.setUser(savedUser);
            calendarService.addCalendar(calendar, savedUser);
        }

        return savedUser;
    }

    @Override
    public boolean existsByEmailAddress(String emailAddress) {
        return userRepository.existsByEmailAddress(emailAddress);
    }

    public void updateUser(User user) {
        userRepository.save(user);
    }

    @Override
    public User updateUserProfile(String email, UserProfileDTO dto) {
        // Check if the user exists
        Optional<User> userOpt = userRepository.findByEmailAddress(email);
        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found");
        }

        User user = userOpt.get();
        user.setName(dto.getName());
        user.setEmailAddress(dto.getEmailAddress());
        user.setPictureUrl(dto.getPictureUrl());

        return userRepository.save(user);
    }
}
