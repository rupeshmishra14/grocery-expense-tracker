pipeline {
    agent any
    environment{
        SONAR_HOME= tool "sonar"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scmGit(branches: [[name: '*/main']], extensions: [], userRemoteConfigs: [[url: 'https://github.com/rupeshmishra14/grocery-expense-tracker.git']])
            }
        }

        stage("SonarQube Quality Analysis"){
            steps{
                withSonarQubeEnv("sonar"){
                    sh "$SONAR_HOME/bin/sonar-scanner -Dsonar.projectName=wanderlust -Dsonar.projectKey=wanderlust"
                }
            }
        }
        
        stage("Sonar Quality Gate Scan"){
            steps{
                timeout(time: 2, unit: "MINUTES"){
                    waitForQualityGate abortPipeline: false
                }
            }
        }

        stage("Trivy File System Scan"){
            steps{
                sh "trivy fs --format  table -o trivy-fs-report.html ."
            }
        }
        
        stage('Build Docker Image') {
            steps {
                script {
                    // Remove the previous build's container and image if they exist
                    def previousBuild = currentBuild.previousBuild
                    if (previousBuild != null) {
                        def previousBuildNumber = previousBuild.number
                        removeImageIfExists("grocery-${previousBuildNumber}")
                    }
                }
                sh "docker build -t grocery-${BUILD_NUMBER} ."
            }
        }
        
        stage('Run Docker Container') {
            steps {
                removeContainerIfExists("grocery")
                sh "docker run -d -p 3000:3000 --name grocery grocery-${BUILD_NUMBER}"
            }
        }
    }
}

def removeContainerIfExists(containerName) {
    script {
        def containerExists = sh(script: "docker ps -a -q -f name=${containerName}", returnStdout: true).trim()
        if (containerExists) {
            echo "Container ${containerName} exists. Removing it."
            sh "docker rm -f ${containerName}"
        } else {
            echo "Container ${containerName} does not exist. Skipping removal."
        }
    }
}

def removeImageIfExists(imageName) {
    script {
        def imageExists = sh(script: "docker images -q ${imageName}", returnStdout: true).trim()
        if (imageExists) {
            echo "Image ${imageName} exists. Removing it."
            sh "docker rmi -f ${imageName}"
        } else {
            echo "Image ${imageName} does not exist. Skipping removal."
        }
    }
}
