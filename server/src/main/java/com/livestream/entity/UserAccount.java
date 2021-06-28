package com.livestream.entity;

import lombok.Data;

@Data(staticConstructor = "of")
public class UserAccount {
    private int uid;
    private String username;
    private String password;
}