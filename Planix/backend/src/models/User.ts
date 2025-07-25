import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  id: string;
  email: string;
  name: string;
  phone?: string;
  password?: string;
  isVerified: boolean;
  subscriptionType: 'free' | 'pro' | 'enterprise';
  subscriptionStatus: 'active' | 'inactive' | 'cancelled' | 'expired';
  subscriptionExpiresAt?: Date;
  plansUsed: number;
  exportsUsed: number;
  referralCode?: string;
  referredBy?: string;
  totalReferrals: number;
  referralCredits: number;
  lastPlanResetAt: Date;
  lastExportResetAt: Date;
  createdAt: Date;
  updatedAt: Date;
  
  // Methods
  comparePassword(candidatePassword: string): Promise<boolean>;
  generateReferralCode(): string;
  canCreatePlan(): boolean;
  canExportPlan(): boolean;
  resetMonthlyUsage(): void;
}

const UserSchema: Schema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  password: {
    type: String,
    minlength: 6
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  subscriptionType: {
    type: String,
    enum: ['free', 'pro', 'enterprise'],
    default: 'free'
  },
  subscriptionStatus: {
    type: String,
    enum: ['active', 'inactive', 'cancelled', 'expired'],
    default: 'active'
  },
  subscriptionExpiresAt: {
    type: Date
  },
  plansUsed: {
    type: Number,
    default: 0
  },
  exportsUsed: {
    type: Number,
    default: 0
  },
  referralCode: {
    type: String,
    unique: true,
    sparse: true
  },
  referredBy: {
    type: String
  },
  totalReferrals: {
    type: Number,
    default: 0
  },
  referralCredits: {
    type: Number,
    default: 0
  },
  lastPlanResetAt: {
    type: Date,
    default: Date.now
  },
  lastExportResetAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Plan limits configuration
const PLAN_LIMITS = {
  free: {
    monthlyPlansLimit: 3,
    monthlyExportsLimit: 5,
    advancedFeatures: false,
    prioritySupport: false,
    apiAccess: false
  },
  pro: {
    monthlyPlansLimit: -1, // unlimited
    monthlyExportsLimit: -1, // unlimited
    advancedFeatures: true,
    prioritySupport: true,
    apiAccess: false
  },
  enterprise: {
    monthlyPlansLimit: -1, // unlimited
    monthlyExportsLimit: -1, // unlimited
    advancedFeatures: true,
    prioritySupport: true,
    apiAccess: true
  }
};

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  if (this.password) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});

// Generate referral code
UserSchema.methods.generateReferralCode = function(): string {
  const code = `PLANIX${this._id.toString().slice(-6).toUpperCase()}${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
  this.referralCode = code;
  return code;
};

// Compare password
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

// Check if user can create a plan
UserSchema.methods.canCreatePlan = function(): boolean {
  const limits = PLAN_LIMITS[this.subscriptionType as keyof typeof PLAN_LIMITS];
  
  if (limits.monthlyPlansLimit === -1) return true; // unlimited
  
  // Check if monthly usage should be reset
  const now = new Date();
  const lastReset = new Date(this.lastPlanResetAt);
  const daysSinceReset = (now.getTime() - lastReset.getTime()) / (1000 * 60 * 60 * 24);
  
  if (daysSinceReset >= 30) {
    this.plansUsed = 0;
    this.lastPlanResetAt = now;
  }
  
  return this.plansUsed < limits.monthlyPlansLimit;
};

// Check if user can export a plan
UserSchema.methods.canExportPlan = function(): boolean {
  const limits = PLAN_LIMITS[this.subscriptionType as keyof typeof PLAN_LIMITS];
  
  if (limits.monthlyExportsLimit === -1) return true; // unlimited
  
  // Check if monthly usage should be reset
  const now = new Date();
  const lastReset = new Date(this.lastExportResetAt);
  const daysSinceReset = (now.getTime() - lastReset.getTime()) / (1000 * 60 * 60 * 24);
  
  if (daysSinceReset >= 30) {
    this.exportsUsed = 0;
    this.lastExportResetAt = now;
  }
  
  return this.exportsUsed < limits.monthlyExportsLimit;
};

// Reset monthly usage
UserSchema.methods.resetMonthlyUsage = function(): void {
  this.plansUsed = 0;
  this.exportsUsed = 0;
  this.lastPlanResetAt = new Date();
  this.lastExportResetAt = new Date();
};

export default mongoose.model<IUser>('User', UserSchema);
export { PLAN_LIMITS };