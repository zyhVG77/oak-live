package com.livestream.controller;

import com.livestream.entity.ChatMessage;
import com.livestream.service.ChatService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Slf4j
@Controller
public class ChatController {
    private final ChatService chatService;

    @Autowired
    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @MessageMapping("/chat")
    @SendTo("/topic/broadcast")
    public ChatMessage sendMessage(ChatMessage message) {
        // Store to database
        this.chatService.saveChatMessage(message);
        // Resending to broadcast
        return message;
    }

    @MessageMapping("/ops")
    @SendTo("/topic/ops")
    public ChatMessage handOps(ChatMessage message) {
        log.info(message.toString());
        return message;
    }
}
