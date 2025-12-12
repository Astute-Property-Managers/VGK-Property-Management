import React, { useEffect, useState } from 'react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { getOPSP, saveOPSP } from '../services/dataService';
import type { OnePageStrategicPlan } from '../types';

export const OPSPView: React.FC = () => {
  const [opsp, setOpsp] = useState<OnePageStrategicPlan | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<OnePageStrategicPlan>>({});
  const [tempInput, setTempInput] = useState({
    coreValue: '',
    annualInitiative: '',
    quarterlyObjective: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const data = getOPSP();
    setOpsp(data);
  };

  const startEditing = () => {
    setFormData(opsp || {});
    setTempInput({ coreValue: '', annualInitiative: '', quarterlyObjective: '' });
    setIsEditing(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const updatedOPSP: OnePageStrategicPlan = {
      coreValues: formData.coreValues || [],
      purpose: formData.purpose || '',
      bhag: formData.bhag || '',
      threeYearPicture: formData.threeYearPicture || '',
      annualTheme: formData.annualTheme || '',
      annualInitiatives: formData.annualInitiatives || [],
      quarterlyTheme: formData.quarterlyTheme || '',
      quarterlyObjectives: formData.quarterlyObjectives || [],
      lastUpdated: new Date().toISOString().split('T')[0],
    };

    saveOPSP(updatedOPSP);
    loadData();
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addItem = (listName: 'coreValues' | 'annualInitiatives' | 'quarterlyObjectives', inputKey: 'coreValue' | 'annualInitiative' | 'quarterlyObjective') => {
    const value = tempInput[inputKey].trim();
    if (value) {
      setFormData(prev => ({
        ...prev,
        [listName]: [...(prev[listName] || []), value],
      }));
      setTempInput(prev => ({ ...prev, [inputKey]: '' }));
    }
  };

  const removeItem = (listName: 'coreValues' | 'annualInitiatives' | 'quarterlyObjectives', index: number) => {
    setFormData(prev => ({
      ...prev,
      [listName]: (prev[listName] || []).filter((_item, i) => i !== index),
    }));
  };

  if (!opsp) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8">
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">One Page Strategic Plan</h1>
            <p className="text-gray-600 mt-2">
              <strong>Verne Harnish - Scaling Up:</strong> Your entire strategy on one page.
              From purpose to quarterly objectives - clarity drives execution.
            </p>
          </div>
          {!isEditing && (
            <Button onClick={startEditing}>Edit Plan</Button>
          )}
        </div>
        {opsp.lastUpdated && (
          <p className="text-sm text-gray-500 mt-2">
            Last updated: {new Date(opsp.lastUpdated).toLocaleDateString('en-UG')}
          </p>
        )}
      </div>

      {isEditing ? (
        /* Edit Mode */
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
          {/* Core Values & Purpose */}
          <div className="mb-6 pb-6 border-b">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Core Values & Purpose</h2>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Core Values</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={tempInput.coreValue}
                  onChange={(e) => setTempInput(prev => ({ ...prev, coreValue: e.target.value }))}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addItem('coreValues', 'coreValue'))}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Add a core value"
                />
                <Button type="button" onClick={() => addItem('coreValues', 'coreValue')} variant="secondary">
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.coreValues?.map((value, index) => (
                  <span key={index} className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-100 text-indigo-800 rounded">
                    {value}
                    <button type="button" onClick={() => removeItem('coreValues', index)} className="text-red-600">✕</button>
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Purpose (Why We Exist)</label>
              <textarea
                name="purpose"
                value={formData.purpose}
                onChange={handleChange}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Our purpose..."
              />
            </div>
          </div>

          {/* Strategic Vision */}
          <div className="mb-6 pb-6 border-b">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Strategic Vision</h2>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                BHAG (Big Hairy Audacious Goal) - 10-25 Years
              </label>
              <textarea
                name="bhag"
                value={formData.bhag}
                onChange={handleChange}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Our BHAG..."
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                3-Year Picture (What success looks like)
              </label>
              <textarea
                name="threeYearPicture"
                value={formData.threeYearPicture}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="In 3 years..."
              />
            </div>
          </div>

          {/* Annual Priorities */}
          <div className="mb-6 pb-6 border-b">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Annual Priorities</h2>

            <Input
              label="Annual Theme"
              name="annualTheme"
              value={formData.annualTheme}
              onChange={handleChange}
              placeholder="Year of..."
            />

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Annual Initiatives</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={tempInput.annualInitiative}
                  onChange={(e) => setTempInput(prev => ({ ...prev, annualInitiative: e.target.value }))}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addItem('annualInitiatives', 'annualInitiative'))}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Add an annual initiative"
                />
                <Button type="button" onClick={() => addItem('annualInitiatives', 'annualInitiative')} variant="secondary">
                  Add
                </Button>
              </div>
              <div className="space-y-1">
                {formData.annualInitiatives?.map((initiative, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="flex-1 px-2 py-1 bg-blue-50 rounded text-sm">{initiative}</span>
                    <button type="button" onClick={() => removeItem('annualInitiatives', index)} className="text-red-600">✕</button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quarterly Targets */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quarterly Targets</h2>

            <Input
              label="Quarterly Theme"
              name="quarterlyTheme"
              value={formData.quarterlyTheme}
              onChange={handleChange}
              placeholder="Q1 Focus..."
            />

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Quarterly Objectives</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={tempInput.quarterlyObjective}
                  onChange={(e) => setTempInput(prev => ({ ...prev, quarterlyObjective: e.target.value }))}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addItem('quarterlyObjectives', 'quarterlyObjective'))}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Add a quarterly objective"
                />
                <Button type="button" onClick={() => addItem('quarterlyObjectives', 'quarterlyObjective')} variant="secondary">
                  Add
                </Button>
              </div>
              <div className="space-y-1">
                {formData.quarterlyObjectives?.map((objective, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="flex-1 px-2 py-1 bg-green-50 rounded text-sm">{objective}</span>
                    <button type="button" onClick={() => removeItem('quarterlyObjectives', index)} className="text-red-600">✕</button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Plan</Button>
          </div>
        </form>
      ) : (
        /* View Mode */
        <div className="space-y-6">
          {/* Core Values & Purpose */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-indigo-900 mb-4">Core Values & Purpose</h2>
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-600 uppercase mb-2">Core Values</h3>
              <div className="flex flex-wrap gap-2">
                {opsp.coreValues.map((value, index) => (
                  <span key={index} className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded font-medium">
                    {value}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-600 uppercase mb-2">Purpose</h3>
              <p className="text-gray-800">{opsp.purpose}</p>
            </div>
          </div>

          {/* Strategic Vision */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-purple-900 mb-4">Strategic Vision</h2>
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-600 uppercase mb-2">BHAG (10-25 Years)</h3>
              <p className="text-gray-800 text-lg font-medium">{opsp.bhag}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-600 uppercase mb-2">3-Year Picture</h3>
              <p className="text-gray-800">{opsp.threeYearPicture}</p>
            </div>
          </div>

          {/* Annual Priorities */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-blue-900 mb-4">Annual Priorities</h2>
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-600 uppercase mb-2">Annual Theme</h3>
              <p className="text-gray-800 text-lg font-medium">{opsp.annualTheme}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-600 uppercase mb-2">Annual Initiatives</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-800">
                {opsp.annualInitiatives.map((initiative, index) => (
                  <li key={index}>{initiative}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Quarterly Targets */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-green-900 mb-4">Quarterly Targets</h2>
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-600 uppercase mb-2">Quarterly Theme</h3>
              <p className="text-gray-800 text-lg font-medium">{opsp.quarterlyTheme}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-600 uppercase mb-2">Quarterly Objectives</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-800">
                {opsp.quarterlyObjectives.map((objective, index) => (
                  <li key={index}>{objective}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Methodology Note */}
      <div className="mt-6 bg-indigo-50 border border-indigo-200 rounded-lg p-6">
        <h3 className="font-semibold text-indigo-900 mb-2">🎯 Scaling Up - One Page Strategic Plan</h3>
        <ul className="list-disc list-inside text-sm text-indigo-800 space-y-1">
          <li>
            <strong>Clarity Drives Execution:</strong> Everyone on the same page, aligned to the same goals
          </li>
          <li>
            <strong>Top-Down Cascade:</strong> From BHAG → 3-Year → Annual → Quarterly → Rocks
          </li>
          <li>
            <strong>Living Document:</strong> Review quarterly, update as you learn
          </li>
          <li>
            <strong>Share Widely:</strong> Post visibly, discuss in huddles, use for decision-making
          </li>
          <li>
            <strong>Quarterly Objectives:</strong> These become your Rocks (tracked separately)
          </li>
        </ul>
      </div>
    </div>
  );
};
