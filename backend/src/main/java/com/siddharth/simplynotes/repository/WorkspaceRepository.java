package com.siddharth.simplynotes.repository;

import com.siddharth.simplynotes.entity.Workspace;
import com.siddharth.simplynotes.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface WorkspaceRepository extends JpaRepository<Workspace, Long> {
    List<Workspace> findByUser(User user);
}