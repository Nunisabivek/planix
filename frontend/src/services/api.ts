const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001/api';

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  subscriptionType: 'free' | 'pro' | 'enterprise';
  subscriptionStatus: string;
  plansUsed: number;
  exportsUsed: number;
  referralCode?: string;
  totalReferrals: number;
  referralCredits: number;
}

export interface FloorPlan {
  id: string;
  userId: string;
  title: string;
  description: string;
  area?: number;
  rooms?: number;
  bathrooms?: number;
  location?: string;
  budget?: number;
  features: string[];
  generatedPlan: string;
  materialEstimate: any;
  isCodeCompliance: any;
  status: 'generating' | 'completed' | 'failed';
  exportCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFloorPlanRequest {
  userId: string;
  description: string;
  area?: number;
  rooms?: number;
  bathrooms?: number;
  location?: string;
  budget?: number;
  features?: string[];
}

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Network error' }));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Health check
  async healthCheck(): Promise<{ status: string; message: string }> {
    return this.request('/health');
  }

  // User management
  async createUser(userData: {
    email: string;
    name: string;
    phone?: string;
  }): Promise<{ success: boolean; user: User }> {
    return this.request('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async getUser(userId: string): Promise<{ success: boolean; user: User }> {
    return this.request(`/users/${userId}`);
  }

  async getUserSubscription(userId: string): Promise<any> {
    return this.request(`/users/${userId}/subscription`);
  }

  // Floor plans
  async createFloorPlan(planData: CreateFloorPlanRequest): Promise<any> {
    return this.request('/floor-plans', {
      method: 'POST',
      body: JSON.stringify(planData),
    });
  }

  async getFloorPlan(planId: string): Promise<{ success: boolean; floorPlan: FloorPlan }> {
    return this.request(`/floor-plans/${planId}`);
  }

  async getUserFloorPlans(userId: string, page = 1, limit = 10): Promise<any> {
    return this.request(`/floor-plans/user/${userId}?page=${page}&limit=${limit}`);
  }

  async exportFloorPlan(planId: string): Promise<any> {
    return this.request(`/floor-plans/${planId}/export`, {
      method: 'POST',
    });
  }

  // Subscriptions
  async getSubscriptionPlans(): Promise<any> {
    return this.request('/subscriptions/plans');
  }

  async getSubscription(userId: string): Promise<any> {
    return this.request(`/subscriptions/${userId}`);
  }

  async updateSubscription(userId: string, planType: string): Promise<any> {
    return this.request(`/subscriptions/${userId}`, {
      method: 'PUT',
      body: JSON.stringify({ planType }),
    });
  }

  // Referrals
  async generateReferralCode(userId: string): Promise<any> {
    return this.request(`/referrals/generate/${userId}`, {
      method: 'POST',
    });
  }

  async getReferralStats(userId: string): Promise<any> {
    return this.request(`/referrals/${userId}`);
  }

  async applyReferralCode(userId: string, referralCode: string): Promise<any> {
    return this.request('/referrals/apply', {
      method: 'POST',
      body: JSON.stringify({ userId, referralCode }),
    });
  }

  async getReferralLeaderboard(limit = 10): Promise<any> {
    return this.request(`/referrals/leaderboard/top?limit=${limit}`);
  }
}

export const apiService = new ApiService();
export default apiService;