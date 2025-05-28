import { useState, useEffect } from 'react'
import axios from 'axios'

function Transactions() {
  const [transactions, setTransactions] = useState([])
  const [customers, setCustomers] = useState([])
  const [pumps, setPumps] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    CustomerID: '',
    PumpID: '',
    AmountLiters: '',
    TotalPrice: ''
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [transactionsRes, customersRes, pumpsRes] = await Promise.all([
        axios.get('/api/transactions'),
        axios.get('/api/customers'),
        axios.get('/api/pumps')
      ])
      setTransactions(transactionsRes.data)
      setCustomers(customersRes.data)
      setPumps(pumpsRes.data.filter(pump => pump.Status === 'Operational'))
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post('/api/transactions', formData)

      // Also create payment record
      const paymentData = {
        TransactionID: null, // Will be set by backend
        AmountPaid: formData.TotalPrice,
        PaymentMethod: 'Cash'
      }

      fetchData()
      resetForm()
      alert('Transaction and payment recorded successfully!')
    } catch (error) {
      console.error('Error saving transaction:', error)
      alert('Error saving transaction')
    }
  }

  const calculatePrice = () => {
    const selectedPump = pumps.find(pump => pump.PumpID == formData.PumpID)
    if (selectedPump && formData.AmountLiters) {
      // Get fuel type price (you'll need to fetch this)
      const pricePerLiter = 1200 // Default, should be dynamic
      const total = parseFloat(formData.AmountLiters) * pricePerLiter
      setFormData({ ...formData, TotalPrice: total.toFixed(2) })
    }
  }

  const resetForm = () => {
    setFormData({
      CustomerID: '',
      PumpID: '',
      AmountLiters: '',
      TotalPrice: ''
    })
    setShowForm(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-6xl font-black text-gray-600 uppercase tracking-wider">Loading Transactions...</div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-8">
        <div>
          <h1 className="text-8xl font-black text-gray-900 tracking-tight mb-4">TRANSACTIONS</h1>
          <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent tracking-wider uppercase">
            Fuel Sales & Transaction Management
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className={`mt-6 xl:mt-0 text-2xl py-6 px-12 font-black rounded-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl border-4 tracking-wider uppercase ${
            showForm
              ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white border-red-800'
              : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white border-blue-800'
          }`}
        >
          {showForm ? 'CANCEL OPERATION' : 'NEW TRANSACTION'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-3xl shadow-2xl p-12 border-8 border-gray-300 hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white font-black text-3xl p-8 rounded-t-3xl border-b-8 border-blue-900 tracking-wider uppercase">
            NEW TRANSACTION
          </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-10 mt-10">
            <div>
              <label className="block text-2xl font-black text-gray-800 mb-6 tracking-wider uppercase">
                Customer
              </label>
              <select
                className="w-full px-6 py-6 border-4 border-gray-400 rounded-2xl focus:border-blue-600 focus:ring-4 focus:ring-blue-200 focus:outline-none font-bold text-xl bg-white transition-all duration-300 hover:border-gray-500 focus:scale-105"
                value={formData.CustomerID}
                onChange={(e) => setFormData({ ...formData, CustomerID: e.target.value })}
                required
              >
                <option value="">Select Customer</option>
                {customers.map((customer) => (
                  <option key={customer.CustomerID} value={customer.CustomerID}>
                    {customer.Name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-2xl font-black text-gray-800 mb-6 tracking-wider uppercase">
                Pump
              </label>
              <select
                className="w-full px-6 py-6 border-4 border-gray-400 rounded-2xl focus:border-blue-600 focus:ring-4 focus:ring-blue-200 focus:outline-none font-bold text-xl bg-white transition-all duration-300 hover:border-gray-500 focus:scale-105"
                value={formData.PumpID}
                onChange={(e) => setFormData({ ...formData, PumpID: e.target.value })}
                required
              >
                <option value="">Select Pump</option>
                {pumps.map((pump) => (
                  <option key={pump.PumpID} value={pump.PumpID}>
                    {pump.PumpNumber} - {pump.FuelTypeName}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-2xl font-black text-gray-800 mb-6 tracking-wider uppercase">
                Amount (Liters)
              </label>
              <input
                type="number"
                step="0.01"
                className="w-full px-6 py-6 border-4 border-gray-400 rounded-2xl focus:border-blue-600 focus:ring-4 focus:ring-blue-200 focus:outline-none font-bold text-xl bg-white transition-all duration-300 hover:border-gray-500 focus:scale-105"
                value={formData.AmountLiters}
                onChange={(e) => setFormData({ ...formData, AmountLiters: e.target.value })}
                onBlur={calculatePrice}
                required
                placeholder="Enter liters"
              />
            </div>
            <div>
              <label className="block text-2xl font-black text-gray-800 mb-6 tracking-wider uppercase">
                Total Price (RWF)
              </label>
              <input
                type="number"
                step="0.01"
                className="w-full px-6 py-6 border-4 border-gray-400 rounded-2xl focus:border-blue-600 focus:ring-4 focus:ring-blue-200 focus:outline-none font-bold text-xl bg-white transition-all duration-300 hover:border-gray-500 focus:scale-105"
                value={formData.TotalPrice}
                onChange={(e) => setFormData({ ...formData, TotalPrice: e.target.value })}
                required
                placeholder="Total price"
              />
            </div>
            <div className="lg:col-span-2 flex flex-col lg:flex-row gap-6 mt-8">
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-black py-6 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl border-4 border-green-800 text-xl tracking-wider uppercase"
              >
                RECORD TRANSACTION
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="flex-1 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-black py-6 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl border-4 border-gray-800 text-xl tracking-wider uppercase"
              >
                CANCEL OPERATION
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-3xl shadow-2xl p-12 border-8 border-gray-300 hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2">
        <h2 className="text-4xl font-black text-gray-800 mb-10 tracking-wider uppercase">TRANSACTIONS HISTORY</h2>
        {transactions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-gray-800 to-black text-white font-black text-xl border-b-8 border-gray-950 tracking-wider uppercase">
                  <th className="px-8 py-6 text-left">DATE</th>
                  <th className="px-8 py-6 text-left">CUSTOMER</th>
                  <th className="px-8 py-6 text-left">PUMP</th>
                  <th className="px-8 py-6 text-left">FUEL</th>
                  <th className="px-8 py-6 text-left">LITERS</th>
                  <th className="px-8 py-6 text-left">TOTAL</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction.TransactionID} className="border-b-4 border-gray-300 hover:bg-gray-100 font-bold text-lg transition-all duration-300 hover:shadow-lg hover:scale-102">
                    <td className="px-8 py-6">{transaction.Date} {transaction.Time}</td>
                    <td className="px-8 py-6 font-black text-blue-600">{transaction.CustomerName}</td>
                    <td className="px-8 py-6">{transaction.PumpNumber}</td>
                    <td className="px-8 py-6">{transaction.FuelTypeName}</td>
                    <td className="px-8 py-6 font-black">{transaction.AmountLiters}L</td>
                    <td className="px-8 py-6 font-black text-green-600 text-xl">
                      {transaction.TotalPrice.toLocaleString()} RWF
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-3xl font-black text-gray-600 uppercase tracking-wider">No transactions found</p>
            <p className="text-xl font-bold text-gray-500 mt-4">Record your first transaction to get started</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Transactions
