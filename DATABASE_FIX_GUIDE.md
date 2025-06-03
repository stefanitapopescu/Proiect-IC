# 🔧 Ghid pentru Repararea Problemelor de Bază de Date

## 🚨 **Problema Ta:**
Ai conturi în baza de date MongoDB dar când încerci să te loghezi cu ele, primești eroare și nu le recunoaște.

---

## 🔍 **Cauze Posibile:**

1. **Parolele nu sunt hash-uite corect** în baza de date
2. **Câmpurile `role` și `userType` lipsesc** sau sunt incorecte
3. **Structura documentelor** nu se potrivește cu modelul din Spring Boot
4. **Valorile sunt în format greșit** (majuscule vs minuscule)

---

## 🛠️ **Soluția Pas cu Pas:**

### **Pasul 1: Pornește backend-ul**
```bash
cd backend
.\mvnw.cmd spring-boot:run
```

### **Pasul 2: Verifică utilizatorii din baza de date**
Deschide browser și accesează:
```
http://localhost:8080/api/debug/users
```

Aceasta va afișa toți utilizatorii cu informații despre:
- Username, email, role, userType
- Dacă parola este hash-uită corect
- Lungimea parolei
- Dacă sunt toate câmpurile complete

### **Pasul 3: Testează login-ul pentru un user specific**
Folosește un tool ca Postman sau PowerShell pentru a testa:

**PowerShell:**
```powershell
$body = @{
    identifier = "numele_utilizatorului_sau_email"
    password = "parola_ta"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:8080/api/debug/test-login" -Method POST -Headers @{"Content-Type"="application/json"} -Body $body
```

**Sau în browser (JavaScript Console):**
```javascript
fetch('http://localhost:8080/api/debug/test-login', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
        identifier: 'numele_tau_de_utilizator',
        password: 'parola_ta'
    })
}).then(r => r.json()).then(console.log)
```

### **Pasul 4A: Repară un singur utilizator (dacă știi parola)**
```powershell
$body = @{
    identifier = "numele_utilizatorului"
    newPassword = "parola_noua_sau_veche"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:8080/api/debug/fix-user" -Method POST -Headers @{"Content-Type"="application/json"} -Body $body
```

### **Pasul 4B: Repară toți utilizatorii (fără să schimbi parolele)**
```
http://localhost:8080/api/debug/fix-all-users
```
Aceasta va repara doar câmpurile lipsă (role, userType, points, etc.) **fără să schimbe parolele**.

---

## 📋 **Exemplu de Testare Completă:**

### **1. Verifică utilizatorii:**
```
GET http://localhost:8080/api/debug/users
```

### **2. Pentru fiecare utilizator care are probleme, testează:**
```javascript
// În JavaScript Console din browser
fetch('http://localhost:8080/api/debug/test-login', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
        identifier: 'test_user',  // înlocuiește cu username-ul real
        password: 'test123'       // înlocuiește cu parola reală
    })
}).then(r => r.json()).then(result => {
    console.log('Test Result:', result);
    if (!result.passwordMatches) {
        console.log('❌ Parola nu se potrivește!');
        if (result.warning) {
            console.log('⚠️', result.warning);
        }
    } else {
        console.log('✅ Parola se potrivește!');
    }
});
```

### **3. Dacă parola nu se potrivește, repară utilizatorul:**
```javascript
fetch('http://localhost:8080/api/debug/fix-user', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
        identifier: 'test_user',
        newPassword: 'parola_corecta'
    })
}).then(r => r.json()).then(console.log);
```

---

## 🎯 **Soluții Rapide pentru Probleme Comune:**

### **Problema 1: Parola este în text simplu**
```
Răspuns: {"warning": "Password is not hashed properly!"}
```
**Soluție:** Folosește `/api/debug/fix-user` pentru a hash-ui parola corect.

### **Problema 2: Câmpuri role/userType lipsă**
```
Răspuns: {"hasRoleAndUserType": false}
```
**Soluție:** Folosește `/api/debug/fix-all-users` pentru a completa câmpurile.

### **Problema 3: Role/userType în format greșit**
```
Răspuns: {"role": "VOLUNTEER", "userType": "VOLUNTEER"}
```
**Soluție:** Folosește `/api/debug/fix-all-users` pentru a converti la lowercase.

---

## 🚀 **Test Final de Login:**

După ce ai reparat utilizatorii, testează login-ul normal:

**PowerShell:**
```powershell
$body = @{
    username = "numele_tau"
    password = "parola_ta"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:8080/api/auth/login" -Method POST -Headers @{"Content-Type"="application/json"} -Body $body
```

**Rezultat așteptat:**
```json
{
    "token": "eyJhbGciOiJIUzI1NiJ9...",
    "userType": "volunteer"
}
```

---

## ⚠️ **Securitate:**

**Importante:**
- Endpoint-urile `/api/debug/**` sunt pentru debugging **DOAR în dezvoltare**
- **Înainte de producție**, șterge `DatabaseDebugController.java`
- **Nu lăsa aceste endpoint-uri** accesibile în producție

---

## 📝 **Pași pentru Utilizatori Existenți:**

### **Dacă ai utilizatori cu parole cunoscute:**
1. Pentru fiecare utilizator, folosește `/api/debug/fix-user`
2. Setează parola corectă pentru fiecare

### **Dacă nu știi parolele utilizatorilor:**
1. Folosește `/api/debug/fix-all-users` pentru a repara structura
2. Utilizatorii vor trebui să folosească "Reset Password" pentru parole noi
3. Sau setează manual parole temporare cu `/api/debug/fix-user`

---

## 🎊 **După reparare:**

1. **Testează login-ul** în aplicația frontend
2. **Verifică** că utilizatorii se pot loga cu succes
3. **Șterge** `DatabaseDebugController.java` când nu mai ai nevoie
4. **Actualizează** `SecurityConfig.java` să elimine `/api/debug/**`

**Acum conturile tale din baza de date vor funcționa perfect! 🎉** 