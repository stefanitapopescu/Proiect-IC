package com.example.demo.service;

import com.example.demo.dto.VolunteerSignupRequest;
import com.example.demo.model.VolunteerAction;
import com.example.demo.model.User;
import com.example.demo.repository.VolunteerActionRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class VolunteerService {

    @Autowired
    private VolunteerActionRepository volunteerActionRepository;

    @Autowired
    private UserRepository userRepository;

    public void signupForAction(VolunteerSignupRequest request) {
        Optional<VolunteerAction> actionOptional = volunteerActionRepository.findById(request.getVolunteerActionId());
        if (actionOptional.isEmpty()) {
            throw new IllegalArgumentException("ID-ul acțiunii de voluntariat este invalid.");
        }
        VolunteerAction action = actionOptional.get();

        if (action.getAllocatedVolunteers() >= action.getRequestedVolunteers()) {
            throw new IllegalStateException("Nu mai sunt locuri disponibile pentru această acțiune.");
        }

        action.setAllocatedVolunteers(action.getAllocatedVolunteers() + 1);
        volunteerActionRepository.save(action);

        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<User> userOptional = userRepository.findByUsername(username);
        if (userOptional.isPresent()) {
            User volunteer = userOptional.get();
            int currentPoints = volunteer.getPoints() != null ? volunteer.getPoints() : 0;
            volunteer.setPoints(currentPoints + 10);
            userRepository.save(volunteer);
        }
    }
    
    public Iterable<VolunteerAction> getAllActions(String sortBy) {
        return volunteerActionRepository.findAll();
    }
}
