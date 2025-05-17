import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { updateTaskStatus, deleteTask } from '../services/taskService';
import { toast } from 'react-toastify';
import { ArrowLeft, Calendar, Clock, Trash } from 'lucide-react';
import { TaskStatus } from '../utils/constants';

const TaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [task, setTask] = useState(location.state?.task || null);
  const [loading, setLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  
  // Handle status change
  const handleStatusChange = async (newStatus) => {
    if (task.status === newStatus) return;
    
    setLoading(true);
    const result = await updateTaskStatus(id, newStatus);
    setLoading(false);
    
    if (result.success) {
      setTask(result.data);
      toast.success(`Task status updated to ${newStatus}`);
    } else {
      toast.error(result.message);
    }
  };
  
  // Handle delete
  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    
    setLoading(true);
    const result = await deleteTask(id);
    setLoading(false);
    
    if (result.success) {
      toast.success('Task deleted successfully');
      navigate('/');
    } else {
      toast.error(result.message);
      setConfirmDelete(false);
    }
  };
  
  // Reset confirm delete after 5 seconds
  useEffect(() => {
    if (confirmDelete) {
      const timer = setTimeout(() => {
        setConfirmDelete(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [confirmDelete]);
  
  if (!task) {
    return (
      <div className="text-center py-12">
        <p>Task not found</p>
        <button
          className="btn btn-primary mt-4"
          onClick={() => navigate('/')}
        >
          Back to Dashboard
        </button>
      </div>
    );
  }
  
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6 flex items-center">
        <button
          className="flex items-center text-gray-600 hover:text-gray-900"
          onClick={() => navigate('/')}
        >
          <ArrowLeft size={20} className="mr-1" />
          Back to Dashboard
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="border-b pb-4 mb-4">
          <h1 className="text-2xl font-semibold text-gray-900">{task.title}</h1>
          
          <div className="flex flex-wrap gap-4 mt-2">
            <div className="flex items-center text-gray-600">
              <Calendar size={18} className="mr-1" />
              <span>Created: {formatDate(task.createdAt)}</span>
            </div>
            
            {task.completedAt && (
              <div className="flex items-center text-gray-600">
                <Clock size={18} className="mr-1" />
                <span>Completed: {formatDate(task.completedAt)}</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Description</h3>
          <p className="text-gray-700 whitespace-pre-line">
            {task.description || 'No description provided'}
          </p>
        </div>
        
        <div className="border-t pt-4">
          <h3 className="text-lg font-medium mb-4">Status</h3>
          
          <div className="flex flex-wrap gap-2">
            <button
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                task.status === TaskStatus.PENDING
                  ? 'bg-amber-500 text-white'
                  : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
              }`}
              onClick={() => handleStatusChange(TaskStatus.PENDING)}
              disabled={loading || task.status === TaskStatus.PENDING}
            >
              Pending
            </button>
            
            <button
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                task.status === TaskStatus.IN_PROGRESS
                  ? 'bg-blue-500 text-white'
                  : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
              }`}
              onClick={() => handleStatusChange(TaskStatus.IN_PROGRESS)}
              disabled={loading || task.status === TaskStatus.IN_PROGRESS}
            >
              In Progress
            </button>
            
            <button
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                task.status === TaskStatus.DONE
                  ? 'bg-green-500 text-white'
                  : 'bg-green-100 text-green-800 hover:bg-green-200'
              }`}
              onClick={() => handleStatusChange(TaskStatus.DONE)}
              disabled={loading || task.status === TaskStatus.DONE}
            >
              Completed
            </button>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-medium text-red-600 mb-4">Danger Zone</h3>
        
        <button
          className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all ${
            confirmDelete
              ? 'bg-red-500 text-white'
              : 'border border-red-500 text-red-500 hover:bg-red-50'
          }`}
          onClick={handleDelete}
          disabled={loading}
        >
          <Trash size={18} className="mr-2" />
          {confirmDelete ? 'Confirm Delete' : 'Delete Task'}
        </button>
        
        {confirmDelete && (
          <p className="text-sm text-gray-600 mt-2">
            Click again to confirm. This action cannot be undone.
          </p>
        )}
      </div>
    </div>
  );
};

export default TaskDetails;