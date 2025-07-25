from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
import uuid

class User(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: str
    name: str
    phone: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.now)
    subscription_type: str = "free"  # free, pro, enterprise
    subscription_status: str = "active"
    subscription_expires: Optional[datetime] = None
    plans_used: int = 0
    exports_used: int = 0
    referral_code: Optional[str] = None
    referred_by: Optional[str] = None
    total_referrals: int = 0
    referral_credits: int = 0

class FloorPlan(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    title: str
    description: str
    area: Optional[float] = None
    rooms: Optional[int] = None
    bathrooms: Optional[int] = None
    location: Optional[str] = None
    budget: Optional[float] = None
    features: List[str] = []
    generated_plan: str
    material_estimate: Dict[str, Any] = {}
    is_code_compliance: Dict[str, Any] = {}
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)
    status: str = "completed"  # generating, completed, failed
    export_count: int = 0

class MaterialEstimate(BaseModel):
    plan_id: str
    materials: Dict[str, Any]
    total_cost_estimate: Optional[float] = None
    location_based_pricing: Optional[Dict[str, Any]] = None
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)

class ISCodeCompliance(BaseModel):
    plan_id: str
    overall_compliance: bool
    checks: Dict[str, Any]
    recommendations: List[str] = []
    critical_issues: List[str] = []
    compliance_score: Optional[float] = None
    created_at: datetime = Field(default_factory=datetime.now)

class Subscription(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    plan_type: str  # free, pro, enterprise
    status: str  # active, inactive, cancelled, expired
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)
    expires_at: Optional[datetime] = None
    auto_renew: bool = True
    payment_method: Optional[str] = None
    razorpay_subscription_id: Optional[str] = None
    
    # Plan limits
    monthly_plans_limit: int = 3  # free plan default
    monthly_exports_limit: int = 5  # free plan default
    advanced_features: bool = False
    priority_support: bool = False
    api_access: bool = False

class ReferralProgram(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    referrer_user_id: str
    referred_user_id: str
    referral_code: str
    status: str  # pending, active, completed
    credits_earned: int = 0
    created_at: datetime = Field(default_factory=datetime.now)
    activated_at: Optional[datetime] = None
    
class Payment(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    subscription_id: str
    amount: float
    currency: str = "INR"
    payment_method: str
    razorpay_payment_id: Optional[str] = None
    razorpay_order_id: Optional[str] = None
    status: str  # created, processing, completed, failed
    created_at: datetime = Field(default_factory=datetime.now)
    completed_at: Optional[datetime] = None
    failure_reason: Optional[str] = None

# Plan configuration
PLAN_CONFIGS = {
    "free": {
        "monthly_plans_limit": 3,
        "monthly_exports_limit": 5,
        "advanced_features": False,
        "priority_support": False,
        "api_access": False,
        "price": 0,
        "features": [
            "3 floor plans per month",
            "5 exports per month",
            "Basic room types",
            "DXF & SVG export",
            "Community support"
        ]
    },
    "pro": {
        "monthly_plans_limit": -1,  # unlimited
        "monthly_exports_limit": -1,  # unlimited
        "advanced_features": True,
        "priority_support": True,
        "api_access": False,
        "price": 999,
        "features": [
            "Unlimited floor plans",
            "Unlimited exports",
            "Advanced room types",
            "All export formats (DXF, SVG, PDF, PNG)",
            "Custom dimensions",
            "Priority support",
            "No watermarks",
            "Collaboration tools"
        ]
    },
    "enterprise": {
        "monthly_plans_limit": -1,  # unlimited
        "monthly_exports_limit": -1,  # unlimited
        "advanced_features": True,
        "priority_support": True,
        "api_access": True,
        "price": 99,  # $99 USD
        "features": [
            "Everything in Pro",
            "Team collaboration",
            "API access",
            "Custom branding",
            "Advanced analytics",
            "Dedicated support",
            "SSO integration",
            "Custom integrations"
        ]
    }
}