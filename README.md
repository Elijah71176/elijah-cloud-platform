# Elijah Cloud Platform 

Elijah Cloud Platform is a full-stack cloud-native application demonstrating modern software development, DevOps, and AWS deployment practices.

The project simulates a real-world client portal with public portfolio pages, service request functionality, project management, and an admin dashboard connected to a live backend API and PostgreSQL database.

# Features

## Public Features

- Home landing page
- About page
- Services page
- Contact page
- Public projects portfolio
- Service request form
- Mobile-friendly navigation

## Admin Features

- Admin login protection
- Project dashboard
- Create projects
- Edit projects
- Delete projects
- Project statistics overview

## Backend & Infrastructure

- NestJS REST API
- PostgreSQL database
- AWS cloud deployment
- Dockerized backend
- CI/CD pipelines
- Automated testing

---

# Architecture

```text
Frontend (Next.js Static Export → AWS S3)
                ↓
Backend API (NestJS + Docker → AWS EC2)
                ↓
Database (PostgreSQL → AWS RDS)
```

## Infrastructure Overview

- Frontend hosted on **Amazon S3 Static Website Hosting**
- Backend deployed in Docker container on **Amazon EC2**
- Database managed by **Amazon RDS PostgreSQL**
- CI/CD automated using **GitHub Actions**

---

# Tech Stack

## Frontend

- Next.js
- React
- TypeScript

## Backend

- NestJS
- TypeORM
- PostgreSQL

## Testing

- Jest
- Testing Library
- e2e testing

## DevOps & Cloud

- Docker
- AWS EC2
- AWS S3
- AWS RDS
- GitHub Actions
- CI/CD Pipelines

---

# Project Structure

```text
Elijah Cloud Platform
 ┣ apps
 ┃ ┣ api        → NestJS backend
 ┃ ┗ web        → Next.js frontend
 ┣ infra        → Docker Compose setup
 ┣ .github
 ┃ ┗ workflows  → CI/CD pipelines
 ┗ README.md
```

---

# Run Locally

## Option 1 — Docker (Recommended)

```bash
cd infra
docker compose up -d
```

Check running services:

```bash
docker compose ps
```

Application URLs:

```text
Frontend: http://localhost:3000
Backend:  http://localhost:3001/health
```

---

## Option 2 — Without Docker

### Backend

```bash
cd apps/api
npm install
npm run start:dev
```

### Frontend

```bash
cd apps/web
npm install
npm run dev
```

---

# Environment Variables

Example local `.env`:

```env
DATABASE_URL=postgresql://app:app@localhost:5432/mini_dps
PORT=3001
NODE_ENV=development
```

---

# Running Tests

## Backend Unit Tests

```bash
cd apps/api
npm run test
```

## Backend e2e Tests

```bash
cd apps/api
DATABASE_URL=postgresql://app:app@localhost:5432/mini_dps npx jest -c test/jest-e2e.json
```

## Frontend Tests

```bash
cd apps/web
npm run test
```

---

# CI/CD Pipeline

GitHub Actions automatically performs:

- Backend testing
- Frontend testing
- Application builds
- CI validation
- Deployment workflow

## Deployment Flow

```text
GitHub Push
    ↓
GitHub Actions
    ↓
Frontend → AWS S3
Backend → AWS EC2
```

---

# Production Deployment (AWS)

## Frontend Deployment

- Hosted on Amazon S3
- Next.js static export
- Public website hosting enabled

## Backend Deployment

- Hosted on Amazon EC2
- Docker containerized API
- Exposed REST API endpoints

## Database

- Amazon RDS PostgreSQL
- Connected securely from backend API

---

# Live Endpoints

## Frontend

```text
```

## Backend API

```text
coming soon```

---

# Notes

- CORS configured between S3 frontend and EC2 backend
- Static export used for S3 compatibility
- Dynamic routes replaced with query-based admin edit routes
- Admin authentication currently uses simple frontend protection
- HTTPS can later be added using CloudFront and Route 53

---

# Current Version

```text
v1.0
```

---

# Author

**Elijah**  
AWS Cloud Developer Student