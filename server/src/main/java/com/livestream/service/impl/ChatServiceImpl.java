package com.livestream.service.impl;

import com.livestream.entity.ChatMessage;
import com.livestream.mapper.ChatMapper;
import com.livestream.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class ChatServiceImpl implements ChatService {
    private final ChatMapper chatMapper;

    @Autowired
    public ChatServiceImpl(ChatMapper chatMapper) {
        this.chatMapper = chatMapper;
    }

    @Override
    public void saveChatMessage(ChatMessage message) {
        // Add a time
        message.setSendTime(new Date());
        chatMapper.insertChatMessage(message);
    }
}
