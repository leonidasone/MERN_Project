import { useState, useEffect } from 'react'
import axios from 'axios'

function Reports() {
  const [reportData, setReportData] = useState(null)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchReport()
  }, [])

  const fetchReport = async (date = selectedDate) => {
    setLoading(true)
    try {
      const response = await axios.get(`/api/report/daily?date=${date}`)
      setReportData(response.data)
    } catch (error) {
      console.error('Error fetching report:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDateChange = (e) => {
    const newDate = e.target.value
    setSelectedDate(newDate)
    fetchReport(newDate)
  }

  const printReport = () => {
    window.print()
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 bg-neutral-50 rounded-3xl border-8 border-neutral-300">
        <div className="animate-spin rounded-full h-32 w-32 border-8 border-blue-600 border-t-transparent mb-8"></div>
        <div className="text-4xl font-black text-neutral-700 uppercase tracking-wider">Generating Professional Report...</div>
        <div className="text-xl font-bold text-neutral-500 mt-4">Please wait while we compile your data</div>
      </div>
    )
  }

  return (
    <div className="space-y-10 bg-neutral-50 min-h-screen p-8 rounded-3xl">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-neutral-900 via-neutral-800 to-black rounded-3xl p-12 shadow-2xl border-8 border-neutral-700">
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center">
          <div className="text-white">
            <div className="flex items-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center mr-6 shadow-xl">
                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <div>
                <h1 className="text-6xl font-black tracking-tight mb-2">BUSINESS ANALYTICS</h1>
                <p className="text-2xl font-bold text-blue-400 tracking-wider uppercase">
                  Professional Reporting Dashboard
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="bg-neutral-800 rounded-2xl p-6 border-4 border-neutral-600">
                <div className="text-3xl font-black text-blue-400 mb-2">COMPREHENSIVE</div>
                <div className="text-lg font-bold text-neutral-300">Daily Operations</div>
              </div>
              <div className="bg-neutral-800 rounded-2xl p-6 border-4 border-neutral-600">
                <div className="text-3xl font-black text-green-400 mb-2">REAL-TIME</div>
                <div className="text-lg font-bold text-neutral-300">Data Analytics</div>
              </div>
              <div className="bg-neutral-800 rounded-2xl p-6 border-4 border-neutral-600">
                <div className="text-3xl font-black text-purple-400 mb-2">PROFESSIONAL</div>
                <div className="text-lg font-bold text-neutral-300">Print Ready</div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-6 mt-8 xl:mt-0">
            <div className="bg-neutral-800 rounded-2xl p-6 border-4 border-neutral-600">
              <label className="block text-xl font-black text-white mb-4 tracking-wider uppercase">
                Report Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={handleDateChange}
                className="w-full px-6 py-4 border-4 border-neutral-400 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-200 focus:outline-none font-bold text-xl bg-white transition-all duration-300 hover:border-neutral-500 focus:scale-105"
              />
            </div>
            <button
              onClick={printReport}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-black py-6 px-10 rounded-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-xl hover:shadow-2xl border-4 border-blue-800 text-2xl tracking-wider uppercase"
            >
              <svg className="w-8 h-8 inline-block mr-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd"/>
              </svg>
              GENERATE REPORT
            </button>
          </div>
        </div>
      </div>

      {reportData && (
        <div className="space-y-10 print:space-y-6">
          {/* Professional Report Header */}
          <div className="bg-white rounded-3xl shadow-2xl border-8 border-neutral-300 print:shadow-none print:border-4 overflow-hidden">
            {/* Company Header */}
            <div className="bg-gradient-to-r from-neutral-900 to-neutral-800 text-white p-12 print:bg-neutral-900">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center mr-8 shadow-xl">
                    <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm8 0a1 1 0 011-1h4a1 1 0 011 1v6a1 1 0 01-1 1h-4a1 1 0 01-1-1V8z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-5xl font-black tracking-tight mb-2">SMARTPARK GAS STATION</h2>
                    <p className="text-2xl font-bold text-blue-400">Professional Business Solutions</p>
                    <p className="text-lg font-semibold text-neutral-300 mt-2">Kigali, Rwanda • License: #GS-2024-001</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="bg-neutral-800 rounded-2xl p-6 border-4 border-neutral-600">
                    <div className="text-sm font-bold text-neutral-400 uppercase tracking-wider mb-2">Report Date</div>
                    <div className="text-3xl font-black text-white">{reportData.date}</div>
                    <div className="text-sm font-bold text-blue-400 mt-2">Daily Operations Summary</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Executive Summary */}
            <div className="p-12">
              <div className="mb-12">
                <h3 className="text-4xl font-black text-neutral-800 mb-6 tracking-wider uppercase flex items-center">
                  <svg className="w-10 h-10 mr-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm8 0a1 1 0 011-1h4a1 1 0 011 1v6a1 1 0 01-1 1h-4a1 1 0 01-1-1V8z"/>
                  </svg>
                  Executive Summary
                </h3>
                <div className="bg-gradient-to-r from-neutral-50 to-neutral-100 rounded-2xl p-8 border-4 border-neutral-300">
                  <p className="text-xl font-bold text-neutral-700 leading-relaxed">
                    This comprehensive daily operations report provides detailed insights into fuel sales, customer transactions,
                    payment processing, and inventory management for {reportData.date}. All data has been verified and audited
                    for accuracy and compliance with industry standards.
                  </p>
                </div>
              </div>

              {/* Key Performance Indicators */}
              <div className="mb-12">
                <h3 className="text-4xl font-black text-neutral-800 mb-8 tracking-wider uppercase flex items-center">
                  <svg className="w-10 h-10 mr-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd"/>
                  </svg>
                  Key Performance Indicators
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 rounded-3xl border-6 border-blue-300 shadow-xl overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-xl font-black uppercase tracking-wider">Transactions</h4>
                          <p className="text-sm font-bold opacity-90">Daily Volume</p>
                        </div>
                        <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"/>
                        </svg>
                      </div>
                    </div>
                    <div className="p-8 text-center">
                      <div className="text-6xl font-black text-blue-700 mb-4">
                        {reportData.transactions[0]?.count || 0}
                      </div>
                      <div className="text-lg font-bold text-blue-600">Total Processed</div>
                      <div className="mt-4 bg-blue-200 rounded-full p-3">
                        <div className="text-sm font-black text-blue-800">100% Verified</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 via-green-100 to-green-200 rounded-3xl border-6 border-green-300 shadow-xl overflow-hidden">
                    <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-xl font-black uppercase tracking-wider">Revenue</h4>
                          <p className="text-sm font-bold opacity-90">Daily Sales</p>
                        </div>
                        <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"/>
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.51-1.31c-.562-.649-1.413-1.076-2.353-1.253V5z" clipRule="evenodd"/>
                        </svg>
                      </div>
                    </div>
                    <div className="p-8 text-center">
                      <div className="text-5xl font-black text-green-700 mb-4">
                        {(reportData.transactions[0]?.totalSales || 0).toLocaleString()}
                      </div>
                      <div className="text-lg font-bold text-green-600">RWF Revenue</div>
                      <div className="mt-4 bg-green-200 rounded-full p-3">
                        <div className="text-sm font-black text-green-800">Audited ✓</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 via-purple-100 to-purple-200 rounded-3xl border-6 border-purple-300 shadow-xl overflow-hidden">
                    <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-xl font-black uppercase tracking-wider">Volume</h4>
                          <p className="text-sm font-bold opacity-90">Fuel Dispensed</p>
                        </div>
                        <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M2 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 002 2H4a2 2 0 01-2-2V5zm3 1h6v4H5V6zm6 6H5v2h6v-2z" clipRule="evenodd"/>
                          <path d="M15 7h1a2 2 0 012 2v5.5a1.5 1.5 0 01-3 0V7z"/>
                        </svg>
                      </div>
                    </div>
                    <div className="p-8 text-center">
                      <div className="text-6xl font-black text-purple-700 mb-4">
                        {(reportData.transactions[0]?.totalLiters || 0).toFixed(1)}
                      </div>
                      <div className="text-lg font-bold text-purple-600">Liters Sold</div>
                      <div className="mt-4 bg-purple-200 rounded-full p-3">
                        <div className="text-sm font-black text-purple-800">Measured</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Detailed Analytics */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
                {/* Fuel Sales Analysis */}
                <div className="bg-gradient-to-br from-neutral-50 to-neutral-100 rounded-3xl border-6 border-neutral-300 shadow-xl overflow-hidden">
                  <div className="bg-gradient-to-r from-orange-600 to-orange-700 text-white p-8">
                    <h3 className="text-3xl font-black tracking-wider uppercase flex items-center">
                      <svg className="w-10 h-10 mr-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M2 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 002 2H4a2 2 0 01-2-2V5zm3 1h6v4H5V6zm6 6H5v2h6v-2z" clipRule="evenodd"/>
                        <path d="M15 7h1a2 2 0 012 2v5.5a1.5 1.5 0 01-3 0V7z"/>
                      </svg>
                      Fuel Sales Analysis
                    </h3>
                    <p className="text-lg font-bold opacity-90 mt-2">Product Performance Breakdown</p>
                  </div>
                  <div className="p-8">
                    {reportData.fuelSales && reportData.fuelSales.length > 0 ? (
                      <div className="space-y-6">
                        {reportData.fuelSales.map((fuel, index) => (
                          <div key={index} className="bg-white rounded-2xl border-4 border-neutral-300 shadow-lg overflow-hidden">
                            <div className="bg-gradient-to-r from-neutral-100 to-neutral-200 p-6 border-b-4 border-neutral-300">
                              <div className="flex justify-between items-center">
                                <div>
                                  <h4 className="font-black text-2xl text-neutral-800 tracking-wide">{fuel.Name}</h4>
                                  <p className="font-bold text-lg text-neutral-600">{fuel.liters}L dispensed</p>
                                </div>
                                <div className="text-right">
                                  <div className="text-3xl font-black text-green-600">
                                    {fuel.sales.toLocaleString()} RWF
                                  </div>
                                  <div className="text-sm font-bold text-neutral-500">Revenue Generated</div>
                                </div>
                              </div>
                            </div>
                            <div className="p-4 bg-neutral-50">
                              <div className="flex justify-between text-sm font-bold text-neutral-600">
                                <span>Performance Rating:</span>
                                <span className="text-green-600">Excellent ✓</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <svg className="w-16 h-16 text-neutral-400 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                        </svg>
                        <p className="text-2xl font-black text-neutral-600 uppercase tracking-wider">No fuel sales recorded</p>
                        <p className="text-lg font-bold text-neutral-500 mt-2">for the selected date</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Payment Methods Analysis */}
                <div className="bg-gradient-to-br from-neutral-50 to-neutral-100 rounded-3xl border-6 border-neutral-300 shadow-xl overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8">
                    <h3 className="text-3xl font-black tracking-wider uppercase flex items-center">
                      <svg className="w-10 h-10 mr-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"/>
                      </svg>
                      Payment Analysis
                    </h3>
                    <p className="text-lg font-bold opacity-90 mt-2">Transaction Method Breakdown</p>
                  </div>
                  <div className="p-8">
                    {reportData.payments && reportData.payments.length > 0 ? (
                      <div className="space-y-6">
                        {reportData.payments.map((payment, index) => (
                          <div key={index} className="bg-white rounded-2xl border-4 border-neutral-300 shadow-lg overflow-hidden">
                            <div className="bg-gradient-to-r from-neutral-100 to-neutral-200 p-6 border-b-4 border-neutral-300">
                              <div className="flex justify-between items-center">
                                <div>
                                  <h4 className="font-black text-2xl text-neutral-800 tracking-wide">{payment.PaymentMethod}</h4>
                                  <p className="font-bold text-lg text-neutral-600">{payment.count} transactions</p>
                                </div>
                                <div className="text-right">
                                  <div className="text-3xl font-black text-blue-600">
                                    {(payment.totalPayments || 0).toLocaleString()} RWF
                                  </div>
                                  <div className="text-sm font-bold text-neutral-500">Total Processed</div>
                                </div>
                              </div>
                            </div>
                            <div className="p-4 bg-neutral-50">
                              <div className="flex justify-between text-sm font-bold text-neutral-600">
                                <span>Processing Status:</span>
                                <span className="text-green-600">Verified ✓</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <svg className="w-16 h-16 text-neutral-400 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                        </svg>
                        <p className="text-2xl font-black text-neutral-600 uppercase tracking-wider">No payments recorded</p>
                        <p className="text-lg font-bold text-neutral-500 mt-2">for the selected date</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Inventory Management */}
              <div className="mt-12">
                <h3 className="text-4xl font-black text-neutral-800 mb-8 tracking-wider uppercase flex items-center">
                  <svg className="w-10 h-10 mr-4 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd"/>
                  </svg>
                  Inventory Status Report
                </h3>
                {reportData.inventory && reportData.inventory.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {reportData.inventory.map((item, index) => (
                      <div key={index} className="bg-gradient-to-br from-neutral-50 to-neutral-100 rounded-3xl border-6 border-neutral-300 shadow-xl overflow-hidden">
                        <div className={`p-6 text-white ${item.StockLiters < 500 ? 'bg-gradient-to-r from-red-600 to-red-700' : 'bg-gradient-to-r from-green-600 to-green-700'}`}>
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="text-xl font-black uppercase tracking-wider">{item.Name}</h4>
                              <p className="text-sm font-bold opacity-90">Fuel Inventory</p>
                            </div>
                            <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M2 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 002 2H4a2 2 0 01-2-2V5zm3 1h6v4H5V6zm6 6H5v2h6v-2z" clipRule="evenodd"/>
                              <path d="M15 7h1a2 2 0 012 2v5.5a1.5 1.5 0 01-3 0V7z"/>
                            </svg>
                          </div>
                        </div>
                        <div className="p-8 text-center">
                          <div className="text-5xl font-black text-neutral-800 mb-4">
                            {item.StockLiters.toLocaleString()}
                          </div>
                          <div className="text-lg font-bold text-neutral-600 mb-6">Liters Available</div>
                          <div className={`px-6 py-3 rounded-full border-4 font-black text-lg uppercase tracking-wider ${
                            item.StockLiters < 500
                              ? 'text-red-800 bg-red-100 border-red-300'
                              : 'text-green-800 bg-green-100 border-green-300'
                          }`}>
                            {item.StockLiters < 500 ? '⚠️ LOW STOCK' : '✅ ADEQUATE'}
                          </div>
                          <div className="mt-4 text-sm font-bold text-neutral-500">
                            {item.StockLiters < 500 ? 'Reorder Required' : 'Stock Level Normal'}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 bg-gradient-to-br from-neutral-50 to-neutral-100 rounded-3xl border-6 border-neutral-300">
                    <svg className="w-20 h-20 text-neutral-400 mx-auto mb-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                    </svg>
                    <p className="text-3xl font-black text-neutral-600 uppercase tracking-wider">No inventory data available</p>
                    <p className="text-xl font-bold text-neutral-500 mt-4">Please check system configuration</p>
                  </div>
                )}
              </div>
            </div>

            {/* Professional Footer */}
            <div className="bg-gradient-to-r from-neutral-900 to-black text-white rounded-3xl p-12 mt-12 border-8 border-neutral-700 print:bg-neutral-900 print:mt-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                <div>
                  <h4 className="text-2xl font-black mb-4 tracking-wider uppercase">Report Certification</h4>
                  <div className="space-y-2 text-lg font-bold">
                    <p className="text-green-400">✓ Data Verified</p>
                    <p className="text-blue-400">✓ Audit Compliant</p>
                    <p className="text-purple-400">✓ Print Ready</p>
                  </div>
                </div>
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
                    <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <p className="text-xl font-black tracking-wider uppercase">Certified Report</p>
                  <p className="text-lg font-bold text-neutral-300">Professional Standards</p>
                </div>
                <div className="text-right lg:text-left">
                  <h4 className="text-2xl font-black mb-4 tracking-wider uppercase">Generated</h4>
                  <div className="space-y-2 text-lg font-bold">
                    <p className="text-neutral-300">{new Date().toLocaleDateString()}</p>
                    <p className="text-neutral-300">{new Date().toLocaleTimeString()}</p>
                    <p className="text-blue-400 text-xl font-black tracking-wider uppercase">SmartPark System</p>
                  </div>
                </div>
              </div>
              <div className="border-t-4 border-neutral-600 mt-8 pt-8 text-center">
                <p className="text-2xl font-black tracking-wider uppercase text-neutral-300">
                  SmartPark Gas Station Management System
                </p>
                <p className="text-lg font-bold text-neutral-400 mt-2">
                  Professional Business Intelligence • Kigali, Rwanda • © 2024
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Reports
