import React, { useEffect, useState } from 'react';
import { Header } from '../components/layout/Header';
import { Card } from '../components/ui/Card';
import { Table } from '../components/ui/Table';
import { dataService } from '../services/data.service';
import { GeneralLedgerEntry, Account } from '../types';
import { formatCurrency, formatDate } from '../utils/formatting';

export function Ledger() {
  const [entries, setEntries] = useState<GeneralLedgerEntry[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);

  useEffect(() => {
    setEntries(dataService.getAllLedgerEntries());
    setAccounts(dataService.getAllAccounts());
  }, []);

  const getAccountName = (accountId: string) => {
    const account = accounts.find((a) => a.id === accountId);
    return account ? `${account.code} - ${account.name}` : 'Unknown';
  };

  const totalDebits = entries.reduce((sum, e) => sum + e.debit, 0);
  const totalCredits = entries.reduce((sum, e) => sum + e.credit, 0);

  const columns = [
    {
      key: 'date',
      label: 'Date',
      render: (e: GeneralLedgerEntry) => formatDate(e.date),
    },
    {
      key: 'account',
      label: 'Account',
      render: (e: GeneralLedgerEntry) => (
        <div>
          <p className="font-medium text-gray-900">{getAccountName(e.accountId)}</p>
          <p className="text-sm text-gray-500">{e.description}</p>
        </div>
      ),
    },
    {
      key: 'reference',
      label: 'Reference',
      render: (e: GeneralLedgerEntry) => (
        <div className="text-sm">
          <p className="text-gray-900">{e.reference}</p>
          <p className="text-gray-500 capitalize">{e.sourceType.replace('-', ' ')}</p>
        </div>
      ),
    },
    {
      key: 'debit',
      label: 'Debit',
      render: (e: GeneralLedgerEntry) => (
        <span className="text-right block">{e.debit > 0 ? formatCurrency(e.debit) : '-'}</span>
      ),
    },
    {
      key: 'credit',
      label: 'Credit',
      render: (e: GeneralLedgerEntry) => (
        <span className="text-right block">{e.credit > 0 ? formatCurrency(e.credit) : '-'}</span>
      ),
    },
  ];

  return (
    <div>
      <Header
        title="General Ledger"
        subtitle="Complete transaction history with double-entry accounting"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-3 gap-6 mb-6">
          <Card>
            <p className="text-sm text-gray-600">Total Entries</p>
            <p className="text-3xl font-bold text-gray-900">{entries.length}</p>
          </Card>
          <Card>
            <p className="text-sm text-gray-600">Total Debits</p>
            <p className="text-3xl font-bold text-green-600">{formatCurrency(totalDebits)}</p>
          </Card>
          <Card>
            <p className="text-sm text-gray-600">Total Credits</p>
            <p className="text-3xl font-bold text-blue-600">{formatCurrency(totalCredits)}</p>
          </Card>
        </div>

        <Card padding="none">
          {entries.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No ledger entries yet. Entries are created automatically when you record payments or maintenance costs.</p>
            </div>
          ) : (
            <>
              <Table columns={columns} data={entries} keyExtractor={(e) => e.id} />
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <div className="flex justify-between text-sm font-semibold">
                  <span className="text-gray-700">Balance Check (Debits - Credits):</span>
                  <span className={totalDebits === totalCredits ? 'text-green-600' : 'text-red-600'}>
                    {formatCurrency(totalDebits - totalCredits)}
                    {totalDebits === totalCredits && ' ✓ Balanced'}
                  </span>
                </div>
              </div>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
