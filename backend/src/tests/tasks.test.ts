import request from 'supertest';
import mongoose from 'mongoose';
import app from '../index';
import User from '../models/userModel';
import Task, { TaskStatus } from '../models/taskModel';
import { connectDB, disconnectDB } from '../config/db';

// Test user data
const testUser = {
  name: 'Test User',
  email: 'test@example.com',
  password: 'password123',
};

// Test task data
const testTask = {
  title: 'Test Task',
  description: 'This is a test task',
};

let userId: string;
let taskId: string;
let token: string;

// Connect to test database before tests
beforeAll(async () => {
  // Use a test database
  process.env.MONGODB_URI = 'mongodb://localhost:27017/task-management-test';
  await connectDB();
  
  // Clear test database
  await User.deleteMany({});
  await Task.deleteMany({});
  
  // Create test user
  const response = await request(app)
    .post('/api/users')
    .send(testUser);
    
  userId = response.body._id;
  token = response.body.token;
});

// Disconnect after tests
afterAll(async () => {
  await User.deleteMany({});
  await Task.deleteMany({});
  await disconnectDB();
});

describe('Task API', () => {
  test('Should create a new task', async () => {
    const response = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({
        ...testTask,
        userId,
      });
      
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('_id');
    expect(response.body.title).toBe(testTask.title);
    expect(response.body.description).toBe(testTask.description);
    expect(response.body.status).toBe(TaskStatus.PENDING);
    
    taskId = response.body._id;
  });
  
  test('Should get all tasks for a user', async () => {
    const response = await request(app)
      .get(`/api/tasks?userId=${userId}`)
      .set('Authorization', `Bearer ${token}`);
      
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(1);
    expect(response.body[0].title).toBe(testTask.title);
  });
  
  test('Should update task status', async () => {
    const response = await request(app)
      .patch(`/api/tasks/${taskId}/status`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        status: TaskStatus.IN_PROGRESS,
      });
      
    expect(response.status).toBe(200);
    expect(response.body.status).toBe(TaskStatus.IN_PROGRESS);
    
    // Update to done
    const doneResponse = await request(app)
      .patch(`/api/tasks/${taskId}/status`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        status: TaskStatus.DONE,
      });
      
    expect(doneResponse.status).toBe(200);
    expect(doneResponse.body.status).toBe(TaskStatus.DONE);
    expect(doneResponse.body).toHaveProperty('completedAt');
  });
  
  test('Should delete a task', async () => {
    const response = await request(app)
      .delete(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${token}`);
      
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Task deleted successfully');
    
    // Verify task is deleted
    const tasksResponse = await request(app)
      .get(`/api/tasks?userId=${userId}`)
      .set('Authorization', `Bearer ${token}`);
      
    expect(tasksResponse.body.length).toBe(0);
  });
});