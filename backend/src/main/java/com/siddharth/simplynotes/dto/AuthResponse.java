package com.siddharth.simplynotes.dto;

public class AuthResponse {

    private String token;

    // ✅ ADD THIS CONSTRUCTOR
    public AuthResponse(String token) {
        this.token = token;
    }

    // ✅ Getter (IMPORTANT for JSON response)
    public String getToken() {
        return token;
    }
}