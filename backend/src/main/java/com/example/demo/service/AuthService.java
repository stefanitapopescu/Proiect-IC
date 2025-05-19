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
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.example.demo.model.PasswordResetToken;
import com.example.demo.repository.PasswordResetTokenRepository;
import java.util.Date;
import java.util.Map;

import java.util.Optional;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.beans.factory.annotation.Value;

@Service
public class AuthService {

    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private PasswordResetTokenRepository passwordResetTokenRepo;

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public ResponseEntity<?> signup(User user) {
        logger.debug("Signup attempt for username: {}, email: {}, userType: {}, role: {}", 
                user.getUsername(), user.getEmail(), user.getUserType(), user.getRole());
                
        if (user.getEmail() != null && !user.getEmail().isEmpty()) {
            Optional<User> existingUserWithEmail = userRepo.findByEmail(user.getEmail());
            if (existingUserWithEmail.isPresent()) {
                logger.debug("Email already registered: {}", user.getEmail());
                return ResponseEntity.status(HttpStatus.CONFLICT)
                                    .body("Email already registered.");
            }
        }
        
        if (userRepo.findByUsername(user.getUsername()).isPresent()) {
            logger.debug("Username already exists: {}", user.getUsername());
            return ResponseEntity.status(HttpStatus.CONFLICT)
                                 .body("Username already exists.");
        }
        
        if (user.getUserType() != null && (user.getRole() == null || user.getRole().isEmpty())) {
            user.setRole(user.getUserType().toLowerCase());
            logger.debug("Set role from userType: {}", user.getRole());
        } else if (user.getRole() != null && (user.getUserType() == null || user.getUserType().isEmpty())) {
            user.setUserType(user.getRole().toLowerCase());
            logger.debug("Set userType from role: {}", user.getUserType());
        } else if (user.getRole() == null && user.getUserType() == null) {
            user.setRole("user");
            user.setUserType("user");
            logger.debug("Both role and userType were null, defaulted to 'user'");
        }
        
        user.setRole(user.getRole().toLowerCase());
        user.setUserType(user.getUserType().toLowerCase());
        
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        User savedUser = userRepo.save(user);
        logger.debug("User registered successfully: {} with role: {}, userType: {}", 
                savedUser.getUsername(), savedUser.getRole(), savedUser.getUserType());
                
        return ResponseEntity.ok("User registered successfully");
    }

    public ResponseEntity<?> login(User user) {
        logger.debug("Login attempt with username: {}, email: {}", user.getUsername(), user.getEmail());
        
        Optional<User> existingUser = user.getUsername() != null 
            ? userRepo.findByUsername(user.getUsername())
            : userRepo.findByEmail(user.getEmail());
            
        if (existingUser.isPresent()) {
            User foundUser = existingUser.get();
            logger.debug("User found: {}, role: {}, userType: {}", 
                    foundUser.getUsername(), foundUser.getRole(), foundUser.getUserType());
                    
            boolean matches = passwordEncoder.matches(user.getPassword(), foundUser.getPassword());
            if (matches) {
                logger.debug("Password matches for user: {}", foundUser.getUsername());
                
                if (foundUser.getRole() == null || foundUser.getRole().isEmpty()) {
                    foundUser.setRole(foundUser.getUserType().toLowerCase());
                    logger.debug("Updated missing role from userType: {}", foundUser.getRole());
                    userRepo.save(foundUser);
                } else if (foundUser.getUserType() == null || foundUser.getUserType().isEmpty()) {
                    foundUser.setUserType(foundUser.getRole().toLowerCase());
                    logger.debug("Updated missing userType from role: {}", foundUser.getUserType());
                    userRepo.save(foundUser);
                }
                
                String token = jwtUtil.generateToken(foundUser.getUsername());
                logger.debug("Generated token for user: {}", foundUser.getUsername());
                
                String userTypeForResponse = foundUser.getUserType() != null 
                    ? foundUser.getUserType().toLowerCase() 
                    : foundUser.getRole().toLowerCase();
                    
                logger.debug("Login successful for: {}, returning userType: {}", 
                        foundUser.getUsername(), userTypeForResponse);
                        
                LoginResponse response = new LoginResponse(token, userTypeForResponse);
                return ResponseEntity.ok(response);
            } else {
                logger.debug("Password does not match for user: {}", foundUser.getUsername());
            }
        } else {
            logger.debug("User not found with username/email: {}/{}", user.getUsername(), user.getEmail());
        }
        
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                             .body("Invalid credentials.");
    }

    public ResponseEntity<?> requestPasswordReset(String email) {
        Optional<User> userOpt = userRepo.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.ok("Dacă adresa există, vei primi un email cu link de resetare.");
        }
        User user = userOpt.get();
        passwordResetTokenRepo.deleteByUserId(user.getId());
        String token = java.util.UUID.randomUUID().toString();
        Date expiry = new Date(System.currentTimeMillis() + 1000 * 60 * 60); // 1 oră
        PasswordResetToken resetToken = new PasswordResetToken(null, user.getId(), token, expiry);
        passwordResetTokenRepo.save(resetToken);
        String link = "http://localhost:3000/reset-password/confirm?token=" + token;

        // Trimite email real
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setFrom(fromEmail);
        message.setSubject("Resetare parolă VolunteerHub");
        message.setText("Salut! Pentru a-ți reseta parola, accesează linkul:\n" + link + "\n\nDacă nu ai cerut resetarea parolei, ignoră acest email.");
        mailSender.send(message);

        return ResponseEntity.ok("Dacă adresa există, vei primi un email cu link de resetare.");
    }

    public ResponseEntity<?> resetPassword(String token, String newPassword) {
        Optional<PasswordResetToken> tokenOpt = passwordResetTokenRepo.findByToken(token);
        if (tokenOpt.isEmpty() || tokenOpt.get().getExpiryDate().before(new Date())) {
            return ResponseEntity.badRequest().body("Token invalid sau expirat.");
        }
        PasswordResetToken resetToken = tokenOpt.get();
        Optional<User> userOpt = userRepo.findById(resetToken.getUserId());
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Utilizator inexistent.");
        }
        User user = userOpt.get();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepo.save(user);
        passwordResetTokenRepo.deleteByUserId(user.getId());
        return ResponseEntity.ok("Parola a fost resetată cu succes.");
    }
}    
