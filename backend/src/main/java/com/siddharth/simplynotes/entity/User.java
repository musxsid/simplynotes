package com.siddharth.simplynotes.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String username;

    private String password;

    // 🔥 NEW: A user can own multiple workspaces
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Workspace> workspaces;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    @JsonIgnore 
    private List<Note> notes;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    @JsonIgnore 
    private List<Folder> folders;

    // ===== GETTERS =====
    public Long getId() { return id; }
    public String getUsername() { return username; }
    public String getPassword() { return password; }
    public List<Workspace> getWorkspaces() { return workspaces; } // Added getter
    public List<Note> getNotes() { return notes; }
    public List<Folder> getFolders() { return folders; }

    // ===== SETTERS =====
    public void setId(Long id) { this.id = id; }
    public void setUsername(String username) { this.username = username; }
    public void setPassword(String password) { this.password = password; }
    public void setWorkspaces(List<Workspace> workspaces) { this.workspaces = workspaces; } // Added setter
    public void setNotes(List<Note> notes) { this.notes = notes; }
    public void setFolders(List<Folder> folders) { this.folders = folders; }
}