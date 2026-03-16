package com.revworkforce.user_service.service;

import com.revworkforce.user_service.dto.CreateUserRequest;
import com.revworkforce.user_service.entity.Role;
import com.revworkforce.user_service.entity.User;
import com.revworkforce.user_service.repository.RoleRepository;
import com.revworkforce.user_service.repository.UserRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    @Override
    public User createUser(CreateUserRequest request) {

        Role role = roleRepository.findByName(request.getRole())
                .orElseThrow(() -> new RuntimeException("Role not found"));

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setManagerId(request.getManagerId());
        user.setRole(role);

        user.setPassword(passwordEncoder.encode("temp123"));// temporary password

        return userRepository.save(user);
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}