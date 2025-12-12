import React, { useEffect, useState } from 'react';
import { getGeneralLedgerEntries, getAccounts, getProperties, formatUGX } from '../services/dataService';
import type { GeneralLedgerEntry, Account, Property } from '../types';

export const LedgerView: React.FC = () => {
  const [entries, setEntries] = useState<GeneralLedgerEntry[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [filterAccount, setFilterAccount] = useState<string>('all');
  const [filterProperty, setFilterProperty] = useState<string>('all');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setEntries(getGeneralLedgerEntries());
    setAccounts(getAccounts());
    setProperties(getProperties());

    // Set default date range (last 30 days)
    const today = new Date();
    const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
    setEndDate(today.toISOString().split('T')[0]);
    setStartDate(thirtyDaysAgo.toISOString().split('T')[0]);
  };

  // Filter entries
  const filteredEntries = entries.filter(entry => {
    const accountMatch = filterAccount === 'all' || entry.accountId === filterAccount;
    const propertyMatch = filterProperty === 'all' || entry.propertyId === filterProperty;
    const dateMatch =
      (!startDate || entry.date >= startDate) && (!endDate || entry.date <= endDate);
    return accountMatch && propertyMatch && dateMatch;
  });

  // Calculate totals
  const totals = filteredEntries.reduce(
    (acc, entry) => ({
      debits: acc.debits + entry.debit,
      credits: acc.credits + entry.credit,
    }),
    { debits: 0, credits: 0 }
  );

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">General Ledger</h1>
        <p className="text-gray-600 mt-2">
          <strong>IFRS Double-Entry Bookkeeping:</strong> Complete transaction audit trail.
          All financial entries with debit/credit classification for compliance reporting.
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Account</label>
            <select
              value={filterAccount}
              onChange={(e) => setFilterAccount(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Accounts</option>
              {accounts.map(account => (
                <option key={account.id} value={account.id}>
                  {account.number} - {account.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Property</label>
            <select
              value={filterProperty}
              onChange={(e) => setFilterProperty(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Properties</option>
              {properties.map(property => (
                <option key={property.id} value={property.id}>
                  {property.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-sm font-medium text-gray-600">Total Entries</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">{filteredEntries.length}</p>
        </div>
        <div className="bg-blue-50 rounded-lg shadow-md p-6 border border-blue-200">
          <h3 className="text-sm font-medium text-blue-600">Total Debits</h3>
          <p className="text-3xl font-bold text-blue-900 mt-2">{formatUGX(totals.debits)}</p>
        </div>
        <div className="bg-green-50 rounded-lg shadow-md p-6 border border-green-200">
          <h3 className="text-sm font-medium text-green-600">Total Credits</h3>
          <p className="text-3xl font-bold text-green-900 mt-2">{formatUGX(totals.credits)}</p>
        </div>
      </div>

      {/* Balance Check */}
      {totals.debits !== totals.credits && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800 font-semibold">
            ⚠️ Warning: Debits and Credits do not balance!
          </p>
          <p className="text-sm text-red-700 mt-1">
            Difference: {formatUGX(Math.abs(totals.debits - totals.credits))}
          </p>
        </div>
      )}

      {/* Ledger Table */}
      <div className="bg-white rounded-lg shadow-md overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Account
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Property
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Debit
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Credit
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredEntries
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((entry, index) => {
                const account = accounts.find(a => a.id === entry.accountId);
                const property = properties.find(p => p.id === entry.propertyId);

                return (
                  <tr key={entry.id || index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {new Date(entry.date).toLocaleDateString('en-UG')}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {account ? (
                        <div>
                          <div className="font-medium">{account.number}</div>
                          <div className="text-xs text-gray-500">{account.name}</div>
                        </div>
                      ) : (
                        <span className="text-gray-400">Unknown Account</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {entry.description}
                      {entry.relatedEntityType && (
                        <div className="text-xs text-gray-500 mt-1">
                          Related: {entry.relatedEntityType}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {property?.name || '-'}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-right font-medium text-blue-700">
                      {entry.debit > 0 ? formatUGX(entry.debit) : '-'}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-right font-medium text-green-700">
                      {entry.credit > 0 ? formatUGX(entry.credit) : '-'}
                    </td>
                  </tr>
                );
              })}

            {/* Totals Row */}
            {filteredEntries.length > 0 && (
              <tr className="bg-indigo-100 font-bold">
                <td colSpan={4} className="px-4 py-3 text-sm text-gray-900 text-right">
                  TOTALS
                </td>
                <td className="px-4 py-3 text-sm text-right text-blue-900">
                  {formatUGX(totals.debits)}
                </td>
                <td className="px-4 py-3 text-sm text-right text-green-900">
                  {formatUGX(totals.credits)}
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {filteredEntries.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No ledger entries found for the selected filters.</p>
          </div>
        )}
      </div>

      {/* IFRS Note */}
      <div className="mt-6 bg-indigo-50 border border-indigo-200 rounded-lg p-6">
        <h3 className="font-semibold text-indigo-900 mb-2">📚 IFRS Double-Entry Bookkeeping</h3>
        <ul className="list-disc list-inside text-sm text-indigo-800 space-y-1">
          <li>
            <strong>Debit = Credit:</strong> Every transaction must balance (fundamental accounting equation)
          </li>
          <li>
            <strong>Audit Trail:</strong> Complete history of all financial transactions
          </li>
          <li>
            <strong>Account Classification:</strong> Proper categorization ensures accurate financial statements
          </li>
          <li>
            <strong>ICPAU Compliance:</strong> Follows Uganda professional accounting standards
          </li>
          <li>
            <strong>URA Ready:</strong> Supports tax filing and compliance reporting
          </li>
        </ul>
      </div>
    </div>
  );
};
