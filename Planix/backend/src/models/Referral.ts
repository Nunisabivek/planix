import mongoose, { Document, Schema } from 'mongoose';

export interface IReferral extends Document {
  id: string;
  referrerUserId: mongoose.Types.ObjectId;
  referredUserId: mongoose.Types.ObjectId;
  referralCode: string;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  creditsEarned: number;
  creditsAwarded: number;
  activatedAt?: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  
  // Methods
  activate(): void;
  complete(): void;
  awardCredits(amount: number): void;
}

const ReferralSchema: Schema = new Schema({
  referrerUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  referredUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  referralCode: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'completed', 'cancelled'],
    default: 'pending'
  },
  creditsEarned: {
    type: Number,
    default: 0
  },
  creditsAwarded: {
    type: Number,
    default: 0
  },
  activatedAt: {
    type: Date
  },
  completedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Indexes
ReferralSchema.index({ referrerUserId: 1, status: 1 });
ReferralSchema.index({ referredUserId: 1 });
ReferralSchema.index({ referralCode: 1 });

// Activate referral
ReferralSchema.methods.activate = function(): void {
  this.status = 'active';
  this.activatedAt = new Date();
};

// Complete referral
ReferralSchema.methods.complete = function(): void {
  this.status = 'completed';
  this.completedAt = new Date();
};

// Award credits
ReferralSchema.methods.awardCredits = function(amount: number): void {
  this.creditsEarned += amount;
  this.creditsAwarded += amount;
};

export default mongoose.model<IReferral>('Referral', ReferralSchema);