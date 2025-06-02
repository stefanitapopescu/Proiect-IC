package com.example.demo.service;

import com.example.demo.dto.VolunteerSignupRequest;
import com.example.demo.model.VolunteerAction;
import com.example.demo.model.User;
import com.example.demo.repository.VolunteerActionRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.example.demo.dto.VolunteerJoinedActionDTO;

import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class VolunteerService {

    private static final Logger logger = LoggerFactory.getLogger(VolunteerService.class);

    @Autowired
    private VolunteerActionRepository volunteerActionRepository;

    @Autowired
    private UserRepository userRepository;

    public void signupForAction(VolunteerSignupRequest request, String username) {
        Optional<VolunteerAction> actionOpt = volunteerActionRepository.findById(request.getVolunteerActionId());
        if (actionOpt.isEmpty()) {
            throw new IllegalArgumentException("ID-ul acțiunii de voluntariat este invalid.");
        }

        VolunteerAction action = actionOpt.get();

        if (action.getJoinedUserIds().contains(username)) {
            throw new IllegalStateException("V-ați înscris deja la această acțiune.");
        }

        if (action.getAllocatedVolunteers() >= action.getRequestedVolunteers()) {
            throw new IllegalStateException("Nu mai sunt locuri disponibile pentru această acțiune.");
        }

        action.getJoinedUserIds().add(username);
        action.setAllocatedVolunteers(action.getAllocatedVolunteers() + 1);
        volunteerActionRepository.save(action);
    }

    public Iterable<VolunteerAction> getAllActions(String sortBy) {
        List<VolunteerAction> actions = new ArrayList<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd.MM.yyyy HH:mm");
        
        logger.info("Fetching all volunteer actions");
        
        volunteerActionRepository.findAll().forEach(action -> {
            logger.info("Action ID: {}, Title: {}, Category: {}", 
                    action.getId(), action.getTitle(), action.getCategory());
            
            if ((action.getDate() == null || action.getDate().isEmpty()) && action.getActionDate() != null) {
                String formattedDate = action.getActionDate().format(formatter);
                action.setDate(formattedDate);
                volunteerActionRepository.save(action); 
            }
            
            actions.add(action);
        });
        
        logger.info("Returned {} actions", actions.size());
        return actions;
    }

    public List<VolunteerJoinedActionDTO> getJoinedActions(String username) {
        List<VolunteerAction> joinedActions = volunteerActionRepository.findAll().stream()
                .filter(action -> action.getJoinedUserIds().contains(username))
                .collect(Collectors.toList());

        return joinedActions.stream().map(action -> {
            VolunteerJoinedActionDTO dto = new VolunteerJoinedActionDTO();
            dto.setId(action.getId());
            dto.setTitle(action.getTitle());
            dto.setDescription(action.getDescription());
            dto.setLocation(action.getLocation());
            dto.setLocationLat(action.getLocationLat());
            dto.setLocationLng(action.getLocationLng());
            dto.setType(action.getType());
            dto.setCategory(action.getCategory());
            dto.setImageUrl(action.getImageUrl());
            dto.setRequestedVolunteers(action.getRequestedVolunteers());
            dto.setAllocatedVolunteers(action.getAllocatedVolunteers());
            dto.setActionDate(action.getActionDate());
            dto.setDate(action.getDate());
            dto.setPostedBy(action.getPostedBy());
            
            // Check attendance status for the current user
            boolean attended = action.getAttendance() != null && action.getAttendance().getOrDefault(username, false);
            dto.setAttended(attended);
            
            // Include reward items if needed on the frontend
            dto.setRewardItems(null); // Assuming reward items are not needed in this view

            return dto;
        }).collect(Collectors.toList());
    }
}
