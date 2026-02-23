import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { Tenant, Property, MaintenanceRequest, TenantPerformanceMetrics, PropertyPerformanceMetrics, KPI, GeneralLedgerEntry } from '../types';
import { storageGetItem, storageSetItem } from '../services/storageService';

/**
 * 80/20 ANALYTICS ENGINE
 * Based on Koch's Pareto Principle
 *
 * Features:
 * - Tenant 80/20 Analysis (Revenue & Risk)
 * - Property 80/20 Analysis (Yield & Efficiency)
 * - Vital Few KPIs (Critical 5 identification)
 * - Pareto Charts
 * - Risk Heatmaps
 */

export function Analytics8020View() {
  const [activeTab, setActiveTab] = useState<'tenants' | 'properties' | 'kpis'>('tenants');
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [maintenanceRequests, setMaintenanceRequests] = useState<MaintenanceRequest[]>([]);
  const [kpis, setKpis] = useState<KPI[]>([]);
  const [generalLedger, setGeneralLedger] = useState<GeneralLedgerEntry[]>([]);

  const [tenantMetrics, setTenantMetrics] = useState<TenantPerformanceMetrics[]>([]);
  const [propertyMetrics, setPropertyMetrics] = useState<PropertyPerformanceMetrics[]>([]);
  const [vitalFewKPIs, setVitalFewKPIs] = useState<string[]>([]); // IDs of vital few KPIs

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (tenants.length > 0) {
      calculateTenantMetrics();
    }
  }, [tenants, maintenanceRequests, generalLedger]);

  useEffect(() => {
    if (properties.length > 0) {
      calculatePropertyMetrics();
    }
  }, [properties, tenants, maintenanceRequests, generalLedger]);

  function loadData() {
    const stored = storageGetItem('vgk_data');
    if (stored) {
      const data = JSON.parse(stored);
      setTenants(data.tenants || []);
      setProperties(data.properties || []);
      setMaintenanceRequests(data.maintenanceRequests || []);
      setKpis(data.kpis || []);
      setGeneralLedger(data.generalLedger || []);

      // Load vital few KPI selections from localStorage
      const vitalFew = storageGetItem('vitalFewKPIs');
      if (vitalFew) {
        setVitalFewKPIs(JSON.parse(vitalFew));
      }
    }
  }

  function saveVitalFewKPIs(kpiIds: string[]) {
    storageSetItem('vitalFewKPIs', JSON.stringify(kpiIds));
    setVitalFewKPIs(kpiIds);
  }

  function calculateTenantMetrics() {
    const metrics: TenantPerformanceMetrics[] = tenants.map(tenant => {
      // Calculate total rent paid (from payment history)
      const totalRentPaid = (tenant.paymentHistory || []).reduce((sum, payment) => sum + payment.amount, 0);

      // Calculate on-time payment rate
      const paymentHistory = tenant.paymentHistory || [];
      const onTimePayments = paymentHistory.filter(payment => {
        const paymentDate = new Date(payment.date);
        const expectedDate = new Date(tenant.nextPaymentDate);
        return paymentDate <= expectedDate;
      }).length;
      const onTimePaymentRate = paymentHistory.length > 0 ? (onTimePayments / paymentHistory.length) * 100 : 100;

      // Average days late (simplified - assumes monthly rent)
      const averageDaysLate = paymentHistory.length > 0 ? Math.max(0, 30 - onTimePaymentRate / 3.33) : 0;

      // Maintenance requests for this tenant
      const tenantMaintenance = maintenanceRequests.filter(req => req.tenantId === tenant.id);
      const maintenanceRequestCount = tenantMaintenance.length;

      // Calculate maintenance costs
      const maintenanceCosts = tenantMaintenance.reduce(
        (sum, req) => sum + (req.actualCost || req.estimatedCost || 0),
        0
      );

      // Profitability calculation
      const totalRevenue = totalRentPaid;
      const totalCosts = maintenanceCosts; // Could add other costs like complaints handling
      const netContribution = totalRevenue - totalCosts;

      // Risk scoring (0-100, higher = more risk)
      let riskScore = 0;
      if (tenant.paymentStatus === 'Overdue') riskScore += 40;
      if (onTimePaymentRate < 80) riskScore += 20;
      if (maintenanceRequestCount > 5) riskScore += 20;
      if (tenant.paymentStatus === 'Due') riskScore += 10;
      riskScore = Math.min(100, riskScore);

      const evictionRisk: 'Low' | 'Medium' | 'High' =
        riskScore < 30 ? 'Low' : riskScore < 60 ? 'Medium' : 'High';

      return {
        tenantId: tenant.id,
        tenantName: tenant.name,
        totalRentPaid,
        onTimePaymentRate,
        averageDaysLate,
        maintenanceRequestCount,
        complaintCount: 0, // Would track separately in a real system
        leaseViolationCount: 0, // Would track separately
        evictionRisk,
        totalRevenue,
        totalCosts,
        netContribution,
        riskScore,
      };
    });

    // Rank by revenue
    const sortedByRevenue = [...metrics].sort((a, b) => b.totalRevenue - a.totalRevenue);
    sortedByRevenue.forEach((metric, index) => {
      metric.revenueRank = index + 1;
    });

    // Rank by profitability
    const sortedByProfit = [...metrics].sort((a, b) => b.netContribution - a.netContribution);
    sortedByProfit.forEach((metric, index) => {
      metric.profitabilityRank = index + 1;
    });

    setTenantMetrics(metrics);
  }

  function calculatePropertyMetrics() {
    const metrics: PropertyPerformanceMetrics[] = properties.map(property => {
      // Get tenants for this property
      const propertyTenants = tenants.filter(t => t.propertyId === property.id);
      const occupiedUnits = propertyTenants.length;
      const occupancyRate = property.totalUnits > 0 ? (occupiedUnits / property.totalUnits) * 100 : 0;

      // Calculate total income
      const totalIncome = propertyTenants.reduce((sum, t) => sum + t.rentAmount, 0);
      const averageRentPerUnit = occupiedUnits > 0 ? totalIncome / occupiedUnits : 0;

      // Get maintenance for this property
      const propertyMaintenance = maintenanceRequests.filter(req => req.propertyId === property.id);
      const maintenanceFrequency = propertyMaintenance.length / 12; // requests per month (assuming 1 year)
      const totalMaintenanceCost = propertyMaintenance.reduce(
        (sum, req) => sum + (req.actualCost || req.estimatedCost || 0),
        0
      );
      const averageMaintenanceCost = propertyMaintenance.length > 0 ? totalMaintenanceCost / propertyMaintenance.length : 0;

      // Get expenses from general ledger
      const propertyExpenses = generalLedger
        .filter(entry => entry.propertyId === property.id && entry.debit > 0)
        .reduce((sum, entry) => sum + entry.debit, 0);

      const totalExpenses = propertyExpenses + totalMaintenanceCost;

      // Calculate NOI, OER, Net Yield
      const noi = totalIncome - totalExpenses;
      const oer = totalIncome > 0 ? (totalExpenses / totalIncome) * 100 : 0;
      const netYield = totalIncome > 0 ? (noi / totalIncome) * 100 : 0;

      return {
        propertyId: property.id,
        propertyName: property.name,
        totalIncome,
        occupancyRate,
        averageRentPerUnit,
        totalExpenses,
        maintenanceFrequency,
        averageMaintenanceCost,
        noi,
        oer,
        netYield,
      };
    });

    // Rank by income
    const sortedByIncome = [...metrics].sort((a, b) => b.totalIncome - a.totalIncome);
    sortedByIncome.forEach((metric, index) => {
      metric.incomeRank = index + 1;
    });

    // Rank by yield
    const sortedByYield = [...metrics].sort((a, b) => b.netYield - a.netYield);
    sortedByYield.forEach((metric, index) => {
      metric.yieldRank = index + 1;
    });

    // Rank by efficiency (lower OER is better)
    const sortedByEfficiency = [...metrics].sort((a, b) => a.oer - b.oer);
    sortedByEfficiency.forEach((metric, index) => {
      metric.efficiencyRank = index + 1;
    });

    setPropertyMetrics(metrics);
  }

  function toggleVitalFewKPI(kpiId: string) {
    if (vitalFewKPIs.includes(kpiId)) {
      saveVitalFewKPIs(vitalFewKPIs.filter(id => id !== kpiId));
    } else {
      if (vitalFewKPIs.length >= 5) {
        alert('You can only select up to 5 Vital Few KPIs');
        return;
      }
      saveVitalFewKPIs([...vitalFewKPIs, kpiId]);
    }
  }

  function formatUGX(amount: number): string {
    return `${amount.toLocaleString()} UGX`;
  }

  // Tenant 80/20 Analysis: Top 20% by revenue
  const top20PercentTenants = Math.ceil(tenantMetrics.length * 0.2);
  const topTenants = tenantMetrics
    .sort((a, b) => b.totalRevenue - a.totalRevenue)
    .slice(0, top20PercentTenants);
  const topTenantsRevenue = topTenants.reduce((sum, t) => sum + t.totalRevenue, 0);
  const totalRevenue = tenantMetrics.reduce((sum, t) => sum + t.totalRevenue, 0);
  const top20RevenuePercentage = totalRevenue > 0 ? (topTenantsRevenue / totalRevenue) * 100 : 0;

  // High-risk tenants (Top 20% by risk score)
  const highRiskTenants = tenantMetrics
    .sort((a, b) => b.riskScore - a.riskScore)
    .slice(0, top20PercentTenants);

  // Property 80/20 Analysis: Top 20% by income
  const top20PercentProperties = Math.ceil(propertyMetrics.length * 0.2);
  const topProperties = propertyMetrics
    .sort((a, b) => b.totalIncome - a.totalIncome)
    .slice(0, top20PercentProperties);
  const topPropertiesIncome = topProperties.reduce((sum, p) => sum + p.totalIncome, 0);
  const totalPropertyIncome = propertyMetrics.reduce((sum, p) => sum + p.totalIncome, 0);
  const top20PropertyIncomePercentage = totalPropertyIncome > 0 ? (topPropertiesIncome / totalPropertyIncome) * 100 : 0;

  // Prepare chart data
  const tenantRevenueChartData = tenantMetrics
    .sort((a, b) => b.totalRevenue - a.totalRevenue)
    .slice(0, 10)
    .map(t => ({
      name: t.tenantName.substring(0, 15),
      revenue: t.totalRevenue,
    }));

  const propertyIncomeChartData = propertyMetrics
    .sort((a, b) => b.totalIncome - a.totalIncome)
    .map(p => ({
      name: p.propertyName,
      income: p.totalIncome,
      noi: p.noi,
    }));

  const vitalKPIs = kpis.filter(kpi => vitalFewKPIs.includes(kpi.id));
  const trivialKPIs = kpis.filter(kpi => !vitalFewKPIs.includes(kpi.id));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">80/20 Analytics Engine</h1>
        <p className="text-gray-600 mt-1">Pareto Principle Analysis (Koch & Verne Harnish)</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <div className="flex">
            <button
              onClick={() => setActiveTab('tenants')}
              className={`px-6 py-3 font-medium ${
                activeTab === 'tenants'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Tenant 80/20 Analysis
            </button>
            <button
              onClick={() => setActiveTab('properties')}
              className={`px-6 py-3 font-medium ${
                activeTab === 'properties'
                  ? 'text-green-600 border-b-2 border-green-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Property 80/20 Analysis
            </button>
            <button
              onClick={() => setActiveTab('kpis')}
              className={`px-6 py-3 font-medium ${
                activeTab === 'kpis'
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Vital Few KPIs
            </button>
          </div>
        </div>

        {/* Tenant 80/20 Analysis Tab */}
        {activeTab === 'tenants' && (
          <div className="p-6 space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-sm text-blue-600 font-medium">Total Tenants</div>
                <div className="text-2xl font-bold text-blue-700">{tenantMetrics.length}</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-sm text-green-600 font-medium">Top 20% Tenants</div>
                <div className="text-2xl font-bold text-green-700">{top20PercentTenants}</div>
                <div className="text-xs text-green-600">Generate {top20RevenuePercentage.toFixed(1)}% of revenue</div>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <div className="text-sm text-orange-600 font-medium">Total Revenue</div>
                <div className="text-2xl font-bold text-orange-700">{formatUGX(totalRevenue)}</div>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <div className="text-sm text-red-600 font-medium">High-Risk Tenants</div>
                <div className="text-2xl font-bold text-red-700">{highRiskTenants.length}</div>
                <div className="text-xs text-red-600">Require attention</div>
              </div>
            </div>

            {/* Pareto Chart: Top 10 Tenants by Revenue */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Top 10 Tenants by Revenue (Pareto Chart)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={tenantRevenueChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip formatter={(value: number) => formatUGX(value)} />
                  <Legend />
                  <Bar dataKey="revenue" fill="#3b82f6" name="Revenue (UGX)" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Top 20% Revenue Contributors */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Top 20% Revenue Contributors ({topTenants.length} tenants)
              </h3>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Rank</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Tenant</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Revenue</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Net Contribution</th>
                      <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">On-Time %</th>
                      <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">Risk</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {topTenants.map(tenant => (
                      <tr key={tenant.tenantId} className="hover:bg-gray-50">
                        <td className="px-4 py-2 text-gray-900">{tenant.revenueRank}</td>
                        <td className="px-4 py-2 text-gray-900 font-medium">{tenant.tenantName}</td>
                        <td className="px-4 py-2 text-right text-green-600 font-medium">
                          {formatUGX(tenant.totalRevenue)}
                        </td>
                        <td className="px-4 py-2 text-right text-blue-600">{formatUGX(tenant.netContribution)}</td>
                        <td className="px-4 py-2 text-center">
                          <span
                            className={`${
                              tenant.onTimePaymentRate >= 90
                                ? 'text-green-600'
                                : tenant.onTimePaymentRate >= 70
                                ? 'text-yellow-600'
                                : 'text-red-600'
                            } font-medium`}
                          >
                            {tenant.onTimePaymentRate.toFixed(1)}%
                          </span>
                        </td>
                        <td className="px-4 py-2 text-center">
                          <span
                            className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              tenant.evictionRisk === 'Low'
                                ? 'bg-green-100 text-green-800'
                                : tenant.evictionRisk === 'Medium'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {tenant.evictionRisk}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* High-Risk Tenants (Bottom 20%) */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                🚨 High-Risk Tenants ({highRiskTenants.length} tenants)
              </h3>
              <div className="border border-red-200 rounded-lg overflow-hidden bg-red-50">
                <table className="w-full text-sm">
                  <thead className="bg-red-100">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-red-700 uppercase">Tenant</th>
                      <th className="px-4 py-2 text-center text-xs font-medium text-red-700 uppercase">Risk Score</th>
                      <th className="px-4 py-2 text-center text-xs font-medium text-red-700 uppercase">On-Time %</th>
                      <th className="px-4 py-2 text-center text-xs font-medium text-red-700 uppercase">Maintenance</th>
                      <th className="px-4 py-2 text-center text-xs font-medium text-red-700 uppercase">Risk Level</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-red-200 bg-white">
                    {highRiskTenants.map(tenant => (
                      <tr key={tenant.tenantId} className="hover:bg-red-50">
                        <td className="px-4 py-2 text-gray-900 font-medium">{tenant.tenantName}</td>
                        <td className="px-4 py-2 text-center">
                          <div className="flex items-center justify-center">
                            <div className="w-full bg-gray-200 rounded-full h-2 mr-2 max-w-xs">
                              <div
                                className="bg-red-600 h-2 rounded-full"
                                style={{ width: `${tenant.riskScore}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-red-600 font-medium">{tenant.riskScore}</span>
                          </div>
                        </td>
                        <td className="px-4 py-2 text-center text-red-600">{tenant.onTimePaymentRate.toFixed(1)}%</td>
                        <td className="px-4 py-2 text-center text-gray-900">{tenant.maintenanceRequestCount}</td>
                        <td className="px-4 py-2 text-center">
                          <span
                            className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              tenant.evictionRisk === 'High' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {tenant.evictionRisk}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Property 80/20 Analysis Tab */}
        {activeTab === 'properties' && (
          <div className="p-6 space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-sm text-green-600 font-medium">Total Properties</div>
                <div className="text-2xl font-bold text-green-700">{propertyMetrics.length}</div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-sm text-blue-600 font-medium">Top 20% Properties</div>
                <div className="text-2xl font-bold text-blue-700">{top20PercentProperties}</div>
                <div className="text-xs text-blue-600">Generate {top20PropertyIncomePercentage.toFixed(1)}% of income</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-sm text-purple-600 font-medium">Total Income</div>
                <div className="text-2xl font-bold text-purple-700">{formatUGX(totalPropertyIncome)}</div>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <div className="text-sm text-orange-600 font-medium">Avg Occupancy</div>
                <div className="text-2xl font-bold text-orange-700">
                  {propertyMetrics.length > 0
                    ? (propertyMetrics.reduce((sum, p) => sum + p.occupancyRate, 0) / propertyMetrics.length).toFixed(1)
                    : 0}
                  %
                </div>
              </div>
            </div>

            {/* Property Income & NOI Chart */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Income vs NOI (Pareto Chart)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={propertyIncomeChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => formatUGX(value)} />
                  <Legend />
                  <Bar dataKey="income" fill="#10b981" name="Total Income" />
                  <Bar dataKey="noi" fill="#3b82f6" name="NOI" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Property Rankings */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Property Performance Rankings</h3>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Property</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Income</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">NOI</th>
                      <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">OER</th>
                      <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">Net Yield</th>
                      <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">Occupancy</th>
                      <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">Income Rank</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {propertyMetrics
                      .sort((a, b) => (a.incomeRank || 0) - (b.incomeRank || 0))
                      .map(property => {
                        const isTop20 = (property.incomeRank || 0) <= top20PercentProperties;
                        return (
                          <tr key={property.propertyId} className={isTop20 ? 'bg-green-50 hover:bg-green-100' : 'hover:bg-gray-50'}>
                            <td className="px-4 py-2 text-gray-900 font-medium">
                              {isTop20 && '⭐ '}
                              {property.propertyName}
                            </td>
                            <td className="px-4 py-2 text-right text-green-600 font-medium">
                              {formatUGX(property.totalIncome)}
                            </td>
                            <td className="px-4 py-2 text-right text-blue-600">{formatUGX(property.noi)}</td>
                            <td className="px-4 py-2 text-center">
                              <span
                                className={`${
                                  property.oer <= 50
                                    ? 'text-green-600'
                                    : property.oer <= 70
                                    ? 'text-yellow-600'
                                    : 'text-red-600'
                                } font-medium`}
                              >
                                {property.oer.toFixed(1)}%
                              </span>
                            </td>
                            <td className="px-4 py-2 text-center text-purple-600 font-medium">
                              {property.netYield.toFixed(1)}%
                            </td>
                            <td className="px-4 py-2 text-center text-gray-900">{property.occupancyRate.toFixed(1)}%</td>
                            <td className="px-4 py-2 text-center">
                              <span className="px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full">
                                #{property.incomeRank}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Cash Cow vs Loss-Makers */}
            <div className="grid grid-cols-2 gap-4">
              <div className="border border-green-200 rounded-lg p-4 bg-green-50">
                <h3 className="text-lg font-semibold text-green-800 mb-3">🐄 Cash Cow Properties (Top 20%)</h3>
                <ul className="space-y-2">
                  {topProperties.map(p => (
                    <li key={p.propertyId} className="flex justify-between text-sm">
                      <span className="text-gray-900 font-medium">{p.propertyName}</span>
                      <span className="text-green-600">{formatUGX(p.noi)} NOI</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="border border-red-200 rounded-lg p-4 bg-red-50">
                <h3 className="text-lg font-semibold text-red-800 mb-3">⚠️ Underperforming Properties (Bottom 20%)</h3>
                <ul className="space-y-2">
                  {propertyMetrics
                    .sort((a, b) => a.noi - b.noi)
                    .slice(0, top20PercentProperties)
                    .map(p => (
                      <li key={p.propertyId} className="flex justify-between text-sm">
                        <span className="text-gray-900 font-medium">{p.propertyName}</span>
                        <span className="text-red-600">{formatUGX(p.noi)} NOI</span>
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Vital Few KPIs Tab */}
        {activeTab === 'kpis' && (
          <div className="p-6 space-y-6">
            {/* Summary */}
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-purple-900 mb-2">Koch's Vital Few Principle</h3>
              <p className="text-sm text-purple-700">
                Identify the 5 most critical KPIs that drive 80% of your results. Focus daily attention on these vital few
                metrics instead of being distracted by the trivial many.
              </p>
              <div className="mt-3 text-sm font-medium text-purple-900">
                Selected: {vitalFewKPIs.length} / 5 Vital Few KPIs
              </div>
            </div>

            {/* Vital Few KPIs */}
            {vitalKPIs.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">⭐ Vital Few KPIs ({vitalKPIs.length})</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {vitalKPIs.map(kpi => {
                    const achievement = (kpi.currentValue / kpi.targetValue) * 100;
                    return (
                      <div key={kpi.id} className="border-2 border-purple-300 rounded-lg p-4 bg-purple-50">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">{kpi.name}</h4>
                            <p className="text-xs text-gray-600 mt-1">{kpi.description}</p>
                          </div>
                          <button
                            onClick={() => toggleVitalFewKPI(kpi.id)}
                            className="ml-2 text-red-600 hover:text-red-800 text-sm"
                          >
                            Remove
                          </button>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm mt-3">
                          <div>
                            <div className="text-gray-600">Current</div>
                            <div className="font-bold text-purple-700">
                              {kpi.currentValue} {kpi.unit}
                            </div>
                          </div>
                          <div>
                            <div className="text-gray-600">Target</div>
                            <div className="font-bold text-gray-900">
                              {kpi.targetValue} {kpi.unit}
                            </div>
                          </div>
                        </div>
                        <div className="mt-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-gray-600">Achievement</span>
                            <span className="text-xs font-semibold text-purple-700">{achievement.toFixed(1)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                achievement >= 100
                                  ? 'bg-green-600'
                                  : achievement >= 80
                                  ? 'bg-yellow-600'
                                  : 'bg-red-600'
                              }`}
                              style={{ width: `${Math.min(100, achievement)}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Trivial Many KPIs */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Trivial Many KPIs ({trivialKPIs.length})</h3>
              <p className="text-sm text-gray-600 mb-3">
                Select up to {5 - vitalFewKPIs.length} more KPI(s) to add to your Vital Few
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {trivialKPIs.map(kpi => {
                  const achievement = (kpi.currentValue / kpi.targetValue) * 100;
                  return (
                    <div key={kpi.id} className="border border-gray-200 rounded-lg p-3 bg-white hover:bg-gray-50">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-gray-900 text-sm">{kpi.name}</h4>
                        <button
                          onClick={() => toggleVitalFewKPI(kpi.id)}
                          className="text-purple-600 hover:text-purple-800 text-xs font-medium"
                          disabled={vitalFewKPIs.length >= 5}
                        >
                          {vitalFewKPIs.length >= 5 ? 'Full' : '+ Add'}
                        </button>
                      </div>
                      <div className="text-xs text-gray-600">
                        {kpi.currentValue} / {kpi.targetValue} {kpi.unit}
                      </div>
                      <div className="mt-2">
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div
                            className="bg-gray-400 h-1.5 rounded-full"
                            style={{ width: `${Math.min(100, achievement)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
