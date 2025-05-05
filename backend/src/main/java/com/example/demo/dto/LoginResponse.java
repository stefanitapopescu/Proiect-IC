package com.example.demo.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class LoginResponse {
    private String token;
    private String userType;
    
    public LoginResponse(String token, String userType) {
        this.token = token;
        this.userType = userType;
    }
}
