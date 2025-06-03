package com.example.demo.controller;

import com.example.demo.model.VolunteerAction;
import com.example.demo.model.User;
import com.example.demo.service.VolunteerService;
import com.example.demo.repository.UserRepository;
import com.example.demo.dto.VolunteerSignupRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Optional;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class VolunteerActionController {

    private static final Logger logger = LoggerFactory.getLogger(VolunteerActionController.class);

    @Autowired
    private VolunteerService volunteerService;
    
    @Autowired
    private UserRepository userRepository;

    @GetMapping("/volunteer-actions")
    public ResponseEntity<Iterable<VolunteerAction>> getAllVolunteerActions(@RequestParam(required = false) String sortBy) {
        logger.info("GET /api/volunteer-actions - Fetching all volunteer actions");
        
        try {
            Iterable<VolunteerAction> actions = volunteerService.getAllActions(sortBy);
            logger.info("Successfully fetched volunteer actions");
            return ResponseEntity.ok(actions);
        } catch (Exception e) {
            logger.error("Error fetching volunteer actions: {}", e.getMessage());
            return ResponseEntity.status(500).body(null);
        }
    }

    @PostMapping("/volunteer-actions/{actionId}/signup")
    public ResponseEntity<String> signupForAction(@PathVariable String actionId) {
        try {
            String username = SecurityContextHolder.getContext().getAuthentication().getName();
            logger.info("POST /volunteer-actions/{}/signup - User: {}", actionId, username);
            
            VolunteerSignupRequest request = new VolunteerSignupRequest();
            request.setVolunteerActionId(actionId);
            
            volunteerService.signupForAction(request, username);
            return ResponseEntity.ok("Înscriere realizată cu succes!");
        } catch (IllegalArgumentException e) {
            logger.error("Invalid action ID: {}", e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (IllegalStateException e) {
            logger.error("Signup error: {}", e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            logger.error("Unexpected error during signup: {}", e.getMessage());
            return ResponseEntity.status(500).body("Eroare la înscriere. Încercați din nou.");
        }
    }
    
    @GetMapping("/user/points")
    public ResponseEntity<Integer> getUserPoints() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String username = auth.getName();
            logger.info("GET /api/user/points - User: {}", username);
            
            Optional<User> userOptional = userRepository.findByUsername(username);
            Integer points = userOptional.map(user -> {
                logger.info("Found user: {}, Points: {}", user.getUsername(), user.getPoints());
                return user.getPoints() != null ? user.getPoints() : 0;
            }).orElse(0);
            
            return ResponseEntity.ok(points);
        } catch (Exception e) {
            logger.error("Error fetching user points: {}", e.getMessage());
            return ResponseEntity.ok(0);
        }
    }
} 