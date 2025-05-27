import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Vehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [formData, setFormData] = useState({
    PlateNumber: '',
    VehicleType: '',
    DriverName: '',
    PhoneNumber: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/vehicles');
      setVehicles(response.data);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      setError('Unable to load vehicles. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (editingVehicle) {
        await axios.put(`/api/vehicles/${editingVehicle.PlateNumber}`, {
          VehicleType: formData.VehicleType,
          DriverName: formData.DriverName,
          PhoneNumber: formData.PhoneNumber
        });
        setSuccess('Vehicle updated successfully');
      } else {
        await axios.post('/api/vehicles', formData);
        setSuccess('Vehicle created successfully');
      }

      fetchVehicles();
      resetForm();
      setShowModal(false);
    } catch (error) {
      setError(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (vehicle) => {
    setEditingVehicle(vehicle);
    setFormData({
      PlateNumber: vehicle.PlateNumber,
      VehicleType: vehicle.VehicleType,
      DriverName: vehicle.DriverName,
      PhoneNumber: vehicle.PhoneNumber || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (plateNumber) => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      try {
        await axios.delete(`/api/vehicles/${plateNumber}`);
        setSuccess('Vehicle deleted successfully');
        fetchVehicles();
      } catch (error) {
        setError(error.response?.data?.message || 'Delete failed');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      PlateNumber: '',
      VehicleType: '',
      DriverName: '',
      PhoneNumber: ''
    });
    setEditingVehicle(null);
    setError('');
    setSuccess('');
  };

  const vehicleTypes = ['Sedan', 'SUV', 'Hatchback', 'Truck', 'Van', 'Motorcycle', 'Bus', 'Other'];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flat-card flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Vehicles</h1>
          <p className="mt-2 text-gray-600">Manage vehicle registrations</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="btn-primary"
        >
          Add New Vehicle
        </button>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="alert-success">
          {success}
        </div>
      )}
      {error && (
        <div className="alert-error">
          {error}
        </div>
      )}

      {/* Vehicles Table */}
      <div className="table-flat">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Plate Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vehicle Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Driver Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {vehicles.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                    No vehicles found
                  </td>
                </tr>
              ) : (
                vehicles.map((vehicle) => (
                  <tr key={vehicle.PlateNumber} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {vehicle.PlateNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {vehicle.VehicleType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {vehicle.DriverName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {vehicle.PhoneNumber || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleEdit(vehicle)}
                        className="text-primary-600 hover:text-primary-900"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(vehicle.PlateNumber)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="form-label">Plate Number</label>
                  <input
                    type="text"
                    name="PlateNumber"
                    value={formData.PlateNumber}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                    disabled={editingVehicle}
                    placeholder="e.g., ABC-123"
                  />
                </div>

                <div>
                  <label className="form-label">Vehicle Type</label>
                  <select
                    name="VehicleType"
                    value={formData.VehicleType}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  >
                    <option value="">Select vehicle type</option>
                    {vehicleTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="form-label">Driver Name</label>
                  <input
                    type="text"
                    name="DriverName"
                    value={formData.DriverName}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                    placeholder="Enter driver's full name"
                  />
                </div>

                <div>
                  <label className="form-label">Phone Number</label>
                  <input
                    type="tel"
                    name="PhoneNumber"
                    value={formData.PhoneNumber}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="e.g., +1234567890"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    {editingVehicle ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Vehicles;
