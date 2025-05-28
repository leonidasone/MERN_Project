import { useState, useEffect } from 'react'
import axios from 'axios'

function Inventory() {
  const [inventory, setInventory] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [editStock, setEditStock] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchInventory()
  }, [])

  const fetchInventory = async () => {
    try {
      const response = await axios.get('/api/inventory')
      setInventory(response.data)
    } catch (error) {
      console.error('Error fetching inventory:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async (id) => {
    try {
      await axios.put(`/api/inventory/${id}`, { StockLiters: editStock })
      fetchInventory()
      setEditingId(null)
      setEditStock('')
    } catch (error) {
      console.error('Error updating inventory:', error)
    }
  }

  const startEdit = (item) => {
    setEditingId(item.InventoryID)
    setEditStock(item.StockLiters)
  }

  const getStockStatus = (stock) => {
    if (stock < 500) return 'text-red-600 bg-red-100'
    if (stock < 1000) return 'text-yellow-600 bg-yellow-100'
    return 'text-green-600 bg-green-100'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-6xl font-black text-gray-600 uppercase tracking-wider">Loading Inventory...</div>
      </div>
    )
  }

  return (
    <div className="space-y-8 ">
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-8">
        <div>
          <h1 className="text-8xl font-black text-gray-900 tracking-tight mb-4">INVENTORY</h1>
          <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent tracking-wider uppercase">
            Fuel Stock & Inventory Management
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {inventory.map((item) => (
          <div key={item.InventoryID} className="bg-white rounded-3xl shadow-2xl p-8 border-8 border-gray-300 hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-3xl font-black text-gray-800 tracking-wide">{item.FuelTypeName}</h3>
              <span className={`px-4 py-2 rounded-full text-sm font-black border-2 uppercase tracking-wide ${getStockStatus(item.StockLiters)}`}>
                {item.StockLiters < 500 ? 'LOW' : item.StockLiters < 1000 ? 'MEDIUM' : 'GOOD'}
              </span>
            </div>

            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <span className="font-black text-xl text-gray-700 uppercase tracking-wide">Current Stock:</span>
                {editingId === item.InventoryID ? (
                  <input
                    type="number"
                    step="0.01"
                    value={editStock}
                    onChange={(e) => setEditStock(e.target.value)}
                    className="w-32 px-4 py-2 border-4 border-blue-400 rounded-xl font-bold text-lg focus:border-blue-600 focus:ring-4 focus:ring-blue-200 focus:outline-none"
                  />
                ) : (
                  <span className="font-black text-3xl text-blue-600">
                    {item.StockLiters.toLocaleString()}L
                  </span>
                )}
              </div>

              <div className="flex justify-between items-center">
                <span className="font-black text-xl text-gray-700 uppercase tracking-wide">Price per Liter:</span>
                <span className="font-black text-2xl text-green-600">
                  {item.PricePerLiter.toLocaleString()} RWF
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="font-black text-xl text-gray-700 uppercase tracking-wide">Last Updated:</span>
                <span className="font-bold text-lg text-gray-600">{item.LastUpdated}</span>
              </div>
            </div>

            <div className="mt-8">
              {editingId === item.InventoryID ? (
                <div className="flex flex-col gap-4">
                  <button
                    onClick={() => handleUpdate(item.InventoryID)}
                    className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-black py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl border-4 border-green-800 text-lg tracking-wider uppercase"
                  >
                    SAVE CHANGES
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="w-full bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-black py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl border-4 border-gray-800 text-lg tracking-wider uppercase"
                  >
                    CANCEL
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => startEdit(item)}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-black py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl border-4 border-blue-800 text-lg tracking-wider uppercase"
                >
                  UPDATE STOCK
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-3xl shadow-2xl p-12 border-8 border-gray-300 hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2">
        <h2 className="text-4xl font-black text-gray-800 mb-10 tracking-wider uppercase">INVENTORY SUMMARY</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl border-4 border-blue-300">
            <p className="text-6xl font-black text-blue-600 mb-4">
              {inventory.reduce((sum, item) => sum + parseFloat(item.StockLiters), 0).toLocaleString()}L
            </p>
            <p className="font-black text-xl text-gray-700 uppercase tracking-wide">Total Stock</p>
          </div>
          <div className="text-center bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-2xl border-4 border-green-300">
            <p className="text-6xl font-black text-green-600 mb-4">
              {inventory.length}
            </p>
            <p className="font-black text-xl text-gray-700 uppercase tracking-wide">Fuel Types</p>
          </div>
          <div className="text-center bg-gradient-to-br from-red-50 to-red-100 p-8 rounded-2xl border-4 border-red-300">
            <p className="text-6xl font-black text-red-600 mb-4">
              {inventory.filter(item => item.StockLiters < 500).length}
            </p>
            <p className="font-black text-xl text-gray-700 uppercase tracking-wide">Low Stock Alerts</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Inventory
