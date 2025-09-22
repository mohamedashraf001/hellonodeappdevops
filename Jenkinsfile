pipeline {
    agent any

    environment {
        DOCKER_HUB_USER = 'cfxf46r@gmail.com'
        DOCKER_HUB_PASS = '16001700xX'
        IMAGE_NAME = "mohamedashraf001/node-hello"
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

        stage('Run Container for Test') {
            steps {
                script {
                    // حذف الكونتينر القديم لو موجود
                    sh "docker rm -f node-test || true"
                    // شغل الكونتينر للتست
                    sh "docker run -d -p 4000:4000 --name node-test ${IMAGE_NAME}:${BUILD_NUMBER}"
                    sh "sleep 5"
                }
            }
        }

        stage('Test') {
            steps {
                script {
                    sh "docker exec node-test node test.js"
                }
            }
        }

        stage('Cleanup Test Container') {
            steps {
                script {
                    sh "docker rm -f node-test || true"
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
                // استخدام kubeconfig كـ secret file
                withCredentials([file(credentialsId: 'kubeconfig-file', variable: 'KUBECONFIG_FILE')]) {
                    sh 'export KUBECONFIG=$KUBECONFIG_FILE && kubectl apply -f k8s/'
                }
            }
        }
    }
}
