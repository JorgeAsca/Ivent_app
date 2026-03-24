#!/bin/bash
set -e

INFORME=/root/logs/informe.log
mkdir -p /root/logs

config_git(){
   echo "--- Iniciando configuración de Git ---" >> ${INFORME}
   
   
   git clone --filter=blob:none --no-checkout ${REPO_GIT} Ivent_app
   
   
   cd Ivent_app
   
   
   git sparse-checkout init --cone
   
   # Trae solo el microservicio actual y las librerías compartidas
   git sparse-checkout set apps/${MICROSERVICIO} libs
   
   # Activar los archivos
   git checkout master
   git pull origin master
}

main(){
   echo "*** Instalacion del micro servicio ${MICROSERVICIO} ***" > ${INFORME}
   
   # 1. Ejecutar clonación y entrar a la carpeta
   config_git
   
   # IMPORTANTE: Ahora el script ya está dentro de /app/Ivent_app
   
   echo "Instalando pnpm..." >> ${INFORME}
   npm install -g pnpm
   
   echo "Instalando dependencias node_modules..." >> ${INFORME}
   # Se ejecuta dentro de /app/Ivent_app donde están los archivos tsconfig y package.json
   pnpm install --no-frozen-lockfile
   
   echo "Iniciando ${MICROSERVICIO} en modo desarrollo..." >> ${INFORME}
   
   # Ejecución directa: Nest encontrará el nest-cli.json porque estamos en la raíz del repo
   exec pnpm run start:dev ${MICROSERVICIO}
}

main