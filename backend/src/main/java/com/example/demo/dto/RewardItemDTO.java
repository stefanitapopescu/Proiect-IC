package com.example.demo.dto;

import lombok.Data;
import java.util.List;
import java.util.Arrays;

@Data
public class RewardItemDTO {
   private String id;
  private String name;
  private int quantity;
  private Integer pointCost;
  private String tag;
    
    public static final List<String> ALLOWED_TAGS = Arrays.asList("alimente", "electrocasnice", "jocuri", "vouchere", "accesorii", "haine");

    
}
