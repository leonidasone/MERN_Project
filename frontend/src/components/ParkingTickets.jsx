import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ParkingTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    PlateNumber: '',
    PackageNumber: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [ticketsRes, vehiclesRes, packagesRes] = await Promise.all([
        axios.get('/api/tickets'),
        axios.get('/api/vehicles'),
        axios.get('/api/packages')
      ]);

      setTickets(ticketsRes.data);
      setVehicles(vehiclesRes.data);
      setPackages(packagesRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Unable to load data. Please try again.');
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
      await axios.post('/api/tickets', formData);
      setSuccess('Parking ticket created successfully');
      fetchData();
      resetForm();
      setShowModal(false);
    } catch (error) {
      setError(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleCompleteTicket = async (ticketNumber) => {
    if (window.confirm('Complete this parking ticket and calculate the fee?')) {
      try {
        const response = await axios.put(`/api/tickets/${ticketNumber}/complete`);
        setSuccess(`Ticket completed. Fee: ₦${response.data.totalFee.toLocaleString()}`);
        fetchData();
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to complete ticket');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      PlateNumber: '',
      PackageNumber: ''
    });
    setError('');
    setSuccess('');
  };

  const filteredTickets = tickets.filter(ticket => {
    if (filter === 'ALL') return true;
    return ticket.Status === filter;
  });

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
          <h1 className="text-3xl font-bold text-gray-900">Parking Tickets</h1>
          <p className="mt-2 text-gray-600">Manage parking tickets and fees</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="btn-primary"
        >
          Issue New Ticket
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

      {/* Filter Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {['ALL', 'ACTIVE', 'COMPLETED'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                filter === status
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {status} ({status === 'ALL' ? tickets.length : tickets.filter(t => t.Status === status).length})
            </button>
          ))}
        </nav>
      </div>

      {/* Tickets Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ticket #
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vehicle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Package
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Entry Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTickets.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
                    No tickets found
                  </td>
                </tr>
              ) : (
                filteredTickets.map((ticket) => (
                  <tr key={ticket.TicketNumber} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{ticket.TicketNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{ticket.PlateNumber}</div>
                      <div className="text-sm text-gray-500">{ticket.VehicleType}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {ticket.PackageName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(ticket.EntryTime).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {ticket.Duration ? `${ticket.Duration} hours` : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {ticket.TotalFee ? `₦${parseFloat(ticket.TotalFee).toLocaleString()}` : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        ticket.Status === 'ACTIVE'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {ticket.Status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {ticket.Status === 'ACTIVE' && (
                        <button
                          onClick={() => handleCompleteTicket(ticket.TicketNumber)}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          Complete
                        </button>
                      )}
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
                Issue New Parking Ticket
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="form-label">Vehicle</label>
                  <select
                    name="PlateNumber"
                    value={formData.PlateNumber}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  >
                    <option value="">Select vehicle</option>
                    {vehicles.map(vehicle => (
                      <option key={vehicle.PlateNumber} value={vehicle.PlateNumber}>
                        {vehicle.PlateNumber} - {vehicle.DriverName} ({vehicle.VehicleType})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="form-label">Parking Package</label>
                  <select
                    name="PackageNumber"
                    value={formData.PackageNumber}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  >
                    <option value="">Select package</option>
                    {packages.map(pkg => (
                      <option key={pkg.PackageNumber} value={pkg.PackageNumber}>
                        {pkg.PackageName} - ₦{parseFloat(pkg.RatePerHour).toLocaleString()}/hour
                      </option>
                    ))}
                  </select>
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
                    Issue Ticket
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

export default ParkingTickets;
