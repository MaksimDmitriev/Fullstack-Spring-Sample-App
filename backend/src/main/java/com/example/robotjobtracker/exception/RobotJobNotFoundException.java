package com.example.robotjobtracker.exception;

public class RobotJobNotFoundException extends RuntimeException {
    public RobotJobNotFoundException(Long id) {
        super("Robot job %d was not found".formatted(id));
    }
}
