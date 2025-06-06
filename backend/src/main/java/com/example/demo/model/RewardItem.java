package com.example.demo.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "rewardItems")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RewardItem {
    @Id
    private String id;
    private String name;
    private String description;
    private int quantity;
    private Integer pointCost; 
    private String imageUrl; 
    private String volunteerActionId; 
    private String tag; // ex: "alimente", "electrocasnice", "jocuri"
}
