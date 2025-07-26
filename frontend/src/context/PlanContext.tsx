import React, { createContext, useContext, useState, useEffect } from 'react';
import apiService, { User, FloorPlan } from '../services/api';

interface PlanContextType {
  currentUser: User | null;
  plans: FloorPlan[];
  loading: boolean;
  error: string | null;
  createUser: (userData: { email: string; name: string; phone?: string }) => Promise<User>;
  generateFloorPlan: (planData: any) => Promise<FloorPlan>;
  getUserPlans: (userId: string) => Promise<void>;
  exportPlan: (planId: string) => Promise<void>;
  generateReferralCode: (userId: string) => Promise<any>;
  getReferralStats: (userId: string) => Promise<any>;
  healthCheck: () => Promise<any>;
}

const PlanContext = createContext<PlanContextType | undefined>(undefined);

export const usePlans = () => {
  const context = useContext(PlanContext);
  if (!context) {
    throw new Error('usePlans must be used within a PlanProvider');
  }
  return context;
};

export const PlanProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [plans, setPlans] = useState<FloorPlan[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createUser = async (userData: { email: string; name: string; phone?: string }): Promise<User> => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.createUser(userData);
      setCurrentUser(response.user);
      return response.user;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create user';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const generateFloorPlan = async (planData: any): Promise<FloorPlan> => {
    try {
      setLoading(true);
      setError(null);
      
      // If no current user, create a demo user
      let userId = currentUser?.id;
      if (!userId) {
        const demoUser = await createUser({
          email: 'demo@planix.com',
          name: 'Demo User'
        });
        userId = demoUser.id;
      }
      
      const response = await apiService.createFloorPlan({
        ...planData,
        userId
      });
      
      // Poll for completion
      const planId = response.floorPlan.id;
      await pollForCompletion(planId);
      
      // Refresh user plans
      if (userId) {
        await getUserPlans(userId);
      }
      
      return response.floorPlan;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate floor plan';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const pollForCompletion = async (planId: string): Promise<void> => {
    const maxAttempts = 30; // 30 seconds timeout
    let attempts = 0;
    
    while (attempts < maxAttempts) {
      try {
        const response = await apiService.getFloorPlan(planId);
        if (response.floorPlan.status === 'completed' || response.floorPlan.status === 'failed') {
          break;
        }
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
        attempts++;
      } catch (error) {
        break;
      }
    }
  };

  const getUserPlans = async (userId: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getUserFloorPlans(userId);
      setPlans(response.floorPlans);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch plans';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const exportPlan = async (planId: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      await apiService.exportFloorPlan(planId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to export plan';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const generateReferralCode = async (userId: string): Promise<any> => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.generateReferralCode(userId);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate referral code';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getReferralStats = async (userId: string): Promise<any> => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getReferralStats(userId);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get referral stats';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const healthCheck = async (): Promise<any> => {
    try {
      const response = await apiService.healthCheck();
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Health check failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Initialize with health check
  useEffect(() => {
    healthCheck().catch(console.error);
  }, []);

  const value: PlanContextType = {
    currentUser,
    plans,
    loading,
    error,
    createUser,
    generateFloorPlan,
    getUserPlans,
    exportPlan,
    generateReferralCode,
    getReferralStats,
    healthCheck
  };

  return <PlanContext.Provider value={value}>{children}</PlanContext.Provider>;
};