package com.example.wealthManagement.controller;

import com.example.wealthManagement.entity.Transaction;
import com.example.wealthManagement.entity.User;
import com.example.wealthManagement.service.AssetService;
import com.example.wealthManagement.service.TransactionService;
import com.example.wealthManagement.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/dashboard")
public class DashboardController {
    @Autowired
    private UserService userService;

    @Autowired
    private TransactionService transactionService;
    
    @Autowired
    private AssetService assetService;

    @GetMapping("/{username}")
    public DashboardDTO getDashboardData(@PathVariable String username) {
        User user = userService.findByUsername(username);
   

        DashboardDTO dashboardDTO = new DashboardDTO();
        dashboardDTO.setSavings(userService.getSavings(username));
        dashboardDTO.setLoanAmount(userService.getLoanAmount(username));
        dashboardDTO.setAssets(assetService.calculateTotalAssets(username));

        List<Transaction> transactions = transactionService.getTransactionsByUser(username);
        dashboardDTO.setTransactions(transactions);
        
        LocalDate currentDate = LocalDate.now();
        int currentMonth = currentDate.getMonthValue();
        int currentYear = currentDate.getYear();
        dashboardDTO.setMonthlyExpense(transactionService.calculateMonthlyExpense(username, currentMonth, currentYear));
        dashboardDTO.setMonthlyIncome(transactionService.calculateMonthlyIncome(username, currentMonth, currentYear));

        return dashboardDTO;
    }
}