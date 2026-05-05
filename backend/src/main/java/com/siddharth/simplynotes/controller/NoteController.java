package com.siddharth.simplynotes.controller;

import com.siddharth.simplynotes.entity.Note;
import com.siddharth.simplynotes.entity.User;
import com.siddharth.simplynotes.entity.Folder;
import com.siddharth.simplynotes.repository.NoteRepository;
import com.siddharth.simplynotes.repository.UserRepository;
import com.siddharth.simplynotes.repository.FolderRepository;
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

    public NoteController(NoteRepository noteRepository, UserRepository userRepository, FolderRepository folderRepository) {
        this.noteRepository = noteRepository;
        this.userRepository = userRepository;
        this.folderRepository = folderRepository;
    }

    // ✅ FIX 3: Create strict response structures to guarantee consistent JSON
    public static class FolderDTO {
        public Long id;
        public String name;
        public FolderDTO(Long id, String name) { this.id = id; this.name = name; }
    }

    public static class NoteDTO {
        public Long id;
        public String title;
        public String content;
        public FolderDTO folder;

        public NoteDTO(Note note) {
            this.id = note.getId();
            this.title = note.getTitle();
            this.content = note.getContent();
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

            // Return strictly formatted DTO
            return ResponseEntity.ok(new NoteDTO(note));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Server error");
        }
    }

    @GetMapping
    public ResponseEntity<?> getNotes(Authentication authentication) {
        if (authentication == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Not authenticated");
        
        User user = userRepository.findByUsername(authentication.getName()).orElse(null);
        if (user == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");

        List<Note> notes = noteRepository.findByUser(user);
        
        // Map all notes to DTOs
        List<NoteDTO> response = notes.stream().map(NoteDTO::new).collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<?> addNote(@RequestBody Note note, Authentication authentication) {
        if (authentication == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Not authenticated");
        
        User user = userRepository.findByUsername(authentication.getName()).orElse(null);
        note.setUser(user);

        if (note.getFolder() != null && note.getFolder().getId() != null) {
            Folder folder = folderRepository.findById(note.getFolder().getId()).orElse(null);
            note.setFolder(folder);
        }

        Note saved = noteRepository.save(note);
        return ResponseEntity.ok(new NoteDTO(saved));
    }

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

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteNote(@PathVariable Long id, Authentication authentication) {
        // ... Keep your existing delete logic exact as is ...
        if (authentication == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Not authenticated");
        Note note = noteRepository.findById(id).orElse(null);
        if (note == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Note not found");
        if (!note.getUser().getUsername().equals(authentication.getName())) return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied");
        noteRepository.delete(note);
        return ResponseEntity.ok("Deleted");
    }
}