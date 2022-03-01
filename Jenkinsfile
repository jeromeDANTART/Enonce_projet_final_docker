pipeline {
    agent any
    
    environment {
        imagename = 'opusidea/nuvolapp'
        dockerImage = ''
        registryCredential = 'dockerhub'
    }

    stages {
        /*
        stage('Git clone') {
            steps {
                git 'https://github.com/cdufour/nuvolapp.git'
            }
        }
        */
        stage('Build image') {
            steps {
                script {
                    dockerImage = docker.build imagename
                }
            }
        }
        stage('Test image') {
            steps {
                sh 'docker run --rm -d --name app -p 4000:4000 opusidea/nuvolapp:latest'
                sh 'sleep 10'
                sh 'curl localhost:4000 | grep -i nuvolapp'
                sh 'echo $?'
            }
        }
        stage('Deploy image') {
            steps {
                script {
                    docker.withRegistry('', registryCredential) {
                        dockerImage.push("$BUILD_NUMBER")
                        dockerImage.push('latest')
                    }
                }
            }
        }
    }
    post {
        always {
            sh 'docker stop app'
        }
    }
}
