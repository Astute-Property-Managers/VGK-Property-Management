import { useState, useEffect } from 'react';
import type { OwnerStatement, Property, Tenant, MaintenanceRequest, GeneralLedgerEntry, Vendor } from '../types';
import { sanitizeHtml } from '../services/securityService';

/**
 * OWNER STATEMENTS MODULE
 * Comprehensive monthly financial statements for property owners
 *
 * Features:
 * - Rent roll with collection status
 * - Expense ledger with maintenance linkage
 * - Management fee calculation
 * - Variance analysis vs previous month
 * - Net owner disbursement calculation
 * - PDF export capability (placeholder)
 */

export function OwnerStatementsView() {
  const [statements, setStatements] = useState<OwnerStatement[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [maintenanceRequests, setMaintenanceRequests] = useState<MaintenanceRequest[]>([]);
  const [generalLedger, setGeneralLedger] = useState<GeneralLedgerEntry[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedStatement, setSelectedStatement] = useState<OwnerStatement | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  function loadData() {
    const stored = localStorage.getItem('vgk_data');
    if (stored) {
      const data = JSON.parse(stored);
      setStatements(data.ownerStatements || []);
      setProperties(data.properties || []);
      setTenants(data.tenants || []);
      setMaintenanceRequests(data.maintenanceRequests || []);
      setGeneralLedger(data.generalLedger || []);
      setVendors(data.vendors || []);
    }
  }

  function saveStatements(stmts: OwnerStatement[]) {
    const stored = localStorage.getItem('vgk_data');
    if (stored) {
      const data = JSON.parse(stored);
      data.ownerStatements = stmts;
      localStorage.setItem('vgk_data', JSON.stringify(data));
      setStatements(stmts);
    }
  }

  function handleGenerateStatement(propertyId: string, period: string) {
    const statement = generateStatement(propertyId, period);
    saveStatements([...statements, statement]);
    alert('Statement generated successfully!');
  }

  function generateStatement(propertyId: string, period: string): OwnerStatement {
    const property = properties.find(p => p.id === propertyId);
    if (!property) throw new Error('Property not found');

    // Get tenants for this property
    const propertyTenants = tenants.filter(t => t.propertyId === propertyId);

    // Build Rent Roll
    const rentRoll = propertyTenants.map(tenant => {
      let amountReceived = 0;
      let status: 'Paid' | 'Partial' | 'Unpaid' = 'Unpaid';

      if (tenant.paymentStatus === 'Paid') {
        amountReceived = tenant.rentAmount;
        status = 'Paid';
      } else if (tenant.paymentStatus === 'Due') {
        amountReceived = tenant.rentAmount * 0.5;
        status = 'Partial';
      } else {
        amountReceived = 0;
        status = 'Unpaid';
      }

      return {
        unitNumber: tenant.unitNumber,
        tenantName: tenant.name,
        rentAmount: tenant.rentAmount,
        amountReceived,
        status,
      };
    });

    const totalRentDue = rentRoll.reduce((sum, r) => sum + r.rentAmount, 0);
    const totalRentReceived = rentRoll.reduce((sum, r) => sum + r.amountReceived, 0);
    const collectionRate = totalRentDue > 0 ? (totalRentReceived / totalRentDue) * 100 : 0;

    // Get maintenance for this property in the period
    const [year, month] = period.split('-').map(Number);
    const periodStart = new Date(year, month - 1, 1);
    const periodEnd = new Date(year, month, 0);

    const periodMaintenance = maintenanceRequests.filter(req => {
      if (req.propertyId !== propertyId) return false;
      if (req.status !== 'Completed' || !req.dateCompleted) return false;
      const completedDate = new Date(req.dateCompleted);
      return completedDate >= periodStart && completedDate <= periodEnd;
    });

    // Maintenance Summary
    const maintenanceSummary = periodMaintenance.map(req => {
      const vendor = vendors.find(v => v.id === req.assignedVendorId);
      return {
        requestId: req.id,
        date: req.dateCompleted || '',
        description: req.description,
        vendor: vendor ? vendor.name : 'N/A',
        cost: req.actualCost || req.estimatedCost || 0,
      };
    });

    const totalMaintenanceCost = maintenanceSummary.reduce((sum, m) => sum + m.cost, 0);

    // Get expenses from General Ledger for this property and period
    const periodLedger = generalLedger.filter(entry => {
      if (entry.propertyId !== propertyId) return false;
      const entryDate = new Date(entry.date);
      return entryDate >= periodStart && entryDate <= periodEnd;
    });

    // Build expense list (debits in expense accounts)
    const expenses = periodLedger
      .filter(entry => entry.debit > 0 && entry.accountId.startsWith('acc-5')) // Expense accounts
      .map(entry => ({
        date: entry.date,
        category: 'Operating Expense',
        description: entry.description,
        amount: entry.debit,
        relatedMaintenanceId: entry.relatedEntityType === 'maintenance' ? entry.relatedEntityId : undefined,
      }));

    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

    // Management Fee (typically 8-10% of gross rent)
    const managementFeeRate = 10; // 10%
    const managementFeeAmount = (totalRentReceived * managementFeeRate) / 100;

    // Calculate Net Owner Disbursement
    const grossIncome = totalRentReceived;
    const totalDeductions = totalExpenses + totalMaintenanceCost + managementFeeAmount;
    const netDisbursement = grossIncome - totalDeductions;

    // Variance Analysis (compare to previous month if exists)
    const previousMonth = getPreviousMonth(period);
    const previousStatement = statements.find(s => s.propertyId === propertyId && s.statementPeriod === previousMonth);
    const previousMonthNetIncome = previousStatement?.currentMonthNetIncome || 0;
    const currentMonthNetIncome = netDisbursement;
    const varianceAmount = currentMonthNetIncome - previousMonthNetIncome;
    const variancePercentage = previousMonthNetIncome > 0 ? (varianceAmount / previousMonthNetIncome) * 100 : 0;

    return {
      id: `stmt-${Date.now()}`,
      ownerId: property.owner || 'owner-1',
      propertyId: property.id,
      statementPeriod: period,
      generatedDate: new Date().toISOString().split('T')[0],
      generatedBy: 'System',
      rentRoll,
      totalRentDue,
      totalRentReceived,
      collectionRate,
      expenses,
      totalExpenses,
      maintenanceSummary,
      totalMaintenanceCost,
      managementFeeRate,
      managementFeeAmount,
      previousMonthNetIncome,
      currentMonthNetIncome,
      varianceAmount,
      variancePercentage,
      grossIncome,
      totalDeductions,
      netDisbursement,
      managerCommentary: '',
    };
  }

  function getPreviousMonth(period: string): string {
    const [year, month] = period.split('-').map(Number);
    const prevDate = new Date(year, month - 2, 1); // month-2 because month is 1-indexed but Date is 0-indexed
    const prevYear = prevDate.getFullYear();
    const prevMonth = (prevDate.getMonth() + 1).toString().padStart(2, '0');
    return `${prevYear}-${prevMonth}`;
  }

  function handleViewStatement(statement: OwnerStatement) {
    setSelectedStatement(statement);
    setShowModal(true);
  }

  function handleUpdateCommentary(commentary: string) {
    if (!selectedStatement) return;
    const updated = statements.map(s =>
      s.id === selectedStatement.id ? { ...s, managerCommentary: sanitizeHtml(commentary) } : s
    );
    saveStatements(updated);
    setSelectedStatement({ ...selectedStatement, managerCommentary: commentary });
  }

  function formatUGX(amount: number): string {
    return `${amount.toLocaleString()} UGX`;
  }

  function getPropertyName(propertyId: string): string {
    const property = properties.find(p => p.id === propertyId);
    return property ? property.name : 'Unknown';
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Owner Statements</h1>
          <p className="text-gray-600 mt-1">Comprehensive Monthly Financial Reporting</p>
        </div>
      </div>

      {/* Generate New Statement */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Generate New Statement</h2>
        <div className="grid grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Property</label>
            <select
              id="property-select"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              defaultValue=""
            >
              <option value="">Select Property</option>
              {properties.map(prop => (
                <option key={prop.id} value={prop.id}>
                  {prop.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Period (YYYY-MM)</label>
            <input
              type="month"
              id="period-input"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <button
            onClick={() => {
              const propertyId = (document.getElementById('property-select') as HTMLSelectElement).value;
              const period = (document.getElementById('period-input') as HTMLInputElement).value;
              if (!propertyId || !period) {
                alert('Please select property and period');
                return;
              }
              handleGenerateStatement(propertyId, period);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Generate Statement
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600">Total Statements</div>
          <div className="text-2xl font-bold text-blue-600">{statements.length}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600">Avg Collection Rate</div>
          <div className="text-2xl font-bold text-green-600">
            {statements.length > 0
              ? (statements.reduce((sum, s) => sum + s.collectionRate, 0) / statements.length).toFixed(1)
              : 0}
            %
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600">Total Disbursed</div>
          <div className="text-2xl font-bold text-purple-600">
            {formatUGX(statements.reduce((sum, s) => sum + s.netDisbursement, 0))}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600">Avg Management Fee</div>
          <div className="text-2xl font-bold text-orange-600">
            {formatUGX(
              statements.length > 0
                ? statements.reduce((sum, s) => sum + s.managementFeeAmount, 0) / statements.length
                : 0
            )}
          </div>
        </div>
      </div>

      {/* Statements Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Generated Statements</h2>
        </div>

        {statements.length === 0 ? (
          <div className="px-6 py-12 text-center text-gray-500">
            No statements generated yet. Use the form above to generate an owner statement.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Property</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Period</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Gross Income</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Expenses</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Management Fee</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Net Disbursement</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Collection %</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {statements
                  .sort((a, b) => b.statementPeriod.localeCompare(a.statementPeriod))
                  .map(statement => (
                    <tr key={statement.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">{getPropertyName(statement.propertyId)}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{statement.statementPeriod}</td>
                      <td className="px-6 py-4 text-sm text-green-600 font-medium">
                        {formatUGX(statement.grossIncome)}
                      </td>
                      <td className="px-6 py-4 text-sm text-red-600">-{formatUGX(statement.totalExpenses)}</td>
                      <td className="px-6 py-4 text-sm text-orange-600">
                        -{formatUGX(statement.managementFeeAmount)}
                      </td>
                      <td className="px-6 py-4 text-sm text-blue-600 font-bold">
                        {formatUGX(statement.netDisbursement)}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`${
                            statement.collectionRate >= 95
                              ? 'text-green-600'
                              : statement.collectionRate >= 80
                              ? 'text-yellow-600'
                              : 'text-red-600'
                          } font-medium`}
                        >
                          {statement.collectionRate.toFixed(1)}%
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleViewStatement(statement)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Statement Detail Modal */}
      {showModal && selectedStatement && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Owner Statement</h2>
                <p className="text-sm text-gray-600">
                  {getPropertyName(selectedStatement.propertyId)} - {selectedStatement.statementPeriod}
                </p>
              </div>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
                <span className="text-2xl">×</span>
              </button>
            </div>

            <div className="px-6 py-4 space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-sm text-green-600 font-medium">Gross Income</div>
                  <div className="text-xl font-bold text-green-700">{formatUGX(selectedStatement.grossIncome)}</div>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <div className="text-sm text-red-600 font-medium">Total Deductions</div>
                  <div className="text-xl font-bold text-red-700">-{formatUGX(selectedStatement.totalDeductions)}</div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-sm text-blue-600 font-medium">Net Disbursement</div>
                  <div className="text-xl font-bold text-blue-700">
                    {formatUGX(selectedStatement.netDisbursement)}
                  </div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="text-sm text-purple-600 font-medium">Collection Rate</div>
                  <div className="text-xl font-bold text-purple-700">{selectedStatement.collectionRate.toFixed(1)}%</div>
                </div>
              </div>

              {/* Rent Roll */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Rent Roll</h3>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Unit</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Tenant</th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Rent Due</th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                          Received
                        </th>
                        <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {selectedStatement.rentRoll.map((entry, index) => (
                        <tr key={index}>
                          <td className="px-4 py-2 text-gray-900">{entry.unitNumber}</td>
                          <td className="px-4 py-2 text-gray-900">{entry.tenantName}</td>
                          <td className="px-4 py-2 text-right text-gray-900">{formatUGX(entry.rentAmount)}</td>
                          <td className="px-4 py-2 text-right text-green-600 font-medium">
                            {formatUGX(entry.amountReceived)}
                          </td>
                          <td className="px-4 py-2 text-center">
                            <span
                              className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                entry.status === 'Paid'
                                  ? 'bg-green-100 text-green-800'
                                  : entry.status === 'Unpaid'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}
                            >
                              {entry.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-gray-50 font-medium">
                        <td colSpan={2} className="px-4 py-2 text-gray-900">
                          Totals
                        </td>
                        <td className="px-4 py-2 text-right text-gray-900">
                          {formatUGX(selectedStatement.totalRentDue)}
                        </td>
                        <td className="px-4 py-2 text-right text-green-600">
                          {formatUGX(selectedStatement.totalRentReceived)}
                        </td>
                        <td className="px-4 py-2 text-center text-gray-900">
                          {selectedStatement.collectionRate.toFixed(1)}%
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Maintenance Summary */}
              {selectedStatement.maintenanceSummary.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Maintenance Summary</h3>
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                            Description
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Vendor</th>
                          <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Cost</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {selectedStatement.maintenanceSummary.map((item, index) => (
                          <tr key={index}>
                            <td className="px-4 py-2 text-gray-900">{item.date}</td>
                            <td className="px-4 py-2 text-gray-900">{item.description}</td>
                            <td className="px-4 py-2 text-gray-900">{item.vendor}</td>
                            <td className="px-4 py-2 text-right text-red-600">{formatUGX(item.cost)}</td>
                          </tr>
                        ))}
                        <tr className="bg-gray-50 font-medium">
                          <td colSpan={3} className="px-4 py-2 text-gray-900">
                            Total Maintenance
                          </td>
                          <td className="px-4 py-2 text-right text-red-600">
                            {formatUGX(selectedStatement.totalMaintenanceCost)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Expense Ledger */}
              {selectedStatement.expenses.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Expense Ledger</h3>
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                            Description
                          </th>
                          <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {selectedStatement.expenses.map((expense, index) => (
                          <tr key={index}>
                            <td className="px-4 py-2 text-gray-900">{expense.date}</td>
                            <td className="px-4 py-2 text-gray-900">{expense.category}</td>
                            <td className="px-4 py-2 text-gray-900">{expense.description}</td>
                            <td className="px-4 py-2 text-right text-red-600">{formatUGX(expense.amount)}</td>
                          </tr>
                        ))}
                        <tr className="bg-gray-50 font-medium">
                          <td colSpan={3} className="px-4 py-2 text-gray-900">
                            Total Expenses
                          </td>
                          <td className="px-4 py-2 text-right text-red-600">
                            {formatUGX(selectedStatement.totalExpenses)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Financial Summary */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Financial Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Gross Rental Income:</span>
                    <span className="font-medium text-gray-900">{formatUGX(selectedStatement.grossIncome)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Operating Expenses:</span>
                    <span className="font-medium text-red-600">-{formatUGX(selectedStatement.totalExpenses)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Maintenance Costs:</span>
                    <span className="font-medium text-red-600">
                      -{formatUGX(selectedStatement.totalMaintenanceCost)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">
                      Management Fee ({selectedStatement.managementFeeRate}%):
                    </span>
                    <span className="font-medium text-red-600">
                      -{formatUGX(selectedStatement.managementFeeAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t-2 border-blue-200">
                    <span className="text-gray-900 font-bold">Net Owner Disbursement:</span>
                    <span className="font-bold text-blue-600 text-lg">
                      {formatUGX(selectedStatement.netDisbursement)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Variance Analysis */}
              {selectedStatement.previousMonthNetIncome !== undefined && selectedStatement.previousMonthNetIncome > 0 && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Variance Analysis</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-700">Previous Month Net Income:</span>
                      <span className="font-medium text-gray-900">
                        {formatUGX(selectedStatement.previousMonthNetIncome)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Current Month Net Income:</span>
                      <span className="font-medium text-gray-900">
                        {formatUGX(selectedStatement.currentMonthNetIncome)}
                      </span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-gray-300">
                      <span className="text-gray-900 font-medium">Variance:</span>
                      <span
                        className={`font-medium ${
                          selectedStatement.varianceAmount >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {selectedStatement.varianceAmount >= 0 ? '+' : ''}
                        {formatUGX(selectedStatement.varianceAmount)} ({selectedStatement.variancePercentage.toFixed(1)}
                        %)
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Manager Commentary */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Manager Commentary</h3>
                <textarea
                  value={selectedStatement.managerCommentary || ''}
                  onChange={e => handleUpdateCommentary(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Add commentary about this statement, notable events, or recommendations..."
                ></textarea>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => alert('PDF export functionality would be implemented here using a library like jsPDF')}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                📄 Export PDF
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
