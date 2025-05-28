import { useState, useEffect } from 'react'
import axios from 'axios'

function Payments() {
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [customers, setCustomers] = useState([])
  const [transactions, setTransactions] = useState([])
  const [formData, setFormData] = useState({
    TransactionID: '',
    CustomerID: '',
    AmountPaid: '',
    PaymentMethod: '',
    PaymentDate: new Date().toISOString().split('T')[0]
  })

  useEffect(() => {
    fetchPayments()
    fetchCustomers()
    fetchTransactions()
  }, [])

  const fetchPayments = async () => {
    try {
      const response = await axios.get('/api/payments')
      setPayments(response.data)
    } catch (error) {
      console.error('Error fetching payments:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCustomers = async () => {
    try {
      const response = await axios.get('/api/customers')
      setCustomers(response.data)
    } catch (error) {
      console.error('Error fetching customers:', error)
    }
  }

  const fetchTransactions = async () => {
    try {
      const response = await axios.get('/api/transactions')
      setTransactions(response.data)
    } catch (error) {
      console.error('Error fetching transactions:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post('/api/payments', formData)
      alert('Payment recorded successfully!')
      setShowForm(false)
      resetForm()
      fetchPayments() // Refresh the payments list
    } catch (error) {
      console.error('Error recording payment:', error)
      alert('Error recording payment: ' + (error.response?.data?.message || error.message))
    }
  }

  const resetForm = () => {
    setFormData({
      TransactionID: '',
      CustomerID: '',
      AmountPaid: '',
      PaymentMethod: '',
      PaymentDate: new Date().toISOString().split('T')[0]
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-6xl font-black text-gray-600 uppercase tracking-wider">Loading Payments...</div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-8">
        <div>
          <h1 className="text-8xl font-black text-gray-900 tracking-tight mb-4">PAYMENTS</h1>
          <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent tracking-wider uppercase">
            Payment Processing & History
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
          {showForm ? 'CANCEL OPERATION' : 'RECORD PAYMENT'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-3xl shadow-2xl p-12 border-8 border-gray-300 hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white font-black text-3xl p-8 rounded-t-3xl border-b-8 border-blue-900 tracking-wider uppercase">
            RECORD NEW PAYMENT
          </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-10 mt-10">
            <div>
              <label className="block text-2xl font-black text-gray-800 mb-6 tracking-wider uppercase">
                Transaction
              </label>
              <select
                className="w-full px-6 py-6 border-4 border-gray-400 rounded-2xl focus:border-blue-600 focus:ring-4 focus:ring-blue-200 focus:outline-none font-bold text-xl bg-white transition-all duration-300 hover:border-gray-500 focus:scale-105"
                value={formData.TransactionID}
                onChange={(e) => setFormData({ ...formData, TransactionID: e.target.value })}
                required
              >
                <option value="">Select Transaction</option>
                {transactions.map((transaction) => (
                  <option key={transaction.TransactionID} value={transaction.TransactionID}>
                    Transaction #{transaction.TransactionID} - {transaction.CustomerName} - {transaction.TotalPrice} RWF
                  </option>
                ))}
              </select>
            </div>
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
                    {customer.Name} - {customer.ContactInfo}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-2xl font-black text-gray-800 mb-6 tracking-wider uppercase">
                Amount Paid (RWF)
              </label>
              <input
                type="number"
                step="0.01"
                className="w-full px-6 py-6 border-4 border-gray-400 rounded-2xl focus:border-blue-600 focus:ring-4 focus:ring-blue-200 focus:outline-none font-bold text-xl bg-white transition-all duration-300 hover:border-gray-500 focus:scale-105"
                value={formData.AmountPaid}
                onChange={(e) => setFormData({ ...formData, AmountPaid: e.target.value })}
                required
                placeholder="Enter amount paid"
              />
            </div>
            <div>
              <label className="block text-2xl font-black text-gray-800 mb-6 tracking-wider uppercase">
                Payment Method
              </label>
              <select
                className="w-full px-6 py-6 border-4 border-gray-400 rounded-2xl focus:border-blue-600 focus:ring-4 focus:ring-blue-200 focus:outline-none font-bold text-xl bg-white transition-all duration-300 hover:border-gray-500 focus:scale-105"
                value={formData.PaymentMethod}
                onChange={(e) => setFormData({ ...formData, PaymentMethod: e.target.value })}
                required
              >
                <option value="">Select Payment Method</option>
                <option value="Cash">Cash</option>
                <option value="Card">Card</option>
                <option value="Mobile Money">Mobile Money</option>
                <option value="Bank Transfer">Bank Transfer</option>
              </select>
            </div>
            <div>
              <label className="block text-2xl font-black text-gray-800 mb-6 tracking-wider uppercase">
                Payment Date
              </label>
              <input
                type="date"
                className="w-full px-6 py-6 border-4 border-gray-400 rounded-2xl focus:border-blue-600 focus:ring-4 focus:ring-blue-200 focus:outline-none font-bold text-xl bg-white transition-all duration-300 hover:border-gray-500 focus:scale-105"
                value={formData.PaymentDate}
                onChange={(e) => setFormData({ ...formData, PaymentDate: e.target.value })}
                required
              />
            </div>
            <div className="lg:col-span-2 flex flex-col lg:flex-row gap-6 mt-8">
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-black py-6 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl border-4 border-green-800 text-xl tracking-wider uppercase"
              >
                RECORD PAYMENT
              </button>
              <button
                type="button"
                onClick={() => { setShowForm(false); resetForm(); }}
                className="flex-1 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-black py-6 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl border-4 border-gray-800 text-xl tracking-wider uppercase"
              >
                CANCEL OPERATION
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-3xl shadow-2xl p-12 border-8 border-gray-300 hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2">
        <h2 className="text-4xl font-black text-gray-800 mb-10 tracking-wider uppercase">PAYMENT HISTORY</h2>
        {payments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-gray-800 to-black text-white font-black text-xl border-b-8 border-gray-950 tracking-wider uppercase">
                  <th className="px-8 py-6 text-left">DATE</th>
                  <th className="px-8 py-6 text-left">CUSTOMER</th>
                  <th className="px-8 py-6 text-left">AMOUNT</th>
                  <th className="px-8 py-6 text-left">METHOD</th>
                  <th className="px-8 py-6 text-left">TRANSACTION TOTAL</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment.PaymentID} className="border-b-4 border-gray-300 hover:bg-gray-100 font-bold text-lg transition-all duration-300 hover:shadow-lg hover:scale-102">
                    <td className="px-8 py-6">{payment.PaymentDate}</td>
                    <td className="px-8 py-6 font-black text-blue-600">{payment.CustomerName}</td>
                    <td className="px-8 py-6 font-black text-green-600 text-xl">
                      {payment.AmountPaid.toLocaleString()} RWF
                    </td>
                    <td className="px-8 py-6">
                      <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-black border-2 border-blue-300 uppercase tracking-wide">
                        {payment.PaymentMethod}
                      </span>
                    </td>
                    <td className="px-8 py-6 font-bold text-lg">
                      {payment.TotalPrice?.toLocaleString()} RWF
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-3xl font-black text-gray-600 uppercase tracking-wider">No payments found</p>
            <p className="text-xl font-bold text-gray-500 mt-4">Payment history will appear here</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Payments
