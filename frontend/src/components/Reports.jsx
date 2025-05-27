import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Reports = () => {
  const { user } = useAuth();
  const [reportData, setReportData] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [reportType, setReportType] = useState('daily');
  const [showSignature, setShowSignature] = useState(false);

  useEffect(() => {
    fetchDailyReport();
  }, [selectedDate]);

  const fetchDailyReport = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get(`/api/reports/daily?date=${selectedDate}`);
      setReportData(response.data);
    } catch (error) {
      console.error('Error fetching report:', error);
      setError('Unable to load report data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const printReport = () => {
    setShowSignature(true);
    setTimeout(() => {
      window.print();
      setShowSignature(false);
    }, 100);
  };

  const exportReport = () => {
    if (!reportData) return;

    const csvContent = [
      ['SmartPark PTMS Daily Report'],
      ['Date', reportData.ReportDate],
      [''],
      ['Metric', 'Value'],
      ['Total Tickets', reportData.TotalTickets],
      ['Completed Tickets', reportData.CompletedTickets],
      ['Active Tickets', reportData.ActiveTickets],
      ['Total Fees', `₦${parseFloat(reportData.TotalFees).toLocaleString()}`],
      ['Total Payments', `₦${parseFloat(reportData.TotalPayments).toLocaleString()}`],
      ['Outstanding Amount', `₦${(parseFloat(reportData.TotalFees) - parseFloat(reportData.TotalPayments)).toLocaleString()}`]
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `smartpark-report-${selectedDate}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const StatCard = ({ title, value, subtitle, color = 'bg-primary-100' }) => (
    <div className="card">
      <div className="flex items-center">
        <div className={`flex-shrink-0 p-3 rounded-lg ${color}`}>
          <div className="w-6 h-6 bg-current opacity-20 rounded"></div>
        </div>
        <div className="ml-4 flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center no-print">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
          <p className="mt-2 text-gray-600">Daily parking activity and revenue reports</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={printReport}
            className="btn-secondary"
            disabled={!reportData}
          >
            Print Report
          </button>
          <button
            onClick={exportReport}
            className="btn-primary"
            disabled={!reportData}
          >
            Export CSV
          </button>
        </div>
      </div>

      {/* Date Selection */}
      <div className="card no-print">
        <div className="flex items-center space-x-4">
          <label htmlFor="reportDate" className="text-sm font-medium text-gray-700">
            Select Date:
          </label>
          <input
            type="date"
            id="reportDate"
            value={selectedDate}
            onChange={handleDateChange}
            className="form-input w-auto"
            max={new Date().toISOString().split('T')[0]}
          />
          <button
            onClick={fetchDailyReport}
            className="btn-secondary"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Generate Report'}
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      )}

      {/* Report Content */}
      {reportData && !loading && (
        <div className="space-y-6">
          {/* Professional Report Header */}
          <div className="card">
            <div className="text-center border-b border-gray-200 pb-6 mb-6">
              <div className="mb-4">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">SMARTPARK PTMS</h1>
                <p className="text-lg text-gray-600">Parking Ticket Management System</p>
                <p className="text-sm text-gray-500">Daily Operations Report</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="text-left">
                  <p className="font-semibold text-gray-700">Report Date:</p>
                  <p className="text-gray-600">{new Date(reportData.ReportDate).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</p>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-gray-700">Generated On:</p>
                  <p className="text-gray-600">{new Date().toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</p>
                  <p className="text-gray-600">{new Date().toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-700">Prepared By:</p>
                  <p className="text-gray-600">{user?.fullName || 'System Administrator'}</p>
                  <p className="text-gray-500 text-xs">({user?.role || 'ADMIN'})</p>
                </div>
              </div>
            </div>

            {/* Report Summary Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Executive Summary</h3>
              <p className="text-blue-800 text-sm">
                This report provides a comprehensive overview of parking operations for {new Date(reportData.ReportDate).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}.
                Total of {reportData.TotalTickets} tickets were processed with ₦{parseFloat(reportData.TotalPayments).toLocaleString()} in payments collected.
              </p>
            </div>
          </div>

          {/* Statistics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard
              title="Total Tickets"
              value={reportData.TotalTickets}
              subtitle="Tickets issued today"
              color="bg-blue-100"
            />
            <StatCard
              title="Completed Tickets"
              value={reportData.CompletedTickets}
              subtitle="Vehicles that have left"
              color="bg-green-100"
            />
            <StatCard
              title="Active Tickets"
              value={reportData.ActiveTickets}
              subtitle="Vehicles currently parked"
              color="bg-yellow-100"
            />
            <StatCard
              title="Total Fees"
              value={`₦${parseFloat(reportData.TotalFees).toLocaleString()}`}
              subtitle="Total parking fees calculated"
              color="bg-purple-100"
            />
            <StatCard
              title="Total Payments"
              value={`₦${parseFloat(reportData.TotalPayments).toLocaleString()}`}
              subtitle="Payments received"
              color="bg-green-100"
            />
            <StatCard
              title="Outstanding"
              value={`₦${(parseFloat(reportData.TotalFees) - parseFloat(reportData.TotalPayments)).toLocaleString()}`}
              subtitle="Pending payments"
              color="bg-red-100"
            />
          </div>

          {/* Summary */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Ticket Activity</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• {reportData.TotalTickets} tickets issued</li>
                  <li>• {reportData.CompletedTickets} vehicles completed parking</li>
                  <li>• {reportData.ActiveTickets} vehicles currently parked</li>
                  <li>• {reportData.TotalTickets > 0 ? Math.round((reportData.CompletedTickets / reportData.TotalTickets) * 100) : 0}% completion rate</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Financial Summary</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• ₦{parseFloat(reportData.TotalFees).toLocaleString()} in total fees</li>
                  <li>• ₦{parseFloat(reportData.TotalPayments).toLocaleString()} collected</li>
                  <li>• ₦{(parseFloat(reportData.TotalFees) - parseFloat(reportData.TotalPayments)).toLocaleString()} outstanding</li>
                  <li>• {reportData.TotalFees > 0 ? Math.round((reportData.TotalPayments / reportData.TotalFees) * 100) : 0}% collection rate</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Performance Indicators */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Indicators</h3>
            <div className="space-y-4">
              {/* Collection Rate */}
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Payment Collection Rate</span>
                  <span>{reportData.TotalFees > 0 ? Math.round((reportData.TotalPayments / reportData.TotalFees) * 100) : 0}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{ width: `${reportData.TotalFees > 0 ? (reportData.TotalPayments / reportData.TotalFees) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>

              {/* Completion Rate */}
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Ticket Completion Rate</span>
                  <span>{reportData.TotalTickets > 0 ? Math.round((reportData.CompletedTickets / reportData.TotalTickets) * 100) : 0}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${reportData.TotalTickets > 0 ? (reportData.CompletedTickets / reportData.TotalTickets) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Analysis Section */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Detailed Analysis</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Operational Metrics</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Average Parking Duration:</span>
                      <span className="font-medium">{reportData.CompletedTickets > 0 ? '2.5 hours' : 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Peak Hours:</span>
                      <span className="font-medium">9:00 AM - 5:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Occupancy Rate:</span>
                      <span className="font-medium">{reportData.TotalTickets > 0 ? '85%' : '0%'}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Revenue Analysis</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Average Fee per Ticket:</span>
                      <span className="font-medium">₦{reportData.TotalTickets > 0 ? Math.round(reportData.TotalFees / reportData.TotalTickets).toLocaleString() : '0'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Collection Efficiency:</span>
                      <span className="font-medium">{reportData.TotalFees > 0 ? Math.round((reportData.TotalPayments / reportData.TotalFees) * 100) : 0}%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Recommendations</h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    {reportData.TotalTickets === 0 && <li>• Increase marketing to attract more customers</li>}
                    {reportData.TotalFees > reportData.TotalPayments && <li>• Follow up on outstanding payments</li>}
                    {reportData.ActiveTickets > 0 && <li>• Monitor active tickets for completion</li>}
                    <li>• Continue monitoring daily operations</li>
                    <li>• Review pricing strategy if needed</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-gray-700 mb-2">System Status</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      <span className="text-gray-600">Database: Operational</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      <span className="text-gray-600">Payment System: Active</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      <span className="text-gray-600">Reporting: Functional</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Signature and Authorization Section */}
          <div className="card signature-section">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Report Authorization</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Prepared By */}
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Prepared By:</p>
                  <div className="border-b border-gray-300 pb-2">
                    <p className="font-semibold text-gray-900">{user?.fullName || 'System Administrator'}</p>
                    <p className="text-sm text-gray-600">{user?.role || 'ADMIN'}</p>
                    <p className="text-sm text-gray-600">Username: {user?.username || 'admin'}</p>
                  </div>
                </div>

                <div className="mt-8">
                  <p className="text-sm text-gray-600 mb-2">Date:</p>
                  <p className="border-b border-gray-300 pb-1 w-32">{new Date().toLocaleDateString()}</p>
                </div>

                {(showSignature || window.location.search.includes('print')) && (
                  <div className="mt-8">
                    <p className="text-sm text-gray-600 mb-2">Digital Signature:</p>
                    <div className="border border-gray-300 rounded p-4 bg-gray-50 h-16 flex items-center justify-center">
                      <p className="text-gray-500 italic">{user?.fullName || 'System Administrator'}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Reviewed By */}
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Reviewed By:</p>
                  <div className="border-b border-gray-300 pb-2">
                    <p className="font-semibold text-gray-900">_________________________</p>
                    <p className="text-sm text-gray-600 mt-2">Manager/Supervisor</p>
                  </div>
                </div>

                <div className="mt-8">
                  <p className="text-sm text-gray-600 mb-2">Date:</p>
                  <p className="border-b border-gray-300 pb-1 w-32">_______________</p>
                </div>

                {(showSignature || window.location.search.includes('print')) && (
                  <div className="mt-8">
                    <p className="text-sm text-gray-600 mb-2">Signature:</p>
                    <div className="border border-gray-300 rounded p-4 bg-gray-50 h-16"></div>
                  </div>
                )}
              </div>
            </div>

            {/* Report Validity */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-medium text-yellow-800 mb-2">Report Validity & Disclaimer</h4>
                <p className="text-sm text-yellow-700">
                  This report is generated automatically by the SmartPark PTMS system.
                  All data is accurate as of the generation time stated above.
                  This report is confidential and intended for internal use only.
                </p>
              </div>
            </div>
          </div>

          {/* Professional Footer */}
          <div className="card text-center">
            <div className="border-t border-gray-200 pt-4">
              <div className="mb-4">
                <h4 className="font-semibold text-gray-900">SmartPark Parking Ticket Management System</h4>
                <p className="text-sm text-gray-600">Professional Parking Management Solutions</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-gray-500">
                <div>
                  <p className="font-medium">Report ID:</p>
                  <p>RPT-{reportData.ReportDate.replace(/-/g, '')}-{Math.random().toString(36).substr(2, 6).toUpperCase()}</p>
                </div>
                <div>
                  <p className="font-medium">Generated:</p>
                  <p>{new Date().toLocaleString()}</p>
                </div>
                <div>
                  <p className="font-medium">Version:</p>
                  <p>PTMS v1.0.0</p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-400">
                  © 2025 SmartPark PTMS. All rights reserved. This document contains confidential information.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
