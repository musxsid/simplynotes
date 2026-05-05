package com.siddharth.simplynotes.controller;

import com.siddharth.simplynotes.entity.Folder;
import com.siddharth.simplynotes.entity.User;
import com.siddharth.simplynotes.entity.Workspace;
import com.siddharth.simplynotes.repository.FolderRepository;
import com.siddharth.simplynotes.repository.UserRepository;
import com.siddharth.simplynotes.repository.WorkspaceRepository;

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
    private final WorkspaceRepository workspaceRepository; // 🔥 NEW

    public FolderController(FolderRepository folderRepository,
                            UserRepository userRepository,
                            WorkspaceRepository workspaceRepository) {
        this.folderRepository = folderRepository;
        this.userRepository = userRepository;
        this.workspaceRepository = workspaceRepository;
    }

    // 📂 GET ALL FOLDERS (Upgraded for Workspaces)
    @GetMapping
    public ResponseEntity<?> getFolders(
            @RequestParam(required = false) Long workspaceId, // 🔥 NEW: Optional parameter
            Authentication authentication) {
            
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Not authenticated");
        }

        String username = authentication.getName();
        User user = userRepository.findByUsername(username).orElse(null);

        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        List<Folder> folders;

        // 🔥 NEW LOGIC: Filter by workspace if provided
        if (workspaceId != null) {
            Workspace workspace = workspaceRepository.findById(workspaceId).orElse(null);
            if (workspace == null || !workspace.getUser().getId().equals(user.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Invalid workspace");
            }
            folders = folderRepository.findByWorkspace(workspace);
        } else {
            // Fallback: Get the user's first workspace (Personal Workspace)
            List<Workspace> userWorkspaces = workspaceRepository.findByUser(user);
            if (!userWorkspaces.isEmpty()) {
                folders = folderRepository.findByWorkspace(userWorkspaces.get(0));
            } else {
                folders = folderRepository.findByUser(user); // Extreme fallback
            }
        }

        return ResponseEntity.ok(folders);
    }

    // ➕ CREATE FOLDER (Upgraded for Workspaces)
    @PostMapping
    public ResponseEntity<?> createFolder(
            @RequestParam(required = false) Long workspaceId, // 🔥 NEW: Optional parameter
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

        // 🔥 NEW LOGIC: Assign folder to a workspace
        Workspace targetWorkspace = null;
        if (workspaceId != null) {
            targetWorkspace = workspaceRepository.findById(workspaceId).orElse(null);
        } else {
            // Fallback to first workspace if frontend doesn't send an ID yet
            List<Workspace> userWorkspaces = workspaceRepository.findByUser(user);
            if (!userWorkspaces.isEmpty()) {
                targetWorkspace = userWorkspaces.get(0);
            }
        }

        // Securely link the workspace only if the user owns it
        if (targetWorkspace != null && targetWorkspace.getUser().getId().equals(user.getId())) {
            folder.setWorkspace(targetWorkspace);
        }

        Folder saved = folderRepository.save(folder);

        return ResponseEntity.ok(saved);
    }

    // ❌ DELETE FOLDER (Unchanged, kept exactly as you had it)
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