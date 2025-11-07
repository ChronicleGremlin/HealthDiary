package com.ChronicleGremlin.controller;


import com.ChronicleGremlin.model.Report;
import com.ChronicleGremlin.model.User;
import com.ChronicleGremlin.model.dto.UpcomingReportsDTO;
import com.ChronicleGremlin.service.ReportService;
import com.ChronicleGremlin.utilities.AuthUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"})
public class ReportController {

    private final ReportService reportService;
    private final AuthUtil authUtil;

    public ReportController(ReportService reportService, AuthUtil authUtil) {
        this.reportService = reportService;
        this.authUtil = authUtil;
    }

    // Get all reports for the current user
    @GetMapping("/all")
    public ResponseEntity<List<Report>> getAllReports() {
        User user = authUtil.getUserFromAuthentication();
        return ResponseEntity.ok(reportService.findAllReports(user));
    }

    @GetMapping("/find/{id}")
    public ResponseEntity<Report> getReportById(@PathVariable("id") Integer id) {
        User user = authUtil.getUserFromAuthentication();
        return ResponseEntity.of(reportService.findReportById(id, user));
    }

    @GetMapping("/find/name/{name}")
    public ResponseEntity<Report> getReportByName(@PathVariable("name") String name) {
        User user = authUtil.getUserFromAuthentication();
        return ResponseEntity.of(reportService.findReportByName(name, user));
    }

    @GetMapping("/find/location/{location}")
    public ResponseEntity<Report> getReportByLocation(@PathVariable("location") String location) {
        User user = authUtil.getUserFromAuthentication();
        return ResponseEntity.of(reportService.findReportByName(location, user));
    }

    @PostMapping("/add")
    public ResponseEntity<Report> addReport(@RequestBody Report report) {
        User user = authUtil.getUserFromAuthentication();
        Report savedReport = reportService.addReport(report, user);
        return ResponseEntity.ok(savedReport);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Report> updateReport(@PathVariable("id") Integer id, @RequestBody Report report) {
        User user = authUtil.getUserFromAuthentication();
        try {
            return ResponseEntity.ok(reportService.updateReport(id, report, user));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteReport(@PathVariable("id") Integer id) {
        User user = authUtil.getUserFromAuthentication();
        boolean deleted = reportService.deleteReport(id, user);
        return deleted ? ResponseEntity.ok().build() : ResponseEntity.notFound().build();
    }

    @GetMapping("/upcoming-reports")
    public ResponseEntity<List<UpcomingReportsDTO>> getUpcomingReports() {
        try {
            User user = authUtil.getUserFromAuthentication();
            List<UpcomingReportsDTO> reports = reportService.findUpcomingReportsWithWeather(user);
            return ResponseEntity.ok(reports);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/repeat/{id}")
    public ResponseEntity<?> repeatRecord(@PathVariable("id") Integer id, @RequestBody Report newReportDetails) {
        User user = authUtil.getUserFromAuthentication();
        try {
            return reportService.repeatReport(id, newReportDetails, user)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (RuntimeException e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}


