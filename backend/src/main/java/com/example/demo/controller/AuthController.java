package com.example.demo.controller;

import com.example.demo.model.User;
import com.example.demo.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

  @Autowired
  private AuthService authService;

  @PostMapping("/signup")
  public ResponseEntity<?> signup(@RequestBody User user) {
    return authService.signup(user);
  }

  @PostMapping("/login")
  public ResponseEntity<?> login(@RequestBody User user) {
    return authService.login(user);
  }
}
