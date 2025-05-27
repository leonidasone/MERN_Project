import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  ChartBarIcon,
  TruckIcon,
  ArchiveBoxIcon,
  TicketIcon,
  CreditCardIcon,
  DocumentChartBarIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: ChartBarIcon },
    { name: 'Vehicles', href: '/vehicles', icon: TruckIcon },
    { name: 'Packages', href: '/packages', icon: ArchiveBoxIcon },
    { name: 'Tickets', href: '/tickets', icon: TicketIcon },
    { name: 'Payments', href: '/payments', icon: CreditCardIcon },
    { name: 'Reports', href: '/reports', icon: DocumentChartBarIcon },
  ];

  const isActive = (href) => location.pathname === href;

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="navbar-flat sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <div className="bg-blue-500 p-2 rounded-lg">
                <DocumentTextIcon className="w-6 h-6 text-white" />
              </div>
              <span className="ml-3 text-xl font-bold text-gray-900">SmartPark</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navigation.map((item) => {
                const IconComponent = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200 ${
                      isActive(item.href)
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                  >
                    <IconComponent className="w-4 h-4 mr-2" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* User Menu */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                Welcome, <span className="font-medium text-gray-900">{user?.fullName || user?.username}</span>
              </span>
              <span className="badge-primary">
                {user?.role}
              </span>
              <button
                onClick={handleLogout}
                className="btn-secondary px-4 py-2 text-sm flex items-center"
              >
                <ArrowRightOnRectangleIcon className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="sm:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="bg-gray-100 hover:bg-gray-200 p-2 rounded-lg text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
            >
              <Bars3Icon className={`${isOpen ? 'hidden' : 'block'} h-6 w-6`} />
              <XMarkIcon className={`${isOpen ? 'block' : 'hidden'} h-6 w-6`} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isOpen ? 'block' : 'hidden'} sm:hidden bg-white border-t border-gray-200`}>
        <div className="pt-2 pb-3 space-y-1">
          {navigation.map((item) => {
            const IconComponent = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-4 py-3 text-base font-medium transition-colors duration-200 ${
                  isActive(item.href)
                    ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
                onClick={() => setIsOpen(false)}
              >
                <IconComponent className="w-5 h-5 mr-3" />
                {item.name}
              </Link>
            );
          })}
        </div>
        <div className="pt-4 pb-3 border-t border-gray-200">
          <div className="flex items-center px-4">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                <span className="text-sm font-medium text-white">
                  {user?.fullName?.charAt(0) || user?.username?.charAt(0)}
                </span>
              </div>
            </div>
            <div className="ml-3">
              <div className="text-base font-medium text-gray-800">{user?.fullName || user?.username}</div>
              <div className="text-sm text-gray-500">{user?.role}</div>
            </div>
          </div>
          <div className="mt-3 px-4">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors duration-200"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
