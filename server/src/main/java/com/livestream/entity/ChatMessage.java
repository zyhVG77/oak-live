package com.livestream.entity;

import lombok.Data;

import java.util.Date;

@Data(staticConstructor = "of")
public class ChatMessage {
    private int uid;
    private int meetingId;
    private UserInfo sender;

    private String type;
    private String content;
    private Date sendTime;
}
