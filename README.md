# Job Queue and Automation System

A Python-based job queue and automation application designed to manage background tasks, track execution status, handle failures, and eventually automate notifications through email and AWS SNS.

This project is being built incrementally to develop practical Python skills while learning backend development, API design, cloud services, and software deployment.

## Project Goals

- Build a system that manages jobs and their execution status.
- Track job attempts and prevent jobs from being processed beyond a defined retry limit.
- Develop a REST API using FastAPI.
- Automate tasks such as sending emails and notifications.
- Integrate AWS Simple Notification Service (SNS).
- Persist job data in a database.
- Containerize the application with Docker.
- Explore automated testing and CI/CD.
- Eventually deploy the application to a cloud environment.

## Current Progress

### Completed

- Created the initial Python project.
- Represented jobs using dictionaries stored in a list.
- Defined job attributes:
  - `id`
  - `task`
  - `status`
  - `attempts`
- Implemented a function to find the next pending job.
- Implemented basic job processing and status updates.
- Implemented job attempt tracking.
- Added a basic retry-limit check.
- Created a function to retrieve all jobs.
- Practiced Python loops, conditionals, functions, dictionary access, parameters, and return values.

### Current Job Statuses

The initial implementation uses statuses such as:

- `pending`
- `completed`
- `failed`

Additional statuses, such as `running`, may be introduced as the application becomes more sophisticated.

**Current limitations:** Jobs are stored in memory, so they will not persist after the program exits. Job execution is simulated rather than connected to real email or notification services. Retry handling and job-processing logic still need further development.

## Planned Technology Stack

| Technology | Purpose |
|---|---|
| Python | Core application and job-processing logic |
| FastAPI | REST API for managing and processing jobs |
| Pydantic | Request validation and API data models |
| PostgreSQL | Persistent job storage |
| AWS SNS | Sending notifications to configured subscribers |
| Email service | Automated email notifications |
| Docker | Containerizing the application |
| Pytest | Automated testing |
| GitHub Actions | CI/CD automation |

The stack may evolve as the project develops.

## Development Roadmap

### Phase 1 — Python Foundations

- [x] Create the initial job list.
- [x] Find the next pending job.
- [x] Process jobs and update their statuses.
- [x] Track execution attempts.
- [ ] Implement a function to retrieve jobs by status.
- [ ] Create a `Job` class to represent individual jobs.
- [ ] Refactor the code into separate modules.
- [ ] Improve retry rules and job-state validation.

### Phase 2 — Application Structure

- [ ] Organize the code into `jobs.py`, `worker.py`, and `main.py`.
- [ ] Separate job management from job execution.
- [ ] Create a worker that executes jobs and reports success or failure.
- [ ] Add error handling and basic logging.
- [ ] Write unit tests for job creation, processing, and retry behavior.

### Phase 3 — FastAPI Backend

- [ ] Create a FastAPI application.
- [ ] Add endpoints to create and list jobs.
- [ ] Add endpoints to retrieve jobs by ID or status.
- [ ] Add an endpoint to submit jobs for processing.
- [ ] Validate incoming requests with Pydantic.
- [ ] Test the API using Swagger UI or an API client.

### Phase 4 — Database and Reliability

- [ ] Integrate PostgreSQL.
- [ ] Persist jobs and execution attempts.
- [ ] Track timestamps, execution results, and error messages.
- [ ] Prevent invalid job-state transitions.
- [ ] Improve retry handling and failure recovery.

### Phase 5 — Email and AWS SNS Automation

- [ ] Add an email notification job.
- [ ] Configure an email delivery service.
- [ ] Integrate AWS SNS for notifications.
- [ ] Notify subscribers when selected jobs succeed or fail.
- [ ] Configure credentials securely using environment variables and appropriate AWS permissions.
- [ ] Test notification failures and retry behavior.

### Phase 6 — Deployment and Expansion

- [ ] Create a Docker image.
- [ ] Run the API and database using Docker Compose.
- [ ] Add GitHub Actions for testing and CI.
- [ ] Deploy the application to AWS.
- [ ] Explore a frontend dashboard for submitting jobs and monitoring their status.
- [ ] Explore scheduled jobs, multiple workers, and concurrent processing.

## Learning Objectives

This project is intended to build practical experience with:

- Python classes, functions, collections, and exceptions.
- Object-oriented programming and modular application design.
- REST APIs and backend architecture.
- Database design and persistence.
- Background processing, retries, and failure handling.
- Email automation and AWS messaging services.
- Docker, automated testing, CI/CD, and cloud deployment.

## Current Project Structure

The project currently begins with a simple Python entry point. As the codebase grows, the planned structure will separate job definitions, job management, and execution logic.

```text
job-queue-automation/
├── main.py
├── jobs.py
├── worker.py
├── tests/
├── requirements.txt
├── .env.example
├── .gitignore
└── README.md
```

Additional files and directories will be introduced as the application requires them.

## Project Philosophy

Build the fundamentals first, then introduce each technology when it solves a real problem. The goal is to understand how the application works rather than simply assembling a collection of frameworks and services.

**Current stage:** Python fundamentals and initial job-management logic.

**Next milestone:** Introduce a `Job` class, organize the code into modules, and build the first FastAPI endpoints.
