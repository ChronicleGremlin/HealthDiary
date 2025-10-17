package com.ChronicleGremlin.health_diary_backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
public class Report extends AbstractEntity {

    @ManyToOne
    @JsonIgnore
    private User user;

    @ManyToOne
    @JsonIgnore
    private Calendar calendar;

    @NotBlank(message = "Field must have valid report name entered")
    @Size(min = 3, max = 100, message = "Field must be between 3 and 100 characters")
    private String name;

    @NotNull(message = "Field must have valid report date entered")
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private LocalDate date;

    @NotNull(message = "Field must have valid report time entered")
    @DateTimeFormat(pattern = "HH:mm")
    private LocalTime time;

    @Size(max = 500, message = "Field must be less than 500 characters")
    private String notes;

    //@ManyToMany
    //private List<Medications> medications = new ArrayList<>();

    //@ManyToMany
    //private Doctors doctors;

    //@ManyToMany
    //private Hydration hydration;

    //@ManyToOne
    //private Breakfast breakfast;

    //@ManyToOne
    //private Lunch lunch;

    //@ManyToOne
    //private Dinner dinner;

    //@ManyToMany
    //private Snacks snacks;

    // Constructor

    public Report() {
    }

    public Report(String name, LocalDate date, LocalTime time, String notes) {
        this.name = name;
        this.date = date;
        this.time = time;
        this.notes = notes;
    }

    // Getters and setters

    public Calendar getCalendar() {
        return calendar;
    }

    public void setCalendar(Calendar calendar) {
        this.calendar = calendar;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public LocalTime getTime() {
        return time;
    }

    public void setTime(LocalTime time) {
        this.time = time;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    @Override
    public String toString() {
        return name;
    }

}
