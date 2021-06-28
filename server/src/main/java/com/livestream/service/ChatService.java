package com.livestream.service;

import com.livestream.entity.ChatMessage;
import org.springframework.stereotype.Service;

@Service
public interface ChatService {
    void saveChatMessage(ChatMessage message);
}
