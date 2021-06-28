package com.livestream.mapper;

import com.livestream.entity.UserAccount;
import com.livestream.entity.UserInfo;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface UserMapper {
    UserAccount getAccountByUsername(String username);
    UserInfo getUserInfoByAccountId(int id);
}