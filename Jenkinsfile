pipeline {
    agent any
    
    environment {
        DOCKER_HUB_USER = 'jorgeasca'
        DOCKER_CREDS_ID = 'docker-hub-credentials' 
        IMAGE_TAG = "${env.GIT_COMMIT.take(7)}" 
    }

    stages {
        
        // 1. MICROSERVICIO: GATEWAY
        stage('Build & Push: Gateway') {
            when { changeset "apps/ms-gateway/**" }
            steps {
                echo "🚀 Cambios detectados en ms-gateway. Iniciando build..."
                script {
                    docker.withRegistry('https://index.docker.io/v1/', "${DOCKER_CREDS_ID}") {
                        def img = docker.build("${DOCKER_HUB_USER}/ms-gateway:${IMAGE_TAG}", "apps/ms-gateway -f apps/ms-gateway/deploy/Dockerfile")
                        img.push()
                        img.push("latest")
                    }
                }
            }
        }

        // 2. MICROSERVICIO: ADMINISTRACION
        stage('Build & Push: Administracion') {
            when { changeset "apps/ms-administracion/**" }
            steps {
                echo "🚀 Cambios detectados en ms-administracion. Iniciando build..."
                script {
                    docker.withRegistry('https://index.docker.io/v1/', "${DOCKER_CREDS_ID}") {
                        def img = docker.build("${DOCKER_HUB_USER}/ms-administracion:${IMAGE_TAG}", "apps/ms-administracion -f apps/ms-administracion/deploy/Dockerfile")
                        img.push()
                        img.push("latest")
                    }
                }
            }
        }

        // 3. MICROSERVICIO: ANALYTICS
        stage('Build & Push: Analytics') {
            when { changeset "apps/ms-analytics/**" }
            steps {
                echo "🚀 Cambios detectados en ms-analytics. Iniciando build..."
                script {
                    docker.withRegistry('https://index.docker.io/v1/', "${DOCKER_CREDS_ID}") {
                        def img = docker.build("${DOCKER_HUB_USER}/ms-analytics:${IMAGE_TAG}", "apps/ms-analytics -f apps/ms-analytics/deploy/Dockerfile")
                        img.push()
                        img.push("latest")
                    }
                }
            }
        }

        // 4. MICROSERVICIO: CONFIGURACION
        stage('Build & Push: Configuracion') {
            when { changeset "apps/ms-configuracion/**" }
            steps {
                echo "🚀 Cambios detectados en ms-configuracion. Iniciando build..."
                script {
                    docker.withRegistry('https://index.docker.io/v1/', "${DOCKER_CREDS_ID}") {
                        def img = docker.build("${DOCKER_HUB_USER}/ms-configuracion:${IMAGE_TAG}", "apps/ms-configuracion -f apps/ms-configuracion/deploy/Dockerfile")
                        img.push()
                        img.push("latest")
                    }
                }
            }
        }

        // 5. MICROSERVICIO: INVENTARIO
        stage('Build & Push: Inventario') {
            when { changeset "apps/ms-inventario/**" }
            steps {
                echo "🚀 Cambios detectados en ms-inventario. Iniciando build..."
                script {
                    docker.withRegistry('https://index.docker.io/v1/', "${DOCKER_CREDS_ID}") {
                        def img = docker.build("${DOCKER_HUB_USER}/ms-inventario:${IMAGE_TAG}", "apps/ms-inventario -f apps/ms-inventario/deploy/Dockerfile")
                        img.push()
                        img.push("latest")
                    }
                }
            }
        }

        // 6. MICROSERVICIO: LOGISTICA
        stage('Build & Push: Logistica') {
            when { changeset "apps/ms-logistica/**" }
            steps {
                echo "🚀 Cambios detectados en ms-logistica. Iniciando build..."
                script {
                    docker.withRegistry('https://index.docker.io/v1/', "${DOCKER_CREDS_ID}") {
                        def img = docker.build("${DOCKER_HUB_USER}/ms-logistica:${IMAGE_TAG}", "apps/ms-logistica -f apps/ms-logistica/deploy/Dockerfile")
                        img.push()
                        img.push("latest")
                    }
                }
            }
        }

        // 7. MICROSERVICIO: USUARIOS
        stage('Build & Push: Usuarios') {
            when { changeset "apps/ms-usuarios/**" }
            steps {
                echo "🚀 Cambios detectados en ms-usuarios. Iniciando build..."
                script {
                    docker.withRegistry('https://index.docker.io/v1/', "${DOCKER_CREDS_ID}") {
                        def img = docker.build("${DOCKER_HUB_USER}/ms-usuarios:${IMAGE_TAG}", "apps/ms-usuarios -f apps/ms-usuarios/deploy/Dockerfile")
                        img.push()
                        img.push("latest")
                    }
                }
            }
        }

        // 8. MICROSERVICIO: VENTAS
        stage('Build & Push: Ventas') {
            when { changeset "apps/ms-ventas/**" }
            steps {
                echo "🚀 Cambios detectados en ms-ventas. Iniciando build..."
                script {
                    docker.withRegistry('https://index.docker.io/v1/', "${DOCKER_CREDS_ID}") {
                        def img = docker.build("${DOCKER_HUB_USER}/ms-ventas:${IMAGE_TAG}", "apps/ms-ventas -f apps/ms-ventas/deploy/Dockerfile")
                        img.push()
                        img.push("latest")
                    }
                }
            }
        }

        // 9. STAGE FINAL: DESPLIEGUE A KUBERNETES (Estructura base para el siguiente paso)
        stage('Deploy a Kubernetes') {
            // Se ejecutará siempre, pero aquí agregaremos lógica después para que K8s actualice
            // solo el microservicio que se acaba de compilar.
            steps {
                echo "✅ Imágenes subidas con el tag: ${IMAGE_TAG}"
                echo "Preparado para actualizar manifiestos de Kubernetes..."
            }
        }
    }
}