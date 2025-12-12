import React, { useEffect, useState } from 'react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Select } from '../components/Select';
import { Modal } from '../components/Modal';
import {
  getMaintenanceRequests,
  saveMaintenanceRequest,
  deleteMaintenanceRequest,
  getProperties,
  getVendors,
  formatUGX,
} from '../services/dataService';
import type { MaintenanceRequest, Property, Vendor } from '../types';

export const MaintenanceView: React.FC = () => {
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRequest, setEditingRequest] = useState<MaintenanceRequest | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');

  const [formData, setFormData] = useState<Partial<MaintenanceRequest>>({
    propertyId: '',
    tenantId: '',
    unitNumber: '',
    category: 'Other',
    priority: 'Routine',
    description: '',
    status: 'Pending',
    assignedVendorId: '',
    estimatedCost: 0,
    actualCost: 0,
    dateRequested: new Date().toISOString().split('T')[0],
    dateCompleted: '',
    notes: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setRequests(getMaintenanceRequests());
    setProperties(getProperties());
    setVendors(getVendors());
  };

  const openAddModal = () => {
    setEditingRequest(null);
    setFormData({
      propertyId: properties[0]?.id || '',
      tenantId: '',
      unitNumber: '',
      category: 'Other',
      priority: 'Routine',
      description: '',
      status: 'Pending',
      assignedVendorId: '',
      estimatedCost: 0,
      actualCost: 0,
      dateRequested: new Date().toISOString().split('T')[0],
      dateCompleted: '',
      notes: '',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (request: MaintenanceRequest) => {
    setEditingRequest(request);
    setFormData(request);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const request: MaintenanceRequest = {
      id: editingRequest?.id || '',
      propertyId: formData.propertyId!,
      tenantId: formData.tenantId,
      unitNumber: formData.unitNumber,
      category: formData.category!,
      priority: formData.priority!,
      description: formData.description!,
      status: formData.status!,
      assignedVendorId: formData.assignedVendorId,
      estimatedCost: formData.estimatedCost,
      actualCost: formData.actualCost,
      dateRequested: formData.dateRequested!,
      dateCompleted: formData.dateCompleted,
      notes: formData.notes || '',
    };

    saveMaintenanceRequest(request);
    loadData();
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this maintenance request?')) {
      deleteMaintenanceRequest(id);
      loadData();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'estimatedCost' || name === 'actualCost'
        ? parseFloat(value) || 0
        : value,
    }));
  };

  // Filter requests
  const filteredRequests = requests.filter(request => {
    const statusMatch = filterStatus === 'all' || request.status === filterStatus;
    const priorityMatch = filterPriority === 'all' || request.priority === filterPriority;
    return statusMatch && priorityMatch;
  });

  // Calculate stats
  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === 'Pending').length,
    inProgress: requests.filter(r => r.status === 'In Progress').length,
    completed: requests.filter(r => r.status === 'Completed').length,
    avgResponseTime: calculateAvgResponseTime(requests),
  };

  function calculateAvgResponseTime(reqs: MaintenanceRequest[]): number {
    const completed = reqs.filter(r => r.dateCompleted);
    if (completed.length === 0) return 0;

    const totalDays = completed.reduce((sum, r) => {
      const requested = new Date(r.dateRequested).getTime();
      const completedDate = new Date(r.dateCompleted!).getTime();
      return sum + (completedDate - requested) / (1000 * 60 * 60 * 24);
    }, 0);

    return Math.round(totalDays / completed.length);
  }

  const statusColors = {
    'Pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'Assigned': 'bg-blue-100 text-blue-800 border-blue-200',
    'In Progress': 'bg-indigo-100 text-indigo-800 border-indigo-200',
    'On Hold': 'bg-gray-100 text-gray-800 border-gray-200',
    'Completed': 'bg-green-100 text-green-800 border-green-200',
    'Cancelled': 'bg-red-100 text-red-800 border-red-200',
  };

  const priorityColors = {
    'Critical': 'bg-red-600 text-white',
    'Urgent': 'bg-orange-600 text-white',
    'Routine': 'bg-blue-600 text-white',
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Maintenance Requests</h1>
        <p className="text-gray-600 mt-2">
          <strong>Griswold Best Practice:</strong> Response time is a top tenant satisfaction driver.
          Track requests, assign vendors, and monitor costs for effective property maintenance.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-sm font-medium text-gray-600">Total Requests</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</p>
        </div>
        <div className="bg-yellow-50 rounded-lg shadow-md p-6 border border-yellow-200">
          <h3 className="text-sm font-medium text-yellow-600">Pending</h3>
          <p className="text-3xl font-bold text-yellow-900 mt-2">{stats.pending}</p>
        </div>
        <div className="bg-blue-50 rounded-lg shadow-md p-6 border border-blue-200">
          <h3 className="text-sm font-medium text-blue-600">In Progress</h3>
          <p className="text-3xl font-bold text-blue-900 mt-2">{stats.inProgress}</p>
        </div>
        <div className="bg-green-50 rounded-lg shadow-md p-6 border border-green-200">
          <h3 className="text-sm font-medium text-green-600">Completed</h3>
          <p className="text-3xl font-bold text-green-900 mt-2">{stats.completed}</p>
        </div>
        <div className="bg-indigo-50 rounded-lg shadow-md p-6 border border-indigo-200">
          <h3 className="text-sm font-medium text-indigo-600">Avg Response</h3>
          <p className="text-3xl font-bold text-indigo-900 mt-2">{stats.avgResponseTime}</p>
          <p className="text-sm text-indigo-600">days</p>
        </div>
      </div>

      {/* Actions & Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-4 flex flex-wrap items-center gap-4">
        <Button onClick={openAddModal}>+ New Request</Button>

        <div className="flex-1" />

        <Select
          options={[
            { value: 'all', label: 'All Statuses' },
            { value: 'Pending', label: 'Pending' },
            { value: 'Assigned', label: 'Assigned' },
            { value: 'In Progress', label: 'In Progress' },
            { value: 'On Hold', label: 'On Hold' },
            { value: 'Completed', label: 'Completed' },
            { value: 'Cancelled', label: 'Cancelled' },
          ]}
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="w-40"
        />

        <Select
          options={[
            { value: 'all', label: 'All Priorities' },
            { value: 'Critical', label: 'Critical' },
            { value: 'Urgent', label: 'Urgent' },
            { value: 'Routine', label: 'Routine' },
          ]}
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
          className="w-40"
        />
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {filteredRequests.map(request => {
          const property = properties.find(p => p.id === request.propertyId);
          const vendor = vendors.find(v => v.id === request.assignedVendorId);

          return (
            <div key={request.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${priorityColors[request.priority]}`}>
                      {request.priority}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-semibold border ${statusColors[request.status]}`}>
                      {request.status}
                    </span>
                    <span className="text-xs text-gray-500">
                      {request.category}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{request.description}</h3>
                  <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
                    <span>
                      <strong>Property:</strong> {property?.name} {request.unitNumber && `- Unit ${request.unitNumber}`}
                    </span>
                    <span>
                      <strong>Requested:</strong> {new Date(request.dateRequested).toLocaleDateString('en-UG')}
                    </span>
                    {vendor && (
                      <span>
                        <strong>Assigned to:</strong> {vendor.name}
                      </span>
                    )}
                    {request.estimatedCost && request.estimatedCost > 0 && (
                      <span>
                        <strong>Est. Cost:</strong> {formatUGX(request.estimatedCost)}
                      </span>
                    )}
                    {request.actualCost && request.actualCost > 0 && (
                      <span>
                        <strong>Actual Cost:</strong> {formatUGX(request.actualCost)}
                      </span>
                    )}
                  </div>
                  {request.notes && (
                    <p className="mt-2 text-sm text-gray-600 italic">{request.notes}</p>
                  )}
                </div>
                <div className="ml-4 flex gap-2">
                  <button
                    onClick={() => openEditModal(request)}
                    className="text-indigo-600 hover:text-indigo-900 font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(request.id)}
                    className="text-red-600 hover:text-red-900 font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredRequests.length === 0 && (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <p className="text-gray-500 text-lg">No maintenance requests found.</p>
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingRequest ? 'Edit Maintenance Request' : 'New Maintenance Request'}
      >
        <form onSubmit={handleSubmit}>
          <Select
            label="Property"
            name="propertyId"
            value={formData.propertyId}
            onChange={handleChange}
            options={properties.map(p => ({ value: p.id, label: p.name }))}
            required
          />

          <Input
            label="Unit Number (if applicable)"
            name="unitNumber"
            value={formData.unitNumber}
            onChange={handleChange}
            placeholder="e.g., A-101"
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              options={[
                { value: 'Plumbing', label: 'Plumbing' },
                { value: 'Electrical', label: 'Electrical' },
                { value: 'HVAC', label: 'HVAC' },
                { value: 'Structural', label: 'Structural' },
                { value: 'Landscaping', label: 'Landscaping' },
                { value: 'Security', label: 'Security' },
                { value: 'Other', label: 'Other' },
              ]}
            />
            <Select
              label="Priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              options={[
                { value: 'Critical', label: 'Critical' },
                { value: 'Urgent', label: 'Urgent' },
                { value: 'Routine', label: 'Routine' },
              ]}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Describe the issue"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              options={[
                { value: 'Pending', label: 'Pending' },
                { value: 'Assigned', label: 'Assigned' },
                { value: 'In Progress', label: 'In Progress' },
                { value: 'On Hold', label: 'On Hold' },
                { value: 'Completed', label: 'Completed' },
                { value: 'Cancelled', label: 'Cancelled' },
              ]}
            />
            <Select
              label="Assign Vendor"
              name="assignedVendorId"
              value={formData.assignedVendorId}
              onChange={handleChange}
              options={[
                { value: '', label: 'Not Assigned' },
                ...vendors.map(v => ({ value: v.id, label: v.name })),
              ]}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Estimated Cost (UGX)"
              name="estimatedCost"
              type="number"
              value={formData.estimatedCost}
              onChange={handleChange}
              min="0"
              step="1000"
            />
            <Input
              label="Actual Cost (UGX)"
              name="actualCost"
              type="number"
              value={formData.actualCost}
              onChange={handleChange}
              min="0"
              step="1000"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Date Requested"
              name="dateRequested"
              type="date"
              value={formData.dateRequested}
              onChange={handleChange}
              required
            />
            <Input
              label="Date Completed"
              name="dateCompleted"
              type="date"
              value={formData.dateCompleted}
              onChange={handleChange}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Additional notes"
            />
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Request</Button>
          </div>
        </form>
      </Modal>

      {/* Best Practices Note */}
      <div className="mt-6 bg-indigo-50 border border-indigo-200 rounded-lg p-6">
        <h3 className="font-semibold text-indigo-900 mb-2">🔧 Griswold - Maintenance Best Practices</h3>
        <ul className="list-disc list-inside text-sm text-indigo-800 space-y-1">
          <li>
            <strong>Response Time KPI:</strong> Track average days from request to completion
          </li>
          <li>
            <strong>Preventive Maintenance:</strong> Schedule regular inspections to catch issues early
          </li>
          <li>
            <strong>Vendor Relationships:</strong> Build a reliable team of contractors
          </li>
          <li>
            <strong>Cost Tracking:</strong> Monitor actual vs estimated costs for budget accuracy
          </li>
          <li>
            <strong>Tenant Communication:</strong> Keep tenants informed of progress
          </li>
        </ul>
      </div>
    </div>
  );
};
