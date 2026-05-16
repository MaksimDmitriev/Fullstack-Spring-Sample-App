package com.example.robotjobtracker.dto;

import com.example.robotjobtracker.entity.JobStatus;
import com.example.robotjobtracker.entity.RobotJob;
import java.time.Instant;

public record RobotJobResponse(
        Long id,
        String name,
        String description,
        Double targetX,
        Double targetY,
        JobStatus status,
        Instant createdAt,
        Instant updatedAt
) {
    public static RobotJobResponse from(RobotJob job) {
        return new RobotJobResponse(
                job.getId(),
                job.getName(),
                job.getDescription(),
                job.getTargetX(),
                job.getTargetY(),
                job.getStatus(),
                job.getCreatedAt(),
                job.getUpdatedAt()
        );
    }
}
