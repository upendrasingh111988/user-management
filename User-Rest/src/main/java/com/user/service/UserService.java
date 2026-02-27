package com.user.service;

import com.user.entity.User;
import com.user.exception.ResourceNotFoundException;
import com.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public User createUsers(User user) {
        return userRepository.save(user);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

    }

    public User updateUser(Long userId, User userDetails) {
        User existingUser = userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found with id: " + userId));

        existingUser.setAbout(userDetails.getAbout());
        existingUser.setEmail(userDetails.getEmail());
        existingUser.setName(userDetails.getName());

        return userRepository.save(existingUser);
    }
    public void deleteUser(Long userId){
        User existingUserById = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User id is not found: " + userId));
        userRepository.delete(existingUserById);

    }
}
