package com.siddharth.simplynotes.controller;

import com.siddharth.simplynotes.dto.*;
import com.siddharth.simplynotes.entity.User;
import com.siddharth.simplynotes.repository.UserRepository;
import com.siddharth.simplynotes.security.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthController(UserRepository userRepository,
                          BCryptPasswordEncoder passwordEncoder,
                          JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    // 🔐 REGISTER
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody AuthRequest request) {

        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("Username already exists");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        userRepository.save(user);

        return ResponseEntity.ok("User registered successfully");
    }

    // 🔐 LOGIN
    @PostMapping("/login")
public ResponseEntity<?> login(@RequestBody AuthRequest request) {

    System.out.println("🔍 Login attempt for: " + request.getUsername());

    User user = userRepository.findByUsername(request.getUsername()).orElse(null);

    if (user == null) {
        System.out.println("❌ USER NOT FOUND");
        return ResponseEntity.badRequest().body("Invalid username");
    }

    System.out.println("✔ User found in DB");

    if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
        System.out.println("❌ PASSWORD MISMATCH");
        return ResponseEntity.badRequest().body("Invalid password");
    }

    System.out.println("✅ PASSWORD MATCHED");

    String token = jwtUtil.generateToken(user.getUsername());

    System.out.println("🔥 TOKEN GENERATED: " + token);

    return ResponseEntity.ok(new AuthResponse(token));
}
}