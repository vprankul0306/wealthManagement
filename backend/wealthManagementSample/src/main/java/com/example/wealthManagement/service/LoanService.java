package com.example.wealthManagement.service;

import com.example.wealthManagement.*;
import com.example.wealthManagement.entity.Loan;
import com.example.wealthManagement.repository.LoanRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class LoanService {
    @Autowired
    private LoanRepository loanRepository;

    public List<Loan> getLoansByUsername(String username) {
        return loanRepository.findByUsername(username);
    }

    public Loan addLoan(Loan loan) {
        return loanRepository.save(loan);
    }

    public void deleteLoan(Long userId) {
        loanRepository.deleteById(userId);
    }


	public Object changeStatusTrue(long id, String username) {
		loanRepository.changeStatusTrue(id, username);
		return null;
	}

    @Scheduled(cron = "0 0 0 1 * ?") 
    public void resetEmiStatus() {
        List<Loan> loans = loanRepository.findAll();
        LocalDate now = LocalDate.now();

        for (Loan loan : loans) {
            if (loan.getEndDate() != null && now.isBefore(loan.getEndDate().plusMonths(1))) {
                loan.setEmiPaid(false);
                loanRepository.save(loan);
            }
        }
    }
    
    public void processEmiPayment(Loan loan) {
    	double emiAmount = loan.getEmiAmount();
    	System.out.println(loan.getDescription());
        if (loan != null && !loan.isEmiPaid()) {
            loan.setEmiPaid(true);
            loan.setPaidAmount(loan.getPaidAmount() + emiAmount);
            loanRepository.save(loan);
        }
    }
    
}