package com.bloodbank.inventory.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "blood_transactions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BloodTransaction {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Blood group is required")
    @Pattern(regexp = "^(A|B|AB|O)[+-]$", message = "Invalid blood group")
    @Column(name = "blood_group", nullable = false)
    private String bloodGroup;

    @NotNull(message = "Quantity is required")
    @Min(value = 1, message = "Quantity must be positive")
    @Column(nullable = false)
    private Integer quantity;

    @NotNull(message = "Transaction type is required")
    @Enumerated(EnumType.STRING)
    @Column(name = "transaction_type", nullable = false)
    private TransactionType transactionType;

    @Column(nullable = false)
    private LocalDateTime timestamp = LocalDateTime.now();

    private String remarks;

    public enum TransactionType {
        DONATION,
        REQUEST,
        DISCARD
    }
}
