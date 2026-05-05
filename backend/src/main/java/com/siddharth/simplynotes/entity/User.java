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

    // ✅ EXISTING (UNCHANGED)
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    @JsonIgnore // prevents infinite recursion
    private List<Note> notes;

    // 🔥 NEW (SAFE ADDITION)
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    @JsonIgnore // prevents recursion
    private List<Folder> folders;

    // ===== GETTERS =====

    public Long getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public String getPassword() {
        return password;
    }

    public List<Note> getNotes() {
        return notes;
    }

    public List<Folder> getFolders() {
        return folders;
    }

    // ===== SETTERS =====

    public void setId(Long id) {
        this.id = id;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setNotes(List<Note> notes) {
        this.notes = notes;
    }

    public void setFolders(List<Folder> folders) {
        this.folders = folders;
    }
}