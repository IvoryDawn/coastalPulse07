import { useState, useEffect } from 'react'
import { getPendingReportsForOfficer, verifyReportAsOfficer } from '../api/verification'

export default function OfficerVerification() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedReport, setSelectedReport] = useState(null)
  const [verificationNotes, setVerificationNotes] = useState('')
  const [generateAlert, setGenerateAlert] = useState(false)
  const [alertData, setAlertData] = useState({
    alertType: '',
    severity: 'medium',
    alertMessage: '',
    affectedArea: ''
  })
  const [verifying, setVerifying] = useState(false)

  useEffect(() => {
    loadPendingReports()
  }, [])

  const loadPendingReports = async () => {
    try {
      setLoading(true)
      const data = await getPendingReportsForOfficer()
      setReports(data)
    } catch (e) {
      setError('Failed to load pending reports')
      console.error('Error loading reports:', e)
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyReport = async (reportId, verified) => {
    try {
      setVerifying(true)
      await verifyReportAsOfficer(reportId, verified, verificationNotes, generateAlert, alertData)
      setVerificationNotes('')
      setGenerateAlert(false)
      setAlertData({
        alertType: '',
        severity: 'medium',
        alertMessage: '',
        affectedArea: ''
      })
      setSelectedReport(null)
      await loadPendingReports()
    } catch (e) {
      setError('Failed to verify report')
      console.error('Error verifying report:', e)
    } finally {
      setVerifying(false)
    }
  }

  const getEventTypeColor = (eventType) => {
    const colorMap = {
      'high_waves': 'bg-blue-100 text-blue-800',
      'storm_surge': 'bg-red-100 text-red-800',
      'coastal_erosion': 'bg-orange-100 text-orange-800',
      'flooding': 'bg-purple-100 text-purple-800',
      'oil_spill': 'bg-gray-100 text-gray-800'
    }
    return colorMap[eventType] || 'bg-gray-100 text-gray-800'
  }

  const getSeverityColor = (severity) => {
    const colorMap = {
      'low': 'bg-green-100 text-green-800',
      'medium': 'bg-yellow-100 text-yellow-800',
      'high': 'bg-orange-100 text-orange-800',
      'critical': 'bg-red-100 text-red-800'
    }
    return colorMap[severity] || 'bg-gray-100 text-gray-800'
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString()
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-6 rounded-2xl">
        <h1 className="text-2xl font-bold mb-2">Officer Verification Dashboard</h1>
        <p className="text-green-100">Review analyst-verified reports and generate safety alerts</p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        </div>
      )}

      {/* Reports List */}
      <div className="grid gap-4">
        {reports.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No reports pending officer verification</p>
          </div>
        ) : (
          reports.map((report) => (
            <div key={report.id} className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getEventTypeColor(report.event_type)}`}>
                      {report.event_type.replace('_', ' ').toUpperCase()}
                    </span>
                    <span className="text-sm text-gray-500">
                      Verified by {report.analyst_name}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {report.location_name || 'Location not specified'}
                  </h3>
                  
                  <p className="text-gray-700 mb-3">
                    {report.description || 'No description provided'}
                  </p>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>📍 {report.latitude}, {report.longitude}</span>
                    <span>📅 {formatDate(report.analyst_verified_at)}</span>
                    {report.analyst_notes && (
                      <span>📝 Analyst notes available</span>
                    )}
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => setSelectedReport(report)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                  >
                    Review & Verify
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Verification Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Final Verification & Alert Generation</h2>
                <button
                  onClick={() => setSelectedReport(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Report Details */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Report Details</h3>
                  <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                    <p><strong>Type:</strong> {selectedReport.event_type.replace('_', ' ')}</p>
                    <p><strong>Location:</strong> {selectedReport.location_name}</p>
                    <p><strong>Reporter:</strong> {selectedReport.reporter_name}</p>
                    <p><strong>Analyst:</strong> {selectedReport.analyst_name}</p>
                    <p><strong>Description:</strong> {selectedReport.description}</p>
                    <p><strong>Coordinates:</strong> {selectedReport.latitude}, {selectedReport.longitude}</p>
                    <p><strong>Analyst Notes:</strong> {selectedReport.analyst_notes || 'None'}</p>
                  </div>
                </div>

                {/* Verification Form */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Officer Verification Notes
                    </label>
                    <textarea
                      value={verificationNotes}
                      onChange={(e) => setVerificationNotes(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Add your verification notes..."
                    />
                  </div>

                  {/* Alert Generation */}
                  <div className="border-t pt-4">
                    <div className="flex items-center mb-3">
                      <input
                        type="checkbox"
                        id="generateAlert"
                        checked={generateAlert}
                        onChange={(e) => setGenerateAlert(e.target.checked)}
                        className="mr-2"
                      />
                      <label htmlFor="generateAlert" className="text-sm font-medium text-gray-700">
                        Generate Safety Alert
                      </label>
                    </div>

                    {generateAlert && (
                      <div className="space-y-3 p-4 bg-yellow-50 rounded-lg">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Alert Type
                          </label>
                          <select
                            value={alertData.alertType}
                            onChange={(e) => setAlertData(prev => ({ ...prev, alertType: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          >
                            <option value="">Select alert type</option>
                            <option value="tsunami_warning">Tsunami Warning</option>
                            <option value="storm_surge">Storm Surge Alert</option>
                            <option value="high_waves">High Waves Warning</option>
                            <option value="coastal_flooding">Coastal Flooding Alert</option>
                            <option value="oil_spill">Oil Spill Alert</option>
                            <option value="general_hazard">General Hazard Alert</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Severity Level
                          </label>
                          <select
                            value={alertData.severity}
                            onChange={(e) => setAlertData(prev => ({ ...prev, severity: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                            <option value="critical">Critical</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Alert Message
                          </label>
                          <textarea
                            value={alertData.alertMessage}
                            onChange={(e) => setAlertData(prev => ({ ...prev, alertMessage: e.target.value }))}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            placeholder="Enter alert message for the public..."
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Affected Area
                          </label>
                          <input
                            type="text"
                            value={alertData.affectedArea}
                            onChange={(e) => setAlertData(prev => ({ ...prev, affectedArea: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            placeholder="e.g., Chennai Coast, Mumbai Harbor"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setSelectedReport(null)}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleVerifyReport(selectedReport.id, false)}
                  disabled={verifying}
                  className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50"
                >
                  {verifying ? 'Processing...' : 'Reject'}
                </button>
                <button
                  onClick={() => handleVerifyReport(selectedReport.id, true)}
                  disabled={verifying || (generateAlert && (!alertData.alertType || !alertData.alertMessage || !alertData.affectedArea))}
                  className="px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  {verifying ? 'Processing...' : 'Verify & Process'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
