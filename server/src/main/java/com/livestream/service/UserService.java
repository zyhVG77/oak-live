package com.livestream.service;

import com.livestream.entity.UserAccount;
import com.livestream.entity.UserInfo;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public interface UserService {
    Map<String, ?> authenticated(UserAccount account);
    UserInfo getUserInfo(int id);
}