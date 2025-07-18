import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Star, Zap, Crown, ArrowRight, Gift, Copy, Users, Shield, Ruler, Calculator } from 'lucide-react';
import { usePlan } from '../context/PlanContext';

const SubscriptionPage: React.FC = () => {
  const navigate = useNavigate();
  const { subscription, updateSubscription } = usePlan();
  const [copiedReferral, setCopiedReferral] = useState(false);

  const plans = [
    {
      name: 'Free',
      price: '₹0',
      period: 'forever',
      description: 'Perfect for trying out Planix',
      icon: Star,
      color: 'gray',
      features: [
        '3 floor plans per month',
        '5 exports per month',
        'Basic room types',
        'DXF & SVG export',
        'Community support',
        'Basic IS code validation'
      ],
      limitations: [
        'Limited customization',
        'Watermarked exports',
        'No material estimates'
      ]
    },
    {
      name: 'Pro',
      price: '₹699',
      period: 'month',
      description: 'For professionals and frequent users',
      icon: Zap,
      color: 'teal',
      popular: true,
      features: [
        '50 floor plans per month',
        'Unlimited exports',
        'Advanced room types',
        'All export formats (DXF, SVG, PDF, PNG)',
        'Material estimates (bricks, cement, steel)',
        'IS code compliance reports',
        'Priority support',
        'No watermarks',
        'Excavation calculations'
      ]
    },
    {
      name: 'Enterprise',
      price: '₹2,999',
      period: 'month',
      description: 'For teams and organizations',
      icon: Crown,
      color: 'purple',
      features: [
        'Everything in Pro',
        'Unlimited floor plans',
        'Team collaboration',
        'API access',
        'Custom branding',
        'Advanced analytics',
        'Dedicated support',
        'White-label licensing',
        'Custom IS code rules'
      ]
    }
  ];

  const handleSelectPlan = (planName: string) => {
    if (planName === 'Free') {
      updateSubscription({
        plan: 'free',
        plansRemaining: 3,
        exportsRemaining: 5,
        referralCredits: subscription.referralCredits,
        referralCode: subscription.referralCode,
        isActive: true
      });
      navigate('/');
    } else {
      navigate('/payment', { state: { selectedPlan: planName } });
    }
  };

  const copyReferralCode = () => {
    navigator.clipboard.writeText(`https://planix.com/signup?ref=${subscription.referralCode}`);
    setCopiedReferral(true);
    setTimeout(() => setCopiedReferral(false), 2000);
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Select the perfect plan for your floor planning needs with IS code compliance 
            and material estimates. Upgrade or downgrade anytime.
          </p>
        </div>

        {/* Current Plan Status */}
        <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-xl p-6 mb-8 max-w-2xl mx-auto">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Current Plan</h3>
            <div className="flex items-center justify-center space-x-4 mb-4">
              <span className="text-2xl font-bold text-teal-600 capitalize">
                {subscription.plan}
              </span>
              <div className="text-sm text-gray-600">
                <div>Plans: {subscription.plansRemaining} remaining</div>
                <div>Exports: {subscription.exportsRemaining} remaining</div>
              </div>
            </div>
            {subscription.referralCredits > 0 && (
              <div className="text-sm text-purple-600 font-medium">
                🎁 Referral Credits: {subscription.referralCredits}
              </div>
            )}
          </div>
        </div>

        {/* Referral Program */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 mb-12 max-w-4xl mx-auto">
          <div className="text-center mb-4">
            <Gift className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Referral Program</h3>
            <p className="text-gray-600">
              Invite friends and get 1 month free when they upgrade to Pro. 
              They get 50% off their first month!
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4">
            <div className="bg-white rounded-lg px-4 py-2 border border-purple-200">
              <span className="text-sm text-gray-600">Your referral code:</span>
              <span className="font-mono font-bold text-purple-600 ml-2">{subscription.referralCode}</span>
            </div>
            <button
              onClick={copyReferralCode}
              className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors duration-200"
            >
              <Copy className="h-4 w-4" />
              <span>{copiedReferral ? 'Copied!' : 'Copy Link'}</span>
            </button>
          </div>
        </div>

        {/* New Features Highlight */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-green-100">
            <div className="flex items-center space-x-3 mb-3">
              <Shield className="h-6 w-6 text-green-600" />
              <h3 className="font-semibold text-gray-900">IS Code Compliance</h3>
            </div>
            <p className="text-sm text-gray-600">
              Automatic validation against Indian Standard building codes (IS 962, IS 800, etc.)
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-blue-100">
            <div className="flex items-center space-x-3 mb-3">
              <Ruler className="h-6 w-6 text-blue-600" />
              <h3 className="font-semibold text-gray-900">Material Estimates</h3>
            </div>
            <p className="text-sm text-gray-600">
              Accurate quantity estimates for bricks, cement, steel, sand, and aggregates
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-orange-100">
            <div className="flex items-center space-x-3 mb-3">
              <Calculator className="h-6 w-6 text-orange-600" />
              <h3 className="font-semibold text-gray-900">Excavation Calculations</h3>
            </div>
            <p className="text-sm text-gray-600">
              Foundation and earthwork volume calculations for construction planning
            </p>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden ${
                plan.popular ? 'ring-2 ring-teal-500 transform scale-105' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-teal-500 to-blue-500 text-white text-center py-2 text-sm font-semibold">
                  Most Popular
                </div>
              )}
              
              <div className={`p-8 ${plan.popular ? 'pt-12' : ''}`}>
                {/* Plan Header */}
                <div className="text-center mb-8">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
                    plan.color === 'teal' ? 'bg-teal-100' :
                    plan.color === 'purple' ? 'bg-purple-100' : 'bg-gray-100'
                  }`}>
                    <plan.icon className={`h-8 w-8 ${
                      plan.color === 'teal' ? 'text-teal-600' :
                      plan.color === 'purple' ? 'text-purple-600' : 'text-gray-600'
                    }`} />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-4">{plan.description}</p>
                  
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-600 ml-1">/{plan.period}</span>
                  </div>
                  
                  {plan.name === 'Pro' && (
                    <div className="mt-2 text-sm text-green-600 font-medium">
                      Save 20% with annual billing
                    </div>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-3">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                  {plan.limitations?.map((limitation, index) => (
                    <li key={index} className="flex items-center space-x-3 opacity-60">
                      <div className="h-5 w-5 flex-shrink-0 flex items-center justify-center">
                        <div className="h-1 w-3 bg-gray-400 rounded"></div>
                      </div>
                      <span className="text-gray-500">{limitation}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <button
                  onClick={() => handleSelectPlan(plan.name)}
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center space-x-2 ${
                    subscription.plan === plan.name.toLowerCase()
                      ? 'bg-gray-100 text-gray-600 cursor-default'
                      : plan.popular
                      ? 'bg-gradient-to-r from-teal-600 to-blue-600 text-white hover:from-teal-700 hover:to-blue-700 transform hover:scale-105'
                      : 'bg-gray-900 text-white hover:bg-gray-800 transform hover:scale-105'
                  }`}
                  disabled={subscription.plan === plan.name.toLowerCase()}
                >
                  {subscription.plan === plan.name.toLowerCase() ? (
                    <span>Current Plan</span>
                  ) : (
                    <>
                      <span>{plan.name === 'Free' ? 'Get Started' : 'Upgrade Now'}</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">
                What makes Planix different from other floor plan tools?
              </h3>
              <p className="text-gray-600">
                Planix is the only tool that combines AI-powered floor plan generation with 
                IS code compliance checking and accurate material estimates for Indian construction.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">
                How accurate are the material estimates?
              </h3>
              <p className="text-gray-600">
                Our material estimates are based on IS 1904:2021 standards and include 
                calculations for bricks, cement, steel, sand, and aggregates with 90%+ accuracy.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">
                Which IS codes does Planix validate against?
              </h3>
              <p className="text-gray-600">
                We validate against IS 962 (residential buildings), IS 800 (steel structures), 
                IS 3362 (ventilation), and other relevant Indian Standard codes.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">
                How does the referral program work?
              </h3>
              <p className="text-gray-600">
                Share your referral code with friends. When they upgrade to Pro, you both get 
                benefits - you get 1 month free and they get 50% off their first month.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;