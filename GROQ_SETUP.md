# 🚀 GROQ API - Cel mai bun AI GRATUIT și RAPID pentru chatbot

## 🎯 **De ce Groq?**

- ✅ **COMPLET GRATUIT** (fără limite stricte)
- ✅ **FOARTE RAPID** (cel mai rapid AI din lume!)  
- ✅ **CALITATE EXCELENTĂ** (modele Llama 3)
- ✅ **FĂRĂ CARD DE CREDIT** pentru înregistrare
- ✅ **API simplu** și stabil
- ✅ **Funcționează perfect în română**

## 🔧 **Setup în 2 minute:**

### **Pasul 1: Obține cheia API**
1. **Du-te la:** https://console.groq.com/
2. **Creează cont gratuit** (doar cu email)
3. **Click pe "API Keys"** în stânga
4. **Click "Create API Key"**
5. **Copiază cheia** (începe cu `gsk_...`)

### **Pasul 2: Configurează în proiect**
Înlocuiește în `backend/src/main/resources/application.properties`:

```properties
# Înlocuiește cu cheia ta reală
groq.api.key=gsk_YOUR_REAL_KEY_HERE
```

### **Pasul 3: Testează**
1. **Compilează:** `cd backend && .\mvnw.cmd clean compile`
2. **Pornește:** `.\mvnw.cmd spring-boot:run`
3. **Testează în browser:** http://localhost:3000

## 🧪 **Test rapid cu PowerShell:**

```powershell
Invoke-WebRequest -Uri "http://localhost:8080/api/chatbot/chat" -Method POST -Headers @{"Content-Type"="application/json"} -Body '{"message": "cum ești astăzi?"}'
```

**Ar trebui să vezi un răspuns generat de AI!** 🎊

## 📊 **Limitări Groq (foarte generoase):**

- **Rate limit:** 30 requests/minut (suficient pentru testare)
- **Tokens/zi:** 14,400 tokens/zi (foarte mult!)
- **Modele disponibile:** Llama3-8B (foarte bun)
- **Uptime:** 99.9% (foarte stabil)

## 🔄 **Backup Plans (dacă Groq nu merge):**

### **1. Hugging Face (gratuit dar mai lent):**
```properties
# Decomentează în application.properties:
huggingface.api.key=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
```

### **2. Google Gemini (60 requests/minut gratuit):**
```properties
# Decomentează în application.properties:
gemini.api.key=AIzaSyBHoHOzLYBAKBhhhJ8n5L3RZZzK4Yc6E4I
```

## 🎮 **Exemple de testare cu Groq:**

### **Conversație naturală:**
- "Cum ești astăzi?"
- "De ce să fac voluntariat?"
- "Povestește-mi ceva interesant"
- "Sunt trist, cum mă ajută voluntariatul?"

### **Întrebări specifice platformei (hardcodate):**
- "Ce recompense aveți?"
- "Cum câștig puncte?"
- "Cum mă înscriu la o acțiune?"

## 🚨 **Troubleshooting:**

### **Dacă vezi "Cheie API Groq invalidă":**
1. Verifică cheia în application.properties
2. Asigură-te că nu are spații în plus
3. Regenerează cheia pe console.groq.com

### **Dacă vezi "Connection refused":**
1. Verifică internetul
2. Încearcă din nou în câteva secunde
3. Folosește backup API-urile

### **Dacă răspunsurile sunt doar hardcodate:**
1. Verifică logurile pentru erori Groq
2. Testează cu întrebări NON-specifice platformei
3. Asigură-te că backend-ul rulează pe 8080

## 🎯 **Rezultatul final:**

**Cu Groq vei avea:**
- 🤖 **AI conversațional rapid** pentru întrebări generale
- 📋 **Răspunsuri exacte** pentru funcționalități platformei  
- ⚡ **Viteză incredibilă** (sub 1 secundă răspuns)
- 🆓 **Complet gratuit** pentru dezvoltare
- 🇷🇴 **Suport excelent pentru română**

## 🔥 **De ce Groq e cel mai bun:**

| Feature | Groq | Gemini | HuggingFace | OpenAI |
|---------|------|--------|-------------|---------|
| **Cost** | 🆓 GRATUIT | 🆓 Gratuit (limitat) | 🆓 Gratuit (lent) | 💰 Plătit |
| **Viteză** | ⚡ FOARTE RAPID | 🐌 Normal | 🐌 Lent | ⚡ Rapid |
| **Calitate** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Setup** | 🟢 Foarte ușor | 🟢 Ușor | 🔴 Dificil | 🟡 Mediu |
| **Română** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐⭐ |

**Winner: GROQ! 🏆**

---

**🚀 Du-te acum la https://console.groq.com/ și obține cheia!** 