#!/bin/bash
set -e

INFORME=/app/informe.log

config_git() {
   echo "Configurando entorno de Git y estructuras..." >> ${INFORME}

}

main(){
   echo "*** Iniciando instalación en caliente para: ${MICROSERVICIO} ***" > ${INFORME}
   
   config_git 
   
   echo "Instalando dependencias (Esto puede tardar unos minutos)..." >> ${INFORME}
   
   pnpm install --no-frozen-lockfile 

   echo "Lanzando microservicio con TypeORM..." >> ${INFORME}
   
.
   exec pnpm run start:dev ${MICROSERVICIO}
}


main