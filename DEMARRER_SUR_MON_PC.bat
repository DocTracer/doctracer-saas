@echo off
title DocTracer - Lancement Local
echo ===================================================
echo   LANCEMENT DU LOGICIEL DOCTRACER SUR VOTRE PC
echo ===================================================
echo.

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ATTENTION] Node.js n'est pas installe sur votre ordinateur.
    echo Veuillez le telecharger gratuitement sur : https://nodejs.org
    echo (Installez la version recommandee LTS, puis relancez ce fichier).
    echo.
    pause
    exit
)

echo [1/3] Installation des dependances...
call npm install

echo [2/3] Preparation de la base de donnees...
call npx prisma db push

echo [3/3] Démarrage du serveur web...
echo.
echo Le site va s'ouvrir sur http://localhost:3000
start http://localhost:3000
call npm run dev
