import { useState, useEffect } from 'react'
import { getPendingReportsForAnalyst, verifyReportAsAnalyst } from '../api/verification'

export default function AnalystVerification() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedReport, setSelectedReport] = useState(null)
  const [verificationNotes, setVerificationNotes] = useState('')
  const [verifying, setVerifying] = useState(false)

  useEffect(() => {
    loadPendingReports()
  }, [])

  const loadPendingReports = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getPendingReportsForAnalyst()
      console.log('📊 Loaded reports:', data)
      setReports(data || [])
    } catch (e) {
      console.error('Error loading reports:', e)
      if (e.response?.status === 403) {
        setError('Access denied. You need analyst role to view this page.')
      } else if (e.response?.status === 404) {
        setError('API endpoint not found. Please check if the server is running.')
      } else {
        setError('Failed to load pending reports. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyReport = async (reportId, verified) => {
    try {
      setVerifying(true)
      setError(null)
      
      console.log('🔄 Starting verification process:', { reportId, verified, notes: verificationNotes });
      
      const result = await verifyReportAsAnalyst(reportId, verified, verificationNotes)
      
      console.log('✅ Verification completed:', result);
      
      setVerificationNotes('')
      setSelectedReport(null)
      await loadPendingReports()
      
      // Show success message
      setError(null)
    } catch (e) {
      console.error('❌ Error verifying report:', e);
      
      let errorMessage = 'Failed to verify report';
      
      if (e.response?.status === 403) {
        errorMessage = 'Access denied. You need analyst role to verify reports.';
      } else if (e.response?.status === 404) {
        errorMessage = 'Report not found. It may have been deleted.';
      } else if (e.response?.status === 400) {
        errorMessage = 'Invalid request. Please check your input.';
      } else if (e.response?.data?.error) {
        errorMessage = e.response.data.error;
      } else if (e.message) {
        errorMessage = e.message;
      }
      
      setError(errorMessage)
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString()
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 rounded-2xl">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold mb-2">Report Verification Dashboard</h1>
            <p className="text-purple-100">Review and verify submitted hazard reports</p>
          </div>
          <button
            onClick={loadPendingReports}
            disabled={loading}
            className="bg-white text-purple-600 px-4 py-2 rounded-lg hover:bg-gray-100 flex items-center space-x-2 disabled:opacity-50"
          >
            <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Refresh</span>
          </button>
        </div>
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
            <p className="text-gray-500 text-lg">No reports pending verification</p>
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
                      Submitted by {report.reporter_name}
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
                    <span>📅 {formatDate(report.created_at)}</span>
                    {report.media_path && (
                      <span>📎 Has media attachment</span>
                    )}
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => setSelectedReport(report)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Review
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
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Verify Report</h2>
                <button
                  onClick={() => setSelectedReport(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900">Report Details</h3>
                  <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                    <p><strong>Type:</strong> {selectedReport.event_type.replace('_', ' ')}</p>
                    <p><strong>Location:</strong> {selectedReport.location_name}</p>
                    <p><strong>Reporter:</strong> {selectedReport.reporter_name}</p>
                    <p><strong>Description:</strong> {selectedReport.description}</p>
                    <p><strong>Coordinates:</strong> {selectedReport.latitude}, {selectedReport.longitude}</p>
                    <p><strong>Submitted:</strong> {formatDate(selectedReport.created_at)}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Verification Notes
                  </label>
                  <textarea
                    value={verificationNotes}
                    onChange={(e) => setVerificationNotes(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Add notes about your verification decision..."
                  />
                </div>

                <div className="flex justify-end space-x-3">
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
                    disabled={verifying}
                    className="px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50"
                  >
                    {verifying ? 'Processing...' : 'Verify'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
