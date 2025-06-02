package com.example.demo.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@Document(collection = "volunteerActions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class VolunteerAction {
    @Id
    private String id;
    private String title;
    private String description;
    private String location;
    private Double locationLat;
    private Double locationLng;
    private String type;
    private String category;
    private String imageUrl;
    private int requestedVolunteers;
    private int allocatedVolunteers;
    private LocalDateTime actionDate;
    private String date;
    private String postedBy;
    private List<String> joinedUserIds = new ArrayList<>();
    private Map<String, Boolean> attendance = new HashMap<>(); // Map<username, present_status>
}
