# Backend API Documentation

## Server Configuration

**Port:** 8001  
**Base URL:** `http://localhost:8001/api`

## Environment Variables

Create a `.env` file in the backend directory:

```
PORT=8001
MONGODB_URI=mongodb://127.0.0.1:27017/coding_app
JWT_SECRET=secret
NODE_ENV=development
```

## API Endpoints

### Authentication

#### Register User
```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "points": 0,
    "accuracy": 0
  }
}
```

#### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "alice@example.com",
  "password": "password123"
}

Response: Same as register
```

### Topics
```bash
GET /api/topics

Response:
[
  {
    "_id": "...",
    "name": "Python Basics",
    "language": "python",
    "description": "Learn fundamental Python programming concepts"
  }
]
```

### Questions
```bash
GET /api/questions?topic=TOPIC_ID

Response: Array of questions for the topic
```

### Code Execution
```bash
POST /api/run
{
  "code": "print('Hello')",
  "language": "python",
  "questionId": "QUESTION_ID"
}

Response: Test results
```

### Submit Code
```bash
POST /api/submit
{
  "code": "...",
  "language": "python",
  "questionId": "QUESTION_ID",
  "userId": "USER_ID"
}

Response:
{
  "passed": 3,
  "accuracy": 100
}
```

### Leaderboard
```bash
GET /api/leaderboard/global

Response: Top 50 users sorted by points
```

## Running the Server

```bash
# Install dependencies
npm install

# Seed the database
npm run seed

# Start development server
npm run dev

# Start production server
npm start
```

## Test Credentials

- **Email:** alice@example.com
- **Password:** password123

## Frontend Configuration

Update `code/src/api/client.ts`:
```typescript
export const API = axios.create({
  baseURL: "http://localhost:8001/api",
});
```

## Error Handling

All endpoints return errors in the format:
```json
{
  "error": "Error message"
}
```

Status codes:
- 200: Success
- 400: Bad request / Validation error
- 401: Unauthorized
- 500: Server error
