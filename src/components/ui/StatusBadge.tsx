import React from 'react';
import { KPIStatus } from '../../types';
import { Badge } from './Badge';

interface StatusBadgeProps {
  status: KPIStatus | 'active' | 'inactive' | 'pending' | 'completed' | 'paid' | 'due' | 'overdue';
  children?: React.ReactNode;
}

export function StatusBadge({ status, children }: StatusBadgeProps) {
  const statusMap: Record<string, { variant: 'success' | 'warning' | 'danger' | 'info' | 'gray'; label: string }> = {
    GREEN: { variant: 'success', label: 'On Track' },
    YELLOW: { variant: 'warning', label: 'Needs Attention' },
    RED: { variant: 'danger', label: 'Off Track' },
    active: { variant: 'success', label: 'Active' },
    inactive: { variant: 'gray', label: 'Inactive' },
    pending: { variant: 'warning', label: 'Pending' },
    completed: { variant: 'success', label: 'Completed' },
    paid: { variant: 'success', label: 'Paid' },
    due: { variant: 'warning', label: 'Due' },
    overdue: { variant: 'danger', label: 'Overdue' },
  };

  const config = statusMap[status] || { variant: 'gray', label: status };

  return <Badge variant={config.variant}>{children || config.label}</Badge>;
}
