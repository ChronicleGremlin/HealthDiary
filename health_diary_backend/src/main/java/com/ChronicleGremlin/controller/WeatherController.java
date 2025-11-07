package com.ChronicleGremlin.controller;


import com.ChronicleGremlin.model.dto.WeatherData;
import com.ChronicleGremlin.service.WeatherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.Map;

@RestController
@RequestMapping("/api/weather")
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"})
public class WeatherController {

    private final WeatherService weatherService;

    @Autowired
    public WeatherController(WeatherService weatherService) {
        this.weatherService = weatherService;
    }

    @GetMapping
    public ResponseEntity<?> getWeather(
            @RequestParam String location,
            @RequestParam String date) {
        try {
            validateParams(location, date);
            LocalDate eventDate = LocalDate.parse(date);
            WeatherData weatherData = weatherService.getWeatherData(location, eventDate);

            if (weatherData == null) {
                return ResponseEntity.ok(Map.of(
                        "message", "Weather data not available for this date",
                        "available", false
                ));
            }

            return ResponseEntity.ok(weatherData);
        } catch (DateTimeParseException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Invalid date format. Please use YYYY-MM-DD format");
        } catch (ResponseStatusException e) {
            throw e;
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "Error processing weather request: " + e.getMessage());
        }
    }

    private void validateParams(String location, String date) {
        if (!StringUtils.hasText(location)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Location cannot be empty");
        }
        if (!StringUtils.hasText(date)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Date cannot be empty");
        }
    }
}
