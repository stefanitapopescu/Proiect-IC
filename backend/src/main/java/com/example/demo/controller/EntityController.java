package com.example.demo.controller;

import com.example.demo.dto.NewVolunteerActionRequest;
import com.example.demo.model.VolunteerAction;
import com.example.demo.service.EntityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.List;
import java.util.Map;
import com.example.demo.dto.VolunteerAttendanceDTO;

@RestController
@RequestMapping("/api/entity")
@CrossOrigin(origins = "http://localhost:3000")
public class EntityController {

    private static final Logger logger = LoggerFactory.getLogger(EntityController.class);

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

    @GetMapping("/posted-actions")
    public ResponseEntity<List<Map<String, Object>>> getPostedActions() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        logger.info("GET /posted-actions - User: {}", auth.getName());
        
        List<Map<String, Object>> postedActions = entityService.getPostedActions(auth.getName());
        return ResponseEntity.ok(postedActions);
    }

    @PostMapping("/actions/{actionId}/attendance")
    public ResponseEntity<?> saveVolunteerAttendance(
            @PathVariable String actionId,
            @RequestBody List<VolunteerAttendanceDTO> attendanceData) {
        try {
            entityService.saveVolunteerAttendance(actionId, attendanceData);
            return ResponseEntity.ok("Attendance saved successfully.");
        } catch (ResponseStatusException ex) {
            return ResponseEntity.status(ex.getStatusCode())
                                 .body(ex.getReason());
        } catch (Exception ex) {
            logger.error("Error saving attendance for action {}: {}", actionId, ex.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body("Error saving attendance.");
        }
    }
}
