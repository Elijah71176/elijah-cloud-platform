# Elijah Cloud Platform

Elijah Cloud Platform is a cloud-based project management system built as part of my AWS Junior Developer project.

## Architecture

User → S3 (Frontend) → EC2 (Backend Docker) → RDS (PostgreSQL)

## Live URLs

Frontend:
coming soon

Backend:
http://13.60.17.29

Health:
http://13.60.17.29/health

## Tech Stack

- Next.js (Frontend)
- NestJS (Backend)
- PostgreSQL (RDS)
- Docker (Backend container)
- AWS S3 (Frontend hosting)
- AWS EC2 (Backend hosting)
- GitHub Actions (CI)

## API

GET /health  
GET /customers  
GET /projects  

POST /customers  
POST /projects  

PATCH /customers/:id  
PATCH /projects/:id  

DELETE /customers/:id  
DELETE /projects/:id  

## Deployment

Backend runs in Docker on EC2.

Internal port:
3001

External port:
80 (mapped from 3001)

So API is accessed with:


## Fixes Done

- Fixed EC2 SSH access
- Fixed Security Groups
- Changed backend from port 3001 to port 80
- Fixed Docker DATABASE_URL
- Fixed frontend API URL
- Fixed CORS issue
- Rebuilt and deployed frontend to S3

## Local Development

Install:

npm install

Run backend:

cd apps/api  
npm run start:dev  

Run frontend:

cd apps/web  
npm run dev  

## Frontend Env

NEXT_PUBLIC_API_URL=http://13.60.17.29

## Backend Env

DATABASE_URL=postgresql://app:******@rds-endpoint:5432/mini_dps  
PORT=3001



## CI/CD (GitHub Actions)

This project uses GitHub Actions for Continuous Integration.

Every time code is pushed to the repository:

- Dependencies are installed
- The project is built
- Errors are detected early

CI status: ✅ Passing

This ensures code quality and stability before deployment.

## Author

Bamidele Mayowa A. Elijah