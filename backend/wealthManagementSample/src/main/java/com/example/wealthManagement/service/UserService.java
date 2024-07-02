package com.example.wealthManagement.service;

import com.example.wealthManagement.controller.StockController;
import com.example.wealthManagement.controller.TransactionController;
import com.example.wealthManagement.entity.Stock;
import com.example.wealthManagement.entity.User;
import com.example.wealthManagement.repository.UserRepository;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private TransactionController transactionController;
    
    @Autowired
    private StockController stockController;

    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public User authenticate(String username, String password) {
        User user = userRepository.findByUsername(username);
        if (user != null && passwordEncoder.matches(password, user.getPassword())) {
            return user;
        }else if (user == null) {
			throw new RuntimeException("User not found");
		}
        throw new RuntimeException("Invalid username or password");
    }

    public User findByUsername(String username) {
        return userRepository.findByUsername(username);
    }
    
    public boolean userExists(String username) {
        return userRepository.findByUsername(username) != null;
    }
    
    public User registerUser(User user) {
    	 if (userExists(user.getUsername())) {
             throw new RuntimeException("User already exists");
         }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

	public List<Stock> getLoanAmount(String username) {
	    return stockController.getUserStocks(username);
	}
	

	public double getSavings(String username) {
		return transactionController.getCurrentBalance(username);
	}
}