#!/bin/bash
set -e

# Archivo para monitorear el progreso
INFORME=/root/logs/informe.log
mkdir -p /root/logs

config_git(){
   echo "--- Clonando repositorio en /app/repo_temp ---" >> ${INFORME}
   
   # Clonamos el repositorio
   git clone --filter=blob:none --no-checkout ${REPO_GIT} /app/repo_temp
   cd /app/repo_temp
   
   # Configuración de sparse-checkout
   git sparse-checkout init --cone
   git sparse-checkout set apps/${MICROSERVICIO} libs
   
   # Descargamos los archivos de la rama master
   git checkout master
   git pull origin master
   echo "--- Código descargado exitosamente ---" >> ${INFORME}
}

main(){
   echo "*** Iniciando instalación para: ${MICROSERVICIO} ***" > ${INFORME}
   
   # 1. Clonar el código
   config_git
   
   # IMPORTANTE: Ahora estamos en /app/repo_temp. 
   # Toda la ejecución debe ser desde AQUÍ.

   # 2. Instalar dependencias dentro de la carpeta del proyecto
   echo "Instalando paquetes en $(pwd)..." >> ${INFORME}
   pnpm install --no-frozen-lockfile 

   echo "Lanzando microservicio ${MICROSERVICIO}..." >> ${INFORME}
   
   # 3. Ejecución con Nest CLI
   # Al estar en /app/repo_temp, Nest encontrará el nest-cli.json y los tsconfig automáticamente
   exec pnpm run start:dev ${MICROSERVICIO}
}

main