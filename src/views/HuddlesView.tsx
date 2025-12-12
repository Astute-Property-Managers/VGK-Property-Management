import React, { useEffect, useState } from 'react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Select } from '../components/Select';
import { Modal } from '../components/Modal';
import { getHuddles, saveHuddle, deleteHuddle } from '../services/dataService';
import type { HuddleEntry } from '../types';

export const HuddlesView: React.FC = () => {
  const [huddles, setHuddles] = useState<HuddleEntry[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHuddle, setEditingHuddle] = useState<HuddleEntry | null>(null);
  const [formData, setFormData] = useState<Partial<HuddleEntry>>({
    date: new Date().toISOString().split('T')[0],
    type: 'Daily',
    wins: [],
    stucks: [],
    priorities: [],
    attendees: [],
    notes: '',
  });

  const [tempInput, setTempInput] = useState({
    win: '',
    stuck: '',
    priority: '',
    attendee: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const data = getHuddles();
    setHuddles(data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  };

  const openAddModal = () => {
    setEditingHuddle(null);
    setFormData({
      date: new Date().toISOString().split('T')[0],
      type: 'Daily',
      wins: [],
      stucks: [],
      priorities: [],
      attendees: [],
      notes: '',
    });
    setTempInput({ win: '', stuck: '', priority: '', attendee: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (huddle: HuddleEntry) => {
    setEditingHuddle(huddle);
    setFormData(huddle);
    setTempInput({ win: '', stuck: '', priority: '', attendee: '' });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const huddle: HuddleEntry = {
      id: editingHuddle?.id || '',
      date: formData.date!,
      type: formData.type || 'Daily',
      wins: formData.wins || [],
      stucks: formData.stucks || [],
      priorities: formData.priorities || [],
      attendees: formData.attendees || [],
      notes: formData.notes || '',
    };

    saveHuddle(huddle);
    loadData();
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this huddle?')) {
      deleteHuddle(id);
      loadData();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addItem = (listName: 'wins' | 'stucks' | 'priorities' | 'attendees', inputKey: 'win' | 'stuck' | 'priority' | 'attendee') => {
    const value = tempInput[inputKey].trim();
    if (value) {
      setFormData(prev => ({
        ...prev,
        [listName]: [...(prev[listName] || []), value],
      }));
      setTempInput(prev => ({ ...prev, [inputKey]: '' }));
    }
  };

  const removeItem = (listName: 'wins' | 'stucks' | 'priorities' | 'attendees', index: number) => {
    setFormData(prev => ({
      ...prev,
      [listName]: (prev[listName] || []).filter((_item, i) => i !== index),
    }));
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Daily & Weekly Huddles</h1>
        <p className="text-gray-600 mt-2">
          <strong>Verne Harnish - Scaling Up:</strong> "The Rhythm of Communication."
          Daily 5-15 minute stand-ups keep the team aligned. Weekly huddles track Rocks and resolve stucks.
        </p>
      </div>

      {/* Actions */}
      <div className="mb-4 flex gap-2">
        <Button onClick={openAddModal}>+ Log New Huddle</Button>
      </div>

      {/* Huddles Timeline */}
      <div className="space-y-4">
        {huddles.map(huddle => (
          <div key={huddle.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      huddle.type === 'Daily'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-purple-100 text-purple-800'
                    }`}
                  >
                    {huddle.type} Huddle
                  </span>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {new Date(huddle.date).toLocaleDateString('en-UG', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </h3>
                </div>
                {huddle.attendees && huddle.attendees.length > 0 && (
                  <p className="text-sm text-gray-500 mt-1">
                    Attendees: {huddle.attendees.join(', ')}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => openEditModal(huddle)}
                  className="text-indigo-600 hover:text-indigo-900 font-medium"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(huddle.id)}
                  className="text-red-600 hover:text-red-900 font-medium"
                >
                  Delete
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Wins */}
              <div>
                <h4 className="text-sm font-semibold text-green-600 uppercase mb-2">🎉 Wins</h4>
                {huddle.wins && huddle.wins.length > 0 ? (
                  <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                    {huddle.wins.map((win, index) => (
                      <li key={index}>{win}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-400 italic">No wins recorded</p>
                )}
              </div>

              {/* Stucks */}
              <div>
                <h4 className="text-sm font-semibold text-red-600 uppercase mb-2">🚧 Stucks</h4>
                {huddle.stucks && huddle.stucks.length > 0 ? (
                  <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                    {huddle.stucks.map((stuck, index) => (
                      <li key={index}>{stuck}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-400 italic">No stucks recorded</p>
                )}
              </div>

              {/* Priorities */}
              <div>
                <h4 className="text-sm font-semibold text-blue-600 uppercase mb-2">🎯 Priorities</h4>
                {huddle.priorities && huddle.priorities.length > 0 ? (
                  <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                    {huddle.priorities.map((priority, index) => (
                      <li key={index}>{priority}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-400 italic">No priorities set</p>
                )}
              </div>
            </div>

            {huddle.notes && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h4 className="text-sm font-semibold text-gray-600 uppercase mb-1">Notes</h4>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{huddle.notes}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {huddles.length === 0 && (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <p className="text-gray-500 text-lg mb-4">No huddles logged yet.</p>
          <p className="text-gray-400 text-sm mb-6">
            Start logging daily or weekly huddles to maintain team rhythm.
          </p>
          <Button onClick={openAddModal}>Log Your First Huddle</Button>
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingHuddle ? 'Edit Huddle' : 'Log New Huddle'}
      >
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
            <Select
              label="Type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              options={[
                { value: 'Daily', label: 'Daily Huddle' },
                { value: 'Weekly', label: 'Weekly Huddle' },
              ]}
            />
          </div>

          {/* Wins */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-green-600 mb-1">🎉 Wins</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tempInput.win}
                onChange={(e) => setTempInput(prev => ({ ...prev, win: e.target.value }))}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addItem('wins', 'win'))}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Add a win and press Enter"
              />
              <Button type="button" onClick={() => addItem('wins', 'win')} variant="secondary">
                Add
              </Button>
            </div>
            <div className="space-y-1">
              {formData.wins?.map((win, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <span className="flex-1 px-2 py-1 bg-green-50 rounded">{win}</span>
                  <button
                    type="button"
                    onClick={() => removeItem('wins', index)}
                    className="text-red-600 hover:text-red-900"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Stucks */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-red-600 mb-1">🚧 Stucks</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tempInput.stuck}
                onChange={(e) => setTempInput(prev => ({ ...prev, stuck: e.target.value }))}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addItem('stucks', 'stuck'))}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Add a stuck and press Enter"
              />
              <Button type="button" onClick={() => addItem('stucks', 'stuck')} variant="secondary">
                Add
              </Button>
            </div>
            <div className="space-y-1">
              {formData.stucks?.map((stuck, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <span className="flex-1 px-2 py-1 bg-red-50 rounded">{stuck}</span>
                  <button
                    type="button"
                    onClick={() => removeItem('stucks', index)}
                    className="text-red-600 hover:text-red-900"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Priorities */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-blue-600 mb-1">🎯 Priorities</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tempInput.priority}
                onChange={(e) => setTempInput(prev => ({ ...prev, priority: e.target.value }))}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addItem('priorities', 'priority'))}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Add a priority and press Enter"
              />
              <Button type="button" onClick={() => addItem('priorities', 'priority')} variant="secondary">
                Add
              </Button>
            </div>
            <div className="space-y-1">
              {formData.priorities?.map((priority, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <span className="flex-1 px-2 py-1 bg-blue-50 rounded">{priority}</span>
                  <button
                    type="button"
                    onClick={() => removeItem('priorities', index)}
                    className="text-red-600 hover:text-red-900"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Attendees */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Attendees</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tempInput.attendee}
                onChange={(e) => setTempInput(prev => ({ ...prev, attendee: e.target.value }))}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addItem('attendees', 'attendee'))}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Add attendee and press Enter"
              />
              <Button type="button" onClick={() => addItem('attendees', 'attendee')} variant="secondary">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.attendees?.map((attendee, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded text-sm"
                >
                  {attendee}
                  <button
                    type="button"
                    onClick={() => removeItem('attendees', index)}
                    className="text-red-600 hover:text-red-900"
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Additional notes, decisions, or action items"
            />
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Huddle</Button>
          </div>
        </form>
      </Modal>

      {/* Harnish Methodology Note */}
      <div className="mt-6 bg-indigo-50 border border-indigo-200 rounded-lg p-6">
        <h3 className="font-semibold text-indigo-900 mb-2">🎯 Scaling Up - Huddle Rhythm</h3>
        <ul className="list-disc list-inside text-sm text-indigo-800 space-y-1">
          <li>
            <strong>Daily Huddles (5-15 min):</strong> Stand-up, same time/place, share wins/stucks/priorities
          </li>
          <li>
            <strong>Weekly Huddles (60-90 min):</strong> Review Rocks, KPIs, resolve stucks, cascade info
          </li>
          <li>
            <strong>Start with Wins:</strong> Celebrate progress, build momentum
          </li>
          <li>
            <strong>Identify Stucks:</strong> Surface blockers early, get help
          </li>
          <li>
            <strong>Set Priorities:</strong> Everyone knows the top 1-3 things to focus on today/this week
          </li>
        </ul>
      </div>
    </div>
  );
};
