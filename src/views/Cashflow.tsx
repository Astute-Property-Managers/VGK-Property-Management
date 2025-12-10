import React, { useEffect, useState } from 'react';
import { Header } from '../components/layout/Header';
import { Card } from '../components/ui/Card';
import { dataService } from '../services/data.service';
import { CashflowEntry } from '../types';
import { formatCurrency, getMonthName } from '../utils/formatting';
import { groupBy } from '../utils/helpers';

export function Cashflow() {
  const [entries, setEntries] = useState<CashflowEntry[]>([]);

  useEffect(() => {
    setEntries(dataService.getAllCashflowEntries());
  }, []);

  const groupedByMonth = groupBy(entries, 'month');
  const months = Object.keys(groupedByMonth).sort();

  return (
    <div>
      <Header
        title="Cashflow Forecast"
        subtitle="12-month cashflow projection with actual vs. projected analysis"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {months.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No cashflow data available yet.</p>
              <p className="text-sm text-gray-400">
                Cashflow forecasting will be automatically populated as you record income and expenses.
              </p>
            </div>
          </Card>
        ) : (
          <div className="space-y-6">
            {months.map((month) => {
              const monthEntries = groupedByMonth[month];
              const totalProjected = monthEntries
                .filter((e) => e.accountCategory === 'income')
                .reduce((sum, e) => sum + e.projectedAmount, 0) -
                monthEntries
                .filter((e) => e.accountCategory === 'expense')
                .reduce((sum, e) => sum + e.projectedAmount, 0);

              const totalActual = monthEntries
                .filter((e) => e.accountCategory === 'income')
                .reduce((sum, e) => sum + e.actualAmount, 0) -
                monthEntries
                .filter((e) => e.accountCategory === 'expense')
                .reduce((sum, e) => sum + e.actualAmount, 0);

              return (
                <Card key={month}>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">{getMonthName(month)}</h3>

                  <div className="grid grid-cols-3 gap-6 mb-6">
                    <div>
                      <p className="text-sm text-gray-600">Projected Net</p>
                      <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalProjected)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Actual Net</p>
                      <p className="text-2xl font-bold text-indigo-600">{formatCurrency(totalActual)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Variance</p>
                      <p className={`text-2xl font-bold ${totalActual - totalProjected >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(totalActual - totalProjected)}
                      </p>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Account</th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Projected</th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actual</th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Variance</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {monthEntries.map((entry) => (
                          <tr key={entry.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.accountName}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                              {formatCurrency(entry.projectedAmount)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-gray-900">
                              {formatCurrency(entry.actualAmount)}
                            </td>
                            <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-medium ${
                              entry.variance >= 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {formatCurrency(entry.variance)} ({entry.variancePercent.toFixed(1)}%)
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
