import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, CreditCard, Receipt, Eye } from 'lucide-react';
import { paymentsAPI, servicesAPI, billsAPI } from '../services/api';

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [unpaidServices, setUnpaidServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showBillModal, setShowBillModal] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);
  const [currentBill, setCurrentBill] = useState(null);
  const [formData, setFormData] = useState({
    recordNumber: '',
    amountPaid: '',
    paymentDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [paymentsRes, servicesRes] = await Promise.all([
        paymentsAPI.getAll(),
        servicesAPI.getAll()
      ]);
      
      if (paymentsRes.success) setPayments(paymentsRes.data);
      if (servicesRes.success) {
        // Filter unpaid services
        const unpaid = servicesRes.data.filter(service => !service.PaymentNumber);
        setUnpaidServices(unpaid);
      }
      
      if (!paymentsRes.success) setError('Failed to fetch payments');
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
      
      if (editingPayment) {
        const response = await paymentsAPI.update(editingPayment.PaymentNumber, formData);
        if (response.success) {
          await fetchData();
          setShowModal(false);
          resetForm();
        } else {
          setError(response.message);
        }
      } else {
        const response = await paymentsAPI.create(formData);
        if (response.success) {
          await fetchData();
          setShowModal(false);
          resetForm();
        } else {
          setError(response.message);
        }
      }
    } catch (error) {
      console.error('Error saving payment:', error);
      setError('Failed to save payment');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (payment) => {
    setEditingPayment(payment);
    setFormData({
      recordNumber: payment.RecordNumber.toString(),
      amountPaid: payment.AmountPaid.toString(),
      paymentDate: payment.PaymentDate
    });
    setShowModal(true);
  };

  const handleDelete = async (paymentNumber) => {
    if (window.confirm('Are you sure you want to delete this payment?')) {
      try {
        setLoading(true);
        const response = await paymentsAPI.delete(paymentNumber);
        if (response.success) {
          await fetchData();
        } else {
          setError(response.message);
        }
      } catch (error) {
        console.error('Error deleting payment:', error);
        setError('Failed to delete payment');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleViewBill = async (paymentNumber) => {
    try {
      setLoading(true);
      const response = await billsAPI.getByPaymentId(paymentNumber);
      if (response.success) {
        setCurrentBill(response.data);
        setShowBillModal(true);
      } else {
        setError('Failed to generate bill');
      }
    } catch (error) {
      console.error('Error generating bill:', error);
      setError('Failed to generate bill');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      recordNumber: '',
      amountPaid: '',
      paymentDate: new Date().toISOString().split('T')[0]
    });
    setEditingPayment(null);
  };

  const filteredPayments = payments.filter(payment =>
    payment.PlateNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.DriverName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.PackageName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-ig-light-gray p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-ig-text">Payment Management</h1>
            <p className="text-ig-text-light">Process and track payments for car wash services</p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="btn-ig-gradient flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Record Payment</span>
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="alert-ig-error mb-6">
            {error}
          </div>
        )}

        {/* Unpaid Services Alert */}
        {unpaidServices.length > 0 && (
          <div className="alert-ig-warning mb-6">
            <strong>{unpaidServices.length}</strong> service(s) are pending payment.
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

        {/* Payments Table */}
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
                    <th>Payment #</th>
                    <th>Payment Date</th>
                    <th>Service #</th>
                    <th>Plate Number</th>
                    <th>Driver</th>
                    <th>Package</th>
                    <th>Amount Paid</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayments.map((payment) => (
                    <tr key={payment.PaymentNumber}>
                      <td className="font-medium">#{payment.PaymentNumber}</td>
                      <td>{new Date(payment.PaymentDate).toLocaleDateString()}</td>
                      <td>#{payment.RecordNumber}</td>
                      <td className="font-medium">{payment.PlateNumber}</td>
                      <td>{payment.DriverName}</td>
                      <td>
                        <div>
                          <div className="font-medium">{payment.PackageName}</div>
                          <div className="text-xs text-ig-text-light">{payment.PackageDescription}</div>
                        </div>
                      </td>
                      <td className="font-medium text-green-600">
                        {payment.AmountPaid?.toLocaleString()} RWF
                      </td>
                      <td>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleViewBill(payment.PaymentNumber)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View Bill"
                          >
                            <Receipt className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleEdit(payment)}
                            className="p-2 text-ig-primary hover:bg-ig-light-gray rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(payment.PaymentNumber)}
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
              
              {filteredPayments.length === 0 && !loading && (
                <div className="text-center py-8">
                  <CreditCard className="h-12 w-12 text-ig-text-light mx-auto mb-4" />
                  <p className="text-ig-text-light">No payments found</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Payment Modal */}
        {showModal && (
          <div className="modal-ig">
            <div className="modal-ig-backdrop" onClick={() => setShowModal(false)}></div>
            <div className="flex items-center justify-center min-h-screen p-4">
              <div className="modal-ig-content max-w-md w-full p-6">
                <h2 className="text-xl font-bold text-ig-text mb-4">
                  {editingPayment ? 'Edit Payment' : 'Record Payment'}
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="form-group-ig">
                    <label className="label-ig">Service Record</label>
                    <select
                      className="input-ig"
                      value={formData.recordNumber}
                      onChange={(e) => {
                        const selectedService = unpaidServices.find(s => s.RecordNumber.toString() === e.target.value);
                        setFormData({
                          ...formData, 
                          recordNumber: e.target.value,
                          amountPaid: selectedService ? selectedService.PackagePrice.toString() : ''
                        });
                      }}
                      required
                      disabled={editingPayment}
                    >
                      <option value="">Select a service</option>
                      {unpaidServices.map((service) => (
                        <option key={service.RecordNumber} value={service.RecordNumber}>
                          #{service.RecordNumber} - {service.PlateNumber} ({service.PackageName})
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="form-group-ig">
                    <label className="label-ig">Amount Paid (RWF)</label>
                    <input
                      type="number"
                      className="input-ig"
                      value={formData.amountPaid}
                      onChange={(e) => setFormData({...formData, amountPaid: e.target.value})}
                      required
                      min="0"
                      step="0.01"
                    />
                  </div>
                  
                  <div className="form-group-ig">
                    <label className="label-ig">Payment Date</label>
                    <input
                      type="date"
                      className="input-ig"
                      value={formData.paymentDate}
                      onChange={(e) => setFormData({...formData, paymentDate: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="flex space-x-3 pt-4">
                    <button
                      type="submit"
                      className="btn-ig-primary flex-1"
                      disabled={loading}
                    >
                      {editingPayment ? 'Update' : 'Record'} Payment
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

        {/* Bill Modal */}
        {showBillModal && currentBill && (
          <div className="modal-ig">
            <div className="modal-ig-backdrop" onClick={() => setShowBillModal(false)}></div>
            <div className="flex items-center justify-center min-h-screen p-4">
              <div className="modal-ig-content max-w-lg w-full p-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-ig-text">Payment Receipt</h2>
                  <p className="text-ig-text-light">Bill #{currentBill.billNumber}</p>
                </div>
                
                <div className="space-y-4">
                  <div className="border-b border-ig-border pb-4">
                    <h3 className="font-bold text-ig-text mb-2">{currentBill.company.name}</h3>
                    <p className="text-sm text-ig-text-light">{currentBill.company.address}</p>
                    <p className="text-sm text-ig-text-light">{currentBill.company.phone}</p>
                  </div>
                  
                  <div className="border-b border-ig-border pb-4">
                    <h4 className="font-semibold text-ig-text mb-2">Customer Information</h4>
                    <p><strong>Name:</strong> {currentBill.customer.name}</p>
                    <p><strong>Phone:</strong> {currentBill.customer.phone}</p>
                    <p><strong>Vehicle:</strong> {currentBill.customer.plateNumber} ({currentBill.customer.carType})</p>
                  </div>
                  
                  <div className="border-b border-ig-border pb-4">
                    <h4 className="font-semibold text-ig-text mb-2">Service Details</h4>
                    <p><strong>Service:</strong> {currentBill.service.packageName}</p>
                    <p><strong>Description:</strong> {currentBill.service.packageDescription}</p>
                    <p><strong>Date:</strong> {new Date(currentBill.service.serviceDate).toLocaleDateString()}</p>
                  </div>
                  
                  <div className="bg-ig-light-gray p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">Total Amount:</span>
                      <span className="text-xl font-bold text-ig-primary">
                        {currentBill.billing.total} RWF
                      </span>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span>Payment Date:</span>
                      <span>{new Date(currentBill.payment.paymentDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-3 pt-6">
                  <button
                    onClick={() => window.print()}
                    className="btn-ig-primary flex-1"
                  >
                    Print Bill
                  </button>
                  <button
                    onClick={() => setShowBillModal(false)}
                    className="btn-ig-secondary flex-1"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Payments;
