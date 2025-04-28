package com.example.demo.controller;

import com.example.demo.model.RewardItem;
import com.example.demo.service.ShopService;
import com.example.demo.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/shop")
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
    public String buyReward(@PathVariable String rewardId, @RequestHeader("Authorization") String token) {
        String username = jwtUtil.extractUsername(token.substring(7));
        return shopService.buyReward(rewardId, username);
    }
}
