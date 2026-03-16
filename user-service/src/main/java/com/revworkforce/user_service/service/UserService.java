package com.revworkforce.user_service.service;

import com.revworkforce.user_service.dto.CreateUserRequest;
import com.revworkforce.user_service.entity.User;

import java.util.List;

public interface UserService {

    User createUser(CreateUserRequest request);

    List<User> getAllUsers();

    User getUserById(Long id);
}
