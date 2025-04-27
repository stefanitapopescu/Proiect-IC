package com.example.demo.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

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
    private String type;
    private int requestedVolunteers;
    private int allocatedVolunteers;
    private LocalDateTime actionDate;
    private String postedBy;
    private List<String> joinedUserIds = new ArrayList<>();
}
