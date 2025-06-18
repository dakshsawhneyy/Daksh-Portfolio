@Library('Shared')
pipeline{
    agent any
    environment{
        SONAR_HOME = tool('Sonar')
    }

    stages{
        stage("Workspace Empty"){
            steps{
                script{
                    cleanWs()
                }
            }
        }
        stage(){
            steps{
                script{
                    clone("https://github.com/dakshsawhneyy/My-Portfolio.git","master")
                }
            }
        }
        stage("Trivy: File Scan"){
            steps{
                script{
                    trivy_scan()
                }
            }
        }
        stage("OWASP: Dependency check"){
            steps{
                script{
                    owasp_dependency()
                }
            }
        }
        stage("SonarQube: Code Analysis"){
            steps{
                script{
                    sonarqube_analysis("Sonar","daksh-portfolio","daksh-portfolio")
                }
            }
        }
        stage("SonarQube: Code Quality Gates"){
            steps{
                script{
                    sonarqube_code_quality()
                }
            }
        }
        stage("Docker: Build Images"){
            steps{
                script{
                    dir('backend'){
                        docker_build("dakshsawhneyy","daksh-portfolio-backend","latest")
                    }
                    dir('frontend'){
                        docker_build("dakshsawhneyy","daksh-portfolio-frontend","latest")
                    }
                }
            }
        }
        stage("Docker: Push to DockerHub"){
            steps{
                script{
                    docker_push("daksh-portfolio-backend","latest","dakshsawhneyy") 
                    docker_push("daksh-portfolio-frontend","latest","dakshsawhneyy")
                }
            }
        }
        stage("Helm: Deploy to Kubernetes"){
            steps{
                script{

                    def namespace = "daksh-portfolio"

                    // Create namespace if not created
                    sh """
                        kubectl get namespace ${namespace} || kubectl create namespace ${namespace}
                    """

                    // Install or Upgrade Helm
                    sh """
                        helm upgrade --install daksh-portfolio ./daksh-portfolio-helm -n ${namespace}
                    """
                }
            }
        }
    }

    post {
        success {
            emailext (
                to: 'dakshsawhney2@example.com',  
                subject: "SUCCESS: Daksh Portfolio Pipeline - ${currentBuild.fullDisplayName}",
                body: """
                    The Jenkins pipeline for the Daksh Portfolio project has successfully completed.
                    Build URL: ${currentBuild.absoluteUrl}
                    Build Status: SUCCESS
                """
            )
        }
        failure {
            emailext (
                to: 'dakshsawhney2@example.com',  // Replace with the recipient's email
                subject: "FAILURE: Daksh Portfolio Pipeline - ${currentBuild.fullDisplayName}",
                body: """
                    The Jenkins pipeline for the Daksh Portfolio project has failed.
                    Build URL: ${currentBuild.absoluteUrl}
                    Build Status: FAILURE
                """
            )
        }
    }
}