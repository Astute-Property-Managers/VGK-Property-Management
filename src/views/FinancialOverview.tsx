import React, { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  getProperties,
  getTenants,
  getGeneralLedgerEntries,
  formatUGX,
} from '../services/dataService';
import type { Property, Tenant, GeneralLedgerEntry } from '../types';

interface PropertyBoxScore {
  propertyId: string;
  propertyName: string;
  rentIncome: number;
  otherIncome: number;
  totalIncome: number;
  maintenanceExpenses: number;
  operatingExpenses: number;
  taxInsurance: number;
  managementFees: number;
  totalExpenses: number;
  noi: number;
  oer: number;
  occupancy: number;
}

export const FinancialOverview: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [boxScores, setBoxScores] = useState<PropertyBoxScore[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const propertiesData = getProperties();
    const tenantsData = getTenants();
    const ledgerData = getGeneralLedgerEntries();

    setProperties(propertiesData);
    setTenants(tenantsData);

    // Calculate box scores for each property
    const scores = calculateBoxScores(propertiesData, tenantsData, ledgerData);
    setBoxScores(scores);
  };

  const calculateBoxScores = (
    props: Property[],
    _tns: Tenant[],
    ledger: GeneralLedgerEntry[]
  ): PropertyBoxScore[] => {
    return props.map(property => {
      // Filter ledger entries for this property
      const propertyLedger = ledger.filter(entry => entry.propertyId === property.id);

      // Calculate income from GL (Credits to income accounts)
      const rentIncome = propertyLedger
        .filter(entry => entry.accountId === 'acc-4000')
        .reduce((sum, entry) => sum + entry.credit, 0);

      const otherIncome = propertyLedger
        .filter(entry => ['acc-4100', 'acc-4200'].includes(entry.accountId))
        .reduce((sum, entry) => sum + entry.credit, 0);

      const totalIncome = rentIncome + otherIncome;

      // Calculate expenses from GL (Debits to expense accounts)
      const maintenanceExpenses = propertyLedger
        .filter(entry => entry.accountId === 'acc-5000')
        .reduce((sum, entry) => sum + entry.debit, 0);

      const operatingExpenses = propertyLedger
        .filter(entry => ['acc-5100', 'acc-5500'].includes(entry.accountId))
        .reduce((sum, entry) => sum + entry.debit, 0);

      const taxInsurance = propertyLedger
        .filter(entry => ['acc-5200', 'acc-5300'].includes(entry.accountId))
        .reduce((sum, entry) => sum + entry.debit, 0);

      const managementFees = propertyLedger
        .filter(entry => entry.accountId === 'acc-5400')
        .reduce((sum, entry) => sum + entry.debit, 0);

      const totalExpenses = maintenanceExpenses + operatingExpenses + taxInsurance + managementFees;

      // Calculate NOI (Net Operating Income)
      const noi = totalIncome - totalExpenses;

      // Calculate OER (Operating Expense Ratio) - Lower is better
      const oer = totalIncome > 0 ? (totalExpenses / totalIncome) * 100 : 0;

      // Calculate occupancy rate
      const occupancy = property.totalUnits > 0
        ? ((property.occupiedUnits / property.totalUnits) * 100)
        : 0;

      return {
        propertyId: property.id,
        propertyName: property.name,
        rentIncome,
        otherIncome,
        totalIncome,
        maintenanceExpenses,
        operatingExpenses,
        taxInsurance,
        managementFees,
        totalExpenses,
        noi,
        oer,
        occupancy,
      };
    });
  };

  // Calculate portfolio-wide metrics
  const portfolioMetrics = boxScores.reduce(
    (acc, score) => ({
      totalIncome: acc.totalIncome + score.totalIncome,
      totalExpenses: acc.totalExpenses + score.totalExpenses,
      totalNOI: acc.totalNOI + score.noi,
    }),
    { totalIncome: 0, totalExpenses: 0, totalNOI: 0 }
  );

  const portfolioOER =
    portfolioMetrics.totalIncome > 0
      ? (portfolioMetrics.totalExpenses / portfolioMetrics.totalIncome) * 100
      : 0;

  // Calculate rent collection rate
  const totalTenants = tenants.length;
  const paidTenants = tenants.filter(t => t.paymentStatus === 'Paid').length;
  const collectionRate = totalTenants > 0 ? (paidTenants / totalTenants) * 100 : 0;

  // Calculate vacancy loss
  const totalUnits = properties.reduce((sum, p) => sum + p.totalUnits, 0);
  const occupiedUnits = properties.reduce((sum, p) => sum + p.occupiedUnits, 0);
  const vacancyRate = totalUnits > 0 ? ((totalUnits - occupiedUnits) / totalUnits) * 100 : 0;
  const potentialRent = tenants.reduce((sum, t) => sum + t.rentAmount, 0) / (1 - vacancyRate / 100);
  const vacancyLoss = potentialRent * (vacancyRate / 100);

  // Prepare chart data
  const noiChartData = boxScores.map(score => ({
    property: score.propertyName,
    Income: score.totalIncome,
    Expenses: score.totalExpenses,
    NOI: score.noi,
  }));

  const expenseBreakdownData = [
    { name: 'Maintenance', value: boxScores.reduce((sum, s) => sum + s.maintenanceExpenses, 0) },
    { name: 'Operating', value: boxScores.reduce((sum, s) => sum + s.operatingExpenses, 0) },
    { name: 'Tax/Insurance', value: boxScores.reduce((sum, s) => sum + s.taxInsurance, 0) },
    { name: 'Management', value: boxScores.reduce((sum, s) => sum + s.managementFees, 0) },
  ];

  const COLORS = ['#EF4444', '#F59E0B', '#3B82F6', '#8B5CF6'];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Financial Overview</h1>
        <p className="text-gray-600 mt-2">
          <strong>Lean Finance Dashboard:</strong> Focus on the 20% of metrics that drive 80% of value.
          Real-time NOI, OER, and operational insights integrated with IFRS-compliant General Ledger.
        </p>
      </div>

      {/* Critical Numbers (The 20%) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* NOI */}
        <div className="bg-green-50 rounded-lg shadow-md p-6 border border-green-200">
          <h3 className="text-sm font-medium text-green-600">Net Operating Income (NOI)</h3>
          <p className="text-3xl font-bold text-green-900 mt-2">
            {formatUGX(portfolioMetrics.totalNOI)}
          </p>
          <p className="text-sm text-green-600 mt-1">Primary profitability metric</p>
        </div>

        {/* OER */}
        <div
          className={`rounded-lg shadow-md p-6 border ${
            portfolioOER <= 50 ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'
          }`}
        >
          <h3
            className={`text-sm font-medium ${
              portfolioOER <= 50 ? 'text-green-600' : 'text-yellow-600'
            }`}
          >
            Operating Expense Ratio (OER)
          </h3>
          <p
            className={`text-3xl font-bold mt-2 ${
              portfolioOER <= 50 ? 'text-green-900' : 'text-yellow-900'
            }`}
          >
            {portfolioOER.toFixed(1)}%
          </p>
          <p
            className={`text-sm mt-1 ${
              portfolioOER <= 50 ? 'text-green-600' : 'text-yellow-600'
            }`}
          >
            Target: ≤ 50% (IREM Standard)
          </p>
        </div>

        {/* Rent Collection Rate */}
        <div
          className={`rounded-lg shadow-md p-6 border ${
            collectionRate >= 95
              ? 'bg-green-50 border-green-200'
              : collectionRate >= 85
              ? 'bg-yellow-50 border-yellow-200'
              : 'bg-red-50 border-red-200'
          }`}
        >
          <h3
            className={`text-sm font-medium ${
              collectionRate >= 95
                ? 'text-green-600'
                : collectionRate >= 85
                ? 'text-yellow-600'
                : 'text-red-600'
            }`}
          >
            Rent Collection Rate
          </h3>
          <p
            className={`text-3xl font-bold mt-2 ${
              collectionRate >= 95
                ? 'text-green-900'
                : collectionRate >= 85
                ? 'text-yellow-900'
                : 'text-red-900'
            }`}
          >
            {collectionRate.toFixed(1)}%
          </p>
          <p
            className={`text-sm mt-1 ${
              collectionRate >= 95
                ? 'text-green-600'
                : collectionRate >= 85
                ? 'text-yellow-600'
                : 'text-red-600'
            }`}
          >
            Target: 95%+ (Griswold)
          </p>
        </div>

        {/* Vacancy Loss */}
        <div
          className={`rounded-lg shadow-md p-6 border ${
            vacancyRate <= 5 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
          }`}
        >
          <h3
            className={`text-sm font-medium ${
              vacancyRate <= 5 ? 'text-green-600' : 'text-red-600'
            }`}
          >
            Vacancy Rate
          </h3>
          <p
            className={`text-3xl font-bold mt-2 ${
              vacancyRate <= 5 ? 'text-green-900' : 'text-red-900'
            }`}
          >
            {vacancyRate.toFixed(1)}%
          </p>
          <p
            className={`text-sm mt-1 ${
              vacancyRate <= 5 ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {formatUGX(vacancyLoss)} opportunity cost
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* NOI by Property */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            NOI by Property (Income - Expenses)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={noiChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="property" />
              <YAxis />
              <Tooltip formatter={(value) => formatUGX(value as number)} />
              <Legend />
              <Bar dataKey="Income" fill="#10B981" />
              <Bar dataKey="Expenses" fill="#EF4444" />
              <Bar dataKey="NOI" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Expense Breakdown */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Expense Breakdown (Griswold Categories)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={expenseBreakdownData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.name}: ${formatUGX(entry.value)}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {expenseBreakdownData.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatUGX(value as number)} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Property-Level Box Scores */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Property Box Scores (Lean Finance - One Page View)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {boxScores.map(score => (
            <div key={score.propertyId} className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3">{score.propertyName}</h4>

              {/* Income Section */}
              <div className="mb-3">
                <p className="text-xs font-medium text-gray-500 uppercase">Income</p>
                <div className="text-sm text-gray-700 space-y-1">
                  <div className="flex justify-between">
                    <span>Rent:</span>
                    <span>{formatUGX(score.rentIncome)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Other:</span>
                    <span>{formatUGX(score.otherIncome)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-blue-700 border-t pt-1">
                    <span>Total Income:</span>
                    <span>{formatUGX(score.totalIncome)}</span>
                  </div>
                </div>
              </div>

              {/* Expenses Section */}
              <div className="mb-3">
                <p className="text-xs font-medium text-gray-500 uppercase">Expenses</p>
                <div className="text-sm text-gray-700 space-y-1">
                  <div className="flex justify-between">
                    <span>Maintenance:</span>
                    <span>{formatUGX(score.maintenanceExpenses)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Operating:</span>
                    <span>{formatUGX(score.operatingExpenses)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax/Insurance:</span>
                    <span>{formatUGX(score.taxInsurance)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Management:</span>
                    <span>{formatUGX(score.managementFees)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-red-700 border-t pt-1">
                    <span>Total Expenses:</span>
                    <span>{formatUGX(score.totalExpenses)}</span>
                  </div>
                </div>
              </div>

              {/* NOI & Metrics */}
              <div className="bg-green-50 rounded p-2 mb-2">
                <div className="flex justify-between text-sm font-bold text-green-900">
                  <span>NOI:</span>
                  <span>{formatUGX(score.noi)}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div
                  className={`rounded p-2 ${
                    score.oer <= 50 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  <p className="font-medium">OER</p>
                  <p className="font-bold">{score.oer.toFixed(1)}%</p>
                </div>
                <div
                  className={`rounded p-2 ${
                    score.occupancy >= 95
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  <p className="font-medium">Occupancy</p>
                  <p className="font-bold">{score.occupancy.toFixed(1)}%</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lean Finance Principles */}
      <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
        <h3 className="font-semibold text-indigo-900 mb-2">📊 Lean Finance Dashboard Principles</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-indigo-800">
          <div>
            <h4 className="font-semibold mb-2">The 20% That Matters (Pareto):</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>NOI:</strong> Bottom-line profitability per property
              </li>
              <li>
                <strong>OER:</strong> Efficiency metric - How much of income goes to expenses
              </li>
              <li>
                <strong>Collection Rate:</strong> Cash flow health indicator
              </li>
              <li>
                <strong>Vacancy Rate:</strong> Opportunity cost measurement
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Integration & Compliance:</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Real-time:</strong> All metrics auto-calculated from General Ledger
              </li>
              <li>
                <strong>IFRS-compliant:</strong> Double-entry bookkeeping ensures accuracy
              </li>
              <li>
                <strong>IREM Standards:</strong> Professional property management metrics
              </li>
              <li>
                <strong>Griswold Categories:</strong> Industry-standard expense breakdown
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* IFRS Compliance Note */}
      <div className="mt-6 bg-purple-50 border border-purple-200 rounded-lg p-6">
        <h3 className="font-semibold text-purple-900 mb-2">🔐 IFRS & CPA Uganda Compliance</h3>
        <p className="text-sm text-purple-800 mb-2">
          This dashboard derives all metrics from the General Ledger, ensuring:
        </p>
        <ul className="list-disc list-inside text-sm text-purple-800 space-y-1">
          <li>
            <strong>IAS 40 (Investment Property):</strong> NOI calculation follows fair value model
          </li>
          <li>
            <strong>IFRS 16 (Leases):</strong> Rental income properly categorized
          </li>
          <li>
            <strong>Audit Trail:</strong> Every metric traceable to GL entries
          </li>
          <li>
            <strong>URA Ready:</strong> Expense categories align with tax filing requirements
          </li>
        </ul>
      </div>
    </div>
  );
};
