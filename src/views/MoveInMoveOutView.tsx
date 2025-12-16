import { useState, useEffect } from 'react';
import type { MoveInInspection, MoveOutInspection, Tenant, Property } from '../types';
import { sanitizeHtml } from '../services/securityService';

/**
 * MOVE-IN / MOVE-OUT MANAGEMENT
 * Based on Griswold Property Management Standards
 *
 * Features:
 * - Move-in inspection checklist
 * - Move-out inspection checklist
 * - Photo documentation
 * - Deposit calculation
 * - Damage assessment
 */

export function MoveInMoveOutView() {
  const [moveInInspections, setMoveInInspections] = useState<MoveInInspection[]>([]);
  const [moveOutInspections, setMoveOutInspections] = useState<MoveOutInspection[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [activeTab, setActiveTab] = useState<'move-in' | 'move-out'>('move-in');
  const [showModal, setShowModal] = useState(false);
  const [inspectionType, setInspectionType] = useState<'move-in' | 'move-out'>('move-in');
  const [selectedInspection, setSelectedInspection] = useState<MoveInInspection | MoveOutInspection | null>(null);

  // Form data for new inspections
  const [formData, setFormData] = useState<any>({
    tenantId: '',
    propertyId: '',
    unitNumber: '',
    inspectedBy: '',
    checklist: [],
    photos: [],
    inventory: [],
    notes: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  function loadData() {
    const stored = localStorage.getItem('vgk_data');
    if (stored) {
      const data = JSON.parse(stored);
      setMoveInInspections(data.moveInInspections || []);
      setMoveOutInspections(data.moveOutInspections || []);
      setTenants(data.tenants || []);
      setProperties(data.properties || []);
    }
  }

  function saveData(moveIns: MoveInInspection[], moveOuts: MoveOutInspection[]) {
    const stored = localStorage.getItem('vgk_data');
    if (stored) {
      const data = JSON.parse(stored);
      data.moveInInspections = moveIns;
      data.moveOutInspections = moveOuts;
      localStorage.setItem('vgk_data', JSON.stringify(data));
      setMoveInInspections(moveIns);
      setMoveOutInspections(moveOuts);
    }
  }

  function getTenantName(tenantId: string): string {
    const tenant = tenants.find(t => t.id === tenantId);
    return tenant ? tenant.name : 'Unknown';
  }

  function getPropertyName(propertyId: string): string {
    const property = properties.find(p => p.id === propertyId);
    return property ? property.name : 'Unknown';
  }

  function handleOpenCreate(type: 'move-in' | 'move-out') {
    setInspectionType(type);
    setSelectedInspection(null);

    // Initialize with default checklist
    const defaultChecklist = [
      { area: 'Living Room', item: 'Walls', condition: 'Good' as const, notes: '' },
      { area: 'Living Room', item: 'Floor', condition: 'Good' as const, notes: '' },
      { area: 'Living Room', item: 'Windows', condition: 'Good' as const, notes: '' },
      { area: 'Kitchen', item: 'Cabinets', condition: 'Good' as const, notes: '' },
      { area: 'Kitchen', item: 'Appliances', condition: 'Good' as const, notes: '' },
      { area: 'Kitchen', item: 'Plumbing', condition: 'Good' as const, notes: '' },
      { area: 'Bathroom', item: 'Toilet', condition: 'Good' as const, notes: '' },
      { area: 'Bathroom', item: 'Shower/Tub', condition: 'Good' as const, notes: '' },
      { area: 'Bathroom', item: 'Sink', condition: 'Good' as const, notes: '' },
      { area: 'Bedroom', item: 'Walls', condition: 'Good' as const, notes: '' },
      { area: 'Bedroom', item: 'Floor', condition: 'Good' as const, notes: '' },
      { area: 'Bedroom', item: 'Closet', condition: 'Good' as const, notes: '' },
    ];

    setFormData({
      tenantId: '',
      propertyId: '',
      unitNumber: '',
      inspectedBy: '',
      checklist: type === 'move-out' ? defaultChecklist.map(item => ({ ...item, repairRequired: false, estimatedRepairCost: 0 })) : defaultChecklist,
      photos: [],
      inventory: [],
      notes: '',
      securityDepositAmount: 0,
      securityDepositReceived: false,
      deductions: [],
      unpaidRent: 0,
      unpaidUtilities: 0,
      otherCharges: 0,
    });

    setShowModal(true);
  }

  function handleOpenView(inspection: MoveInInspection | MoveOutInspection, type: 'move-in' | 'move-out') {
    setInspectionType(type);
    setSelectedInspection(inspection);
    setFormData(inspection);
    setShowModal(true);
  }

  function handleSubmit() {
    if (!formData.tenantId || !formData.propertyId || !formData.inspectedBy) {
      alert('Please fill in required fields');
      return;
    }

    if (inspectionType === 'move-in') {
      const newInspection: MoveInInspection = {
        id: `movein-${Date.now()}`,
        tenantId: formData.tenantId,
        propertyId: formData.propertyId,
        unitNumber: formData.unitNumber || '',
        inspectionDate: new Date().toISOString().split('T')[0],
        inspectedBy: sanitizeHtml(formData.inspectedBy),
        checklist: formData.checklist,
        photos: formData.photos,
        inventory: formData.inventory,
        securityDepositAmount: formData.securityDepositAmount || 0,
        securityDepositReceived: formData.securityDepositReceived || false,
      };

      saveData([...moveInInspections, newInspection], moveOutInspections);
    } else {
      const totalDeductions = (formData.deductions || []).reduce((sum: number, d: any) => sum + d.amount, 0);
      const depositRefund = (formData.securityDepositAmount || 0) - totalDeductions;

      const newInspection: MoveOutInspection = {
        id: `moveout-${Date.now()}`,
        tenantId: formData.tenantId,
        propertyId: formData.propertyId,
        unitNumber: formData.unitNumber || '',
        moveOutDate: formData.moveOutDate || new Date().toISOString().split('T')[0],
        inspectionDate: new Date().toISOString().split('T')[0],
        inspectedBy: sanitizeHtml(formData.inspectedBy),
        checklist: formData.checklist,
        photos: formData.photos,
        securityDepositHeld: formData.securityDepositAmount || 0,
        deductions: formData.deductions || [],
        totalDeductions: totalDeductions,
        depositRefundAmount: depositRefund,
        unpaidRent: formData.unpaidRent || 0,
        unpaidUtilities: formData.unpaidUtilities || 0,
        otherCharges: formData.otherCharges || 0,
        notes: sanitizeHtml(formData.notes || ''),
      };

      saveData(moveInInspections, [...moveOutInspections, newInspection]);
    }

    setShowModal(false);
  }

  function addChecklistItem() {
    const newItem = inspectionType === 'move-in'
      ? { area: '', item: '', condition: 'Good' as const, notes: '' }
      : { area: '', item: '', condition: 'Good' as const, notes: '', repairRequired: false, estimatedRepairCost: 0 };

    setFormData({ ...formData, checklist: [...formData.checklist, newItem] });
  }

  function updateChecklistItem(index: number, field: string, value: any) {
    const checklist = [...formData.checklist];
    checklist[index] = { ...checklist[index], [field]: value };
    setFormData({ ...formData, checklist });
  }

  function removeChecklistItem(index: number) {
    const checklist = [...formData.checklist];
    checklist.splice(index, 1);
    setFormData({ ...formData, checklist });
  }

  function addDeduction() {
    const deductions = [...(formData.deductions || [])];
    deductions.push({ description: '', amount: 0, category: 'Repairs' as const });
    setFormData({ ...formData, deductions });
  }

  function updateDeduction(index: number, field: string, value: any) {
    const deductions = [...formData.deductions];
    deductions[index] = { ...deductions[index], [field]: value };
    setFormData({ ...formData, deductions });
  }

  function removeDeduction(index: number) {
    const deductions = [...formData.deductions];
    deductions.splice(index, 1);
    setFormData({ ...formData, deductions });
  }

  function formatUGX(amount: number): string {
    return `${amount.toLocaleString()} UGX`;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Move-In / Move-Out Management</h1>
          <p className="text-gray-600 mt-1">Griswold Standard Inspection Process</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => handleOpenCreate('move-in')}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            + New Move-In
          </button>
          <button
            onClick={() => handleOpenCreate('move-out')}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            + New Move-Out
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600">Total Move-Ins</div>
          <div className="text-2xl font-bold text-green-600">{moveInInspections.length}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600">Total Move-Outs</div>
          <div className="text-2xl font-bold text-red-600">{moveOutInspections.length}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600">Deposits Held</div>
          <div className="text-2xl font-bold text-blue-600">
            {formatUGX(moveInInspections.reduce((sum, i) => sum + i.securityDepositAmount, 0))}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600">Deposits Returned</div>
          <div className="text-2xl font-bold text-purple-600">
            {formatUGX(moveOutInspections.reduce((sum, i) => sum + i.depositRefundAmount, 0))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <div className="flex">
            <button
              onClick={() => setActiveTab('move-in')}
              className={`px-6 py-3 font-medium ${
                activeTab === 'move-in'
                  ? 'text-green-600 border-b-2 border-green-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Move-In Inspections ({moveInInspections.length})
            </button>
            <button
              onClick={() => setActiveTab('move-out')}
              className={`px-6 py-3 font-medium ${
                activeTab === 'move-out'
                  ? 'text-red-600 border-b-2 border-red-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Move-Out Inspections ({moveOutInspections.length})
            </button>
          </div>
        </div>

        {/* Move-In Table */}
        {activeTab === 'move-in' && (
          <div className="overflow-x-auto">
            {moveInInspections.length === 0 ? (
              <div className="px-6 py-12 text-center text-gray-500">
                No move-in inspections yet. Click "New Move-In" to create one.
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tenant</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Property/Unit</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Inspection Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Inspected By</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Deposit</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {moveInInspections.map(inspection => (
                    <tr key={inspection.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">{getTenantName(inspection.tenantId)}</td>
                      <td className="px-6 py-4 text-sm">
                        <div className="text-gray-900">{getPropertyName(inspection.propertyId)}</div>
                        <div className="text-gray-500">Unit {inspection.unitNumber}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{inspection.inspectionDate}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{inspection.inspectedBy}</td>
                      <td className="px-6 py-4 text-sm">
                        <div className="text-gray-900">{formatUGX(inspection.securityDepositAmount)}</div>
                        <div className={`text-xs ${inspection.securityDepositReceived ? 'text-green-600' : 'text-red-600'}`}>
                          {inspection.securityDepositReceived ? '✓ Received' : '✗ Not Received'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleOpenView(inspection, 'move-in')}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Move-Out Table */}
        {activeTab === 'move-out' && (
          <div className="overflow-x-auto">
            {moveOutInspections.length === 0 ? (
              <div className="px-6 py-12 text-center text-gray-500">
                No move-out inspections yet. Click "New Move-Out" to create one.
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tenant</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Property/Unit</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Move-Out Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Deposit Held</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Deductions</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Refund</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {moveOutInspections.map(inspection => (
                    <tr key={inspection.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">{getTenantName(inspection.tenantId)}</td>
                      <td className="px-6 py-4 text-sm">
                        <div className="text-gray-900">{getPropertyName(inspection.propertyId)}</div>
                        <div className="text-gray-500">Unit {inspection.unitNumber}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{inspection.moveOutDate}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{formatUGX(inspection.securityDepositHeld)}</td>
                      <td className="px-6 py-4 text-sm text-red-600">-{formatUGX(inspection.totalDeductions)}</td>
                      <td className="px-6 py-4 text-sm text-green-600 font-medium">
                        {formatUGX(inspection.depositRefundAmount)}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleOpenView(inspection, 'move-out')}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>

      {/* Inspection Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">
                {inspectionType === 'move-in' ? 'Move-In Inspection' : 'Move-Out Inspection'}
                {selectedInspection && ' (View Only)'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
                <span className="text-2xl">×</span>
              </button>
            </div>

            <div className="px-6 py-4 space-y-6">
              {/* Basic Info */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Basic Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tenant *</label>
                    <select
                      value={formData.tenantId}
                      onChange={e => setFormData({ ...formData, tenantId: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      disabled={!!selectedInspection}
                    >
                      <option value="">Select Tenant</option>
                      {tenants.map(t => (
                        <option key={t.id} value={t.id}>
                          {t.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Property *</label>
                    <select
                      value={formData.propertyId}
                      onChange={e => setFormData({ ...formData, propertyId: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      disabled={!!selectedInspection}
                    >
                      <option value="">Select Property</option>
                      {properties.map(p => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Unit Number</label>
                    <input
                      type="text"
                      value={formData.unitNumber}
                      onChange={e => setFormData({ ...formData, unitNumber: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      disabled={!!selectedInspection}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Inspected By *</label>
                    <input
                      type="text"
                      value={formData.inspectedBy}
                      onChange={e => setFormData({ ...formData, inspectedBy: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      disabled={!!selectedInspection}
                    />
                  </div>
                </div>
              </div>

              {/* Checklist */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">Inspection Checklist</h3>
                  {!selectedInspection && (
                    <button
                      onClick={addChecklistItem}
                      className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                    >
                      + Add Item
                    </button>
                  )}
                </div>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {formData.checklist.map((item: any, index: number) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                      <div className="grid grid-cols-5 gap-2 mb-2">
                        <input
                          type="text"
                          value={item.area}
                          onChange={e => updateChecklistItem(index, 'area', e.target.value)}
                          placeholder="Area"
                          className="px-2 py-1 text-sm border border-gray-300 rounded"
                          disabled={!!selectedInspection}
                        />
                        <input
                          type="text"
                          value={item.item}
                          onChange={e => updateChecklistItem(index, 'item', e.target.value)}
                          placeholder="Item"
                          className="px-2 py-1 text-sm border border-gray-300 rounded"
                          disabled={!!selectedInspection}
                        />
                        <select
                          value={item.condition}
                          onChange={e => updateChecklistItem(index, 'condition', e.target.value)}
                          className="px-2 py-1 text-sm border border-gray-300 rounded"
                          disabled={!!selectedInspection}
                        >
                          <option value="Excellent">Excellent</option>
                          <option value="Good">Good</option>
                          <option value="Fair">Fair</option>
                          <option value="Poor">Poor</option>
                          <option value="Damaged">Damaged</option>
                        </select>
                        <input
                          type="text"
                          value={item.notes}
                          onChange={e => updateChecklistItem(index, 'notes', e.target.value)}
                          placeholder="Notes"
                          className="px-2 py-1 text-sm border border-gray-300 rounded"
                          disabled={!!selectedInspection}
                        />
                        {!selectedInspection && (
                          <button
                            onClick={() => removeChecklistItem(index)}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      {inspectionType === 'move-out' && (
                        <div className="grid grid-cols-3 gap-2 mt-2">
                          <label className="flex items-center text-sm">
                            <input
                              type="checkbox"
                              checked={item.repairRequired || false}
                              onChange={e => updateChecklistItem(index, 'repairRequired', e.target.checked)}
                              className="mr-2"
                              disabled={!!selectedInspection}
                            />
                            Repair Required
                          </label>
                          <input
                            type="number"
                            value={item.estimatedRepairCost || 0}
                            onChange={e => updateChecklistItem(index, 'estimatedRepairCost', parseFloat(e.target.value) || 0)}
                            placeholder="Repair Cost (UGX)"
                            className="px-2 py-1 text-sm border border-gray-300 rounded"
                            disabled={!!selectedInspection}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Deposit Information */}
              {inspectionType === 'move-in' && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Security Deposit</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Deposit Amount (UGX)</label>
                      <input
                        type="number"
                        value={formData.securityDepositAmount}
                        onChange={e => setFormData({ ...formData, securityDepositAmount: parseFloat(e.target.value) || 0 })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        disabled={!!selectedInspection}
                      />
                    </div>
                    <div>
                      <label className="flex items-center mt-8">
                        <input
                          type="checkbox"
                          checked={formData.securityDepositReceived}
                          onChange={e => setFormData({ ...formData, securityDepositReceived: e.target.checked })}
                          className="mr-2"
                          disabled={!!selectedInspection}
                        />
                        <span className="text-sm font-medium text-gray-700">Deposit Received</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Move-Out Specific: Deductions */}
              {inspectionType === 'move-out' && (
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">Deposit Deductions</h3>
                    {!selectedInspection && (
                      <button
                        onClick={addDeduction}
                        className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                      >
                        + Add Deduction
                      </button>
                    )}
                  </div>
                  <div className="space-y-2 mb-4">
                    {(formData.deductions || []).map((ded: any, index: number) => (
                      <div key={index} className="grid grid-cols-4 gap-2 border border-gray-200 rounded-lg p-3">
                        <input
                          type="text"
                          value={ded.description}
                          onChange={e => updateDeduction(index, 'description', e.target.value)}
                          placeholder="Description"
                          className="col-span-2 px-2 py-1 text-sm border border-gray-300 rounded"
                          disabled={!!selectedInspection}
                        />
                        <select
                          value={ded.category}
                          onChange={e => updateDeduction(index, 'category', e.target.value)}
                          className="px-2 py-1 text-sm border border-gray-300 rounded"
                          disabled={!!selectedInspection}
                        >
                          <option value="Cleaning">Cleaning</option>
                          <option value="Repairs">Repairs</option>
                          <option value="Unpaid Rent">Unpaid Rent</option>
                          <option value="Other">Other</option>
                        </select>
                        <input
                          type="number"
                          value={ded.amount}
                          onChange={e => updateDeduction(index, 'amount', parseFloat(e.target.value) || 0)}
                          placeholder="Amount"
                          className="px-2 py-1 text-sm border border-gray-300 rounded"
                          disabled={!!selectedInspection}
                        />
                        {!selectedInspection && (
                          <button
                            onClick={() => removeDeduction(index)}
                            className="col-span-4 text-red-600 hover:text-red-800 text-sm text-left"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Deposit Calculation Summary */}
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Deposit Calculation</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Security Deposit Held:</span>
                        <span className="font-medium">{formatUGX(formData.securityDepositAmount || 0)}</span>
                      </div>
                      <div className="flex justify-between text-red-600">
                        <span>Total Deductions:</span>
                        <span className="font-medium">
                          -{formatUGX((formData.deductions || []).reduce((sum: number, d: any) => sum + d.amount, 0))}
                        </span>
                      </div>
                      <div className="flex justify-between text-lg font-bold text-green-600 pt-2 border-t border-blue-200">
                        <span>Refund to Tenant:</span>
                        <span>
                          {formatUGX(
                            (formData.securityDepositAmount || 0) -
                              (formData.deductions || []).reduce((sum: number, d: any) => sum + d.amount, 0)
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={e => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Additional notes..."
                  disabled={!!selectedInspection}
                ></textarea>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                {selectedInspection ? 'Close' : 'Cancel'}
              </button>
              {!selectedInspection && (
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Save Inspection
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
