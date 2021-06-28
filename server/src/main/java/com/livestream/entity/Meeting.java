package com.livestream.entity;

import lombok.Data;

@Data(staticConstructor = "of")
public class Meeting {
    private int uid;
    private String name;
    private boolean authRequired;
    private String password;
    private String streamId;

    private UserInfo host;
}
