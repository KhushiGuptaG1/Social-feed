# Social Feed Module

## Setup
1. Install PostgreSQL, MongoDB, Redis.
2. Create PostgreSQL DB `social_feed` and run schema above.
3. Backend:
   - cd backend
   - npm install
   - mkdir uploads
   - npm run start:dev
4. Frontend:
   - cd frontend
   - npm install
   - npm run dev
5. Access frontend at http://localhost:3001, backend APIs at http://localhost:3000, Swagger at http://localhost:3000/api-docs.

## Features
- Feed creation with text and up to 4 cropped images.
- Infinite scrolling feed list (<2s load with Redis cache).
- Single-level comments.
- Reporting (hide after 3 unique reports).
- Error logging to MongoDB.
- Auth with JWT.

## Postman Collection
Import the following endpoints:
- POST /auth/register {username, password}
- POST /auth/login {username, password}
- POST /feeds (multipart, text, images[]) - Bearer token
- GET /feeds?page=1&limit=10 - Bearer token
- POST /comments {feedId, text} - Bearer token
- GET /comments/:feedId - Bearer token
- POST /reports {feedId} - Bearer token