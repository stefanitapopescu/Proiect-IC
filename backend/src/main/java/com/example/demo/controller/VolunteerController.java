package com.example.demo.controller;

import com.example.demo.dto.VolunteerSignupRequest;
import com.example.demo.model.User;
import com.example.demo.model.VolunteerAction;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.VolunteerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/volunteer")
@CrossOrigin(origins = "http://localhost:3000")
public class VolunteerController {

    private static final Logger logger = LoggerFactory.getLogger(VolunteerController.class);

    @Autowired
    private VolunteerService volunteerService;
    
    @Autowired
    private UserRepository userRepository;
    
    @GetMapping("/debug")
    public ResponseEntity<Map<String, Object>> debugAuth() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Collection<? extends GrantedAuthority> authorities = auth.getAuthorities();
        
        logger.info("Debug endpoint - user: {}, authorities: {}", auth.getName(), authorities);
        
        boolean hasVolunteerRole = false;
        for (GrantedAuthority authority : authorities) {
            if (authority.getAuthority().equalsIgnoreCase("VOLUNTEER") || authority.getAuthority().equalsIgnoreCase("volunteer")) {
                hasVolunteerRole = true;
                break;
            }
        }
        
        logger.info("Has volunteer role: {}", hasVolunteerRole);
        
        Map<String, Object> response = new HashMap<>();
        response.put("username", auth.getName());
        response.put("authorities", authorities);
        response.put("hasVolunteerRole", hasVolunteerRole);
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/actions")
    public ResponseEntity<Iterable<VolunteerAction>> getVolunteerActions(@RequestParam(required = false) String sortBy) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        logger.info("GET /actions - User: {}, Authorities: {}", auth.getName(), auth.getAuthorities());
        
        Iterable<VolunteerAction> actions = volunteerService.getAllActions(sortBy);
        return ResponseEntity.ok(actions);
    }

    @PostMapping("/signup")
     public String signupForAction(@RequestBody VolunteerSignupRequest request) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        logger.info("POST /signup - User: {}, Action ID: {}", username, request.getVolunteerActionId());
        
        volunteerService.signupForAction(request, username);
        return "Înscriere realizată cu succes!";
    }
    
    @GetMapping("/points")
    public Integer getUserPoints() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        logger.info("GET /points - User: {}, Authorities: {}", username, auth.getAuthorities());
        
        Optional<User> userOptional = userRepository.findByUsername(username);
        return userOptional.map(user -> {
            logger.info("Found user: {}, Role: {}, UserType: {}, Points: {}", 
                    user.getUsername(), user.getRole(), user.getUserType(), user.getPoints());
            return user.getPoints();
        }).orElse(0);
    }
}
