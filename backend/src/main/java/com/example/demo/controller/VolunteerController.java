package com.example.demo.controller;

import com.example.demo.dto.VolunteerSignupRequest;
import com.example.demo.model.VolunteerAction;
import com.example.demo.service.VolunteerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/volunteer")
@CrossOrigin(origins = "http://localhost:3000")
public class VolunteerController {

    @Autowired
    private VolunteerService volunteerService;

    @GetMapping("/actions")
    public ResponseEntity<Iterable<VolunteerAction>> getVolunteerActions(@RequestParam(required = false) String sortBy) {
        Iterable<VolunteerAction> actions = volunteerService.getAllActions(sortBy);
        return ResponseEntity.ok(actions);
    }

    @PostMapping("/signup")
     public String signupForAction(@RequestBody VolunteerSignupRequest request) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        volunteerService.signupForAction(request, username);
        return "Înscriere realizată cu succes!";
    }
}
