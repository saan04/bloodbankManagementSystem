package com.bloodbank.request.service;

import com.bloodbank.request.model.BloodRequest;
import com.bloodbank.request.repository.BloodRequestRepository;
import com.bloodbank.request.dto.InventoryResponse;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
public class BloodRequestService {

    @Autowired
    private BloodRequestRepository requestRepository;

    @Autowired
    private WebClient.Builder webClientBuilder;

    @Value("${inventory.service.url}")
    private String inventoryServiceUrl;

    public List<BloodRequest> getAllRequests() {
        return requestRepository.findAll();
    }

    public BloodRequest getRequestById(Long id) {
        return requestRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Blood request not found with id: " + id));
    }

    public List<BloodRequest> getRequestsByStatus(BloodRequest.RequestStatus status) {
        return requestRepository.findByStatus(status);
    }

    public List<BloodRequest> getRequestsByHospital(String hospitalName) {
        return requestRepository.findByHospitalName(hospitalName);
    }

    @Transactional
    public BloodRequest createRequest(BloodRequest request) {
        // Check inventory availability
        boolean isAvailable = checkInventoryAvailability(request.getBloodGroup(), request.getUnitsRequired());
        
        if (!isAvailable && request.getPriority() != BloodRequest.PriorityLevel.EMERGENCY) {
            request.setStatus(BloodRequest.RequestStatus.REJECTED);
            request.setRemarks("Insufficient blood units available");
        }

        return requestRepository.save(request);
    }

    @Transactional
    public BloodRequest updateRequestStatus(Long id, BloodRequest.RequestStatus newStatus) {
        BloodRequest request = getRequestById(id);
        
        if (newStatus == BloodRequest.RequestStatus.FULFILLED) {
            // Update inventory
            updateInventory(request.getBloodGroup(), request.getUnitsRequired());
        }
        
        request.setStatus(newStatus);
        return requestRepository.save(request);
    }

    public List<BloodRequest> getRequestsByDateRange(LocalDateTime start, LocalDateTime end) {
        return requestRepository.findByRequestDateBetween(start, end);
    }

    private boolean checkInventoryAvailability(String bloodGroup, int unitsRequired) {
        return webClientBuilder.build()
                .get()
                .uri(inventoryServiceUrl + "/api/inventory/{bloodGroup}/check?quantity={quantity}",
                        bloodGroup, unitsRequired)
                .retrieve()
                .bodyToMono(Boolean.class)
                .onErrorReturn(false)
                .block();
    }

    private void updateInventory(String bloodGroup, int units) {
        webClientBuilder.build()
                .post()
                .uri(inventoryServiceUrl + "/api/inventory/{bloodGroup}/request", bloodGroup)
                .bodyValue(Map.of("quantity", units))
                .retrieve()
                .bodyToMono(Void.class)
                .onErrorResume(e -> {
                    // Handle error, possibly revert the status change
                    return Mono.error(new RuntimeException("Failed to update inventory: " + e.getMessage()));
                })
                .block();
    }

    public void processEmergencyRequests() {
        List<BloodRequest> emergencyRequests = requestRepository.findByPriorityAndStatus(
                BloodRequest.PriorityLevel.EMERGENCY,
                BloodRequest.RequestStatus.PENDING
        );

        for (BloodRequest request : emergencyRequests) {
            if (checkInventoryAvailability(request.getBloodGroup(), request.getUnitsRequired())) {
                updateRequestStatus(request.getId(), BloodRequest.RequestStatus.APPROVED);
            }
        }
    }
}
