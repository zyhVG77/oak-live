package com.livestream.controller;

import com.livestream.entity.UserAccount;
import com.livestream.entity.UserInfo;
import com.livestream.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api")
public class UserController {
    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/login")
    public Map<String, String> login(@RequestBody UserAccount account) {
        Map<String, ?> res = userService.authenticated(account);
        /*
            flag 0: Account Not Exist
            flag 1: Password Incorrect
            flag 2: Authenticated
         */
        int state = (int) res.get("state");
        if (state == 0)
            return Map.of("auth", "fail", "reason", "账户不存在！");
        else if (state == 1)
            return Map.of("auth", "fail", "reason", "密码错误！");
        else {
            account = (UserAccount) res.get("account");
            // TODO Generate token here
            String token = String.valueOf(account.getUid());

            return Map.of("auth", "success", "token", token);
        }
    }

    @GetMapping("/get-user-info")
    public UserInfo getUserInfo(@RequestHeader("Authentication") String token) {
        // TODO Parse token for the account id
        int id = Integer.parseInt(token);
        return userService.getUserInfo(id);
    }
}
