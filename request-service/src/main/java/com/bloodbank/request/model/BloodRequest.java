package com.bloodbank.request.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "blood_requests")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BloodRequest {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Patient name is required")
    @Column(name = "patient_name", nullable = false)
    private String patientName;

    @NotBlank(message = "Blood group is required")
    @Pattern(regexp = "^(A|B|AB|O)[+-]$", message = "Invalid blood group")
    @Column(name = "blood_group", nullable = false)
    private String bloodGroup;

    @NotNull(message = "Units required is mandatory")
    @Min(value = 1, message = "Units required must be at least 1")
    @Column(name = "units_required", nullable = false)
    private Integer unitsRequired;

    @NotBlank(message = "Hospital name is required")
    @Column(name = "hospital_name", nullable = false)
    private String hospitalName;

    @NotBlank(message = "Contact number is required")
    @Pattern(regexp = "^\\d{10}$", message = "Invalid contact number")
    @Column(name = "contact_number", nullable = false)
    private String contactNumber;

    @Column(name = "request_date", nullable = false)
    private LocalDateTime requestDate;

    @Column(name = "required_by")
    private LocalDateTime requiredBy;

    @NotNull(message = "Priority level is required")
    @Enumerated(EnumType.STRING)
    @Column(name = "priority", nullable = false)
    private PriorityLevel priority;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private RequestStatus status = RequestStatus.PENDING;

    private String remarks;

    @PrePersist
    protected void onCreate() {
        requestDate = LocalDateTime.now();
        if (requiredBy == null) {
            requiredBy = requestDate.plusDays(1);
        }
    }

    public enum PriorityLevel {
        EMERGENCY,
        HIGH,
        MEDIUM,
        LOW
    }

    public enum RequestStatus {
        PENDING,
        APPROVED,
        FULFILLED,
        REJECTED,
        CANCELLED
    }
}
