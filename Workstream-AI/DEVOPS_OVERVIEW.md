# Workstream AI DevOps Overview

This document summarizes the DevOps setup that is already implemented for Workstream AI. It covers the containerization strategy, AWS infrastructure, CI/CD, code quality checks, and automated testing flow.

## 1. What Gets Deployed

Workstream AI is deployed as a small multi-service stack:

- React frontend on port `3000`
- Meeting Workflow API on port `8001`
- Video Onboarding API on port `8004`
- PostgreSQL database on port `5432`
- Nginx reverse proxy on ports `80` and `443`

The application EC2 instance hosts the runtime stack, and the Jenkins EC2 instance hosts the CI/CD tooling.

## 2. Docker Setup

Docker is used for both local-style composition and production-style image builds.

### Frontend image

The frontend uses a two-stage build in [frontend/Dockerfile](frontend/Dockerfile). The first stage installs dependencies and runs the Vite build. The second stage serves the built `dist` folder with `serve`.

### Meeting Workflow image

The Meeting Workflow service uses [microservices/meetingworkflow/Dockerfile](microservices/meetingworkflow/Dockerfile). It is a Python 3.11 slim image that installs dependencies from `requirements.txt` and starts Uvicorn on port `8001`.

### Video Onboarding image

The Video Onboarding service uses [microservices/video_onboarding_service/Dockerfile](microservices/video_onboarding_service/Dockerfile). It also runs on Python 3.11 slim, installs `ffmpeg` for media processing, installs Python requirements, and serves the FastAPI app on port `8004`.

### Compose stack

The root [docker-compose.yml](docker-compose.yml) defines the full stack:

- `frontend` depends on both backend services
- `meeting-workflow` and `video-onboarding` depend on the database
- `db` uses PostgreSQL 15 Alpine with persistent volume storage
- `nginx` acts as the reverse proxy for the exposed web entry points

The compose file also adds health checks so the services can report readiness.

## 3. Terraform Infrastructure

Terraform provisions the AWS infrastructure in the [terraform](terraform) folder.

### Core network and compute

The main infrastructure in [terraform/main.tf](terraform/main.tf) and [terraform/ec2.tf](terraform/ec2.tf) creates:

- A VPC with CIDR `10.0.0.0/16`
- A public subnet
- An internet gateway
- A public route table and association
- Security groups for the application and Jenkins instances
- Elastic IPs for stable public access
- An EC2 instance for Workstream AI
- An EC2 instance for Jenkins
- CloudWatch alarms for CPU and disk thresholds

### Inputs

Important variables are defined in [terraform/variables.tf](terraform/variables.tf) and [terraform/variables_jenkins.tf](terraform/variables_jenkins.tf), including:

- AWS region
- Instance types
- Volume sizes
- Key pair name
- Allowed CIDR blocks

### Outputs

Useful outputs are defined in [terraform/outputs.tf](terraform/outputs.tf) and [terraform/outputs_jenkins.tf](terraform/outputs_jenkins.tf), including:

- Application public IP and DNS
- SSH command
- Jenkins public IP
- Jenkins URL
- SonarQube URL

Based on the current Terraform state, the main access points are:

- Application: `https://3.225.224.101`
- Jenkins: `http://54.163.187.103:8080`
- SonarQube: `http://54.163.187.103:9000`

### EC2 bootstrap

The application EC2 instance uses `user_data` in [terraform/ec2.tf](terraform/ec2.tf) to bootstrap the machine and pull the GitHub repository during provisioning.

## 4. Jenkins CI/CD

The pipeline is defined in [Jenkinsfile](Jenkinsfile).

### Pipeline stages

1. Checkout from GitHub.
2. Build Docker images for the frontend and both backend services.
3. Run SonarQube analysis.
4. Run automated tests.
5. Tag the images for release.
6. Deploy to production on `main`.

### Build stage

Jenkins builds three images:

- `workstream-ai-frontend:${BUILD_NUMBER}`
- `workstream-ai-meeting-workflow:${BUILD_NUMBER}`
- `workstream-ai-video-onboarding:${BUILD_NUMBER}`

### Deploy stage

For the `main` branch, Jenkins retrieves the production instance public IP from Terraform and deploys the application over SSH with Docker Compose.

## 5. SonarQube Quality Gate

SonarQube is wired into the Jenkins pipeline and runs through the official scanner container.

The analysis is configured to inspect:

- `frontend/src/**/*`
- `microservices/meetingworkflow/**/*.py`
- `microservices/video_onboarding_service/**/*.py`

It excludes generated and vendor content such as:

- `frontend/dist`
- `frontend/node_modules`
- `microservices/**/venv`
- `microservices/**/__pycache__`

This keeps the analysis focused on authored source code instead of build output.

## 6. Automated Testing

Testing is implemented with `pytest` for the Python backend.

### Test location

The current test file is [microservices/video_onboarding_service/tests/test_smoke.py](microservices/video_onboarding_service/tests/test_smoke.py).

### What the test covers

The smoke test checks the two simplest API entry points:

- `health()` returns the expected status payload
- `root()` returns the expected docs and health links

### How Jenkins runs tests

The Jenkins `Unit Tests` stage runs the tests inside the already-built video onboarding Docker image. This keeps the test environment aligned with the service runtime and avoids depending on host-mounted files.

The current command is effectively:

```bash
docker run --rm workstream-ai-video-onboarding:${BUILD_NUMBER} \
  sh -lc "python -m pip install --no-cache-dir pytest && python -m pytest -q tests"
```

This is why the pipeline now passes the test stage cleanly.

## 7. End-to-End Flow

The deployed flow is:

1. Terraform provisions the AWS infrastructure.
2. EC2 bootstraps the application server.
3. Docker Compose runs the frontend, APIs, database, and Nginx.
4. Jenkins builds the images on each push.
5. SonarQube analyzes the source code.
6. Pytest runs backend smoke tests.
7. Jenkins tags the images and deploys the latest version on `main`.

## 8. Files That Define the Setup

- [docker-compose.yml](docker-compose.yml)
- [Jenkinsfile](Jenkinsfile)
- [frontend/Dockerfile](frontend/Dockerfile)
- [microservices/meetingworkflow/Dockerfile](microservices/meetingworkflow/Dockerfile)
- [microservices/video_onboarding_service/Dockerfile](microservices/video_onboarding_service/Dockerfile)
- [terraform/main.tf](terraform/main.tf)
- [terraform/ec2.tf](terraform/ec2.tf)
- [terraform/jenkins.tf](terraform/jenkins.tf)
- [terraform/outputs.tf](terraform/outputs.tf)
- [terraform/outputs_jenkins.tf](terraform/outputs_jenkins.tf)

## 9. Summary

The DevOps setup for Workstream AI is now complete enough to support:

- containerized builds with Docker
- AWS provisioning with Terraform
- CI/CD with Jenkins
- code quality checks with SonarQube
- automated backend testing with pytest

The result is a repeatable deployment path from GitHub push to tested Docker images on AWS.