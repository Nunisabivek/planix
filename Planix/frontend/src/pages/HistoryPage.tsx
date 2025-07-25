import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Download, Trash2, Eye, FileText } from 'lucide-react';
import { usePlan } from '../context/PlanContext';

const HistoryPage: React.FC = () => {
  const { plans, deletePlan } = usePlan();

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this floor plan?')) {
      deletePlan(id);
    }
  };

  if (plans.length === 0) {
    return (
      <div className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
            <FileText className="h-12 w-12 text-gray-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">No Floor Plans Yet</h1>
          <p className="text-xl text-gray-600 mb-8">
            Start creating your first floor plan to see it here
          </p>
          <Link
            to="/"
            className="inline-flex items-center space-x-2 bg-teal-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-teal-700 transition-all duration-200"
          >
            <span>Create Your First Plan</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Floor Plan History</h1>
          <p className="text-gray-600">
            Manage and export your generated floor plans
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <div key={plan.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
              {/* Plan Preview */}
              <div className="bg-gray-100 p-6 h-48 relative">
                <div className="flex flex-wrap gap-2 justify-center items-center h-full">
                  {plan.rooms.slice(0, 6).map((room, index) => (
                    <div
                      key={index}
                      className={`${room.color} ${room.size} rounded-lg border-2 flex flex-col items-center justify-center text-center p-2 transform hover:scale-105 transition-transform duration-200 shadow-sm`}
                      style={{ transform: 'scale(0.7)' }}
                    >
                      <room.icon className="h-4 w-4 text-gray-600 mb-1" />
                      <span className="text-xs font-medium text-gray-700">{room.name}</span>
                    </div>
                  ))}
                  {plan.rooms.length > 6 && (
                    <div className="text-xs text-gray-500 bg-white rounded-lg p-2 shadow-sm">
                      +{plan.rooms.length - 6} more
                    </div>
                  )}
                </div>
              </div>

              {/* Plan Details */}
              <div className="p-6">
                <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(plan.createdAt)}</span>
                </div>
                
                <h3 className="font-semibold text-gray-900 mb-2 truncate">
                  {plan.description}
                </h3>
                
                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                  <span>{plan.rooms.length} rooms</span>
                  <span className="font-medium">{plan.totalArea}</span>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <Link
                    to={`/export/${plan.id}`}
                    className="flex-1 bg-teal-600 text-white text-center py-2 px-3 rounded-lg hover:bg-teal-700 transition-colors duration-200 flex items-center justify-center space-x-1"
                  >
                    <Eye className="h-4 w-4" />
                    <span>View</span>
                  </Link>
                  
                  <Link
                    to={`/export/${plan.id}`}
                    className="flex-1 bg-blue-600 text-white text-center py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center space-x-1"
                  >
                    <Download className="h-4 w-4" />
                    <span>Export</span>
                  </Link>
                  
                  <button
                    onClick={() => handleDelete(plan.id)}
                    className="bg-red-600 text-white py-2 px-3 rounded-lg hover:bg-red-700 transition-colors duration-200"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;