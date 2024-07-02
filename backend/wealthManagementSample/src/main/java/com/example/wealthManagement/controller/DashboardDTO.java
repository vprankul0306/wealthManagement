package com.example.wealthManagement.controller;

import java.util.List;

import com.example.wealthManagement.entity.Stock;
import com.example.wealthManagement.entity.Transaction;

public class DashboardDTO {
    private double savings;
    private List<Stock> loanAmount;
    private double assets;
    private double insurance;
    private List<Transaction> transactions;
    private double monthlyExpense;
    private double monthlyIncome;


    public double getSavings() {
        return savings;
    }

    public void setSavings(double savings) {
        this.savings = savings;
    }

    public List<Stock> getLoanAmount() {
        return loanAmount;
    }

    public void setLoanAmount(List<Stock> list) {
        this.loanAmount = list;
    }

    public double getAssets() {
        return assets;
    }

    public void setAssets(double assets) {
        this.assets = assets;
    }

    public double getInsurance() {
        return insurance;
    }

    public void setInsurance(double insurance) {
        this.insurance = insurance;
    }

    public List<Transaction> getTransactions() {
        return transactions;
    }

    public void setTransactions(List<Transaction> transactions) {
        this.transactions = transactions;
    }


    public double getMonthlyExpense() {
        return monthlyExpense;
    }

    public void setMonthlyExpense(double monthlyExpense) {
        this.monthlyExpense = monthlyExpense;
    }

    public double getMonthlyIncome() {
        return monthlyIncome;
    }

    public void setMonthlyIncome(double monthlyIncome) {
        this.monthlyIncome = monthlyIncome;
    }
    
}