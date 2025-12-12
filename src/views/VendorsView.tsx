import React, { useEffect, useState } from 'react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Select } from '../components/Select';
import { Modal } from '../components/Modal';
import { getVendors, saveVendor, deleteVendor } from '../services/dataService';
import type { Vendor } from '../types';

export const VendorsView: React.FC = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
  const [formData, setFormData] = useState<Partial<Vendor>>({
    name: '',
    contactPerson: '',
    phone: '',
    email: '',
    specialization: [],
    rating: 0,
    notes: '',
    status: 'Active',
  });

  const [tempSpecialization, setTempSpecialization] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const data = getVendors();
    setVendors(data);
  };

  const openAddModal = () => {
    setEditingVendor(null);
    setFormData({
      name: '',
      contactPerson: '',
      phone: '',
      email: '',
      specialization: [],
      rating: 0,
      notes: '',
      status: 'Active',
    });
    setTempSpecialization('');
    setIsModalOpen(true);
  };

  const openEditModal = (vendor: Vendor) => {
    setEditingVendor(vendor);
    setFormData(vendor);
    setTempSpecialization('');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const vendor: Vendor = {
      id: editingVendor?.id || '',
      name: formData.name!,
      contactPerson: formData.contactPerson!,
      phone: formData.phone!,
      email: formData.email!,
      specialization: formData.specialization || [],
      rating: formData.rating || 0,
      notes: formData.notes || '',
      status: formData.status || 'Active',
    };

    saveVendor(vendor);
    loadData();
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this vendor?')) {
      deleteVendor(id);
      loadData();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'rating' ? parseInt(value) || 0 : value,
    }));
  };

  const addSpecialization = () => {
    const value = tempSpecialization.trim();
    if (value) {
      setFormData(prev => ({
        ...prev,
        specialization: [...(prev.specialization || []), value],
      }));
      setTempSpecialization('');
    }
  };

  const removeSpecialization = (index: number) => {
    setFormData(prev => ({
      ...prev,
      specialization: (prev.specialization || []).filter((_, i) => i !== index),
    }));
  };

  const activeVendors = vendors.filter(v => v.status === 'Active');
  const inactiveVendors = vendors.filter(v => v.status === 'Inactive');

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Vendor Management</h1>
        <p className="text-gray-600 mt-2">
          <strong>80/20 Principle:</strong> The 20% of vendors handle 80% of maintenance.
          Build relationships with reliable contractors for quality service.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-sm font-medium text-gray-600">Total Vendors</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">{vendors.length}</p>
        </div>
        <div className="bg-green-50 rounded-lg shadow-md p-6 border border-green-200">
          <h3 className="text-sm font-medium text-green-600">Active</h3>
          <p className="text-3xl font-bold text-green-900 mt-2">{activeVendors.length}</p>
        </div>
        <div className="bg-gray-50 rounded-lg shadow-md p-6 border border-gray-200">
          <h3 className="text-sm font-medium text-gray-600">Inactive</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">{inactiveVendors.length}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="mb-4">
        <Button onClick={openAddModal}>+ Add Vendor</Button>
      </div>

      {/* Vendors List */}
      <div className="space-y-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Vendors</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeVendors.map(vendor => (
              <div
                key={vendor.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <h4 className="text-lg font-semibold text-gray-900">{vendor.name}</h4>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={i < vendor.rating ? 'text-yellow-400' : 'text-gray-300'}>
                        ★
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-1 text-sm text-gray-600 mb-3">
                  <p>
                    <strong>Contact:</strong> {vendor.contactPerson}
                  </p>
                  <p>
                    <strong>Phone:</strong> {vendor.phone}
                  </p>
                  <p>
                    <strong>Email:</strong> {vendor.email}
                  </p>
                </div>

                {vendor.specialization && vendor.specialization.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs font-medium text-gray-500 uppercase mb-1">Specializations</p>
                    <div className="flex flex-wrap gap-1">
                      {vendor.specialization.map((spec, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {vendor.notes && (
                  <p className="text-xs text-gray-600 italic mb-3">{vendor.notes}</p>
                )}

                <div className="flex gap-2 pt-2 border-t">
                  <button
                    onClick={() => openEditModal(vendor)}
                    className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(vendor.id)}
                    className="text-red-600 hover:text-red-900 text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {activeVendors.length === 0 && (
            <p className="text-gray-500 text-center py-8">No active vendors yet.</p>
          )}
        </div>

        {inactiveVendors.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Inactive Vendors</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 opacity-60">
              {inactiveVendors.map(vendor => (
                <div
                  key={vendor.id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <h4 className="text-lg font-semibold text-gray-600">{vendor.name}</h4>
                  <p className="text-sm text-gray-500">{vendor.contactPerson}</p>
                  <button
                    onClick={() => openEditModal(vendor)}
                    className="text-indigo-600 hover:text-indigo-900 text-sm font-medium mt-2"
                  >
                    Reactivate
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {vendors.length === 0 && (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <p className="text-gray-500 text-lg mb-4">No vendors in your network yet.</p>
          <p className="text-gray-400 text-sm mb-6">
            Build a reliable team of contractors for efficient maintenance.
          </p>
          <Button onClick={openAddModal}>Add Your First Vendor</Button>
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingVendor ? 'Edit Vendor' : 'Add New Vendor'}
      >
        <form onSubmit={handleSubmit}>
          <Input
            label="Vendor Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="e.g., Kampala Plumbing Services"
          />

          <Input
            label="Contact Person"
            name="contactPerson"
            value={formData.contactPerson}
            onChange={handleChange}
            required
            placeholder="Full name"
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              placeholder="+256 700 123 456"
            />
            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="vendor@example.com"
            />
          </div>

          {/* Specializations */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Specializations</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tempSpecialization}
                onChange={(e) => setTempSpecialization(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSpecialization())}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g., Plumbing, Electrical"
              />
              <Button type="button" onClick={addSpecialization} variant="secondary">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.specialization?.map((spec, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-100 text-indigo-800 rounded text-sm"
                >
                  {spec}
                  <button
                    type="button"
                    onClick={() => removeSpecialization(index)}
                    className="text-red-600 hover:text-red-900"
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rating ({formData.rating || 0}/5)
              </label>
              <input
                type="range"
                name="rating"
                min="0"
                max="5"
                step="1"
                value={formData.rating}
                onChange={handleChange}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Poor</span>
                <span>Excellent</span>
              </div>
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
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Performance notes, pricing info, etc."
            />
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Vendor</Button>
          </div>
        </form>
      </Modal>

      {/* Best Practices Note */}
      <div className="mt-6 bg-indigo-50 border border-indigo-200 rounded-lg p-6">
        <h3 className="font-semibold text-indigo-900 mb-2">🔧 Vendor Management Best Practices</h3>
        <ul className="list-disc list-inside text-sm text-indigo-800 space-y-1">
          <li>
            <strong>80/20 Rule:</strong> 20% of vendors handle 80% of work - invest in those relationships
          </li>
          <li>
            <strong>Rating System:</strong> Track performance to make better assignment decisions
          </li>
          <li>
            <strong>Specialization Matching:</strong> Assign the right vendor for each job type
          </li>
          <li>
            <strong>Response Time:</strong> Prefer vendors who respond quickly to urgent requests
          </li>
          <li>
            <strong>Build Relationships:</strong> Regular work leads to better pricing and priority service
          </li>
        </ul>
      </div>
    </div>
  );
};
