package com.ChronicleGremlin.model.dto;


import com.ChronicleGremlin.model.Report;
import com.fasterxml.jackson.annotation.JsonInclude;

import java.time.LocalDate;
import java.time.LocalTime;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class UpcomingReportsDTO {

    private Integer id;
    private String name;
    private LocalDate date;
    private LocalTime time;
    private String location;
    private WeatherData weatherData;

    public UpcomingReportsDTO() {
    }

    public UpcomingReportsDTO(Report report, WeatherData weatherData) {
        this.id = report.getId();
        this.name = report.getName();
        this.date = report.getDate();
        this.time = report.getTime();
        this.location = report.getLocation() != null ? report.getLocation() : "No location set";
        this.weatherData = weatherData;
    }

    // Getters and setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
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

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public WeatherData getWeatherData() {
        return weatherData;
    }

    public void setWeatherData(WeatherData weatherData) {
        this.weatherData = weatherData;
    }
}
