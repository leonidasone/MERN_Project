import { useState, useEffect } from 'react'
import axios from 'axios'

function Customers() {
  const [customers, setCustomers] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ Name: '', ContactInfo: '' })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCustomers()
  }, [])

  const fetchCustomers = async () => {
    try {
      const response = await axios.get('/api/customers')
      setCustomers(response.data)
    } catch (error) {
      console.error('Error fetching customers:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post('/api/customers', formData)
      fetchCustomers()
      resetForm()
    } catch (error) {
      console.error('Error saving customer:', error)
    }
  }

  const resetForm = () => {
    setFormData({ Name: '', ContactInfo: '' })
    setShowForm(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-6xl font-black text-gray-600 uppercase tracking-wider">Loading Customers...</div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-8">
        <div>
          <h1 className="text-8xl font-black text-gray-900 tracking-tight mb-4">CUSTOMERS</h1>
          <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent tracking-wider uppercase">
            Customer Database Management
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
          {showForm ? 'CANCEL OPERATION' : 'ADD NEW CUSTOMER'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-3xl shadow-2xl p-12 border-8 border-gray-300 hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white font-black text-3xl p-8 rounded-t-3xl border-b-8 border-blue-900 tracking-wider uppercase">
            ADD NEW CUSTOMER
          </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-10 mt-10">
            <div>
              <label className="block text-2xl font-black text-gray-800 mb-6 tracking-wider uppercase">
                Customer Name
              </label>
              <input
                type="text"
                className="w-full px-6 py-6 border-4 border-gray-400 rounded-2xl focus:border-blue-600 focus:ring-4 focus:ring-blue-200 focus:outline-none font-bold text-xl bg-white transition-all duration-300 hover:border-gray-500 focus:scale-105"
                value={formData.Name}
                onChange={(e) => setFormData({ ...formData, Name: e.target.value })}
                required
                placeholder="Enter customer name"
              />
            </div>
            <div>
              <label className="block text-2xl font-black text-gray-800 mb-6 tracking-wider uppercase">
                Contact Info
              </label>
              <input
                type="text"
                className="w-full px-6 py-6 border-4 border-gray-400 rounded-2xl focus:border-blue-600 focus:ring-4 focus:ring-blue-200 focus:outline-none font-bold text-xl bg-white transition-all duration-300 hover:border-gray-500 focus:scale-105"
                value={formData.ContactInfo}
                onChange={(e) => setFormData({ ...formData, ContactInfo: e.target.value })}
                required
                placeholder="Phone number or email"
              />
            </div>
            <div className="lg:col-span-2 flex flex-col lg:flex-row gap-6 mt-8">
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-black py-6 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl border-4 border-green-800 text-xl tracking-wider uppercase"
              >
                ADD CUSTOMER
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
        <h2 className="text-4xl font-black text-gray-800 mb-10 tracking-wider uppercase">CUSTOMERS DATABASE</h2>
        {customers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {customers.map((customer) => (
              <div key={customer.CustomerID} className="bg-gradient-to-br from-gray-50 to-gray-100 border-4 border-gray-300 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <h3 className="text-2xl font-black text-gray-800 mb-4 tracking-wide">{customer.Name}</h3>
                <p className="text-lg font-bold text-blue-600 mb-4">{customer.ContactInfo}</p>
                <div className="bg-blue-100 border-2 border-blue-300 rounded-lg p-3">
                  <p className="text-sm font-black text-blue-800 uppercase tracking-wide">ID: {customer.CustomerID}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-3xl font-black text-gray-600 uppercase tracking-wider">No customers found</p>
            <p className="text-xl font-bold text-gray-500 mt-4">Add your first customer to get started</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Customers
