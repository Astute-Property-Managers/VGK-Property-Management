import React, { useEffect, useState } from 'react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Select } from '../components/Select';
import { Modal } from '../components/Modal';
import { StatusIndicator } from '../components/StatusIndicator';
import { getRocks, saveRock, deleteRock } from '../services/dataService';
import type { Rock } from '../types';

export const RocksView: React.FC = () => {
  const [rocks, setRocks] = useState<Rock[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRock, setEditingRock] = useState<Rock | null>(null);
  const [formData, setFormData] = useState<Partial<Rock>>({
    title: '',
    description: '',
    owner: '',
    dueDate: '',
    status: 'YELLOW',
    progress: 0,
    category: 'Operational',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const data = getRocks();
    setRocks(data);
  };

  const openAddModal = () => {
    setEditingRock(null);
    setFormData({
      title: '',
      description: '',
      owner: '',
      dueDate: '',
      status: 'YELLOW',
      progress: 0,
      category: 'Operational',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (rock: Rock) => {
    setEditingRock(rock);
    setFormData(rock);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const rock: Rock = {
      id: editingRock?.id || '',
      title: formData.title!,
      description: formData.description!,
      owner: formData.owner!,
      dueDate: formData.dueDate!,
      status: formData.status || 'YELLOW',
      progress: formData.progress || 0,
      category: formData.category || 'Operational',
    };

    saveRock(rock);
    loadData();
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this Rock?')) {
      deleteRock(id);
      loadData();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'progress' ? parseInt(value) || 0 : value,
    }));
  };

  // Group rocks by category
  const groupedRocks = rocks.reduce((acc, rock) => {
    if (!acc[rock.category]) {
      acc[rock.category] = [];
    }
    acc[rock.category].push(rock);
    return acc;
  }, {} as Record<string, Rock[]>);

  // Calculate stats
  const stats = {
    total: rocks.length,
    onTrack: rocks.filter(r => r.status === 'GREEN').length,
    atRisk: rocks.filter(r => r.status === 'YELLOW').length,
    offTrack: rocks.filter(r => r.status === 'RED').length,
    avgProgress: rocks.length > 0
      ? Math.round(rocks.reduce((sum, r) => sum + r.progress, 0) / rocks.length)
      : 0,
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Quarterly Rocks</h1>
        <p className="text-gray-600 mt-2">
          <strong>Verne Harnish - Scaling Up:</strong> Focus on 3-5 quarterly priorities (Rocks) that move the needle.
          Track progress with weekly accountability. "If everything is important, nothing is important."
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-sm font-medium text-gray-600">Total Rocks</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</p>
          <p className="text-sm text-gray-500 mt-1">This Quarter</p>
        </div>
        <div className="bg-green-50 rounded-lg shadow-md p-6 border border-green-200">
          <h3 className="text-sm font-medium text-green-600">On Track</h3>
          <p className="text-3xl font-bold text-green-900 mt-2">{stats.onTrack}</p>
          <StatusIndicator status="GREEN" />
        </div>
        <div className="bg-yellow-50 rounded-lg shadow-md p-6 border border-yellow-200">
          <h3 className="text-sm font-medium text-yellow-600">At Risk</h3>
          <p className="text-3xl font-bold text-yellow-900 mt-2">{stats.atRisk}</p>
          <StatusIndicator status="YELLOW" />
        </div>
        <div className="bg-red-50 rounded-lg shadow-md p-6 border border-red-200">
          <h3 className="text-sm font-medium text-red-600">Off Track</h3>
          <p className="text-3xl font-bold text-red-900 mt-2">{stats.offTrack}</p>
          <StatusIndicator status="RED" />
        </div>
        <div className="bg-indigo-50 rounded-lg shadow-md p-6 border border-indigo-200">
          <h3 className="text-sm font-medium text-indigo-600">Avg Progress</h3>
          <p className="text-3xl font-bold text-indigo-900 mt-2">{stats.avgProgress}%</p>
          <p className="text-sm text-indigo-600 mt-1">Completion</p>
        </div>
      </div>

      {/* Actions */}
      <div className="mb-4">
        <Button onClick={openAddModal}>+ Add New Rock</Button>
      </div>

      {/* Rocks by Category */}
      <div className="space-y-6">
        {Object.entries(groupedRocks).map(([category, categoryRocks]) => (
          <div key={category} className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">{category}</h3>
            <div className="space-y-4">
              {categoryRocks.map(rock => (
                <div
                  key={rock.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <StatusIndicator status={rock.status} />
                        <h4 className="text-lg font-semibold text-gray-900">{rock.title}</h4>
                      </div>
                      <p className="text-gray-600 text-sm mb-3">{rock.description}</p>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                        <span>
                          <strong>Owner:</strong> {rock.owner}
                        </span>
                        <span>
                          <strong>Due:</strong> {new Date(rock.dueDate).toLocaleDateString('en-UG')}
                        </span>
                        <span>
                          <strong>Progress:</strong> {rock.progress}%
                        </span>
                      </div>
                      {/* Progress Bar */}
                      <div className="mt-3">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              rock.progress >= 100
                                ? 'bg-green-600'
                                : rock.progress >= 75
                                ? 'bg-blue-600'
                                : rock.progress >= 50
                                ? 'bg-yellow-600'
                                : 'bg-red-600'
                            }`}
                            style={{ width: `${rock.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    <div className="ml-4 flex gap-2">
                      <button
                        onClick={() => openEditModal(rock)}
                        className="text-indigo-600 hover:text-indigo-900 font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(rock.id)}
                        className="text-red-600 hover:text-red-900 font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {rocks.length === 0 && (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <p className="text-gray-500 text-lg mb-4">No Rocks defined for this quarter.</p>
          <p className="text-gray-400 text-sm mb-6">
            Start by identifying 3-5 quarterly priorities that will have the biggest impact.
          </p>
          <Button onClick={openAddModal}>Add Your First Rock</Button>
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingRock ? 'Edit Rock' : 'Add New Rock'}
      >
        <form onSubmit={handleSubmit}>
          <Input
            label="Rock Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="e.g., Launch new tenant portal"
          />

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Describe the outcome and why it matters"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Owner (Responsible Person)"
              name="owner"
              value={formData.owner}
              onChange={handleChange}
              required
              placeholder="John Doe"
            />
            <Input
              label="Due Date"
              name="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              options={[
                { value: 'Growth', label: 'Growth' },
                { value: 'Financial', label: 'Financial' },
                { value: 'Operational', label: 'Operational' },
                { value: 'People', label: 'People' },
              ]}
            />
            <Select
              label="Status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              options={[
                { value: 'GREEN', label: '🟢 On Track' },
                { value: 'YELLOW', label: '🟡 At Risk' },
                { value: 'RED', label: '🔴 Off Track' },
              ]}
            />
          </div>

          <Input
            label={`Progress (${formData.progress || 0}%)`}
            name="progress"
            type="range"
            min="0"
            max="100"
            step="5"
            value={formData.progress}
            onChange={handleChange}
          />

          <div className="flex justify-end gap-2 mt-6">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Rock</Button>
          </div>
        </form>
      </Modal>

      {/* Harnish Methodology Note */}
      <div className="mt-6 bg-indigo-50 border border-indigo-200 rounded-lg p-6">
        <h3 className="font-semibold text-indigo-900 mb-2">🎯 Scaling Up - Rocks Methodology</h3>
        <ul className="list-disc list-inside text-sm text-indigo-800 space-y-1">
          <li>
            <strong>3-5 Rocks Maximum:</strong> Too many priorities = no priorities
          </li>
          <li>
            <strong>Quarterly Focus:</strong> 90-day sprints create urgency and momentum
          </li>
          <li>
            <strong>Clear Ownership:</strong> One person accountable for each Rock
          </li>
          <li>
            <strong>Weekly Review:</strong> Check status in weekly huddles (Green/Yellow/Red)
          </li>
          <li>
            <strong>Completion Matters:</strong> Better to finish 3 Rocks than start 10
          </li>
        </ul>
      </div>
    </div>
  );
};
