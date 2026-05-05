package com.siddharth.simplynotes.controller;

import com.siddharth.simplynotes.entity.Folder;
import com.siddharth.simplynotes.entity.User;
import com.siddharth.simplynotes.repository.FolderRepository;
import com.siddharth.simplynotes.repository.UserRepository;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/folders")
@CrossOrigin(origins = "*")
public class FolderController {

    private final FolderRepository folderRepository;
    private final UserRepository userRepository;

    public FolderController(FolderRepository folderRepository,
                            UserRepository userRepository) {
        this.folderRepository = folderRepository;
        this.userRepository = userRepository;
    }

    // 📂 GET ALL FOLDERS
    @GetMapping
    public ResponseEntity<?> getFolders(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Not authenticated");
        }

        String username = authentication.getName();

        User user = userRepository.findByUsername(username).orElse(null);

        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        List<Folder> folders = folderRepository.findByUser(user);

        return ResponseEntity.ok(folders);
    }

    // ➕ CREATE FOLDER
    @PostMapping
    public ResponseEntity<?> createFolder(
            @RequestBody Folder folder,
            Authentication authentication
    ) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Not authenticated");
        }

        String username = authentication.getName();

        User user = userRepository.findByUsername(username).orElse(null);

        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        folder.setUser(user);

        Folder saved = folderRepository.save(folder);

        return ResponseEntity.ok(saved);
    }

    // ❌ DELETE FOLDER
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteFolder(
            @PathVariable Long id,
            Authentication authentication
    ) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Not authenticated");
        }

        String username = authentication.getName();

        Folder folder = folderRepository.findById(id).orElse(null);

        if (folder == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Folder not found");
        }

        if (!folder.getUser().getUsername().equals(username)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied");
        }

        folderRepository.delete(folder);

        return ResponseEntity.ok("Folder deleted");
    }
}