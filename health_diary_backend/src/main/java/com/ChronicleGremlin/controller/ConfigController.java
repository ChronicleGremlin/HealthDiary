package com.ChronicleGremlin.controller;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/config")
public class ConfigController {
    @Value("${weather.api.key}")
    private String weatherApiKey;

    @Value("${weather.api.url}")
    private String weatherApiUrl;

    @GetMapping("/weather-config")
    public Map<String, String> getWeatherConfig() {
        Map<String, String> config = new HashMap<>();
        config.put("weatherApiKey", weatherApiKey);
        config.put("weatherApiUrl", weatherApiUrl);
        return config;
    }
}
