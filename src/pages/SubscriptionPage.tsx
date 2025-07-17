import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Star, Zap, Crown, ArrowRight } from 'lucide-react';
import { usePlan } from '../context/PlanContext';

const SubscriptionPage: React.FC = () => {
  const navigate = useNavigate();
  const { subscription, updateSubscription } = usePlan();

  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Perfect for trying out Planix',
      icon: Star,
      color: 'gray',
      features: [
        '3 floor plans per month',
        '5 exports per month',
        'Basic room types',
        'DXF & SVG export',
        'Community support'
      ],
      limitations: [
        'Limited customization',
        'Watermarked exports'
      ]
    },
    {
      name: 'Pro',
      price: '$19',
      period: 'month',
      description: 'For professionals and frequent users',
      icon: Zap,
      color: 'teal',
      popular: true,
      features: [
        'Unlimited floor plans',
        'Unlimited exports',
        'Advanced room types',
        'All export formats (DXF, SVG, PDF, PNG)',
        'Custom dimensions',
        'Priority support',
        'No watermarks',
        'Collaboration tools'
      ]
    },
    {
      name: 'Enterprise',
      price: '$99',
      period: 'month',
      description: 'For teams and organizations',
      icon: Crown,
      color: 'purple',
      features: [
        'Everything in Pro',
        'Team collaboration',
        'API access',
        'Custom branding',
        'Advanced analytics',
        'Dedicated support',
        'SSO integration',
        'Custom integrations'
      ]
    }
  ];

  const handleSelectPlan = (planName: string) => {
    if (planName === 'Free') {
      updateSubscription({
        plan: 'free',
        plansRemaining: 3,
        exportsRemaining: 5
      });
      navigate('/');
    } else {
      navigate('/payment', { state: { selectedPlan: planName } });
    }
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
            Select the perfect plan for your floor planning needs. 
            Upgrade or downgrade anytime.
          </p>
        </div>

        {/* Current Plan Status */}
        <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-xl p-6 mb-12 max-w-2xl mx-auto">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Current Plan</h3>
            <div className="flex items-center justify-center space-x-4">
              <span className="text-2xl font-bold text-teal-600 capitalize">
                {subscription.plan}
              </span>
              <div className="text-sm text-gray-600">
                <div>Plans: {subscription.plansRemaining} remaining</div>
                <div>Exports: {subscription.exportsRemaining} remaining</div>
              </div>
            </div>
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
                Can I change my plan anytime?
              </h3>
              <p className="text-gray-600">
                Yes, you can upgrade or downgrade your plan at any time. 
                Changes take effect immediately and you'll be charged prorated amounts.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">
                What export formats are supported?
              </h3>
              <p className="text-gray-600">
                Free plan includes DXF and SVG formats. Pro and Enterprise plans 
                include all formats: DXF, SVG, PDF, and high-resolution PNG.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">
                Is there a free trial for paid plans?
              </h3>
              <p className="text-gray-600">
                We offer a generous free plan to try Planix. You can upgrade to 
                Pro or Enterprise anytime with a 30-day money-back guarantee.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;