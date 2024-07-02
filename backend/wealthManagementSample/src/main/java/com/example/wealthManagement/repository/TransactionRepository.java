package com.example.wealthManagement.repository;

import com.example.wealthManagement.entity.Transaction;
import com.example.wealthManagement.entity.TransactionType;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
	@Query("SELECT SUM(CASE WHEN t.type = 'INCOME' THEN t.amount ELSE t.amount END) " +
	           "FROM Transaction t WHERE t.user.id = :userId")
	Double findCurrentBalanceByUserId(@Param("userId") Long userId);

	List<Transaction> findByUserId(Long userId);

	List<Transaction> findByUserIdAndTypeAndDateBetween(Long userId, TransactionType income, LocalDateTime atStartOfDay,
			LocalDateTime atStartOfDay2);

	List<Transaction> findByUsernameAndTypeAndDateBetween(String username, TransactionType expense,
			LocalDateTime atStartOfDay, LocalDateTime atStartOfDay2);

	List<Transaction> findByUsernameOrderByDateDesc(String username);
	
	@Query("SELECT SUM(CASE WHEN t.type = 'INCOME' THEN t.amount ELSE t.amount END) " +
	           "FROM Transaction t WHERE t.username = :username")
	Double findCurrentBalanceByUsername(@Param("username") String username);
}