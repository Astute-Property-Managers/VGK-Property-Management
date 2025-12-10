import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { Card } from '../components/ui/Card';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Badge } from '../components/ui/Badge';
import { dataService } from '../services/data.service';
import { formatCurrency, formatPercentage } from '../utils/formatting';
import { aggregatePortfolioMetrics } from '../utils/calculations';
import { Property, KPI, Rock, CriticalNumber } from '../types';

export function Dashboard() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [kpis, setKPIs] = useState<KPI[]>([]);
  const [rocks, setRocks] = useState<Rock[]>([]);
  const [criticalNumbers, setCriticalNumbers] = useState<CriticalNumber[]>([]);

  useEffect(() => {
    setProperties(dataService.getAllProperties());
    setKPIs(dataService.getAllKPIs());
    setRocks(dataService.getAllRocks());
    setCriticalNumbers(dataService.getAllCriticalNumbers());
  }, []);

  const portfolioMetrics = aggregatePortfolioMetrics(properties);

  return (
    <div>
      <Header
        title="Dashboard"
        subtitle="Welcome to VGK Property Command - Your strategic property management platform"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Properties</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">{portfolioMetrics.totalProperties}</p>
              </div>
              <div className="p-3 bg-indigo-100 rounded-lg">
                <svg className="w-8 h-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            </div>
            <Link to="/properties" className="mt-4 text-sm text-indigo-600 hover:text-indigo-800">
              View all properties →
            </Link>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Occupancy Rate</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {formatPercentage(portfolioMetrics.overallOccupancyRate)}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              {portfolioMetrics.occupiedUnits} of {portfolioMetrics.totalUnits} units occupied
            </p>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Monthly Income</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {formatCurrency(portfolioMetrics.totalMonthlyIncome)}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <Link to="/cashflow" className="mt-4 text-sm text-indigo-600 hover:text-indigo-800">
              View cashflow →
            </Link>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Portfolio NOI</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {formatCurrency(portfolioMetrics.portfolioNOI)}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <svg className="w-8 h-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
            <p className="mt-2 text-sm text-gray-500">Net Operating Income</p>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Quarterly Rocks */}
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Quarterly Rocks</h2>
              <Link to="/rocks" className="text-sm text-indigo-600 hover:text-indigo-800">
                View all
              </Link>
            </div>
            <div className="space-y-4">
              {rocks.slice(0, 3).map((rock) => (
                <div key={rock.id} className="border-l-4 border-indigo-500 pl-4 py-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{rock.description}</p>
                      <p className="text-sm text-gray-500 mt-1">{rock.owner}</p>
                    </div>
                    <StatusBadge status={rock.status === 'on-track' ? 'GREEN' : rock.status === 'at-risk' ? 'YELLOW' : 'RED'} />
                  </div>
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-medium text-gray-900">{rock.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-indigo-600 h-2 rounded-full transition-all"
                        style={{ width: `${rock.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* KPIs */}
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Key Performance Indicators</h2>
              <Link to="/kpis" className="text-sm text-indigo-600 hover:text-indigo-800">
                View all
              </Link>
            </div>
            <div className="space-y-4">
              {kpis.map((kpi) => (
                <div key={kpi.id} className="flex items-center justify-between py-3 border-b border-gray-200 last:border-0">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{kpi.name}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {kpi.currentValue.toFixed(1)} {kpi.unit} / {kpi.targetValue.toFixed(1)} {kpi.unit}
                    </p>
                  </div>
                  <StatusBadge status={kpi.status} />
                </div>
              ))}
            </div>
          </Card>

          {/* Critical Numbers */}
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Critical Numbers</h2>
              <Link to="/critical-numbers" className="text-sm text-indigo-600 hover:text-indigo-800">
                View all
              </Link>
            </div>
            <div className="space-y-4">
              {criticalNumbers.map((cn) => (
                <div key={cn.id} className="flex items-center justify-between py-3 border-b border-gray-200 last:border-0">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{cn.name}</p>
                    <p className="text-xs text-gray-500 mt-1">{cn.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      {cn.unit === 'UGX' ? formatCurrency(cn.currentValue) : `${cn.currentValue} ${cn.unit}`}
                    </p>
                    <Badge variant="info" size="sm">
                      Vital 20%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Recent Properties */}
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Properties</h2>
              <Link to="/properties" className="text-sm text-indigo-600 hover:text-indigo-800">
                View all
              </Link>
            </div>
            <div className="space-y-4">
              {properties.slice(0, 3).map((property) => (
                <div key={property.id} className="flex items-center justify-between py-3 border-b border-gray-200 last:border-0">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{property.name}</p>
                    <p className="text-sm text-gray-500">{property.address}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {property.occupiedUnits}/{property.totalUnits} occupied
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatPercentage((property.occupiedUnits / property.totalUnits) * 100)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
