import React, { useState, useEffect } from 'react';
import { Calendar, Download, BarChart3, TrendingUp, DollarSign, FileText, Printer } from 'lucide-react';
import { reportsAPI } from '../services/api';

const Reports = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [dailyReport, setDailyReport] = useState(null);
  const [monthlyReport, setMonthlyReport] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('daily');
  const [showFormalReport, setShowFormalReport] = useState(false);

  useEffect(() => {
    fetchSummary();
  }, []);

  useEffect(() => {
    if (activeTab === 'daily') {
      fetchDailyReport();
    } else if (activeTab === 'monthly') {
      fetchMonthlyReport();
    }
  }, [selectedDate, selectedMonth, selectedYear, activeTab]);

  const fetchSummary = async () => {
    try {
      const response = await reportsAPI.getSummary();
      if (response.success) {
        setSummary(response.data);
      }
    } catch (error) {
      console.error('Error fetching summary:', error);
    }
  };

  const fetchDailyReport = async () => {
    try {
      setLoading(true);
      const response = await reportsAPI.getDailyReport(selectedDate);
      if (response.success) {
        setDailyReport(response.data);
        setError('');
      } else {
        setError('Failed to fetch daily report');
      }
    } catch (error) {
      console.error('Error fetching daily report:', error);
      setError('Failed to load daily report');
    } finally {
      setLoading(false);
    }
  };

  const fetchMonthlyReport = async () => {
    try {
      setLoading(true);
      const response = await reportsAPI.getMonthlyReport(selectedYear, selectedMonth);
      if (response.success) {
        setMonthlyReport(response.data);
        setError('');
      } else {
        setError('Failed to fetch monthly report');
      }
    } catch (error) {
      console.error('Error fetching monthly report:', error);
      setError('Failed to load monthly report');
    } finally {
      setLoading(false);
    }
  };

  const exportReport = () => {
    const data = activeTab === 'daily' ? dailyReport : monthlyReport;
    if (!data) return;

    const csvContent = activeTab === 'daily'
      ? generateDailyCSV(data)
      : generateMonthlyCSV(data);

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeTab}-report-${activeTab === 'daily' ? selectedDate : `${selectedYear}-${selectedMonth}`}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const generateDailyCSV = (data) => {
    const headers = ['Record Number', 'Plate Number', 'Package Name', 'Package Description', 'Amount Paid', 'Payment Date'];
    const rows = data.services.map(service => [
      service.RecordNumber,
      service.PlateNumber,
      service.PackageName,
      service.PackageDescription,
      service.AmountPaid || 0,
      service.PaymentDate || 'Unpaid'
    ]);

    return [headers, ...rows].map(row => row.join(',')).join('\n');
  };

  const generateMonthlyCSV = (data) => {
    const headers = ['Date', 'Total Services', 'Paid Services', 'Unpaid Services', 'Total Revenue'];
    const rows = data.dailyBreakdown.map(day => [
      day.ServiceDate,
      day.totalServices,
      day.paidServices,
      day.unpaidServices,
      day.totalRevenue
    ]);

    return [headers, ...rows].map(row => row.join(',')).join('\n');
  };

  const generateFormalReport = () => {
    const reportData = activeTab === 'daily' ? dailyReport : monthlyReport;
    if (!reportData) return;

    setShowFormalReport(true);
  };

  const printFormalReport = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-ig-light-gray p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-ig-text">Reports & Analytics</h1>
            <p className="text-ig-text-light">View detailed reports and business insights</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={generateFormalReport}
              className="btn-ig-primary flex items-center space-x-2"
              disabled={!dailyReport && !monthlyReport}
            >
              <FileText className="h-5 w-5" />
              <span>Formal Report</span>
            </button>
            <button
              onClick={exportReport}
              className="btn-ig-gradient flex items-center space-x-2"
              disabled={!dailyReport && !monthlyReport}
            >
              <Download className="h-5 w-5" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="alert-ig-error mb-6">
            {error}
          </div>
        )}

        {/* Summary Cards */}
        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="card-ig p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-ig-text-light">Total Revenue</p>
                  <p className="text-2xl font-bold text-ig-text">{summary.overview.totalRevenue.toLocaleString()} RWF</p>
                </div>
                <div className="p-3 bg-ig-primary rounded-lg">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>

            <div className="card-ig p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-ig-text-light">Total Services</p>
                  <p className="text-2xl font-bold text-ig-text">{summary.overview.totalServices}</p>
                </div>
                <div className="p-3 bg-ig-blue rounded-lg">
                  <FileText className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>

            <div className="card-ig p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-ig-text-light">Today's Services</p>
                  <p className="text-2xl font-bold text-ig-text">{summary.today.services}</p>
                </div>
                <div className="p-3 bg-ig-purple rounded-lg">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>

            <div className="card-ig p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-ig-text-light">Today's Revenue</p>
                  <p className="text-2xl font-bold text-ig-text">{summary.today.revenue.toLocaleString()} RWF</p>
                </div>
                <div className="p-3 bg-ig-orange rounded-lg">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="card-ig mb-6">
          <div className="flex border-b border-ig-border">
            <button
              onClick={() => setActiveTab('daily')}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === 'daily'
                  ? 'text-ig-primary border-b-2 border-ig-primary'
                  : 'text-ig-text-light hover:text-ig-text'
              }`}
            >
              Daily Report
            </button>
            <button
              onClick={() => setActiveTab('monthly')}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === 'monthly'
                  ? 'text-ig-primary border-b-2 border-ig-primary'
                  : 'text-ig-text-light hover:text-ig-text'
              }`}
            >
              Monthly Report
            </button>
          </div>

          <div className="p-6">
            {/* Daily Report Tab */}
            {activeTab === 'daily' && (
              <div>
                <div className="flex items-center space-x-4 mb-6">
                  <Calendar className="h-5 w-5 text-ig-primary" />
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="input-ig max-w-xs"
                  />
                </div>

                {loading ? (
                  <div className="flex items-center justify-center p-8">
                    <div className="spinner-ig"></div>
                  </div>
                ) : dailyReport ? (
                  <div>
                    {/* Daily Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                      <div className="bg-ig-light-gray p-4 rounded-lg text-center">
                        <p className="text-2xl font-bold text-ig-primary">{dailyReport.summary.totalServices}</p>
                        <p className="text-sm text-ig-text-light">Total Services</p>
                      </div>
                      <div className="bg-ig-light-gray p-4 rounded-lg text-center">
                        <p className="text-2xl font-bold text-green-600">{dailyReport.summary.paidServices}</p>
                        <p className="text-sm text-ig-text-light">Paid Services</p>
                      </div>
                      <div className="bg-ig-light-gray p-4 rounded-lg text-center">
                        <p className="text-2xl font-bold text-yellow-600">{dailyReport.summary.unpaidServices}</p>
                        <p className="text-sm text-ig-text-light">Unpaid Services</p>
                      </div>
                      <div className="bg-ig-light-gray p-4 rounded-lg text-center">
                        <p className="text-2xl font-bold text-ig-primary">{dailyReport.summary.totalRevenue.toLocaleString()} RWF</p>
                        <p className="text-sm text-ig-text-light">Total Revenue</p>
                      </div>
                    </div>

                    {/* Daily Services Table */}
                    <div className="overflow-x-auto">
                      <table className="table-ig">
                        <thead>
                          <tr>
                            <th>Plate Number</th>
                            <th>Package Name</th>
                            <th>Package Description</th>
                            <th>Amount Paid</th>
                            <th>Payment Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {dailyReport.services.map((service, index) => (
                            <tr key={index}>
                              <td className="font-medium">{service.PlateNumber}</td>
                              <td>{service.PackageName}</td>
                              <td>{service.PackageDescription}</td>
                              <td className="font-medium">
                                {service.AmountPaid ? `${service.AmountPaid.toLocaleString()} RWF` : 'Unpaid'}
                              </td>
                              <td>
                                {service.PaymentDate
                                  ? new Date(service.PaymentDate).toLocaleDateString()
                                  : 'Pending'
                                }
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-ig-text-light mx-auto mb-4" />
                    <p className="text-ig-text-light">No data available for selected date</p>
                  </div>
                )}
              </div>
            )}

            {/* Monthly Report Tab */}
            {activeTab === 'monthly' && (
              <div>
                <div className="flex items-center space-x-4 mb-6">
                  <Calendar className="h-5 w-5 text-ig-primary" />
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                    className="input-ig max-w-xs"
                  >
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {new Date(2024, i).toLocaleString('default', { month: 'long' })}
                      </option>
                    ))}
                  </select>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                    className="input-ig max-w-xs"
                  >
                    {Array.from({ length: 5 }, (_, i) => (
                      <option key={2024 - i} value={2024 - i}>
                        {2024 - i}
                      </option>
                    ))}
                  </select>
                </div>

                {loading ? (
                  <div className="flex items-center justify-center p-8">
                    <div className="spinner-ig"></div>
                  </div>
                ) : monthlyReport ? (
                  <div>
                    {/* Monthly Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                      <div className="bg-ig-light-gray p-4 rounded-lg text-center">
                        <p className="text-2xl font-bold text-ig-primary">{monthlyReport.summary.totalServices}</p>
                        <p className="text-sm text-ig-text-light">Total Services</p>
                      </div>
                      <div className="bg-ig-light-gray p-4 rounded-lg text-center">
                        <p className="text-2xl font-bold text-green-600">{monthlyReport.summary.paidServices}</p>
                        <p className="text-sm text-ig-text-light">Paid Services</p>
                      </div>
                      <div className="bg-ig-light-gray p-4 rounded-lg text-center">
                        <p className="text-2xl font-bold text-yellow-600">{monthlyReport.summary.unpaidServices}</p>
                        <p className="text-sm text-ig-text-light">Unpaid Services</p>
                      </div>
                      <div className="bg-ig-light-gray p-4 rounded-lg text-center">
                        <p className="text-2xl font-bold text-ig-primary">{monthlyReport.summary.totalRevenue.toLocaleString()} RWF</p>
                        <p className="text-sm text-ig-text-light">Total Revenue</p>
                      </div>
                    </div>

                    {/* Monthly Breakdown Table */}
                    <div className="overflow-x-auto">
                      <table className="table-ig">
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th>Total Services</th>
                            <th>Paid Services</th>
                            <th>Unpaid Services</th>
                            <th>Total Revenue</th>
                          </tr>
                        </thead>
                        <tbody>
                          {monthlyReport.dailyBreakdown.map((day, index) => (
                            <tr key={index}>
                              <td className="font-medium">{new Date(day.ServiceDate).toLocaleDateString()}</td>
                              <td>{day.totalServices}</td>
                              <td className="text-green-600">{day.paidServices}</td>
                              <td className="text-yellow-600">{day.unpaidServices}</td>
                              <td className="font-medium">{day.totalRevenue.toLocaleString()} RWF</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <BarChart3 className="h-12 w-12 text-ig-text-light mx-auto mb-4" />
                    <p className="text-ig-text-light">No data available for selected month</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Formal Report Modal */}
        {showFormalReport && (
          <div className="modal-ig">
            <div className="modal-ig-backdrop" onClick={() => setShowFormalReport(false)}></div>
            <div className="flex items-center justify-center min-h-screen p-4">
              <div className="modal-ig-content max-w-4xl w-full p-8 print:shadow-none print:max-w-none">
                {/* Report Header */}
                <div className="text-center mb-8 border-b-2 border-ig-primary pb-6">
                  <div className="flex items-center justify-center mb-4">
                    <div className="bg-ig-gradient p-3 rounded-lg mr-4">
                      <FileText className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h1 className="text-3xl font-bold text-ig-gradient">SmartPark Car Wash</h1>
                      <p className="text-ig-text-light">Management System Report</p>
                    </div>
                  </div>
                  <div className="text-sm text-ig-text-light">
                    <p>Rubavu District, Western Province, Rwanda</p>
                    <p>Phone: +250 788 000 000 | Email: info@smartpark.rw</p>
                  </div>
                </div>

                {/* Report Details */}
                <div className="grid grid-cols-2 gap-8 mb-8">
                  <div>
                    <h3 className="text-lg font-bold text-ig-text mb-4">Report Information</h3>
                    <div className="space-y-2 text-sm">
                      <p><strong>Report Type:</strong> {activeTab === 'daily' ? 'Daily' : 'Monthly'} Report</p>
                      <p><strong>Report Date:</strong> {new Date().toLocaleDateString()}</p>
                      <p><strong>Report Time:</strong> {new Date().toLocaleTimeString()}</p>
                      <p><strong>Period:</strong> {
                        activeTab === 'daily'
                          ? new Date(selectedDate).toLocaleDateString()
                          : `${new Date(selectedYear, selectedMonth - 1).toLocaleDateString('default', { month: 'long', year: 'numeric' })}`
                      }</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-ig-text mb-4">Summary Statistics</h3>
                    <div className="space-y-2 text-sm">
                      {activeTab === 'daily' && dailyReport && (
                        <>
                          <p><strong>Total Services:</strong> {dailyReport.summary.totalServices}</p>
                          <p><strong>Paid Services:</strong> {dailyReport.summary.paidServices}</p>
                          <p><strong>Unpaid Services:</strong> {dailyReport.summary.unpaidServices}</p>
                          <p><strong>Total Revenue:</strong> {dailyReport.summary.totalRevenue.toLocaleString()} RWF</p>
                        </>
                      )}
                      {activeTab === 'monthly' && monthlyReport && (
                        <>
                          <p><strong>Total Services:</strong> {monthlyReport.summary.totalServices}</p>
                          <p><strong>Paid Services:</strong> {monthlyReport.summary.paidServices}</p>
                          <p><strong>Unpaid Services:</strong> {monthlyReport.summary.unpaidServices}</p>
                          <p><strong>Total Revenue:</strong> {monthlyReport.summary.totalRevenue.toLocaleString()} RWF</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Report Data Table */}
                <div className="mb-8">
                  <h3 className="text-lg font-bold text-ig-text mb-4">Detailed Report</h3>
                  <div className="overflow-x-auto">
                    {activeTab === 'daily' && dailyReport && (
                      <table className="w-full border-collapse border border-gray-300 text-sm">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="border border-gray-300 px-4 py-2 text-left">Plate Number</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">Package Name</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">Description</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">Amount Paid</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">Payment Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {dailyReport.services.map((service, index) => (
                            <tr key={index}>
                              <td className="border border-gray-300 px-4 py-2">{service.PlateNumber}</td>
                              <td className="border border-gray-300 px-4 py-2">{service.PackageName}</td>
                              <td className="border border-gray-300 px-4 py-2">{service.PackageDescription}</td>
                              <td className="border border-gray-300 px-4 py-2">
                                {service.AmountPaid ? `${service.AmountPaid.toLocaleString()} RWF` : 'Unpaid'}
                              </td>
                              <td className="border border-gray-300 px-4 py-2">
                                {service.PaymentDate ? new Date(service.PaymentDate).toLocaleDateString() : 'Pending'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}

                    {activeTab === 'monthly' && monthlyReport && (
                      <table className="w-full border-collapse border border-gray-300 text-sm">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="border border-gray-300 px-4 py-2 text-left">Date</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">Total Services</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">Paid Services</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">Unpaid Services</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">Total Revenue</th>
                          </tr>
                        </thead>
                        <tbody>
                          {monthlyReport.dailyBreakdown.map((day, index) => (
                            <tr key={index}>
                              <td className="border border-gray-300 px-4 py-2">{new Date(day.ServiceDate).toLocaleDateString()}</td>
                              <td className="border border-gray-300 px-4 py-2">{day.totalServices}</td>
                              <td className="border border-gray-300 px-4 py-2">{day.paidServices}</td>
                              <td className="border border-gray-300 px-4 py-2">{day.unpaidServices}</td>
                              <td className="border border-gray-300 px-4 py-2">{day.totalRevenue.toLocaleString()} RWF</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>

                {/* Signature Section */}
                <div className="grid grid-cols-2 gap-8 mt-12 pt-8 border-t border-gray-300">
                  <div>
                    <h4 className="font-bold text-ig-text mb-4">Prepared By:</h4>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-ig-text-light">Name: ________________________</p>
                      </div>
                      <div>
                        <p className="text-sm text-ig-text-light">Position: ____________________</p>
                      </div>
                      <div>
                        <p className="text-sm text-ig-text-light">Signature: ___________________</p>
                      </div>
                      <div>
                        <p className="text-sm text-ig-text-light">Date: _______________________</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-ig-text mb-4">Approved By:</h4>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-ig-text-light">Name: ________________________</p>
                      </div>
                      <div>
                        <p className="text-sm text-ig-text-light">Position: ____________________</p>
                      </div>
                      <div>
                        <p className="text-sm text-ig-text-light">Signature: ___________________</p>
                      </div>
                      <div>
                        <p className="text-sm text-ig-text-light">Date: _______________________</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-8 pt-4 border-t border-gray-300 text-xs text-ig-text-light">
                  <p>This report is generated automatically by SmartPark Car Wash Management System</p>
                  <p>Report ID: CWSMS-{new Date().getFullYear()}-{String(new Date().getMonth() + 1).padStart(2, '0')}-{String(new Date().getDate()).padStart(2, '0')}-{Date.now()}</p>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3 pt-6 print:hidden">
                  <button
                    onClick={printFormalReport}
                    className="btn-ig-primary flex items-center space-x-2 flex-1"
                  >
                    <Printer className="h-5 w-5" />
                    <span>Print Report</span>
                  </button>
                  <button
                    onClick={() => setShowFormalReport(false)}
                    className="btn-ig-secondary flex-1"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
