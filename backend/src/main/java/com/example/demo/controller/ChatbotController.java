package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@RestController
@RequestMapping("/api/chatbot")
@CrossOrigin(origins = "http://localhost:3000")
public class ChatbotController {
    
    @Value("${groq.api.key:}")
    private String groqApiKey;
    
    private final RestTemplate restTemplate = new RestTemplate();
    
    // Răspunsuri esențiale specifice platformei (doar cele critice)
    private final Map<String, String> platformResponses = Map.ofEntries(
        // Doar informații esențiale hardcodate
        Map.entry("recompense", "🎁 **Recompensele din shop-ul VolunteerHub:**\n\n" +
            "• 🍎 **Alimente** - 10 puncte\n" +
            "• 🏠 **Electrocasnice** - 50 puncte\n" +
            "• 🎮 **Jocuri** - 20 puncte\n" +
            "• 🎫 **Vouchere** - 30 puncte\n" +
            "• 📱 **Accesorii** - 15 puncte\n" +
            "• 👕 **Haine** - 25 puncte\n\n" +
            "Toate recompensele sunt oferite de organizațiile partenere! 🌟"),
            
        Map.entry("puncte", "⭐ **Sistemul de puncte VolunteerHub:**\n\n" +
            "🎯 **Câștigi 10 puncte** pentru fiecare acțiune la care participi\n" +
            "🏆 **Punctele se acumulează** automat în contul tău\n" +
            "🛍️ **Folosești punctele** în shop pentru recompense\n" +
            "📊 **Vezi progresul** în secțiunea 'Wallet'\n\n" +
            "📈 Exemplu: 5 acțiuni = 50 puncte = 1 electrocasnic!")
    );
    
    @PostMapping("/chat")
    public ResponseEntity<Map<String, String>> chat(@RequestBody Map<String, String> request) {
        String userMessage = request.get("message").toLowerCase().trim();
        
        // Detectează doar întrebările CRITICE hardcodate
        String response = detectCriticalQuestions(userMessage);
        
        // Pentru tot restul, folosește GROQ AI (mult mai inteligent)
        if (response == null && !groqApiKey.isEmpty()) {
            response = callGroqAPI(userMessage);
        }
        
        // Fallback la răspuns generic
        if (response == null) {
            response = "Îmi pare rău, am o problemă tehnică momentan. Dar sunt aici să te ajut cu orice întrebare despre VolunteerHub! " +
                      "Încearcă să mă întrebi din nou. 😊";
        }
        
        Map<String, String> responseMap = new HashMap<>();
        responseMap.put("response", response);
        return ResponseEntity.ok(responseMap);
    }
    
    @GetMapping("/quick-questions")
    public ResponseEntity<List<String>> getQuickQuestions() {
        // Returnează o listă goală - nu mai afișăm întrebări rapide
        List<String> questions = Arrays.asList();
        return ResponseEntity.ok(questions);
    }
    
    private String detectCriticalQuestions(String message) {
        // Doar pentru întrebări FOARTE specifice despre sistemul de puncte și recompense
        if (containsAny(message, "recompense", "recompensa", "premii", "shop", "magazin", "cumpar", "cumpăr")) {
            return platformResponses.get("recompense");
        }
        
        if (containsAny(message, "puncte", "punct", "scor", "castig puncte", "câștig puncte", "10 puncte")) {
            return platformResponses.get("puncte");
        }
        
        // Tot restul merge la AI - să fie mai inteligent!
        return null;
    }
    
    private boolean containsAny(String text, String... keywords) {
        for (String keyword : keywords) {
            if (text.contains(keyword.toLowerCase())) {
                return true;
            }
        }
        return false;
    }
    
    private String callGroqAPI(String message) {
        try {
            System.out.println("🤖 Încercare apel GROQ API pentru: " + message);
            
            String apiUrl = "https://api.groq.com/openai/v1/chat/completions";
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(groqApiKey);
            
            // Context realist și inteligent despre VolunteerHub pentru AI
            String systemContext = "Ești asistentul virtual al VolunteerHub, o platformă de voluntariat modernă din România.\n\n" +
                "INFORMAȚII PLATFORMĂ:\n" +
                "- Conectează voluntarii cu organizații locale și naționale\n" +
                "- Sistem de puncte: câștigi 10 puncte pentru fiecare acțiune completată\n" +
                "- Shop virtual cu recompense: alimente (10p), jocuri (20p), haine (25p), vouchere (30p), accesorii (15p), electrocasnice (50p)\n" +
                "- 5 categorii: Mediu, Social, Educație, Sănătate, Comunitate\n" +
                "- Secțiuni: Home, Volunteer (găsești acțiuni), Entity (pentru organizații), Shop, Wallet\n" +
                "- Tehnologii: React, Spring Boot, MongoDB, hărți interactive\n" +
                "- Procesul: înscrie-te → participă → câștigi puncte → cumperi recompense\n\n" +
                "PERSONALITATEA TA:\n" +
                "- Ești empatic, prietenos și motivațional\n" +
                "- Răspunzi în română corectă și naturală\n" +
                "- Promovezi valorile de solidaritate și impact pozitiv\n" +
                "- Poți discuta despre orice: voluntariat, dezvoltare personală, comunitate, probleme personale\n" +
                "- Oferi sfaturi practice și încurajare\n" +
                "- Maximum 200 cuvinte per răspuns\n\n" +
                "Răspunde inteligent la orice întrebare, nu doar despre platformă. Fii util și empatic!";
            
            List<Map<String, String>> messages = Arrays.asList(
                Map.of("role", "system", "content", systemContext),
                Map.of("role", "user", "content", message)
            );
            
            Map<String, Object> requestBody = Map.of(
                "model", "llama3-8b-8192",
                "messages", messages,
                "max_tokens", 400,
                "temperature", 0.7,
                "top_p", 0.9,
                "stream", false
            );
            
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
            
            System.out.println("📤 Trimitere request către GROQ API...");
            ResponseEntity<Map> response = restTemplate.exchange(
                apiUrl, HttpMethod.POST, entity, Map.class);
            
            System.out.println("📥 Status response GROQ: " + response.getStatusCode());
            
            if (response.getBody() != null) {
                Map<String, Object> responseBody = response.getBody();
                List<Map<String, Object>> choices = (List<Map<String, Object>>) responseBody.get("choices");
                
                if (choices != null && !choices.isEmpty()) {
                    Map<String, Object> choice = choices.get(0);
                    Map<String, Object> messageObj = (Map<String, Object>) choice.get("message");
                    String aiResponse = (String) messageObj.get("content");
                    
                    // Adaugă context VolunteerHub la sfârșitul răspunsului
                    String contextAddition = "\n\n💡 Dacă ai întrebări specifice despre VolunteerHub (recompense, puncte, înscrierea la acțiuni), întreabă-mă direct! 😊";
                    
                    System.out.println("✅ Răspuns generat cu succes de GROQ!");
                    return aiResponse + contextAddition;
                }
            }
        } catch (Exception e) {
            System.err.println("❌ Eroare la apelul GROQ API: " + e.getMessage());
            e.printStackTrace();
            
            // Mesaj de eroare specific pentru utilizatori
            return "Îmi pare rău, am o mică problemă tehnică momentan. Dar pot să îți spun că voluntariatul pe VolunteerHub este o experiență minunată! 😊 " +
                   "Te interesează să afli despre recompensele noastre sau cum să te înscrii la acțiuni?";
        }
        
        return null;
    }
} 