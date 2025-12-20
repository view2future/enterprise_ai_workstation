import React from 'react';

interface NeubrutalButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning';
  size?: 'sm' | 'md' | 'lg';
}

export const NeubrutalButton: React.FC<NeubrutalButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  className = '',
  ...props 
}) => {
  const baseClasses = 'font-bold transition-all duration-150 active:translate-x-1 active:translate-y-1';
  
  const variantClasses = {
    primary: 'bg-gray-800 text-white border-4 border-gray-800 hover:bg-gray-700',
    secondary: 'bg-white text-gray-800 border-4 border-gray-800 hover:bg-gray-100',
    success: 'bg-green-600 text-white border-4 border-green-800 hover:bg-green-700',
    danger: 'bg-red-600 text-white border-4 border-red-800 hover:bg-red-700',
    warning: 'bg-yellow-500 text-gray-900 border-4 border-yellow-700 hover:bg-yellow-600',
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };
  
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;
  
  return (
    <button
      className={classes}
      style={{
        boxShadow: '6px 6px 0px 0px rgba(0, 0, 0, 1)',
      }}
      {...props}
    >
      {children}
    </button>
  );
};

interface NeubrutalCardProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: 'sm' | 'md' | 'lg';
}

export const NeubrutalCard: React.FC<NeubrutalCardProps> = ({ 
  children, 
  padding = 'md',
  className = '',
  ...props 
}) => {
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };
  
  const classes = `bg-white border-4 border-gray-800 ${paddingClasses[padding]} ${className}`;
  
  return (
    <div
      className={classes}
      style={{
        boxShadow: '8px 8px 0px 0px rgba(0, 0, 0, 1)',
      }}
      {...props}
    >
      {children}
    </div>
  );
};

interface NeubrutalInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const NeubrutalInput: React.FC<NeubrutalInputProps> = ({
  label,
  error,
  icon,
  className = '',
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          className={`w-full border-4 border-gray-800 bg-white pl-10 pr-3 py-2 font-sans text-base font-normal transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
          style={{
            boxShadow: '4px 4px 0px 0px rgba(0, 0, 0, 1)',
          }}
          {...props}
        />
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
            {icon}
          </div>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

interface NeubrutalSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

export const NeubrutalSelect: React.FC<NeubrutalSelectProps> = ({ 
  label,
  error,
  children,
  className = '',
  ...props 
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <select
        className={`w-full border-4 border-gray-800 bg-white px-3 py-2 font-sans text-base font-normal transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none ${className}`}
        style={{
          boxShadow: '4px 4px 0px 0px rgba(0, 0, 0, 1)',
        }}
        {...props}
      >
        {children}
      </select>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

interface NeubrutalTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const NeubrutalTextarea: React.FC<NeubrutalTextareaProps> = ({ 
  label,
  error,
  className = '',
  ...props 
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <textarea
        className={`w-full border-4 border-gray-800 bg-white px-3 py-2 font-sans text-base font-normal transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
        style={{
          boxShadow: '4px 4px 0px 0px rgba(0, 0, 0, 1)',
        }}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};