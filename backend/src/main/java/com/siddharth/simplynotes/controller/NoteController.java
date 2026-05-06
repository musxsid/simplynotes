package com.siddharth.simplynotes.controller;

import com.siddharth.simplynotes.entity.Note;
import com.siddharth.simplynotes.entity.User;
import com.siddharth.simplynotes.entity.Folder;
import com.siddharth.simplynotes.entity.Workspace;
import com.siddharth.simplynotes.repository.NoteRepository;
import com.siddharth.simplynotes.repository.UserRepository;
import com.siddharth.simplynotes.repository.FolderRepository;
import com.siddharth.simplynotes.repository.WorkspaceRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/notes")
@CrossOrigin(origins = "*")
public class NoteController {

    private final NoteRepository noteRepository;
    private final UserRepository userRepository;
    private final FolderRepository folderRepository;
    private final WorkspaceRepository workspaceRepository; // 🔥 NEW

    public NoteController(NoteRepository noteRepository, 
                          UserRepository userRepository, 
                          FolderRepository folderRepository,
                          WorkspaceRepository workspaceRepository) {
        this.noteRepository = noteRepository;
        this.userRepository = userRepository;
        this.folderRepository = folderRepository;
        this.workspaceRepository = workspaceRepository;
    }

    // DTOs kept exactly as they were
    public static class FolderDTO {
        public Long id;
        public String name;
        public FolderDTO(Long id, String name) { this.id = id; this.name = name; }
    }

    public static class NoteDTO {
        public Long id;
        public String title;
        public String content;
        public Boolean isFavorite;
        public FolderDTO folder;

        public NoteDTO(Note note) {
            this.id = note.getId();
            this.title = note.getTitle();
            this.content = note.getContent();
            this.isFavorite = note.getIsFavorite();
            if (note.getFolder() != null) {
                this.folder = new FolderDTO(note.getFolder().getId(), note.getFolder().getName());
            }
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getNoteById(@PathVariable Long id, Authentication authentication) {
        try {
            if (authentication == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Not authenticated");
            
            Note note = noteRepository.findById(id).orElse(null);
            if (note == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Note not found");
            if (!note.getUser().getUsername().equals(authentication.getName())) return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied");

            return ResponseEntity.ok(new NoteDTO(note));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Server error");
        }
    }

    // 🔍 GET ALL NOTES (Upgraded for Workspaces)
    @GetMapping
    public ResponseEntity<?> getNotes(
            @RequestParam(required = false) Long workspaceId, // 🔥 NEW Optional Param
            Authentication authentication) {
            
        if (authentication == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Not authenticated");
        
        User user = userRepository.findByUsername(authentication.getName()).orElse(null);
        if (user == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");

        List<Note> notes;

        // 🔥 NEW LOGIC: Filter by workspace if provided
        if (workspaceId != null) {
            Workspace workspace = workspaceRepository.findById(workspaceId).orElse(null);
            if (workspace == null || !workspace.getUser().getId().equals(user.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Invalid workspace");
            }
            notes = noteRepository.findByWorkspace(workspace);
        } else {
            // Fallback: Get the user's first workspace
            List<Workspace> userWorkspaces = workspaceRepository.findByUser(user);
            if (!userWorkspaces.isEmpty()) {
                notes = noteRepository.findByWorkspace(userWorkspaces.get(0));
            } else {
                notes = noteRepository.findByUser(user);
            }
        }
        
        List<NoteDTO> response = notes.stream().map(NoteDTO::new).collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    // ➕ CREATE NOTE (Upgraded for Workspaces)
    @PostMapping
    public ResponseEntity<?> addNote(
            @RequestParam(required = false) Long workspaceId, // 🔥 NEW Optional Param
            @RequestBody Note note, 
            Authentication authentication) {
            
        if (authentication == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Not authenticated");
        
        User user = userRepository.findByUsername(authentication.getName()).orElse(null);
        note.setUser(user);

        // Map folder if provided
        if (note.getFolder() != null && note.getFolder().getId() != null) {
            Folder folder = folderRepository.findById(note.getFolder().getId()).orElse(null);
            note.setFolder(folder);
        }

        // 🔥 NEW LOGIC: Assign note to a workspace
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
            note.setWorkspace(targetWorkspace);
        }

        Note saved = noteRepository.save(note);
        return ResponseEntity.ok(new NoteDTO(saved));
    }

    // ✏️ UPDATE NOTE
    @PutMapping("/{id}")
    public ResponseEntity<?> updateNote(@PathVariable Long id, @RequestBody Note updatedNote, Authentication authentication) {
        if (authentication == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Not authenticated");
        
        Note note = noteRepository.findById(id).orElse(null);
        if (note == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Note not found");
        if (!note.getUser().getUsername().equals(authentication.getName())) return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied");

        note.setTitle(updatedNote.getTitle());
        note.setContent(updatedNote.getContent());

        if (updatedNote.getFolder() != null && updatedNote.getFolder().getId() != null) {
            Folder folder = folderRepository.findById(updatedNote.getFolder().getId()).orElse(null);
            note.setFolder(folder);
        } else {
            note.setFolder(null);
        }

        Note saved = noteRepository.save(note);
        return ResponseEntity.ok(new NoteDTO(saved));
    }

    // ❌ DELETE NOTE
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteNote(@PathVariable Long id, Authentication authentication) {
        if (authentication == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Not authenticated");
        Note note = noteRepository.findById(id).orElse(null);
        if (note == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Note not found");
        if (!note.getUser().getUsername().equals(authentication.getName())) return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied");
        noteRepository.delete(note);
        return ResponseEntity.ok("Deleted");
    }

    // ⭐ TOGGLE FAVORITE
   // ⭐ TOGGLE FAVORITE (Changed to PUT to bypass CORS blocks)
    @PutMapping("/{id}/favorite")
    public ResponseEntity<?> toggleFavorite(@PathVariable Long id, Authentication authentication) {
        if (authentication == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Not authenticated");
        
        Note note = noteRepository.findById(id).orElse(null);
        if (note == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Note not found");
        
        // Ensure user owns the note
        if (!note.getUser().getUsername().equals(authentication.getName())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied");
        }

        // Safely flip the boolean, defaulting to true if it was somehow null
        Boolean currentStatus = note.getIsFavorite();
        note.setIsFavorite(currentStatus == null ? true : !currentStatus);
        
        Note saved = noteRepository.save(note);
        return ResponseEntity.ok(new NoteDTO(saved));
    }
    // ⭐ MOVE NOTE TO FOLDER
    @PutMapping("/{id}/folder/{folderId}")
    public ResponseEntity<?> moveNoteToFolder(@PathVariable Long id, @PathVariable Long folderId, Authentication authentication) {
        if (authentication == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Not authenticated");
        
        Note note = noteRepository.findById(id).orElse(null);
        if (note == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Note not found");
        
        if (!note.getUser().getUsername().equals(authentication.getName())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied");
        }

        // Handle moving to "All Notes" (ungrouped) by passing 0 as folderId
        if (folderId == 0) {
            note.setFolder(null);
        } else {
            Folder folder = folderRepository.findById(folderId).orElse(null);
            if (folder == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Folder not found");
            note.setFolder(folder);
        }

        Note saved = noteRepository.save(note);
        return ResponseEntity.ok(new NoteDTO(saved));
    }
}