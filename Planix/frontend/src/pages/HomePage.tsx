import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Landing page for non-authenticated users
const LandingPage: React.FC = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Create Professional Floor Plans with AI
            </h1>
            <p className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto">
              Planix uses advanced AI to generate detailed floor plans that comply with Indian building standards. 
              Get material estimates, IS code compliance, and professional architectural designs in minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="bg-white text-indigo-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold text-lg transition-colors"
              >
                Start Free Trial
              </Link>
              <Link
                to="/login"
                className="border-2 border-white text-white hover:bg-white hover:text-indigo-600 px-8 py-3 rounded-lg font-semibold text-lg transition-colors"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Planix?
            </h2>
            <p className="text-xl text-gray-600">
              Professional architectural solutions powered by AI
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-indigo-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">AI-Powered Generation</h3>
              <p className="text-gray-600">
                Advanced AI creates professional floor plans in minutes, not hours.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-indigo-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">IS Code Compliance</h3>
              <p className="text-gray-600">
                All plans comply with Indian building standards and safety regulations.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-indigo-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Material Estimates</h3>
              <p className="text-gray-600">
                Get accurate material quantities and cost estimates for your project.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600">
              Choose the plan that works best for you
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Free Plan */}
            <div className="border rounded-lg p-8 text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Free</h3>
              <div className="text-4xl font-bold text-indigo-600 mb-4">₹0</div>
              <ul className="text-gray-600 space-y-2 mb-6">
                <li>3 floor plans per month</li>
                <li>5 exports per month</li>
                <li>Basic IS code check</li>
                <li>Email support</li>
              </ul>
              <Link
                to="/register"
                className="w-full bg-gray-200 text-gray-800 hover:bg-gray-300 px-6 py-3 rounded-lg font-semibold transition-colors inline-block"
              >
                Get Started Free
              </Link>
            </div>
            
            {/* Pro Plan */}
            <div className="border border-indigo-600 rounded-lg p-8 text-center relative">
              <div className="absolute top-0 right-0 bg-indigo-600 text-white px-3 py-1 rounded-bl-lg rounded-tr-lg text-sm">
                Most Popular
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Pro</h3>
              <div className="text-4xl font-bold text-indigo-600 mb-4">₹1,599</div>
              <ul className="text-gray-600 space-y-2 mb-6">
                <li>Unlimited floor plans</li>
                <li>Unlimited exports</li>
                <li>Advanced IS code compliance</li>
                <li>Material cost estimation</li>
                <li>Priority support</li>
              </ul>
              <Link
                to="/register"
                className="w-full bg-indigo-600 text-white hover:bg-indigo-700 px-6 py-3 rounded-lg font-semibold transition-colors inline-block"
              >
                Start Pro Trial
              </Link>
            </div>
            
            {/* Enterprise Plan */}
            <div className="border rounded-lg p-8 text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Enterprise</h3>
              <div className="text-4xl font-bold text-indigo-600 mb-4">₹4,999</div>
              <ul className="text-gray-600 space-y-2 mb-6">
                <li>Everything in Pro</li>
                <li>Team collaboration</li>
                <li>API access</li>
                <li>Custom integrations</li>
                <li>Dedicated support</li>
              </ul>
              <Link
                to="/register"
                className="w-full bg-gray-200 text-gray-800 hover:bg-gray-300 px-6 py-3 rounded-lg font-semibold transition-colors inline-block"
              >
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-indigo-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Create Your First Floor Plan?
          </h2>
          <p className="text-xl text-indigo-200 mb-8">
            Join thousands of architects and designers using Planix
          </p>
          <Link
            to="/register"
            className="bg-white text-indigo-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold text-lg transition-colors inline-block"
          >
            Start Free Trial
          </Link>
        </div>
      </div>
    </div>
  );
};

// Floor plan generation form for authenticated users
const FloorPlanGenerator: React.FC = () => {
  const [formData, setFormData] = useState({
    description: '',
    area: '',
    rooms: '',
    bathrooms: '',
    location: '',
    budget: '',
    features: [] as string[],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { user, token } = useAuth();

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8001/api';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFeatureToggle = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`${API_URL}/floor-plans`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description: formData.description,
          area: formData.area ? parseFloat(formData.area) : undefined,
          rooms: formData.rooms ? parseInt(formData.rooms) : undefined,
          bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : undefined,
          location: formData.location,
          budget: formData.budget ? parseFloat(formData.budget) : undefined,
          features: formData.features,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to generate floor plan');
      }

      const data = await response.json();
      setSuccess('Floor plan generation started! Check your dashboard for updates.');
      
      // Reset form
      setFormData({
        description: '',
        area: '',
        rooms: '',
        bathrooms: '',
        location: '',
        budget: '',
        features: [],
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate floor plan');
    } finally {
      setLoading(false);
    }
  };

  const features = [
    'open_kitchen',
    'balcony',
    'garden',
    'parking',
    'swimming_pool',
    'terrace',
    'study_room',
    'prayer_room',
    'guest_room',
    'storage_room',
    'master_suite',
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Generate Your Floor Plan
          </h1>
          <p className="text-xl text-gray-600">
            Describe your dream space and let AI create the perfect floor plan
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Project Description *
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Describe your ideal floor plan (e.g., 3 bedroom house with open kitchen and master suite)"
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            {/* Basic Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="area" className="block text-sm font-medium text-gray-700 mb-2">
                  Total Area (sq ft) *
                </label>
                <input
                  type="number"
                  id="area"
                  name="area"
                  required
                  min="100"
                  max="10000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="1200"
                  value={formData.area}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Mumbai, Maharashtra"
                  value={formData.location}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="rooms" className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Rooms *
                </label>
                <input
                  type="number"
                  id="rooms"
                  name="rooms"
                  required
                  min="1"
                  max="20"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="3"
                  value={formData.rooms}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Bathrooms *
                </label>
                <input
                  type="number"
                  id="bathrooms"
                  name="bathrooms"
                  required
                  min="1"
                  max="10"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="2"
                  value={formData.bathrooms}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Budget */}
            <div>
              <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-2">
                Budget (Optional)
              </label>
              <input
                type="number"
                id="budget"
                name="budget"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="2000000"
                value={formData.budget}
                onChange={handleChange}
              />
            </div>

            {/* Features */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Special Features
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {features.map((feature) => (
                  <label key={feature} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.features.includes(feature)}
                      onChange={() => handleFeatureToggle(feature)}
                      className="mr-2 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700 capitalize">
                      {feature.replace('_', ' ')}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Error/Success Messages */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 rounded-md p-4">
                <p className="text-sm text-green-800">{success}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 px-6 rounded-md font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating Floor Plan...
                </span>
              ) : (
                'Generate Floor Plan'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const HomePage: React.FC = () => {
  const { user } = useAuth();

  return user ? <FloorPlanGenerator /> : <LandingPage />;
};

export default HomePage;