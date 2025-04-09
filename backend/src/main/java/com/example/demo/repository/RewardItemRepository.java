package com.example.demo.repository;

import com.example.demo.model.RewardItem;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface RewardItemRepository extends MongoRepository<RewardItem, String> {
    List<RewardItem> findByVolunteerActionId(String volunteerActionId);
}
