package com.example.demo.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

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
    private String type; // de exemplu: "plantare de copaci", "reciclare" etc.
    private int requestedVolunteers;
    private int allocatedVolunteers;
    private LocalDateTime actionDate;
    private String postedBy; // username-ul beneficiarului
}
