package com.example.wealthManagement.controller;

import com.example.wealthManagement.*;
import com.example.wealthManagement.entity.Loan;

import java.util.List;

import org.hibernate.loader.ast.spi.Loadable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.wealthManagement.service.LoanService;

import jakarta.persistence.Id;

@RestController
@RequestMapping("/api/loans")
public class LoanController {
	 @Autowired
	    private LoanService loanService;

	    @GetMapping("/{username}")
	    public List<Loan> getLoansByUsername(@PathVariable String username) {
	        return loanService.getLoansByUsername(username);
	    }

	    @PostMapping
	    public Loan addLoan(@RequestBody Loan loan) {
	    	System.out.println(loan.getAmount());
	        return loanService.addLoan(loan);
	    }
	    
	    @PostMapping("/paymentDone")
	    public void markEmiPaymentDone(@RequestBody Loan loan) {
	    	loanService.processEmiPayment(loan);
	    }


	    @DeleteMapping("/{loanId}")
	    public void deleteLoan(@PathVariable Long loanId) {
	        loanService.deleteLoan(loanId);
	    }

}
