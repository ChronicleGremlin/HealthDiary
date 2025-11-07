package com.ChronicleGremlin.repository;
import com.ChronicleGremlin.model.User;

import com.ChronicleGremlin.model.Report;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ReportRepository extends JpaRepository<Report, Integer> {

    List<Report> findAllByUser(User user);

    Optional<Report> findByIdAndUser(Integer id, User user);

    Optional<Report> findByNameAndUser(String name, User user);

    //To find past, upcoming, and dates within a specific range
    List<Report> findByDateBetweenAndUser(LocalDate startDate, LocalDate endDate, User user);

    @Query("SELECT e FROM Report e WHERE e.user = :user AND (e.date > :currentDate OR (e.date = :currentDate AND e.time > :currentTime))")
    List<Report> findUpcomingReports(@Param("user") User user,
                                   @Param("currentDate") LocalDate currentDate,
                                   @Param("currentTime") LocalTime currentTime);

    List<Report> findByUserAndDateGreaterThanEqualOrderByDateAsc(User user, LocalDate date);

    default List<Report> findUpcomingReportsByUser(User user) {
        return findByUserAndDateGreaterThanEqualOrderByDateAsc(user, LocalDate.now());
    }

    @Query("SELECT e FROM Report e WHERE e.date >= :currentDate ORDER BY e.date ASC")
    List<Report> findUpcomingReports(@Param("currentDate") LocalDate currentDate);

    default List<Report> findUpcomingReports() {
        return findUpcomingReports(LocalDate.now());
    }

}

