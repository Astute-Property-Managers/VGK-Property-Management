import React, { useEffect, useState } from 'react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Select } from '../components/Select';
import { Modal } from '../components/Modal';
import { getAccounts, saveAccount, deleteAccount, formatUGX } from '../services/dataService';
import type { Account, AccountCategory } from '../types';

export const ChartOfAccountsView: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [formData, setFormData] = useState<Partial<Account>>({
    number: '',
    name: '',
    category: 'Asset',
    type: '',
    description: '',
    balance: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const data = getAccounts();
    setAccounts(data);
  };

  const openAddModal = () => {
    setEditingAccount(null);
    setFormData({
      number: '',
      name: '',
      category: 'Asset',
      type: '',
      description: '',
      balance: 0,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (account: Account) => {
    setEditingAccount(account);
    setFormData(account);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const account: Account = {
      id: editingAccount?.id || '',
      number: formData.number!,
      name: formData.name!,
      category: formData.category!,
      type: formData.type!,
      description: formData.description!,
      balance: formData.balance,
    };

    saveAccount(account);
    loadData();
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this account? This may affect financial reports.')) {
      deleteAccount(id);
      loadData();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'balance' ? parseFloat(value) || 0 : value,
    }));
  };

  // Group accounts by category
  const groupedAccounts = accounts.reduce((acc, account) => {
    if (!acc[account.category]) {
      acc[account.category] = [];
    }
    acc[account.category].push(account);
    return acc;
  }, {} as Record<AccountCategory, Account[]>);

  // Calculate category totals
  const categoryTotals = Object.entries(groupedAccounts).reduce((acc, [category, accts]) => {
    acc[category as AccountCategory] = accts.reduce((sum, acct) => sum + (acct.balance || 0), 0);
    return acc;
  }, {} as Record<AccountCategory, number>);

  const categoryOrder: AccountCategory[] = ['Asset', 'Liability', 'Equity', 'Income', 'Expense'];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Chart of Accounts</h1>
        <p className="text-gray-600 mt-2">
          <strong>IFRS-Compliant:</strong> Double-entry bookkeeping foundation.
          Manage your account structure for accurate financial reporting (ICPAU/CPA Uganda standards).
        </p>
      </div>

      {/* Actions */}
      <div className="mb-4">
        <Button onClick={openAddModal}>+ Add Account</Button>
      </div>

      {/* Accounts by Category */}
      <div className="space-y-6">
        {categoryOrder.map(category => {
          const categoryAccounts = groupedAccounts[category] || [];
          if (categoryAccounts.length === 0) return null;

          const categoryColor = {
            Asset: 'bg-blue-50 border-blue-200 text-blue-900',
            Liability: 'bg-red-50 border-red-200 text-red-900',
            Equity: 'bg-purple-50 border-purple-200 text-purple-900',
            Income: 'bg-green-50 border-green-200 text-green-900',
            Expense: 'bg-orange-50 border-orange-200 text-orange-900',
          };

          return (
            <div key={category} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className={`p-4 border-b ${categoryColor[category]}`}>
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold">{category}</h3>
                  <span className="text-lg font-bold">
                    {formatUGX(categoryTotals[category] || 0)}
                  </span>
                </div>
              </div>

              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Account #
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Type
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      Balance
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {categoryAccounts.sort((a, b) => a.number.localeCompare(b.number)).map(account => (
                    <tr key={account.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {account.number}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div>
                          <div className="font-medium">{account.name}</div>
                          {account.description && (
                            <div className="text-xs text-gray-500">{account.description}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {account.type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right">
                        {formatUGX(account.balance || 0)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                        <button
                          onClick={() => openEditModal(account)}
                          className="text-indigo-600 hover:text-indigo-900 mr-3"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(account.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })}
      </div>

      {accounts.length === 0 && (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <p className="text-gray-500 text-lg mb-4">No accounts defined.</p>
          <p className="text-gray-400 text-sm mb-6">
            Create your Chart of Accounts following IFRS structure.
          </p>
          <Button onClick={openAddModal}>Add Your First Account</Button>
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingAccount ? 'Edit Account' : 'Add New Account'}
      >
        <form onSubmit={handleSubmit}>
          <Input
            label="Account Number"
            name="number"
            value={formData.number}
            onChange={handleChange}
            required
            placeholder="e.g., 1000, 1000.01 for sub-accounts"
          />

          <Input
            label="Account Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="e.g., Cash at Bank"
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              options={[
                { value: 'Asset', label: 'Asset' },
                { value: 'Liability', label: 'Liability' },
                { value: 'Equity', label: 'Equity' },
                { value: 'Income', label: 'Income' },
                { value: 'Expense', label: 'Expense' },
              ]}
            />
            <Input
              label="Type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
              placeholder="e.g., Current Asset"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Account purpose and usage"
            />
          </div>

          <Input
            label="Current Balance (UGX)"
            name="balance"
            type="number"
            value={formData.balance}
            onChange={handleChange}
            step="0.01"
          />

          <div className="flex justify-end gap-2 mt-6">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Account</Button>
          </div>
        </form>
      </Modal>

      {/* IFRS/ICPAU Note */}
      <div className="mt-6 bg-indigo-50 border border-indigo-200 rounded-lg p-6">
        <h3 className="font-semibold text-indigo-900 mb-2">📚 IFRS & ICPAU Compliance</h3>
        <ul className="list-disc list-inside text-sm text-indigo-800 space-y-1">
          <li>
            <strong>Chart of Accounts Structure:</strong> Follow IFRS numbering (1000s = Assets, 2000s = Liabilities, etc.)
          </li>
          <li>
            <strong>Double-Entry Bookkeeping:</strong> Every transaction affects at least two accounts
          </li>
          <li>
            <strong>Account Hierarchy:</strong> Use decimal notation (1000.01, 1000.02) for sub-accounts
          </li>
          <li>
            <strong>ICPAU Standards:</strong> Maintain consistency with Uganda accounting practices
          </li>
          <li>
            <strong>URA Compliance:</strong> Structure supports tax reporting requirements
          </li>
        </ul>
      </div>
    </div>
  );
};
