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
'''
        }
    }

    environment {
        DOCKER_HUB_USER = 'jorgeasca'
        // Kaniko usa un archivo de configuración secreto en Kubernetes para autenticarse en DockerHub
        // O lo pasamos mediante variables de entorno si configuramos las credenciales en Jenkins
    }

    stages {
        stage('Build & Push: Inventario') {
            when { changeset "apps/ms-inventario/**" }
            steps {
                container('kaniko') {
                    script {
                        echo "🚀 Construyendo ms-inventario con Kaniko..."
                        // Kaniko lee el Dockerfile y construye la imagen
                        // 'dest' es el nombre de tu imagen en Docker Hub
                        sh '''
                        /kaniko/executor \
                          --context=`pwd`/apps/ms-inventario \
                          --dockerfile=deploy/Dockerfile \
                          --destination=${DOCKER_HUB_USER}/ms-inventario:${GIT_COMMIT} \
                          --destination=${DOCKER_HUB_USER}/ms-inventario:latest
                        '''
                        // Llamada a la función GitOps
                        updateGitOps("ms-inventario", "deploy/kubernetes/inventario-app/charts/ms-inventario/values.yaml")
                    }
                }
            }
        }
    }
}

def updateGitOps(serviceName, valuesFilePath) {
    withCredentials([usernamePassword(credentialsId: 'github-pat', usernameVariable: 'GIT_USER', passwordVariable: 'GIT_PASS')]) {
        sh """
            git config user.email 'jenkins@jenkins.com'
            git config user.name 'Jenkins Bot'
            # Actualizamos el tag en el values.yaml
            sed -i 's|tag:.*|tag: ${GIT_COMMIT}|g' ${valuesFilePath}
            git add ${valuesFilePath}
            git commit -m "chore: update ${serviceName} image to ${GIT_COMMIT} [skip ci]"
            git push https://${GIT_USER}:${GIT_PASS}@github.com/jorgeasca/Ivent_app.git HEAD:main
        """
    }
}