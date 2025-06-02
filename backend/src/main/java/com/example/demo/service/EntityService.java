package com.example.demo.service;

import com.example.demo.dto.NewVolunteerActionRequest;
import com.example.demo.model.RewardItem;
import com.example.demo.model.VolunteerAction;
import com.example.demo.model.User;
import com.example.demo.repository.RewardItemRepository;
import com.example.demo.repository.VolunteerActionRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.server.ResponseStatusException;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;
import java.util.Map;
import java.util.HashMap;
import java.util.Optional;
import com.example.demo.dto.VolunteerAttendanceDTO;

@Service
public class EntityService {

    @Autowired
    private VolunteerActionRepository volunteerActionRepository;

    @Autowired
    private RewardItemRepository rewardItemRepository;

    @Autowired
    private UserRepository userRepository;

    public void postVolunteerAction(NewVolunteerActionRequest request) {
        if (request.getRequestedVolunteers() > 0
                && (request.getRewardItems() == null || request.getRewardItems().isEmpty())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Trebuie să adăugați cel puțin un premiu dacă numărul de voluntari solicitați este mai mare de 0!");
        }

        int totalRewards = request.getRewardItems()
                .stream()
                .mapToInt(item -> item.getQuantity())
                .sum();

        if (totalRewards < request.getRequestedVolunteers()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Totalul obiectelor oferite ca premii trebuie să fie cel puțin egal cu numărul de voluntari solicitați.");
        }

        String username = SecurityContextHolder.getContext().getAuthentication().getName();

        VolunteerAction action = new VolunteerAction();
        action.setTitle(request.getTitle());
        action.setDescription(request.getDescription());
        action.setLocation(request.getLocation());
        action.setLocationLat(request.getLocationLat());
        action.setLocationLng(request.getLocationLng());
        action.setType(request.getType());
        action.setCategory(request.getCategory());
        action.setRequestedVolunteers(request.getRequestedVolunteers());
        action.setAllocatedVolunteers(0);
        action.setActionDate(request.getActionDate());
        
        if (request.getActionDate() != null) {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd.MM.yyyy HH:mm");
            String formattedDate = request.getActionDate().format(formatter);
            action.setDate(formattedDate);
        }
        
        action.setPostedBy(username);

        VolunteerAction savedAction = volunteerActionRepository.save(action);

        request.getRewardItems().forEach(rewardDTO -> {
            RewardItem rewardItem = new RewardItem();
            rewardItem.setName(rewardDTO.getName());
            rewardItem.setQuantity(rewardDTO.getQuantity());
            rewardItem.setVolunteerActionId(savedAction.getId());
            // Adăugat copia tag-ului din DTO
            rewardItem.setTag(rewardDTO.getTag());
            rewardItemRepository.save(rewardItem);
        });
    }

    public List<Map<String, Object>> getPostedActions(String username) {
        List<VolunteerAction> actions = volunteerActionRepository.findAll().stream()
                .filter(action -> action.getPostedBy().equals(username))
                .collect(Collectors.toList());

        return actions.stream().map(action -> {
            Map<String, Object> actionMap = new HashMap<>();
            actionMap.put("id", action.getId());
            actionMap.put("title", action.getTitle());
            actionMap.put("description", action.getDescription());
            actionMap.put("location", action.getLocation());
            actionMap.put("locationLat", action.getLocationLat());
            actionMap.put("locationLng", action.getLocationLng());
            actionMap.put("category", action.getCategory());
            actionMap.put("requestedVolunteers", action.getRequestedVolunteers());
            actionMap.put("allocatedVolunteers", action.getAllocatedVolunteers());
            actionMap.put("actionDate", action.getActionDate());
            actionMap.put("date", action.getDate());
            actionMap.put("attendance", action.getAttendance()); // Include attendance

            // Get volunteer information
            List<Map<String, Object>> volunteers = action.getJoinedUserIds().stream()
                    .map(userId -> {
                        User user = userRepository.findByUsername(userId).orElse(null);
                        if (user != null) {
                            Map<String, Object> volunteerMap = new HashMap<>();
                            volunteerMap.put("username", user.getUsername());
                            volunteerMap.put("name", user.getName()); // Use getName for full name
                            volunteerMap.put("email", user.getEmail());
                            volunteerMap.put("phone", user.getPhone());
                            // Include attendance status for this volunteer
                            volunteerMap.put("present", action.getAttendance().getOrDefault(user.getUsername(), false));
                            return volunteerMap;
                        }
                        return null;
                    })
                    .filter(volunteer -> volunteer != null)
                    .collect(Collectors.toList());

            actionMap.put("volunteers", volunteers);
            return actionMap;
        }).collect(Collectors.toList());
    }

    public void saveVolunteerAttendance(String actionId, List<VolunteerAttendanceDTO> attendanceData) {
        Optional<VolunteerAction> actionOpt = volunteerActionRepository.findById(actionId);
        if (actionOpt.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Action not found with ID: " + actionId);
        }

        VolunteerAction action = actionOpt.get();
        
        // Get the previous attendance status to avoid duplicate point awards
        Map<String, Boolean> previousAttendance = action.getAttendance() != null ? new HashMap<>(action.getAttendance()) : new HashMap<>();
        
        // Update attendance map based on provided data
        Map<String, Boolean> updatedAttendance = previousAttendance != null ? new HashMap<>(previousAttendance) : new HashMap<>();
        
        for (VolunteerAttendanceDTO attendanceDTO : attendanceData) {
            String username = attendanceDTO.getUsername();
            boolean isPresent = attendanceDTO.isPresent();
            
            // Only update attendance for volunteers who are actually joined in this action
            if (action.getJoinedUserIds().contains(username)) {
                 updatedAttendance.put(username, isPresent);
                 
                 // Award points if the volunteer is marked present and was not marked present before
                 boolean wasPresentBefore = previousAttendance.getOrDefault(username, false);
                 if (isPresent && !wasPresentBefore) {
                     Optional<User> userOptional = userRepository.findByUsername(username);
                     if (userOptional.isPresent()) {
                         User volunteer = userOptional.get();
                         int currentPoints = volunteer.getPoints() != null ? volunteer.getPoints() : 0;
                         volunteer.setPoints(currentPoints + 10); // Award 10 points
                         userRepository.save(volunteer);
                     }
                 }
            }
        }
        action.setAttendance(updatedAttendance);
        
        volunteerActionRepository.save(action);
    }
}
