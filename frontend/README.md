# Learning Management Backend API

Backend API for the Learning Management educational platform.

## 🚀 Status

**Currently Empty** - This backend is a basic Express server setup. All business logic, routes, and database integration will be implemented later.

## 🛠️ Current Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **CORS**: Cross-origin resource sharing
- **Environment**: dotenv for configuration

## 📁 Project Structure

```
backend/
├── server.js        # Basic Express server
├── package.json     # Dependencies
└── README.md        # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)

### Installation

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the server:**
   ```bash
   # Development mode with auto-restart
   npm run dev

   # Production mode
   npm start
   ```

The server will start on `http://localhost:5001`.

## 📚 Current API Endpoints

### Health Check
- `GET /api/health` - Server status check
- `GET /api` - Basic API info

All other endpoints will be implemented later.

## 🔄 Future Development

The backend will eventually include:

- **Authentication & Authorization** (JWT)
- **User Management**
- **Database Integration** (MongoDB)
- **API Routes** for content, progress, achievements
- **Security Features** (rate limiting, validation)
- **Caching** (Redis)
- **File Upload** capabilities

## 🤝 Contributing

When implementing the backend:

1. Follow RESTful API conventions
2. Implement proper error handling
3. Add input validation
4. Write unit tests
5. Document all endpoints

## 📄 License

This project is licensed under the MIT License.
