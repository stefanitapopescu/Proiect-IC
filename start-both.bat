@echo off
echo Starting VolunteerHub - Backend & Frontend...

echo.
echo ===========================================
echo     VolunteerHub - Complete Startup
echo ===========================================
echo.

echo [1/2] Starting Backend (Spring Boot)...
start "VolunteerHub Backend" cmd /k "cd backend && .\mvnw.cmd spring-boot:run"

echo [2/2] Starting Frontend (React)...
timeout /t 5 /nobreak >nul
start "VolunteerHub Frontend" cmd /k "cd frontend && npm start"

echo.
echo ✅ Both applications are starting...
echo 🌐 Frontend: http://localhost:3000
echo 🔧 Backend: http://localhost:8080
echo.
echo Press any key to exit this window...
pause >nul 