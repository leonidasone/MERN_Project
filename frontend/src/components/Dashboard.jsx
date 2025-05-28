import { useState, useEffect } from 'react'
import axios from 'axios'

function Dashboard() {
  const [stats, setStats] = useState({
    todayTransactions: 0,
    todaySales: 0,
    totalLiters: 0,
    pendingTasks: 0
  })
  const [recentTransactions, setRecentTransactions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [reportRes, transactionsRes, tasksRes] = await Promise.all([
        axios.get('/api/report/daily'),
        axios.get('/api/transactions'),
        axios.get('/api/tasks')
      ])

      const report = reportRes.data
      const transactions = transactionsRes.data
      const tasks = tasksRes.data

      setStats({
        todayTransactions: report.transactions[0]?.count || 0,
        todaySales: report.transactions[0]?.totalSales || 0,
        totalLiters: report.transactions[0]?.totalLiters || 0,
        pendingTasks: tasks.filter(task => task.Status === 'Pending').length
      })

      setRecentTransactions(transactions.slice(0, 5))
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-30">
        <div className="text-2xl font-black text-gray-600">Loading Dashboard...</div>
      </div>
    )
  }

  return (
    <div className="space-y-8 bg-neutral-50 min-h-screen p-8 rounded-3xl">
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-8">
        <div>
          <h1 className="text-8xl font-black text-neutral-900 tracking-tight mb-4">DASHBOARD</h1>
          <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent tracking-wider uppercase">
            Gas Station Control Center
          </p>
        </div>
        <div className="mt-6 xl:mt-0 text-right">
          <p className="text-4xl font-black text-gray-800 tracking-wide">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric'
            })}
          </p>
          <p className="text-2xl font-bold text-gray-600">
            {new Date().getFullYear()}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white p-8 rounded-3xl shadow-2xl border-8 border-white/20 transform hover:scale-105 transition-all duration-500">
          <h3 className="text-2xl font-black mb-6 tracking-wider uppercase">Today's Transactions</h3>
          <p className="text-8xl font-black mb-4">{stats.todayTransactions}</p>
          <p className="text-xl font-bold opacity-90 uppercase tracking-wide">Total Count</p>
        </div>

        <div className="bg-gradient-to-br from-green-600 to-green-800 text-white p-8 rounded-3xl shadow-2xl border-8 border-white/20 transform hover:scale-105 transition-all duration-500">
          <h3 className="text-2xl font-black mb-6 tracking-wider uppercase">Today's Sales</h3>
          <p className="text-6xl font-black mb-4">{stats.todaySales.toLocaleString()}</p>
          <p className="text-xl font-bold opacity-90 uppercase tracking-wide">RWF Revenue</p>
        </div>

        <div className="bg-gradient-to-br from-purple-600 to-purple-800 text-white p-8 rounded-3xl shadow-2xl border-8 border-white/20 transform hover:scale-105 transition-all duration-500">
          <h3 className="text-2xl font-black mb-6 tracking-wider uppercase">Total Liters</h3>
          <p className="text-8xl font-black mb-4">{stats.totalLiters.toFixed(1)}</p>
          <p className="text-xl font-bold opacity-90 uppercase tracking-wide">Liters Sold</p>
        </div>

        <div className="bg-gradient-to-br from-red-600 to-red-800 text-white p-8 rounded-3xl shadow-2xl border-8 border-white/20 transform hover:scale-105 transition-all duration-500">
          <h3 className="text-2xl font-black mb-6 tracking-wider uppercase">Pending Tasks</h3>
          <p className="text-8xl font-black mb-4">{stats.pendingTasks}</p>
          <p className="text-xl font-bold opacity-90 uppercase tracking-wide">Action Required</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card">
          <h2 className="text-2xl font-black text-gray-800 mb-6">RECENT TRANSACTIONS</h2>
          {recentTransactions.length > 0 ? (
            <div className="space-y-3">
              {recentTransactions.map((transaction) => (
                <div key={transaction.TransactionID} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
                  <div>
                    <p className="font-bold text-gray-800">{transaction.CustomerName}</p>
                    <p className="text-sm font-semibold text-gray-600">{transaction.FuelTypeName} - {transaction.PumpNumber}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-lg text-green-600">{transaction.TotalPrice.toLocaleString()} RWF</p>
                    <p className="text-sm font-semibold text-gray-600">{transaction.AmountLiters}L</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 font-semibold">No transactions today</p>
          )}
        </div>

        <div className="card">
          <h2 className="text-2xl font-black text-gray-800 mb-6">QUICK ACTIONS</h2>
          <div className="grid grid-cols-1 gap-4">
            <button className="btn-primary text-left">
              NEW TRANSACTION
            </button>
            <button className="btn-secondary text-left">
              ADD CUSTOMER
            </button>
            <button className="btn-success text-left">
              UPDATE INVENTORY
            </button>
            <button className="btn-danger text-left">
              VIEW REPORTS
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
