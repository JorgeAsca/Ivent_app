pipeline {
    agent {
        kubernetes {
            yaml '''
apiVersion: v1
kind: Pod
spec:
  hostNetwork: true
  dnsPolicy: ClusterFirstWithHostNet
  containers:
  - name: kaniko
    image: gcr.io/kaniko-project/executor:debug
    command: ['/busybox/cat']
    tty: true
    volumeMounts:
    - name: "workspace-volume"
      mountPath: "/home/jenkins/agent"
  - name: jnlp
    image: jenkins/inbound-agent:3355.v388858a_47b_33-3-jdk21
    args: ['$(JENKINS_SECRET)', '$(JENKINS_NAME)']
    volumeMounts:
    - name: "workspace-volume"
      mountPath: "/home/jenkins/agent"
  volumes:
  - name: "workspace-volume"
    emptyDir: {}
'''
        }
    }

    environment {
        DOCKER_HUB_USER = 'jorgeasca'
        GITHUB_CREDS_ID = 'github-pat'
        IMAGE_TAG = "${env.GIT_COMMIT.take(7)}"
    }

    stages {
        stage('Build & Push') {
            parallel {
                // Aquí definimos los microservicios
                stage('Inventario') {
                    when { changeset "apps/ms-inventario/**" }
                    steps { container('kaniko') { script { kanikoBuild("ms-inventario", "apps/ms-inventario") } } }
                }
                // ... (añade el resto de servicios siguiendo este patrón)
            }
        }
    }
}

def kanikoBuild(serviceName, contextPath) {
    // Usamos 'withCredentials' para inyectar el token como variable de entorno
    // Jenkins toma el ID 'docker-hub-pat' de la interfaz y lo inyecta como 'TOKEN'
    withCredentials([string(credentialsId: 'docker-hub-pat', variable: 'TOKEN')]) {
        sh """
            mkdir -p /kaniko/.docker
            echo '{"auths": {"https://index.docker.io/v1/": {"auth": "'$(echo -n "${DOCKER_HUB_USER}:${TOKEN}" | base64)'"}}}' > /kaniko/.docker/config.json
            
            /kaniko/executor \
              --context=${contextPath} \
              --dockerfile=${contextPath}/deploy/Dockerfile \
              --destination=${DOCKER_HUB_USER}/${serviceName}:${IMAGE_TAG} \
              --destination=${DOCKER_HUB_USER}/${serviceName}:latest
        """
    }
}