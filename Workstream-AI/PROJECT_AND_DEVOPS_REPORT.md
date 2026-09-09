# Workstream AI Project and DevOps Report

## 1. Project Overview

Workstream AI is the first major project in this workspace and it is built as an AI-driven enterprise workflow platform. The product brings together multiple intelligent services so that routine business processes can be handled through a combination of frontend interaction, backend orchestration, and automated decision support.

The user-facing application is a React frontend that gives teams a single interface to work with meetings, tasks, pipeline runs, audit events, calendar events, and approval flows. The frontend talks to backend APIs through a consistent service layer, and it is designed to work behind an Nginx reverse proxy.

The backend is split into focused services:

- The Meeting Workflow service coordinates meeting-related pipelines and exposes REST and WebSocket endpoints for real-time updates.
- The Video Onboarding service handles the onboarding flow, document uploads, validation, and supporting API routes.
- Both services are built as FastAPI applications and run independently so they can be deployed and tested in isolation.

At a high level, the product flow is:

1. A user signs in through the frontend.
2. The frontend requests data from the backend services.
3. The meeting workflow service processes workflow actions and emits updates.
4. The video onboarding service handles upload and verification tasks.
5. The system stores and exposes operational data such as audit events, tasks, and pipeline state.

This design keeps the project modular while still presenting a single unified application to the user.

## 2. Main Functional Areas

### Frontend

The frontend is the presentation layer. It provides the login experience, dashboard screens, task views, and workflow interactions. The API client in [frontend/src/lib/api.ts](frontend/src/lib/api.ts) shows how the UI connects to meeting, task, audit, escalation, calendar, and pipeline endpoints.

The login page in [frontend/src/pages/Login.tsx](frontend/src/pages/Login.tsx) is a good example of the product direction. It presents the application as an enterprise AI workspace and supports demo login behavior for presentation and testing.

### Meeting Workflow Service

The Meeting Workflow service in [microservices/meetingworkflow/main.py](microservices/meetingworkflow/main.py) is a FastAPI application with routers for meetings, tasks, dashboard data, audit events, escalations, pipeline updates, WebSocket notifications, and calendar data. It also starts the scheduler on startup, which means the service is not only serving APIs but also coordinating background workflow behavior.

### Video Onboarding Service

The Video Onboarding service in [microservices/video_onboarding_service/main.py](microservices/video_onboarding_service/main.py) is the second backend service. It initializes the database, exposes health and root endpoints, serves upload content, and provides the onboarding API surface used by the app. This service is the part that supports document-centric onboarding and verification flows.

## 3. Why the Project Architecture Matters

The architecture is useful because each piece has a clear responsibility.

- The frontend is optimized for user interaction and data presentation.
- The meeting workflow service focuses on orchestration and live updates.
- The video onboarding service focuses on onboarding operations and file handling.
- Docker and Terraform make the runtime and infrastructure repeatable.

This separation makes the system easier to maintain, easier to test, and easier to deploy in a controlled way.

## 4. DevOps Part

The DevOps implementation turns the project into a repeatable deployment system. The actual DevOps documentation is already captured in [DEVOPS_OVERVIEW.md](DEVOPS_OVERVIEW.md), and the key parts are summarized below.

### Docker

Docker is used to package the application into reproducible images. The frontend uses a multi-stage build, the Meeting Workflow service uses a slim Python image, and the Video Onboarding service adds `ffmpeg` because the service needs media-processing support.

The root [docker-compose.yml](docker-compose.yml) brings the full stack together with:

- frontend
- meeting-workflow
- video-onboarding
- PostgreSQL database
- Nginx reverse proxy

This gives a consistent local and deployment runtime model.

### Terraform

Terraform provisions the AWS environment for the project. The infrastructure in [terraform/ec2.tf](terraform/ec2.tf) and related files creates:

- a VPC and public subnet
- security groups
- an application EC2 instance
- a Jenkins EC2 instance
- Elastic IPs for stable access
- CloudWatch alarms for monitoring

The outputs in [terraform/outputs.tf](terraform/outputs.tf) and [terraform/outputs_jenkins.tf](terraform/outputs_jenkins.tf) expose the public URLs and SSH connection details needed to manage the deployment.

### Jenkins

Jenkins is the CI/CD engine for the repository. The pipeline in [Jenkinsfile](Jenkinsfile) performs the following actions:

1. Checks out the repository.
2. Builds Docker images.
3. Runs SonarQube analysis.
4. Executes automated tests.
5. Tags the images.
6. Deploys to production on the `main` branch.

This pipeline is important because it connects code changes to a real deployment path instead of stopping at a local build.

### SonarQube

SonarQube is used for code quality analysis. It is integrated into Jenkins so that the code is scanned during the CI flow. The scan is focused on the source directories and excludes generated build output, which keeps the analysis meaningful.

### Testing

Testing is implemented with `pytest` for the backend. The smoke test in [microservices/video_onboarding_service/tests/test_smoke.py](microservices/video_onboarding_service/tests/test_smoke.py) validates the basic `health()` and `root()` endpoints.

The Jenkins unit test stage runs inside the built video onboarding image, which keeps the test environment aligned with the service runtime. That is why the pipeline can verify the service in a realistic container context.

## 5. Pipeline Explanation

The CI/CD flow is:

1. A commit is pushed to GitHub.
2. GitHub webhook notifies Jenkins.
3. Jenkins starts the pipeline defined in [Jenkinsfile](Jenkinsfile).
4. The required Docker images are built.
5. SonarQube checks the code.
6. Pytest validates the backend smoke tests.
7. Jenkins deploys the latest approved build to the application EC2 instance.

This means the project is not just deployed once. It is deployed through a controlled and repeatable process every time the main branch changes.

## 6. Screenshot Evidence

For the final submission, attach a Jenkins pipeline screenshot that shows:

- the pipeline running successfully
- the SonarQube stage completing
- the unit test stage passing
- the final build status as `SUCCESS`

If needed, also include a second screenshot showing the application URL opening successfully in the browser.

## 7. Summary

The first Workstream AI project demonstrates an AI-enabled enterprise workflow platform with a modular frontend and backend design. The DevOps implementation then takes that project and makes it production-oriented through Docker, Terraform, Jenkins, SonarQube, and automated testing.

Together, these pieces show both the product side of the project and the delivery pipeline that supports it.