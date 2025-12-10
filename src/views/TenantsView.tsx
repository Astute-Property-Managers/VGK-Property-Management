import React, { useEffect, useState } from 'react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Select } from '../components/Select';
import { Modal } from '../components/Modal';
import {
  getTenants,
  saveTenant,
  deleteTenant,
  getProperties,
  recordTransaction,
  calculatePaymentStatus,
  calculateNextPaymentDate,
  formatUGX,
} from '../services/dataService';
import { sendBulkMessages } from '../services/messagingService';
import type { Tenant, Property, PaymentRecord } from '../types';

export const TenantsView: React.FC = () => {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [filterProperty, setFilterProperty] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [editingTenant, setEditingTenant] = useState<Tenant | null>(null);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);

  const [formData, setFormData] = useState<Partial<Tenant>>({
    name: '',
    contact: '',
    propertyId: '',
    unitNumber: '',
    leaseStartDate: '',
    leaseEndDate: '',
    rentAmount: 0,
    securityDeposit: 0,
    paymentStatus: 'Due',
    lastPaymentDate: '',
    nextPaymentDate: '',
    notes: '',
    paymentHistory: [],
  });

  const [paymentData, setPaymentData] = useState({
    amount: 0,
    method: 'Mobile Money' as 'Mobile Money' | 'Bank Transfer' | 'Cash',
    referenceNumber: '',
    notes: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const tenantsData = getTenants();
    const propertiesData = getProperties();

    // Update payment status based on current date
    const updatedTenants = tenantsData.map(tenant => ({
      ...tenant,
      paymentStatus: calculatePaymentStatus(tenant.nextPaymentDate),
    }));

    setTenants(updatedTenants);
    setProperties(propertiesData);
  };

  const openAddModal = () => {
    setEditingTenant(null);
    setFormData({
      name: '',
      contact: '',
      propertyId: properties[0]?.id || '',
      unitNumber: '',
      leaseStartDate: '',
      leaseEndDate: '',
      rentAmount: 0,
      securityDeposit: 0,
      paymentStatus: 'Due',
      lastPaymentDate: '',
      nextPaymentDate: '',
      notes: '',
      paymentHistory: [],
    });
    setIsModalOpen(true);
  };

  const openEditModal = (tenant: Tenant) => {
    setEditingTenant(tenant);
    setFormData(tenant);
    setIsModalOpen(true);
  };

  const openPaymentModal = (tenant: Tenant) => {
    setSelectedTenant(tenant);
    setPaymentData({
      amount: tenant.rentAmount,
      method: 'Mobile Money',
      referenceNumber: '',
      notes: `Rent payment for ${new Date().toLocaleDateString('en-UG', { month: 'long', year: 'numeric' })}`,
    });
    setIsPaymentModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const tenant: Tenant = {
      id: editingTenant?.id || '',
      name: formData.name!,
      contact: formData.contact!,
      propertyId: formData.propertyId!,
      unitNumber: formData.unitNumber!,
      leaseStartDate: formData.leaseStartDate!,
      leaseEndDate: formData.leaseEndDate!,
      rentAmount: formData.rentAmount!,
      securityDeposit: formData.securityDeposit!,
      paymentStatus: formData.paymentStatus || 'Due',
      lastPaymentDate: formData.lastPaymentDate!,
      nextPaymentDate: formData.nextPaymentDate!,
      notes: formData.notes || '',
      paymentHistory: formData.paymentHistory || [],
    };

    saveTenant(tenant);
    loadData();
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this tenant?')) {
      deleteTenant(id);
      loadData();
    }
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedTenant) return;

    // Create payment record
    const paymentRecord: PaymentRecord = {
      date: new Date().toISOString().split('T')[0],
      amount: paymentData.amount,
      method: paymentData.method,
      referenceNumber: paymentData.referenceNumber,
      notes: paymentData.notes,
      recordedAt: new Date().toISOString(),
    };

    // Update tenant payment history
    const updatedHistory = [...(selectedTenant.paymentHistory || []), paymentRecord];
    const nextPaymentDate = calculateNextPaymentDate(new Date().toISOString().split('T')[0]);

    const updatedTenant: Tenant = {
      ...selectedTenant,
      lastPaymentDate: paymentRecord.date,
      nextPaymentDate: nextPaymentDate,
      paymentStatus: 'Paid',
      paymentHistory: updatedHistory,
    };

    saveTenant(updatedTenant);

    // Record double-entry transaction in General Ledger
    // Debit: Cash at Bank (1000)
    // Credit: Rental Income (4000)
    recordTransaction({
      date: paymentRecord.date,
      description: `Rent payment - ${selectedTenant.name} - ${paymentData.notes}`,
      debitAccountId: 'acc-1000', // Cash at Bank
      creditAccountId: 'acc-4000', // Rental Income
      amount: paymentData.amount,
      propertyId: selectedTenant.propertyId,
      relatedEntityType: 'tenant',
      relatedEntityId: selectedTenant.id,
    });

    loadData();
    setIsPaymentModalOpen(false);
    alert(`Payment of ${formatUGX(paymentData.amount)} recorded successfully!\n\nGeneral Ledger entries created automatically.`);
  };

  const handleSendReminders = async () => {
    const overdueTenants = tenants.filter(t => t.paymentStatus === 'Overdue');

    if (overdueTenants.length === 0) {
      alert('No overdue tenants to remind.');
      return;
    }

    if (!confirm(`Send rent reminders to ${overdueTenants.length} overdue tenant(s)?`)) {
      return;
    }

    const messages = overdueTenants.map(tenant => {
      const property = properties.find(p => p.id === tenant.propertyId);
      return {
        recipient: tenant.contact,
        message: `Dear ${tenant.name}, this is a friendly reminder that your rent payment of ${formatUGX(tenant.rentAmount)} for ${property?.name} - Unit ${tenant.unitNumber} is overdue. Please make payment at your earliest convenience. Thank you!`,
      };
    });

    try {
      await sendBulkMessages(messages, 'sms');
      alert(`Rent reminders sent successfully to ${overdueTenants.length} tenant(s)!`);
    } catch (error) {
      alert('Failed to send reminders. Please check your messaging API configuration.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'rentAmount' || name === 'securityDeposit'
        ? parseFloat(value) || 0
        : value,
    }));
  };

  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPaymentData(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) || 0 : value,
    }));
  };

  // Filter tenants
  const filteredTenants = tenants.filter(tenant => {
    const propertyMatch = filterProperty === 'all' || tenant.propertyId === filterProperty;
    const statusMatch = filterStatus === 'all' || tenant.paymentStatus === filterStatus;
    return propertyMatch && statusMatch;
  });

  // Calculate stats
  const stats = {
    total: tenants.length,
    paid: tenants.filter(t => t.paymentStatus === 'Paid').length,
    due: tenants.filter(t => t.paymentStatus === 'Due').length,
    overdue: tenants.filter(t => t.paymentStatus === 'Overdue').length,
    totalRent: tenants.reduce((sum, t) => sum + t.rentAmount, 0),
    collectedThisMonth: tenants
      .filter(t => t.paymentStatus === 'Paid')
      .reduce((sum, t) => sum + t.rentAmount, 0),
  };

  const collectionRate = stats.total > 0
    ? ((stats.paid / stats.total) * 100).toFixed(1)
    : '0.0';

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Tenant Management</h1>
        <p className="text-gray-600 mt-2">
          Manage tenants, record payments, and automate rent reminders following Griswold's best practices.
          Focus on the 20% of tenants causing 80% of issues (Pareto Principle).
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-sm font-medium text-gray-600">Total Tenants</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</p>
          <p className="text-sm text-gray-500 mt-1">{formatUGX(stats.totalRent)}/month</p>
        </div>
        <div className="bg-green-50 rounded-lg shadow-md p-6 border border-green-200">
          <h3 className="text-sm font-medium text-green-600">Paid</h3>
          <p className="text-3xl font-bold text-green-900 mt-2">{stats.paid}</p>
          <p className="text-sm text-green-600 mt-1">{formatUGX(stats.collectedThisMonth)}</p>
        </div>
        <div className="bg-yellow-50 rounded-lg shadow-md p-6 border border-yellow-200">
          <h3 className="text-sm font-medium text-yellow-600">Due Today</h3>
          <p className="text-3xl font-bold text-yellow-900 mt-2">{stats.due}</p>
        </div>
        <div className="bg-red-50 rounded-lg shadow-md p-6 border border-red-200">
          <h3 className="text-sm font-medium text-red-600">Overdue</h3>
          <p className="text-3xl font-bold text-red-900 mt-2">{stats.overdue}</p>
          {stats.overdue > 0 && (
            <span className="inline-block w-3 h-3 bg-red-500 rounded-full animate-pulse mt-1" />
          )}
        </div>
      </div>

      {/* Collection Rate KPI */}
      <div className="bg-indigo-600 text-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-indigo-100">Monthly Rent Collection Rate (Critical Number)</h3>
            <p className="text-4xl font-bold mt-2">{collectionRate}%</p>
            <p className="text-sm text-indigo-200 mt-1">Target: 95%+ (Griswold Standard)</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">{formatUGX(stats.collectedThisMonth)}</p>
            <p className="text-sm text-indigo-200">of {formatUGX(stats.totalRent)} collected</p>
          </div>
        </div>
      </div>

      {/* Actions & Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-4">
        <div className="flex flex-wrap items-center gap-4">
          <Button onClick={openAddModal}>+ Add New Tenant</Button>
          <Button
            onClick={handleSendReminders}
            variant="secondary"
            disabled={stats.overdue === 0}
          >
            📱 Send Rent Reminders ({stats.overdue})
          </Button>

          <div className="flex-1" />

          <Select
            options={[
              { value: 'all', label: 'All Properties' },
              ...properties.map(p => ({ value: p.id, label: p.name })),
            ]}
            value={filterProperty}
            onChange={(e) => setFilterProperty(e.target.value)}
            className="w-48"
          />

          <Select
            options={[
              { value: 'all', label: 'All Statuses' },
              { value: 'Paid', label: 'Paid' },
              { value: 'Due', label: 'Due' },
              { value: 'Overdue', label: 'Overdue' },
            ]}
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-40"
          />
        </div>
      </div>

      {/* Tenants Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tenant
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Property / Unit
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rent Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Payment Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Next Payment
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredTenants.map(tenant => {
              const property = properties.find(p => p.id === tenant.propertyId);
              const statusColors = {
                Paid: 'bg-green-100 text-green-800',
                Due: 'bg-yellow-100 text-yellow-800',
                Overdue: 'bg-red-100 text-red-800',
              };

              return (
                <tr key={tenant.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{tenant.name}</div>
                      <div className="text-sm text-gray-500">{tenant.contact}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{property?.name || 'Unknown'}</div>
                    <div className="text-sm text-gray-500">Unit {tenant.unitNumber}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatUGX(tenant.rentAmount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[tenant.paymentStatus]}`}>
                      {tenant.paymentStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {tenant.nextPaymentDate || 'Not set'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => openPaymentModal(tenant)}
                      className="text-green-600 hover:text-green-900"
                    >
                      💰 Pay
                    </button>
                    <button
                      onClick={() => openEditModal(tenant)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(tenant.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filteredTenants.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No tenants found. Add your first tenant to get started!</p>
          </div>
        )}
      </div>

      {/* Add/Edit Tenant Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingTenant ? 'Edit Tenant' : 'Add New Tenant'}
      >
        <form onSubmit={handleSubmit}>
          <Input
            label="Tenant Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <Input
            label="Contact (Phone)"
            name="contact"
            value={formData.contact}
            onChange={handleChange}
            placeholder="+256 700 123 456"
            required
          />
          <Select
            label="Property"
            name="propertyId"
            value={formData.propertyId}
            onChange={handleChange}
            options={properties.map(p => ({ value: p.id, label: p.name }))}
            required
          />
          <Input
            label="Unit Number"
            name="unitNumber"
            value={formData.unitNumber}
            onChange={handleChange}
            placeholder="A-101"
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Lease Start Date"
              name="leaseStartDate"
              type="date"
              value={formData.leaseStartDate}
              onChange={handleChange}
              required
            />
            <Input
              label="Lease End Date"
              name="leaseEndDate"
              type="date"
              value={formData.leaseEndDate}
              onChange={handleChange}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Monthly Rent (UGX)"
              name="rentAmount"
              type="number"
              value={formData.rentAmount}
              onChange={handleChange}
              required
              min="0"
              step="1000"
            />
            <Input
              label="Security Deposit (UGX)"
              name="securityDeposit"
              type="number"
              value={formData.securityDeposit}
              onChange={handleChange}
              required
              min="0"
              step="1000"
            />
          </div>
          <Input
            label="Next Payment Date"
            name="nextPaymentDate"
            type="date"
            value={formData.nextPaymentDate}
            onChange={handleChange}
            required
          />
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Tenant</Button>
          </div>
        </form>
      </Modal>

      {/* Payment Recording Modal */}
      <Modal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        title={`Record Payment - ${selectedTenant?.name}`}
      >
        <form onSubmit={handlePaymentSubmit}>
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-indigo-900">
              <strong>Property:</strong> {properties.find(p => p.id === selectedTenant?.propertyId)?.name} - Unit {selectedTenant?.unitNumber}
            </p>
            <p className="text-sm text-indigo-900 mt-1">
              <strong>Monthly Rent:</strong> {formatUGX(selectedTenant?.rentAmount || 0)}
            </p>
          </div>

          <Input
            label="Payment Amount (UGX)"
            name="amount"
            type="number"
            value={paymentData.amount}
            onChange={handlePaymentChange}
            required
            min="0"
            step="1000"
          />

          <Select
            label="Payment Method"
            name="method"
            value={paymentData.method}
            onChange={handlePaymentChange}
            options={[
              { value: 'Mobile Money', label: '📱 Mobile Money (MTN/Airtel)' },
              { value: 'Bank Transfer', label: '🏦 Bank Transfer' },
              { value: 'Cash', label: '💵 Cash' },
            ]}
          />

          <Input
            label="Reference Number (optional)"
            name="referenceNumber"
            value={paymentData.referenceNumber}
            onChange={handlePaymentChange}
            placeholder="e.g., MM12345678"
          />

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              name="notes"
              value={paymentData.notes}
              onChange={handlePaymentChange}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-green-900 font-medium mb-2">📊 Automatic Accounting</p>
            <p className="text-xs text-green-800">
              This payment will automatically create General Ledger entries:<br />
              <strong>Debit:</strong> Cash at Bank (1000) - {formatUGX(paymentData.amount)}<br />
              <strong>Credit:</strong> Rental Income (4000) - {formatUGX(paymentData.amount)}<br />
              <em className="text-green-700">IFRS-compliant double-entry bookkeeping</em>
            </p>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button type="button" variant="secondary" onClick={() => setIsPaymentModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="success">Record Payment</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
