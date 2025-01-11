package com.bloodbank.request.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class BloodInventory {
    private Long id;
    private String bloodGroup;
    private Integer quantity;
    private LocalDateTime lastUpdated;
    private Integer minThreshold;
}
