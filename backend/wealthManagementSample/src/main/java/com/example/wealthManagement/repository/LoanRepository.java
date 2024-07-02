package com.example.wealthManagement.repository;

import com.example.wealthManagement.entity.Loan;

import jakarta.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface LoanRepository extends JpaRepository<Loan, Long> {
	List<Loan> findByUsername(String username);

	void deleteByUsername(String username);

	void deleteById(Long userId);
	
	@Modifying
	@Transactional
	@Query("UPDATE Loan l SET l.emiStatus = true WHERE l.username = :username AND l.id = :id")
	void changeStatusTrue(@Param("id") Long id,@Param("username") String username);

	Loan getLoanByDescription(String description);
}