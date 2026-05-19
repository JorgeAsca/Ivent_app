def microservices = [
    'ms-gateway':       'jorgeasca/ms-gateway',
    'ms-administracion':'jorgeasca/ms-administracion',
    'ms-analytics':     'jorgeasca/ms-analytics',
    'ms-configuracion': 'jorgeasca/ms-configuracion',
    'ms-inventario':    'jorgeasca/ms-inventario',
    'ms-logistica':     'jorgeasca/ms-logistica',
    'ms-terceros':      'jorgeasca/ms-terceros',
    'ms-usuarios':      'jorgeasca/ms-usuarios',
    'ms-ventas':        'jorgeasca/ms-ventas',
]

def getKanikoPod() {
    return """
        apiVersion: v1
        kind: Pod
        spec:
          containers:
          - name: kaniko
            image: gcr.io/kaniko-project/executor:debug
            command: ["/busybox/cat"]
            tty: true
            resources:
              requests:
                memory: "1Gi"
                cpu: "500m"
              limits:
                memory: "2Gi"
                cpu: "1.5"
            volumeMounts:
            - name: docker-config
              mountPath: /kaniko/.docker/config.json
              subPath: .dockerconfigjson
            - name: kaniko-cache-vol
              mountPath: /workspace/cache
          volumes:
          - name: docker-config
            secret:
              secretName: repo-secret-cred
          - name: kaniko-cache-vol
            persistentVolumeClaim:
              claimName: kaniko-cache-pvc
    """
}

pipeline {
    agent { kubernetes { yaml getKanikoPod() } }

    stages {
        stage('Checkout & Detect') {
            steps {
                checkout scm
                script {
                    env.APPS_UPDATED = ''
                    def globalChange = false
                    try {
                        // Cambios que afectan a todo
                        globalChange = sh(script: "git diff --name-only ${GIT_PREVIOUS_SUCCESSFUL_COMMIT} ${GIT_COMMIT} | grep -E '^(libs/|Dockerfile|Jenkinsfile)'", returnStatus: true) == 0
                    } catch (Exception e) { globalChange = true }

                    microservices.each { appName, dockerRepo ->
                        def appChange = false
                        try {
                            appChange = sh(script: "git diff --name-only ${GIT_PREVIOUS_COMMIT} ${GIT_COMMIT} | grep '^apps/${appName}/'", returnStatus: true) == 0
                        } catch (Exception e) { appChange = true }
                        
                        if (globalChange || appChange || env.BUILD_ID == '1') {
                            env.APPS_UPDATED = env.APPS_UPDATED ? "${env.APPS_UPDATED},${appName}" : appName
                        }
                    }
                    echo "📦 Apps a construir: ${env.APPS_UPDATED}"
                }
            }
        }

        stage('Build & Push') {
            when { expression { env.APPS_UPDATED != '' && env.APPS_UPDATED != null } }
            steps {
                script {
                    def appsList = env.APPS_UPDATED.split(',')
                    for (int i = 0; i < appsList.size(); i++) {
                        def appName = appsList[i]
                        def dockerRepo = microservices[appName]
                        
                        echo "🚀 CONSTRUYENDO: ${appName} (${i+1}/${appsList.size()})"
                        
                        container('kaniko') {
                            sh """
                            /kaniko/executor \
                                --context \$(pwd) \
                                --dockerfile apps/${appName}/deploy/Dockerfile \
                                --destination ${dockerRepo}:${env.GIT_COMMIT} \
                                --destination ${dockerRepo}:latest \
                                --cache=true \
                                --cache-dir=/workspace/cache \
                                --cache-ttl=168h
                            """
                        }
                    }
                }
            }
        }
        
        stage('Update GitOps') {
            when { expression { env.APPS_UPDATED != '' && env.APPS_UPDATED != null } }
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'github-pat-token', passwordVariable: 'GIT_PASSWORD', usernameVariable: 'GIT_USERNAME')]) {
                        sh "git config user.email 'jenkins@ivent.com' && git config user.name 'Jenkins CI'"
                        
                        def apps = env.APPS_UPDATED.split(',')
                        apps.each { app ->
                            echo "📝 Actualizando valores de ${app}..."
                            // Ruta ajustada a tu estructura deploy/kubernetes/inventario-app/...
                            sh "sed -i 's|tag:.*|tag: \"${env.GIT_COMMIT}\"|' deploy/kubernetes/inventario-app/charts/${app}/values.yaml"
                        }
                        
                        sh """
                            git add .
                            git commit -m "ci: update image tags to ${env.GIT_COMMIT} [skip ci]" || true
                            git push https://${GIT_USERNAME}:${GIT_PASSWORD}@github.com/jorgeasca/ivent_app.git HEAD:main
                        """
                    }
                }
            }
        }
    }
}