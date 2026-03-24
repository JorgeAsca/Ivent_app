#!/bin/bash
set -e

# Archivo para monitorear el progreso del arranque
INFORME=/root/logs/informe.log
mkdir -p /root/logs

config_git(){
   echo "--- Clonando repositorio privado Ivent_app ---" >> ${INFORME}
   
   # Clonamos en una carpeta temporal para evitar conflictos en /app
   git clone --filter=blob:none --no-checkout ${REPO_GIT} repo_temp
   cd repo_temp
   
   # Configuración de sparse-checkout 
   git sparse-checkout init --cone
   git sparse-checkout set apps/${MICROSERVICIO} libs
   
   # Descargamos los archivos de la rama master
   git checkout master
   git pull origin master
   echo "--- Código descargado exitosamente ---" >> ${INFORME}
}

main(){
   echo "*** Instalación del servicio ${MICROSERVICIO} ***" > ${INFORME}
   
   # 1. Descarga del código
   config_git
   
   # 2. Asegurar herramientas (pnpm ya debería estar en la imagen, pero reforzamos)
   echo "Configurando gestor de paquetes..." >> ${INFORME}
   npm install -g pnpm
   
   # 3. Instalación de dependencias del monorepo
   echo "Instalando dependencias node_modules (esto tardará)..." >> ${INFORME}
   pnpm install --no-frozen-lockfile
   
   echo "Iniciando ${MICROSERVICIO} en modo desarrollo..." >> ${INFORME}
   
   # 4. Ejecución con Nest CLI
   # Al estar parados en /app/repo_temp, pnpm encontrará el nest-cli.json de la raíz
   exec pnpm run start:dev ${MICROSERVICIO}
}

main