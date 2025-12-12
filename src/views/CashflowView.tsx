import React, { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { Input } from '../components/Input';
import { getCashflowForecast, saveCashflowForecast, formatUGX } from '../services/dataService';
import type { CashflowEntry, CashflowForecast } from '../types';

export const CashflowView: React.FC = () => {
  const [forecast, setForecast] = useState<CashflowForecast | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<CashflowEntry | null>(null);
  const [formData, setFormData] = useState<Partial<CashflowEntry>>({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const data = getCashflowForecast();
    setForecast(data);
  };

  const openEditModal = (entry: CashflowEntry) => {
    setEditingEntry(entry);
    setFormData({
      monthYear: entry.monthYear,
      projectedRentIncome: entry.projectedRentIncome,
      projectedOtherIncome: entry.projectedOtherIncome,
      projectedMaintenanceExpenses: entry.projectedMaintenanceExpenses,
      projectedOperatingExpenses: entry.projectedOperatingExpenses,
      projectedPropertyTaxInsurance: entry.projectedPropertyTaxInsurance,
      projectedManagementFees: entry.projectedManagementFees,
    });
    setIsEditModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!forecast || !editingEntry) return;

    // Update the entry in the forecast
    const updatedEntries = forecast.entries.map(entry =>
      entry.monthYear === editingEntry.monthYear
        ? {
            ...entry,
            projectedRentIncome: formData.projectedRentIncome || 0,
            projectedOtherIncome: formData.projectedOtherIncome || 0,
            projectedMaintenanceExpenses: formData.projectedMaintenanceExpenses || 0,
            projectedOperatingExpenses: formData.projectedOperatingExpenses || 0,
            projectedPropertyTaxInsurance: formData.projectedPropertyTaxInsurance || 0,
            projectedManagementFees: formData.projectedManagementFees || 0,
            projectedNet:
              (formData.projectedRentIncome || 0) +
              (formData.projectedOtherIncome || 0) -
              (formData.projectedMaintenanceExpenses || 0) -
              (formData.projectedOperatingExpenses || 0) -
              (formData.projectedPropertyTaxInsurance || 0) -
              (formData.projectedManagementFees || 0),
          }
        : entry
    );

    const updatedForecast: CashflowForecast = {
      ...forecast,
      entries: updatedEntries,
      lastUpdated: new Date().toISOString(),
    };

    saveCashflowForecast(updatedForecast);
    loadData();
    setIsEditModalOpen(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0,
    }));
  };

  if (!forecast) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8">
          <p className="text-gray-600">Loading cashflow forecast...</p>
        </div>
      </div>
    );
  }

  // Calculate totals
  const totals = forecast.entries.reduce(
    (acc, entry) => ({
      projectedRentIncome: acc.projectedRentIncome + entry.projectedRentIncome,
      projectedOtherIncome: acc.projectedOtherIncome + entry.projectedOtherIncome,
      projectedMaintenanceExpenses: acc.projectedMaintenanceExpenses + entry.projectedMaintenanceExpenses,
      projectedOperatingExpenses: acc.projectedOperatingExpenses + entry.projectedOperatingExpenses,
      projectedPropertyTaxInsurance: acc.projectedPropertyTaxInsurance + entry.projectedPropertyTaxInsurance,
      projectedManagementFees: acc.projectedManagementFees + entry.projectedManagementFees,
      projectedNet: acc.projectedNet + entry.projectedNet,
      actualRentIncome: acc.actualRentIncome + entry.actualRentIncome,
      actualOtherIncome: acc.actualOtherIncome + entry.actualOtherIncome,
      actualMaintenanceExpenses: acc.actualMaintenanceExpenses + entry.actualMaintenanceExpenses,
      actualOperatingExpenses: acc.actualOperatingExpenses + entry.actualOperatingExpenses,
      actualPropertyTaxInsurance: acc.actualPropertyTaxInsurance + entry.actualPropertyTaxInsurance,
      actualManagementFees: acc.actualManagementFees + entry.actualManagementFees,
      actualNet: acc.actualNet + entry.actualNet,
      variance: acc.variance + entry.variance,
    }),
    {
      projectedRentIncome: 0,
      projectedOtherIncome: 0,
      projectedMaintenanceExpenses: 0,
      projectedOperatingExpenses: 0,
      projectedPropertyTaxInsurance: 0,
      projectedManagementFees: 0,
      projectedNet: 0,
      actualRentIncome: 0,
      actualOtherIncome: 0,
      actualMaintenanceExpenses: 0,
      actualOperatingExpenses: 0,
      actualPropertyTaxInsurance: 0,
      actualManagementFees: 0,
      actualNet: 0,
      variance: 0,
    }
  );

  // Prepare chart data
  const chartData = forecast.entries.map(entry => ({
    month: new Date(entry.monthYear + '-01').toLocaleDateString('en-UG', {
      month: 'short',
      year: '2-digit',
    }),
    Projected: entry.projectedNet,
    Actual: entry.actualNet,
  }));

  const incomeExpenseData = forecast.entries.map(entry => ({
    month: new Date(entry.monthYear + '-01').toLocaleDateString('en-UG', {
      month: 'short',
      year: '2-digit',
    }),
    'Projected Income': entry.projectedRentIncome + entry.projectedOtherIncome,
    'Projected Expenses':
      entry.projectedMaintenanceExpenses +
      entry.projectedOperatingExpenses +
      entry.projectedPropertyTaxInsurance +
      entry.projectedManagementFees,
    'Actual Income': entry.actualRentIncome + entry.actualOtherIncome,
    'Actual Expenses':
      entry.actualMaintenanceExpenses +
      entry.actualOperatingExpenses +
      entry.actualPropertyTaxInsurance +
      entry.actualManagementFees,
  }));

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">12-Month Cashflow Forecast</h1>
        <p className="text-gray-600 mt-2">
          <strong>Verne Harnish Principle:</strong> "Cash is oxygen - forecast 13 weeks minimum."
          This view integrates projected cashflow with actuals derived from the General Ledger (IFRS-compliant).
        </p>
        <p className="text-sm text-gray-500 mt-1">
          Last updated: {new Date(forecast.lastUpdated).toLocaleString('en-UG')}
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg shadow-md p-6 border border-blue-200">
          <h3 className="text-sm font-medium text-blue-600">12-Month Projected Net</h3>
          <p className="text-3xl font-bold text-blue-900 mt-2">{formatUGX(totals.projectedNet)}</p>
          <p className="text-sm text-blue-600 mt-1">Forecasted cash position</p>
        </div>
        <div className="bg-green-50 rounded-lg shadow-md p-6 border border-green-200">
          <h3 className="text-sm font-medium text-green-600">12-Month Actual Net</h3>
          <p className="text-3xl font-bold text-green-900 mt-2">{formatUGX(totals.actualNet)}</p>
          <p className="text-sm text-green-600 mt-1">From General Ledger</p>
        </div>
        <div
          className={`rounded-lg shadow-md p-6 border ${
            totals.variance >= 0
              ? 'bg-green-50 border-green-200'
              : 'bg-red-50 border-red-200'
          }`}
        >
          <h3
            className={`text-sm font-medium ${
              totals.variance >= 0 ? 'text-green-600' : 'text-red-600'
            }`}
          >
            12-Month Variance
          </h3>
          <p
            className={`text-3xl font-bold mt-2 ${
              totals.variance >= 0 ? 'text-green-900' : 'text-red-900'
            }`}
          >
            {totals.variance >= 0 ? '+' : ''}
            {formatUGX(totals.variance)}
          </p>
          <p
            className={`text-sm mt-1 ${
              totals.variance >= 0 ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {totals.variance >= 0 ? 'Above' : 'Below'} forecast
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Net Cashflow Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Net Cashflow: Projected vs Actual
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => formatUGX(value as number)} />
              <Legend />
              <Line type="monotone" dataKey="Projected" stroke="#3B82F6" strokeWidth={2} />
              <Line type="monotone" dataKey="Actual" stroke="#10B981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Income vs Expenses Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Income vs Expenses</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={incomeExpenseData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => formatUGX(value as number)} />
              <Legend />
              <Bar dataKey="Projected Income" fill="#10B981" />
              <Bar dataKey="Projected Expenses" fill="#EF4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Cashflow Table */}
      <div className="bg-white rounded-lg shadow-md overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                rowSpan={2}
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r"
              >
                Month
              </th>
              <th
                colSpan={3}
                className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r bg-blue-50"
              >
                Income
              </th>
              <th
                colSpan={4}
                className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r bg-red-50"
              >
                Expenses
              </th>
              <th
                colSpan={2}
                className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r bg-green-50"
              >
                Net
              </th>
              <th
                rowSpan={2}
                className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider bg-purple-50"
              >
                Variance
              </th>
              <th rowSpan={2} className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
            <tr>
              {/* Income Subheaders */}
              <th className="px-4 py-2 text-left text-xs font-medium text-blue-600 bg-blue-50">
                Rent
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-blue-600 bg-blue-50">
                Other
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-blue-600 bg-blue-50 border-r">
                Total Income
              </th>

              {/* Expense Subheaders */}
              <th className="px-4 py-2 text-left text-xs font-medium text-red-600 bg-red-50">
                Maintenance
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-red-600 bg-red-50">
                Operating
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-red-600 bg-red-50">
                Tax/Insur
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-red-600 bg-red-50 border-r">
                Mgmt Fees
              </th>

              {/* Net Subheaders */}
              <th className="px-4 py-2 text-left text-xs font-medium text-green-600 bg-green-50">
                Projected
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-green-600 bg-green-50 border-r">
                Actual
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {forecast.entries.map((entry, index) => {
              const totalIncome = entry.projectedRentIncome + entry.projectedOtherIncome;
              const actualTotalIncome = entry.actualRentIncome + entry.actualOtherIncome;
              const varianceClass =
                entry.variance >= 0 ? 'text-green-700 font-semibold' : 'text-red-700 font-semibold';

              return (
                <tr key={entry.monthYear} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 border-r">
                    {new Date(entry.monthYear + '-01').toLocaleDateString('en-UG', {
                      month: 'short',
                      year: 'numeric',
                    })}
                  </td>

                  {/* Income Columns */}
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                    {formatUGX(entry.projectedRentIncome)}
                    {entry.actualRentIncome > 0 && (
                      <div className="text-xs text-green-600">
                        {formatUGX(entry.actualRentIncome)}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                    {formatUGX(entry.projectedOtherIncome)}
                    {entry.actualOtherIncome > 0 && (
                      <div className="text-xs text-green-600">
                        {formatUGX(entry.actualOtherIncome)}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-blue-700 border-r">
                    {formatUGX(totalIncome)}
                    {actualTotalIncome > 0 && (
                      <div className="text-xs text-green-600 font-normal">
                        {formatUGX(actualTotalIncome)}
                      </div>
                    )}
                  </td>

                  {/* Expense Columns */}
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                    {formatUGX(entry.projectedMaintenanceExpenses)}
                    {entry.actualMaintenanceExpenses > 0 && (
                      <div className="text-xs text-red-600">
                        {formatUGX(entry.actualMaintenanceExpenses)}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                    {formatUGX(entry.projectedOperatingExpenses)}
                    {entry.actualOperatingExpenses > 0 && (
                      <div className="text-xs text-red-600">
                        {formatUGX(entry.actualOperatingExpenses)}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                    {formatUGX(entry.projectedPropertyTaxInsurance)}
                    {entry.actualPropertyTaxInsurance > 0 && (
                      <div className="text-xs text-red-600">
                        {formatUGX(entry.actualPropertyTaxInsurance)}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 border-r">
                    {formatUGX(entry.projectedManagementFees)}
                    {entry.actualManagementFees > 0 && (
                      <div className="text-xs text-red-600">
                        {formatUGX(entry.actualManagementFees)}
                      </div>
                    )}
                  </td>

                  {/* Net Columns */}
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-green-700">
                    {formatUGX(entry.projectedNet)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-green-700 border-r">
                    {formatUGX(entry.actualNet)}
                  </td>

                  {/* Variance */}
                  <td className={`px-4 py-3 whitespace-nowrap text-sm ${varianceClass}`}>
                    {entry.variance >= 0 ? '+' : ''}
                    {formatUGX(entry.variance)}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-center">
                    <button
                      onClick={() => openEditModal(entry)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              );
            })}

            {/* Totals Row */}
            <tr className="bg-indigo-100 font-bold">
              <td className="px-4 py-3 text-sm text-gray-900 border-r">TOTAL (12 Months)</td>
              <td className="px-4 py-3 text-sm text-gray-900">
                {formatUGX(totals.projectedRentIncome)}
              </td>
              <td className="px-4 py-3 text-sm text-gray-900">
                {formatUGX(totals.projectedOtherIncome)}
              </td>
              <td className="px-4 py-3 text-sm text-blue-700 border-r">
                {formatUGX(totals.projectedRentIncome + totals.projectedOtherIncome)}
              </td>
              <td className="px-4 py-3 text-sm text-gray-900">
                {formatUGX(totals.projectedMaintenanceExpenses)}
              </td>
              <td className="px-4 py-3 text-sm text-gray-900">
                {formatUGX(totals.projectedOperatingExpenses)}
              </td>
              <td className="px-4 py-3 text-sm text-gray-900">
                {formatUGX(totals.projectedPropertyTaxInsurance)}
              </td>
              <td className="px-4 py-3 text-sm text-gray-900 border-r">
                {formatUGX(totals.projectedManagementFees)}
              </td>
              <td className="px-4 py-3 text-sm text-green-700">{formatUGX(totals.projectedNet)}</td>
              <td className="px-4 py-3 text-sm text-green-700 border-r">
                {formatUGX(totals.actualNet)}
              </td>
              <td
                className={`px-4 py-3 text-sm ${
                  totals.variance >= 0 ? 'text-green-700' : 'text-red-700'
                }`}
              >
                {totals.variance >= 0 ? '+' : ''}
                {formatUGX(totals.variance)}
              </td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Lean Finance Note */}
      <div className="mt-6 bg-indigo-50 border border-indigo-200 rounded-lg p-6">
        <h3 className="font-semibold text-indigo-900 mb-2">📊 Lean Finance Integration</h3>
        <p className="text-sm text-indigo-800 mb-2">
          <strong>How it works:</strong>
        </p>
        <ul className="list-disc list-inside text-sm text-indigo-800 space-y-1">
          <li>
            <strong>Projected values:</strong> You manually set forecasts based on historical trends and expected changes
          </li>
          <li>
            <strong>Actual values:</strong> Automatically calculated from General Ledger entries (IFRS double-entry bookkeeping)
          </li>
          <li>
            <strong>Variance analysis:</strong> Positive = beating forecast, Negative = below forecast
          </li>
          <li>
            <strong>Griswold principle:</strong> Category-based expense tracking for granular control
          </li>
          <li>
            <strong>Harnish principle:</strong> 13-week rolling visibility to prevent cash crises
          </li>
        </ul>
      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title={`Edit Projected Cashflow - ${editingEntry ? new Date(editingEntry.monthYear + '-01').toLocaleDateString('en-UG', { month: 'long', year: 'numeric' }) : ''}`}
      >
        <form onSubmit={handleSubmit}>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <h4 className="font-semibold text-blue-900 mb-2">Projected Income</h4>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Rent Income (UGX)"
                name="projectedRentIncome"
                type="number"
                value={formData.projectedRentIncome}
                onChange={handleChange}
                required
                min="0"
                step="1000"
              />
              <Input
                label="Other Income (UGX)"
                name="projectedOtherIncome"
                type="number"
                value={formData.projectedOtherIncome}
                onChange={handleChange}
                required
                min="0"
                step="1000"
              />
            </div>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <h4 className="font-semibold text-red-900 mb-2">Projected Expenses</h4>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Maintenance (UGX)"
                name="projectedMaintenanceExpenses"
                type="number"
                value={formData.projectedMaintenanceExpenses}
                onChange={handleChange}
                required
                min="0"
                step="1000"
              />
              <Input
                label="Operating (UGX)"
                name="projectedOperatingExpenses"
                type="number"
                value={formData.projectedOperatingExpenses}
                onChange={handleChange}
                required
                min="0"
                step="1000"
              />
              <Input
                label="Tax/Insurance (UGX)"
                name="projectedPropertyTaxInsurance"
                type="number"
                value={formData.projectedPropertyTaxInsurance}
                onChange={handleChange}
                required
                min="0"
                step="1000"
              />
              <Input
                label="Management Fees (UGX)"
                name="projectedManagementFees"
                type="number"
                value={formData.projectedManagementFees}
                onChange={handleChange}
                required
                min="0"
                step="1000"
              />
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-green-800">
              <strong>Projected Net:</strong>{' '}
              {formatUGX(
                (formData.projectedRentIncome || 0) +
                  (formData.projectedOtherIncome || 0) -
                  (formData.projectedMaintenanceExpenses || 0) -
                  (formData.projectedOperatingExpenses || 0) -
                  (formData.projectedPropertyTaxInsurance || 0) -
                  (formData.projectedManagementFees || 0)
              )}
            </p>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button type="button" variant="secondary" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Forecast</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
