import { useState, useEffect } from 'react';
import type { LeaseRenewal, Tenant, Property, LeaseRenewalStatus } from '../types';
import { sanitizeHtml } from '../services/securityService';

/**
 * LEASE RENEWAL WORKFLOW
 * Based on Griswold's 120-Day Standard
 *
 * Features:
 * - Auto-detection of leases expiring in 120 days
 * - Automated renewal notifications
 * - Rent adjustment calculator
 * - Communication log tracking
 * - Owner approval workflow
 */

export function LeaseRenewalView() {
  const [renewals, setRenewals] = useState<LeaseRenewal[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedRenewal, setSelectedRenewal] = useState<LeaseRenewal | null>(null);
  const [communicationForm, setCommunicationForm] = useState({ type: 'Email', summary: '', contactedBy: '' });

  useEffect(() => {
    loadData();
    detectUpcomingRenewals();
  }, []);

  function loadData() {
    const stored = localStorage.getItem('vgk_data');
    if (stored) {
      const data = JSON.parse(stored);
      setRenewals(data.leaseRenewals || []);
      setTenants(data.tenants || []);
      setProperties(data.properties || []);
    }
  }

  function saveRenewals(rens: LeaseRenewal[]) {
    const stored = localStorage.getItem('vgk_data');
    if (stored) {
      const data = JSON.parse(stored);
      data.leaseRenewals = rens;
      localStorage.setItem('vgk_data', JSON.stringify(data));
      setRenewals(rens);
    }
  }

  function detectUpcomingRenewals() {
    const stored = localStorage.getItem('vgk_data');
    if (!stored) return;

    const data = JSON.parse(stored);
    const existingRenewals = data.leaseRenewals || [];
    const currentTenants = data.tenants || [];

    const today = new Date();
    const in120Days = new Date(today);
    in120Days.setDate(in120Days.getDate() + 120);

    const upcomingLeases = currentTenants.filter((tenant: Tenant) => {
      const leaseEndDate = new Date(tenant.leaseEndDate);
      const alreadyTracked = existingRenewals.some((r: LeaseRenewal) => r.tenantId === tenant.id);
      return leaseEndDate <= in120Days && leaseEndDate >= today && !alreadyTracked;
    });

    if (upcomingLeases.length > 0) {
      const newRenewals = upcomingLeases.map((tenant: Tenant) => ({
        id: `renewal-${Date.now()}-${tenant.id}`,
        tenantId: tenant.id,
        propertyId: tenant.propertyId,
        unitNumber: tenant.unitNumber,
        currentLeaseEndDate: tenant.leaseEndDate,
        currentRentAmount: tenant.rentAmount,
        renewalStatus: 'Upcoming' as LeaseRenewalStatus,
        communicationLog: [],
        notes: '',
      }));

      const updated = [...existingRenewals, ...newRenewals];
      data.leaseRenewals = updated;
      localStorage.setItem('vgk_data', JSON.stringify(data));
      setRenewals(updated);
    }
  }

  function getDaysUntilExpiry(leaseEndDate: string): number {
    const today = new Date();
    const endDate = new Date(leaseEndDate);
    const diffTime = endDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  function getTenantName(tenantId: string): string {
    const tenant = tenants.find(t => t.id === tenantId);
    return tenant ? tenant.name : 'Unknown Tenant';
  }

  function getPropertyName(propertyId: string): string {
    const property = properties.find(p => p.id === propertyId);
    return property ? property.name : 'Unknown Property';
  }

  function handleOpenRenewal(renewal: LeaseRenewal) {
    setSelectedRenewal(renewal);
    setShowModal(true);
  }

  function handleSendNotice(renewalId: string) {
    const updated = renewals.map(r =>
      r.id === renewalId
        ? {
            ...r,
            renewalStatus: 'Notice Sent' as LeaseRenewalStatus,
            notificationDate: new Date().toISOString().split('T')[0],
            communicationLog: [
              ...r.communicationLog,
              {
                date: new Date().toISOString().split('T')[0],
                type: 'Email' as const,
                summary: '120-day renewal notice sent to tenant',
                contactedBy: 'System',
              },
            ],
          }
        : r
    );
    saveRenewals(updated);
  }

  function handleAddCommunication() {
    if (!selectedRenewal || !communicationForm.summary) return;

    const updated = renewals.map(r =>
      r.id === selectedRenewal.id
        ? {
            ...r,
            communicationLog: [
              ...r.communicationLog,
              {
                date: new Date().toISOString().split('T')[0],
                type: communicationForm.type as 'Email' | 'Call' | 'In-Person' | 'SMS',
                summary: sanitizeHtml(communicationForm.summary),
                contactedBy: sanitizeHtml(communicationForm.contactedBy || 'Manager'),
              },
            ],
          }
        : r
    );

    saveRenewals(updated);
    setSelectedRenewal(updated.find(r => r.id === selectedRenewal.id) || null);
    setCommunicationForm({ type: 'Email', summary: '', contactedBy: '' });
  }

  function handleUpdateRenewalDetails(field: string, value: any) {
    if (!selectedRenewal) return;

    const updated = renewals.map(r => (r.id === selectedRenewal.id ? { ...r, [field]: value } : r));

    saveRenewals(updated);
    setSelectedRenewal(updated.find(r => r.id === selectedRenewal.id) || null);
  }

  function calculateRentIncrease(currentRent: number, proposedRent: number): string {
    const increase = proposedRent - currentRent;
    const percentage = (increase / currentRent) * 100;
    return `+${increase.toLocaleString()} UGX (${percentage.toFixed(1)}%)`;
  }

  const statusCounts = {
    upcoming: renewals.filter(r => r.renewalStatus === 'Upcoming').length,
    noticeSent: renewals.filter(r => r.renewalStatus === 'Notice Sent').length,
    negotiating: renewals.filter(r => r.renewalStatus === 'Negotiating').length,
    accepted: renewals.filter(r => r.renewalStatus === 'Accepted').length,
    declined: renewals.filter(r => r.renewalStatus === 'Declined').length,
  };

  const getStatusColor = (status: LeaseRenewalStatus) => {
    switch (status) {
      case 'Accepted':
        return 'bg-green-100 text-green-800';
      case 'Declined':
      case 'Expired':
        return 'bg-red-100 text-red-800';
      case 'Negotiating':
        return 'bg-blue-100 text-blue-800';
      case 'Notice Sent':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getUrgencyColor = (days: number) => {
    if (days < 30) return 'text-red-600 font-bold';
    if (days < 60) return 'text-orange-600 font-semibold';
    if (days < 90) return 'text-yellow-600';
    return 'text-gray-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Lease Renewals</h1>
          <p className="text-gray-600 mt-1">120-Day Renewal Workflow (Griswold Standard)</p>
        </div>
        <button
          onClick={detectUpcomingRenewals}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          🔄 Scan for Upcoming Renewals
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600">Upcoming</div>
          <div className="text-2xl font-bold text-gray-600">{statusCounts.upcoming}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600">Notice Sent</div>
          <div className="text-2xl font-bold text-yellow-600">{statusCounts.noticeSent}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600">Negotiating</div>
          <div className="text-2xl font-bold text-blue-600">{statusCounts.negotiating}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600">Accepted</div>
          <div className="text-2xl font-bold text-green-600">{statusCounts.accepted}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600">Declined</div>
          <div className="text-2xl font-bold text-red-600">{statusCounts.declined}</div>
        </div>
      </div>

      {/* Renewals Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Active Renewal Pipeline</h2>
        </div>

        {renewals.length === 0 ? (
          <div className="px-6 py-12 text-center text-gray-500">
            No upcoming renewals detected. Click "Scan for Upcoming Renewals" to check for leases expiring within 120
            days.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tenant</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Property/Unit</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expiry Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Days Left</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Current Rent</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Proposed Rent</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {renewals
                  .sort((a, b) => new Date(a.currentLeaseEndDate).getTime() - new Date(b.currentLeaseEndDate).getTime())
                  .map(renewal => {
                    const daysLeft = getDaysUntilExpiry(renewal.currentLeaseEndDate);
                    return (
                      <tr key={renewal.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900">{getTenantName(renewal.tenantId)}</div>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <div className="text-gray-900">{getPropertyName(renewal.propertyId)}</div>
                          <div className="text-gray-500">Unit {renewal.unitNumber}</div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">{renewal.currentLeaseEndDate}</td>
                        <td className="px-6 py-4">
                          <span className={`text-sm ${getUrgencyColor(daysLeft)}`}>{daysLeft} days</span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {renewal.currentRentAmount.toLocaleString()} UGX
                        </td>
                        <td className="px-6 py-4 text-sm">
                          {renewal.proposedRentAmount ? (
                            <div>
                              <div className="text-gray-900 font-medium">
                                {renewal.proposedRentAmount.toLocaleString()} UGX
                              </div>
                              <div className="text-green-600 text-xs">
                                {calculateRentIncrease(renewal.currentRentAmount, renewal.proposedRentAmount)}
                              </div>
                            </div>
                          ) : (
                            <span className="text-gray-400">Not set</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                              renewal.renewalStatus
                            )}`}
                          >
                            {renewal.renewalStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleOpenRenewal(renewal)}
                              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                            >
                              Manage
                            </button>
                            {renewal.renewalStatus === 'Upcoming' && (
                              <button
                                onClick={() => handleSendNotice(renewal.id)}
                                className="text-green-600 hover:text-green-800 text-sm font-medium"
                              >
                                Send Notice
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Renewal Management Modal */}
      {showModal && selectedRenewal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Lease Renewal Management</h2>
                <p className="text-sm text-gray-600">{getTenantName(selectedRenewal.tenantId)}</p>
              </div>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
                <span className="text-2xl">×</span>
              </button>
            </div>

            <div className="px-6 py-4 space-y-6">
              {/* Current Lease Info */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Current Lease</h3>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Property:</span>
                    <div className="font-medium">{getPropertyName(selectedRenewal.propertyId)}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Unit:</span>
                    <div className="font-medium">{selectedRenewal.unitNumber}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Expiry Date:</span>
                    <div className="font-medium">{selectedRenewal.currentLeaseEndDate}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Current Rent:</span>
                    <div className="font-medium">{selectedRenewal.currentRentAmount.toLocaleString()} UGX</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Days Until Expiry:</span>
                    <div className={`font-medium ${getUrgencyColor(getDaysUntilExpiry(selectedRenewal.currentLeaseEndDate))}`}>
                      {getDaysUntilExpiry(selectedRenewal.currentLeaseEndDate)} days
                    </div>
                  </div>
                </div>
              </div>

              {/* Renewal Proposal */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Renewal Proposal</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Proposed Rent (UGX)</label>
                    <input
                      type="number"
                      value={selectedRenewal.proposedRentAmount || ''}
                      onChange={e =>
                        handleUpdateRenewalDetails('proposedRentAmount', parseFloat(e.target.value) || 0)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                    {selectedRenewal.proposedRentAmount && (
                      <div className="text-sm text-green-600 mt-1">
                        {calculateRentIncrease(selectedRenewal.currentRentAmount, selectedRenewal.proposedRentAmount)}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Proposed Lease Term (Months)</label>
                    <input
                      type="number"
                      value={selectedRenewal.proposedLeaseTermMonths || ''}
                      onChange={e =>
                        handleUpdateRenewalDetails('proposedLeaseTermMonths', parseInt(e.target.value) || 12)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="12"
                    />
                  </div>
                </div>
              </div>

              {/* Status & Response */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Renewal Status</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      value={selectedRenewal.renewalStatus}
                      onChange={e =>
                        handleUpdateRenewalDetails('renewalStatus', e.target.value as LeaseRenewalStatus)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="Upcoming">Upcoming</option>
                      <option value="Notice Sent">Notice Sent</option>
                      <option value="Negotiating">Negotiating</option>
                      <option value="Accepted">Accepted</option>
                      <option value="Declined">Declined</option>
                      <option value="Expired">Expired</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tenant Response</label>
                    <select
                      value={selectedRenewal.tenantResponse || ''}
                      onChange={e =>
                        handleUpdateRenewalDetails(
                          'tenantResponse',
                          e.target.value as 'Interested' | 'Declined' | 'Negotiating'
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="">Not yet responded</option>
                      <option value="Interested">Interested</option>
                      <option value="Negotiating">Negotiating</option>
                      <option value="Declined">Declined</option>
                    </select>
                  </div>
                  <div>
                    <label className="flex items-center mt-2">
                      <input
                        type="checkbox"
                        checked={selectedRenewal.ownerApproval || false}
                        onChange={e => handleUpdateRenewalDetails('ownerApproval', e.target.checked)}
                        className="mr-2"
                      />
                      <span className="text-sm font-medium text-gray-700">Owner Approval Received</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Communication Log */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Communication Log</h3>
                <div className="space-y-3 mb-4">
                  {selectedRenewal.communicationLog.length === 0 ? (
                    <p className="text-sm text-gray-500">No communications logged yet.</p>
                  ) : (
                    selectedRenewal.communicationLog.map((comm, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-medium text-gray-900">{comm.type}</span>
                          <span className="text-sm text-gray-500">{comm.date}</span>
                        </div>
                        <p className="text-sm text-gray-700">{comm.summary}</p>
                        <p className="text-xs text-gray-500 mt-1">By: {comm.contactedBy}</p>
                      </div>
                    ))
                  )}
                </div>

                {/* Add Communication Form */}
                <div className="border-t border-gray-200 pt-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Add Communication</h4>
                  <div className="grid grid-cols-3 gap-3 mb-2">
                    <select
                      value={communicationForm.type}
                      onChange={e => setCommunicationForm({ ...communicationForm, type: e.target.value })}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    >
                      <option value="Email">Email</option>
                      <option value="Call">Call</option>
                      <option value="In-Person">In-Person</option>
                      <option value="SMS">SMS</option>
                    </select>
                    <input
                      type="text"
                      placeholder="Contacted by"
                      value={communicationForm.contactedBy}
                      onChange={e => setCommunicationForm({ ...communicationForm, contactedBy: e.target.value })}
                      className="col-span-2 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Summary of communication..."
                      value={communicationForm.summary}
                      onChange={e => setCommunicationForm({ ...communicationForm, summary: e.target.value })}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                    <button
                      onClick={handleAddCommunication}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  value={selectedRenewal.notes}
                  onChange={e => handleUpdateRenewalDetails('notes', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Additional renewal notes..."
                ></textarea>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
