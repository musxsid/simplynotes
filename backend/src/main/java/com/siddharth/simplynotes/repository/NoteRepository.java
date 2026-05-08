package com.siddharth.simplynotes.repository;

import com.siddharth.simplynotes.entity.Note;
import com.siddharth.simplynotes.entity.User;
import com.siddharth.simplynotes.entity.Workspace;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface NoteRepository extends JpaRepository<Note, Long> {

    List<Note> findByUser(User user);
    
    List<Note> findByWorkspace(Workspace workspace);

    Optional<Note> findByShareToken(String shareToken);
}