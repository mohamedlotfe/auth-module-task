# Authentication Module Documentation

A full-featured NestJS & React authentication system using JWT, refresh tokens, and MongoDB.
Secure, modular, and ready for production

## Key Features

- User signup & login with hashed passwords=
- Access & refresh tokens (rotation + revocation)
- JWT-protected routes
- Rate limiting & CORS
- Helmet security headers
- MongoDB (TypeORM) integration

## Tech Stack

NestJS, TypeScript, MongoDB, TypeORM, Passport (JWT), bcrypt, Helmet, Jest

## Environment Variables

Create a `.env` in backend folder:

```env
# Application
PORT=3000
MONGODB_URI=mongodb://admin:password@localhost:27017/auth_db
JWT_ACCESS_SECRET=your-access-secret
JWT_REFRESH_SECRET=your-refresh-secret
FRONTEND_ORIGIN=http://localhost:5173


THROTTLE_TTL=60
THROTTLE_LIMIT=10
```

## Installation

```bash
npm install

# Start MongoDB
docker-compose up -d

# Start app
npm run start:dev
```

## API Endpoints

### POST /auth/signup

Register a new user

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "Password123!",
  "name": "John Doe"
}
```

**Response (201):**

```json
{
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "name": "John Doe",
    "roles": ["user"]
  }
}
```
---

### POST /auth/signin

Auth existing user

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "Password123!"
}
```

**Response (200):**

```json
{
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "name": "John Doe",
    "roles": ["user"]
  }
}
```

---

### POST /auth/refresh

Get new access and refresh

**Request Body:**

```json
{
  "refreshToken": "eyJhbGc..."
}
```

**Response (200):**

```json
{
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc..."
}
```

---

### POST /auth/logout

**Request Body:**

```json
{
  "refreshToken": "eyJhbGc..."
}
```

**Response (200):**

```json
{
  "message": "Logged out successfully"
}
```

---

#### GET /auth/profile

Get authenticated profile

**Headers:**

```
Authorization: Bearer <accessToken>
```

**Response (200):**

```json
{
  "id": "507f1f77bcf86cd799439011",
  "email": "user@example.com",
  "roles": ["user"]
}
```


## Project Structure

```
src/
├── auth/
│   ├── dto/                    # Data Transfer Objects
│   ├── entities/               # Database entities
│   ├── guards/                 # Route guards (JWT)
│   ├── interfaces/             # TypeScript interfaces
│   ├── repositories/           # Database repositories
│   ├── services/               # Business logic services
│   ├── strategies/             # Passport strategies
│   ├── auth.controller.ts      # REST endpoints
│   ├── auth.module.ts          # Module configuration
│   └── auth.service.ts         # Core auth logic
├── users/
│   ├── dto/
│   ├── entities/
│   ├── users.repository.ts
│   ├── users.service.ts
│   └── users.module.ts
├── common/
│   ├── database/               # Database configuration
│   └── filters/                # Exception filters
├── config/
│   ├── app.config.ts           # App-level config (CORS, validation, etc.)
│   └── throttler.config.ts     # Rate limiting config
└── main.ts                     # Application bootstrap
```



## Development Scripts

```bash
# Start development 
npm run start:dev

# Build for production
npm run build

# Start production server
npm run start:prod

# Format code
npm run format

# Lint code
npm run lint

# Run tests
npm run test
npm run test:e2e
npm run test:cov
```

## Docker Commands

```bash
# Start MongoDB
docker-compose up -d

# Stop MongoDB
docker-compose down

# View logs
docker-compose logs -f mongodb

# Reset database (remove volumes)
docker-compose down -v
```


