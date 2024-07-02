package com.example.wealthManagement.controller;

import com.example.wealthManagement.entity.Transaction;
import com.example.wealthManagement.service.TransactionService;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/transactions")
public class TransactionController {
    @Autowired
    private TransactionService transactionService;

    @PostMapping
    public Transaction recordTransaction(@RequestBody Transaction transaction) {
        return transactionService.recordTransaction(transaction);
    }
    
    @GetMapping("/{username}")
    public List<Transaction> getAllTransactions(@PathVariable String username) {
        return transactionService.getAllTransactions(username);
    }
    
    @GetMapping("/balance/{username}")
    public Double getCurrentBalance(@PathVariable String username) {
        return transactionService.getCurrentBalance(username);
    }
}