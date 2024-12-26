package com.bloodbank.inventory.repository;

import com.bloodbank.inventory.model.BloodTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BloodTransactionRepository extends JpaRepository<BloodTransaction, Long> {
    List<BloodTransaction> findByBloodGroup(String bloodGroup);
    List<BloodTransaction> findByTimestampBetween(LocalDateTime start, LocalDateTime end);
    List<BloodTransaction> findByTransactionType(BloodTransaction.TransactionType type);
}
