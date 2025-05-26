import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, FileText, Car, Package, Calendar } from 'lucide-react';
import { servicesAPI, carsAPI, packagesAPI } from '../services/api';

const Services = () => {
  const [services, setServices] = useState([]);
  const [cars, setCars] = useState([]);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({
    plateNumber: '',
    packageNumber: '',
    serviceDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [servicesRes, carsRes, packagesRes] = await Promise.all([
        servicesAPI.getAll(),
        carsAPI.getAll(),
        packagesAPI.getAll()
      ]);
      
      if (servicesRes.success) setServices(servicesRes.data);
      if (carsRes.success) setCars(carsRes.data);
      if (packagesRes.success) setPackages(packagesRes.data);
      
      if (!servicesRes.success) setError('Failed to fetch services');
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      if (editingService) {
        const response = await servicesAPI.update(editingService.RecordNumber, formData);
        if (response.success) {
          await fetchData();
          setShowModal(false);
          resetForm();
        } else {
          setError(response.message);
        }
      } else {
        const response = await servicesAPI.create(formData);
        if (response.success) {
          await fetchData();
          setShowModal(false);
          resetForm();
        } else {
          setError(response.message);
        }
      }
    } catch (error) {
      console.error('Error saving service:', error);
      setError('Failed to save service');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setFormData({
      plateNumber: service.PlateNumber,
      packageNumber: service.PackageNumber.toString(),
      serviceDate: service.ServiceDate
    });
    setShowModal(true);
  };

  const handleDelete = async (recordNumber) => {
    if (window.confirm('Are you sure you want to delete this service record?')) {
      try {
        setLoading(true);
        const response = await servicesAPI.delete(recordNumber);
        if (response.success) {
          await fetchData();
        } else {
          setError(response.message);
        }
      } catch (error) {
        console.error('Error deleting service:', error);
        setError('Failed to delete service');
      } finally {
        setLoading(false);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      plateNumber: '',
      packageNumber: '',
      serviceDate: new Date().toISOString().split('T')[0]
    });
    setEditingService(null);
  };

  const filteredServices = services.filter(service =>
    service.PlateNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.DriverName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.PackageName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-ig-light-gray p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-ig-text">Service Management</h1>
            <p className="text-ig-text-light">Track car wash service records</p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="btn-ig-gradient flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>New Service</span>
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
              placeholder="Search by plate number, driver name, or package..."
              className="input-ig pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Services Table */}
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
                    <th>Record #</th>
                    <th>Service Date</th>
                    <th>Plate Number</th>
                    <th>Driver</th>
                    <th>Car Type</th>
                    <th>Package</th>
                    <th>Price</th>
                    <th>Payment Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredServices.map((service) => (
                    <tr key={service.RecordNumber}>
                      <td className="font-medium">#{service.RecordNumber}</td>
                      <td>{new Date(service.ServiceDate).toLocaleDateString()}</td>
                      <td className="font-medium">{service.PlateNumber}</td>
                      <td>{service.DriverName}</td>
                      <td>{service.CarType}</td>
                      <td>
                        <div>
                          <div className="font-medium">{service.PackageName}</div>
                          <div className="text-xs text-ig-text-light">{service.PackageDescription}</div>
                        </div>
                      </td>
                      <td className="font-medium">{service.PackagePrice?.toLocaleString()} RWF</td>
                      <td>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          service.PaymentNumber 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {service.PaymentNumber ? 'Paid' : 'Pending'}
                        </span>
                      </td>
                      <td>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(service)}
                            className="p-2 text-ig-primary hover:bg-ig-light-gray rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(service.RecordNumber)}
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
              
              {filteredServices.length === 0 && !loading && (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-ig-text-light mx-auto mb-4" />
                  <p className="text-ig-text-light">No service records found</p>
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
                  {editingService ? 'Edit Service' : 'New Service Record'}
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="form-group-ig">
                    <label className="label-ig">Car (Plate Number)</label>
                    <select
                      className="input-ig"
                      value={formData.plateNumber}
                      onChange={(e) => setFormData({...formData, plateNumber: e.target.value})}
                      required
                    >
                      <option value="">Select a car</option>
                      {cars.map((car) => (
                        <option key={car.PlateNumber} value={car.PlateNumber}>
                          {car.PlateNumber} - {car.DriverName} ({car.CarType})
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="form-group-ig">
                    <label className="label-ig">Service Package</label>
                    <select
                      className="input-ig"
                      value={formData.packageNumber}
                      onChange={(e) => setFormData({...formData, packageNumber: e.target.value})}
                      required
                    >
                      <option value="">Select a package</option>
                      {packages.map((pkg) => (
                        <option key={pkg.PackageNumber} value={pkg.PackageNumber}>
                          {pkg.PackageName} - {pkg.PackagePrice.toLocaleString()} RWF
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="form-group-ig">
                    <label className="label-ig">Service Date</label>
                    <input
                      type="date"
                      className="input-ig"
                      value={formData.serviceDate}
                      onChange={(e) => setFormData({...formData, serviceDate: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="flex space-x-3 pt-4">
                    <button
                      type="submit"
                      className="btn-ig-primary flex-1"
                      disabled={loading}
                    >
                      {editingService ? 'Update' : 'Create'} Service
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

export default Services;
