#!/bin/bash

# 1. Crear el namespace si no existe
kubectl apply f ./namespaces/inventario-namespace.yaml

# 2. Desplegar con Helm (replicando el comando del profe)
echo " Desplegando Inventario App en Kubernetes..."
helm upgrade --install inventario-release ./inventario-app \
    --namespace inventario-ns \
    --values ./inventario-app/values.yaml

echo "✅ Despliegue completado."