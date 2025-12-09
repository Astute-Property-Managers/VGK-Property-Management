import React from 'react';

export const FinancialOverview: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Financial Overview</h1>
        <p className="text-gray-600 mb-6">
          Comprehensive financial dashboard integrating Lean Finance, IREM standards, and CPA Uganda/IFRS compliance.
        </p>

        <div className="space-y-6">
          {/* Lean Financial Insights */}
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
            <h3 className="font-semibold text-indigo-900 mb-2">Lean Financial Insights</h3>
            <p className="text-sm text-indigo-800 mb-3">
              Real-time actionable insights focusing on the vital 20% of metrics (Pareto Principle)
            </p>
            <ul className="list-disc list-inside text-sm text-indigo-800 space-y-1">
              <li>Net Operating Income (NOI) - Primary profitability metric</li>
              <li>Operating Expense Ratio (OER) - Cost efficiency tracking</li>
              <li>Rent Collection Rate - Cash flow health indicator</li>
              <li>Vacancy Loss - Opportunity cost measurement</li>
            </ul>
          </div>

          {/* Operational Reports (Griswold's Focus) */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-semibold text-blue-900 mb-2">Operational Financial Reports</h3>
            <p className="text-sm text-blue-800 mb-3">
              Day-to-day management reports for operational excellence
            </p>
            <ul className="list-disc list-inside text-sm text-blue-800 space-y-1">
              <li>Rent Roll Report - Current and projected rental income</li>
              <li>Aged Receivables Report - Track overdue payments</li>
              <li>Vacancy Report - Unit-level vacancy analysis</li>
              <li>Maintenance Expense Summary - Cost control by category</li>
              <li>Owner Payout Statements - Transparent owner reporting</li>
            </ul>
          </div>

          {/* Formal Compliance Reports */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
            <h3 className="font-semibold text-purple-900 mb-2">Key Financial Reports (IFRS/CPA Uganda)</h3>
            <p className="text-sm text-purple-800 mb-3">
              Formal financial statements for external reporting and compliance
            </p>
            <ul className="list-disc list-inside text-sm text-purple-800 space-y-1">
              <li>Income Statement (P&L) - IFRS-compliant profit analysis</li>
              <li>Balance Sheet - Asset, liability, and equity positions</li>
              <li>Cash Flow Statement - Direct/Indirect method</li>
              <li>Trial Balance - Account reconciliation</li>
              <li>General Ledger - Complete audit trail</li>
            </ul>
          </div>

          {/* IFRS Compliance Notes */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-2">IFRS & URA Compliance Considerations</h3>
            <p className="text-sm text-gray-700 mb-3">
              Bridging operational management with regulatory requirements
            </p>
            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
              <li><strong>IFRS 16 (Leases):</strong> Lease liability calculations for balance sheet recognition</li>
              <li><strong>IAS 40 (Investment Property):</strong> Fair value or cost model valuation</li>
              <li><strong>IAS 16 (PPE):</strong> Capital vs operating expenditure classification</li>
              <li><strong>URA Compliance:</strong> Structured data for VAT and Income Tax filings</li>
              <li><strong>Accrual Accounting:</strong> Revenue and expense matching per period</li>
            </ul>
          </div>
        </div>

        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>⚠️ Note:</strong> Full implementation includes dynamic calculation of all metrics,
            integration with the General Ledger, and automated report generation. See IMPLEMENTATION_STATUS.md for details.
          </p>
        </div>
      </div>
    </div>
  );
};
