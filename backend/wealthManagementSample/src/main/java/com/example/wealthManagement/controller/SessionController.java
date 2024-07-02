package com.example.wealthManagement.controller;

import jakarta.servlet.http.HttpSession;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class SessionController {

    @GetMapping("/setSessionAttribute")
    public String setSessionAttribute(HttpSession session) {
        session.setAttribute("username", "exampleUser");
        return "Session attribute set";
    }

    @GetMapping("/getSessionAttribute")
    public String getSessionAttribute(HttpSession session) {
        String username = (String) session.getAttribute("username");
        return "Session attribute: " + username;
    }
}