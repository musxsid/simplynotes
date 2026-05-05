package com.siddharth.simplynotes.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "workspaces")
public class Workspace {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    
    // For that premium UI feel (e.g., storing a lucide icon name or emoji)
    private String icon; 

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;

    @OneToMany(mappedBy = "workspace", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Folder> folders;

    @OneToMany(mappedBy = "workspace", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Note> notes;

    // ===== GETTERS =====
    public Long getId() { return id; }
    public String getName() { return name; }
    public String getIcon() { return icon; }
    public User getUser() { return user; }
    public List<Folder> getFolders() { return folders; }
    public List<Note> getNotes() { return notes; }

    // ===== SETTERS =====
    public void setId(Long id) { this.id = id; }
    public void setName(String name) { this.name = name; }
    public void setIcon(String icon) { this.icon = icon; }
    public void setUser(User user) { this.user = user; }
    public void setFolders(List<Folder> folders) { this.folders = folders; }
    public void setNotes(List<Note> notes) { this.notes = notes; }
}