package com.example.robotjobtracker.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CreateRobotJobRequest(
        @NotBlank
        @Size(max = 120)
        String name,

        @Size(max = 500)
        String description,

        @NotNull
        @DecimalMin("-10000.0")
        @DecimalMax("10000.0")
        Double targetX,

        @NotNull
        @DecimalMin("-10000.0")
        @DecimalMax("10000.0")
        Double targetY
) {
}
