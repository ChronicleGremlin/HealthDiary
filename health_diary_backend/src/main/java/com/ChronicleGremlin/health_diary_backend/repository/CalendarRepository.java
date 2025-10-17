package com.ChronicleGremlin.health_diary_backend.repository;

import com.ChronicleGremlin.health_diary_backend.model.Calendar;
import com.ChronicleGremlin.health_diary_backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CalendarRepository extends JpaRepository<Calendar, Integer> {


    //FindBy instead of FindAllBy because each user should only have one Calendar
    Optional<Calendar> findByUser(User user);

    //To find a specific calendar by id
    Optional<Calendar> findByIdAndUser(Integer id, User user);


}
