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
import { Property, PropertyType, PropertyStatus } from '../types';
import { formatCurrency, formatPercentage } from '../utils/formatting';
import { validateProperty } from '../utils/validation';

export function Properties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [formData, setFormData] = useState<Partial<Property>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = () => {
    setProperties(dataService.getAllProperties());
  };

  const handleCreate = () => {
    setEditingProperty(null);
    setFormData({
      type: 'residential',
      status: 'active',
      occupiedUnits: 0,
      monthlyIncome: 0,
      monthlyExpenses: 0,
      managementFee: 0,
      notes: '',
    });
    setErrors({});
    setIsModalOpen(true);
  };

  const handleEdit = (property: Property) => {
    setEditingProperty(property);
    setFormData(property);
    setErrors({});
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this property?')) {
      dataService.deleteProperty(id);
      loadProperties();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate
    const validationErrors = validateProperty(formData as any);
    if (validationErrors.length > 0) {
      const errorMap: Record<string, string> = {};
      validationErrors.forEach((err) => {
        errorMap[err.field] = err.message;
      });
      setErrors(errorMap);
      return;
    }

    // Save
    if (editingProperty) {
      dataService.updateProperty(editingProperty.id, formData);
    } else {
      dataService.createProperty(formData as any);
    }

    setIsModalOpen(false);
    loadProperties();
  };

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const columns = [
    {
      key: 'name',
      label: 'Property Name',
      render: (p: Property) => (
        <div>
          <p className="font-medium text-gray-900">{p.name}</p>
          <p className="text-sm text-gray-500">{p.address}</p>
        </div>
      ),
    },
    {
      key: 'type',
      label: 'Type',
      render: (p: Property) => (
        <span className="capitalize">{p.type.replace('-', ' ')}</span>
      ),
    },
    {
      key: 'units',
      label: 'Units',
      render: (p: Property) => (
        <div>
          <p className="font-medium">{p.occupiedUnits}/{p.totalUnits}</p>
          <p className="text-sm text-gray-500">
            {formatPercentage((p.occupiedUnits / p.totalUnits) * 100)}
          </p>
        </div>
      ),
    },
    {
      key: 'income',
      label: 'Monthly Income',
      render: (p: Property) => formatCurrency(p.monthlyIncome),
    },
    {
      key: 'noi',
      label: 'Monthly NOI',
      render: (p: Property) => formatCurrency(p.monthlyIncome - p.monthlyExpenses),
    },
    {
      key: 'status',
      label: 'Status',
      render: (p: Property) => <StatusBadge status={p.status as any} />,
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (p: Property) => (
        <div className="flex gap-2">
          <Button size="sm" variant="ghost" onClick={() => handleEdit(p)}>
            Edit
          </Button>
          <Button size="sm" variant="danger" onClick={() => handleDelete(p.id)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <Header title="Properties" subtitle="Manage your property portfolio" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">All Properties ({properties.length})</h2>
          <Button onClick={handleCreate}>Add Property</Button>
        </div>

        <Card padding="none">
          {properties.length === 0 ? (
            <EmptyState
              title="No properties yet"
              description="Get started by adding your first property to the portfolio."
              actionLabel="Add Property"
              onAction={handleCreate}
            />
          ) : (
            <Table columns={columns} data={properties} keyExtractor={(p) => p.id} />
          )}
        </Card>
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProperty ? 'Edit Property' : 'Add New Property'}
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {editingProperty ? 'Update' : 'Create'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Property Name"
              value={formData.name || ''}
              onChange={(e) => handleChange('name', e.target.value)}
              error={errors.name}
              required
            />
            <Input
              label="Address"
              value={formData.address || ''}
              onChange={(e) => handleChange('address', e.target.value)}
              error={errors.address}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Property Type"
              value={formData.type || 'residential'}
              onChange={(e) => handleChange('type', e.target.value as PropertyType)}
              options={[
                { value: 'residential', label: 'Residential' },
                { value: 'commercial', label: 'Commercial' },
                { value: 'mixed-use', label: 'Mixed Use' },
                { value: 'industrial', label: 'Industrial' },
              ]}
              required
            />
            <Select
              label="Status"
              value={formData.status || 'active'}
              onChange={(e) => handleChange('status', e.target.value as PropertyStatus)}
              options={[
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' },
                { value: 'under-renovation', label: 'Under Renovation' },
              ]}
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Input
              label="Total Units"
              type="number"
              value={formData.totalUnits || ''}
              onChange={(e) => handleChange('totalUnits', parseInt(e.target.value) || 0)}
              error={errors.totalUnits}
              required
            />
            <Input
              label="Occupied Units"
              type="number"
              value={formData.occupiedUnits || ''}
              onChange={(e) => handleChange('occupiedUnits', parseInt(e.target.value) || 0)}
              error={errors.occupiedUnits}
              required
            />
            <Input
              label="Square Feet"
              type="number"
              value={formData.squareFeet || ''}
              onChange={(e) => handleChange('squareFeet', parseInt(e.target.value) || 0)}
              error={errors.squareFeet}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Purchase Price (UGX)"
              type="number"
              value={formData.purchasePrice || ''}
              onChange={(e) => handleChange('purchasePrice', parseInt(e.target.value) || 0)}
              error={errors.purchasePrice}
              required
            />
            <Input
              label="Purchase Date"
              type="date"
              value={formData.purchaseDate || ''}
              onChange={(e) => handleChange('purchaseDate', e.target.value)}
              required
            />
          </div>

          <Input
            label="Current Value (UGX)"
            type="number"
            value={formData.currentValue || ''}
            onChange={(e) => handleChange('currentValue', parseInt(e.target.value) || 0)}
            error={errors.currentValue}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Monthly Income (UGX)"
              type="number"
              value={formData.monthlyIncome || ''}
              onChange={(e) => handleChange('monthlyIncome', parseInt(e.target.value) || 0)}
              error={errors.monthlyIncome}
              required
            />
            <Input
              label="Monthly Expenses (UGX)"
              type="number"
              value={formData.monthlyExpenses || ''}
              onChange={(e) => handleChange('monthlyExpenses', parseInt(e.target.value) || 0)}
              error={errors.monthlyExpenses}
              required
            />
          </div>

          <Input
            label="Management Fee (UGX)"
            type="number"
            value={formData.managementFee || ''}
            onChange={(e) => handleChange('managementFee', parseInt(e.target.value) || 0)}
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
