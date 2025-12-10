import React, { useEffect, useState } from 'react';
import { Header } from '../components/layout/Header';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Modal } from '../components/ui/Modal';
import { StatusBadge } from '../components/ui/StatusBadge';
import { dataService } from '../services/data.service';
import { Rock } from '../types';
import { formatDate } from '../utils/formatting';

export function Rocks() {
  const [rocks, setRocks] = useState<Rock[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRock, setEditingRock] = useState<Rock | null>(null);
  const [formData, setFormData] = useState<Partial<Rock>>({});

  useEffect(() => {
    loadRocks();
  }, []);

  const loadRocks = () => {
    setRocks(dataService.getAllRocks());
  };

  const handleCreate = () => {
    setEditingRock(null);
    setFormData({ status: 'on-track', progress: 0 });
    setIsModalOpen(true);
  };

  const handleEdit = (rock: Rock) => {
    setEditingRock(rock);
    setFormData(rock);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this rock?')) {
      dataService.deleteRock(id);
      loadRocks();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingRock) {
      dataService.updateRock(editingRock.id, formData);
    } else {
      dataService.createRock(formData as any);
    }

    setIsModalOpen(false);
    loadRocks();
  };

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div>
      <Header
        title="Quarterly Rocks"
        subtitle="Track your 3-5 most important quarterly priorities (from Scaling Up methodology)"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Current Quarter Rocks</h2>
          <Button onClick={handleCreate}>Add Rock</Button>
        </div>

        <div className="grid gap-6">
          {rocks.map((rock) => (
            <Card key={rock.id}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{rock.description}</h3>
                    <StatusBadge status={rock.status === 'on-track' ? 'GREEN' : rock.status === 'at-risk' ? 'YELLOW' : 'RED'} />
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>Owner: {rock.owner}</span>
                    <span>Quarter: {rock.quarter}</span>
                    <span>Due: {formatDate(rock.dueDate)}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" onClick={() => handleEdit(rock)}>
                    Edit
                  </Button>
                  <Button size="sm" variant="danger" onClick={() => handleDelete(rock.id)}>
                    Delete
                  </Button>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-700 font-medium">Progress</span>
                  <span className="text-gray-900 font-semibold">{rock.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all ${
                      rock.progress >= 100 ? 'bg-green-600' :
                      rock.progress >= 75 ? 'bg-blue-600' :
                      rock.progress >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${Math.min(rock.progress, 100)}%` }}
                  />
                </div>
              </div>
            </Card>
          ))}

          {rocks.length === 0 && (
            <Card>
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">No rocks for this quarter. Add your top 3-5 priorities.</p>
                <Button onClick={handleCreate}>Add Your First Rock</Button>
              </div>
            </Card>
          )}
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingRock ? 'Edit Rock' : 'Add New Rock'}
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit}>{editingRock ? 'Update' : 'Create'}</Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Description (What will be accomplished?)"
            value={formData.description || ''}
            onChange={(e) => handleChange('description', e.target.value)}
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Owner"
              value={formData.owner || ''}
              onChange={(e) => handleChange('owner', e.target.value)}
              required
            />
            <Input
              label="Quarter"
              value={formData.quarter || ''}
              onChange={(e) => handleChange('quarter', e.target.value)}
              placeholder="e.g., Q1 2024"
              required
            />
          </div>
          <Input
            label="Due Date"
            type="date"
            value={formData.dueDate || ''}
            onChange={(e) => handleChange('dueDate', e.target.value)}
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Status"
              value={formData.status || 'on-track'}
              onChange={(e) => handleChange('status', e.target.value)}
              options={[
                { value: 'on-track', label: 'On Track' },
                { value: 'at-risk', label: 'At Risk' },
                { value: 'off-track', label: 'Off Track' },
              ]}
              required
            />
            <Input
              label="Progress (%)"
              type="number"
              min="0"
              max="100"
              value={formData.progress || 0}
              onChange={(e) => handleChange('progress', parseInt(e.target.value) || 0)}
              required
            />
          </div>
        </form>
      </Modal>
    </div>
  );
}
