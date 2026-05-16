package com.example.robotjobtracker.repository;

import com.example.robotjobtracker.entity.RobotJob;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RobotJobRepository extends JpaRepository<RobotJob, Long> {
}
