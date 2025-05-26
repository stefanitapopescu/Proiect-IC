package com.example.demo.service;

import com.example.demo.model.VolunteerAction;
import com.example.demo.model.User;
import com.example.demo.repository.VolunteerActionRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class RecommendationService {
    
    @Autowired
    private VolunteerActionRepository volunteerActionRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    public List<VolunteerAction> getPersonalizedRecommendations(String userId) {
        List<VolunteerAction> allActions = volunteerActionRepository.findAll();
        
        if (userId == null) {
            // Pentru utilizatori neautentificați, returnează acțiuni populare
            return allActions.stream()
                    .sorted((a, b) -> Integer.compare(
                            b.getJoinedUserIds() != null ? b.getJoinedUserIds().size() : 0,
                            a.getJoinedUserIds() != null ? a.getJoinedUserIds().size() : 0
                    ))
                    .limit(5)
                    .collect(Collectors.toList());
        }
        
        Optional<User> userOpt = userRepository.findById(userId);
        if (!userOpt.isPresent()) {
            return getPopularActions(allActions);
        }
        
        User user = userOpt.get();
        
        // Calculează scorul pentru fiecare acțiune
        List<ScoredAction> scoredActions = allActions.stream()
                .map(action -> new ScoredAction(action, calculateScore(action, user, allActions)))
                .sorted((a, b) -> Double.compare(b.score, a.score))
                .limit(5)
                .collect(Collectors.toList());
        
        return scoredActions.stream()
                .map(sa -> sa.action)
                .collect(Collectors.toList());
    }
    
    public List<VolunteerAction> getRecommendationsByCategory(String category) {
        return volunteerActionRepository.findAll().stream()
                .filter(action -> category.equals(action.getCategory()))
                .sorted((a, b) -> Integer.compare(
                        b.getJoinedUserIds() != null ? b.getJoinedUserIds().size() : 0,
                        a.getJoinedUserIds() != null ? a.getJoinedUserIds().size() : 0
                ))
                .limit(10)
                .collect(Collectors.toList());
    }
    
    public Map<String, Object> getRecommendationInsights(String userId) {
        Map<String, Object> insights = new HashMap<>();
        
        Optional<User> userOpt = userRepository.findById(userId);
        if (!userOpt.isPresent()) {
            insights.put("error", "User not found");
            return insights;
        }
        
        User user = userOpt.get();
        List<VolunteerAction> allActions = volunteerActionRepository.findAll();
        
        // Calculează statistici utilizator
        List<VolunteerAction> userActions = allActions.stream()
                .filter(action -> action.getJoinedUserIds() != null && 
                        action.getJoinedUserIds().contains(userId))
                .collect(Collectors.toList());
        
        // Nivel experiență
        int totalActions = userActions.size();
        String experienceLevel;
        if (totalActions == 0) {
            experienceLevel = "Începător";
        } else if (totalActions < 5) {
            experienceLevel = "Novice";
        } else if (totalActions < 15) {
            experienceLevel = "Experimentat";
        } else {
            experienceLevel = "Expert";
        }
        
        // Categoria preferată
        String preferredCategory = userActions.stream()
                .collect(Collectors.groupingBy(VolunteerAction::getCategory, Collectors.counting()))
                .entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse("Diverse");
        
        insights.put("experienceLevel", experienceLevel);
        insights.put("preferredCategory", preferredCategory);
        insights.put("totalActions", totalActions);
        insights.put("completionRate", totalActions > 0 ? "100%" : "0%");
        
        return insights;
    }
    
    private double calculateScore(VolunteerAction action, User user, List<VolunteerAction> allActions) {
        double score = 0.0;
        
        // 1. Preferința pentru categorie (40% din scor)
        String preferredCategory = getUserPreferredCategory(user, allActions);
        if (preferredCategory.equals(action.getCategory())) {
            score += 0.4;
        }
        
        // 2. Popularitatea acțiunii (20% din scor)
        int joinedCount = action.getJoinedUserIds() != null ? action.getJoinedUserIds().size() : 0;
        int requestedCount = action.getRequestedVolunteers();
        if (requestedCount > 0) {
            double popularityRatio = (double) joinedCount / requestedCount;
            score += 0.2 * Math.min(popularityRatio, 1.0);
        }
        
        // 3. Urgența (20% din scor) - acțiuni cu mai puțini voluntari sunt mai urgente
        if (requestedCount > 0) {
            double urgencyRatio = 1.0 - ((double) joinedCount / requestedCount);
            score += 0.2 * urgencyRatio;
        }
        
        // 4. Experiența utilizatorului (20% din scor)
        int userExperience = getUserExperienceLevel(user, allActions);
        if (userExperience > 5) { // Utilizatori experimentați primesc acțiuni mai complexe
            score += 0.2;
        } else { // Utilizatori noi primesc acțiuni mai simple
            score += 0.1;
        }
        
        return score;
    }
    
    private String getUserPreferredCategory(User user, List<VolunteerAction> allActions) {
        List<VolunteerAction> userActions = allActions.stream()
                .filter(action -> action.getJoinedUserIds() != null && 
                        action.getJoinedUserIds().contains(user.getId()))
                .collect(Collectors.toList());
        
        return userActions.stream()
                .collect(Collectors.groupingBy(VolunteerAction::getCategory, Collectors.counting()))
                .entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse("Diverse");
    }
    
    private int getUserExperienceLevel(User user, List<VolunteerAction> allActions) {
        return (int) allActions.stream()
                .filter(action -> action.getJoinedUserIds() != null && 
                        action.getJoinedUserIds().contains(user.getId()))
                .count();
    }
    
    private List<VolunteerAction> getPopularActions(List<VolunteerAction> allActions) {
        return allActions.stream()
                .sorted((a, b) -> Integer.compare(
                        b.getJoinedUserIds() != null ? b.getJoinedUserIds().size() : 0,
                        a.getJoinedUserIds() != null ? a.getJoinedUserIds().size() : 0
                ))
                .limit(5)
                .collect(Collectors.toList());
    }
    
    private static class ScoredAction {
        VolunteerAction action;
        double score;
        
        ScoredAction(VolunteerAction action, double score) {
            this.action = action;
            this.score = score;
        }
    }
} 