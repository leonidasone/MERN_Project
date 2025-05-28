import { useState } from 'react'
import axios from '../api/axios'

function Login({ onLogin }) {
  const [credentials, setCredentials] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await axios.post('/api/login', credentials)
      onLogin(response.data.username)
    } catch (error) {
      setError(error.response?.data?.error || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-gray-900 to-black">
      <div className="max-w-2xl w-full mx-6">
        <div className="bg-white rounded-3xl shadow-2xl p-12 border-8 border-gray-300 hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2">
          <div className="text-center mb-12">
            <h1 className="text-8xl font-black text-gray-900 mb-6 tracking-tight">
              <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">Smart</span>Park
            </h1>
            <h2 className="text-5xl font-black text-gray-800 mb-4">GSMS</h2>
            <p className="text-2xl font-bold text-gray-600 tracking-wider uppercase">
              Gas Station Management System
            </p>
            <div className="w-32 h-3 bg-gradient-to-r from-blue-600 to-blue-800 mx-auto mt-6 rounded-full shadow-lg"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-10">
            <div>
              <label className="block text-2xl font-black text-gray-800 mb-4 tracking-wider uppercase">
                Username
              </label>
              <input
                type="text"
                className="w-full px-6 py-6 border-4 border-gray-400 rounded-2xl focus:border-blue-600 focus:ring-4 focus:ring-blue-200 focus:outline-none font-bold text-xl bg-white transition-all duration-300 hover:border-gray-500 focus:scale-105"
                value={credentials.username}
                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                required
                placeholder="Enter your username"
              />
            </div>

            <div>
              <label className="block text-2xl font-black text-gray-800 mb-4 tracking-wider uppercase">
                Password
              </label>
              <input
                type="password"
                className="w-full px-6 py-6 border-4 border-gray-400 rounded-2xl focus:border-blue-600 focus:ring-4 focus:ring-blue-200 focus:outline-none font-bold text-xl bg-white transition-all duration-300 hover:border-gray-500 focus:scale-105"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                required
                placeholder="Enter your password"
              />
            </div>

            {error && (
              <div className="bg-red-50 border-8 border-red-400 text-red-800 p-6 rounded-2xl font-bold shadow-lg">
                <p className="font-black text-xl">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className=" bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-black py-8 px-8 rounded-3xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-2xl hover:shadow-3xl border-4 border-blue-800 text-3xl tracking-wider uppercase"
            >
              {loading ? 'LOGGING IN...' : 'LOGIN'}
            </button>
          </form>



        </div>
      </div>
    </div>
  )
}

export default Login
