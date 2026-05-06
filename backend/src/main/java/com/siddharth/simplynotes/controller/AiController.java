package com.siddharth.simplynotes.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "*")
public class AiController {

    // Pulls the key you just pasted in application.properties!
    @Value("${gemini.api.key}")
    private String geminiApiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    @PostMapping("/generate")
    public ResponseEntity<?> generateContent(@RequestBody Map<String, String> request) {
        String action = request.get("action");   // e.g., "Summarize"
        String context = request.get("context"); // The text from the user's note

        // 1. Build the prompt instructions based on what button the user clicked
        String prompt = buildPrompt(action, context);

        // 2. The official Gemini API Endpoint
        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + geminiApiKey;

        // 3. Format the JSON exactly how Google expects it
        Map<String, Object> textPart = new HashMap<>();
        textPart.put("text", prompt);

        Map<String, Object> partNode = new HashMap<>();
        partNode.put("parts", List.of(textPart));

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("contents", List.of(partNode));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        try {
            // 4. Send the request to Gemini!
            ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);
            
            // 5. Extract the actual text from Gemini's nested JSON response
            Map<String, Object> body = response.getBody();
            List<Map<String, Object>> candidates = (List<Map<String, Object>>) body.get("candidates");
            Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
            List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
            String generatedText = (String) parts.get(0).get("text");

            // Return the clean text to React
            return ResponseEntity.ok(Map.of("result", generatedText));
            
        } catch (Exception e) {
            System.err.println("Gemini API Error: " + e.getMessage());
            return ResponseEntity.status(500).body(Map.of("error", "Spark is currently resting. Try again in a moment!"));
        }
    }

    // 🔥 This is the "System Prompt" engine. It tells the AI exactly how to behave.
    private String buildPrompt(String action, String context) {
        
        // If the user didn't highlight any text, tell the AI to just generate something based on the title or a blank slate
        if (context == null || context.trim().isEmpty()) {
            context = "There is no text selected. Please provide a helpful generic response or template.";
        }

        return switch (action) {
            case "Summarize" -> "You are an expert assistant. Summarize the following text into 3-5 concise, easy-to-read bullet points. Do not include introductory filler text:\n\n" + context;
            case "Improve Writing" -> "You are an expert editor. Rewrite the following text to make it more professional, clear, and grammatically perfect. Keep the original meaning but elevate the tone. Output ONLY the rewritten text:\n\n" + context;
            case "Brainstorm Ideas" -> "You are a creative brainstorming partner. Based on the following context, generate a numbered list of 5 creative, highly actionable ideas:\n\n" + context;
            case "Format Notes" -> "You are a productivity expert. Take the following raw, messy notes and format them into a beautiful structure using Markdown headings, bold text, and bullet points where appropriate:\n\n" + context;
            default -> "Respond helpfully to the following:\n\n" + context;
        };
    }
}