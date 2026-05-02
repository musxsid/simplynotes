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

    // 🔍 GET NOTES
    @GetMapping
    public List<Note> getNotes(Authentication authentication) {
        String username = authentication.getName();
        User user = userRepository.findByUsername(username).orElseThrow();
        return noteRepository.findByUser(user);
    }

    // ➕ ADD NOTE
    @PostMapping
    public Note addNote(@RequestBody Note note,
                        Authentication authentication) {

        String username = authentication.getName();
        User user = userRepository.findByUsername(username).orElseThrow();

        note.setUser(user);
        return noteRepository.save(note);
    }

    // ❌ DELETE NOTE
    @DeleteMapping("/{id}")
    public void deleteNote(@PathVariable Long id) {
        noteRepository.deleteById(id);
    }
    @PutMapping("/{id}")
public ResponseEntity<?> updateNote(
        @PathVariable Long id,
        @RequestBody Note updatedNote,
        Authentication authentication
) {
    String username = authentication.getName();

    // Find existing note
    Note note = noteRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Note not found"));

    // Security check: ensure note belongs to user
    if (!note.getUser().getUsername().equals(username)) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
    }

    // Update content
    note.setContent(updatedNote.getContent());

    noteRepository.save(note);

    return ResponseEntity.ok(note);
}
}