package com.livestream.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class AuthChannelInterceptor implements ChannelInterceptor {
    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor headerAccessor= StompHeaderAccessor.wrap(message);
        // First time for connection
        List<String> nativeHeader;
        if (StompCommand.CONNECT.equals(headerAccessor.getCommand()) &&
                (nativeHeader = headerAccessor.getNativeHeader("Authentication")) != null) {
            String token = nativeHeader.get(0);
            // TODO: Handle token here
        }
        return message;
    }
}
