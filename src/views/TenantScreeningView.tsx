import { useState, useEffect } from 'react';
import type { TenantScreeningApplication, Property, ScreeningStatus } from '../types';
import { securityService } from '../services/securityService';

/**
 * TENANT SCREENING MODULE
 * Based on Griswold's Property Management Standards
 *
 * Features:
 * - Complete application workflow
 * - Employment verification
 * - Credit & background checks
 * - Rental history verification
 * - Reference checks
 * - Approval/rejection workflow
 */

export function TenantScreeningView() {
  const [applications, setApplications] = useState<TenantScreeningApplication[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [viewMode, setViewMode] = useState<'create' | 'review'>('create');
  const [selectedApplication, setSelectedApplication] = useState<TenantScreeningApplication | null>(null);
  const [formData, setFormData] = useState<Partial<TenantScreeningApplication>>({
    applicantName: '',
    email: '',
    phone: '',
    propertyId: '',
    unitNumber: '',
    status: 'In Progress',
    employmentVerified: false,
    rentalHistoryVerified: false,
    evictionHistory: false,
    references: [],
    reviewNotes: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  function loadData() {
    const stored = localStorage.getItem('vgk_data');
    if (stored) {
      const data = JSON.parse(stored);
      setApplications(data.tenantScreeningApplications || []);
      setProperties(data.properties || []);
    }
  }

  function saveApplications(apps: TenantScreeningApplication[]) {
    const stored = localStorage.getItem('vgk_data');
    if (stored) {
      const data = JSON.parse(stored);
      data.tenantScreeningApplications = apps;
      localStorage.setItem('vgk_data', JSON.stringify(data));
      setApplications(apps);
    }
  }

  function handleOpenCreate() {
    setViewMode('create');
    setFormData({
      applicantName: '',
      email: '',
      phone: '',
      propertyId: '',
      unitNumber: '',
      status: 'In Progress',
      employmentVerified: false,
      rentalHistoryVerified: false,
      evictionHistory: false,
      references: [],
      reviewNotes: '',
    });
    setSelectedApplication(null);
    setShowModal(true);
  }

  function handleOpenReview(app: TenantScreeningApplication) {
    setViewMode('review');
    setSelectedApplication(app);
    setFormData(app);
    setShowModal(true);
  }

  function handleSubmitApplication() {
    if (!formData.applicantName || !formData.propertyId) {
      alert('Please fill in required fields (Applicant Name, Property)');
      return;
    }

    const sanitized = securityService.sanitizeInput(formData.applicantName);

    const newApp: TenantScreeningApplication = {
      id: `screen-${Date.now()}`,
      applicantName: sanitized,
      email: securityService.sanitizeInput(formData.email || ''),
      phone: securityService.sanitizeInput(formData.phone || ''),
      propertyId: formData.propertyId || '',
      unitNumber: formData.unitNumber || '',
      applicationDate: new Date().toISOString().split('T')[0],
      status: 'In Progress',
      employmentVerified: formData.employmentVerified || false,
      rentalHistoryVerified: formData.rentalHistoryVerified || false,
      evictionHistory: formData.evictionHistory || false,
      references: formData.references || [],
      reviewNotes: securityService.sanitizeInput(formData.reviewNotes || ''),
      currentEmployer: securityService.sanitizeInput(formData.currentEmployer || ''),
      jobTitle: securityService.sanitizeInput(formData.jobTitle || ''),
      monthlyIncome: formData.monthlyIncome || 0,
      creditScore: formData.creditScore || 0,
      previousLandlord: securityService.sanitizeInput(formData.previousLandlord || ''),
      previousLandlordContact: securityService.sanitizeInput(formData.previousLandlordContact || ''),
    };

    saveApplications([...applications, newApp]);
    setShowModal(false);
  }

  function handleUpdateReview() {
    if (!selectedApplication) return;

    const updated = applications.map(app =>
      app.id === selectedApplication.id
        ? {
            ...app,
            ...formData,
            reviewDate: new Date().toISOString().split('T')[0],
            reviewNotes: securityService.sanitizeInput(formData.reviewNotes || ''),
          }
        : app
    );

    saveApplications(updated);
    setShowModal(false);
  }

  function handleStatusChange(appId: string, newStatus: ScreeningStatus) {
    const updated = applications.map(app =>
      app.id === appId ? { ...app, status: newStatus, reviewDate: new Date().toISOString().split('T')[0] } : app
    );
    saveApplications(updated);
  }

  function addReference() {
    const refs = formData.references || [];
    refs.push({ name: '', relationship: '', contact: '', verified: false });
    setFormData({ ...formData, references: refs });
  }

  function updateReference(index: number, field: string, value: string | boolean) {
    const refs = [...(formData.references || [])];
    refs[index] = { ...refs[index], [field]: value };
    setFormData({ ...formData, references: refs });
  }

  function removeReference(index: number) {
    const refs = [...(formData.references || [])];
    refs.splice(index, 1);
    setFormData({ ...formData, references: refs });
  }

  const statusCounts = {
    inProgress: applications.filter(a => a.status === 'In Progress').length,
    pendingReview: applications.filter(a => a.status === 'Pending Review').length,
    approved: applications.filter(a => a.status === 'Approved').length,
    rejected: applications.filter(a => a.status === 'Rejected').length,
  };

  const getStatusColor = (status: ScreeningStatus) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      case 'Pending Review':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPropertyName = (propertyId: string) => {
    const property = properties.find(p => p.id === propertyId);
    return property ? property.name : 'Unknown Property';
  };

  const calculateCompletionScore = (app: TenantScreeningApplication): number => {
    let score = 0;
    if (app.employmentVerified) score += 25;
    if (app.rentalHistoryVerified) score += 25;
    if (app.creditScore && app.creditScore > 0) score += 25;
    if (app.references && app.references.filter(r => r.verified).length >= 2) score += 25;
    return score;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tenant Screening</h1>
          <p className="text-gray-600 mt-1">Griswold Standard Application Workflow</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          + New Application
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600">In Progress</div>
          <div className="text-2xl font-bold text-blue-600">{statusCounts.inProgress}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600">Pending Review</div>
          <div className="text-2xl font-bold text-yellow-600">{statusCounts.pendingReview}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600">Approved</div>
          <div className="text-2xl font-bold text-green-600">{statusCounts.approved}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600">Rejected</div>
          <div className="text-2xl font-bold text-red-600">{statusCounts.rejected}</div>
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Applications</h2>
        </div>

        {applications.length === 0 ? (
          <div className="px-6 py-12 text-center text-gray-500">
            No applications yet. Click "New Application" to start screening tenants.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Applicant</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Property</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Unit</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Completion</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {applications.map(app => {
                  const completionScore = calculateCompletionScore(app);
                  return (
                    <tr key={app.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{app.applicantName}</div>
                        <div className="text-sm text-gray-500">{app.email}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{getPropertyName(app.propertyId)}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{app.unitNumber || 'N/A'}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{app.applicationDate}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                            <div
                              className={`h-2 rounded-full ${
                                completionScore === 100
                                  ? 'bg-green-600'
                                  : completionScore >= 50
                                  ? 'bg-yellow-600'
                                  : 'bg-red-600'
                              }`}
                              style={{ width: `${completionScore}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600">{completionScore}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(app.status)}`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleOpenReview(app)}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            Review
                          </button>
                          {app.status === 'Pending Review' && (
                            <>
                              <button
                                onClick={() => handleStatusChange(app.id, 'Approved')}
                                className="text-green-600 hover:text-green-800 text-sm font-medium"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleStatusChange(app.id, 'Rejected')}
                                className="text-red-600 hover:text-red-800 text-sm font-medium"
                              >
                                Reject
                              </button>
                            </>
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">
                {viewMode === 'create' ? 'New Screening Application' : 'Review Application'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
                <span className="text-2xl">×</span>
              </button>
            </div>

            <div className="px-6 py-4 space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Basic Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Applicant Name *</label>
                    <input
                      type="text"
                      value={formData.applicantName || ''}
                      onChange={e => setFormData({ ...formData, applicantName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      disabled={viewMode === 'review'}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={formData.email || ''}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      disabled={viewMode === 'review'}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="text"
                      value={formData.phone || ''}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      disabled={viewMode === 'review'}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Property *</label>
                    <select
                      value={formData.propertyId || ''}
                      onChange={e => setFormData({ ...formData, propertyId: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      disabled={viewMode === 'review'}
                    >
                      <option value="">Select Property</option>
                      {properties.map(prop => (
                        <option key={prop.id} value={prop.id}>
                          {prop.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Unit Number</label>
                    <input
                      type="text"
                      value={formData.unitNumber || ''}
                      onChange={e => setFormData({ ...formData, unitNumber: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      disabled={viewMode === 'review'}
                    />
                  </div>
                </div>
              </div>

              {/* Employment Verification */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Employment Verification</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Employer</label>
                    <input
                      type="text"
                      value={formData.currentEmployer || ''}
                      onChange={e => setFormData({ ...formData, currentEmployer: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                    <input
                      type="text"
                      value={formData.jobTitle || ''}
                      onChange={e => setFormData({ ...formData, jobTitle: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Income (UGX)</label>
                    <input
                      type="number"
                      value={formData.monthlyIncome || ''}
                      onChange={e => setFormData({ ...formData, monthlyIncome: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="flex items-center mt-8">
                      <input
                        type="checkbox"
                        checked={formData.employmentVerified || false}
                        onChange={e => setFormData({ ...formData, employmentVerified: e.target.checked })}
                        className="mr-2"
                      />
                      <span className="text-sm font-medium text-gray-700">Employment Verified</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Credit & Background */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Credit & Background</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Credit Score</label>
                    <input
                      type="number"
                      value={formData.creditScore || ''}
                      onChange={e => setFormData({ ...formData, creditScore: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Background Check Status</label>
                    <select
                      value={formData.backgroundCheckStatus || 'Pending'}
                      onChange={e =>
                        setFormData({
                          ...formData,
                          backgroundCheckStatus: e.target.value as 'Pending' | 'Clear' | 'Issues Found',
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Clear">Clear</option>
                      <option value="Issues Found">Issues Found</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Rental History */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Rental History</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Previous Landlord</label>
                    <input
                      type="text"
                      value={formData.previousLandlord || ''}
                      onChange={e => setFormData({ ...formData, previousLandlord: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Landlord Contact</label>
                    <input
                      type="text"
                      value={formData.previousLandlordContact || ''}
                      onChange={e => setFormData({ ...formData, previousLandlordContact: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.rentalHistoryVerified || false}
                        onChange={e => setFormData({ ...formData, rentalHistoryVerified: e.target.checked })}
                        className="mr-2"
                      />
                      <span className="text-sm font-medium text-gray-700">Rental History Verified</span>
                    </label>
                  </div>
                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.evictionHistory || false}
                        onChange={e => setFormData({ ...formData, evictionHistory: e.target.checked })}
                        className="mr-2"
                      />
                      <span className="text-sm font-medium text-gray-700">Eviction History</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* References */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">References</h3>
                  <button
                    onClick={addReference}
                    className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                  >
                    + Add Reference
                  </button>
                </div>
                {(formData.references || []).map((ref, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 mb-3">
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <input
                          type="text"
                          value={ref.name}
                          onChange={e => updateReference(index, 'name', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Relationship</label>
                        <input
                          type="text"
                          value={ref.relationship}
                          onChange={e => updateReference(index, 'relationship', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Contact</label>
                        <input
                          type="text"
                          value={ref.contact}
                          onChange={e => updateReference(index, 'contact', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={ref.verified}
                          onChange={e => updateReference(index, 'verified', e.target.checked)}
                          className="mr-2"
                        />
                        <span className="text-sm font-medium text-gray-700">Verified</span>
                      </label>
                      <button
                        onClick={() => removeReference(index)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Review Notes */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Review Notes</h3>
                <textarea
                  value={formData.reviewNotes || ''}
                  onChange={e => setFormData({ ...formData, reviewNotes: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Enter screening notes, concerns, or recommendations..."
                ></textarea>
              </div>

              {/* Status Update (Review Mode Only) */}
              {viewMode === 'review' && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Application Status</h3>
                  <div className="flex gap-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="status"
                        value="In Progress"
                        checked={formData.status === 'In Progress'}
                        onChange={e => setFormData({ ...formData, status: e.target.value as ScreeningStatus })}
                        className="mr-2"
                      />
                      <span>In Progress</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="status"
                        value="Pending Review"
                        checked={formData.status === 'Pending Review'}
                        onChange={e => setFormData({ ...formData, status: e.target.value as ScreeningStatus })}
                        className="mr-2"
                      />
                      <span>Pending Review</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="status"
                        value="Approved"
                        checked={formData.status === 'Approved'}
                        onChange={e => setFormData({ ...formData, status: e.target.value as ScreeningStatus })}
                        className="mr-2"
                      />
                      <span>Approved</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="status"
                        value="Rejected"
                        checked={formData.status === 'Rejected'}
                        onChange={e => setFormData({ ...formData, status: e.target.value as ScreeningStatus })}
                        className="mr-2"
                      />
                      <span>Rejected</span>
                    </label>
                  </div>
                  {formData.status === 'Rejected' && (
                    <div className="mt-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Denial Reason</label>
                      <textarea
                        value={formData.denialReason || ''}
                        onChange={e => setFormData({ ...formData, denialReason: e.target.value })}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        placeholder="Required when rejecting application..."
                      ></textarea>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={viewMode === 'create' ? handleSubmitApplication : handleUpdateReview}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {viewMode === 'create' ? 'Submit Application' : 'Update Review'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
