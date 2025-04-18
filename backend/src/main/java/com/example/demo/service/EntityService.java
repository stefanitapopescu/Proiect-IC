// src/service/EntityService.java
package com.example.demo.service;

import com.example.demo.dto.NewVolunteerActionRequest;
import com.example.demo.model.RewardItem;
import com.example.demo.model.VolunteerAction;
import com.example.demo.repository.RewardItemRepository;
import com.example.demo.repository.VolunteerActionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.server.ResponseStatusException;

@Service
public class EntityService {

    @Autowired
    private VolunteerActionRepository volunteerActionRepository;

    @Autowired
    private RewardItemRepository rewardItemRepository;

    public void postVolunteerAction(NewVolunteerActionRequest request) {
        // Dacă numărul de voluntari solicitați este mai mare de 0 și nu s-au adăugat reward items
        if (request.getRequestedVolunteers() > 0 && (request.getRewardItems() == null || request.getRewardItems().isEmpty())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                "Trebuie să adăugați cel puțin un premiu dacă numărul de voluntari solicitați este mai mare de 0!");
        }

        // Calculăm totalul obiectelor oferite ca premii
        int totalRewards = request.getRewardItems()
                                  .stream()
                                  .mapToInt(item -> item.getQuantity())
                                  .sum();

        if (totalRewards < request.getRequestedVolunteers()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Totalul obiectelor oferite ca premii trebuie să fie cel puțin egal cu numărul de voluntari solicitați.");
        }

        // Obține username-ul entității din SecurityContext
        String username = SecurityContextHolder.getContext().getAuthentication().getName();

        // Creăm obiectul de acțiune de voluntariat
        VolunteerAction action = new VolunteerAction();
        action.setTitle(request.getTitle());
        action.setDescription(request.getDescription());
        action.setLocation(request.getLocation());
        action.setType(request.getType());
        action.setRequestedVolunteers(request.getRequestedVolunteers());
        action.setAllocatedVolunteers(0);
        action.setActionDate(request.getActionDate());
        action.setPostedBy(username);

        // Salvăm acțiunea
        VolunteerAction savedAction = volunteerActionRepository.save(action);

        // Pentru fiecare obiect de premiu, creăm și salvăm un RewardItem
        request.getRewardItems().forEach(rewardDTO -> {
            RewardItem rewardItem = new RewardItem();
            rewardItem.setName(rewardDTO.getName());
            rewardItem.setQuantity(rewardDTO.getQuantity());
            rewardItem.setVolunteerActionId(savedAction.getId());
            rewardItemRepository.save(rewardItem);
        });
    }
}
