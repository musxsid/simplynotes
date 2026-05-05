package com.siddharth.simplynotes.repository;

import com.siddharth.simplynotes.entity.Folder;
import com.siddharth.simplynotes.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FolderRepository extends JpaRepository<Folder, Long> {
    List<Folder> findByUser(User user);
}