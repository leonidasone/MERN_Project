import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Car, 
  Package, 
  CreditCard, 
  TrendingUp, 
  Calendar,
  DollarSign,
  Users,
  Activity,
  Plus,
  Eye
} from 'lucide-react';
import { reportsAPI } from '../services/api';

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      setLoading(true);
      const response = await reportsAPI.getSummary();
      if (response.success) {
        setSummary(response.data);
      } else {
        setError('Failed to fetch dashboard data');
      }
    } catch (error) {
      console.error('Error fetching summary:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, color, change, link }) => (
    <div className="card-ig p-6 hover:shadow-lg transition-all duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-ig-text-light">{title}</p>
          <p className="text-3xl font-bold text-ig-text mt-2">{value}</p>
          {change && (
            <p className="text-sm text-green-600 mt-1">
              <TrendingUp className="h-4 w-4 inline mr-1" />
              {change}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="h-8 w-8 text-white" />
        </div>
      </div>
      {link && (
        <div className="mt-4">
          <Link
            to={link}
            className="text-ig-primary hover:text-ig-pink text-sm font-medium flex items-center"
          >
            View details
            <Eye className="h-4 w-4 ml-1" />
          </Link>
        </div>
      )}
    </div>
  );

  const QuickActionCard = ({ title, description, icon: Icon, color, link }) => (
    <Link to={link} className="block">
      <div className="card-ig p-6 hover:shadow-lg transition-all duration-300 group">
        <div className="flex items-center space-x-4">
          <div className={`p-3 rounded-lg ${color} group-hover:scale-110 transition-transform duration-300`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-ig-text group-hover:text-ig-primary transition-colors">
              {title}
            </h3>
            <p className="text-sm text-ig-text-light">{description}</p>
          </div>
        </div>
      </div>
    </Link>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-ig-light-gray p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="spinner-ig"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ig-light-gray">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-ig-text mb-2">Dashboard</h1>
          <p className="text-ig-text-light">
            Welcome to SmartPark Car Wash Management System
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="alert-ig-error mb-6">
            {error}
          </div>
        )}

        {/* Stats Grid */}
        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Cars"
              value={summary.overview.totalCars}
              icon={Car}
              color="bg-ig-blue"
              link="/cars"
            />
            <StatCard
              title="Total Services"
              value={summary.overview.totalServices}
              icon={Activity}
              color="bg-ig-purple"
              link="/services"
            />
            <StatCard
              title="Total Revenue"
              value={`${summary.overview.totalRevenue.toLocaleString()} RWF`}
              icon={DollarSign}
              color="bg-ig-primary"
              link="/payments"
            />
            <StatCard
              title="Unpaid Services"
              value={summary.overview.unpaidServices}
              icon={CreditCard}
              color="bg-ig-orange"
              link="/services"
            />
          </div>
        )}

        {/* Today's Stats */}
        {summary && (
          <div className="card-ig p-6 mb-8">
            <h2 className="text-xl font-bold text-ig-text mb-4 flex items-center">
              <Calendar className="h-6 w-6 mr-2 text-ig-primary" />
              Today's Performance
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="text-center p-4 bg-ig-light-gray rounded-lg">
                <p className="text-2xl font-bold text-ig-primary">{summary.today.services}</p>
                <p className="text-sm text-ig-text-light">Services Today</p>
              </div>
              <div className="text-center p-4 bg-ig-light-gray rounded-lg">
                <p className="text-2xl font-bold text-ig-primary">
                  {summary.today.revenue.toLocaleString()} RWF
                </p>
                <p className="text-sm text-ig-text-light">Revenue Today</p>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-ig-text mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <QuickActionCard
              title="Add New Car"
              description="Register a new car in the system"
              icon={Plus}
              color="bg-ig-blue"
              link="/cars"
            />
            <QuickActionCard
              title="Create Service"
              description="Start a new car wash service"
              icon={Activity}
              color="bg-ig-purple"
              link="/services"
            />
            <QuickActionCard
              title="Process Payment"
              description="Record a payment for services"
              icon={CreditCard}
              color="bg-ig-primary"
              link="/payments"
            />
          </div>
        </div>

        {/* Recent Services */}
        {summary && summary.recentServices && summary.recentServices.length > 0 && (
          <div className="card-ig p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-ig-text">Recent Services</h2>
              <Link
                to="/services"
                className="text-ig-primary hover:text-ig-pink text-sm font-medium"
              >
                View all
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-ig-border">
                    <th className="text-left py-3 px-4 font-medium text-ig-text-light">Plate Number</th>
                    <th className="text-left py-3 px-4 font-medium text-ig-text-light">Driver</th>
                    <th className="text-left py-3 px-4 font-medium text-ig-text-light">Package</th>
                    <th className="text-left py-3 px-4 font-medium text-ig-text-light">Date</th>
                    <th className="text-left py-3 px-4 font-medium text-ig-text-light">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {summary.recentServices.slice(0, 5).map((service) => (
                    <tr key={service.RecordNumber} className="border-b border-ig-border hover:bg-ig-light-gray">
                      <td className="py-3 px-4 font-medium text-ig-text">{service.PlateNumber}</td>
                      <td className="py-3 px-4 text-ig-text">{service.DriverName}</td>
                      <td className="py-3 px-4 text-ig-text">{service.PackageName}</td>
                      <td className="py-3 px-4 text-ig-text-light">
                        {new Date(service.ServiceDate).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          service.AmountPaid 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {service.AmountPaid ? 'Paid' : 'Pending'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
