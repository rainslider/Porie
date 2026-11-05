# GameHub - zo start je hem

BELANGRIJK: dubbelklik NIET op index.html. De site heeft de server nodig.

## Windows
1. Installeer Node.js (https://nodejs.org), eenmalig.
2. Pak de zip uit en dubbelklik op **start.bat**.
3. Je browser opent http://localhost:3000

## Mac / Linux
sh start.sh

## Docker
docker compose up -d --build
(of: docker build -t gamehub . && docker run -d -p 3000:3000 -v gamehub-data:/data -e ADMIN_CODE=jouwcode gamehub)
Open daarna http://localhost:3000

## Admin
Knop linksboven. Standaardcode: gggrite5 (verander met ADMIN_CODE).
Nieuwe spelers: Admin > Code maken > mail de code naar de speler.
