package com.example.robotjobtracker.dto;

import com.example.robotjobtracker.entity.JobStatus;
import jakarta.validation.constraints.NotNull;

public record UpdateRobotJobStatusRequest(@NotNull JobStatus status) {
}
