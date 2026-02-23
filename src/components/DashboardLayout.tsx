import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

export const DashboardLayout: React.FC = () => {
  const location = useLocation();

  const getTitleFromPath = (): string => {
    const path = location.pathname;
    const titles: Record<string, string> = {
      '/': 'Dashboard Overview',
      '/opsp': 'One Page Strategic Plan',
      '/rocks': 'Quarterly Rocks',
      '/kpis': 'Key Performance Indicators',
      '/critical-numbers': 'Critical Numbers',
      '/huddles': 'Daily & Weekly Huddles',
      '/properties': 'Property Portfolio',
      '/tenants': 'Tenant Management',
      '/tenant-screening': 'Tenant Screening',
      '/lease-renewals': 'Lease Renewals',
      '/move-in-move-out': 'Move-In / Move-Out',
      '/maintenance': 'Maintenance Requests',
      '/vendors': 'Vendor Management',
      '/cashflow': 'Cashflow Forecasting',
      '/chart-of-accounts': 'Chart of Accounts',
      '/ledger': 'Transaction Ledger',
      '/financial-overview': 'Financial Overview',
      '/owner-statements': 'Owner Statements',
      '/analytics-8020': '80/20 Analytics',
    };

    return titles[path] || 'Altus';
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title={getTitleFromPath()} />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
