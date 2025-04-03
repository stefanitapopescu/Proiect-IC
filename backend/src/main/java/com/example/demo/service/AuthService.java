package com.example.demo.service;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public ResponseEntity<?> signup(User user) {
        if (userRepo.findByUsername(user.getUsername()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                                 .body("Username already exists.");
        }
        // Criptează parola înainte de salvare
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepo.save(user);
        return ResponseEntity.ok("User registered as " + user.getRole());
    }

    public ResponseEntity<?> login(User user) {
        Optional<User> existingUser = userRepo.findByUsername(user.getUsername());
    
        if (existingUser.isPresent()) {
            // Compară parola din request (în clar) cu hash-ul salvat
            boolean matches = passwordEncoder.matches(user.getPassword(), existingUser.get().getPassword());
    
            if (matches) {
                String token = jwtUtil.generateToken(user.getUsername());
                String responseMessage = "Login successful. Token: " + token;
                return ResponseEntity.ok(responseMessage);
            }
        }
    
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                             .body("Invalid credentials.");
    }
}
