package com.example.demo.controller;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/debug")
@CrossOrigin(origins = "http://localhost:3000")
public class DatabaseDebugController {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping("/users")
    public ResponseEntity<List<Map<String, Object>>> getAllUsers() {
        List<User> users = userRepository.findAll();
        List<Map<String, Object>> userInfo = new ArrayList<>();
        
        for (User user : users) {
            Map<String, Object> info = new HashMap<>();
            info.put("id", user.getId());
            info.put("username", user.getUsername());
            info.put("email", user.getEmail());
            info.put("name", user.getName());
            info.put("role", user.getRole());
            info.put("userType", user.getUserType());
            info.put("points", user.getPoints());
            info.put("phone", user.getPhone());
            
            // Verifică dacă parola pare să fie hash-uită
            String password = user.getPassword();
            info.put("passwordLength", password != null ? password.length() : 0);
            info.put("isPasswordHashed", password != null && password.startsWith("$2"));
            info.put("hasRoleAndUserType", user.getRole() != null && user.getUserType() != null);
            
            userInfo.add(info);
        }
        
        return ResponseEntity.ok(userInfo);
    }
    
    @PostMapping("/test-login")
    public ResponseEntity<Map<String, Object>> testLogin(@RequestBody Map<String, String> request) {
        String identifier = request.get("identifier"); // username or email
        String password = request.get("password");
        
        Map<String, Object> result = new HashMap<>();
        
        // Găsește utilizatorul
        Optional<User> userOpt = identifier.contains("@") 
            ? userRepository.findByEmail(identifier)
            : userRepository.findByUsername(identifier);
            
        if (!userOpt.isPresent()) {
            result.put("error", "User not found");
            result.put("identifier", identifier);
            return ResponseEntity.ok(result);
        }
        
        User user = userOpt.get();
        result.put("userFound", true);
        result.put("username", user.getUsername());
        result.put("email", user.getEmail());
        result.put("role", user.getRole());
        result.put("userType", user.getUserType());
        
        // Testează parola
        String storedPassword = user.getPassword();
        result.put("storedPasswordLength", storedPassword.length());
        result.put("isStoredPasswordHashed", storedPassword.startsWith("$2"));
        
        if (storedPassword.startsWith("$2")) {
            // Parola este hash-uită corect, testează cu BCrypt
            boolean matches = passwordEncoder.matches(password, storedPassword);
            result.put("passwordMatches", matches);
            result.put("method", "BCrypt verification");
        } else {
            // Parola nu pare hash-uită, verifică dacă este text simplu
            boolean matches = password.equals(storedPassword);
            result.put("passwordMatches", matches);
            result.put("method", "Plain text comparison");
            result.put("warning", "Password is not hashed properly!");
        }
        
        return ResponseEntity.ok(result);
    }
    
    @PostMapping("/fix-user")
    public ResponseEntity<Map<String, String>> fixUser(@RequestBody Map<String, String> request) {
        String identifier = request.get("identifier"); // username or email
        String newPassword = request.get("newPassword");
        
        Map<String, String> result = new HashMap<>();
        
        // Găsește utilizatorul
        Optional<User> userOpt = identifier.contains("@") 
            ? userRepository.findByEmail(identifier)
            : userRepository.findByUsername(identifier);
            
        if (!userOpt.isPresent()) {
            result.put("error", "User not found");
            return ResponseEntity.ok(result);
        }
        
        User user = userOpt.get();
        
        // Repară câmpurile lipsă
        if (user.getRole() == null || user.getRole().isEmpty()) {
            if (user.getUserType() != null && !user.getUserType().isEmpty()) {
                user.setRole(user.getUserType().toLowerCase());
            } else {
                user.setRole("volunteer"); // default
            }
        }
        
        if (user.getUserType() == null || user.getUserType().isEmpty()) {
            if (user.getRole() != null && !user.getRole().isEmpty()) {
                user.setUserType(user.getRole().toLowerCase());
            } else {
                user.setUserType("volunteer"); // default
            }
        }
        
        // Asigură-te că sunt lowercase
        user.setRole(user.getRole().toLowerCase());
        user.setUserType(user.getUserType().toLowerCase());
        
        // Hash-uiește parola corect
        user.setPassword(passwordEncoder.encode(newPassword));
        
        // Inițializează punctele dacă sunt null
        if (user.getPoints() == null) {
            user.setPoints(0);
        }
        
        // Inițializează lista de recompense dacă este null
        if (user.getBoughtRewardIds() == null) {
            user.setBoughtRewardIds(new ArrayList<>());
        }
        
        // Salvează utilizatorul
        userRepository.save(user);
        
        result.put("success", "User fixed successfully");
        result.put("username", user.getUsername());
        result.put("role", user.getRole());
        result.put("userType", user.getUserType());
        result.put("passwordHashed", "true");
        
        return ResponseEntity.ok(result);
    }
    
    @PostMapping("/fix-all-users")
    public ResponseEntity<Map<String, Object>> fixAllUsers() {
        List<User> users = userRepository.findAll();
        List<String> fixed = new ArrayList<>();
        List<String> errors = new ArrayList<>();
        
        for (User user : users) {
            try {
                boolean needsSave = false;
                
                // Repară role și userType
                if (user.getRole() == null || user.getRole().isEmpty()) {
                    if (user.getUserType() != null && !user.getUserType().isEmpty()) {
                        user.setRole(user.getUserType().toLowerCase());
                    } else {
                        user.setRole("volunteer");
                    }
                    needsSave = true;
                }
                
                if (user.getUserType() == null || user.getUserType().isEmpty()) {
                    if (user.getRole() != null && !user.getRole().isEmpty()) {
                        user.setUserType(user.getRole().toLowerCase());
                    } else {
                        user.setUserType("volunteer");
                    }
                    needsSave = true;
                }
                
                // Asigură-te că sunt lowercase
                if (!user.getRole().equals(user.getRole().toLowerCase())) {
                    user.setRole(user.getRole().toLowerCase());
                    needsSave = true;
                }
                
                if (!user.getUserType().equals(user.getUserType().toLowerCase())) {
                    user.setUserType(user.getUserType().toLowerCase());
                    needsSave = true;
                }
                
                // Inițializează punctele
                if (user.getPoints() == null) {
                    user.setPoints(0);
                    needsSave = true;
                }
                
                // Inițializează lista de recompense
                if (user.getBoughtRewardIds() == null) {
                    user.setBoughtRewardIds(new ArrayList<>());
                    needsSave = true;
                }
                
                if (needsSave) {
                    userRepository.save(user);
                    fixed.add(user.getUsername());
                }
                
            } catch (Exception e) {
                errors.add(user.getUsername() + ": " + e.getMessage());
            }
        }
        
        Map<String, Object> result = new HashMap<>();
        result.put("totalUsers", users.size());
        result.put("usersFixed", fixed.size());
        result.put("fixedUsers", fixed);
        result.put("errors", errors);
        
        return ResponseEntity.ok(result);
    }
} 