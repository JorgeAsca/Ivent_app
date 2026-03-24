#!/bin/bash
set -e

# Archivo para monitorear el progreso
INFORME=/app/informe.log

main(){
   echo "*** Iniciando instalación para: ${MICROSERVICIO} ***" > ${INFORME}
   
   # 1. Instalación de dependencias
   echo "Instalando paquetes..." >> ${INFORME}
   pnpm install --no-frozen-lockfile 

   echo "Lanzando microservicio ${MICROSERVICIO}..." >> ${INFORME}
   

   exec pnpm run start:dev ${MICROSERVICIO} -- -p nest-cli.json
}

# Llamamos a la función
main