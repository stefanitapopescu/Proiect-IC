package com.example.demo.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.GrantedAuthority;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(origins = "*")
public class TestController {

    @GetMapping("/api/test")
    public String test() {
        return "API is working!";
    }
    
    @GetMapping("/api/auth-debug")
    public Map<String, Object> authDebug() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        
        Map<String, Object> result = new HashMap<>();
        if (auth != null) {
            result.put("isAuthenticated", auth.isAuthenticated());
            result.put("name", auth.getName());
            result.put("authorities", auth.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList()));
            result.put("principal", auth.getPrincipal().toString());
            result.put("details", auth.getDetails() != null ? auth.getDetails().toString() : null);
        } else {
            result.put("isAuthenticated", false);
            result.put("error", "No authentication found in SecurityContext");
        }
        
        result.put("securityContextHolderStrategy", SecurityContextHolder.getContextHolderStrategy().getClass().getName());
        result.put("securityContextClass", SecurityContextHolder.getContext().getClass().getName());
        
        return result;
    }
}
