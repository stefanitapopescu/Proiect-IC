package com.example.demo.dto;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class WalletItemDTO {
    private String id;
    private String name;
    private String tag;
    private int quantity;
}

