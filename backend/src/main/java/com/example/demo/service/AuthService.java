package com.example.demo.service;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.example.demo.dto.LoginResponse;

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
            boolean matches = passwordEncoder.matches(user.getPassword(), existingUser.get().getPassword());
            if (matches) {
                String token = jwtUtil.generateToken(user.getUsername());
                // Creează răspunsul JSON cu token și rolul utilizatorului
                LoginResponse response = new LoginResponse(token, existingUser.get().getRole());
                return ResponseEntity.ok(response);
            }
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                             .body("Invalid credentials.");
    }
    
}    
