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
    private int quantity;
    // Legătură către acțiunea de voluntariat pentru care este oferit acest premiu
    private String volunteerActionId;
}
