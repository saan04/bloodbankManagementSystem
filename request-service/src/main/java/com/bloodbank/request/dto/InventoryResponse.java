package com.bloodbank.request.dto;

import lombok.Data;

@Data
public class InventoryResponse {
    private String bloodGroup;
    private Integer quantity;
    private Integer minThreshold;
}
