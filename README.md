# Task Management System

A full-stack task management application built with Express, React, and MongoDB.

## Features

- User registration and authentication with JWT
- Create, view, update, and delete tasks
- Task status management (pending, in-progress, done)
- Automatic timestamps for completed tasks
- Scheduled job to auto-close lingering tasks
- Responsive design for all devices
- API documentation with Swagger

## Technology Stack

### Backend
- Express.js with TypeScript
- MongoDB with Mongoose
- JWT authentication
- Node-cron for scheduled tasks
- API validation with Express Validator
- Swagger API documentation

### Frontend
- React.js
- React Router for navigation
- Context API for state management
- Tailwind CSS for styling
- Axios for API requests
- Lucide React for icons

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm run setup
   ```

3. Create a `.env` file in the backend directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/task-management
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRES_IN=7d
   ```

4. Start the development servers:
   ```
   npm run dev
   ```

## API Documentation

Once the backend server is running, you can access the API documentation at:
```
http://localhost:5000/api-docs
```

## API Endpoints

### Users
- POST /api/users - Register a user
- POST /api/users/login - Login user
- GET /api/users/profile - Get user profile (protected)

### Tasks
- POST /api/tasks - Create a task
- GET /api/tasks?userId= - Get all tasks for a user
- PATCH /api/tasks/:id/status - Update task status
- DELETE /api/tasks/:id - Delete a task

