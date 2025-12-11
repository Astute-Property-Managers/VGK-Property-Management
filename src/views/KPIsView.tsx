import React, { useEffect, useState } from 'react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Select } from '../components/Select';
import { Modal } from '../components/Modal';
import { StatusIndicator } from '../components/StatusIndicator';
import { getKPIs, saveKPI, deleteKPI } from '../services/dataService';
import type { KPI } from '../types';

export const KPIsView: React.FC = () => {
  const [kpis, setKpis] = useState<KPI[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingKPI, setEditingKPI] = useState<KPI | null>(null);
  const [formData, setFormData] = useState<Partial<KPI>>({
    name: '',
    description: '',
    currentValue: 0,
    targetValue: 0,
    unit: '',
    frequency: 'Monthly',
    status: 'YELLOW',
    trend: 'stable',
    lastUpdated: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const data = getKPIs();
    setKpis(data);
  };

  const openAddModal = () => {
    setEditingKPI(null);
    setFormData({
      name: '',
      description: '',
      currentValue: 0,
      targetValue: 0,
      unit: '',
      frequency: 'Monthly',
      status: 'YELLOW',
      trend: 'stable',
      lastUpdated: new Date().toISOString().split('T')[0],
    });
    setIsModalOpen(true);
  };

  const openEditModal = (kpi: KPI) => {
    setEditingKPI(kpi);
    setFormData(kpi);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Auto-determine status based on current vs target
    let status: 'GREEN' | 'YELLOW' | 'RED' = 'YELLOW';
    const achievement = (formData.currentValue || 0) / (formData.targetValue || 1);
    if (achievement >= 1) {
      status = 'GREEN';
    } else if (achievement >= 0.8) {
      status = 'YELLOW';
    } else {
      status = 'RED';
    }

    const kpi: KPI = {
      id: editingKPI?.id || '',
      name: formData.name!,
      description: formData.description!,
      currentValue: formData.currentValue || 0,
      targetValue: formData.targetValue || 0,
      unit: formData.unit!,
      frequency: formData.frequency || 'Monthly',
      status,
      trend: formData.trend || 'stable',
      lastUpdated: formData.lastUpdated || new Date().toISOString().split('T')[0],
    };

    saveKPI(kpi);
    loadData();
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this KPI?')) {
      deleteKPI(id);
      loadData();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'currentValue' || name === 'targetValue'
        ? parseFloat(value) || 0
        : value,
    }));
  };

  // Calculate stats
  const stats = {
    total: kpis.length,
    hitting: kpis.filter(k => k.status === 'GREEN').length,
    atRisk: kpis.filter(k => k.status === 'YELLOW').length,
    missing: kpis.filter(k => k.status === 'RED').length,
    trending: kpis.filter(k => k.trend === 'up').length,
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Key Performance Indicators (KPIs)</h1>
        <p className="text-gray-600 mt-2">
          <strong>Verne Harnish - Scaling Up:</strong> "What gets measured gets done."
          Track 5-10 measurable KPIs that predict future success. Update regularly.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-sm font-medium text-gray-600">Total KPIs</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</p>
        </div>
        <div className="bg-green-50 rounded-lg shadow-md p-6 border border-green-200">
          <h3 className="text-sm font-medium text-green-600">Hitting Target</h3>
          <p className="text-3xl font-bold text-green-900 mt-2">{stats.hitting}</p>
          <StatusIndicator status="GREEN" />
        </div>
        <div className="bg-yellow-50 rounded-lg shadow-md p-6 border border-yellow-200">
          <h3 className="text-sm font-medium text-yellow-600">At Risk</h3>
          <p className="text-3xl font-bold text-yellow-900 mt-2">{stats.atRisk}</p>
          <StatusIndicator status="YELLOW" />
        </div>
        <div className="bg-red-50 rounded-lg shadow-md p-6 border border-red-200">
          <h3 className="text-sm font-medium text-red-600">Missing Target</h3>
          <p className="text-3xl font-bold text-red-900 mt-2">{stats.missing}</p>
          <StatusIndicator status="RED" />
        </div>
        <div className="bg-blue-50 rounded-lg shadow-md p-6 border border-blue-200">
          <h3 className="text-sm font-medium text-blue-600">Trending Up</h3>
          <p className="text-3xl font-bold text-blue-900 mt-2">{stats.trending}</p>
          <p className="text-sm text-blue-600 mt-1">📈 Improving</p>
        </div>
      </div>

      {/* Actions */}
      <div className="mb-4">
        <Button onClick={openAddModal}>+ Add New KPI</Button>
      </div>

      {/* KPIs List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {kpis.map(kpi => {
          const achievement = (kpi.currentValue / kpi.targetValue) * 100;
          const trendIcons = { up: '📈', down: '📉', stable: '➡️' };

          return (
            <div
              key={kpi.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <StatusIndicator status={kpi.status} />
                  <h3 className="text-lg font-semibold text-gray-900">{kpi.name}</h3>
                  <span className="text-xl">{trendIcons[kpi.trend]}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEditModal(kpi)}
                    className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(kpi.id)}
                    className="text-red-600 hover:text-red-900 text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-4">{kpi.description}</p>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase">Current</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {kpi.currentValue.toLocaleString()} {kpi.unit}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase">Target</p>
                  <p className="text-2xl font-bold text-indigo-600">
                    {kpi.targetValue.toLocaleString()} {kpi.unit}
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-3">
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Achievement</span>
                  <span>{achievement.toFixed(0)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full ${
                      achievement >= 100
                        ? 'bg-green-600'
                        : achievement >= 80
                        ? 'bg-yellow-600'
                        : 'bg-red-600'
                    }`}
                    style={{ width: `${Math.min(achievement, 100)}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex justify-between items-center text-xs text-gray-500">
                <span>
                  <strong>Frequency:</strong> {kpi.frequency}
                </span>
                <span>
                  <strong>Updated:</strong> {new Date(kpi.lastUpdated).toLocaleDateString('en-UG')}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {kpis.length === 0 && (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <p className="text-gray-500 text-lg mb-4">No KPIs tracked yet.</p>
          <p className="text-gray-400 text-sm mb-6">
            Define 5-10 leading indicators that predict business success.
          </p>
          <Button onClick={openAddModal}>Add Your First KPI</Button>
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingKPI ? 'Edit KPI' : 'Add New KPI'}
      >
        <form onSubmit={handleSubmit}>
          <Input
            label="KPI Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="e.g., Rent Collection Rate"
          />

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="What does this KPI measure and why does it matter?"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Input
              label="Current Value"
              name="currentValue"
              type="number"
              value={formData.currentValue}
              onChange={handleChange}
              required
              step="0.01"
            />
            <Input
              label="Target Value"
              name="targetValue"
              type="number"
              value={formData.targetValue}
              onChange={handleChange}
              required
              step="0.01"
            />
            <Input
              label="Unit"
              name="unit"
              value={formData.unit}
              onChange={handleChange}
              required
              placeholder="%, UGX, #"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Frequency"
              name="frequency"
              value={formData.frequency}
              onChange={handleChange}
              options={[
                { value: 'Daily', label: 'Daily' },
                { value: 'Weekly', label: 'Weekly' },
                { value: 'Monthly', label: 'Monthly' },
                { value: 'Quarterly', label: 'Quarterly' },
              ]}
            />
            <Select
              label="Trend"
              name="trend"
              value={formData.trend}
              onChange={handleChange}
              options={[
                { value: 'up', label: '📈 Trending Up' },
                { value: 'stable', label: '➡️ Stable' },
                { value: 'down', label: '📉 Trending Down' },
              ]}
            />
          </div>

          <Input
            label="Last Updated"
            name="lastUpdated"
            type="date"
            value={formData.lastUpdated}
            onChange={handleChange}
            required
          />

          <div className="flex justify-end gap-2 mt-6">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Save KPI</Button>
          </div>
        </form>
      </Modal>

      {/* Harnish Methodology Note */}
      <div className="mt-6 bg-indigo-50 border border-indigo-200 rounded-lg p-6">
        <h3 className="font-semibold text-indigo-900 mb-2">📊 Scaling Up - KPI Best Practices</h3>
        <ul className="list-disc list-inside text-sm text-indigo-800 space-y-1">
          <li>
            <strong>Leading Indicators:</strong> Measure activities that predict future results
          </li>
          <li>
            <strong>5-10 KPIs Max:</strong> Focus on what truly matters, ignore vanity metrics
          </li>
          <li>
            <strong>Update Regularly:</strong> Daily/Weekly KPIs keep the team aligned
          </li>
          <li>
            <strong>Visual Management:</strong> Green/Yellow/Red status at a glance
          </li>
          <li>
            <strong>Actionable:</strong> Every KPI should drive specific decisions
          </li>
        </ul>
      </div>
    </div>
  );
};
