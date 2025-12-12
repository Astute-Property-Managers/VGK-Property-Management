import React, { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Select } from '../components/Select';
import { Modal } from '../components/Modal';
import { StatusIndicator } from '../components/StatusIndicator';
import { getCriticalNumbers, saveCriticalNumber, deleteCriticalNumber } from '../services/dataService';
import type { CriticalNumber } from '../types';

export const CriticalNumbersView: React.FC = () => {
  const [criticalNumbers, setCriticalNumbers] = useState<CriticalNumber[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [editingNumber, setEditingNumber] = useState<CriticalNumber | null>(null);
  const [selectedNumber, setSelectedNumber] = useState<CriticalNumber | null>(null);
  const [formData, setFormData] = useState<Partial<CriticalNumber>>({
    name: '',
    description: '',
    currentValue: 0,
    targetValue: 0,
    unit: '',
    status: 'YELLOW',
    category: 'Financial',
    history: [],
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const data = getCriticalNumbers();
    setCriticalNumbers(data);
  };

  const openAddModal = () => {
    setEditingNumber(null);
    setFormData({
      name: '',
      description: '',
      currentValue: 0,
      targetValue: 0,
      unit: '',
      status: 'YELLOW',
      category: 'Financial',
      history: [],
    });
    setIsModalOpen(true);
  };

  const openEditModal = (number: CriticalNumber) => {
    setEditingNumber(number);
    setFormData(number);
    setIsModalOpen(true);
  };

  const openHistoryModal = (number: CriticalNumber) => {
    setSelectedNumber(number);
    setIsHistoryModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Auto-determine status
    let status: 'GREEN' | 'YELLOW' | 'RED' = 'YELLOW';
    const achievement = (formData.currentValue || 0) / (formData.targetValue || 1);
    if (achievement >= 1) {
      status = 'GREEN';
    } else if (achievement >= 0.8) {
      status = 'YELLOW';
    } else {
      status = 'RED';
    }

    // Add current value to history
    const newHistoryEntry = {
      date: new Date().toISOString().split('T')[0],
      value: formData.currentValue || 0,
    };

    const existingHistory = editingNumber?.history || [];
    const updatedHistory = [...existingHistory, newHistoryEntry];

    const criticalNumber: CriticalNumber = {
      id: editingNumber?.id || '',
      name: formData.name!,
      description: formData.description!,
      currentValue: formData.currentValue || 0,
      targetValue: formData.targetValue || 0,
      unit: formData.unit!,
      status,
      category: formData.category || 'Financial',
      history: updatedHistory,
    };

    saveCriticalNumber(criticalNumber);
    loadData();
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this Critical Number?')) {
      deleteCriticalNumber(id);
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
    total: criticalNumbers.length,
    hitting: criticalNumbers.filter(n => n.status === 'GREEN').length,
    atRisk: criticalNumbers.filter(n => n.status === 'YELLOW').length,
    missing: criticalNumbers.filter(n => n.status === 'RED').length,
  };

  // Group by category
  const groupedNumbers = criticalNumbers.reduce((acc, num) => {
    if (!acc[num.category]) {
      acc[num.category] = [];
    }
    acc[num.category].push(num);
    return acc;
  }, {} as Record<string, CriticalNumber[]>);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Critical Numbers</h1>
        <p className="text-gray-600 mt-2">
          <strong>Verne Harnish - Scaling Up:</strong> "The one number that matters most right now."
          Track 3-5 critical numbers that predict business health. Update daily or weekly.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-sm font-medium text-gray-600">Total Numbers</h3>
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
      </div>

      {/* Actions */}
      <div className="mb-4">
        <Button onClick={openAddModal}>+ Add Critical Number</Button>
      </div>

      {/* Critical Numbers by Category */}
      <div className="space-y-6">
        {Object.entries(groupedNumbers).map(([category, numbers]) => (
          <div key={category} className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">{category}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {numbers.map(number => {
                const achievement = (number.currentValue / number.targetValue) * 100;

                return (
                  <div
                    key={number.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <StatusIndicator status={number.status} />
                        <h4 className="text-lg font-semibold text-gray-900">{number.name}</h4>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => openHistoryModal(number)}
                          className="text-blue-600 hover:text-blue-900 text-xs"
                          title="View History"
                        >
                          📊
                        </button>
                        <button
                          onClick={() => openEditModal(number)}
                          className="text-indigo-600 hover:text-indigo-900 text-xs"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDelete(number.id)}
                          className="text-red-600 hover:text-red-900 text-xs"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-gray-600 mb-3">{number.description}</p>

                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div>
                        <p className="text-xs text-gray-500 uppercase">Current</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {number.currentValue.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-500">{number.unit}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase">Target</p>
                        <p className="text-2xl font-bold text-indigo-600">
                          {number.targetValue.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-500">{number.unit}</p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div>
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>Achievement</span>
                        <span>{achievement.toFixed(0)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
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
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {criticalNumbers.length === 0 && (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <p className="text-gray-500 text-lg mb-4">No Critical Numbers defined.</p>
          <p className="text-gray-400 text-sm mb-6">
            Identify 3-5 numbers that, if achieved, will guarantee business success.
          </p>
          <Button onClick={openAddModal}>Add Your First Critical Number</Button>
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingNumber ? 'Update Critical Number' : 'Add Critical Number'}
      >
        <form onSubmit={handleSubmit}>
          <Input
            label="Critical Number Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="e.g., Cash Balance"
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
              placeholder="Why this number is critical"
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
              placeholder="UGX, %, #"
            />
          </div>

          <Select
            label="Category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            options={[
              { value: 'Financial', label: 'Financial' },
              { value: 'Operational', label: 'Operational' },
              { value: 'Customer', label: 'Customer' },
            ]}
          />

          <div className="flex justify-end gap-2 mt-6">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </Modal>

      {/* History Modal */}
      <Modal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        title={`${selectedNumber?.name} - Historical Trend`}
      >
        {selectedNumber && selectedNumber.history && selectedNumber.history.length > 0 ? (
          <div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={selectedNumber.history}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={2} name={selectedNumber.unit} />
              </LineChart>
            </ResponsiveContainer>

            <div className="mt-4 max-h-60 overflow-y-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Date
                    </th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                      Value
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {selectedNumber.history.map((entry, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2 text-sm text-gray-900">
                        {new Date(entry.date).toLocaleDateString('en-UG')}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900 text-right">
                        {entry.value.toLocaleString()} {selectedNumber.unit}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No historical data available yet.</p>
        )}
      </Modal>

      {/* Harnish Methodology Note */}
      <div className="mt-6 bg-indigo-50 border border-indigo-200 rounded-lg p-6">
        <h3 className="font-semibold text-indigo-900 mb-2">🎯 Scaling Up - Critical Numbers</h3>
        <ul className="list-disc list-inside text-sm text-indigo-800 space-y-1">
          <li>
            <strong>3-5 Numbers Max:</strong> The metrics that predict business success
          </li>
          <li>
            <strong>Leading Indicators:</strong> Numbers you can influence daily/weekly
          </li>
          <li>
            <strong>Everyone Knows:</strong> Post visibly, update regularly, celebrate wins
          </li>
          <li>
            <strong>Historical Tracking:</strong> Trend analysis reveals patterns
          </li>
          <li>
            <strong>Example:</strong> Cash balance, rent collection rate, occupancy rate, maintenance backlog
          </li>
        </ul>
      </div>
    </div>
  );
};
