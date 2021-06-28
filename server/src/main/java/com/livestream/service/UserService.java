package com.livestream.service;

import org.springframework.stereotype.Service;

@Service
public interface IUserService {
    boolean authenticated(String username, String password);
}
