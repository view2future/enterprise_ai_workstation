import React from 'react';
import { Clock, User, Flag, CheckCircle, Circle, PlayCircle } from 'lucide-react';
import { Task } from '../types';

interface TaskCardProps {
  task: Task;
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  // Function to get status badge class
  const getStatusClass = (status: string) => {
    switch(status) {
      case 'todo':
        return 'bg-yellow-100 text-yellow-800 neubrutalism-badge';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 neubrutalism-badge';
      case 'done':
        return 'bg-green-100 text-green-800 neubrutalism-badge';
      default:
        return 'bg-gray-100 text-gray-800 neubrutalism-badge';
    }
  };

  // Function to get priority badge class
  const getPriorityClass = (priority: string) => {
    switch(priority) {
      case 'high':
        return 'bg-red-100 text-red-800 neubrutalism-badge';
      case 'medium':
        return 'bg-orange-100 text-orange-800 neubrutalism-badge';
      case 'low':
        return 'bg-green-100 text-green-800 neubrutalism-badge';
      default:
        return 'bg-gray-100 text-gray-800 neubrutalism-badge';
    }
  };

  // Function to get status icon
  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'todo':
        return <Circle size={16} className="text-yellow-500" />;
      case 'in-progress':
        return <PlayCircle size={16} className="text-blue-500" />;
      case 'done':
        return <CheckCircle size={16} className="text-green-500" />;
      default:
        return <Circle size={16} className="text-gray-500" />;
    }
  };

  // Format status for display
  const formatStatus = (status: string) => {
    switch(status) {
      case 'todo': return '待办';
      case 'in-progress': return '进行中';
      case 'done': return '已完成';
      default: return status;
    }
  };

  // Format priority for display
  const formatPriority = (priority: string) => {
    switch(priority) {
      case 'high': return '高优先级';
      case 'medium': return '中优先级';
      case 'low': return '低优先级';
      default: return priority;
    }
  };

  return (
    <div className="neubrutalism-card">
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-bold text-lg">{task.title}</h4>
        <span className={`${getStatusClass(task.status)} text-xs`}>
          {formatStatus(task.status)}
        </span>
      </div>
      <p className="text-sm text-gray-600 mb-3">{task.description}</p>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Flag size={12} />
            <span className={`${getPriorityClass(task.priority)} text-xs`}>
              {formatPriority(task.priority)}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Clock size={12} />
          <span>截止: {new Date(task.dueDate).toLocaleDateString('zh-CN')}</span>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;