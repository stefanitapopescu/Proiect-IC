package com.example.demo.controller;

import com.example.demo.model.User;
import com.example.demo.service.AuthService;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

  @Autowired
  private AuthService authService;
  
  @Autowired
  private UserRepository userRepository;

  @PostMapping("/signup")
  public ResponseEntity<?> signup(@RequestBody User user) {
    return authService.signup(user);
  }
  
  @PostMapping("/register")
  public ResponseEntity<?> register(@RequestBody User user) {
    return authService.signup(user);
  }

  @PostMapping("/login")
  public ResponseEntity<?> login(@RequestBody User user) {
    return authService.login(user);
  }
  
  @GetMapping("/check-role")
  public ResponseEntity<?> checkRole() {
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    String username = auth.getName();
    
    Optional<User> userOpt = userRepository.findByUsername(username);
    if (userOpt.isPresent()) {
        User user = userOpt.get();
        Map<String, Object> response = new HashMap<>();
        response.put("username", user.getUsername());
        response.put("role", user.getRole());
        response.put("userType", user.getUserType());
        response.put("authorities", auth.getAuthorities());
        return ResponseEntity.ok(response);
    }
    
    return ResponseEntity.notFound().build();
  }
}
