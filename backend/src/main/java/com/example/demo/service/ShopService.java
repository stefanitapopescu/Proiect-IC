package com.example.demo.service;

import com.example.demo.model.RewardItem;
import com.example.demo.model.User;
import com.example.demo.repository.RewardItemRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ShopService {

    @Autowired
    private RewardItemRepository rewardItemRepository;

    @Autowired
    private UserRepository userRepository;

    public List<RewardItem> getAllRewards() {
        return rewardItemRepository.findAll();
    }

    public String buyReward(String rewardId, String username) {
        RewardItem reward = rewardItemRepository.findById(rewardId)
                .orElseThrow(() -> new RuntimeException("Reward not found"));

        if (reward.getQuantity() <= 0) {
            throw new RuntimeException("Reward out of stock");
        }

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getBoughtRewardIds().contains(rewardId)) {
            throw new RuntimeException("Already bought this reward");
        }

        reward.setQuantity(reward.getQuantity() - 1);
        rewardItemRepository.save(reward);

        user.getBoughtRewardIds().add(rewardId);
        userRepository.save(user);

        return "Reward bought successfully!";
    }

    public List<RewardItem> getUserBoughtRewards(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return rewardItemRepository.findAllById(user.getBoughtRewardIds());
    }

}
