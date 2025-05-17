import express from 'express';
import { body, param } from 'express-validator';
import { createTask, getTasks, updateTaskStatus, deleteTask } from '../controllers/taskController';
import { protect } from '../middleware/authMiddleware';
import { TaskStatus } from '../models/taskModel';

const router = express.Router();

// // Apply authentication middleware to all routes
// router.use(protect);

// // Create task
router.post(
  '/',
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('userId').notEmpty().withMessage('User ID is required'),
  ],
  createTask
);

// // Get all tasks for a user
router.get('/', getTasks);

// // Update task status
router.patch(
  '/:id/status',
  [
    param('id').notEmpty().withMessage('Task ID is required'),
    body('status')
      .isIn(Object.values(TaskStatus))
      .withMessage(`Status must be one of: ${Object.values(TaskStatus).join(', ')}`),
  ],
  updateTaskStatus
);

// // Delete task
router.delete('/:id', param('id').notEmpty().withMessage('Task ID is required'), deleteTask);

export default router;