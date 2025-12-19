import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: string;
  changeType?: 'positive' | 'negative';
  color?: 'blue' | 'green' | 'purple' | 'yellow' | 'red';
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon, 
  change, 
  changeType = 'positive',
  color = 'blue' 
}) => {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-800",
    green: "bg-green-100 text-green-800",
    purple: "bg-purple-100 text-purple-800",
    yellow: "bg-yellow-100 text-yellow-800",
    red: "bg-red-100 text-red-800"
  };

  return (
    <div className="neubrutalism-stat-card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-base font-bold text-gray-600">{title}</p>
          <p className="text-3xl font-bold mt-1">{value}</p>
        </div>
        <div className={`p-4 rounded-lg ${colorClasses[color]}`}>
          <div className="w-8 h-8 flex items-center justify-center">
            {icon}
          </div>
        </div>
      </div>
      {change && (
        <p className="text-sm text-gray-500 mt-2">
          <span className={`inline-flex items-center ${changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
            {changeType === 'positive' ? <TrendingUp size={16} className="mr-1" /> : <TrendingDown size={16} className="mr-1" />}
            {change} vs 上月
          </span>
        </p>
      )}
    </div>
  );
};

export default StatCard;