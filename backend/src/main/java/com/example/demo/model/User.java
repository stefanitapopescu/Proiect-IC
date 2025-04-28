package com.example.demo.model;

import lombok.*;
import java.util.ArrayList;
import java.util.List;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    private String id;
    private String username;
    private String password;
    private String role; 
    private Integer points = 0; 
    private List<String> boughtRewardIds = new ArrayList<>();
}
