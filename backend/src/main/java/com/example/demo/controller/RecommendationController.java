package com.example.demo.controller;

import com.example.demo.model.VolunteerAction;
import com.example.demo.service.RecommendationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/recommendations")
@CrossOrigin(origins = "http://localhost:3000")
public class RecommendationController {
    
    @Autowired
    private RecommendationService recommendationService;
    
    @GetMapping("/personalized")
    public ResponseEntity<List<VolunteerAction>> getPersonalizedRecommendations(Authentication authentication) {
        try {
            if (authentication == null || authentication.getName() == null) {
                // Pentru utilizatori neautentificați, returnează acțiuni populare
                return ResponseEntity.ok(recommendationService.getPersonalizedRecommendations(null));
            }
            
            String userId = authentication.getName();
            List<VolunteerAction> recommendations = recommendationService.getPersonalizedRecommendations(userId);
            return ResponseEntity.ok(recommendations);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }
    
    @GetMapping("/category/{category}")
    public ResponseEntity<List<VolunteerAction>> getRecommendationsByCategory(@PathVariable String category) {
        try {
            List<VolunteerAction> recommendations = recommendationService.getRecommendationsByCategory(category);
            return ResponseEntity.ok(recommendations);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }
    
    @GetMapping("/insights")
    public ResponseEntity<Map<String, Object>> getRecommendationInsights(Authentication authentication) {
        try {
            if (authentication == null || authentication.getName() == null) {
                return ResponseEntity.status(401).body(Map.of("error", "Authentication required"));
            }
            
            String userId = authentication.getName();
            Map<String, Object> insights = recommendationService.getRecommendationInsights(userId);
            return ResponseEntity.ok(insights);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Could not load insights"));
        }
    }
} 