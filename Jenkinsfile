pipeline {
    agent {
        kubernetes {
            yaml '''
apiVersion: v1
kind: Pod
metadata:
  labels:
    jenkins: agent
spec:
  containers:
  - name: docker
    image: docker:dind
    securityContext:
      privileged: true
    command:
    - cat
    tty: true
  - name: jnlp
    image: jenkins/inbound-agent:latest
    args: ['\$(JENKINS_SECRET)', '\$(JENKINS_NAME)']
'''
        }
    }

    environment {
        DOCKER_HUB_USER = 'jorgeasca'
        DOCKER_CREDS_ID = 'docker-hub-credentials'
        GITHUB_CREDS_ID = 'github-pat' // Asegúrate que este sea el ID de tu credencial Username/Password
        IMAGE_TAG = "${env.GIT_COMMIT.take(7)}"
    }

    stages {
        // --- FUNCIÓN HELPER PARA GITOPS ---
        // (Nota: Jenkins no permite funciones fuera de stages, así que usamos un script común)

        stage('Build & Push: Gateway') {
            when { changeset "apps/ms-gateway/**" }
            steps {
                script {
                    echo "🚀 Cambios en ms-gateway..."
                    docker.withRegistry('https://index.docker.io/v1/', "${DOCKER_CREDS_ID}") {
                        def img = docker.build("${DOCKER_HUB_USER}/ms-gateway:${IMAGE_TAG}", "apps/ms-gateway -f apps/ms-gateway/deploy/Dockerfile")
                        img.push()
                        img.push("latest")
                    }
                    updateGitOps("ms-gateway", "deploy/kubernetes/inventario-app/charts/ms-gateway/values.yaml")
                }
            }
        }

        stage('Build & Push: Administracion') {
            when { changeset "apps/ms-administracion/**" }
            steps {
                script {
                    echo "🚀 Cambios en ms-administracion..."
                    docker.withRegistry('https://index.docker.io/v1/', "${DOCKER_CREDS_ID}") {
                        def img = docker.build("${DOCKER_HUB_USER}/ms-administracion:${IMAGE_TAG}", "apps/ms-administracion -f apps/ms-administracion/deploy/Dockerfile")
                        img.push()
                        img.push("latest")
                    }
                    updateGitOps("ms-administracion", "deploy/kubernetes/inventario-app/charts/ms-administracion/values.yaml")
                }
            }
        }

        stage('Build & Push: Analytics') {
            when { changeset "apps/ms-analytics/**" }
            steps {
                script {
                    echo "🚀 Cambios en ms-analytics..."
                    docker.withRegistry('https://index.docker.io/v1/', "${DOCKER_CREDS_ID}") {
                        def img = docker.build("${DOCKER_HUB_USER}/ms-analytics:${IMAGE_TAG}", "apps/ms-analytics -f apps/ms-analytics/deploy/Dockerfile")
                        img.push()
                        img.push("latest")
                    }
                    updateGitOps("ms-analytics", "deploy/kubernetes/inventario-app/charts/ms-analytics/values.yaml")
                }
            }
        }

        stage('Build & Push: Configuracion') {
            when { changeset "apps/ms-configuracion/**" }
            steps {
                script {
                    echo "🚀 Cambios en ms-configuracion..."
                    docker.withRegistry('https://index.docker.io/v1/', "${DOCKER_CREDS_ID}") {
                        def img = docker.build("${DOCKER_HUB_USER}/ms-configuracion:${IMAGE_TAG}", "apps/ms-configuracion -f apps/ms-configuracion/deploy/Dockerfile")
                        img.push()
                        img.push("latest")
                    }
                    updateGitOps("ms-configuracion", "deploy/kubernetes/inventario-app/charts/ms-configuracion/values.yaml")
                }
            }
        }

        stage('Build & Push: Inventario') {
            when { changeset "apps/ms-inventario/**" }
            steps {
                script {
                    echo "🚀 Cambios en ms-inventario..."
                    docker.withRegistry('https://index.docker.io/v1/', "${DOCKER_CREDS_ID}") {
                        def img = docker.build("${DOCKER_HUB_USER}/ms-inventario:${IMAGE_TAG}", "apps/ms-inventario -f apps/ms-inventario/deploy/Dockerfile")
                        img.push()
                        img.push("latest")
                    }
                    updateGitOps("ms-inventario", "deploy/kubernetes/inventario-app/charts/ms-inventario/values.yaml")
                }
            }
        }

        stage('Build & Push: Logistica') {
            when { changeset "apps/ms-logistica/**" }
            steps {
                script {
                    echo "🚀 Cambios en ms-logistica..."
                    docker.withRegistry('https://index.docker.io/v1/', "${DOCKER_CREDS_ID}") {
                        def img = docker.build("${DOCKER_HUB_USER}/ms-logistica:${IMAGE_TAG}", "apps/ms-logistica -f apps/ms-logistica/deploy/Dockerfile")
                        img.push()
                        img.push("latest")
                    }
                    updateGitOps("ms-logistica", "deploy/kubernetes/inventario-app/charts/ms-logistica/values.yaml")
                }
            }
        }

        stage('Build & Push: Usuarios') {
            when { changeset "apps/ms-usuarios/**" }
            steps {
                script {
                    echo "🚀 Cambios en ms-usuarios..."
                    docker.withRegistry('https://index.docker.io/v1/', "${DOCKER_CREDS_ID}") {
                        def img = docker.build("${DOCKER_HUB_USER}/ms-usuarios:${IMAGE_TAG}", "apps/ms-usuarios -f apps/ms-usuarios/deploy/Dockerfile")
                        img.push()
                        img.push("latest")
                    }
                    updateGitOps("ms-usuarios", "deploy/kubernetes/inventario-app/charts/ms-usuarios/values.yaml")
                }
            }
        }

        stage('Build & Push: Ventas') {
            when { changeset "apps/ms-ventas/**" }
            steps {
                script {
                    echo "🚀 Cambios en ms-ventas..."
                    docker.withRegistry('https://index.docker.io/v1/', "${DOCKER_CREDS_ID}") {
                        def img = docker.build("${DOCKER_HUB_USER}/ms-ventas:${IMAGE_TAG}", "apps/ms-ventas -f apps/ms-ventas/deploy/Dockerfile")
                        img.push()
                        img.push("latest")
                    }
                    updateGitOps("ms-ventas", "deploy/kubernetes/inventario-app/charts/ms-ventas/values.yaml")
                }
            }
        }
    }
}

// Función para actualizar Git automáticamente
def updateGitOps(serviceName, valuesFilePath) {
    withCredentials([usernamePassword(credentialsId: "${GITHUB_CREDS_ID}", usernameVariable: 'GIT_USER', passwordVariable: 'GIT_PASS')]) {
        sh """
            git config user.email 'jenkins@jenkins.com'
            git config user.name 'Jenkins Bot'
            # Reemplazamos la linea que contiene 'tag: ' con el nuevo tag
            sed -i 's|tag:.*|tag: ${IMAGE_TAG}|g' ${valuesFilePath}
            git add ${valuesFilePath}
            git commit -m "chore: update ${serviceName} image to ${IMAGE_TAG} [skip ci]"
            git push https://${GIT_USER}:${GIT_PASS}@github.com/jorgeasca/Ivent_app.git HEAD:main
        """
    }
}