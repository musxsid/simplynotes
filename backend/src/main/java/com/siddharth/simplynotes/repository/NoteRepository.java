package com.siddharth.simplynotes.repository;

import com.siddharth.simplynotes.entity.Note;
import com.siddharth.simplynotes.entity.User;
import com.siddharth.simplynotes.entity.Workspace;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NoteRepository extends JpaRepository<Note, Long> {

    // Fallback for older notes
    List<Note> findByUser(User user);
    
    // 🔥 NEW: Fetch notes strictly by Workspace
    List<Note> findByWorkspace(Workspace workspace);
}