package com.example.demo.controller;

import com.example.demo.dto.VolunteerSignupRequest;
import com.example.demo.model.VolunteerAction;
import com.example.demo.repository.VolunteerActionRepository;
import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.context.SecurityContextHolder;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/volunteer")
@CrossOrigin(origins = "http://localhost:3000")
public class VolunteerController {

    @Autowired
    private VolunteerActionRepository volunteerActionRepository;

    @Autowired
    private UserRepository userRepository;

    // Endpoint pentru a obține lista de acțiuni de voluntariat
    @GetMapping("/actions")
    public ResponseEntity<List<VolunteerAction>> getVolunteerActions(
            @RequestParam(required = false) String sortBy) {
        List<VolunteerAction> actions = volunteerActionRepository.findAll();
        // Aici se poate implementa logica de sortare după "actionDate", "location" sau "type"
        return ResponseEntity.ok(actions);
    }

    // Endpoint pentru înscrierea unui voluntar la o acțiune
    @PostMapping("/signup")
    public ResponseEntity<?> signupForAction(@RequestBody VolunteerSignupRequest request) {
        Optional<VolunteerAction> actionOptional = volunteerActionRepository.findById(request.getVolunteerActionId());
        if (actionOptional.isEmpty()) {
            return ResponseEntity.badRequest().body("ID-ul acțiunii de voluntariat este invalid.");
        }
        VolunteerAction action = actionOptional.get();
        // Verifică dacă mai există locuri disponibile
        if (action.getAllocatedVolunteers() >= action.getRequestedVolunteers()) {
            return ResponseEntity.badRequest().body("Nu mai sunt locuri disponibile pentru această acțiune.");
        }
        // Incrementarea numărului de voluntari înscriși
        action.setAllocatedVolunteers(action.getAllocatedVolunteers() + 1);
        volunteerActionRepository.save(action);

        // Actualizează punctele utilizatorului (ex: 10 puncte per acțiune)
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<User> userOptional = userRepository.findByUsername(username);
        if (userOptional.isPresent()) {
            User volunteer = userOptional.get();
            int currentPoints = volunteer.getPoints() != null ? volunteer.getPoints() : 0;
            volunteer.setPoints(currentPoints + 10);
            userRepository.save(volunteer);
        }

        return ResponseEntity.ok("Înscrierea a fost realizată cu succes!");
    }
}
