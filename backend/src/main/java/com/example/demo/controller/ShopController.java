package com.example.demo.controller;

import com.example.demo.model.RewardItem;
import com.example.demo.service.ShopService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/shop")
public class ShopController {

    @Autowired
    private ShopService shopService;

    @GetMapping("/rewards")
    public List<RewardItem> getAllRewards() {
        return shopService.getAllRewards();
    }
}
