package com.example.demo.controller;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.AuthService;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
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

  @RestController
  public class TestController {

    @GetMapping("/api/test")
    public ResponseEntity<String> testEndpoint() {
      return ResponseEntity.ok("Tokenul funcționează corect!");
    }
  }
}
