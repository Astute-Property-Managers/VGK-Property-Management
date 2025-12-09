import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { StatusIndicator } from '../components/StatusIndicator';
import { getRocks, getKPIs, getCriticalNumbers, getProperties, getTenants, getMaintenanceRequests } from '../services/dataService';
import type { Rock, KPI, CriticalNumber } from '../types';
import { APP_NAME } from '../constants';

export const DashboardOverview: React.FC = () => {
  const [rocks, setRocks] = useState<Rock[]>([]);
  const [kpis, setKPIs] = useState<KPI[]>([]);
  const [criticalNumbers, setCriticalNumbers] = useState<CriticalNumber[]>([]);
  const [stats, setStats] = useState({
    totalProperties: 0,
    totalUnits: 0,
    occupancyRate: 0,
    totalTenants: 0,
    overdueCount: 0,
    pendingMaintenance: 0,
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = () => {
    const rocksData = getRocks();
    const kpisData = getKPIs();
    const cnData = getCriticalNumbers();
    const properties = getProperties();
    const tenants = getTenants();
    const maintenance = getMaintenanceRequests();

    setRocks(rocksData);
    setKPIs(kpisData);
    setCriticalNumbers(cnData);

    const totalUnits = properties.reduce((sum, p) => sum + p.totalUnits, 0);
    const occupiedUnits = properties.reduce((sum, p) => sum + p.occupiedUnits, 0);
    const occupancyRate = totalUnits > 0 ? (occupiedUnits / totalUnits) * 100 : 0;

    setStats({
      totalProperties: properties.length,
      totalUnits,
      occupancyRate,
      totalTenants: tenants.length,
      overdueCount: tenants.filter(t => t.paymentStatus === 'Overdue').length,
      pendingMaintenance: maintenance.filter(m => m.status === 'Pending' || m.status === 'Assigned').length,
    });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-lg shadow-lg p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome to {APP_NAME}</h1>
        <p className="text-indigo-100 text-lg">
          Strategic Property Management for Uganda - Integrating Scaling Up, Lean Finance & IFRS Compliance
        </p>
        <p className="text-indigo-200 text-sm mt-4">
          Focus on the vital 20% that drives 80% of your results (Pareto Principle)
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Properties"
          value={stats.totalProperties}
          subtitle={`${stats.totalUnits} total units`}
          link="/properties"
          icon="🏢"
        />
        <StatCard
          title="Occupancy Rate"
          value={`${stats.occupancyRate.toFixed(1)}%`}
          subtitle={`${stats.totalTenants} tenants`}
          link="/tenants"
          icon="👥"
        />
        <StatCard
          title="Overdue Payments"
          value={stats.overdueCount}
          subtitle="Requires attention"
          link="/tenants"
          icon="⚠️"
          alert={stats.overdueCount > 0}
        />
        <StatCard
          title="Maintenance"
          value={stats.pendingMaintenance}
          subtitle="Pending requests"
          link="/maintenance"
          icon="🔧"
        />
      </div>

      {/* Rocks & KPIs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rocks */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Quarterly Rocks</h2>
            <Link to="/rocks" className="text-sm text-indigo-600 hover:text-indigo-800">
              View All →
            </Link>
          </div>
          <div className="space-y-3">
            {rocks.slice(0, 3).map(rock => (
              <div key={rock.id} className="border-l-4 border-indigo-500 pl-4 py-2">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-medium text-gray-900">{rock.title}</h3>
                  <StatusIndicator status={rock.status} size="sm" />
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>{rock.owner}</span>
                  <span>•</span>
                  <span>{rock.progress}% complete</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* KPIs */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Key Performance Indicators</h2>
            <Link to="/kpis" className="text-sm text-indigo-600 hover:text-indigo-800">
              View All →
            </Link>
          </div>
          <div className="space-y-3">
            {kpis.slice(0, 3).map(kpi => (
              <div key={kpi.id} className="flex items-center justify-between py-2">
                <div>
                  <h3 className="font-medium text-gray-900">{kpi.name}</h3>
                  <p className="text-sm text-gray-600">
                    {kpi.currentValue} / {kpi.targetValue} {kpi.unit}
                  </p>
                </div>
                <StatusIndicator status={kpi.status} size="sm" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Critical Numbers */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Critical Numbers</h2>
          <Link to="/critical-numbers" className="text-sm text-indigo-600 hover:text-indigo-800">
            View All →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {criticalNumbers.map(cn => (
            <div key={cn.id} className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-600 mb-2">{cn.name}</h3>
              <p className="text-2xl font-bold text-gray-900 mb-1">
                {cn.unit === 'UGX' ? `UGX ${cn.currentValue.toLocaleString()}` : `${cn.currentValue}${cn.unit}`}
              </p>
              <p className="text-xs text-gray-500">
                Target: {cn.unit === 'UGX' ? `UGX ${cn.targetValue.toLocaleString()}` : `${cn.targetValue}${cn.unit}`}
              </p>
              <div className="mt-2">
                <StatusIndicator status={cn.status} size="sm" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <QuickActionButton to="/tenants" label="Record Payment" icon="💰" />
          <QuickActionButton to="/maintenance" label="Log Maintenance" icon="🔧" />
          <QuickActionButton to="/properties" label="Add Property" icon="🏢" />
          <QuickActionButton to="/cashflow" label="View Cashflow" icon="📊" />
        </div>
      </div>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  link: string;
  icon: string;
  alert?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, subtitle, link, icon, alert }) => (
  <Link to={link} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
    <div className="flex items-center justify-between mb-2">
      <span className="text-2xl">{icon}</span>
      {alert && <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />}
    </div>
    <h3 className="text-sm font-medium text-gray-600 mb-1">{title}</h3>
    <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
    <p className="text-sm text-gray-500">{subtitle}</p>
  </Link>
);

interface QuickActionButtonProps {
  to: string;
  label: string;
  icon: string;
}

const QuickActionButton: React.FC<QuickActionButtonProps> = ({ to, label, icon }) => (
  <Link
    to={to}
    className="flex flex-col items-center justify-center p-4 border-2 border-gray-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-all"
  >
    <span className="text-3xl mb-2">{icon}</span>
    <span className="text-sm font-medium text-gray-700">{label}</span>
  </Link>
);
