package com.bloodbank.request.repository;

import com.bloodbank.request.model.BloodRequest;
import com.bloodbank.request.model.BloodRequest.RequestStatus;
import com.bloodbank.request.model.BloodRequest.PriorityLevel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BloodRequestRepository extends JpaRepository<BloodRequest, Long> {
    List<BloodRequest> findByStatus(RequestStatus status);
    List<BloodRequest> findByBloodGroupAndStatus(String bloodGroup, RequestStatus status);
    List<BloodRequest> findByPriorityAndStatus(PriorityLevel priority, RequestStatus status);
    List<BloodRequest> findByRequestDateBetween(LocalDateTime start, LocalDateTime end);
    List<BloodRequest> findByHospitalName(String hospitalName);
}
