package com.example.demo.controller;

import com.example.demo.dto.NewVolunteerActionRequest;
import com.example.demo.service.EntityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/entity")
@CrossOrigin(origins = "http://localhost:3000")
public class EntityController {

    @Autowired
    private EntityService entityService;

  
    @PostMapping("/post-action")
    public ResponseEntity<?> postVolunteerAction(@RequestBody NewVolunteerActionRequest request) {
        try {
            entityService.postVolunteerAction(request);
            return ResponseEntity.ok("Acțiunea de voluntariat a fost postată cu succes!");
        } catch (ResponseStatusException ex) {
            return ResponseEntity.status(ex.getStatusCode())
                                 .body(ex.getReason());
        }
    }
}
