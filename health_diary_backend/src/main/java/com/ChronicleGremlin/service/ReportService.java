package com.ChronicleGremlin.service;


import com.ChronicleGremlin.model.Report;
import com.ChronicleGremlin.model.User;
import com.ChronicleGremlin.model.dto.UpcomingReportsDTO;
import com.ChronicleGremlin.model.dto.WeatherData;
import com.ChronicleGremlin.repository.ReportRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ReportService {
    private final ReportRepository reportRepository;
    private final CalendarService calendarService;
    private final WeatherService weatherService;


    public ReportService(ReportRepository reportRepository, CalendarService calendarService, WeatherService weatherService) {
        this.reportRepository = reportRepository;
        this.calendarService = calendarService;
        this.weatherService = weatherService;
    }

    public List<Report> findAllReports(User user) {
        return reportRepository.findAllByUser(user);
    }

    public Optional<Report> findReportById(Integer id, User user) {
        return reportRepository.findByIdAndUser(id, user);
    }

    public Optional<Report> findReportByName(String name, User user) {
        return reportRepository.findByNameAndUser(name, user);
    }

    //Will need to add some later
    public Report addReport(Report report, User user) {
        // Set the user
        report.setUser(user);

        // Set the user's calendar automatically
        calendarService.findCalendarByUser(user)
                .ifPresent(report::setCalendar);

        return reportRepository.save(report);
    }

    public Report updateReport(Integer id, Report updatedReport, User user) {
        return reportRepository.findById(id)
                .map(existingReport -> {
                    // Update basic fields
                    existingReport.setName(updatedReport.getName());
                    existingReport.setDate(updatedReport.getDate());
                    existingReport.setTime(updatedReport.getTime());
                    existingReport.setNotes(updatedReport.getNotes());

                    // Calendar relationship remains unchanged as it's tied to the user
                    return reportRepository.save(existingReport);
                })
                .orElseThrow(() -> new RuntimeException("Report not found"));
    }

    public boolean deleteReport(Integer id, User user) {
        Optional<Report> report = reportRepository.findByIdAndUser(id, user);
        if (report.isPresent()) {
            reportRepository.delete(report.get());
            return true;
        }
        return false;
    }

    public List<Report> findUpcomingReportsByUser(User user) {
        LocalDate currentDate = LocalDate.now();
        LocalTime currentTime = LocalTime.now();

        // Call the new repository method with separate date and time
        return reportRepository.findUpcomingReports(user, currentDate, currentTime);
    }

    public Optional<Report> repeatReport(Integer id, Report newReportDetails, User user) {
        return reportRepository.findByIdAndUser(id, user).map(originalReport -> {
            //Create new report with all original data
            Report newReport = new Report();

            //Copy all basic fields from original report
            newReport.setName(originalReport.getName());
            newReport.setDate(originalReport.getDate());
            newReport.setTime(originalReport.getTime());
            newReport.setNotes(originalReport.getNotes());

            //Copy all relationships from original report
            newReport.setCalendar(originalReport.getCalendar());
            newReport.setUser(user);

            //Update with new values if provided
            if (newReportDetails.getName() != null) {
                newReport.setName(newReportDetails.getName());
            }

            //Date and time must be changed for repeat entry
            if (newReportDetails.getDate() == null || newReportDetails.getTime() == null) {
                throw new RuntimeException("Date and time must be provided for repeat entry");
            }
            newReport.setDate(newReportDetails.getDate());
            newReport.setTime(newReportDetails.getTime());

            if (newReportDetails.getNotes() != null) {
                newReport.setNotes(newReportDetails.getNotes());
            }

            //Update relationships if new values are provided
            return reportRepository.save(newReport);
        });
    }

    public List<UpcomingReportsDTO> findUpcomingReportsWithWeather(User user) {
        LocalDate currentDate = LocalDate.now();
        LocalTime currentTime = LocalTime.now();
        List<Report> reports = reportRepository.findUpcomingReports(user, currentDate, currentTime);
        return reports.stream()
                .map(report -> {
                    String location = report.getLocation() != null ? report.getLocation() : "No location set";
                    WeatherData weatherData = weatherService.getWeatherData(location, report.getDate());
                    return new UpcomingReportsDTO(report, weatherData);
                })
                .collect(Collectors.toList());
    }
}

