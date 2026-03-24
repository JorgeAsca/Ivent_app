#!/bin/bash

if [ -f .env ]; then
    export $(cat .env | xargs)
else
    echo "❌ Error: No se encontró el archivo .env"
    exit 1
fi

echo "🔄 Actualizando código desde GitHub: $REPO_GIT"


if [ ! -d ".git" ]; then
    git clone $REPO_GIT .
else
    
    git fetch --all
    git reset --hard origin/master 
fi

echo "✅ Código actualizado. Instalando dependencias..."
pnpm install

echo "🚀 El código está listo para ser procesado."