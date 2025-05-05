package com.example.demo.service;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepo;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepo.findByUsername(username)
                            .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));
                            
        List<SimpleGrantedAuthority> authorities = new ArrayList<>();
        
        if (user.getRole() != null && !user.getRole().isEmpty()) {
            authorities.add(new SimpleGrantedAuthority(user.getRole()));
        }
        
        if (user.getUserType() != null && !user.getUserType().isEmpty()) {
            authorities.add(new SimpleGrantedAuthority(user.getUserType()));
        }
        
        if (authorities.isEmpty()) {
            authorities.add(new SimpleGrantedAuthority("USER"));
        }
        
        return new org.springframework.security.core.userdetails.User(
                user.getUsername(), 
                user.getPassword(),
                authorities
        );
    }
}
