import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import Task, { TaskStatus } from '../models/taskModel';
import User from '../models/userModel';
import mongoose from 'mongoose';

/**
 * @swagger
 * /api/tasks:
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - userId
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               userId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Task created successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: User not found
 *       409:
 *         description: Task with this title already exists for this user
 */
export const createTask = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("Req body : ",req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { title, description, userId } = req.body;

    // Validate user exists
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Check for duplicate task
    const existingTask = await Task.findOne({ title, user: userId });
    if (existingTask) {
      res.status(409).json({ message: 'Task with this title already exists for this user' });
      return;
    }

    // Create task
    const task = await Task.create({
      title,
      description,
      user: userId,
      status: TaskStatus.PENDING,
    });

    res.status(201).json(task);
  } catch (error) {
    console.error('Create task error:', error);
    if (error instanceof mongoose.Error.ValidationError) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Server error' });
    }
  }
};

/**
 * @swagger
 * /api/tasks:
 *   get:
 *     summary: Get all tasks for a user
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: Tasks retrieved successfully
 *       400:
 *         description: Invalid input
 */
export const getTasks = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.query;

    if (!userId) {
      res.status(400).json({ message: 'User ID is required' });
      return;
    }

    const tasks = await Task.find({ user: userId }).sort({ createdAt: -1 });

    res.status(200).json(tasks);
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @swagger
 * /api/tasks/{id}/status:
 *   patch:
 *     summary: Update task status
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Task ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, in-progress, done]
 *     responses:
 *       200:
 *         description: Task status updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Task not found
 */
export const updateTaskStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { id } = req.params;
    const { status } = req.body;

    // Find task
    const task = await Task.findById(id);
    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }

    // Update status
    task.status = status;

    // If task is marked as done, set completedAt timestamp
    if (status === TaskStatus.DONE && !task.completedAt) {
      task.completedAt = new Date();
    } else if (status !== TaskStatus.DONE) {
      // If task is moved back from done, clear completedAt
      task.completedAt = undefined;
    }

    await task.save();

    res.status(200).json(task);
  } catch (error) {
    console.error('Update task status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @swagger
 * /api/tasks/{id}:
 *   delete:
 *     summary: Delete a task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Task ID
 *     responses:
 *       200:
 *         description: Task deleted successfully
 *       404:
 *         description: Task not found
 */
export const deleteTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Find and delete task
    const task = await Task.findByIdAndDelete(id);
    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};