package com.example.demo.repository;

import com.example.demo.model.VolunteerAction;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface VolunteerActionRepository extends MongoRepository<VolunteerAction, String> {
}
