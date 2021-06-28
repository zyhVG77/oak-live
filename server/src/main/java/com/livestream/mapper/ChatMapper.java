package com.livestream.mapper;

import com.livestream.entity.ChatMessage;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface ChatMapper {
    void insertChatMessage(ChatMessage message);
}
