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
import { MaintenanceRequest, Property, MaintenanceCategory, MaintenancePriority, MaintenanceStatus } from '../types';
import { formatCurrency, formatDate, formatStatus } from '../utils/formatting';
import { getTodayISO } from '../utils/helpers';

export function Maintenance() {
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRequest, setEditingRequest] = useState<MaintenanceRequest | null>(null);
  const [formData, setFormData] = useState<Partial<MaintenanceRequest>>({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setRequests(dataService.getAllMaintenanceRequests());
    setProperties(dataService.getAllProperties());
  };

  const getPropertyName = (propertyId: string) => {
    const property = properties.find((p) => p.id === propertyId);
    return property?.name || 'Unknown';
  };

  const handleCreate = () => {
    setEditingRequest(null);
    setFormData({
      priority: 'medium',
      status: 'pending',
      category: 'other',
      reportedDate: getTodayISO(),
      estimatedCost: 0,
      actualCost: 0,
      notes: '',
    });
    setIsModalOpen(true);
  };

  const handleEdit = (request: MaintenanceRequest) => {
    setEditingRequest(request);
    setFormData(request);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingRequest) {
      dataService.updateMaintenanceRequest(editingRequest.id, formData);
    } else {
      dataService.createMaintenanceRequest(formData as any);
    }

    setIsModalOpen(false);
    loadData();
  };

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const getPriorityBadge = (priority: MaintenancePriority) => {
    const variants: Record<MaintenancePriority, 'danger' | 'warning' | 'info' | 'gray'> = {
      emergency: 'danger',
      high: 'warning',
      medium: 'info',
      low: 'gray',
    };
    return <Badge variant={variants[priority]}>{formatStatus(priority)}</Badge>;
  };

  const getStatusBadge = (status: MaintenanceStatus) => {
    const variants: Record<MaintenanceStatus, 'success' | 'warning' | 'info' | 'gray'> = {
      completed: 'success',
      'in-progress': 'info',
      pending: 'warning',
      cancelled: 'gray',
    };
    return <Badge variant={variants[status]}>{formatStatus(status)}</Badge>;
  };

  const columns = [
    {
      key: 'property',
      label: 'Property / Unit',
      render: (r: MaintenanceRequest) => (
        <div>
          <p className="font-medium text-gray-900">{getPropertyName(r.propertyId)}</p>
          <p className="text-sm text-gray-500">Unit {r.unitNumber || 'N/A'}</p>
        </div>
      ),
    },
    {
      key: 'description',
      label: 'Description',
      render: (r: MaintenanceRequest) => (
        <div>
          <p className="font-medium text-gray-900">{r.description}</p>
          <p className="text-sm text-gray-500">{formatStatus(r.category)}</p>
        </div>
      ),
    },
    {
      key: 'priority',
      label: 'Priority',
      render: (r: MaintenanceRequest) => getPriorityBadge(r.priority),
    },
    {
      key: 'status',
      label: 'Status',
      render: (r: MaintenanceRequest) => getStatusBadge(r.status),
    },
    {
      key: 'dates',
      label: 'Dates',
      render: (r: MaintenanceRequest) => (
        <div className="text-sm">
          <p>Reported: {formatDate(r.reportedDate)}</p>
          {r.completedDate && <p className="text-gray-500">Completed: {formatDate(r.completedDate)}</p>}
        </div>
      ),
    },
    {
      key: 'cost',
      label: 'Cost',
      render: (r: MaintenanceRequest) => (
        <div>
          <p className="font-medium">{formatCurrency(r.actualCost || r.estimatedCost)}</p>
          <p className="text-xs text-gray-500">{r.actualCost ? 'Actual' : 'Estimated'}</p>
        </div>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (r: MaintenanceRequest) => (
        <Button size="sm" variant="ghost" onClick={() => handleEdit(r)}>
          Edit
        </Button>
      ),
    },
  ];

  return (
    <div>
      <Header title="Maintenance Requests" subtitle="Track and manage property maintenance" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">All Requests ({requests.length})</h2>
          <Button onClick={handleCreate}>Create Request</Button>
        </div>

        <Card padding="none">
          {requests.length === 0 ? (
            <EmptyState
              title="No maintenance requests"
              description="All properties are in good condition, or create your first maintenance request."
              actionLabel="Create Request"
              onAction={handleCreate}
            />
          ) : (
            <Table columns={columns} data={requests} keyExtractor={(r) => r.id} />
          )}
        </Card>
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingRequest ? 'Update Maintenance Request' : 'Create Maintenance Request'}
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {editingRequest ? 'Update' : 'Create'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Property"
              value={formData.propertyId || ''}
              onChange={(e) => handleChange('propertyId', e.target.value)}
              options={[
                { value: '', label: 'Select a property' },
                ...properties.map((p) => ({ value: p.id, label: p.name })),
              ]}
              required
            />
            <Input
              label="Unit Number (Optional)"
              value={formData.unitNumber || ''}
              onChange={(e) => handleChange('unitNumber', e.target.value)}
            />
          </div>

          <Input
            label="Description"
            value={formData.description || ''}
            onChange={(e) => handleChange('description', e.target.value)}
            required
          />

          <div className="grid grid-cols-3 gap-4">
            <Select
              label="Category"
              value={formData.category || 'other'}
              onChange={(e) => handleChange('category', e.target.value as MaintenanceCategory)}
              options={[
                { value: 'plumbing', label: 'Plumbing' },
                { value: 'electrical', label: 'Electrical' },
                { value: 'hvac', label: 'HVAC' },
                { value: 'structural', label: 'Structural' },
                { value: 'landscaping', label: 'Landscaping' },
                { value: 'appliance', label: 'Appliance' },
                { value: 'other', label: 'Other' },
              ]}
              required
            />
            <Select
              label="Priority"
              value={formData.priority || 'medium'}
              onChange={(e) => handleChange('priority', e.target.value as MaintenancePriority)}
              options={[
                { value: 'emergency', label: 'Emergency' },
                { value: 'high', label: 'High' },
                { value: 'medium', label: 'Medium' },
                { value: 'low', label: 'Low' },
              ]}
              required
            />
            <Select
              label="Status"
              value={formData.status || 'pending'}
              onChange={(e) => handleChange('status', e.target.value as MaintenanceStatus)}
              options={[
                { value: 'pending', label: 'Pending' },
                { value: 'in-progress', label: 'In Progress' },
                { value: 'completed', label: 'Completed' },
                { value: 'cancelled', label: 'Cancelled' },
              ]}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Reported Date"
              type="date"
              value={formData.reportedDate || ''}
              onChange={(e) => handleChange('reportedDate', e.target.value)}
              required
            />
            {formData.status === 'completed' && (
              <Input
                label="Completed Date"
                type="date"
                value={formData.completedDate || ''}
                onChange={(e) => handleChange('completedDate', e.target.value)}
              />
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Estimated Cost (UGX)"
              type="number"
              value={formData.estimatedCost || ''}
              onChange={(e) => handleChange('estimatedCost', parseInt(e.target.value) || 0)}
            />
            <Input
              label="Actual Cost (UGX)"
              type="number"
              value={formData.actualCost || ''}
              onChange={(e) => handleChange('actualCost', parseInt(e.target.value) || 0)}
            />
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
