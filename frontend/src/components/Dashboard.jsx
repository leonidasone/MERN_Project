import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  TruckIcon,
  TicketIcon,
  CheckCircleIcon,
  CurrencyDollarIcon,
  ArrowPathIcon,
  PlusIcon
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalVehicles: 0,
    activeTickets: 0,
    completedTickets: 0,
    totalRevenue: 0
  });
  const [recentTickets, setRecentTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch vehicles count
      const vehiclesResponse = await axios.get('/api/vehicles');

      // Fetch tickets
      const ticketsResponse = await axios.get('/api/tickets');
      const tickets = ticketsResponse.data;

      // Fetch payments
      const paymentsResponse = await axios.get('/api/payments');
      const payments = paymentsResponse.data;

      // Calculate stats
      const activeTickets = tickets.filter(ticket => ticket.Status === 'ACTIVE').length;
      const completedTickets = tickets.filter(ticket => ticket.Status === 'COMPLETED').length;
      const totalRevenue = payments.reduce((sum, payment) => sum + parseFloat(payment.AmountPaid), 0);

      setStats({
        totalVehicles: vehiclesResponse.data.length,
        activeTickets,
        completedTickets,
        totalRevenue
      });

      // Get recent tickets (last 5)
      setRecentTickets(tickets.slice(0, 5));

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: IconComponent, color }) => (
    <div className="stat-card">
      <div className="flex items-center">
        <div className={`flex-shrink-0 p-4 rounded-lg ${color}`}>
          <IconComponent className="w-8 h-8 text-white" />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flat-card">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-gray-700 mt-4 text-center">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flat-card">
        <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600 text-lg">Welcome to SmartPark Parking Ticket Management System</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Vehicles"
          value={stats.totalVehicles}
          icon={TruckIcon}
          color="bg-blue-500"
        />
        <StatCard
          title="Active Tickets"
          value={stats.activeTickets}
          icon={TicketIcon}
          color="bg-green-500"
        />
        <StatCard
          title="Completed Tickets"
          value={stats.completedTickets}
          icon={CheckCircleIcon}
          color="bg-yellow-500"
        />
        <StatCard
          title="Total Revenue"
          value={`₦${stats.totalRevenue.toLocaleString()}`}
          icon={CurrencyDollarIcon}
          color="bg-purple-500"
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Tickets */}
        <div className="flat-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Tickets</h2>
            <button
              onClick={fetchDashboardData}
              className="btn-secondary px-3 py-1 text-sm flex items-center"
            >
              <ArrowPathIcon className="w-4 h-4 mr-1" />
              Refresh
            </button>
          </div>

          {recentTickets.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No tickets found</p>
          ) : (
            <div className="space-y-3">
              {recentTickets.map((ticket) => (
                <div key={ticket.TicketNumber} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors duration-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">#{ticket.TicketNumber}</p>
                      <p className="text-sm text-gray-600">{ticket.PlateNumber}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(ticket.EntryTime).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        ticket.Status === 'ACTIVE'
                          ? 'badge-success'
                          : 'badge-gray'
                      }`}>
                        {ticket.Status}
                      </span>
                      {ticket.TotalFee && (
                        <p className="text-sm font-medium text-gray-900 mt-1">
                          ₦{parseFloat(ticket.TotalFee).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="flat-card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button className="w-full btn-primary text-left flex items-center justify-start">
              <TicketIcon className="w-5 h-5 mr-3" />
              Issue New Parking Ticket
            </button>
            <button className="w-full btn-secondary text-left flex items-center justify-start">
              <TruckIcon className="w-5 h-5 mr-3" />
              Register New Vehicle
            </button>
            <button className="w-full btn-info text-left flex items-center justify-start">
              <CurrencyDollarIcon className="w-5 h-5 mr-3" />
              Process Payment
            </button>
            <button className="w-full btn-success text-left flex items-center justify-start">
              <ArrowPathIcon className="w-5 h-5 mr-3" />
              Generate Report
            </button>
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="flat-card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">System Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
            <span className="text-sm text-gray-600">Database Connected</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
            <span className="text-sm text-gray-600">API Services Online</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
            <span className="text-sm text-gray-600">All Systems Operational</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
