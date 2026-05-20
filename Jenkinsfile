pipeline {
    agent {
        kubernetes {
            yaml '''
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: kaniko
    image: gcr.io/kaniko-project/executor:debug
    command:
    - /busybox/cat
    tty: true
    volumeMounts:
    - name: docker-config
      mountPath: /kaniko/.docker/
  volumes:
  - name: docker-config
    secret:
      secretName: dockerhub-secret1
      items:
        - key: .dockerconfigjson
          path: config.json
'''
        }
    }

    environment {
        DOCKER_HUB_USER = 'jorgeasca'
        GITHUB_CREDS_ID = 'github-pat'
        IMAGE_TAG = "${env.GIT_COMMIT.take(7)}"
    }

    stages {
        stage('Build & Push: Gateway') {
            when { changeset "apps/ms-gateway/**" }
            steps { container('kaniko') { script { kanikoBuild("ms-gateway", "apps/ms-gateway", "deploy/kubernetes/inventario-app/charts/ms-gateway/values.yaml") } } }
        }

        stage('Build & Push: Administracion') {
            when { changeset "apps/ms-administracion/**" }
            steps { container('kaniko') { script { kanikoBuild("ms-administracion", "apps/ms-administracion", "deploy/kubernetes/inventario-app/charts/ms-administracion/values.yaml") } } }
        }

        stage('Build & Push: Analytics') {
            when { changeset "apps/ms-analytics/**" }
            steps { container('kaniko') { script { kanikoBuild("ms-analytics", "apps/ms-analytics", "deploy/kubernetes/inventario-app/charts/ms-analytics/values.yaml") } } }
        }

        stage('Build & Push: Configuracion') {
            when { changeset "apps/ms-configuracion/**" }
            steps { container('kaniko') { script { kanikoBuild("ms-configuracion", "apps/ms-configuracion", "deploy/kubernetes/inventario-app/charts/ms-configuracion/values.yaml") } } }
        }

        stage('Build & Push: Inventario') {
            when { changeset "apps/ms-inventario/**" }
            steps { container('kaniko') { script { kanikoBuild("ms-inventario", "apps/ms-inventario", "deploy/kubernetes/inventario-app/charts/ms-inventario/values.yaml") } } }
        }

        stage('Build & Push: Logistica') {
            when { changeset "apps/ms-logistica/**" }
            steps { container('kaniko') { script { kanikoBuild("ms-logistica", "apps/ms-logistica", "deploy/kubernetes/inventario-app/charts/ms-logistica/values.yaml") } } }
        }

        stage('Build & Push: Usuarios') {
            when { changeset "apps/ms-usuarios/**" }
            steps { container('kaniko') { script { kanikoBuild("ms-usuarios", "apps/ms-usuarios", "deploy/kubernetes/inventario-app/charts/ms-usuarios/values.yaml") } } }
        }

        stage('Build & Push: Ventas') {
            when { changeset "apps/ms-ventas/**" }
            steps { container('kaniko') { script { kanikoBuild("ms-ventas", "apps/ms-ventas", "deploy/kubernetes/inventario-app/charts/ms-ventas/values.yaml") } } }
        }
    }
}

// Función centralizada para construir con Kaniko y actualizar Git
def kanikoBuild(serviceName, contextPath, valuesFilePath) {
    echo "🚀 Construyendo ${serviceName} con Kaniko..."
    
    // Ejecutamos Kaniko
    sh """
        /kaniko/executor \
          --context=${contextPath} \
          --dockerfile=${contextPath}/deploy/Dockerfile \
          --destination=${DOCKER_HUB_USER}/${serviceName}:${IMAGE_TAG} \
          --destination=${DOCKER_HUB_USER}/${serviceName}:latest
    """
    
    // Actualizamos el GitOps
    updateGitOps(serviceName, valuesFilePath)
}

def updateGitOps(serviceName, valuesFilePath) {
    withCredentials([usernamePassword(credentialsId: "${GITHUB_CREDS_ID}", usernameVariable: 'GIT_USER', passwordVariable: 'GIT_PASS')]) {
        sh """
            git config user.email 'jenkins@jenkins.com'
            git config user.name 'Jenkins Bot'
            sed -i 's|tag:.*|tag: ${IMAGE_TAG}|g' ${valuesFilePath}
            git add ${valuesFilePath}
            git commit -m "chore: update ${serviceName} image to ${IMAGE_TAG} [skip ci]"
            git push https://${GIT_USER}:${GIT_PASS}@github.com/jorgeasca/Ivent_app.git HEAD:main
        """
    }
}