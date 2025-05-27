import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Package, DollarSign } from 'lucide-react';
import { packagesAPI } from '../services/api';

const Packages = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [formData, setFormData] = useState({
    packageName: '',
    packageDescription: '',
    packagePrice: ''
  });

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const response = await packagesAPI.getAll();
      if (response.success) {
        setPackages(response.data);
      } else {
        setError('Failed to fetch packages');
      }
    } catch (error) {
      console.error('Error fetching packages:', error);
      setError('Failed to load packages');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      if (editingPackage) {
        const response = await packagesAPI.update(editingPackage.PackageNumber, formData);
        if (response.success) {
          await fetchPackages();
          setShowModal(false);
          resetForm();
        } else {
          setError(response.message);
        }
      } else {
        const response = await packagesAPI.create(formData);
        if (response.success) {
          await fetchPackages();
          setShowModal(false);
          resetForm();
        } else {
          setError(response.message);
        }
      }
    } catch (error) {
      console.error('Error saving package:', error);
      setError('Failed to save package');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (pkg) => {
    setEditingPackage(pkg);
    setFormData({
      packageName: pkg.PackageName,
      packageDescription: pkg.PackageDescription,
      packagePrice: pkg.PackagePrice.toString()
    });
    setShowModal(true);
  };

  const handleDelete = async (packageNumber) => {
    if (window.confirm('Are you sure you want to delete this package?')) {
      try {
        setLoading(true);
        const response = await packagesAPI.delete(packageNumber);
        if (response.success) {
          await fetchPackages();
        } else {
          setError(response.message);
        }
      } catch (error) {
        console.error('Error deleting package:', error);
        setError('Failed to delete package');
      } finally {
        setLoading(false);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      packageName: '',
      packageDescription: '',
      packagePrice: ''
    });
    setEditingPackage(null);
  };

  const filteredPackages = packages.filter(pkg =>
    pkg.PackageName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pkg.PackageDescription.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-ig-light-gray p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-ig-text">Package Management</h1>
            <p className="text-ig-text-light">Manage car wash service packages</p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="btn-ig-gradient flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Add New Package</span>
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
              placeholder="Search packages by name or description..."
              className="input-ig pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full flex items-center justify-center p-8">
              <div className="spinner-ig"></div>
            </div>
          ) : filteredPackages.length > 0 ? (
            filteredPackages.map((pkg) => (
              <div key={pkg.PackageNumber} className="card-ig p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div className="bg-ig-gradient p-3 rounded-lg">
                    <Package className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(pkg)}
                      className="p-2 text-ig-primary hover:bg-ig-light-gray rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(pkg.PackageNumber)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-ig-text mb-2">{pkg.PackageName}</h3>
                <p className="text-ig-text-light mb-4 text-sm">{pkg.PackageDescription}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-5 w-5 text-ig-primary" />
                    <span className="text-2xl font-bold text-ig-primary">
                      {pkg.PackagePrice.toLocaleString()} RWF
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <Package className="h-12 w-12 text-ig-text-light mx-auto mb-4" />
              <p className="text-ig-text-light">No packages found</p>
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
                  {editingPackage ? 'Edit Package' : 'Add New Package'}
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="form-group-ig">
                    <label className="label-ig">Package Name</label>
                    <input
                      type="text"
                      className="input-ig"
                      value={formData.packageName}
                      onChange={(e) => setFormData({...formData, packageName: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="form-group-ig">
                    <label className="label-ig">Description</label>
                    <textarea
                      className="input-ig"
                      rows="3"
                      value={formData.packageDescription}
                      onChange={(e) => setFormData({...formData, packageDescription: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="form-group-ig">
                    <label className="label-ig">Price (RWF)</label>
                    <input
                      type="number"
                      className="input-ig"
                      value={formData.packagePrice}
                      onChange={(e) => setFormData({...formData, packagePrice: e.target.value})}
                      required
                      min="0"
                      step="0.01"
                    />
                  </div>
                  
                  <div className="flex space-x-3 pt-4">
                    <button
                      type="submit"
                      className="btn-ig-primary flex-1"
                      disabled={loading}
                    >
                      {editingPackage ? 'Update' : 'Add'} Package
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

export default Packages;
