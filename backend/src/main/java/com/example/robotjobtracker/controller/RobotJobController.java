package com.example.robotjobtracker.controller;

import com.example.robotjobtracker.dto.CreateRobotJobRequest;
import com.example.robotjobtracker.dto.RobotJobResponse;
import com.example.robotjobtracker.dto.UpdateRobotJobStatusRequest;
import com.example.robotjobtracker.service.RobotJobService;
import jakarta.validation.Valid;
import java.net.URI;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/jobs")
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173"})
public class RobotJobController {
    private final RobotJobService service;

    public RobotJobController(RobotJobService service) {
        this.service = service;
    }

    @GetMapping
    public List<RobotJobResponse> listJobs() {
        return service.listJobs();
    }

    @GetMapping("/{id}")
    public RobotJobResponse getJob(@PathVariable Long id) {
        return service.getJob(id);
    }

    @PostMapping
    public ResponseEntity<RobotJobResponse> createJob(@Valid @RequestBody CreateRobotJobRequest request) {
        RobotJobResponse created = service.createJob(request);
        return ResponseEntity.created(URI.create("/api/jobs/" + created.id())).body(created);
    }

    @PatchMapping("/{id}/status")
    public RobotJobResponse updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateRobotJobStatusRequest request
    ) {
        return service.updateStatus(id, request.status());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteJob(@PathVariable Long id) {
        service.deleteJob(id);
        return ResponseEntity.noContent().build();
    }
}
