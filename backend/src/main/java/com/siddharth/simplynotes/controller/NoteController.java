package com.siddharth.simplynotes.controller;

import com.siddharth.simplynotes.entity.Note;
import com.siddharth.simplynotes.entity.User;
import com.siddharth.simplynotes.repository.NoteRepository;
import com.siddharth.simplynotes.repository.UserRepository;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notes")
@CrossOrigin(origins = "*")
public class NoteController {

    private final NoteRepository noteRepository;
    private final UserRepository userRepository;

    public NoteController(NoteRepository noteRepository,
                          UserRepository userRepository) {
        this.noteRepository = noteRepository;
        this.userRepository = userRepository;
    }

    // 🔍 GET SINGLE NOTE
    @GetMapping("/{id}")
public ResponseEntity<?> getNoteById(
        @PathVariable Long id,
        Authentication authentication
) {
    try {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Not authenticated");
        }

        String username = authentication.getName();

        Note note = noteRepository.findById(id).orElse(null);

        if (note == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Note not found");
        }

        if (note.getUser() == null) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Note has no user");
        }

        if (!note.getUser().getUsername().equals(username)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied");
        }

        return ResponseEntity.ok(note);

    } catch (Exception e) {
        e.printStackTrace(); // 🔥 THIS WILL SHOW REAL ERROR IN BACKEND
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Server error");
    }
}

    // 🔍 GET ALL NOTES
    @GetMapping
    public ResponseEntity<?> getNotes(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Not authenticated");
        }

        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
                .orElse(null);

        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        List<Note> notes = noteRepository.findByUser(user);
        return ResponseEntity.ok(notes);
    }

    // ➕ CREATE NOTE
    @PostMapping
    public ResponseEntity<?> addNote(
            @RequestBody Note note,
            Authentication authentication
    ) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Not authenticated");
        }

        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
                .orElse(null);

        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        note.setUser(user);
        Note saved = noteRepository.save(note);

        return ResponseEntity.ok(saved);
    }

    // ❌ DELETE NOTE
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteNote(
            @PathVariable Long id,
            Authentication authentication
    ) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Not authenticated");
        }

        String username = authentication.getName();

        Note note = noteRepository.findById(id)
                .orElse(null);

        if (note == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Note not found");
        }

        if (!note.getUser().getUsername().equals(username)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied");
        }

        noteRepository.delete(note);

        return ResponseEntity.ok("Deleted");
    }

    // ✏️ UPDATE NOTE
    @PutMapping("/{id}")
    public ResponseEntity<?> updateNote(
            @PathVariable Long id,
            @RequestBody Note updatedNote,
            Authentication authentication
    ) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Not authenticated");
        }

        String username = authentication.getName();

        Note note = noteRepository.findById(id)
                .orElse(null);

        if (note == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Note not found");
        }

        if (!note.getUser().getUsername().equals(username)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied");
        }

        note.setTitle(updatedNote.getTitle());
        note.setContent(updatedNote.getContent());

        Note saved = noteRepository.save(note);

        return ResponseEntity.ok(saved);
    }
}