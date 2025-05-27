import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  CreditCardIcon,
  PrinterIcon,
  XMarkIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [completedTickets, setCompletedTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState(null);
  const [formData, setFormData] = useState({
    TicketNumber: '',
    AmountPaid: '',
    PaymentMethod: 'CASH'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [paymentsRes, ticketsRes] = await Promise.all([
        axios.get('/api/payments'),
        axios.get('/api/tickets')
      ]);

      setPayments(paymentsRes.data);

      // Filter completed tickets that don't have payments yet
      const paidTicketNumbers = paymentsRes.data.map(p => p.TicketNumber);
      const unpaidCompletedTickets = ticketsRes.data.filter(
        ticket => ticket.Status === 'COMPLETED' && !paidTicketNumbers.includes(ticket.TicketNumber)
      );
      setCompletedTickets(unpaidCompletedTickets);

    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Unable to load payment data. Please try again.');
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
      const paymentData = {
        ...formData,
        AmountPaid: parseFloat(formData.AmountPaid)
      };

      const response = await axios.post('/api/payments', paymentData);

      // Get ticket details for receipt
      const ticketResponse = await axios.get(`/api/tickets/${formData.TicketNumber}`);

      setReceiptData({
        payment: { ...paymentData, PaymentNumber: response.data.paymentNumber },
        ticket: ticketResponse.data
      });

      setSuccess('Payment processed successfully');
      fetchData();
      resetForm();
      setShowModal(false);
      setShowReceipt(true);

    } catch (error) {
      setError(error.response?.data?.message || 'Payment failed');
    }
  };

  const resetForm = () => {
    setFormData({
      TicketNumber: '',
      AmountPaid: '',
      PaymentMethod: 'CASH'
    });
    setError('');
    setSuccess('');
  };

  const handleTicketSelect = (ticketNumber) => {
    const selectedTicket = completedTickets.find(t => t.TicketNumber.toString() === ticketNumber);
    if (selectedTicket) {
      setFormData({
        ...formData,
        TicketNumber: ticketNumber,
        AmountPaid: selectedTicket.TotalFee.toString()
      });
    }
  };

  const printReceipt = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flat-card">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-gray-700 mt-4 text-center">Loading payments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flat-card flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Payments</h1>
          <p className="mt-2 text-gray-600">Process payments and generate receipts</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="btn-primary flex items-center"
          disabled={completedTickets.length === 0}
        >
          <CreditCardIcon className="w-5 h-5 mr-2" />
          Process Payment
        </button>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="alert-success flex items-center">
          <CheckCircleIcon className="w-5 h-5 mr-2" />
          {success}
        </div>
      )}
      {error && (
        <div className="alert-error flex items-center">
          <ExclamationTriangleIcon className="w-5 h-5 mr-2" />
          {error}
        </div>
      )}

      {/* Unpaid Tickets Alert */}
      {completedTickets.length > 0 && (
        <div className="alert-warning flex items-center">
          <ExclamationTriangleIcon className="w-5 h-5 mr-2" />
          <div>
            <p className="font-medium">Pending Payments</p>
            <p className="text-sm">There are {completedTickets.length} completed tickets awaiting payment.</p>
          </div>
        </div>
      )}

      {/* Completed Tickets Awaiting Payment */}
      {completedTickets.length > 0 && (
        <div className="table-flat">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Completed Tickets Awaiting Payment</h2>
          </div>
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
                    Driver
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Fee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {completedTickets.map((ticket) => (
                  <tr key={ticket.TicketNumber} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{ticket.TicketNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {ticket.PlateNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {ticket.DriverName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {ticket.Duration} hours
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ₦{parseFloat(ticket.TotalFee).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => {
                          handleTicketSelect(ticket.TicketNumber.toString());
                          setShowModal(true);
                        }}
                        className="btn-primary text-xs py-1 px-3"
                      >
                        Pay Now
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Payments Table */}
      <div className="table-flat">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Payment History</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment #
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ticket #
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vehicle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Method
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {payments.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    No payments found
                  </td>
                </tr>
              ) : (
                payments.map((payment) => (
                  <tr key={payment.PaymentNumber} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{payment.PaymentNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      #{payment.TicketNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {payment.PlateNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ₦{parseFloat(payment.AmountPaid).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="badge-primary">
                        {payment.PaymentMethod}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(payment.PaymentDate).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                  <CreditCardIcon className="w-5 h-5 mr-2" />
                  Process Payment
                </h3>
                <button
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="form-label">Completed Ticket</label>
                  <select
                    name="TicketNumber"
                    value={formData.TicketNumber}
                    onChange={(e) => {
                      handleInputChange(e);
                      handleTicketSelect(e.target.value);
                    }}
                    className="form-input"
                    required
                  >
                    <option value="">Select ticket</option>
                    {completedTickets.map(ticket => (
                      <option key={ticket.TicketNumber} value={ticket.TicketNumber}>
                        #{ticket.TicketNumber} - {ticket.PlateNumber} (₦{parseFloat(ticket.TotalFee).toLocaleString()})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="form-label">Amount Paid (₦)</label>
                  <input
                    type="number"
                    name="AmountPaid"
                    value={formData.AmountPaid}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="form-label">Payment Method</label>
                  <select
                    name="PaymentMethod"
                    value={formData.PaymentMethod}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  >
                    <option value="CASH">Cash</option>
                    <option value="CARD">Card</option>
                    <option value="MOBILE">Mobile Payment</option>
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
                    Process Payment
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Receipt Modal */}
      {showReceipt && receiptData && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="text-center mb-6">
                <div className="flex justify-center mb-2">
                  <div className="bg-green-500 p-3 rounded-full">
                    <CheckCircleIcon className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h2 className="text-xl font-bold text-gray-900">SmartPark PTMS</h2>
                <p className="text-sm text-gray-600">Payment Receipt</p>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Receipt #:</span>
                  <span className="font-medium">#{receiptData.payment.PaymentNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span>Ticket #:</span>
                  <span className="font-medium">#{receiptData.ticket.TicketNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span>Vehicle:</span>
                  <span className="font-medium">{receiptData.ticket.PlateNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span>Driver:</span>
                  <span className="font-medium">{receiptData.ticket.DriverName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Package:</span>
                  <span className="font-medium">{receiptData.ticket.PackageName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Duration:</span>
                  <span className="font-medium">{receiptData.ticket.Duration} hours</span>
                </div>
                <div className="flex justify-between">
                  <span>Payment Method:</span>
                  <span className="font-medium">{receiptData.payment.PaymentMethod}</span>
                </div>
                <hr className="my-3" />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total Paid:</span>
                  <span>₦{parseFloat(receiptData.payment.AmountPaid).toLocaleString()}</span>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-6">
                <button
                  onClick={printReceipt}
                  className="btn-secondary flex items-center"
                >
                  <PrinterIcon className="w-4 h-4 mr-2" />
                  Print
                </button>
                <button
                  onClick={() => setShowReceipt(false)}
                  className="btn-primary flex items-center"
                >
                  <XMarkIcon className="w-4 h-4 mr-2" />
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payments;
