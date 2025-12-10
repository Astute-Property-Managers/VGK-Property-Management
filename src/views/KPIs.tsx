import React, { useEffect, useState } from 'react';
import { Header } from '../components/layout/Header';
import { Card } from '../components/ui/Card';
import { StatusBadge } from '../components/ui/StatusBadge';
import { dataService } from '../services/data.service';
import { KPI } from '../types';
import { formatDate } from '../utils/formatting';

export function KPIs() {
  const [kpis, setKPIs] = useState<KPI[]>([]);

  useEffect(() => {
    setKPIs(dataService.getAllKPIs());
  }, []);

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    if (trend === 'up') {
      return (
        <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      );
    } else if (trend === 'down') {
      return (
        <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
        </svg>
      );
    }
    return (
      <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
      </svg>
    );
  };

  return (
    <div>
      <Header
        title="Key Performance Indicators"
        subtitle="Monitor the metrics that matter most to your business"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {kpis.map((kpi) => (
            <Card key={kpi.id}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{kpi.name}</h3>
                  <p className="text-sm text-gray-500 capitalize">{kpi.category} · {kpi.frequency}</p>
                </div>
                <StatusBadge status={kpi.status} />
              </div>

              <div className="flex items-end justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-600">Current</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {kpi.currentValue.toFixed(1)} {kpi.unit}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Target</p>
                  <p className="text-2xl font-semibold text-gray-700">
                    {kpi.targetValue.toFixed(1)} {kpi.unit}
                  </p>
                </div>
                <div className="flex items-center">
                  {getTrendIcon(kpi.trend)}
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-600">Progress to Target</span>
                  <span className="font-medium">
                    {((kpi.currentValue / kpi.targetValue) * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      kpi.status === 'GREEN' ? 'bg-green-600' :
                      kpi.status === 'YELLOW' ? 'bg-yellow-500' : 'bg-red-600'
                    }`}
                    style={{ width: `${Math.min((kpi.currentValue / kpi.targetValue) * 100, 100)}%` }}
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500">Last updated: {formatDate(kpi.lastUpdated)}</p>
              </div>
            </Card>
          ))}
        </div>

        {kpis.length === 0 && (
          <Card>
            <div className="text-center py-12">
              <p className="text-gray-500">No KPIs configured. KPIs are loaded from the initial data.</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
