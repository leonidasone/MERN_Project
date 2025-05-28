import { useState, useEffect } from 'react'
import axios from 'axios'

function Tasks() {
  const [tasks, setTasks] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    Description: '',
    AssignedTo: '',
    Status: 'Pending',
    DueDate: ''
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      const response = await axios.get('/api/tasks')
      setTasks(response.data)
    } catch (error) {
      console.error('Error fetching tasks:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingId) {
        await axios.put(`/api/tasks/${editingId}`, formData)
      } else {
        await axios.post('/api/tasks', formData)
      }
      fetchTasks()
      resetForm()
    } catch (error) {
      console.error('Error saving task:', error)
    }
  }

  const handleEdit = (task) => {
    setFormData({
      Description: task.Description,
      AssignedTo: task.AssignedTo,
      Status: task.Status,
      DueDate: task.DueDate
    })
    setEditingId(task.TaskID)
    setShowForm(true)
  }

  const resetForm = () => {
    setFormData({
      Description: '',
      AssignedTo: '',
      Status: 'Pending',
      DueDate: ''
    })
    setEditingId(null)
    setShowForm(false)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'text-yellow-600 bg-yellow-100'
      case 'In Progress': return 'text-blue-600 bg-blue-100'
      case 'Completed': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getPriorityColor = (dueDate) => {
    const today = new Date()
    const due = new Date(dueDate)
    const diffDays = Math.ceil((due - today) / (1000 * 60 * 60 * 24))

    if (diffDays < 0) return 'border-red-500 bg-red-50'
    if (diffDays <= 1) return 'border-orange-500 bg-orange-50'
    if (diffDays <= 3) return 'border-yellow-500 bg-yellow-50'
    return 'border-green-500 bg-green-50'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-6xl font-black text-gray-600 uppercase tracking-wider">Loading Tasks...</div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-8">
        <div>
          <h1 className="text-8xl font-black text-gray-900 tracking-tight mb-4">STATION TASKS</h1>
          <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent tracking-wider uppercase">
            Task Management & Operations
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
          {showForm ? 'CANCEL OPERATION' : 'ADD NEW TASK'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-3xl shadow-2xl p-12 border-8 border-gray-300 hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white font-black text-3xl p-8 rounded-t-3xl border-b-8 border-blue-900 tracking-wider uppercase">
            {editingId ? 'EDIT TASK' : 'ADD NEW TASK'}
          </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-10 mt-10">
            <div className="lg:col-span-2">
              <label className="block text-2xl font-black text-gray-800 mb-6 tracking-wider uppercase">Task Description</label>
              <textarea
                className="w-full px-6 py-6 border-4 border-gray-400 rounded-2xl focus:border-blue-600 focus:ring-4 focus:ring-blue-200 focus:outline-none font-bold text-xl bg-white transition-all duration-300 hover:border-gray-500 focus:scale-105 h-32"
                value={formData.Description}
                onChange={(e) => setFormData({ ...formData, Description: e.target.value })}
                required
                placeholder="Describe the task..."
              />
            </div>
            <div>
              <label className="block text-2xl font-black text-gray-800 mb-6 tracking-wider uppercase">Assigned To</label>
              <input
                type="text"
                className="w-full px-6 py-6 border-4 border-gray-400 rounded-2xl focus:border-blue-600 focus:ring-4 focus:ring-blue-200 focus:outline-none font-bold text-xl bg-white transition-all duration-300 hover:border-gray-500 focus:scale-105"
                value={formData.AssignedTo}
                onChange={(e) => setFormData({ ...formData, AssignedTo: e.target.value })}
                required
                placeholder="Employee name"
              />
            </div>
            <div>
              <label className="block text-2xl font-black text-gray-800 mb-6 tracking-wider uppercase">Status</label>
              <select
                className="w-full px-6 py-6 border-4 border-gray-400 rounded-2xl focus:border-blue-600 focus:ring-4 focus:ring-blue-200 focus:outline-none font-bold text-xl bg-white transition-all duration-300 hover:border-gray-500 focus:scale-105"
                value={formData.Status}
                onChange={(e) => setFormData({ ...formData, Status: e.target.value })}
                required
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            <div>
              <label className="block text-2xl font-black text-gray-800 mb-6 tracking-wider uppercase">Due Date</label>
              <input
                type="date"
                className="w-full px-6 py-6 border-4 border-gray-400 rounded-2xl focus:border-blue-600 focus:ring-4 focus:ring-blue-200 focus:outline-none font-bold text-xl bg-white transition-all duration-300 hover:border-gray-500 focus:scale-105"
                value={formData.DueDate}
                onChange={(e) => setFormData({ ...formData, DueDate: e.target.value })}
                required
              />
            </div>
            <div className="lg:col-span-2 flex flex-col lg:flex-row gap-6 mt-8">
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-black py-6 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl border-4 border-green-800 text-xl tracking-wider uppercase"
              >
                {editingId ? 'UPDATE' : 'ADD'} TASK
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

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {tasks.map((task) => (
          <div key={task.TaskID} className={`bg-white rounded-3xl shadow-2xl p-8 border-8 border-gray-300 hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2 border-l-8 ${getPriorityColor(task.DueDate)}`}>
            <div className="flex justify-between items-start mb-6">
              <span className={`px-4 py-2 rounded-full text-sm font-black border-2 uppercase tracking-wide ${getStatusColor(task.Status)}`}>
                {task.Status}
              </span>
              <span className="text-lg font-black text-gray-500">#{task.TaskID}</span>
            </div>

            <h3 className="text-2xl font-black text-gray-800 mb-6 tracking-wide">{task.Description}</h3>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-black text-lg text-gray-700 uppercase tracking-wide">Assigned to:</span>
                <span className="font-bold text-lg text-blue-600">{task.AssignedTo}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-black text-lg text-gray-700 uppercase tracking-wide">Due Date:</span>
                <span className="font-bold text-lg text-gray-600">{task.DueDate}</span>
              </div>
            </div>

            <div className="mt-8">
              <button
                onClick={() => handleEdit(task)}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-black py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl border-4 border-blue-800 text-lg tracking-wider uppercase"
              >
                EDIT TASK
              </button>
            </div>
          </div>
        ))}
      </div>

      {tasks.length === 0 && (
        <div className="bg-white rounded-3xl shadow-2xl p-12 border-8 border-gray-300 text-center">
          <p className="text-3xl font-black text-gray-600 uppercase tracking-wider">No tasks found</p>
          <p className="text-xl font-bold text-gray-500 mt-4">Create your first task to get started</p>
        </div>
      )}
    </div>
  )
}

export default Tasks
