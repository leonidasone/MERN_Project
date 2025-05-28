import { useState, useEffect } from 'react'
import axios from 'axios'

function Pumps() {
  const [pumps, setPumps] = useState([])
  const [fuelTypes, setFuelTypes] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({ PumpNumber: '', FuelTypeID: '', Status: 'Operational' })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [pumpsRes, fuelTypesRes] = await Promise.all([
        axios.get('/api/pumps'),
        axios.get('/api/fuel-types')
      ])
      setPumps(pumpsRes.data)
      setFuelTypes(fuelTypesRes.data)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingId) {
        await axios.put(`/api/pumps/${editingId}`, formData)
      } else {
        await axios.post('/api/pumps', formData)
      }
      fetchData()
      resetForm()
    } catch (error) {
      console.error('Error saving pump:', error)
    }
  }

  const handleEdit = (pump) => {
    setFormData({
      PumpNumber: pump.PumpNumber,
      FuelTypeID: pump.FuelTypeID,
      Status: pump.Status
    })
    setEditingId(pump.PumpID)
    setShowForm(true)
  }

  const resetForm = () => {
    setFormData({ PumpNumber: '', FuelTypeID: '', Status: 'Operational' })
    setEditingId(null)
    setShowForm(false)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Operational': return 'text-green-600 bg-green-100'
      case 'Down': return 'text-red-600 bg-red-100'
      case 'Maintenance': return 'text-yellow-600 bg-yellow-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-6xl font-black text-gray-600 uppercase tracking-wider">Loading Pumps...</div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-8">
        <div>
          <h1 className="text-8xl font-black text-gray-900 tracking-tight mb-4">FUEL PUMPS</h1>
          <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent tracking-wider uppercase">
            Pump Configuration & Status Management
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
          {showForm ? 'CANCEL OPERATION' : 'ADD NEW PUMP'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-3xl shadow-2xl p-12 border-8 border-gray-300 hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white font-black text-3xl p-8 rounded-t-3xl border-b-8 border-blue-900 tracking-wider uppercase">
            {editingId ? 'EDIT PUMP' : 'ADD NEW PUMP'}
          </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-10">
            <div>
              <label className="block text-2xl font-black text-gray-800 mb-6 tracking-wider uppercase">Pump Number</label>
              <input
                type="text"
                className="w-full px-6 py-6 border-4 border-gray-400 rounded-2xl focus:border-blue-600 focus:ring-4 focus:ring-blue-200 focus:outline-none font-bold text-xl bg-white transition-all duration-300 hover:border-gray-500 focus:scale-105"
                value={formData.PumpNumber}
                onChange={(e) => setFormData({ ...formData, PumpNumber: e.target.value })}
                required
                placeholder="e.g., P001"
              />
            </div>
            <div>
              <label className="block text-2xl font-black text-gray-800 mb-6 tracking-wider uppercase">Fuel Type</label>
              <select
                className="w-full px-6 py-6 border-4 border-gray-400 rounded-2xl focus:border-blue-600 focus:ring-4 focus:ring-blue-200 focus:outline-none font-bold text-xl bg-white transition-all duration-300 hover:border-gray-500 focus:scale-105"
                value={formData.FuelTypeID}
                onChange={(e) => setFormData({ ...formData, FuelTypeID: e.target.value })}
                required
              >
                <option value="">Select Fuel Type</option>
                {fuelTypes.map((fuelType) => (
                  <option key={fuelType.FuelTypeID} value={fuelType.FuelTypeID}>
                    {fuelType.Name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-2xl font-black text-gray-800 mb-6 tracking-wider uppercase">Status</label>
              <select
                className="w-full px-6 py-6 border-4 border-gray-400 rounded-2xl focus:border-blue-600 focus:ring-4 focus:ring-blue-200 focus:outline-none font-bold text-xl bg-white transition-all duration-300 hover:border-gray-500 focus:scale-105"
                value={formData.Status}
                onChange={(e) => setFormData({ ...formData, Status: e.target.value })}
                required
              >
                <option value="Operational">Operational</option>
                <option value="Down">Down</option>
                <option value="Maintenance">Maintenance</option>
              </select>
            </div>
            <div className="lg:col-span-3 flex flex-col lg:flex-row gap-6 mt-8">
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-black py-6 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl border-4 border-green-800 text-xl tracking-wider uppercase"
              >
                {editingId ? 'UPDATE' : 'ADD'} PUMP
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
        <h2 className="text-4xl font-black text-gray-800 mb-10 tracking-wider uppercase">PUMPS LIST</h2>
        {pumps.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {pumps.map((pump) => (
              <div key={pump.PumpID} className="bg-gradient-to-br from-gray-50 to-gray-100 border-4 border-gray-300 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-3xl font-black text-gray-800 tracking-wide">{pump.PumpNumber}</h3>
                  <span className={`px-4 py-2 rounded-full text-sm font-black border-2 uppercase tracking-wide ${getStatusColor(pump.Status)}`}>
                    {pump.Status}
                  </span>
                </div>
                <div className="space-y-4">
                  <p className="text-xl font-black text-gray-700 uppercase tracking-wide">
                    Fuel: <span className="text-blue-600">{pump.FuelTypeName}</span>
                  </p>
                  <div className="bg-blue-100 border-2 border-blue-300 rounded-lg p-3">
                    <p className="text-sm font-black text-blue-800 uppercase tracking-wide">ID: {pump.PumpID}</p>
                  </div>
                </div>
                <div className="mt-8">
                  <button
                    onClick={() => handleEdit(pump)}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-black py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl border-4 border-blue-800 text-lg tracking-wider uppercase"
                  >
                    EDIT PUMP
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-3xl font-black text-gray-600 uppercase tracking-wider">No pumps found</p>
            <p className="text-xl font-bold text-gray-500 mt-4">Add your first pump to get started</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Pumps
