package com.revworkforce.user_service.service;

import com.revworkforce.user_service.dto.ChangePasswordRequest;
import com.revworkforce.user_service.dto.LoginRequest;
import com.revworkforce.user_service.dto.LoginResponse;

public interface AuthService {

    LoginResponse login(LoginRequest request);
    void changePassword(ChangePasswordRequest request);
}