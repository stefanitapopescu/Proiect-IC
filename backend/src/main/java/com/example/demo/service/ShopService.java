package com.example.demo.service;

import com.example.demo.model.RewardItem;
import com.example.demo.repository.RewardItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ShopService {

    @Autowired
    private RewardItemRepository rewardItemRepository;

    public List<RewardItem> getAllRewards() {
        return rewardItemRepository.findAll();
    }
}
