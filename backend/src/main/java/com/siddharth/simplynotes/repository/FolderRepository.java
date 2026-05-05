package com.siddharth.simplynotes.repository;

import com.siddharth.simplynotes.entity.Folder;
import com.siddharth.simplynotes.entity.User;
import com.siddharth.simplynotes.entity.Workspace;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FolderRepository extends JpaRepository<Folder, Long> {
    
    // Kept for fallback purposes
    List<Folder> findByUser(User user); 
    
    // 🔥 NEW: Fetch folders by Workspace
    List<Folder> findByWorkspace(Workspace workspace); 
}