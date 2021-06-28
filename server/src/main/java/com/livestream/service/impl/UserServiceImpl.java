package com.livestream.service.impl;

import com.livestream.entity.UserAccount;
import com.livestream.entity.UserInfo;
import com.livestream.mapper.UserMapper;
import com.livestream.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class UserServiceImpl implements UserService {
    private final UserMapper userMapper;

    @Autowired
    public UserServiceImpl(UserMapper userMapper) {
        this.userMapper = userMapper;
    }

    @Override
    public Map<String, ?> authenticated(UserAccount account) {
        UserAccount res = userMapper.getAccountByUsername(account.getUsername());
        if (res == null)
            // User not exist
            return Map.of("state", 0);
        else if (res.getPassword().equals(account.getPassword()))
            // Confirm
            return Map.of("state", 2, "account", res);
        else
            // Password incorrect
            return Map.of("state", 1);
    }

    @Override
    public UserInfo getUserInfo(int id) {
        return userMapper.getUserInfoByAccountId(id);
    }
}
