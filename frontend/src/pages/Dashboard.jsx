import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserTasks } from '../services/taskService';
import { toast } from 'react-toastify';
import { Plus, AlertTriangle, Loader } from 'lucide-react';
import TaskItem from '../components/TaskItem';
import TaskForm from '../components/TaskForm';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTaskForm, setShowTaskForm] = useState(false);
  
  // Fetch tasks on component mount
  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      const result = await getUserTasks(user._id);
      
      if (result.success) {
        setTasks(result.data);
      } else {
        toast.error(result.message);
      }
      
      setLoading(false);
    };
    
    fetchTasks();
  }, [user._id]);
  
  // Handle task click
  const handleTaskClick = (task) => {
    navigate(`/tasks/${task._id}`, { state: { task } });
  };
  
  // Handle task added
  const handleTaskAdded = (newTask) => {
    setTasks([newTask, ...tasks]);
  };
  
  return (
    <div className="container mx-auto">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage your tasks and stay organized</p>
        </div>
        
        <button
          className="btn btn-primary flex items-center mt-4 md:mt-0"
          onClick={() => setShowTaskForm(true)}
        >
          <Plus size={20} className="mr-1" />
          New Task
        </button>
      </div>
      
      {showTaskForm && (
        <div className="mb-6">
          <TaskForm
            onTaskAdded={handleTaskAdded}
            onClose={() => setShowTaskForm(false)}
          />
        </div>
      )}
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader className="animate-spin h-8 w-8 text-blue-600" />
        </div>
      ) : tasks.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mb-4">
            <AlertTriangle size={32} />
          </div>
          <h2 className="text-xl font-medium text-gray-900 mb-2">No tasks found</h2>
          <p className="text-gray-600 mb-4">You don't have any tasks yet. Create your first task to get started!</p>
          <button
            className="btn btn-primary"
            onClick={() => setShowTaskForm(true)}
          >
            Create Task
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task) => (
            <TaskItem
              key={task._id}
              task={task}
              onClick={handleTaskClick}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;