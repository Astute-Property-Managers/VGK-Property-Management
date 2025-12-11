import React, { useEffect, useState } from 'react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Select } from '../components/Select';
import { Modal } from '../components/Modal';
import { getProperties, saveProperty, deleteProperty } from '../services/dataService';
import type { Property } from '../types';

export const PropertiesView: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [formData, setFormData] = useState<Partial<Property>>({
    name: '',
    address: '',
    type: 'Residential',
    totalUnits: 0,
    occupiedUnits: 0,
    owner: '',
    acquisitionDate: '',
    notes: '',
    status: 'Active',
  });

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = () => {
    const data = getProperties();
    setProperties(data);
  };

  const openAddModal = () => {
    setEditingProperty(null);
    setFormData({
      name: '',
      address: '',
      type: 'Residential',
      totalUnits: 0,
      occupiedUnits: 0,
      owner: '',
      acquisitionDate: '',
      notes: '',
      status: 'Active',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (property: Property) => {
    setEditingProperty(property);
    setFormData(property);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const property: Property = {
      id: editingProperty?.id || '',
      name: formData.name!,
      address: formData.address!,
      type: formData.type as 'Residential' | 'Commercial' | 'Mixed',
      totalUnits: formData.totalUnits!,
      occupiedUnits: formData.occupiedUnits!,
      vacancyRate: 0, // Calculated by dataService
      owner: formData.owner!,
      acquisitionDate: formData.acquisitionDate!,
      notes: formData.notes || '',
      status: formData.status as 'Active' | 'Inactive',
    };

    saveProperty(property);
    loadProperties();
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this property?')) {
      deleteProperty(id);
      loadProperties();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'totalUnits' || name === 'occupiedUnits' ? parseInt(value) || 0 : value,
    }));
  };

  const totalStats = properties.reduce(
    (acc, prop) => ({
      totalUnits: acc.totalUnits + prop.totalUnits,
      occupiedUnits: acc.occupiedUnits + prop.occupiedUnits,
    }),
    { totalUnits: 0, occupiedUnits: 0 }
  );

  const overallOccupancy = totalStats.totalUnits > 0
    ? ((totalStats.occupiedUnits / totalStats.totalUnits) * 100).toFixed(1)
    : '0.0';

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Property Portfolio Management</h1>
        <p className="text-gray-600 mt-2">
          Manage your property portfolio following IREM standards and Griswold's best practices.
          Focus on the 20% of properties generating 80% of revenue (Pareto Principle).
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-sm font-medium text-gray-600">Total Properties</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">{properties.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-sm font-medium text-gray-600">Total Units</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">{totalStats.totalUnits}</p>
          <p className="text-sm text-gray-500 mt-1">{totalStats.occupiedUnits} occupied</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-sm font-medium text-gray-600">Overall Occupancy</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">{overallOccupancy}%</p>
        </div>
      </div>

      {/* Actions */}
      <div className="mb-4">
        <Button onClick={openAddModal}>+ Add New Property</Button>
      </div>

      {/* Properties List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Property
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Units
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Occupancy
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Owner
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {properties.map(property => (
              <tr key={property.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{property.name}</div>
                    <div className="text-sm text-gray-500">{property.address}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {property.type}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {property.occupiedUnits} / {property.totalUnits}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {property.totalUnits > 0
                      ? ((property.occupiedUnits / property.totalUnits) * 100).toFixed(1)
                      : '0.0'}%
                  </div>
                  <div className="text-xs text-gray-500">
                    {property.totalUnits - property.occupiedUnits} vacant
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {property.owner}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button
                    onClick={() => openEditModal(property)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(property.id)}
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

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProperty ? 'Edit Property' : 'Add New Property'}
      >
        <form onSubmit={handleSubmit}>
          <Input
            label="Property Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <Input
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
          <Select
            label="Type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            options={[
              { value: 'Residential', label: 'Residential' },
              { value: 'Commercial', label: 'Commercial' },
              { value: 'Mixed', label: 'Mixed Use' },
            ]}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Total Units"
              name="totalUnits"
              type="number"
              value={formData.totalUnits}
              onChange={handleChange}
              required
              min="0"
            />
            <Input
              label="Occupied Units"
              name="occupiedUnits"
              type="number"
              value={formData.occupiedUnits}
              onChange={handleChange}
              required
              min="0"
              max={formData.totalUnits}
            />
          </div>
          <Input
            label="Owner"
            name="owner"
            value={formData.owner}
            onChange={handleChange}
            required
          />
          <Input
            label="Acquisition Date"
            name="acquisitionDate"
            type="date"
            value={formData.acquisitionDate}
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
          <Select
            label="Status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            options={[
              { value: 'Active', label: 'Active' },
              { value: 'Inactive', label: 'Inactive' },
            ]}
          />
          <div className="flex justify-end gap-2 mt-6">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Property</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
