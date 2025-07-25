import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Download, FileText, Image, Printer, ArrowLeft, Share2, Edit3, 
  CheckCircle, AlertCircle, Calculator, Hammer, Shield, Award
} from 'lucide-react';
import { usePlans } from '../context/PlanContext';

const ExportPage: React.FC = () => {
  const { planId } = useParams<{ planId: string }>();
  const navigate = useNavigate();
  const { plans, exportPlan } = usePlans();
  
  // Mock subscription data for compatibility
  const subscription = {
    plan: 'free' as 'free' | 'pro' | 'enterprise',
    plansRemaining: 3,
    exportsRemaining: 5,
    referralCredits: 0,
    referralCode: 'PLANIX2024ABC',
    isActive: true
  };
  const [selectedFormat, setSelectedFormat] = useState('DXF');
  const [isExporting, setIsExporting] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const plan = plans.find(p => p.id === planId);

  if (!plan) {
    return (
      <div className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Floor Plan Not Found</h1>
          <button
            onClick={() => navigate('/history')}
            className="bg-teal-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-teal-700 transition-all duration-200"
          >
            Back to History
          </button>
        </div>
      </div>
    );
  }

  const exportFormats = [
    { 
      name: 'DXF', 
      description: 'AutoCAD Drawing Exchange Format',
      icon: FileText,
      premium: false
    },
    { 
      name: 'SVG', 
      description: 'Scalable Vector Graphics',
      icon: Image,
      premium: false
    },
    { 
      name: 'PDF', 
      description: 'Portable Document Format',
      icon: Printer,
      premium: true
    },
    { 
      name: 'PNG', 
      description: 'High-resolution image',
      icon: Image,
      premium: true
    }
  ];

  const handleExport = async () => {
    if (subscription.exportsRemaining <= 0 && subscription.plan === 'free') {
      navigate('/subscription');
      return;
    }

    setIsExporting(true);
    
    // Simulate export process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Create download
    const content = `${selectedFormat} Floor Plan Data for:\n${plan.description}\n\nGenerated Rooms:\n${plan.rooms.map(room => `${room.name}: ${room.dimensions} (${room.area})`).join('\n')}\n\nTotal Area: ${plan.totalArea}\n\nMaterial Estimates:\n${plan.materialEstimate ? Object.entries(plan.materialEstimate).map(([key, value]) => `${key}: ${value}`).join('\n') : 'Not available'}\n\nIS Code Compliance Score: ${plan.isCompliance?.overall_score || 'N/A'}%`;
    
    const element = document.createElement('a');
    element.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(content);
    element.download = `floor_plan.${selectedFormat.toLowerCase()}`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    setIsExporting(false);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My Floor Plan',
        text: plan.description,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const getComplianceColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getComplianceIcon = (score: number) => {
    if (score >= 90) return CheckCircle;
    if (score >= 75) return AlertCircle;
    return AlertCircle;
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/history')}
              className="flex items-center space-x-2 text-gray-600 hover:text-teal-600 transition-colors duration-200"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to History</span>
            </button>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={handleShare}
              className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors duration-200"
            >
              <Share2 className="h-4 w-4" />
              <span>Share</span>
            </button>
            
            <button className="flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors duration-200">
              <Edit3 className="h-4 w-4" />
              <span>Edit</span>
            </button>
          </div>
        </div>

        {/* IS Code Compliance Badge */}
        {plan.isCompliance && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Shield className="h-6 w-6 text-green-600" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">IS Code Compliance</h3>
                  <p className="text-sm text-gray-600">Validated against Indian Standard building codes</p>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-3xl font-bold ${getComplianceColor(plan.isCompliance.overall_score)}`}>
                  {plan.isCompliance.overall_score}%
                </div>
                <div className="text-sm text-gray-500">Overall Score</div>
              </div>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Floor Plan Preview */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Floor Plan Preview</h1>
              <p className="text-gray-600 mb-4">{plan.description}</p>
              
              {/* Plan Details */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-sm text-gray-600">Total Area</div>
                  <div className="font-semibold text-gray-900">{plan.totalArea}</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-sm text-gray-600">Plot Size</div>
                  <div className="font-semibold text-gray-900">{plan.plotSize}</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-sm text-gray-600">Building Type</div>
                  <div className="font-semibold text-gray-900 capitalize">{plan.buildingType}</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-sm text-gray-600">Floors</div>
                  <div className="font-semibold text-gray-900">{plan.floors}</div>
                </div>
              </div>
              
              {/* Layout Preview */}
              <div className="bg-gray-100 rounded-lg p-8 min-h-96 relative border-2 border-gray-200">
                <div className="flex flex-wrap gap-4 justify-center items-center h-full">
                  {plan.rooms.map((room, index) => (
                    <div
                      key={index}
                      className={`${room.color} ${room.size} rounded-lg border-2 flex flex-col items-center justify-center text-center p-3 transform hover:scale-105 transition-transform duration-200 shadow-sm`}
                    >
                      <room.icon className="h-6 w-6 text-gray-600 mb-2" />
                      <span className="text-xs font-medium text-gray-700">{room.name}</span>
                      <span className="text-xs text-gray-500 mt-1">{room.area}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Tabs for detailed information */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  {[
                    { id: 'overview', label: 'Room Details', icon: FileText },
                    { id: 'materials', label: 'Material Estimates', icon: Calculator },
                    { id: 'compliance', label: 'IS Code Check', icon: Shield }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm ${
                        activeTab === tab.id
                          ? 'border-teal-500 text-teal-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <tab.icon className="h-4 w-4" />
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6">
                {activeTab === 'overview' && (
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {plan.rooms.map((room, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-full ${room.color}`}>
                            <room.icon className="h-4 w-4 text-gray-600" />
                          </div>
                          <span className="font-medium text-gray-900">{room.name}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-900">{room.dimensions}</div>
                          <div className="text-sm text-gray-500">{room.area}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'materials' && plan.materialEstimate && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-orange-50 rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <Hammer className="h-5 w-5 text-orange-600" />
                          <span className="font-medium text-orange-900">Bricks</span>
                        </div>
                        <div className="text-2xl font-bold text-orange-600">{plan.materialEstimate.bricks.toLocaleString()}</div>
                        <div className="text-sm text-orange-700">pieces</div>
                      </div>
                      
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <Calculator className="h-5 w-5 text-gray-600" />
                          <span className="font-medium text-gray-900">Cement</span>
                        </div>
                        <div className="text-2xl font-bold text-gray-600">{plan.materialEstimate.cement_bags}</div>
                        <div className="text-sm text-gray-700">bags (50kg)</div>
                      </div>
                      
                      <div className="bg-blue-50 rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <Hammer className="h-5 w-5 text-blue-600" />
                          <span className="font-medium text-blue-900">Steel</span>
                        </div>
                        <div className="text-2xl font-bold text-blue-600">{plan.materialEstimate.steel_kg}</div>
                        <div className="text-sm text-blue-700">kg</div>
                      </div>
                      
                      <div className="bg-yellow-50 rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <Calculator className="h-5 w-5 text-yellow-600" />
                          <span className="font-medium text-yellow-900">Sand</span>
                        </div>
                        <div className="text-2xl font-bold text-yellow-600">{plan.materialEstimate.sand_cubic_meters}</div>
                        <div className="text-sm text-yellow-700">cubic meters</div>
                      </div>
                      
                      <div className="bg-green-50 rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <Hammer className="h-5 w-5 text-green-600" />
                          <span className="font-medium text-green-900">Aggregate</span>
                        </div>
                        <div className="text-2xl font-bold text-green-600">{plan.materialEstimate.aggregate_cubic_meters}</div>
                        <div className="text-sm text-green-700">cubic meters</div>
                      </div>
                      
                      <div className="bg-purple-50 rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <Calculator className="h-5 w-5 text-purple-600" />
                          <span className="font-medium text-purple-900">Excavation</span>
                        </div>
                        <div className="text-2xl font-bold text-purple-600">{plan.materialEstimate.excavation_cubic_meters}</div>
                        <div className="text-sm text-purple-700">cubic meters</div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'compliance' && plan.isCompliance && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { key: 'room_size_compliance', label: 'Room Size Compliance', standard: 'IS 962' },
                        { key: 'ventilation_compliance', label: 'Ventilation Standards', standard: 'IS 3362' },
                        { key: 'structural_compliance', label: 'Structural Safety', standard: 'IS 800' },
                        { key: 'fire_safety_compliance', label: 'Fire Safety', standard: 'IS 1641' },
                        { key: 'accessibility_compliance', label: 'Accessibility', standard: 'IS 4963' }
                      ].map((item) => (
                        <div key={item.key} className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-gray-900">{item.label}</span>
                            {plan.isCompliance![item.key as keyof typeof plan.isCompliance] ? (
                              <CheckCircle className="h-5 w-5 text-green-600" />
                            ) : (
                              <AlertCircle className="h-5 w-5 text-red-600" />
                            )}
                          </div>
                          <div className="text-sm text-gray-600">{item.standard}</div>
                        </div>
                      ))}
                    </div>
                    
                    {plan.isCompliance.violations.length > 0 && (
                      <div className="bg-red-50 rounded-lg p-4">
                        <h4 className="font-medium text-red-900 mb-2">Compliance Issues</h4>
                        <ul className="space-y-1">
                          {plan.isCompliance.violations.map((violation, index) => (
                            <li key={index} className="text-sm text-red-700">• {violation}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Export Options */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Export Options</h2>
              
              {/* Export Limit */}
              {subscription.plan === 'free' && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-amber-800">Exports remaining:</span>
                    <span className="font-semibold text-amber-800">{subscription.exportsRemaining}</span>
                  </div>
                  <div className="w-full bg-amber-200 rounded-full h-2">
                    <div 
                      className="bg-amber-600 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${(subscription.exportsRemaining / 10) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Format Selection */}
              <div className="space-y-3 mb-6">
                {exportFormats.map((format) => (
                  <div
                    key={format.name}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                      selectedFormat === format.name
                        ? 'border-teal-500 bg-teal-50'
                        : 'border-gray-200 hover:border-gray-300'
                    } ${format.premium && subscription.plan === 'free' ? 'opacity-50' : ''}`}
                    onClick={() => !format.premium || subscription.plan !== 'free' ? setSelectedFormat(format.name) : null}
                  >
                    <div className="flex items-center space-x-3">
                      <format.icon className="h-5 w-5 text-gray-600" />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-gray-900">{format.name}</span>
                          {format.premium && subscription.plan === 'free' && (
                            <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full">
                              Pro
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{format.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Export Button */}
              <button
                onClick={handleExport}
                disabled={isExporting || (subscription.exportsRemaining <= 0 && subscription.plan === 'free')}
                className="w-full bg-teal-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
              >
                {isExporting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Exporting...</span>
                  </>
                ) : subscription.exportsRemaining <= 0 && subscription.plan === 'free' ? (
                  <span>Upgrade to Export</span>
                ) : (
                  <>
                    <Download className="h-5 w-5" />
                    <span>Export {selectedFormat}</span>
                  </>
                )}
              </button>

              {subscription.exportsRemaining <= 0 && subscription.plan === 'free' && (
                <button
                  onClick={() => navigate('/subscription')}
                  className="w-full mt-3 bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition-all duration-200"
                >
                  Upgrade Now
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportPage;