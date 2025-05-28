import { Link, useLocation } from 'react-router-dom'

function Layout({ children, username, onLogout }) {
  const location = useLocation()

  const navigation = [
    { name: 'DASHBOARD', path: '/' },
    { name: 'FUEL TYPES', path: '/fuel-types' },
    { name: 'PUMPS', path: '/pumps' },
    { name: 'CUSTOMERS', path: '/customers' },
    { name: 'TRANSACTIONS', path: '/transactions' },
    { name: 'PAYMENTS', path: '/payments' },
    { name: 'INVENTORY', path: '/inventory' },
    { name: 'TASKS', path: '/tasks' },
    { name: 'REPORTS', path: '/reports' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-gray-900 shadow-xl border-b-4 border-blue-600">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-8">
              <h1 className="text-3xl font-black text-white">SmartPark GSMS</h1>
              <div className="hidden md:flex space-x-1">
                {navigation.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors duration-200 ${
                      location.pathname === item.path
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-white font-bold">Welcome, {username}</span>
              <button
                onClick={onLogout}
                className="btn-danger text-sm"
              >
                LOGOUT
              </button>
            </div>
          </div>
        </div>

        <div className="md:hidden bg-gray-800 px-4 py-2">
          <div className="grid grid-cols-3 gap-2">
            {navigation.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-lg font-bold text-xs text-center transition-colors duration-200 ${
                  location.pathname === item.path
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
}

export default Layout
