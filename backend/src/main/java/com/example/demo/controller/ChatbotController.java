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
    
    @Value("${huggingface.api.key:}")
    private String huggingFaceApiKey;
    
    private final RestTemplate restTemplate = new RestTemplate();
    
    // Răspunsuri specifice platformei în română
    private final Map<String, String> platformResponses = Map.ofEntries(
        // Recompense și shop
        Map.entry("recompense", "🎁 **Recompensele disponibile în magazinul nostru:**\n\n" +
            "• 🍎 **Alimente** - 10 puncte\n" +
            "• 🏠 **Electrocasnice** - 50 puncte\n" +
            "• 🎮 **Jocuri** - 20 puncte\n" +
            "• 🎫 **Vouchere** - 30 puncte\n" +
            "• 📱 **Accesorii** - 15 puncte\n" +
            "• 👕 **Haine** - 25 puncte\n\n" +
            "Toate recompensele sunt oferite de organizațiile partenere pentru voluntarii activi! 🌟"),
            
        Map.entry("shop", "🛍️ **Magazinul nostru funcționează simplu:**\n\n" +
            "1. Participi la acțiuni de voluntariat\n" +
            "2. Câștigi 10 puncte pentru fiecare acțiune\n" +
            "3. Folosești punctele în shop pentru recompense\n" +
            "4. Recompensele sunt livrate de organizațiile partenere\n\n" +
            "Accesează secțiunea 'Shop' din meniu pentru a vedea toate recompensele! 🎯"),
            
        // Puncte și sistem de recompensare
        Map.entry("puncte", "⭐ **Sistemul de puncte:**\n\n" +
            "• **+10 puncte** pentru fiecare acțiune de voluntariat completată\n" +
            "• Punctele se acumulează automat în contul tău\n" +
            "• Le poți folosi în shop pentru recompense\n" +
            "• Nu expiră niciodată! 💎\n\n" +
            "Verifică-ți punctele în colțul din dreapta sus pe orice pagină! 📊"),
            
        // Găsirea acțiunilor
        Map.entry("actiuni", "🔍 **Pentru a găsi acțiuni în zona ta:**\n\n" +
            "1. **Mergi la secțiunea 'Volunteer'** din meniu principal\n" +
            "2. **Folosește filtrul de căutare** pentru cuvinte cheie\n" +
            "3. **Filtrează după categorie:** Mediu, Social, Educație, Sănătate, Comunitate\n" +
            "4. **Verifică locația** - fiecare acțiune are adresa specificată\n" +
            "5. **Vezi pe hartă** - click pe 'Vezi pe hartă' pentru localizare exactă\n\n" +
            "💡 **Tip:** Folosește recomandările personalizate bazate pe preferințele tale!"),
            
        // Categorii disponibile
        Map.entry("categorii", "📋 **Categoriile de voluntariat disponibile:**\n\n" +
            "🌱 **Mediu** - Curățenie, plantare, reciclare\n" +
            "🤝 **Social** - Ajutorarea comunității, evenimente sociale\n" +
            "📚 **Educație** - Predare, mentorat, workshopuri\n" +
            "🏥 **Sănătate** - Campanii de sănătate, donații\n" +
            "🏘️ **Comunitate** - Dezvoltare locală, infrastructură\n\n" +
            "Fiecare categorie are acțiuni specifice adaptate nevoilor comunității! 🎯"),
            
        // Înregistrare și participare
        Map.entry("inscriere", "📝 **Cum te înscrii la o acțiune:**\n\n" +
            "1. **Navighează** la secțiunea 'Volunteer'\n" +
            "2. **Găsește** acțiunea care te interesează\n" +
            "3. **Click pe titlu** pentru a vedea detaliile complete\n" +
            "4. **Verifică** data, locația și descrierea\n" +
            "5. **Click pe 'Înscrie-te'** - vei primi confirmarea instant!\n\n" +
            "✅ După înscriere, vei câștiga automat 10 puncte! 🎉"),
            
        // Pentru organizații
        Map.entry("organizatie", "🏢 **Pentru organizații și entități:**\n\n" +
            "1. **Creează cont** cu tipul 'Entitate'\n" +
            "2. **Accesează** secțiunea 'Entity' din meniu\n" +
            "3. **Completează formularul** cu detaliile acțiunii\n" +
            "4. **Adaugă recompense** pentru voluntari (opțional)\n" +
            "5. **Publică acțiunea** - va fi vizibilă tuturor voluntarilor!\n\n" +
            "💡 Poți adăuga până la 6 tipuri de recompense pentru voluntari! 🎁"),
            
        // Ajutor general
        Map.entry("ajutor", "🆘 **Cum te pot ajuta:**\n\n" +
            "🔍 **Găsirea acțiunilor** - Cum să găsești voluntariat în zona ta\n" +
            "📝 **Înscrierea** - Pașii pentru a te înscrie la acțiuni\n" +
            "⭐ **Punctele** - Cum funcționează sistemul de puncte\n" +
            "🎁 **Recompensele** - Ce poți cumpăra din shop\n" +
            "🏢 **Pentru organizații** - Cum să postezi acțiuni\n" +
            "📱 **Navigarea** - Cum să folosești platforma\n\n" +
            "Întreabă-mă orice despre voluntariat! 😊"),
            
        // Navigare și funcționalități
        Map.entry("navigare", "🧭 **Ghid de navigare:**\n\n" +
            "🏠 **Home** - Pagina principală cu informații generale\n" +
            "🤝 **Volunteer** - Găsește și înscrie-te la acțiuni\n" +
            "🏢 **Entity** - Pentru organizații (postează acțiuni)\n" +
            "🛍️ **Shop** - Cumpără recompense cu punctele tale\n" +
            "💼 **Wallet** - Vezi recompensele cumpărate\n\n" +
            "💡 Punctele tale sunt afișate în colțul din dreapta sus! 📊"),
            
        // Salutări și conversație
        Map.entry("salut", "Salut! 👋 Sunt asistentul virtual al platformei de voluntariat! \n\n" +
            "Te pot ajuta cu:\n" +
            "• 🔍 Găsirea acțiunilor de voluntariat\n" +
            "• ⭐ Informații despre sistemul de puncte\n" +
            "• 🎁 Recompensele disponibile în shop\n" +
            "• 📝 Procesul de înscriere\n" +
            "• 🏢 Ghid pentru organizații\n\n" +
            "Ce te interesează? 😊"),
            
        Map.entry("multumesc", "Cu plăcere! 😊 Sunt aici să te ajut oricând ai nevoie de informații despre voluntariat.\n\n" +
            "Dacă mai ai întrebări, nu ezita să mă întrebi! 🤝"),
            
        Map.entry("pa", "La revedere! 👋 Mult succes la voluntariat și sper să te văd curând pe platformă! 🌟\n\n" +
            "Îți doresc o zi minunată! ☀️")
    );
    
    @PostMapping("/chat")
    public ResponseEntity<Map<String, String>> chat(@RequestBody Map<String, String> request) {
        String userMessage = request.get("message").toLowerCase().trim();
        
        // Detectează tipul întrebării și oferă răspuns specific
        String response = detectQuestionTypeAndRespond(userMessage);
        
        // Dacă nu găsește răspuns specific, încearcă Hugging Face API
        if (response == null && !huggingFaceApiKey.isEmpty()) {
            response = callHuggingFaceAPI(userMessage);
        }
        
        // Fallback la răspuns generic
        if (response == null) {
            response = "Pentru întrebări specifice despre voluntariat, te pot îndruma către secțiunile potrivite. " +
                      "Încearcă să întrebi despre: recompense, puncte, acțiuni, înregistrare, sau categorii. " +
                      "Scrie 'ajutor' pentru a vedea toate opțiunile! 🤝";
        }
        
        Map<String, String> responseMap = new HashMap<>();
        responseMap.put("response", response);
        return ResponseEntity.ok(responseMap);
    }
    
    @GetMapping("/quick-questions")
    public ResponseEntity<List<String>> getQuickQuestions() {
        List<String> questions = Arrays.asList(
            "Ce fel de recompense aveți?",
            "Cum câștig puncte?",
            "Cum găsesc acțiuni în zona mea?",
            "Ce categorii de voluntariat există?",
            "Cum mă înscriu la o acțiune?",
            "Cum funcționează shop-ul?"
        );
        return ResponseEntity.ok(questions);
    }
    
    private String detectQuestionTypeAndRespond(String message) {
        // Detectare pentru recompense și shop
        if (containsAny(message, "recompense", "recompensa", "premii", "premiu", "castig", "câștig", "primesc")) {
            return platformResponses.get("recompense");
        }
        
        if (containsAny(message, "shop", "magazin", "cumpar", "cumpăr", "cumpara", "cumpără")) {
            return platformResponses.get("shop");
        }
        
        // Detectare pentru puncte
        if (containsAny(message, "puncte", "punct", "scor", "castig puncte", "câștig puncte", "cum câștig")) {
            return platformResponses.get("puncte");
        }
        
        // Detectare pentru găsirea acțiunilor
        if (containsAny(message, "gasesc", "găsesc", "caut", "actiuni", "acțiuni", "zona mea", "aproape", "local")) {
            return platformResponses.get("actiuni");
        }
        
        // Detectare pentru categorii
        if (containsAny(message, "categorii", "categorie", "tipuri", "tip", "fel", "mediu", "social", "educatie", "educație")) {
            return platformResponses.get("categorii");
        }
        
        // Detectare pentru înregistrare
        if (containsAny(message, "inscriere", "înscriere", "inscriu", "înscriu", "particip", "alatur", "alătur")) {
            return platformResponses.get("inscriere");
        }
        
        // Detectare pentru organizații
        if (containsAny(message, "organizatie", "organizație", "entitate", "postez", "creez", "adaug actiune", "adaug acțiune")) {
            return platformResponses.get("organizatie");
        }
        
        // Detectare pentru navigare
        if (containsAny(message, "navigare", "meniu", "sectiuni", "secțiuni", "folosesc", "functioneaza", "funcționează")) {
            return platformResponses.get("navigare");
        }
        
        // Detectare pentru ajutor
        if (containsAny(message, "ajutor", "help", "informatii", "informații", "ghid", "cum")) {
            return platformResponses.get("ajutor");
        }
        
        // Salutări și conversație
        if (containsAny(message, "salut", "hello", "buna", "bună", "hey", "hei")) {
            return platformResponses.get("salut");
        }
        
        if (containsAny(message, "multumesc", "mulțumesc", "mersi", "thanks", "ms")) {
            return platformResponses.get("multumesc");
        }
        
        if (containsAny(message, "pa", "bye", "la revedere", "adio")) {
            return platformResponses.get("pa");
        }
        
        return null; // Nu s-a găsit un răspuns specific
    }
    
    private boolean containsAny(String text, String... keywords) {
        for (String keyword : keywords) {
            if (text.contains(keyword.toLowerCase())) {
                return true;
            }
        }
        return false;
    }
    
    private String callHuggingFaceAPI(String message) {
        try {
            String apiUrl = "https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium";
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(huggingFaceApiKey);
            
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("inputs", message);
            requestBody.put("parameters", Map.of("max_length", 100, "temperature", 0.7));
            
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
            
            ResponseEntity<List> response = restTemplate.exchange(
                apiUrl, HttpMethod.POST, entity, List.class);
            
            if (response.getBody() != null && !response.getBody().isEmpty()) {
                Map<String, Object> result = (Map<String, Object>) response.getBody().get(0);
                return (String) result.get("generated_text");
            }
        } catch (Exception e) {
            System.err.println("Eroare la apelul Hugging Face API: " + e.getMessage());
        }
        
        return null;
    }
} 