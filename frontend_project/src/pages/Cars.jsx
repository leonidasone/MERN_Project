import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Car, Phone, User } from 'lucide-react';
import { carsAPI } from '../services/api';

const Cars = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCar, setEditingCar] = useState(null);
  const [formData, setFormData] = useState({
    plateNumber: '',
    carType: '',
    carSize: '',
    driverName: '',
    phoneNumber: ''
  });

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      setLoading(true);
      const response = await carsAPI.getAll();
      if (response.success) {
        setCars(response.data);
      } else {
        setError('Failed to fetch cars');
      }
    } catch (error) {
      console.error('Error fetching cars:', error);
      setError('Failed to load cars');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      if (editingCar) {
        const response = await carsAPI.update(editingCar.PlateNumber, formData);
        if (response.success) {
          await fetchCars();
          setShowModal(false);
          resetForm();
        } else {
          setError(response.message);
        }
      } else {
        const response = await carsAPI.create(formData);
        if (response.success) {
          await fetchCars();
          setShowModal(false);
          resetForm();
        } else {
          setError(response.message);
        }
      }
    } catch (error) {
      console.error('Error saving car:', error);
      setError('Failed to save car');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (car) => {
    setEditingCar(car);
    setFormData({
      plateNumber: car.PlateNumber,
      carType: car.CarType,
      carSize: car.CarSize,
      driverName: car.DriverName,
      phoneNumber: car.PhoneNumber
    });
    setShowModal(true);
  };

  const handleDelete = async (plateNumber) => {
    if (window.confirm('Are you sure you want to delete this car?')) {
      try {
        setLoading(true);
        const response = await carsAPI.delete(plateNumber);
        if (response.success) {
          await fetchCars();
        } else {
          setError(response.message);
        }
      } catch (error) {
        console.error('Error deleting car:', error);
        setError('Failed to delete car');
      } finally {
        setLoading(false);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      plateNumber: '',
      carType: '',
      carSize: '',
      driverName: '',
      phoneNumber: ''
    });
    setEditingCar(null);
  };

  const filteredCars = cars.filter(car =>
    car.PlateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    car.DriverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    car.CarType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-ig-light-gray p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-ig-text">Cars Management</h1>
            <p className="text-ig-text-light">Manage registered cars in the system</p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="btn-ig-gradient flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Add New Car</span>
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="alert-ig-error mb-6">
            {error}
          </div>
        )}

        {/* Search */}
        <div className="card-ig p-6 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-ig-text-light" />
            <input
              type="text"
              placeholder="Search cars by plate number, driver name, or car type..."
              className="input-ig pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Cars Table */}
        <div className="card-ig overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <div className="spinner-ig"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table-ig">
                <thead>
                  <tr>
                    <th>Plate Number</th>
                    <th>Car Type</th>
                    <th>Car Size</th>
                    <th>Driver Name</th>
                    <th>Phone Number</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCars.map((car) => (
                    <tr key={car.PlateNumber}>
                      <td className="font-medium">{car.PlateNumber}</td>
                      <td>{car.CarType}</td>
                      <td>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          car.CarSize === 'Large' ? 'bg-red-100 text-red-800' :
                          car.CarSize === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {car.CarSize}
                        </span>
                      </td>
                      <td>{car.DriverName}</td>
                      <td>{car.PhoneNumber}</td>
                      <td>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(car)}
                            className="p-2 text-ig-primary hover:bg-ig-light-gray rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(car.PlateNumber)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {filteredCars.length === 0 && !loading && (
                <div className="text-center py-8">
                  <Car className="h-12 w-12 text-ig-text-light mx-auto mb-4" />
                  <p className="text-ig-text-light">No cars found</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="modal-ig">
            <div className="modal-ig-backdrop" onClick={() => setShowModal(false)}></div>
            <div className="flex items-center justify-center min-h-screen p-4">
              <div className="modal-ig-content max-w-md w-full p-6">
                <h2 className="text-xl font-bold text-ig-text mb-4">
                  {editingCar ? 'Edit Car' : 'Add New Car'}
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="form-group-ig">
                    <label className="label-ig">Plate Number</label>
                    <input
                      type="text"
                      className="input-ig"
                      value={formData.plateNumber}
                      onChange={(e) => setFormData({...formData, plateNumber: e.target.value})}
                      required
                      disabled={editingCar}
                    />
                  </div>
                  
                  <div className="form-group-ig">
                    <label className="label-ig">Car Type</label>
                    <input
                      type="text"
                      className="input-ig"
                      value={formData.carType}
                      onChange={(e) => setFormData({...formData, carType: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="form-group-ig">
                    <label className="label-ig">Car Size</label>
                    <select
                      className="input-ig"
                      value={formData.carSize}
                      onChange={(e) => setFormData({...formData, carSize: e.target.value})}
                      required
                    >
                      <option value="">Select size</option>
                      <option value="Small">Small</option>
                      <option value="Medium">Medium</option>
                      <option value="Large">Large</option>
                    </select>
                  </div>
                  
                  <div className="form-group-ig">
                    <label className="label-ig">Driver Name</label>
                    <input
                      type="text"
                      className="input-ig"
                      value={formData.driverName}
                      onChange={(e) => setFormData({...formData, driverName: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="form-group-ig">
                    <label className="label-ig">Phone Number</label>
                    <input
                      type="tel"
                      className="input-ig"
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="flex space-x-3 pt-4">
                    <button
                      type="submit"
                      className="btn-ig-primary flex-1"
                      disabled={loading}
                    >
                      {editingCar ? 'Update' : 'Add'} Car
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="btn-ig-secondary flex-1"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cars;
