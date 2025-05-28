import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-8">
      <div className="max-w-4xl w-full">
        {/* Main 404 Container */}
        <div className="bg-white rounded-3xl shadow-2xl border-8 border-neutral-300 overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-neutral-900 via-neutral-800 to-black text-white p-12">
            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-r from-red-500 to-red-700 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl">
                <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                </svg>
              </div>
              <h1 className="text-8xl font-black tracking-tight mb-4">404</h1>
              <p className="text-3xl font-bold text-red-400 tracking-wider uppercase mb-4">
                Page Not Found
              </p>
              <p className="text-xl font-bold text-neutral-300">
                The requested resource could not be located
              </p>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-12">
            <div className="text-center mb-12">
              <h2 className="text-5xl font-black text-neutral-800 tracking-tight mb-6">
                OOPS! SOMETHING WENT WRONG
              </h2>
              <p className="text-2xl font-bold text-neutral-600 leading-relaxed mb-8">
                The page you're looking for doesn't exist in the SmartPark Gas Station Management System.
                This could be due to a mistyped URL, an outdated link, or the page may have been moved or deleted.
              </p>
            </div>

            {/* Error Details */}
            <div className="bg-gradient-to-r from-neutral-50 to-neutral-100 rounded-2xl p-8 border-4 border-neutral-300 mb-12">
              <h3 className="text-3xl font-black text-neutral-800 mb-6 tracking-wider uppercase flex items-center">
                <svg className="w-8 h-8 mr-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
                </svg>
                Possible Solutions
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl p-6 border-4 border-blue-300 shadow-lg">
                  <h4 className="text-xl font-black text-blue-800 mb-3 uppercase tracking-wider">Check URL</h4>
                  <p className="text-lg font-bold text-neutral-600">
                    Verify the web address is spelled correctly and try again.
                  </p>
                </div>
                <div className="bg-white rounded-2xl p-6 border-4 border-green-300 shadow-lg">
                  <h4 className="text-xl font-black text-green-800 mb-3 uppercase tracking-wider">Use Navigation</h4>
                  <p className="text-lg font-bold text-neutral-600">
                    Navigate using the main menu to find what you're looking for.
                  </p>
                </div>
                <div className="bg-white rounded-2xl p-6 border-4 border-purple-300 shadow-lg">
                  <h4 className="text-xl font-black text-purple-800 mb-3 uppercase tracking-wider">Go Back</h4>
                  <p className="text-lg font-bold text-neutral-600">
                    Return to the previous page using your browser's back button.
                  </p>
                </div>
                <div className="bg-white rounded-2xl p-6 border-4 border-orange-300 shadow-lg">
                  <h4 className="text-xl font-black text-orange-800 mb-3 uppercase tracking-wider">Start Fresh</h4>
                  <p className="text-lg font-bold text-neutral-600">
                    Go to the dashboard and begin your workflow from there.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col lg:flex-row gap-6 justify-center">
              <Link 
                to="/dashboard" 
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-black py-6 px-12 rounded-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-xl hover:shadow-2xl border-4 border-blue-800 text-2xl tracking-wider uppercase text-center"
              >
                <svg className="w-8 h-8 inline-block mr-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
                </svg>
                GO TO DASHBOARD
              </Link>
              <button 
                onClick={() => window.history.back()} 
                className="bg-gradient-to-r from-neutral-600 to-neutral-700 hover:from-neutral-700 hover:to-neutral-800 text-white font-black py-6 px-12 rounded-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-xl hover:shadow-2xl border-4 border-neutral-800 text-2xl tracking-wider uppercase"
              >
                <svg className="w-8 h-8 inline-block mr-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd"/>
                </svg>
                GO BACK
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gradient-to-r from-neutral-900 to-black text-white p-8">
            <div className="text-center">
              <p className="text-xl font-black tracking-wider uppercase text-neutral-300 mb-2">
                SmartPark Gas Station Management System
              </p>
              <p className="text-lg font-bold text-neutral-400">
                Professional Business Solutions • Error Code: 404
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotFound
