import { useState, useEffect } from 'react'
import axios from 'axios'

function FuelTypes() {
  const [fuelTypes, setFuelTypes] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({ Name: '', PricePerLiter: '' })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFuelTypes()
  }, [])

  const fetchFuelTypes = async () => {
    try {
      const response = await axios.get('/api/fuel-types')
      setFuelTypes(response.data)
    } catch (error) {
      console.error('Error fetching fuel types:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingId) {
        await axios.put(`/api/fuel-types/${editingId}`, formData)
      } else {
        await axios.post('/api/fuel-types', formData)
      }
      fetchFuelTypes()
      resetForm()
    } catch (error) {
      console.error('Error saving fuel type:', error)
    }
  }

  const handleEdit = (fuelType) => {
    setFormData({ Name: fuelType.Name, PricePerLiter: fuelType.PricePerLiter })
    setEditingId(fuelType.FuelTypeID)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this fuel type?')) {
      try {
        await axios.delete(`/api/fuel-types/${id}`)
        fetchFuelTypes()
      } catch (error) {
        console.error('Error deleting fuel type:', error)
      }
    }
  }

  const resetForm = () => {
    setFormData({ Name: '', PricePerLiter: '' })
    setEditingId(null)
    setShowForm(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-6xl font-black text-gray-600 uppercase tracking-wider">Loading Fuel Types...</div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-8">
        <div>
          <h1 className="text-8xl font-black text-gray-900 tracking-tight mb-4">FUEL TYPES</h1>
          <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent tracking-wider uppercase">
            Manage Fuel Pricing & Types
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
          {showForm ? 'CANCEL OPERATION' : 'ADD NEW FUEL TYPE'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-3xl shadow-2xl p-12 border-8 border-gray-300 hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white font-black text-3xl p-8 rounded-t-3xl border-b-8 border-blue-900 tracking-wider uppercase">
            {editingId ? 'EDIT FUEL TYPE' : 'ADD NEW FUEL TYPE'}
          </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-10 mt-10">
            <div>
              <label className="block text-2xl font-black text-gray-800 mb-6 tracking-wider uppercase">
                Fuel Name
              </label>
              <input
                type="text"
                className="w-full px-6 py-6 border-4 border-gray-400 rounded-2xl focus:border-blue-600 focus:ring-4 focus:ring-blue-200 focus:outline-none font-bold text-xl bg-white transition-all duration-300 hover:border-gray-500 focus:scale-105"
                value={formData.Name}
                onChange={(e) => setFormData({ ...formData, Name: e.target.value })}
                required
                placeholder="e.g., Gasoline, Diesel"
              />
            </div>
            <div>
              <label className="block text-2xl font-black text-gray-800 mb-6 tracking-wider uppercase">
                Price per Liter (RWF)
              </label>
              <input
                type="number"
                step="0.01"
                className="w-full px-6 py-6 border-4 border-gray-400 rounded-2xl focus:border-blue-600 focus:ring-4 focus:ring-blue-200 focus:outline-none font-bold text-xl bg-white transition-all duration-300 hover:border-gray-500 focus:scale-105"
                value={formData.PricePerLiter}
                onChange={(e) => setFormData({ ...formData, PricePerLiter: e.target.value })}
                required
                placeholder="e.g., 1200.00"
              />
            </div>
            <div className="lg:col-span-2 flex flex-col lg:flex-row gap-6 mt-8">
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-black py-6 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl border-4 border-green-800 text-xl tracking-wider uppercase"
              >
                {editingId ? 'UPDATE FUEL TYPE' : 'ADD FUEL TYPE'}
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
        <h2 className="text-4xl font-black text-gray-800 mb-10 tracking-wider uppercase">FUEL TYPES LIST</h2>
        {fuelTypes.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-gray-800 to-black text-white font-black text-xl border-b-8 border-gray-950 tracking-wider uppercase">
                  <th className="px-8 py-6 text-left">ID</th>
                  <th className="px-8 py-6 text-left">FUEL NAME</th>
                  <th className="px-8 py-6 text-left">PRICE PER LITER</th>
                  <th className="px-8 py-6 text-left">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {fuelTypes.map((fuelType) => (
                  <tr key={fuelType.FuelTypeID} className="border-b-4 border-gray-300 hover:bg-gray-100 font-bold text-lg transition-all duration-300 hover:shadow-lg hover:scale-102">
                    <td className="px-8 py-6 font-black text-xl">{fuelType.FuelTypeID}</td>
                    <td className="px-8 py-6 font-black text-2xl text-blue-600">{fuelType.Name}</td>
                    <td className="px-8 py-6 font-black text-2xl text-green-600">
                      {fuelType.PricePerLiter.toLocaleString()} RWF
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col sm:flex-row gap-3">
                        <button
                          onClick={() => handleEdit(fuelType)}
                          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-black py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl border-3 border-blue-800 text-sm tracking-wider uppercase"
                        >
                          EDIT
                        </button>
                        <button
                          onClick={() => handleDelete(fuelType.FuelTypeID)}
                          className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-black py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl border-3 border-red-800 text-sm tracking-wider uppercase"
                        >
                          DELETE
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-3xl font-black text-gray-600 uppercase tracking-wider">No fuel types found</p>
            <p className="text-xl font-bold text-gray-500 mt-4">Add your first fuel type to get started</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default FuelTypes
