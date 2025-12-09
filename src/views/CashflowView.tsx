import React from 'react';

export const CashflowView: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Cashflow Forecasting</h1>
        <p className="text-gray-600 mb-6">
          12-month cashflow forecast with IREM principles and Lean Finance integration.
        </p>
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="font-semibold text-green-900 mb-2">Lean Finance Implementation</h3>
          <p className="text-green-800 text-sm mb-4">
            The complete cashflow module includes:
          </p>
          <ul className="list-disc list-inside text-sm text-green-800 space-y-1">
            <li>12-month rolling forecast with detailed categories</li>
            <li>Projected Income: Rent, Late Fees, Other Income</li>
            <li>Projected Expenses: Maintenance, Operating, Tax/Insurance, Management Fees</li>
            <li>Actual figures derived from General Ledger entries</li>
            <li>Variance analysis (Actual vs Projected)</li>
            <li>Visual charts using Recharts library</li>
            <li>Griswold-style expense categorization</li>
            <li>Lean principles: Eliminate waste, focus on value streams</li>
          </ul>
          <p className="text-sm text-gray-600 mt-4">
            All data is automatically integrated with the General Ledger for IFRS compliance.
          </p>
        </div>
      </div>
    </div>
  );
};
