package com.livestream.entity;

import lombok.Data;

@Data(staticConstructor = "of")
public class UserInfo {
    private int uid;
    private String name;
    private int gender;
    private String email;

    private UserAccount account;
}
