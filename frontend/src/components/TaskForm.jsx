import React, { useState } from 'react';
import { createTask } from '../services/taskService';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { X } from 'lucide-react';

const TaskForm = ({ onTaskAdded, onClose }) => {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error('Task title is required');
      return;
    }
    
    setLoading(true);
    
    const result = await createTask({
      title,
      description,
      userId: user._id,
    });
    
    setLoading(false);
    
    if (result.success) {
      toast.success('Task created successfully');
      setTitle('');
      setDescription('');
      onTaskAdded(result.data);
      onClose();
    } else {
      toast.error(result.message);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 slide-up">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Create New Task</h3>
        <button 
          onClick={onClose}
          className="p-1 rounded-full hover:bg-gray-100"
        >
          <X size={20} className="text-gray-500" />
        </button>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="title" className="form-label">Title</label>
          <input
            type="text"
            id="title"
            className="form-input"
            placeholder="Enter task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="description" className="form-label">Description</label>
          <textarea
            id="description"
            className="form-input min-h-[100px]"
            placeholder="Enter task description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>
        
        <div className="flex justify-end gap-2">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating...
              </span>
            ) : 'Create Task'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;