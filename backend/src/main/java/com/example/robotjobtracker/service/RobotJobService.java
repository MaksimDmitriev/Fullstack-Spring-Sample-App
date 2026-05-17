package com.example.robotjobtracker.service;

import com.example.robotjobtracker.dto.CreateRobotJobRequest;
import com.example.robotjobtracker.dto.RobotJobResponse;
import com.example.robotjobtracker.entity.JobStatus;
import com.example.robotjobtracker.entity.RobotJob;
import com.example.robotjobtracker.exception.RobotJobNotFoundException;
import com.example.robotjobtracker.repository.RobotJobRepository;
import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class RobotJobService {
    private final RobotJobRepository repository;

    public RobotJobService(RobotJobRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public List<RobotJobResponse> listJobs() {
        return repository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"))
                .stream()
                .map(RobotJobResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public RobotJobResponse getJob(Long id) {
        return RobotJobResponse.from(findJob(id));
    }

    @Transactional(readOnly = true)
    public List<RobotJobResponse> getJobsByStatus(JobStatus status) {
        return repository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"))
                .stream().filter(j -> j.getStatus() == status)
                .map(RobotJobResponse::from).toList();
    }

    @Transactional
    public RobotJobResponse createJob(CreateRobotJobRequest request) {
        RobotJob job = new RobotJob(
                request.name().trim(),
                request.description(),
                request.targetX(),
                request.targetY()
        );
        return RobotJobResponse.from(repository.save(job));
    }

    @Transactional
    public RobotJobResponse updateStatus(Long id, JobStatus status) {
        RobotJob job = findJob(id);
        job.setStatus(status);
        return RobotJobResponse.from(job);
    }

    @Transactional
    public void deleteJob(Long id) {
        if (!repository.existsById(id)) {
            throw new RobotJobNotFoundException(id);
        }
        repository.deleteById(id);
    }

    private RobotJob findJob(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RobotJobNotFoundException(id));
    }
}
