package com.example.wealthManagement.service;
import com.example.wealthManagement.entity.Transaction;
import com.example.wealthManagement.entity.TransactionType;
import com.example.wealthManagement.repository.TransactionRepository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TransactionService {
    @Autowired
    private TransactionRepository transactionRepository;

    public Transaction recordTransaction(Transaction transaction) {
        return transactionRepository.save(transaction);
    }

	public List<Transaction> getAllTransactions(String username) {
		return transactionRepository.findByUsernameOrderByDateDesc(username);
	}
	
	 public Double getCurrentBalance(String username) {
	        Double balance = transactionRepository.findCurrentBalanceByUsername(username);
	        return balance != null ? balance : 0.0;
	    }
	 
	 public List<Transaction> getTransactionsByUser(String username) {
	        return transactionRepository.findByUsernameOrderByDateDesc(username);
	    }

	    public double calculateMonthlyExpense(String username, int month, int year) {
	        List<Transaction> transactions = transactionRepository.findByUsernameAndTypeAndDateBetween(
	                username, TransactionType.EXPENSE,
	                LocalDate.of(year, month, 1).atStartOfDay(),
	                LocalDate.of(year, month, 1).plusMonths(1).atStartOfDay()
	        );
	        return transactions.stream().mapToDouble(Transaction::getAmount).sum();
	    }

	    public double calculateMonthlyIncome(String username, int month, int year) {
	        List<Transaction> transactions = transactionRepository.findByUsernameAndTypeAndDateBetween(
	                username, TransactionType.INCOME,
	                LocalDate.of(year, month, 1).atStartOfDay(),
	                LocalDate.of(year, month, 1).plusMonths(1).atStartOfDay()
	        );
	        return transactions.stream().mapToDouble(Transaction::getAmount).sum();
	    }
	 
}