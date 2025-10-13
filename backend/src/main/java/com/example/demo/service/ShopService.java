package com.example.demo.service;

import com.example.demo.dto.RewardItemDTO;
import com.example.demo.dto.WalletItemDTO;
import com.example.demo.model.RewardItem;
import com.example.demo.model.User;
import com.example.demo.repository.RewardItemRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.util.RewardTagCost;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.HashMap;

@Service
public class ShopService {

    @Autowired
    private RewardItemRepository rewardItemRepository;

    @Autowired
    private UserRepository userRepository;

    
  public List<RewardItemDTO> getAllRewards() {
  return rewardItemRepository.findAll().stream()
    .filter(r -> r.getTag() != null)
    .map(reward -> {
      RewardItemDTO dto = new RewardItemDTO();
      dto.setId(reward.getId());
      dto.setName(reward.getName());
      dto.setQuantity(reward.getQuantity());
      dto.setTag(reward.getTag());
      dto.setPointCost( RewardTagCost.TAG_COSTS.getOrDefault(reward.getTag(), 0) );
      return dto;
    })
    .collect(Collectors.toList());
}

    
    public String buyReward(String rewardId, String username) {
        RewardItem reward = rewardItemRepository.findById(rewardId)
            .orElseThrow(() -> new RuntimeException("Reward not found"));

        if (reward.getQuantity() <= 0) {
            throw new RuntimeException("Reward out of stock");
        }

        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));

        int cost = RewardTagCost.TAG_COSTS.getOrDefault(reward.getTag(), 0);

        if (user.getPoints() < cost) {
            throw new RuntimeException("Nu ai suficiente puncte. Cost: " + cost);
        }

        user.setPoints(user.getPoints() - cost);
        user.getBoughtRewardIds().add(rewardId);
        userRepository.save(user);

        reward.setQuantity(reward.getQuantity() - 1);
        rewardItemRepository.save(reward);
        return String.format(
            "Ai cumpărat '%s' pentru %d puncte!",
            reward.getName(),
            cost
        );
    }

  
    public List<WalletItemDTO> getUserBoughtRewards(String username) {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        Map<String, Long> rewardCounts = user.getBoughtRewardIds().stream()
            .collect(Collectors.groupingBy(id -> id, Collectors.counting()));
        
        return rewardCounts.entrySet().stream()
            .map(entry -> {
                String rewardId = entry.getKey();
                Long count = entry.getValue();
                
                RewardItem reward = rewardItemRepository.findById(rewardId).orElse(null);
                if (reward != null) {
                    return new WalletItemDTO(
                        reward.getId(),
                        reward.getName(),
                        reward.getTag(),
                        count.intValue()
                    );
                }
                return null;
            })
            .filter(dto -> dto != null)
            .collect(Collectors.toList());
    }
}
