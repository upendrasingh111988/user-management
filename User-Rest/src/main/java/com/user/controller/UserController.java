package com.user.controller;

import com.user.entity.User;
import com.user.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

//@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/v1")
public class UserController {
    @Autowired
    private UserService userService;

    @PostMapping("/createUser")
    public ResponseEntity<User> createUser(@RequestBody User user) {
        try {
            User savedUsers = userService.createUsers(user);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedUsers);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new User());
        }

    }
    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }
    @GetMapping("/users/{userId}")
    public ResponseEntity<User> getUserById(@PathVariable Long userId){

        User user = userService.getUserById(userId);
        return ResponseEntity.ok(user);
    }
    @PutMapping("/users/{userId}")
    public ResponseEntity<User> updateUser(@PathVariable Long userId,
                                           @RequestBody User userDetails
    ){
        User updatedUsers = userService.updateUser(userId, userDetails);
        return ResponseEntity.ok(updatedUsers);
    }

    @DeleteMapping("/users/{userId}")
    public ResponseEntity<String> deleteUser( @PathVariable Long userId){
        userService.deleteUser(userId);
        return ResponseEntity.ok("User deleted Successfully..");
    }

}
