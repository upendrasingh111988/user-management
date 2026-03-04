package com.user.service;

import com.user.entity.User;
import com.user.exception.ResourceNotFoundException;
import com.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // 🔥 CREATE USER (ENCODE PASSWORD)
    public User createUsers(User user) {

        user.setPassword(passwordEncoder.encode(user.getPassword()));

        if (!user.getRole().startsWith("ROLE_")) {
            user.setRole("ROLE_" + user.getRole());
        }

        return userRepository.save(user);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
    @Cacheable(value = "users" , key = "#userId")
    public User getUserById(Long userId) {
        System.out.println("Fetching from DB...");
        return userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found with id: " + userId));
    }

    @CachePut(value = "users" , key = "#userId")
    public User updateUser(Long userId, User userDetails) {
        User existingUser = userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found with id: " + userId));

        existingUser.setAbout(userDetails.getAbout());
        existingUser.setEmail(userDetails.getEmail());
        existingUser.setName(userDetails.getName());

        return userRepository.save(existingUser);
    }

    @CacheEvict(value = "users", key = "#userId")
    public void deleteUser(Long userId) {
        User existingUserById = userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User id is not found: " + userId));

        userRepository.delete(existingUserById);
    }

    // 🔥 IMPORTANT FOR SPRING SECURITY
    @Override
    public UserDetails loadUserByUsername(String username)
            throws UsernameNotFoundException {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() ->
                        new UsernameNotFoundException("user not found with this name: " + username));

        return new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPassword(),
                List.of(new SimpleGrantedAuthority(user.getRole()))
        );
    }
}