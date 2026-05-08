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

import java.security.Principal;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final UserRepository userRepository;
    private final WorkspaceRepository workspaceRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthController(UserRepository userRepository,
                          WorkspaceRepository workspaceRepository,
                          BCryptPasswordEncoder passwordEncoder,
                          JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.workspaceRepository = workspaceRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody AuthRequest request) {
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("Username already exists");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        
        User savedUser = userRepository.save(user);

        Workspace defaultWorkspace = new Workspace();
        defaultWorkspace.setName("Personal Workspace");
        defaultWorkspace.setIcon("home");
        defaultWorkspace.setUser(savedUser);
        
        workspaceRepository.save(defaultWorkspace);

        return ResponseEntity.ok("User registered successfully with default workspace");
    }

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

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Principal principal) {
        if (principal == null) return ResponseEntity.status(401).body("Unauthorized");
        
        User user = userRepository.findByUsername(principal.getName()).orElse(null);
        if (user == null) return ResponseEntity.status(404).body("User not found");
        
        return ResponseEntity.ok(user);
    }

    @PutMapping("/update")
    public ResponseEntity<?> updateUser(Principal principal, @RequestBody Map<String, String> updates) {
        if (principal == null) return ResponseEntity.status(401).body("Unauthorized");
        
        User user = userRepository.findByUsername(principal.getName()).orElse(null);
        if (user == null) return ResponseEntity.badRequest().body("User not found");

        if (updates.containsKey("firstName")) user.setFirstName(updates.get("firstName"));
        if (updates.containsKey("lastName")) user.setLastName(updates.get("lastName"));
        if (updates.containsKey("email")) user.setEmail(updates.get("email"));

        userRepository.save(user);
        return ResponseEntity.ok(user);
    }
}