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

        stage('Run Container for Test') {
            steps {
                script {
                     // احذف الكونتينر القديم لو موجود
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
                    // نفذ test.js اللي بيختبر السيرفر
                 sh "docker exec node-test node test.js"                }
            }
        }

        stage('Cleanup Test Container') {
            steps {
                script {
                    // امسح الكونتينر بتاع التست بعد ما نخلص
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
                script {
                    // استخدم kubeconfig من Jenkins credentials
                    writeFile file: 'kubeconfig', text: KUBECONFIG
                    sh 'export KUBECONFIG=$WORKSPACE/kubeconfig && kubectl apply -f k8s/'
                }
            }
        }
    }
}
