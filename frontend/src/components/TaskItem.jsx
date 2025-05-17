import React from 'react';
import { Calendar, Clock } from 'lucide-react';
import { TaskStatus } from '../utils/constants';

const TaskItem = ({ task, onClick }) => {
  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  
  // Get status label and style
  const getStatusInfo = (status) => {
    switch (status) {
      case TaskStatus.PENDING:
        return {
          className: 'bg-amber-100 text-amber-800',
          label: 'Pending'
        };
      case TaskStatus.IN_PROGRESS:
        return {
          className: 'bg-blue-100 text-blue-800',
          label: 'In Progress'
        };
      case TaskStatus.DONE:
        return {
          className: 'bg-green-100 text-green-800',
          label: 'Completed'
        };
      default:
        return {
          className: 'bg-gray-100 text-gray-800',
          label: 'Unknown'
        };
    }
  };
  
  const statusInfo = getStatusInfo(task.status);
  
  return (
    <div 
      className={`task-card ${
        task.status === TaskStatus.PENDING 
          ? 'task-pending' 
          : task.status === TaskStatus.IN_PROGRESS 
            ? 'task-in-progress' 
            : 'task-done'
      }`}
      onClick={() => onClick(task)}
    >
      <h3 className="text-lg font-medium mb-2">{task.title}</h3>
      
      {task.description && (
        <p className="text-gray-600 mb-3 line-clamp-2">{task.description}</p>
      )}
      
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="flex items-center text-gray-500 text-sm">
            <Calendar size={16} className="mr-1" />
            <span>{formatDate(task.createdAt)}</span>
          </div>
          
          {task.completedAt && (
            <div className="flex items-center text-gray-500 text-sm">
              <Clock size={16} className="mr-1" />
              <span>Completed: {formatDate(task.completedAt)}</span>
            </div>
          )}
        </div>
        
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.className}`}>
          {statusInfo.label}
        </span>
      </div>
    </div>
  );
};

export default TaskItem;