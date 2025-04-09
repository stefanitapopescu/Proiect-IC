package com.example.demo.controller;

import com.example.demo.dto.NewVolunteerActionRequest;
import com.example.demo.model.VolunteerAction;
import com.example.demo.model.RewardItem;
import com.example.demo.repository.VolunteerActionRepository;
import com.example.demo.repository.RewardItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.context.SecurityContextHolder;
import java.util.List;

@RestController
@RequestMapping("/api/entity")
@CrossOrigin(origins = "http://localhost:3000")
public class EntityController {

    @Autowired
    private VolunteerActionRepository volunteerActionRepository;

    @Autowired
    private RewardItemRepository rewardItemRepository;

    // Endpoint pentru postarea unei noi acțiuni de voluntariat (de către beneficiar/entitate)
    @PostMapping("/post-action")
    public ResponseEntity<?> postVolunteerAction(@RequestBody NewVolunteerActionRequest request) {
        // Validare: suma totală a premiilor trebuie să fie cel puțin egală cu numărul de voluntari solicitați
        int totalRewards = request.getRewardItems()
                                  .stream()
                                  .mapToInt(item -> item.getQuantity())
                                  .sum();
        if (totalRewards < request.getRequestedVolunteers()) {
            return ResponseEntity.badRequest()
                    .body("Totalul obiectelor oferite ca premii trebuie să fie cel puțin egal cu numărul de voluntari solicitați.");
        }

        // Obține username-ul beneficiarului (entității) din contextul de securitate
        String username = SecurityContextHolder.getContext().getAuthentication().getName();

        // Creează o nouă acțiune de voluntariat
        VolunteerAction action = new VolunteerAction();
        action.setTitle(request.getTitle());
        action.setDescription(request.getDescription());
        action.setLocation(request.getLocation());
        action.setType(request.getType());
        action.setRequestedVolunteers(request.getRequestedVolunteers());
        action.setAllocatedVolunteers(0);
        action.setActionDate(request.getActionDate());
        action.setPostedBy(username);

        VolunteerAction savedAction = volunteerActionRepository.save(action);

        // Salvează fiecare obiect de premii asociat acțiunii
        for (var rewardDTO : request.getRewardItems()) {
            RewardItem rewardItem = new RewardItem();
            rewardItem.setName(rewardDTO.getName());
            rewardItem.setQuantity(rewardDTO.getQuantity());
            rewardItem.setVolunteerActionId(savedAction.getId());
            rewardItemRepository.save(rewardItem);
        }

        return ResponseEntity.ok("Acțiunea de voluntariat a fost postată cu succes!");
    }
}
