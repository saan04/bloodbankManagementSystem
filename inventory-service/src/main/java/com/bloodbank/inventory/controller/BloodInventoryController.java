package com.bloodbank.inventory.controller;

import com.bloodbank.inventory.model.BloodInventory;
import com.bloodbank.inventory.model.BloodTransaction;
import com.bloodbank.inventory.service.BloodInventoryService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/inventory")
public class BloodInventoryController {

    @Autowired
    private BloodInventoryService inventoryService;

    @GetMapping
    public ResponseEntity<List<BloodInventory>> getAllInventory() {
        return ResponseEntity.ok(inventoryService.getAllInventory());
    }

    @GetMapping("/{bloodGroup}")
    public ResponseEntity<BloodInventory> getInventoryByBloodGroup(
            @PathVariable String bloodGroup) {
        return ResponseEntity.ok(inventoryService.getInventoryByBloodGroup(bloodGroup));
    }

    @PostMapping
    public ResponseEntity<BloodInventory> addBloodGroup(@Valid @RequestBody BloodInventory inventory) {
        return new ResponseEntity<>(inventoryService.addBloodGroup(inventory), HttpStatus.CREATED);
    }

    @PostMapping("/{bloodGroup}/donate")
    public ResponseEntity<BloodInventory> processDonation(
            @PathVariable String bloodGroup,
            @RequestBody Map<String, Integer> donation) {
        return ResponseEntity.ok(inventoryService.updateInventory(
                bloodGroup,
                donation.get("quantity"),
                BloodTransaction.TransactionType.DONATION));
    }

    @PostMapping("/{bloodGroup}/request")
    public ResponseEntity<BloodInventory> processRequest(
            @PathVariable String bloodGroup,
            @RequestBody Map<String, Integer> request) {
        try {
            Integer quantity = request.get("quantity");
            if (quantity == null) {
                throw new IllegalArgumentException("Quantity must be specified");
            }
            BloodInventory inventory = inventoryService.updateInventory(
                bloodGroup,
                quantity,
                BloodTransaction.TransactionType.REQUEST);
            return ResponseEntity.ok(inventory);
        } catch (Exception e) {
            throw new IllegalArgumentException("Failed to process request: " + e.getMessage());
        }
    }

    @GetMapping("/transactions")
    public ResponseEntity<List<BloodTransaction>> getAllTransactions() {
        return ResponseEntity.ok(inventoryService.getTransactionHistory());
    }

    @GetMapping("/transactions/date-range")
    public ResponseEntity<List<BloodTransaction>> getTransactionsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        return ResponseEntity.ok(inventoryService.getTransactionsByDateRange(start, end));
    }

    @GetMapping("/transactions/{type}")
    public ResponseEntity<List<BloodTransaction>> getTransactionsByType(
            @PathVariable BloodTransaction.TransactionType type) {
        return ResponseEntity.ok(inventoryService.getTransactionsByType(type));
    }

    @GetMapping("/{bloodGroup}/check")
    public ResponseEntity<Boolean> checkAvailability(
            @PathVariable String bloodGroup,
            @RequestParam int quantity) {
        try {
            System.out.println("Received availability check for blood group: " + bloodGroup + ", quantity: " + quantity);
            boolean available = inventoryService.checkAvailability(bloodGroup, quantity);
            System.out.println("Availability result: " + available);
            return ResponseEntity.ok(available);
        } catch (Exception e) {
            System.err.println("Error checking availability: " + e.getMessage());
            throw e;
        }
    }

    @GetMapping("/check-low-inventory")
    public ResponseEntity<List<Map<String, Object>>> checkLowInventory() {
        return ResponseEntity.ok(inventoryService.checkLowInventory());
    }
}
