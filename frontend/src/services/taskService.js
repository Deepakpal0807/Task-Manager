import api from './api';

// Get all tasks for a user
export const getUserTasks = async (userId) => {
  try {
    const { data } = await api.get(`/tasks?userId=${userId}`);
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch tasks',
    };
  }
};

// Create a new task
export const createTask = async (taskData) => {
  try {
    const { data } = await api.post('/tasks', taskData);
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to create task',
    };
  }
};

// Update task status
export const updateTaskStatus = async (taskId, status) => {
  try {
    const { data } = await api.patch(`/tasks/${taskId}/status`, { status });
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to update task status',
    };
  }
};

// Delete a task
export const deleteTask = async (taskId) => {
  try {
    await api.delete(`/tasks/${taskId}`);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to delete task',
    };
  }
};