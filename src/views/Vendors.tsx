import React, { useEffect, useState } from 'react';
import { Header } from '../components/layout/Header';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Modal } from '../components/ui/Modal';
import { Table } from '../components/ui/Table';
import { Badge } from '../components/ui/Badge';
import { EmptyState } from '../components/ui/EmptyState';
import { dataService } from '../services/data.service';
import { Vendor, VendorCategory } from '../types';
import { formatPhoneNumber, formatStatus, formatDuration } from '../utils/formatting';
import { validateVendor, formatUgandanPhone } from '../utils/validation';

export function Vendors() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
  const [formData, setFormData] = useState<Partial<Vendor>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadVendors();
  }, []);

  const loadVendors = () => {
    setVendors(dataService.getAllVendors());
  };

  const handleCreate = () => {
    setEditingVendor(null);
    setFormData({
      category: 'other',
      rating: 3,
      totalJobsCompleted: 0,
      averageResponseTime: 0,
      isPreferred: false,
      notes: '',
    });
    setErrors({});
    setIsModalOpen(true);
  };

  const handleEdit = (vendor: Vendor) => {
    setEditingVendor(vendor);
    setFormData(vendor);
    setErrors({});
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this vendor?')) {
      dataService.deleteVendor(id);
      loadVendors();
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
    const validationErrors = validateVendor(formattedData as any);
    if (validationErrors.length > 0) {
      const errorMap: Record<string, string> = {};
      validationErrors.forEach((err) => {
        errorMap[err.field] = err.message;
      });
      setErrors(errorMap);
      return;
    }

    // Save
    if (editingVendor) {
      dataService.updateVendor(editingVendor.id, formattedData);
    } else {
      dataService.createVendor(formattedData as any);
    }

    setIsModalOpen(false);
    loadVendors();
  };

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const columns = [
    {
      key: 'name',
      label: 'Vendor',
      render: (v: Vendor) => (
        <div>
          <div className="flex items-center gap-2">
            <p className="font-medium text-gray-900">{v.name}</p>
            {v.isPreferred && <Badge variant="success" size="sm">Preferred</Badge>}
          </div>
          <p className="text-sm text-gray-500">{formatStatus(v.category)}</p>
        </div>
      ),
    },
    {
      key: 'contact',
      label: 'Contact',
      render: (v: Vendor) => (
        <div>
          <p className="font-medium text-gray-900">{v.contactPerson}</p>
          <p className="text-sm text-gray-500">{formatPhoneNumber(v.phone)}</p>
          <p className="text-sm text-gray-500">{v.email}</p>
        </div>
      ),
    },
    {
      key: 'rating',
      label: 'Rating',
      render: (v: Vendor) => (
        <div className="flex items-center">
          <span className="font-medium text-gray-900">{v.rating.toFixed(1)}</span>
          <svg className="w-4 h-4 text-yellow-400 ml-1" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </div>
      ),
    },
    {
      key: 'performance',
      label: 'Performance',
      render: (v: Vendor) => (
        <div className="text-sm">
          <p>{v.totalJobsCompleted} jobs completed</p>
          <p className="text-gray-500">Avg response: {formatDuration(v.averageResponseTime)}</p>
        </div>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (v: Vendor) => (
        <div className="flex gap-2">
          <Button size="sm" variant="ghost" onClick={() => handleEdit(v)}>
            Edit
          </Button>
          <Button size="sm" variant="danger" onClick={() => handleDelete(v.id)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <Header title="Vendors" subtitle="Manage service providers and contractors" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">All Vendors ({vendors.length})</h2>
          <Button onClick={handleCreate}>Add Vendor</Button>
        </div>

        <Card padding="none">
          {vendors.length === 0 ? (
            <EmptyState
              title="No vendors yet"
              description="Add vendors and service providers to manage maintenance efficiently."
              actionLabel="Add Vendor"
              onAction={handleCreate}
            />
          ) : (
            <Table columns={columns} data={vendors} keyExtractor={(v) => v.id} />
          )}
        </Card>
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingVendor ? 'Edit Vendor' : 'Add New Vendor'}
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {editingVendor ? 'Update' : 'Create'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Vendor Name"
            value={formData.name || ''}
            onChange={(e) => handleChange('name', e.target.value)}
            error={errors.name}
            required
          />

          <Select
            label="Category"
            value={formData.category || 'other'}
            onChange={(e) => handleChange('category', e.target.value as VendorCategory)}
            options={[
              { value: 'plumbing', label: 'Plumbing' },
              { value: 'electrical', label: 'Electrical' },
              { value: 'hvac', label: 'HVAC' },
              { value: 'landscaping', label: 'Landscaping' },
              { value: 'cleaning', label: 'Cleaning' },
              { value: 'security', label: 'Security' },
              { value: 'general-contractor', label: 'General Contractor' },
              { value: 'other', label: 'Other' },
            ]}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Contact Person"
              value={formData.contactPerson || ''}
              onChange={(e) => handleChange('contactPerson', e.target.value)}
              error={errors.contactPerson}
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

          <Input
            label="Email"
            type="email"
            value={formData.email || ''}
            onChange={(e) => handleChange('email', e.target.value)}
            error={errors.email}
            required
          />

          <Input
            label="Address"
            value={formData.address || ''}
            onChange={(e) => handleChange('address', e.target.value)}
            error={errors.address}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Rating (1-5)"
              type="number"
              min="1"
              max="5"
              step="0.1"
              value={formData.rating || ''}
              onChange={(e) => handleChange('rating', parseFloat(e.target.value) || 3)}
            />
            <div className="flex items-center pt-8">
              <input
                type="checkbox"
                id="isPreferred"
                checked={formData.isPreferred || false}
                onChange={(e) => handleChange('isPreferred', e.target.checked)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="isPreferred" className="ml-2 block text-sm text-gray-900">
                Preferred Vendor
              </label>
            </div>
          </div>

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
