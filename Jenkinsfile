pipeline {
    agent any

    environment {
        DOCKER_HUB_USER = 'mohamedashraf001'
        DOCKER_HUB_PASS = credentials('docker-hub-credentials')
        IMAGE_NAME = "mohamedashraf001/node-hello"
        KUBECONFIG = credentials('kubeconfig-file')
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/mohamedashraf001/nodeappdevops.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    sh "docker build -t ${IMAGE_NAME}:${BUILD_NUMBER} ."
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                script {
                    sh "echo ${DOCKER_HUB_PASS} | docker login -u ${DOCKER_HUB_USER} --password-stdin"
                    sh "docker push ${IMAGE_NAME}:${BUILD_NUMBER}"
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                script {
                    // استخدم kubeconfig من Jenkins credentials
                    writeFile file: 'kubeconfig', text: KUBECONFIG
                    sh 'export KUBECONFIG=$WORKSPACE/kubeconfig && kubectl apply -f k8s/'
                }
            }
        }
    }
}
