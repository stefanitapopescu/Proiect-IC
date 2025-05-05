package com.example.demo.controller;

import com.example.demo.model.RewardItem;
import com.example.demo.service.ShopService;
import com.example.demo.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/shop")
@CrossOrigin(origins = "http://localhost:3000")
public class ShopController {

    @Autowired
    private ShopService shopService;

    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping("/rewards")
    public List<RewardItem> getAllRewards() {
        return shopService.getAllRewards();
    }

    @GetMapping("/wallet")
    public List<RewardItem> getUserBoughtRewards(@RequestHeader("Authorization") String token) {
        String username = jwtUtil.extractUsername(token.substring(7));
        return shopService.getUserBoughtRewards(username);
    }

    @PostMapping("/buy/{rewardId}")
    public ResponseEntity<Map<String, String>> buyReward(@PathVariable String rewardId, @RequestHeader("Authorization") String token) {
        String username = jwtUtil.extractUsername(token.substring(7));
        String message = shopService.buyReward(rewardId, username);
        
        Map<String, String> response = new HashMap<>();
        response.put("message", message);
        
        return ResponseEntity.ok(response);
    }
}
