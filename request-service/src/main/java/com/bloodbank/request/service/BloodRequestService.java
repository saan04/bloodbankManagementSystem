package com.bloodbank.request.service;

import com.bloodbank.request.model.BloodRequest;
import com.bloodbank.request.repository.BloodRequestRepository;
import com.bloodbank.request.dto.BloodInventory;
import com.bloodbank.request.dto.InventoryResponse;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.util.UriUtils;
import reactor.core.publisher.Mono;

import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.ArrayList;
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
        // First check if inventory exists
        BloodInventory inventory = getInventory(request.getBloodGroup());
        if (inventory == null) {
            request.setStatus(BloodRequest.RequestStatus.REJECTED);
            request.setRemarks("Blood group not available in inventory");
            return requestRepository.save(request);
        }

        // Then check if enough quantity is available
        if (inventory.getQuantity() >= request.getUnitsRequired() || 
            request.getPriority() == BloodRequest.PriorityLevel.EMERGENCY) {
            request.setStatus(BloodRequest.RequestStatus.PENDING);
        } else {
            request.setStatus(BloodRequest.RequestStatus.REJECTED);
            request.setRemarks("Insufficient blood units available");
        }

        return requestRepository.save(request);
    }

    @Transactional
    public BloodRequest updateRequestStatus(Long id, BloodRequest.RequestStatus newStatus) {
        BloodRequest request = getRequestById(id);
        
        if (newStatus == BloodRequest.RequestStatus.FULFILLED) {
            updateInventory(request.getBloodGroup(), request.getUnitsRequired());
        }
        
        request.setStatus(newStatus);
        return requestRepository.save(request);
    }

    public List<BloodRequest> getRequestsByDateRange(LocalDateTime start, LocalDateTime end) {
        return requestRepository.findByRequestDateBetween(start, end);
    }

    private BloodInventory getInventory(String bloodGroup) {
        try {
            return webClientBuilder.build()
                    .get()
                    .uri(inventoryServiceUrl + "/api/inventory/{bloodGroup}", bloodGroup)
                    .retrieve()
                    .bodyToMono(BloodInventory.class)
                    .doOnError(e -> System.err.println("Error getting inventory: " + e.getMessage()))
                    .block();
        } catch (Exception e) {
            System.err.println("Error getting inventory: " + e.getMessage());
            e.printStackTrace();
            return null;
        }
    }

    private void updateInventory(String bloodGroup, int units) {
        try {
            WebClient client = WebClient.builder()
                .baseUrl(inventoryServiceUrl)
                .build();

            client.post()
                .uri("/api/inventory/{bloodGroup}/request", bloodGroup)
                .bodyValue(Map.of("quantity", units))
                .retrieve()
                .bodyToMono(Void.class)
                .onErrorResume(e -> {
                    System.err.println("Failed to update inventory: " + e.getMessage());
                    return Mono.error(new RuntimeException("Failed to update inventory: " + e.getMessage()));
                })
                .block();
        } catch (Exception e) {
            System.err.println("Failed to update inventory: " + e.getMessage());
            throw new RuntimeException("Failed to update inventory: " + e.getMessage());
        }
    }

    public List<BloodRequest> processEmergencyRequests() {
        List<BloodRequest> emergencyRequests = requestRepository.findByPriorityAndStatus(
                BloodRequest.PriorityLevel.EMERGENCY,
                BloodRequest.RequestStatus.PENDING
        );

        List<BloodRequest> processedRequests = new ArrayList<>();
        for (BloodRequest request : emergencyRequests) {
            BloodInventory inventory = getInventory(request.getBloodGroup());
            if (inventory != null && inventory.getQuantity() >= request.getUnitsRequired()) {
                request = updateRequestStatus(request.getId(), BloodRequest.RequestStatus.APPROVED);
                processedRequests.add(request);
            }
        }
        return processedRequests;
    }

    private boolean checkInventoryAvailability(String bloodGroup, int unitsRequired) {
        try {
            System.out.println("Checking inventory for blood group: " + bloodGroup + ", units required: " + unitsRequired);
            String encodedBloodGroup = UriUtils.encodePathSegment(bloodGroup, StandardCharsets.UTF_8);
            Boolean available = webClientBuilder.build()
                    .get()
                    .uri(uriBuilder -> uriBuilder
                        .path(inventoryServiceUrl + "/{bloodGroup}/check")
                        .queryParam("quantity", unitsRequired)
                        .build(encodedBloodGroup))
                    .retrieve()
                    .bodyToMono(Boolean.class)
                    .onErrorReturn(false)
                    .block();
            System.out.println("Availability check result: " + available);
            return available != null && available;
        } catch (Exception e) {
            System.err.println("Error checking inventory availability: " + e.getMessage());
            return false;
        }
    }
}
