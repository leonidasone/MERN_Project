import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import axios from 'axios'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import FuelTypes from './components/FuelTypes'
import Pumps from './components/Pumps'
import Customers from './components/Customers'
import Transactions from './components/Transactions'
import Payments from './components/Payments'
import Inventory from './components/Inventory'
import Tasks from './components/Tasks'
import Reports from './components/Reports'
import NotFound from './components/NotFound'
import Layout from './components/Layout'

axios.defaults.baseURL = 'http://localhost:5000'
axios.defaults.withCredentials = true

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState('')

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await axios.get('/api/auth/check')
      setIsAuthenticated(response.data.authenticated)
      setUsername(response.data.username || '')
    } catch (error) {
      setIsAuthenticated(false)
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = (user) => {
    setIsAuthenticated(true)
    setUsername(user)
  }

  const handleLogout = async () => {
    try {
      await axios.post('/api/logout')
      setIsAuthenticated(false)
      setUsername('')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-32 w-32 border-8 border-blue-600 border-t-transparent mb-8"></div>
          <div className="text-4xl font-black text-gray-800 uppercase tracking-wider">Loading SmartPark GSMS...</div>
          <div className="text-xl font-bold text-gray-600 mt-4">Professional Gas Station Management</div>
        </div>
      </div>
    )
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        {!isAuthenticated ? (
          <Login onLogin={handleLogin} />
        ) : (
          <Layout username={username} onLogout={handleLogout}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/fuel-types" element={<FuelTypes />} />
              <Route path="/pumps" element={<Pumps />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/payments" element={<Payments />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        )}
      </div>
    </Router>
  )
}

export default App
