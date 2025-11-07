package com.ChronicleGremlin.model.dto;


import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class WeatherData {
    @JsonProperty("icon")
    private String icon;

    @JsonProperty("temperature")
    private String temperature;

    @JsonProperty("description")
    private String description;

    public WeatherData() {
    }


    public WeatherData(String icon, String temperature, String description) {
        this.icon = icon;
        this.temperature = temperature;
        this.description = description;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }

    public String getTemperature() {
        return temperature;
    }

    public void setTemperature(String temperature) {
        this.temperature = temperature;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    // toString method for debugging
    @Override
    public String toString() {
        return "WeatherData{" +
                "icon='" + icon + '\'' +
                ", temperature='" + temperature + '\'' +
                ", description='" + description + '\'' +
                '}';
    }
}
