package com.bloodbank.inventory.service;

import com.bloodbank.inventory.model.BloodInventory;
import com.bloodbank.inventory.model.BloodTransaction;
import com.bloodbank.inventory.repository.BloodInventoryRepository;
import com.bloodbank.inventory.repository.BloodTransactionRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class BloodInventoryService {

    @Autowired
    private BloodInventoryRepository inventoryRepository;

    @Autowired
    private BloodTransactionRepository transactionRepository;

    public List<BloodInventory> getAllInventory() {
        return inventoryRepository.findAll();
    }

    public BloodInventory getInventoryByBloodGroup(String bloodGroup) {
        return inventoryRepository.findByBloodGroup(bloodGroup)
                .orElseThrow(() -> new EntityNotFoundException("Blood group not found: " + bloodGroup));
    }

    @Transactional
    public BloodInventory addBloodGroup(BloodInventory inventory) {
        if (inventory == null) {
            throw new IllegalArgumentException("Inventory cannot be null");
        }
        if (inventory.getBloodGroup() == null || !inventory.getBloodGroup().matches("^(A|B|AB|O)[+-]$")) {
            throw new IllegalArgumentException("Invalid blood group format");
        }
        if (inventoryRepository.existsByBloodGroup(inventory.getBloodGroup())) {
            throw new IllegalArgumentException("Blood group already exists: " + inventory.getBloodGroup());
        }
        if (inventory.getQuantity() == null) {
            inventory.setQuantity(0);
        }
        if (inventory.getMinThreshold() == null) {
            throw new IllegalArgumentException("Minimum threshold must be specified");
        }
        return inventoryRepository.save(inventory);
    }

    @Transactional
    public BloodInventory updateInventory(String bloodGroup, int quantity, BloodTransaction.TransactionType type) {
        BloodInventory inventory = getInventoryByBloodGroup(bloodGroup);
        int newQuantity;

        switch (type) {
            case DONATION:
                newQuantity = inventory.getQuantity() + quantity;
                break;
            case REQUEST:
                newQuantity = inventory.getQuantity() - quantity;
                if (newQuantity < 0) {
                    throw new IllegalStateException("Insufficient blood units available");
                }
                break;
            case DISCARD:
                newQuantity = inventory.getQuantity() - quantity;
                if (newQuantity < 0) {
                    throw new IllegalStateException("Cannot discard more units than available");
                }
                break;
            default:
                throw new IllegalArgumentException("Invalid transaction type");
        }

        // Record the transaction
        BloodTransaction transaction = new BloodTransaction();
        transaction.setBloodGroup(bloodGroup);
        transaction.setQuantity(quantity);
        transaction.setTransactionType(type);
        transaction.setRemarks("Inventory updated via " + type);
        transactionRepository.save(transaction);

        // Update inventory
        inventory.setQuantity(newQuantity);
        return inventoryRepository.save(inventory);
    }

    public List<BloodTransaction> getTransactionHistory() {
        return transactionRepository.findAll();
    }

    public List<BloodTransaction> getTransactionsByDateRange(LocalDateTime start, LocalDateTime end) {
        return transactionRepository.findByTimestampBetween(start, end);
    }

    public List<BloodTransaction> getTransactionsByType(BloodTransaction.TransactionType type) {
        return transactionRepository.findByTransactionType(type);
    }

    public boolean checkAvailability(String bloodGroup, int quantity) {
        try {
            BloodInventory inventory = getInventoryByBloodGroup(bloodGroup);
            System.out.println("Checking availability for " + bloodGroup + ": Required=" + quantity + ", Available=" + inventory.getQuantity());
            return inventory.getQuantity() >= quantity;
        } catch (EntityNotFoundException e) {
            System.err.println("Blood group " + bloodGroup + " not found in inventory");
            return false;
        }
    }

    public List<Map<String, Object>> checkLowInventory() {
        List<BloodInventory> inventories = getAllInventory();
        List<Map<String, Object>> alerts = new ArrayList<>();
        
        for (BloodInventory inventory : inventories) {
            if (inventory.getQuantity() <= inventory.getMinThreshold()) {
                Map<String, Object> alert = new HashMap<>();
                alert.put("bloodGroup", inventory.getBloodGroup());
                alert.put("currentQuantity", inventory.getQuantity());
                alert.put("minThreshold", inventory.getMinThreshold());
                alert.put("message", String.format("LOW INVENTORY ALERT: %s is below minimum threshold. Current quantity: %d",
                        inventory.getBloodGroup(), inventory.getQuantity()));
                alert.put("timestamp", LocalDateTime.now());
                alerts.add(alert);
            }
        }
        return alerts;
    }
}
