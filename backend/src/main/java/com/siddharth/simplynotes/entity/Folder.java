package com.siddharth.simplynotes.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.util.List;

@Entity
public class Folder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private User user;

    @OneToMany(mappedBy = "folder")
    @JsonIgnore // 🔥 prevents recursion
    private List<Note> notes;

    // getters
    public Long getId() { return id; }
    public String getName() { return name; }
    public User getUser() { return user; }
    public List<Note> getNotes() { return notes; }

    // setters
    public void setId(Long id) { this.id = id; }
    public void setName(String name) { this.name = name; }
    public void setUser(User user) { this.user = user; }
    public void setNotes(List<Note> notes) { this.notes = notes; }
}