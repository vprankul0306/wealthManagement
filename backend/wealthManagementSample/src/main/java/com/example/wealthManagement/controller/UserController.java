package com.example.wealthManagement.controller;

import com.example.wealthManagement.entity.User;
import com.example.wealthManagement.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private UserService userService;
    
    @PostMapping("/login")
    public User login(@RequestBody User user) {
        return userService.authenticate(user.getUsername(), user.getPassword());
    }

    @PostMapping("/signup")
    public User signup(@RequestBody User user) {
        return userService.registerUser(user);
    }
    
    @PostMapping("/logout")
    public HttpStatus logout() {
        return HttpStatus.OK;
    }

}