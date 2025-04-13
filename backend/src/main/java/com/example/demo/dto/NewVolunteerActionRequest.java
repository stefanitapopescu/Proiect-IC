package com.example.demo.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class NewVolunteerActionRequest {
    private String title;
    private String description;
    private String location;
    private String type; // tipul actiunii
    private int requestedVolunteers;
    private LocalDateTime actionDate;
    private List<RewardItemDTO> rewardItems;
}
