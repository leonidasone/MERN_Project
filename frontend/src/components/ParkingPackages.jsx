import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ParkingPackages = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [formData, setFormData] = useState({
    PackageName: '',
    PackageDescription: '',
    RatePerHour: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/packages');
      setPackages(response.data);
    } catch (error) {
      console.error('Error fetching packages:', error);
      setError('Unable to load packages. Please try again.');
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
      const packageData = {
        ...formData,
        RatePerHour: parseFloat(formData.RatePerHour)
      };

      if (editingPackage) {
        await axios.put(`/api/packages/${editingPackage.PackageNumber}`, packageData);
        setSuccess('Package updated successfully');
      } else {
        await axios.post('/api/packages', packageData);
        setSuccess('Package created successfully');
      }

      fetchPackages();
      resetForm();
      setShowModal(false);
    } catch (error) {
      setError(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (pkg) => {
    setEditingPackage(pkg);
    setFormData({
      PackageName: pkg.PackageName,
      PackageDescription: pkg.PackageDescription || '',
      RatePerHour: pkg.RatePerHour.toString()
    });
    setShowModal(true);
  };

  const handleDelete = async (packageNumber) => {
    if (window.confirm('Are you sure you want to delete this package?')) {
      try {
        await axios.delete(`/api/packages/${packageNumber}`);
        setSuccess('Package deleted successfully');
        fetchPackages();
      } catch (error) {
        setError(error.response?.data?.message || 'Delete failed');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      PackageName: '',
      PackageDescription: '',
      RatePerHour: ''
    });
    setEditingPackage(null);
    setError('');
    setSuccess('');
  };

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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Parking Packages</h1>
          <p className="mt-2 text-gray-600">Manage parking rate packages</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="btn-primary"
        >
          Add New Package
        </button>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
          {success}
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {/* Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500">No packages found</p>
          </div>
        ) : (
          packages.map((pkg) => (
            <div key={pkg.PackageNumber} className="card hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{pkg.PackageName}</h3>
                  <p className="text-sm text-gray-600 mt-1">{pkg.PackageDescription}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(pkg)}
                    className="text-primary-600 hover:text-primary-900 text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(pkg.PackageNumber)}
                    className="text-red-600 hover:text-red-900 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Rate per Hour</span>
                  <span className="text-2xl font-bold text-primary-600">
                    ₦{parseFloat(pkg.RatePerHour).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                  Package #{pkg.PackageNumber}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingPackage ? 'Edit Package' : 'Add New Package'}
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="form-label">Package Name</label>
                  <input
                    type="text"
                    name="PackageName"
                    value={formData.PackageName}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                    placeholder="e.g., Hourly Parking"
                  />
                </div>

                <div>
                  <label className="form-label">Description</label>
                  <textarea
                    name="PackageDescription"
                    value={formData.PackageDescription}
                    onChange={handleInputChange}
                    className="form-input"
                    rows="3"
                    placeholder="Package description (optional)"
                  />
                </div>

                <div>
                  <label className="form-label">Rate per Hour (₦)</label>
                  <input
                    type="number"
                    name="RatePerHour"
                    value={formData.RatePerHour}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                    min="0"
                    step="0.01"
                    placeholder="e.g., 1000.00"
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
                    {editingPackage ? 'Update' : 'Create'}
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

export default ParkingPackages;
