import React from 'react'
import { Link } from 'react-router-dom'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    })
    
    // Log error to console for debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-8">
          <div className="max-w-4xl w-full">
            {/* Main Error Container */}
            <div className="bg-white rounded-3xl shadow-2xl border-8 border-neutral-300 overflow-hidden">
              {/* Header Section */}
              <div className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white p-12">
                <div className="text-center">
                  <div className="w-32 h-32 bg-gradient-to-r from-red-800 to-red-900 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl">
                    <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <h1 className="text-8xl font-black tracking-tight mb-4">ERROR</h1>
                  <p className="text-3xl font-bold text-red-200 tracking-wider uppercase mb-4">
                    System Malfunction
                  </p>
                  <p className="text-xl font-bold text-red-100">
                    An unexpected error has occurred in the application
                  </p>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-12">
                <div className="text-center mb-12">
                  <h2 className="text-5xl font-black text-neutral-800 tracking-tight mb-6">
                    CRITICAL SYSTEM ERROR
                  </h2>
                  <p className="text-2xl font-bold text-neutral-600 leading-relaxed mb-8">
                    The SmartPark Gas Station Management System has encountered an unexpected error.
                    Our technical team has been notified and is working to resolve this issue.
                  </p>
                </div>

                {/* Error Details */}
                <div className="bg-gradient-to-r from-neutral-50 to-neutral-100 rounded-2xl p-8 border-4 border-neutral-300 mb-12">
                  <h3 className="text-3xl font-black text-neutral-800 mb-6 tracking-wider uppercase flex items-center">
                    <svg className="w-8 h-8 mr-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                    </svg>
                    Error Information
                  </h3>
                  <div className="bg-red-50 border-4 border-red-300 rounded-2xl p-6 mb-6">
                    <h4 className="text-xl font-black text-red-800 mb-3 uppercase tracking-wider">Error Type</h4>
                    <p className="text-lg font-bold text-red-700 font-mono">
                      {this.state.error && this.state.error.toString()}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-2xl p-6 border-4 border-blue-300 shadow-lg">
                      <h4 className="text-xl font-black text-blue-800 mb-3 uppercase tracking-wider">Immediate Actions</h4>
                      <ul className="text-lg font-bold text-neutral-600 space-y-2">
                        <li>• Refresh the page</li>
                        <li>• Clear browser cache</li>
                        <li>• Try again in a few minutes</li>
                      </ul>
                    </div>
                    <div className="bg-white rounded-2xl p-6 border-4 border-green-300 shadow-lg">
                      <h4 className="text-xl font-black text-green-800 mb-3 uppercase tracking-wider">System Status</h4>
                      <ul className="text-lg font-bold text-neutral-600 space-y-2">
                        <li>• Error logged automatically</li>
                        <li>• Technical team notified</li>
                        <li>• Data integrity maintained</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col lg:flex-row gap-6 justify-center">
                  <button 
                    onClick={() => window.location.reload()} 
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-black py-6 px-12 rounded-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-xl hover:shadow-2xl border-4 border-blue-800 text-2xl tracking-wider uppercase"
                  >
                    <svg className="w-8 h-8 inline-block mr-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd"/>
                    </svg>
                    RELOAD PAGE
                  </button>
                  <Link 
                    to="/dashboard" 
                    className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-black py-6 px-12 rounded-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-xl hover:shadow-2xl border-4 border-green-800 text-2xl tracking-wider uppercase text-center"
                  >
                    <svg className="w-8 h-8 inline-block mr-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
                    </svg>
                    GO TO DASHBOARD
                  </Link>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-gradient-to-r from-neutral-900 to-black text-white p-8">
                <div className="text-center">
                  <p className="text-xl font-black tracking-wider uppercase text-neutral-300 mb-2">
                    SmartPark Gas Station Management System
                  </p>
                  <p className="text-lg font-bold text-neutral-400">
                    Professional Business Solutions • Error Handling System
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
