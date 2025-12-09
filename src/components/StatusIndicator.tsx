import React from 'react';
import type { Status } from '../types';

interface StatusIndicatorProps {
  status: Status;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  const statusClasses = {
    GREEN: 'bg-green-100 text-green-800 border-green-300',
    YELLOW: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    RED: 'bg-red-100 text-red-800 border-red-300',
  };

  const statusLabels = {
    GREEN: 'On Track',
    YELLOW: 'At Risk',
    RED: 'Critical',
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border ${sizeClasses[size]} ${statusClasses[status]}`}
    >
      <span className={`w-2 h-2 rounded-full mr-1.5 ${
        status === 'GREEN' ? 'bg-green-500' :
        status === 'YELLOW' ? 'bg-yellow-500' :
        'bg-red-500'
      }`} />
      {statusLabels[status]}
    </span>
  );
};
