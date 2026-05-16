# Robot Job Tracker

A small full-stack Spring Boot project for practicing backend fundamentals with a robotics-flavored domain.

It includes:

- Spring Boot REST API with controller, service, repository, DTO, entity, and exception layers
- PostgreSQL persistence through Spring Data JPA and Hibernate
- Request validation and clean JSON error responses
- Swagger UI / OpenAPI docs
- Actuator health endpoint
- React/Vite client dashboard
- Dockerfiles and Docker Compose for local deployment
- AWS App Runner and RDS deployment notes

## Architecture

```text
React client
  -> Spring Boot REST API
  -> Spring Data JPA repository
  -> PostgreSQL database
```

## API

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/api/hello` | Simple backend smoke test |
| `GET` | `/actuator/health` | Spring Boot health check |
| `GET` | `/api/jobs` | List jobs |
| `GET` | `/api/jobs/{id}` | Get one job |
| `POST` | `/api/jobs` | Create a job |
| `PATCH` | `/api/jobs/{id}/status` | Update job status |
| `DELETE` | `/api/jobs/{id}` | Delete a job |

Statuses:

```text
PENDING, RUNNING, COMPLETED, FAILED, CANCELLED
```

Example create request:

```bash
curl -X POST http://localhost:8080/api/jobs \
  -H 'Content-Type: application/json' \
  -d '{"name":"Pick object A","description":"Move part to inspection station","targetX":120.5,"targetY":80.0}'
```

## Run Locally With Docker

From the repo root:

```bash
docker compose up --build
```

Then open:

- Client: `http://localhost:5173`
- API: `http://localhost:8080/api/jobs`
- Swagger UI: `http://localhost:8080/swagger-ui.html`
- Health: `http://localhost:8080/actuator/health`

## Run Backend Without Docker

Start PostgreSQL first:

```bash
docker compose up postgres
```

In another terminal:

```bash
cd backend
./mvnw spring-boot:run
```

The backend reads database settings from environment variables, with local defaults in `backend/src/main/resources/application.properties`.

## Run Client Without Docker

```bash
cd client
npm install
npm run dev
```

The client expects the backend at `http://localhost:8080`. To change that, create `client/.env`:

```text
VITE_API_BASE_URL=https://your-api.example.com
```

## AWS Deployment Path

Recommended first AWS architecture:

```text
Internet
  -> AWS App Runner
  -> Spring Boot app
  -> Amazon RDS PostgreSQL
```

High-level steps:

1. Create an RDS PostgreSQL database.
2. Allow App Runner network access to the RDS database through the right VPC connector/security groups.
3. Deploy the backend to App Runner from the repository or from a container image.
4. Add App Runner environment variables:

```text
SPRING_DATASOURCE_URL=jdbc:postgresql://<rds-endpoint>:5432/robot_jobs
SPRING_DATASOURCE_USERNAME=<rds-user>
SPRING_DATASOURCE_PASSWORD=<rds-password>
SPRING_JPA_HIBERNATE_DDL_AUTO=update
```

5. Confirm `https://<app-runner-url>/actuator/health` returns `UP`.
6. Point the React client at the App Runner URL with `VITE_API_BASE_URL`.

`apprunner.yaml` is included for source-based App Runner deployments. You can also build and push the backend Docker image to Amazon ECR, then create an App Runner service from that image.

## Interview Explanation

Use this concise version:

> I built a Spring Boot backend for managing robot jobs. It exposes REST APIs, uses controller/service/repository layers, validates request DTOs, persists data in PostgreSQL through Spring Data JPA, runs locally with Docker Compose, and can be deployed on AWS App Runner with RDS PostgreSQL. I also added a small React dashboard that calls the API over HTTP.
