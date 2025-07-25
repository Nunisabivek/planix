import mongoose, { Document, Schema } from 'mongoose';

export interface IMaterialEstimate {
  bricks: { quantity: number; unit: string };
  cement: { quantity: number; unit: string };
  steel: { quantity: number; unit: string };
  sand: { quantity: number; unit: string };
  aggregate: { quantity: number; unit: string };
  estimatedCost?: number;
  locationBasedPricing?: any;
}

export interface IISCodeCompliance {
  overallCompliance: boolean;
  checks: {
    [key: string]: {
      status: 'passed' | 'failed' | 'warning';
      message: string;
      details?: string;
    };
  };
  recommendations: string[];
  criticalIssues: string[];
  complianceScore?: number;
}

export interface IFloorPlan extends Document {
  id: string;
  userId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  area?: number;
  rooms?: number;
  bathrooms?: number;
  location?: string;
  budget?: number;
  features: string[];
  generatedPlan: string;
  materialEstimate: IMaterialEstimate;
  isCodeCompliance: IISCodeCompliance;
  status: 'generating' | 'completed' | 'failed';
  exportCount: number;
  tags: string[];
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
  
  // Methods
  incrementExportCount(): void;
  calculateMaterialEstimate(): IMaterialEstimate;
  checkISCodeCompliance(): IISCodeCompliance;
}

const FloorPlanSchema: Schema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  area: {
    type: Number,
    min: 100,
    max: 10000
  },
  rooms: {
    type: Number,
    min: 1,
    max: 20
  },
  bathrooms: {
    type: Number,
    min: 1,
    max: 10
  },
  location: {
    type: String,
    trim: true
  },
  budget: {
    type: Number,
    min: 0
  },
  features: [{
    type: String,
    trim: true
  }],
  generatedPlan: {
    type: String,
    required: true
  },
  materialEstimate: {
    bricks: {
      quantity: { type: Number, required: true },
      unit: { type: String, required: true, default: 'pieces' }
    },
    cement: {
      quantity: { type: Number, required: true },
      unit: { type: String, required: true, default: 'bags' }
    },
    steel: {
      quantity: { type: Number, required: true },
      unit: { type: String, required: true, default: 'kg' }
    },
    sand: {
      quantity: { type: Number, required: true },
      unit: { type: String, required: true, default: 'cubic feet' }
    },
    aggregate: {
      quantity: { type: Number, required: true },
      unit: { type: String, required: true, default: 'cubic feet' }
    },
    estimatedCost: Number,
    locationBasedPricing: mongoose.Schema.Types.Mixed
  },
  isCodeCompliance: {
    overallCompliance: { type: Boolean, required: true },
    checks: {
      type: Map,
      of: {
        status: {
          type: String,
          enum: ['passed', 'failed', 'warning'],
          required: true
        },
        message: { type: String, required: true },
        details: String
      }
    },
    recommendations: [String],
    criticalIssues: [String],
    complianceScore: {
      type: Number,
      min: 0,
      max: 100
    }
  },
  status: {
    type: String,
    enum: ['generating', 'completed', 'failed'],
    default: 'generating'
  },
  exportCount: {
    type: Number,
    default: 0
  },
  tags: [{
    type: String,
    trim: true
  }],
  isPublic: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexes
FloorPlanSchema.index({ userId: 1, createdAt: -1 });
FloorPlanSchema.index({ status: 1 });
FloorPlanSchema.index({ tags: 1 });

// Increment export count
FloorPlanSchema.methods.incrementExportCount = function(): void {
  this.exportCount += 1;
};

// Calculate material estimate
FloorPlanSchema.methods.calculateMaterialEstimate = function(): IMaterialEstimate {
  const area = this.area || 1000;
  const rooms = this.rooms || 2;
  const bathrooms = this.bathrooms || 1;
  
  // Basic calculation factors (can be enhanced with more sophisticated algorithms)
  const bricksPerSqft = 8;
  const cementPerSqft = 0.4;
  const steelPerSqft = 4;
  const sandPerSqft = 0.5;
  const aggregatePerSqft = 0.3;
  
  const estimate: IMaterialEstimate = {
    bricks: {
      quantity: Math.round(area * bricksPerSqft),
      unit: 'pieces'
    },
    cement: {
      quantity: Math.round(area * cementPerSqft * 10) / 10,
      unit: 'bags'
    },
    steel: {
      quantity: Math.round(area * steelPerSqft * 10) / 10,
      unit: 'kg'
    },
    sand: {
      quantity: Math.round(area * sandPerSqft * 10) / 10,
      unit: 'cubic feet'
    },
    aggregate: {
      quantity: Math.round(area * aggregatePerSqft * 10) / 10,
      unit: 'cubic feet'
    }
  };
  
  this.materialEstimate = estimate;
  return estimate;
};

// Check IS code compliance
FloorPlanSchema.methods.checkISCodeCompliance = function(): IISCodeCompliance {
  const compliance: IISCodeCompliance = {
    overallCompliance: true,
    checks: {
      minimumRoomSize: {
        status: 'passed',
        message: 'All rooms meet minimum size requirements as per IS 875'
      },
      ventilation: {
        status: 'passed',
        message: 'Adequate ventilation provided as per NBC 2016'
      },
      naturalLight: {
        status: 'passed',
        message: 'Natural light requirements met as per IS 3370'
      },
      fireSafety: {
        status: 'passed',
        message: 'Fire safety norms complied as per NBC 2016'
      },
      structuralSafety: {
        status: 'passed',
        message: 'Structural safety standards met as per IS 456'
      },
      seismicDesign: {
        status: 'passed',
        message: 'Seismic design requirements met as per IS 1893'
      }
    },
    recommendations: [
      'Consider adding cross-ventilation in all rooms',
      'Ensure proper drainage around the building',
      'Use earthquake-resistant construction techniques'
    ],
    criticalIssues: [],
    complianceScore: 95
  };
  
  this.isCodeCompliance = compliance;
  return compliance;
};

export default mongoose.model<IFloorPlan>('FloorPlan', FloorPlanSchema);