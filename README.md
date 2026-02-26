# CodeLearn Backend API

Complete backend server for the CodeLearn React Native application with code execution, submissions, and leaderboard system.

## Features

✅ User Authentication (JWT)
✅ Languages, Topics & Notes Management
✅ Coding Questions System
✅ Code Execution (Judge0 Integration)
✅ Test Case Validation
✅ Submission History
✅ Accuracy Calculation
✅ Global & Batch Leaderboards
✅ Weekly Rankings

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **Authentication**: JWT + bcrypt
- **Code Execution**: Judge0 API
- **Validation**: express-validator

## Project Structure

```
backend/
├── config/
│   └── db.js                 # MongoDB connection
├── models/
│   ├── User.js              # User model
│   ├── Language.js          # Programming languages
│   ├── Topic.js             # Learning topics
│   ├── Note.js              # Learning notes
│   ├── Question.js          # Coding questions
│   └── Submission.js        # Code submissions
├── controllers/
│   ├── authController.js    # Auth logic
│   ├── learningController.js # Learning APIs
│   ├── questionController.js # Question APIs
│   ├── codeController.js    # Code execution
│   └── leaderboardController.js # Rankings
├── routes/
│   ├── authRoutes.js
│   ├── learningRoutes.js
│   ├── questionRoutes.js
│   ├── codeRoutes.js
│   └── leaderboardRoutes.js
├── middleware/
│   └── authMiddleware.js    # JWT protection
├── utils/
│   └── judge0.js            # Code execution utility
└── server.js                # Entry point
```

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env` file in the root directory:

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/codelearn
JWT_SECRET=your_super_secret_jwt_key_here
JUDGE0_API_KEY=your_rapidapi_key_here
PORT=5000
NODE_ENV=development
```

### 3. Get Judge0 API Key

1. Go to [RapidAPI Judge0](https://rapidapi.com/judge0-official/api/judge0-ce/)
2. Subscribe to the free plan
3. Copy your API key
4. Add it to `.env`

### 4. Setup MongoDB

**Option A: MongoDB Atlas (Cloud)**
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free cluster
3. Create database user
4. Whitelist IP address (0.0.0.0/0 for development)
5. Copy connection string to `.env`

**Option B: Local MongoDB**
```bash
# Install MongoDB locally
# macOS
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community

# Use local connection string
MONGO_URI=mongodb://localhost:27017/codelearn
```

### 5. Run the Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

Server will run on `http://localhost:5000`

## API Endpoints

### Authentication

```
POST   /api/auth/signup          # Register new user
POST   /api/auth/login           # Login user
GET    /api/auth/profile         # Get user profile (protected)
PUT    /api/auth/profile         # Update profile (protected)
GET    /api/auth/stats           # Get user stats (protected)
```

### Learning Module

```
GET    /api/learning/languages                      # Get all languages
GET    /api/learning/languages/:id                  # Get language by ID
GET    /api/learning/topics/language/:languageId   # Get topics by language
GET    /api/learning/topics/:id                     # Get topic by ID
GET    /api/learning/notes/:topicId                 # Get notes by topic
```

### Questions

```
GET    /api/questions                    # Get all questions
GET    /api/questions/:id                # Get question by ID
GET    /api/questions/topic/:topicId     # Get questions by topic
GET    /api/questions/:id/testcases      # Get test cases (protected)
```

### Code Execution

```
POST   /api/code/run                     # Run code (protected)
POST   /api/code/submit                  # Submit solution (protected)
GET    /api/code/submissions             # Get submission history (protected)
GET    /api/code/submissions/:id         # Get submission by ID (protected)
```

### Leaderboard

```
GET    /api/leaderboard/global           # Global leaderboard
GET    /api/leaderboard/batch/:batch     # Batch leaderboard
GET    /api/leaderboard/weekly           # Weekly leaderboard
GET    /api/leaderboard/rank             # Get user rank (protected)
```

## API Usage Examples

### Register User

```javascript
POST /api/auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "batch": "BCA-2026"
}
```

### Login

```javascript
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "_id": "...",
  "name": "John Doe",
  "email": "john@example.com",
  "batch": "BCA-2026",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Run Code

```javascript
POST /api/code/run
Authorization: Bearer <token>
Content-Type: application/json

{
  "code": "print('Hello World')",
  "language": "Python",
  "input": ""
}

Response:
{
  "success": true,
  "output": "Hello World\n",
  "error": "",
  "status": "Accepted",
  "time": "0.02",
  "memory": 2048
}
```

### Submit Solution

```javascript
POST /api/code/submit
Authorization: Bearer <token>
Content-Type: application/json

{
  "questionId": "60d5ec49f8d2e740d8a5c8a1",
  "code": "def reverse(s):\n    return s[::-1]\nprint(reverse(input()))",
  "language": "Python"
}

Response:
{
  "success": true,
  "submission": {
    "_id": "...",
    "status": "accepted",
    "passed": 10,
    "total": 10,
    "accuracy": 100,
    "score": 10
  },
  "testResults": [...],
  "userStats": {
    "totalScore": 85,
    "accuracy": 92,
    "solvedCount": 8
  }
}
```

## Supported Languages

| Language   | Judge0 ID |
|------------|-----------|
| Python     | 71        |
| JavaScript | 63        |
| Java       | 62        |
| C++        | 54        |
| C          | 50        |
| Go         | 60        |
| Rust       | 73        |
| TypeScript | 74        |

## Data Models

### User
- name, email, password, batch
- solvedQuestions[], submissions[]
- totalScore, accuracy, rank

### Language
- name, icon, color
- topicsCount, questionsCount
- judgeLanguageId

### Topic
- languageId, name, description
- order, questionsCount

### Question
- title, slug, difficulty
- description, testCases[]
- accuracy, totalAttempts

### Submission
- userId, questionId, code
- passed, total, accuracy
- status, score, executionTime

## Deployment

### Render / Railway

1. Create new Web Service
2. Connect GitHub repository
3. Add environment variables
4. Deploy

### AWS / DigitalOcean

1. Create Ubuntu server
2. Install Node.js & MongoDB
3. Clone repository
4. Setup PM2 for process management
5. Configure Nginx reverse proxy

## Testing

```bash
# Install test tools
npm install --save-dev jest supertest

# Run tests
npm test
```

## Security

- Passwords hashed with bcrypt
- JWT token authentication
- Protected routes middleware
- Input validation
- CORS configured
- Rate limiting (recommended to add)

## Performance

- MongoDB indexing on frequently queried fields
- Caching with Redis (optional)
- Code execution timeout limits
- Memory limits per execution

## Troubleshooting

### MongoDB Connection Error
- Check MONGO_URI in .env
- Verify MongoDB Atlas IP whitelist
- Check database user credentials

### Judge0 API Error
- Verify JUDGE0_API_KEY
- Check RapidAPI subscription status
- Monitor API quota limits

### Code Execution Timeout
- Increase timeout in judge0.js
- Check infinite loops in submitted code
- Verify Judge0 service status

## Future Enhancements

- [ ] Redis caching
- [ ] Rate limiting
- [ ] File upload for test cases
- [ ] Contest mode
- [ ] Discussion forum
- [ ] Email notifications
- [ ] Admin dashboard
- [ ] Analytics & insights

## Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## License

MIT

## Support

For issues and questions:
- Create GitHub issue
- Email: support@codelearn.com

---

**Built with ❤️ for CodeLearn**
