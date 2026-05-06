package com.siddharth.simplynotes.controller;

import com.siddharth.simplynotes.entity.Folder;
import com.siddharth.simplynotes.entity.Note; // 🔥 NEW
import com.siddharth.simplynotes.entity.User;
import com.siddharth.simplynotes.entity.Workspace;
import com.siddharth.simplynotes.repository.FolderRepository;
import com.siddharth.simplynotes.repository.NoteRepository; // 🔥 NEW
import com.siddharth.simplynotes.repository.UserRepository;
import com.siddharth.simplynotes.repository.WorkspaceRepository;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional; // 🔥 NEW
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/folders")
@CrossOrigin(origins = "*")
public class FolderController {

    private final FolderRepository folderRepository;
    private final UserRepository userRepository;
    private final WorkspaceRepository workspaceRepository;
    private final NoteRepository noteRepository; // 🔥 NEW

    public FolderController(FolderRepository folderRepository,
                            UserRepository userRepository,
                            WorkspaceRepository workspaceRepository,
                            NoteRepository noteRepository) { // 🔥 NEW
        this.folderRepository = folderRepository;
        this.userRepository = userRepository;
        this.workspaceRepository = workspaceRepository;
        this.noteRepository = noteRepository;
    }

    // 📂 GET ALL FOLDERS (Remains the same)
    @GetMapping
    public ResponseEntity<?> getFolders(
            @RequestParam(required = false) Long workspaceId,
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

        if (workspaceId != null) {
            Workspace workspace = workspaceRepository.findById(workspaceId).orElse(null);
            if (workspace == null || !workspace.getUser().getId().equals(user.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Invalid workspace");
            }
            folders = folderRepository.findByWorkspace(workspace);
        } else {
            List<Workspace> userWorkspaces = workspaceRepository.findByUser(user);
            if (!userWorkspaces.isEmpty()) {
                folders = folderRepository.findByWorkspace(userWorkspaces.get(0));
            } else {
                folders = folderRepository.findByUser(user);
            }
        }

        return ResponseEntity.ok(folders);
    }

    // ➕ CREATE FOLDER (Remains the same)
    @PostMapping
    public ResponseEntity<?> createFolder(
            @RequestParam(required = false) Long workspaceId,
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

        Workspace targetWorkspace = null;
        if (workspaceId != null) {
            targetWorkspace = workspaceRepository.findById(workspaceId).orElse(null);
        } else {
            List<Workspace> userWorkspaces = workspaceRepository.findByUser(user);
            if (!userWorkspaces.isEmpty()) {
                targetWorkspace = userWorkspaces.get(0);
            }
        }

        if (targetWorkspace != null && targetWorkspace.getUser().getId().equals(user.getId())) {
            folder.setWorkspace(targetWorkspace);
        }

        Folder saved = folderRepository.save(folder);

        return ResponseEntity.ok(saved);
    }

    // ❌ DELETE FOLDER (Upgraded to handle nested notes safely)
    @DeleteMapping("/{id}")
    @Transactional // 🔥 NEW: Required for safely modifying notes before deletion
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

        // 🔥 NEW LOGIC: Safely "ungroup" all notes inside this folder so the database doesn't panic
        List<Note> notes = folder.getNotes();
        if (notes != null) {
            for (Note note : notes) {
                note.setFolder(null); // Unlink the folder
                noteRepository.save(note); // Save the note as ungrouped
            }
        }

        folderRepository.delete(folder);
        return ResponseEntity.ok("Folder deleted");
    }
}