# Template Backend

A minimal Express + TypeScript backend template with authentication, user management, request validation, error handling, and optional MongoDB integration.

## Features

- Express server with JSON body parsing
- API token validation via `x-api-key`
- Auth endpoints for login and refresh
- User CRUD endpoints using MongoDB/Mongoose
- Global error middleware
- Docker and Docker Compose support
- TypeScript build and development modes

## Tech Stack

- Node.js
- TypeScript
- Express
- Mongoose
- bcrypt
- jsonwebtoken
- dotenv
- Docker

## Getting Started

### Prerequisites

- Node.js 20+ installed
- npm
- MongoDB instance for persistence (optional, required for user auth and user routes)

### Install dependencies

```bash
npm install
```

### Environment Setup

Create a `.env` file in the repository root with the following values:

```env
PORT=3000
STAGE=development
API_KEY=your_api_key_here
MONGODB_URI=mongodb://localhost:27017/your-db-name
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
ACCESS_TOKEN_LIFE=15m
REFRESH_TOKEN_LIFE=7d
```

> Note: If you only need the health endpoint, the MongoDB connection is optional. The app currently starts without connecting to MongoDB by default. To enable DB connection before server start, uncomment the `connectDB()` block in `src/index.ts`.

### Run locally

Start in development mode:

```bash
npm run dev
```

Build and run the production bundle:

```bash
npm run build
npm start
```

### Docker

Start the app with Docker Compose:

```bash
docker compose up --build
```

The service runs on `http://localhost:3000` by default.

## API Endpoints

### Health

- `GET /api/health`
- Public endpoint

Response:

```json
{
  "status": "ok",
  "timestamp": "2026-07-07T00:00:00.000Z",
  "uptime": 123.45
}
```

### Authentication

All protected endpoints require the header:

```http
x-api-key: your_api_key_here
```

#### Login

- `POST /api/login`
- Body:

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

- Response:

```json
{
  "accessToken": "...",
  "refreshToken": "..."
}
```

#### Refresh Token

- `POST /api/refresh/:refreshToken`
- Path parameter: `refreshToken`
- Response:

```json
{
  "accessToken": "...",
  "refreshToken": "..."
}
```

### Users

All user routes are mounted under `/api/users` and require `x-api-key`.

#### Get all users

- `GET /api/users/`

#### Get user by id

- `GET /api/users/:id`

#### Create user

- `POST /api/users/`
- Body:

```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstname": "Jane",
  "lastname": "Doe"
}
```

#### Update user

- `PUT /api/users/:id`
- Body can include any of:

```json
{
  "email": "new@example.com",
  "firstname": "Jane",
  "lastname": "Doe",
  "password": "newPassword123"
}
```

#### Delete user

- `DELETE /api/users/:id`

## Project Structure

- `src/index.ts` - app entrypoint
- `src/config/db.ts` - MongoDB connection helper
- `src/middleware` - middleware for validation and error handling
- `src/modules/auth` - authentication controller, service, and routes
- `src/modules/user` - user controller, service, repository, and model
- `src/utils` - helpers for auth token generation and custom errors

## Notes

- `x-api-key` is validated for all routes except `/api/health`
- JWT secrets and lifetimes must be configured via environment variables
- `npm run dev` uses `ts-node` and live node watch mode
- `Dockerfile` includes separate `dev` and `production` stages

## License

This repository is a template. Customize as needed for your project.
