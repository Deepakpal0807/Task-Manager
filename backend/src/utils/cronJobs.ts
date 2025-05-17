import cron from 'node-cron';
import Task, { TaskStatus } from '../models/taskModel';

// Helper function to close tasks that have been in-progress for more than 2 hours
const closeInProgressTasks = async (): Promise<void> => {
  try {
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
    
    // Find tasks that are in-progress and were updated more than 2 hours ago
    const tasks = await Task.find({
      status: TaskStatus.IN_PROGRESS,
      updatedAt: { $lt: twoHoursAgo },
    });
    
    console.log(`Found ${tasks.length} in-progress tasks to auto-close`);
    
    // Update tasks to done status with completedAt timestamp
    for (const task of tasks) {
      task.status = TaskStatus.DONE;
      task.completedAt = new Date();
      await task.save();
      console.log(`Auto-closed task: ${task.title}`);
    }
  } catch (error) {
    console.error('Error in auto-closing tasks:', error);
  }
};

// Schedule the cron job to run every 15 minutes
export const startCronJobs = (): void => {
  cron.schedule('*/15 * * * *', async () => {
    console.log('Running scheduled task: Auto-close in-progress tasks');
    await closeInProgressTasks();
  });
  
  console.log('Scheduled tasks started');
};