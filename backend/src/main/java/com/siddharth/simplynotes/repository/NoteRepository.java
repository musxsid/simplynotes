package com.siddharth.simplynotes.repository;

import com.siddharth.simplynotes.entity.Note;
import com.siddharth.simplynotes.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NoteRepository extends JpaRepository<Note, Long> {

    // get notes of specific user
    List<Note> findByUser(User user);
}