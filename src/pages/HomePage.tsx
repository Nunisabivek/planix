import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Download, Bed, Bath, Car, Utensils, ChefHat, Sofa, Sparkles, ArrowRight,
  Home, Users, MapPin, Ruler, AlertCircle, Award, Gift, Shield
} from 'lucide-react';
import { usePlan } from '../context/PlanContext';
import { FloorPlan, Room, MaterialEstimate, ISCodeCompliance } from '../context/PlanContext';

const HomePage: React.FC = () => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showAdvancedForm, setShowAdvancedForm] = useState(false);
  const { addPlan, subscription } = usePlan();
  const navigate = useNavigate();

  // Advanced form state
  const [formData, setFormData] = useState({
    plotSize: '',
    buildingType: 'residential' as 'residential' | 'commercial' | 'industrial',
    floors: 1,
    bedrooms: 2,
    bathrooms: 2,
    kitchen: true,
    livingRoom: true,
    diningRoom: false,
    studyRoom: false,
    garage: false,
    balcony: false,
    location: '',
    budget: '',
    specialRequirements: ''
  });

  const generateMockMaterialEstimate = (totalArea: number): MaterialEstimate => {
    const areaInSqM = totalArea * 0.092903; // Convert sq ft to sq m
    
    return {
      bricks: Math.round(areaInSqM * 500), // 500 bricks per sq m
      cement_bags: Math.round(areaInSqM * 1.26), // 1.26 bags per sq m
      steel_kg: Math.round(areaInSqM * 45), // 45 kg per sq m
      sand_cubic_meters: Math.round(areaInSqM * 0.042 * 10) / 10, // 0.042 cubic m per sq m
      aggregate_cubic_meters: Math.round(areaInSqM * 0.084 * 10) / 10, // 0.084 cubic m per sq m
      excavation_cubic_meters: Math.round(areaInSqM * 0.15 * 10) / 10, // 0.15 cubic m per sq m
      foundation_concrete: Math.round(areaInSqM * 0.05 * 10) / 10, // 0.05 cubic m per sq m
    };
  };

  const generateMockISCompliance = (): ISCodeCompliance => {
    const violations = [];
    const score = Math.random() * 20 + 80; // Random score between 80-100
    
    if (score < 90) {
      violations.push('Room ventilation could be improved as per IS 3362');
    }
    if (score < 85) {
      violations.push('Minimum room width compliance pending (IS 962)');
    }
    
    return {
      overall_score: Math.round(score),
      room_size_compliance: score > 85,
      ventilation_compliance: score > 90,
      structural_compliance: score > 88,
      fire_safety_compliance: score > 92,
      accessibility_compliance: score > 87,
      violations
    };
  };

  const generateMockFloorPlan = (description: string): FloorPlan => {
    const rooms: Room[] = [];
    const roomTypes = {
      bedroom: { icon: Bed, color: 'bg-blue-100 border-blue-300', size: 'w-24 h-16' },
      bathroom: { icon: Bath, color: 'bg-teal-100 border-teal-300', size: 'w-16 h-12' },
      kitchen: { icon: ChefHat, color: 'bg-orange-100 border-orange-300', size: 'w-20 h-16' },
      living: { icon: Sofa, color: 'bg-green-100 border-green-300', size: 'w-28 h-20' },
      garage: { icon: Car, color: 'bg-gray-100 border-gray-300', size: 'w-24 h-20' }
    };

    // Use advanced form data if available
    if (showAdvancedForm) {
      for (let i = 0; i < formData.bedrooms; i++) {
        rooms.push({
          name: `Bedroom ${i + 1}`,
          type: 'bedroom',
          dimensions: `12' x 10'`,
          area: '120 sq ft',
          ...roomTypes.bedroom
        });
      }
      
      for (let i = 0; i < formData.bathrooms; i++) {
        rooms.push({
          name: `Bathroom ${i + 1}`,
          type: 'bathroom',
          dimensions: `8' x 6'`,
          area: '48 sq ft',
          ...roomTypes.bathroom
        });
      }
      
      if (formData.kitchen) {
        rooms.push({
          name: 'Kitchen',
          type: 'kitchen',
          dimensions: `10' x 12'`,
          area: '120 sq ft',
          ...roomTypes.kitchen
        });
      }
      
      if (formData.livingRoom) {
        rooms.push({
          name: 'Living Room',
          type: 'living',
          dimensions: `16' x 14'`,
          area: '224 sq ft',
          ...roomTypes.living
        });
      }
      
      if (formData.garage) {
        rooms.push({
          name: 'Garage',
          type: 'garage',
          dimensions: `20' x 10'`,
          area: '200 sq ft',
          ...roomTypes.garage
        });
      }
    } else {
      // Extract room information from description (existing logic)
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

    const totalArea = rooms.reduce((sum, room) => sum + parseInt(room.area), 0);
    const materialEstimate = generateMockMaterialEstimate(totalArea);
    const isCompliance = generateMockISCompliance();

    return {
      id: Date.now().toString(),
      name: `Floor Plan ${Date.now()}`,
      description: showAdvancedForm ? `${formData.bedrooms}BHK ${formData.buildingType} on ${formData.plotSize}` : description,
      rooms,
      totalArea: totalArea + ' sq ft',
      createdAt: new Date(),
      exportFormats: ['DXF', 'SVG', 'PDF', 'PNG'],
      materialEstimate,
      isCompliance,
      plotSize: formData.plotSize || 'Not specified',
      floors: formData.floors || 1,
      buildingType: formData.buildingType || 'residential'
    };
  };

  const handleGenerate = async () => {
    if (!input.trim() && !showAdvancedForm) return;
    
    if (subscription.plansRemaining <= 0) {
      navigate('/subscription');
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 3000));
    
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
            <span className="text-lg font-semibold text-teal-600">AI-Powered Floor Plans with IS Code Compliance</span>
          </div>
          
          <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Describe your floor plan.
            <span className="text-teal-600"> AI builds it.</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Transform your ideas into professional floor plans with IS code compliance, 
            material estimates, and excavation calculations - all in seconds.
          </p>
          
          {/* New Features Highlight */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="flex items-center space-x-2 bg-white rounded-full px-4 py-2 shadow-sm">
              <Shield className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-gray-700">IS Code Compliant</span>
            </div>
            <div className="flex items-center space-x-2 bg-white rounded-full px-4 py-2 shadow-sm">
              <Ruler className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">Material Estimates</span>
            </div>
            <div className="flex items-center space-x-2 bg-white rounded-full px-4 py-2 shadow-sm">
              <Gift className="h-5 w-5 text-purple-600" />
              <span className="text-sm font-medium text-gray-700">Referral Credits</span>
            </div>
          </div>
          
          {/* Subscription Status */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-8 max-w-md mx-auto">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Plans remaining:</span>
              <span className="font-semibold text-teal-600">{subscription.plansRemaining}</span>
            </div>
            {subscription.referralCredits > 0 && (
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Referral credits:</span>
                <span className="font-semibold text-purple-600">{subscription.referralCredits}</span>
              </div>
            )}
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className="bg-teal-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${(subscription.plansRemaining / 50) * 100}%` }}
              ></div>
            </div>
          </div>
          
          {/* Form Toggle */}
          <div className="flex justify-center mb-6">
            <div className="bg-white rounded-lg shadow-sm p-1 flex">
              <button
                onClick={() => setShowAdvancedForm(false)}
                className={`px-4 py-2 rounded-md transition-all duration-200 ${
                  !showAdvancedForm 
                    ? 'bg-teal-600 text-white' 
                    : 'text-gray-600 hover:text-teal-600'
                }`}
              >
                Quick Description
              </button>
              <button
                onClick={() => setShowAdvancedForm(true)}
                className={`px-4 py-2 rounded-md transition-all duration-200 ${
                  showAdvancedForm 
                    ? 'bg-teal-600 text-white' 
                    : 'text-gray-600 hover:text-teal-600'
                }`}
              >
                Advanced Form
              </button>
            </div>
          </div>

          {/* Input Form */}
          {!showAdvancedForm ? (
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
            </div>
          ) : (
            // Advanced Form
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Detailed Requirements</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Plot Size
                  </label>
                  <input
                    type="text"
                    value={formData.plotSize}
                    onChange={(e) => setFormData({...formData, plotSize: e.target.value})}
                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="e.g., 30x40 feet"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Building Type
                  </label>
                  <select
                    value={formData.buildingType}
                    onChange={(e) => setFormData({...formData, buildingType: e.target.value as any})}
                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  >
                    <option value="residential">Residential</option>
                    <option value="commercial">Commercial</option>
                    <option value="industrial">Industrial</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Floors
                  </label>
                  <select
                    value={formData.floors}
                    onChange={(e) => setFormData({...formData, floors: parseInt(e.target.value)})}
                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  >
                    <option value={1}>1 Floor</option>
                    <option value={2}>2 Floors</option>
                    <option value={3}>3 Floors</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bedrooms
                  </label>
                  <select
                    value={formData.bedrooms}
                    onChange={(e) => setFormData({...formData, bedrooms: parseInt(e.target.value)})}
                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  >
                    <option value={1}>1 Bedroom</option>
                    <option value={2}>2 Bedrooms</option>
                    <option value={3}>3 Bedrooms</option>
                    <option value={4}>4 Bedrooms</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bathrooms
                  </label>
                  <select
                    value={formData.bathrooms}
                    onChange={(e) => setFormData({...formData, bathrooms: parseInt(e.target.value)})}
                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  >
                    <option value={1}>1 Bathroom</option>
                    <option value={2}>2 Bathrooms</option>
                    <option value={3}>3 Bathrooms</option>
                    <option value={4}>4 Bathrooms</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location (for local codes)
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="e.g., Mumbai, Maharashtra"
                  />
                </div>
              </div>
              
              {/* Additional Features */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Additional Features
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { key: 'garage', label: 'Garage', icon: Car },
                    { key: 'studyRoom', label: 'Study Room', icon: Home },
                    { key: 'diningRoom', label: 'Dining Room', icon: Utensils },
                    { key: 'balcony', label: 'Balcony', icon: Home },
                  ].map((feature) => (
                    <label key={feature.key} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData[feature.key as keyof typeof formData] as boolean}
                        onChange={(e) => setFormData({...formData, [feature.key]: e.target.checked})}
                        className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
                      />
                      <feature.icon className="h-4 w-4 text-gray-600" />
                      <span className="text-sm text-gray-700">{feature.label}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Special Requirements
                </label>
                <textarea
                  value={formData.specialRequirements}
                  onChange={(e) => setFormData({...formData, specialRequirements: e.target.value})}
                  className="w-full h-20 p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                  placeholder="e.g., Wheelchair accessible, Home office space, etc."
                />
              </div>
            </div>
          )}
          
          <button
            onClick={handleGenerate}
            disabled={(!input.trim() && !showAdvancedForm) || isLoading || subscription.plansRemaining <= 0}
            className="w-full max-w-3xl mt-6 bg-gradient-to-r from-teal-600 to-blue-600 text-white font-semibold py-4 px-8 rounded-xl hover:from-teal-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Generating Floor Plan with AI...</span>
              </>
            ) : subscription.plansRemaining <= 0 ? (
              <>
                <span>Upgrade to Generate More</span>
                <ArrowRight className="h-5 w-5" />
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5" />
                <span>Generate AI Floor Plan</span>
              </>
            )}
          </button>
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
              Professional-grade floor plans with AI precision, IS code compliance, and material estimates
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-xl hover:shadow-lg transition-all duration-300">
              <div className="bg-teal-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-8 w-8 text-teal-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">AI-Powered</h3>
              <p className="text-gray-600">
                Advanced AI with Gemini integration understands your requirements and creates optimized layouts
              </p>
            </div>
            
            <div className="text-center p-6 rounded-xl hover:shadow-lg transition-all duration-300">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">IS Code Compliant</h3>
              <p className="text-gray-600">
                Automatically validates against Indian Standard building codes for safety and compliance
              </p>
            </div>
            
            <div className="text-center p-6 rounded-xl hover:shadow-lg transition-all duration-300">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Ruler className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Material Estimates</h3>
              <p className="text-gray-600">
                Get accurate quantity estimates for bricks, cement, steel, and excavation work
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;