package com.bloodbank.donor.service;

import com.bloodbank.donor.model.Donor;
import com.bloodbank.donor.repository.DonorRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDate;
import java.time.Period;
import java.util.List;

@Service
public class DonorService {
    private static final Logger logger = LoggerFactory.getLogger(DonorService.class);

    @Autowired
    private DonorRepository donorRepository;

    public List<Donor> getAllDonors() {
        logger.info("Fetching all donors");
        return donorRepository.findAll();
    }

    public Donor getDonorById(Long id) {
        logger.info("Fetching donor with id: {}", id);
        return donorRepository.findById(id)
                .orElseThrow(() -> {
                    logger.error("Donor not found with id: {}", id);
                    return new EntityNotFoundException("Donor not found with id: " + id);
                });
    }

    public List<Donor> getDonorsByBloodGroup(String bloodGroup) {
        logger.info("Fetching donors with blood group: {}", bloodGroup);
        return donorRepository.findByBloodGroup(bloodGroup);
    }

    @Transactional
    public Donor createDonor(Donor donor) {
        logger.info("Creating new donor");
        if (donor.getEmail() != null && donorRepository.existsByEmail(donor.getEmail())) {
            logger.error("Email already registered");
            throw new IllegalArgumentException("Email already registered");
        }
        
        // Calculate age and check eligibility
        int age = Period.between(donor.getDateOfBirth(), LocalDate.now()).getYears();
        if (age < 18 || age > 65) {
            donor.setEligible(false);
        }
        
        return donorRepository.save(donor);
    }

    @Transactional
    public Donor updateDonor(Long id, Donor donorDetails) {
        logger.info("Updating donor with id: {}", id);
        Donor donor = getDonorById(id);
        
        donor.setName(donorDetails.getName());
        donor.setPhoneNumber(donorDetails.getPhoneNumber());
        donor.setEmail(donorDetails.getEmail());
        donor.setAddress(donorDetails.getAddress());
        
        return donorRepository.save(donor);
    }

    @Transactional
    public void recordDonation(Long id) {
        logger.info("Recording donation for donor with id: {}", id);
        Donor donor = getDonorById(id);
        
        // Check if enough time has passed since last donation (3 months)
        if (donor.getLastDonationDate() != null) {
            LocalDate minDonationDate = donor.getLastDonationDate().plusMonths(3);
            if (LocalDate.now().isBefore(minDonationDate)) {
                logger.error("Donor is not eligible for donation yet");
                throw new IllegalStateException("Donor is not eligible for donation yet");
            }
        }
        
        donor.setLastDonationDate(LocalDate.now());
        donor.setDonationCount(donor.getDonationCount() + 1);
        donorRepository.save(donor);
    }

    @Transactional
    public void deleteDonor(Long id) {
        logger.info("Deleting donor with id: {}", id);
        if (!donorRepository.existsById(id)) {
            logger.error("Donor not found with id: {}", id);
            throw new EntityNotFoundException("Donor not found with id: " + id);
        }
        donorRepository.deleteById(id);
    }

    public List<Donor> getEligibleDonors() {
        logger.info("Fetching eligible donors");
        return donorRepository.findByEligibleTrue();
    }
}
