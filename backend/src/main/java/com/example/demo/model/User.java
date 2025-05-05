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
    private String email;
    private String name;
    private String password;
    private String role; 
    private String userType; 
    private Integer points = 0; 
    private List<String> boughtRewardIds = new ArrayList<>();
}
