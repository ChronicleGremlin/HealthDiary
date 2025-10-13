package com.ChronicleGremlin.health_diary_backend.repository;


import com.ChronicleGremlin.health_diary_backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<Object> findByName(String name);
    Optional<User> findByEmailAddress(String emailAddress);
    Optional<User> findByVerificationToken(String token);
    boolean existsByEmailAddress(String emailAddress);
    List<User> findByEmailVerifiedTrue();


}
