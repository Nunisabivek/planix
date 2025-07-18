import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Room {
  name: string;
  type: string;
  dimensions: string;
  area: string;
  icon: any;
  color: string;
  size: string;
}

export interface MaterialEstimate {
  bricks: number;
  cement_bags: number;
  steel_kg: number;
  sand_cubic_meters: number;
  aggregate_cubic_meters: number;
  excavation_cubic_meters: number;
  foundation_concrete: number;
}

export interface ISCodeCompliance {
  overall_score: number;
  room_size_compliance: boolean;
  ventilation_compliance: boolean;
  structural_compliance: boolean;
  fire_safety_compliance: boolean;
  accessibility_compliance: boolean;
  violations: string[];
}

export interface FloorPlan {
  id: string;
  name: string;
  description: string;
  rooms: Room[];
  totalArea: string;
  createdAt: Date;
  exportFormats: string[];
  materialEstimate?: MaterialEstimate;
  isCompliance?: ISCodeCompliance;
  plotSize?: string;
  floors?: number;
  buildingType?: 'residential' | 'commercial' | 'industrial';
}

interface PlanContextType {
  plans: FloorPlan[];
  currentPlan: FloorPlan | null;
  addPlan: (plan: FloorPlan) => void;
  setCurrentPlan: (plan: FloorPlan | null) => void;
  deletePlan: (id: string) => void;
  subscription: {
    plan: 'free' | 'pro' | 'enterprise';
    plansRemaining: number;
    exportsRemaining: number;
    referralCredits: number;
    referralCode: string;
    isActive: boolean;
    nextBillingDate?: Date;
  };
  updateSubscription: (subscription: any) => void;
  addReferralCredits: (credits: number) => void;
  user: {
    id: string;
    email: string;
    name: string;
    referredBy?: string;
    totalReferrals: number;
  } | null;
  setUser: (user: any) => void;
}

const PlanContext = createContext<PlanContextType | undefined>(undefined);

export const usePlan = () => {
  const context = useContext(PlanContext);
  if (!context) {
    throw new Error('usePlan must be used within a PlanProvider');
  }
  return context;
};

export const PlanProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [plans, setPlans] = useState<FloorPlan[]>([]);
  const [currentPlan, setCurrentPlan] = useState<FloorPlan | null>(null);
  const [subscription, setSubscription] = useState({
    plan: 'free' as 'free' | 'pro' | 'enterprise',
    plansRemaining: 3,
    exportsRemaining: 5,
  });

  const addPlan = (plan: FloorPlan) => {
    setPlans(prev => [plan, ...prev]);
    setCurrentPlan(plan);
  };

  const deletePlan = (id: string) => {
    setPlans(prev => prev.filter(plan => plan.id !== id));
    if (currentPlan?.id === id) {
      setCurrentPlan(null);
    }
  };

  const updateSubscription = (newSubscription: any) => {
    setSubscription(newSubscription);
  };

  return (
    <PlanContext.Provider value={{
      plans,
      currentPlan,
      addPlan,
      setCurrentPlan,
      deletePlan,
      subscription,
      updateSubscription,
    }}>
      {children}
    </PlanContext.Provider>
  );
};