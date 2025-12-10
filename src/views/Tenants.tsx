import React, { useEffect, useState } from 'react';
import { Header } from '../components/layout/Header';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Modal } from '../components/ui/Modal';
import { Table } from '../components/ui/Table';
import { StatusBadge } from '../components/ui/StatusBadge';
import { EmptyState } from '../components/ui/EmptyState';
import { dataService } from '../services/data.service';
import { Tenant, Property } from '../types';
import { formatCurrency, formatDate, formatPhoneNumber } from '../utils/formatting';
import { validateTenant, formatUgandanPhone } from '../utils/validation';

export function Tenants() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTenant, setEditingTenant] = useState<Tenant | null>(null);
  const [formData, setFormData] = useState<Partial<Tenant>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setTenants(dataService.getAllTenants());
    setProperties(dataService.getAllProperties());
  };

  const getPropertyName = (propertyId: string) => {
    const property = properties.find((p) => p.id === propertyId);
    return property?.name || 'Unknown';
  };

  const handleCreate = () => {
    setEditingTenant(null);
    setFormData({
      outstandingBalance: 0,
      notes: '',
    });
    setErrors({});
    setIsModalOpen(true);
  };

  const handleEdit = (tenant: Tenant) => {
    setEditingTenant(tenant);
    setFormData(tenant);
    setErrors({});
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this tenant?')) {
      dataService.deleteTenant(id);
      loadData();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Format phone number
    const formattedData = {
      ...formData,
      phone: formatUgandanPhone(formData.phone || ''),
    };

    // Validate
    const validationErrors = validateTenant(formattedData as any);
    if (validationErrors.length > 0) {
      const errorMap: Record<string, string> = {};
      validationErrors.forEach((err) => {
        errorMap[err.field] = err.message;
      });
      setErrors(errorMap);
      return;
    }

    // Calculate payment status
    const paymentStatus: 'paid' | 'due' | 'overdue' = formattedData.outstandingBalance === 0 ? 'paid' :
                         formattedData.outstandingBalance! > 0 ? 'due' : 'overdue';

    const dataToSave = {
      ...formattedData,
      paymentStatus: paymentStatus as 'paid' | 'due' | 'overdue',
    };

    // Save
    if (editingTenant) {
      dataService.updateTenant(editingTenant.id, dataToSave);
    } else {
      dataService.createTenant(dataToSave as any);
    }

    setIsModalOpen(false);
    loadData();
  };

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const columns = [
    {
      key: 'name',
      label: 'Tenant',
      render: (t: Tenant) => (
        <div>
          <p className="font-medium text-gray-900">{t.name}</p>
          <p className="text-sm text-gray-500">{t.email}</p>
        </div>
      ),
    },
    {
      key: 'property',
      label: 'Property / Unit',
      render: (t: Tenant) => (
        <div>
          <p className="font-medium text-gray-900">{getPropertyName(t.propertyId)}</p>
          <p className="text-sm text-gray-500">Unit {t.unitNumber}</p>
        </div>
      ),
    },
    {
      key: 'phone',
      label: 'Phone',
      render: (t: Tenant) => formatPhoneNumber(t.phone),
    },
    {
      key: 'rent',
      label: 'Monthly Rent',
      render: (t: Tenant) => formatCurrency(t.monthlyRent),
    },
    {
      key: 'lease',
      label: 'Lease Period',
      render: (t: Tenant) => (
        <div>
          <p className="text-sm">{formatDate(t.leaseStartDate)}</p>
          <p className="text-sm text-gray-500">to {formatDate(t.leaseEndDate)}</p>
        </div>
      ),
    },
    {
      key: 'balance',
      label: 'Outstanding',
      render: (t: Tenant) => (
        <div>
          <p className="font-medium">{formatCurrency(t.outstandingBalance)}</p>
          {t.lastPaymentDate && (
            <p className="text-xs text-gray-500">Last: {formatDate(t.lastPaymentDate)}</p>
          )}
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Payment Status',
      render: (t: Tenant) => <StatusBadge status={t.paymentStatus} />,
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (t: Tenant) => (
        <div className="flex gap-2">
          <Button size="sm" variant="ghost" onClick={() => handleEdit(t)}>
            Edit
          </Button>
          <Button size="sm" variant="danger" onClick={() => handleDelete(t.id)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <Header title="Tenants" subtitle="Manage tenant information and lease agreements" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">All Tenants ({tenants.length})</h2>
          <Button onClick={handleCreate}>Add Tenant</Button>
        </div>

        <Card padding="none">
          {tenants.length === 0 ? (
            <EmptyState
              title="No tenants yet"
              description="Get started by adding your first tenant."
              actionLabel="Add Tenant"
              onAction={handleCreate}
            />
          ) : (
            <Table columns={columns} data={tenants} keyExtractor={(t) => t.id} />
          )}
        </Card>
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingTenant ? 'Edit Tenant' : 'Add New Tenant'}
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {editingTenant ? 'Update' : 'Create'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Tenant Name"
            value={formData.name || ''}
            onChange={(e) => handleChange('name', e.target.value)}
            error={errors.name}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Email"
              type="email"
              value={formData.email || ''}
              onChange={(e) => handleChange('email', e.target.value)}
              error={errors.email}
              required
            />
            <Input
              label="Phone"
              value={formData.phone || ''}
              onChange={(e) => handleChange('phone', e.target.value)}
              error={errors.phone}
              helperText="+256XXXXXXXXX format"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Property"
              value={formData.propertyId || ''}
              onChange={(e) => handleChange('propertyId', e.target.value)}
              options={[
                { value: '', label: 'Select a property' },
                ...properties.map((p) => ({ value: p.id, label: p.name })),
              ]}
              error={errors.propertyId}
              required
            />
            <Input
              label="Unit Number"
              value={formData.unitNumber || ''}
              onChange={(e) => handleChange('unitNumber', e.target.value)}
              error={errors.unitNumber}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Lease Start Date"
              type="date"
              value={formData.leaseStartDate || ''}
              onChange={(e) => handleChange('leaseStartDate', e.target.value)}
              error={errors.leaseStartDate}
              required
            />
            <Input
              label="Lease End Date"
              type="date"
              value={formData.leaseEndDate || ''}
              onChange={(e) => handleChange('leaseEndDate', e.target.value)}
              error={errors.leaseEndDate}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Monthly Rent (UGX)"
              type="number"
              value={formData.monthlyRent || ''}
              onChange={(e) => handleChange('monthlyRent', parseInt(e.target.value) || 0)}
              error={errors.monthlyRent}
              required
            />
            <Input
              label="Security Deposit (UGX)"
              type="number"
              value={formData.deposit || ''}
              onChange={(e) => handleChange('deposit', parseInt(e.target.value) || 0)}
              error={errors.deposit}
              required
            />
          </div>

          <Input
            label="Outstanding Balance (UGX)"
            type="number"
            value={formData.outstandingBalance || 0}
            onChange={(e) => handleChange('outstandingBalance', parseInt(e.target.value) || 0)}
          />

          <Input
            label="Notes"
            value={formData.notes || ''}
            onChange={(e) => handleChange('notes', e.target.value)}
          />
        </form>
      </Modal>
    </div>
  );
}
