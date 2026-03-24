#!/bin/bash

source ../.env


echo "📥 Actualizando repositorio..."
git pull origin master


services=$(echo $MSSERVICES_JSON | jq -c '.[]')

for service in $services; do
    ms_folder=$(echo $service | jq -r '.ms1')
    echo "🏗️  Construyendo: $ms_folder"
    
   
    cd ../../apps/$ms_folder
    pnpm install && pnpm run build
    
   
    echo "☸️  Actualizando Deployment en K8s..."
    kubectl rollout restart deployment/$ms_folder-deployment -n $NAMESPACE
    cd ../../deploy/build_img
done