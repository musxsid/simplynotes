package com.siddharth.simplynotes.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
public class Note {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String content;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private User user;

    @ManyToOne
    @JoinColumn(name = "folder_id")
    private Folder folder;

    // 🔥 NEW: Link note to a specific workspace
    @ManyToOne
    @JoinColumn(name = "workspace_id")
    @JsonIgnore
    private Workspace workspace;
    
 @Column(name = "is_favorite")
    private Boolean isFavorite = false;

    // getters
    public Long getId() { return id; }
    public String getTitle() { return title; }
    public String getContent() { return content; }
    public User getUser() { return user; }
    public Folder getFolder() { return folder; }
    public Workspace getWorkspace() { return workspace; } // Added getter
  public Boolean getIsFavorite() {
        return isFavorite == null ? false : isFavorite;
    }

    // setters
    public void setId(Long id) { this.id = id; }
    public void setTitle(String title) { this.title = title; }
    public void setContent(String content) { this.content = content; }
    public void setUser(User user) { this.user = user; }
    public void setFolder(Folder folder) { this.folder = folder; }
    public void setWorkspace(Workspace workspace) { this.workspace = workspace; } // Added setter
    public void setIsFavorite(Boolean favorite) {
        this.isFavorite = favorite;
    }
}