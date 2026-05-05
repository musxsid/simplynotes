package com.siddharth.simplynotes.controller;

import com.siddharth.simplynotes.dto.*;
import com.siddharth.simplynotes.entity.User;
import com.siddharth.simplynotes.entity.Workspace;
import com.siddharth.simplynotes.repository.UserRepository;
import com.siddharth.simplynotes.repository.WorkspaceRepository;
import com.siddharth.simplynotes.security.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final UserRepository userRepository;
    private final WorkspaceRepository workspaceRepository; // 🔥 NEW
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthController(UserRepository userRepository,
                          WorkspaceRepository workspaceRepository, // 🔥 NEW
                          BCryptPasswordEncoder passwordEncoder,
                          JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.workspaceRepository = workspaceRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    // 🔐 REGISTER
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody AuthRequest request) {

        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("Username already exists");
        }

        // 1. Create the User
        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        
        // Save user first so they get an ID from the database
        User savedUser = userRepository.save(user);

        // 🔥 2. Auto-create "Personal Workspace" for the new user
        Workspace defaultWorkspace = new Workspace();
        defaultWorkspace.setName("Personal Workspace");
        defaultWorkspace.setIcon("home"); // You can map this to a Lucide icon in React
        defaultWorkspace.setUser(savedUser);
        
        workspaceRepository.save(defaultWorkspace);

        return ResponseEntity.ok("User registered successfully with default workspace");
    }

    // 🔐 LOGIN (Unchanged, just kept here for completeness)
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