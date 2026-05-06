package com.siddharth.simplynotes.repository;

import com.siddharth.simplynotes.entity.Note;
import com.siddharth.simplynotes.entity.User;
import com.siddharth.simplynotes.entity.Workspace;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface NoteRepository extends JpaRepository<Note, Long> {

    // Fallback for older notes
    List<Note> findByUser(User user);
    
    // Fetch notes strictly by Workspace
    List<Note> findByWorkspace(Workspace workspace);

    // 🔥 NEW: Fetch a public note by its unique share token
    Optional<Note> findByShareToken(String shareToken);
}