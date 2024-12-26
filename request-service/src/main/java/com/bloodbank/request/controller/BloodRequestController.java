package com.bloodbank.request.controller;

import com.bloodbank.request.model.BloodRequest;
import com.bloodbank.request.service.BloodRequestService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/requests")
public class BloodRequestController {

    @Autowired
    private BloodRequestService requestService;

    @GetMapping
    public ResponseEntity<List<BloodRequest>> getAllRequests() {
        return ResponseEntity.ok(requestService.getAllRequests());
    }

    @GetMapping("/{id}")
    public ResponseEntity<BloodRequest> getRequestById(@PathVariable Long id) {
        return ResponseEntity.ok(requestService.getRequestById(id));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<BloodRequest>> getRequestsByStatus(
            @PathVariable BloodRequest.RequestStatus status) {
        return ResponseEntity.ok(requestService.getRequestsByStatus(status));
    }

    @GetMapping("/hospital/{hospitalName}")
    public ResponseEntity<List<BloodRequest>> getRequestsByHospital(
            @PathVariable String hospitalName) {
        return ResponseEntity.ok(requestService.getRequestsByHospital(hospitalName));
    }

    @PostMapping
    public ResponseEntity<BloodRequest> createRequest(@Valid @RequestBody BloodRequest request) {
        return new ResponseEntity<>(requestService.createRequest(request), HttpStatus.CREATED);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<BloodRequest> updateRequestStatus(
            @PathVariable Long id,
            @RequestParam BloodRequest.RequestStatus status) {
        return ResponseEntity.ok(requestService.updateRequestStatus(id, status));
    }

    @GetMapping("/date-range")
    public ResponseEntity<List<BloodRequest>> getRequestsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        return ResponseEntity.ok(requestService.getRequestsByDateRange(start, end));
    }

    @PostMapping("/process-emergency")
    public ResponseEntity<Void> processEmergencyRequests() {
        requestService.processEmergencyRequests();
        return ResponseEntity.ok().build();
    }
}
