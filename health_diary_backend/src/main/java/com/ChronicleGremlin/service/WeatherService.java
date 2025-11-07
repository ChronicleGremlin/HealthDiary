package com.ChronicleGremlin.service;


import com.ChronicleGremlin.model.dto.WeatherData;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;

@Service
public class WeatherService {
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    @Value("${weather.api.key}")
    private String apiKey;

    public WeatherService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
        this.objectMapper = new ObjectMapper();
    }

    public WeatherData getWeatherData(String location, LocalDate eventDate) {
        try {
            // Validate inputs
            if (!StringUtils.hasText(location)) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Location cannot be empty");
            }

            if (eventDate == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Date cannot be null");
            }

            LocalDate today = LocalDate.now();
            long daysBetween = ChronoUnit.DAYS.between(today, eventDate);

            // If event is today, use current weather
            if (daysBetween == 0) {
                return getCurrentWeather(location);
            }
            // If event is within 5 days, use forecast
            else if (daysBetween > 0 && daysBetween <= 5) {
                return getForecastWeather(location, eventDate);
            }
            // If event is more than 5 days away, return null
            else {
                return null;
            }
        } catch (ResponseStatusException e) {
            throw e;
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "Error fetching weather data: " + e.getMessage());
        }
    }

    private WeatherData getCurrentWeather(String location) throws Exception {
        String url = String.format("%s/data/2.5/weather?q=%s&appid=%s&units=imperial", location, apiKey);
        String response = restTemplate.getForObject(url, String.class);
        JsonNode root = objectMapper.readTree(response);

        return extractWeatherData(root);
    }

    private WeatherData getForecastWeather(String location, LocalDate targetDate) throws Exception {
        String url = String.format("%s/data/2.5/forecast?q=%s&appid=%s&units=imperial", location, apiKey);
        String response = restTemplate.getForObject(url, String.class);
        JsonNode root = objectMapper.readTree(response);
        JsonNode list = root.path("list");

        // Format for comparing dates from the API response
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        String targetDateStr = targetDate.toString();

        // Find the forecast closest to the target date
        for (JsonNode forecast : list) {
            String dtTxt = forecast.path("dt_txt").asText();
            LocalDateTime forecastDateTime = LocalDateTime.parse(dtTxt, formatter);

            if (forecastDateTime.toLocalDate().equals(targetDate)) {
                return extractWeatherData(forecast);
            }
        }

        // If no exact match found, return null
        return null;
    }

    private WeatherData extractWeatherData(JsonNode weatherNode) {
        String icon = weatherNode.path("weather").get(0).path("icon").asText();
        double temp = weatherNode.path("main").path("temp").asDouble();
        String description = weatherNode.path("weather").get(0).path("description").asText();

        return new WeatherData(
                icon,
                String.format("%.1f°F", temp),
                description
        );
    }
}
