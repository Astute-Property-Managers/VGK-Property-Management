import { useEffect, useState } from 'react';
import { Header } from '../components/layout/Header';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { dataService } from '../services/data.service';
import { Account } from '../types';
import { formatCurrency, formatStatus } from '../utils/formatting';

export function Accounts() {
  const [accounts, setAccounts] = useState<Account[]>([]);

  useEffect(() => {
    setAccounts(dataService.getAllAccounts());
  }, []);

  const groupedAccounts = accounts.reduce((acc, account) => {
    if (!acc[account.category]) {
      acc[account.category] = [];
    }
    acc[account.category].push(account);
    return acc;
  }, {} as Record<string, Account[]>);

  const categoryOrder = ['asset', 'liability', 'equity', 'income', 'expense'];

  const getCategoryBadge = (category: string) => {
    const variants: Record<string, 'success' | 'danger' | 'info' | 'warning' | 'gray'> = {
      asset: 'success',
      liability: 'danger',
      equity: 'info',
      income: 'success',
      expense: 'warning',
    };
    return <Badge variant={variants[category] || 'gray'}>{formatStatus(category)}</Badge>;
  };

  return (
    <div>
      <Header
        title="Chart of Accounts"
        subtitle="IFRS-compliant account structure for Uganda"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {categoryOrder.map((category) => {
            const categoryAccounts = groupedAccounts[category] || [];
            if (categoryAccounts.length === 0) return null;

            const totalBalance = categoryAccounts.reduce((sum, acc) => sum + acc.currentBalance, 0);

            return (
              <div key={category}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl font-semibold text-gray-900 capitalize">{category} Accounts</h2>
                    {getCategoryBadge(category)}
                  </div>
                  <p className="text-lg font-semibold text-gray-900">
                    Total: {formatCurrency(totalBalance)}
                  </p>
                </div>

                <Card padding="none">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Account Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Normal Balance</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Current Balance</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {categoryAccounts.map((account) => (
                        <tr key={account.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {account.code}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {account.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                            {formatStatus(account.type)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                            {account.normalBalance}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-gray-900">
                            {formatCurrency(account.currentBalance)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Card>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
