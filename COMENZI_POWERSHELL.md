# 🚀 Comenzi PowerShell Corecte pentru VolunteerHub

## ❌ **Comenzi care NU funcționează în PowerShell:**
```bash
# GREȘIT - && nu funcționează în PowerShell
cd backend && .\mvnw.cmd spring-boot:run
cd frontend && npm install && npm start
```

## ✅ **Comenzi CORECTE pentru PowerShell:**

### **Pentru Backend:**
```powershell
# Metoda 1: Două comenzi separate
cd backend
.\mvnw.cmd spring-boot:run

# Metoda 2: Cu semicolon
cd backend; .\mvnw.cmd spring-boot:run
```

### **Pentru Frontend:**
```powershell
# Metoda 1: Două comenzi separate
cd frontend
npm install
npm start

# Metoda 2: Cu semicolon
cd frontend; npm install; npm start
```

### **Pentru ambele simultan:**
```powershell
# Pornește backend în fundal
Start-Process PowerShell -ArgumentList "-NoExit", "-Command", "cd backend; .\mvnw.cmd spring-boot:run"

# Pornește frontend în fundal  
Start-Process PowerShell -ArgumentList "-NoExit", "-Command", "cd frontend; npm start"
```

## 🎯 **Soluții Simple:**

### **1. Folosește fișierele .bat create:**
- `start-backend.bat` - Pornește doar backend-ul
- `start-frontend.bat` - Pornește doar frontend-ul  
- `start-both.bat` - Pornește ambele aplicații

### **2. Verifică statusul aplicațiilor:**
```powershell
# Verifică backend (port 8080)
netstat -an | findstr :8080

# Verifică frontend (port 3000)  
netstat -an | findstr :3000
```

### **3. Oprește aplicațiile:**
```powershell
# Oprește toate procesele Java (backend)
Get-Process java | Stop-Process -Force

# Oprește toate procesele Node (frontend)
Get-Process node | Stop-Process -Force
```

## 🌐 **URL-uri importante:**
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8080
- **Test Backend:** http://localhost:8080/api/test

## 🔧 **Troubleshooting:**

### **Dacă portul este ocupat:**
```powershell
# Găsește procesul care folosește portul 3000
netstat -ano | findstr :3000

# Oprește procesul (înlocuiește PID cu numărul actual)
taskkill /PID <PID> /F
```

### **Dacă Maven nu funcționează:**
```powershell
# Verifică Java
java -version

# Verifică Maven wrapper
cd backend
dir .\mvnw.cmd
```

### **Dacă npm nu funcționează:**
```powershell
# Verifică Node.js
node -v
npm -v

# Reinstalează dependențele
cd frontend
Remove-Item node_modules -Recurse -Force
npm install
``` 