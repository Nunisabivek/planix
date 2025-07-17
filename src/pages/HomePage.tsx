import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, Bed, Bath, Car, Utensils, ChefHat, Sofa, Sparkles, ArrowRight } from 'lucide-react';
import { usePlan } from '../context/PlanContext';
import { FloorPlan, Room } from '../context/PlanContext';

const HomePage: React.FC = () => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { addPlan, subscription } = usePlan();
  const navigate = useNavigate();

  const generateMockFloorPlan = (description: string): FloorPlan => {
    const rooms: Room[] = [];
    const roomTypes = {
      bedroom: { icon: Bed, color: 'bg-blue-100 border-blue-300', size: 'w-24 h-16' },
      bathroom: { icon: Bath, color: 'bg-teal-100 border-teal-300', size: 'w-16 h-12' },
      kitchen: { icon: ChefHat, color: 'bg-orange-100 border-orange-300', size: 'w-20 h-16' },
      living: { icon: Sofa, color: 'bg-green-100 border-green-300', size: 'w-28 h-20' },
      garage: { icon: Car, color: 'bg-gray-100 border-gray-300', size: 'w-24 h-20' }
    };

    // Extract room information from description
    const bedroomMatch = description.match(/(\d+)\s*bedroom/i);
    const bathroomMatch = description.match(/(\d+)\s*bathroom/i);
    const hasKitchen = /kitchen/i.test(description);
    const hasLiving = /living/i.test(description);
    const hasGarage = /garage/i.test(description);

    if (bedroomMatch) {
      const count = parseInt(bedroomMatch[1]);
      for (let i = 0; i < count; i++) {
        rooms.push({
          name: `Bedroom ${i + 1}`,
          type: 'bedroom',
          dimensions: `12' x 10'`,
          area: '120 sq ft',
          ...roomTypes.bedroom
        });
      }
    }

    if (bathroomMatch) {
      const count = parseInt(bathroomMatch[1]);
      for (let i = 0; i < count; i++) {
        rooms.push({
          name: `Bathroom ${i + 1}`,
          type: 'bathroom',
          dimensions: `8' x 6'`,
          area: '48 sq ft',
          ...roomTypes.bathroom
        });
      }
    }

    if (hasKitchen) {
      rooms.push({
        name: 'Kitchen',
        type: 'kitchen',
        dimensions: `10' x 12'`,
        area: '120 sq ft',
        ...roomTypes.kitchen
      });
    }

    if (hasLiving) {
      rooms.push({
        name: 'Living Room',
        type: 'living',
        dimensions: `16' x 14'`,
        area: '224 sq ft',
        ...roomTypes.living
      });
    }

    if (hasGarage) {
      rooms.push({
        name: 'Garage',
        type: 'garage',
        dimensions: `20' x 10'`,
        area: '200 sq ft',
        ...roomTypes.garage
      });
    }

    // Add default rooms if none specified
    if (rooms.length === 0) {
      rooms.push(
        {
          name: 'Living Room',
          type: 'living',
          dimensions: `16' x 14'`,
          area: '224 sq ft',
          ...roomTypes.living
        },
        {
          name: 'Kitchen',
          type: 'kitchen',
          dimensions: `10' x 12'`,
          area: '120 sq ft',
          ...roomTypes.kitchen
        },
        {
          name: 'Bedroom',
          type: 'bedroom',
          dimensions: `12' x 10'`,
          area: '120 sq ft',
          ...roomTypes.bedroom
        },
        {
          name: 'Bathroom',
          type: 'bathroom',
          dimensions: `8' x 6'`,
          area: '48 sq ft',
          ...roomTypes.bathroom
        }
      );
    }

    return {
      id: Date.now().toString(),
      name: `Floor Plan ${Date.now()}`,
      description,
      rooms,
      totalArea: rooms.reduce((sum, room) => sum + parseInt(room.area), 0) + ' sq ft',
      createdAt: new Date(),
      exportFormats: ['DXF', 'SVG', 'PDF', 'PNG']
    };
  };

  const handleGenerate = async () => {
    if (!input.trim()) return;
    
    if (subscription.plansRemaining <= 0) {
      navigate('/subscription');
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    const newPlan = generateMockFloorPlan(input);
    addPlan(newPlan);
    setIsLoading(false);
    
    // Navigate to export page
    navigate(`/export/${newPlan.id}`);
  };

  const quickTemplates = [
    "2 bedroom apartment with open kitchen and living room",
    "3 bedroom house with 2 bathrooms and garage",
    "Studio apartment with kitchenette",
    "4 bedroom family home with dining room and study"
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-teal-50 via-blue-50 to-indigo-50 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <Sparkles className="h-8 w-8 text-teal-600" />
            <span className="text-lg font-semibold text-teal-600">AI-Powered Floor Plans</span>
          </div>
          
          <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Describe your floor plan.
            <span className="text-teal-600"> AI builds it.</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Transform your ideas into professional floor plans instantly. 
            Get CAD-ready layouts with precise measurements and export options.
          </p>
          
          {/* Subscription Status */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-8 max-w-md mx-auto">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Plans remaining:</span>
              <span className="font-semibold text-teal-600">{subscription.plansRemaining}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className="bg-teal-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${(subscription.plansRemaining / 10) * 100}%` }}
              ></div>
            </div>
          </div>
          
          {/* Input Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-3xl mx-auto">
            <label className="block text-left text-lg font-semibold text-gray-900 mb-4">
              Describe your floor plan:
            </label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full h-32 p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none transition-all duration-200 text-gray-700"
              placeholder="e.g., 2 bedroom house of 1000 sq ft with kitchen, living room, and 2 bathrooms"
            />
            
            {/* Quick Templates */}
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">Quick templates:</p>
              <div className="flex flex-wrap gap-2">
                {quickTemplates.map((template, index) => (
                  <button
                    key={index}
                    onClick={() => setInput(template)}
                    className="text-xs bg-gray-100 hover:bg-teal-50 hover:text-teal-700 text-gray-600 px-3 py-1 rounded-full transition-all duration-200"
                  >
                    {template}
                  </button>
                ))}
              </div>
            </div>
            
            <button
              onClick={handleGenerate}
              disabled={!input.trim() || isLoading || subscription.plansRemaining <= 0}
              className="w-full mt-6 bg-gradient-to-r from-teal-600 to-blue-600 text-white font-semibold py-4 px-8 rounded-xl hover:from-teal-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Generating Floor Plan...</span>
                </>
              ) : subscription.plansRemaining <= 0 ? (
                <>
                  <span>Upgrade to Generate More</span>
                  <ArrowRight className="h-5 w-5" />
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5" />
                  <span>Generate Floor Plan</span>
                </>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Planix?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Professional-grade floor plans with AI precision and human creativity
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-xl hover:shadow-lg transition-all duration-300">
              <div className="bg-teal-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-8 w-8 text-teal-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">AI-Powered</h3>
              <p className="text-gray-600">
                Advanced AI understands your requirements and creates optimized layouts
              </p>
            </div>
            
            <div className="text-center p-6 rounded-xl hover:shadow-lg transition-all duration-300">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Download className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">CAD-Ready</h3>
              <p className="text-gray-600">
                Export to DXF, SVG, PDF formats for professional use
              </p>
            </div>
            
            <div className="text-center p-6 rounded-xl hover:shadow-lg transition-all duration-300">
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <ArrowRight className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Instant Results</h3>
              <p className="text-gray-600">
                Get your floor plan in seconds, not hours or days
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;