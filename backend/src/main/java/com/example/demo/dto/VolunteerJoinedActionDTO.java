package com.example.demo.dto;

import com.example.demo.model.RewardItem;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class VolunteerJoinedActionDTO {
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
    private boolean attended; // Attendance status for the logged-in volunteer
    private List<RewardItem> rewardItems; // Include reward items if needed on frontend
} 