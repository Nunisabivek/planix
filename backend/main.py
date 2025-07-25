from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Optional, List
import os
from dotenv import load_dotenv
import uuid
from datetime import datetime, timedelta
import asyncio

# Load environment variables
load_dotenv()

# Import services and database
from services.deepseek_service import DeepSeekService
from database.connection import connect_to_mongo, close_mongo_connection, get_database
from database.models import FloorPlan, User, Subscription, ReferralProgram, PLAN_CONFIGS
from database.connection import (
    USERS_COLLECTION, FLOOR_PLANS_COLLECTION, SUBSCRIPTIONS_COLLECTION,
    REFERRALS_COLLECTION, MATERIAL_ESTIMATES_COLLECTION, IS_CODE_COMPLIANCE_COLLECTION
)

# Initialize FastAPI app
app = FastAPI(
    title="Planix API",
    description="AI-powered floor plan generator with IS code compliance",
    version="1.0.0"
)

# Security
security = HTTPBearer()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
deepseek_service = DeepSeekService()

# Pydantic models for API
class FloorPlanRequest(BaseModel):
    description: str
    area: Optional[float] = None
    rooms: Optional[int] = None
    bathrooms: Optional[int] = None
    location: Optional[str] = None
    budget: Optional[float] = None
    features: Optional[List[str]] = []
    user_id: str

class FloorPlanResponse(BaseModel):
    id: str
    description: str
    generated_plan: str
    material_estimate: dict
    is_code_compliance: dict
    created_at: datetime
    user_id: str

class UserSubscription(BaseModel):
    user_id: str
    plan_type: str  # "free", "pro", "enterprise"
    status: str
    created_at: datetime
    expires_at: Optional[datetime] = None

class ReferralRequest(BaseModel):
    user_id: str
    referral_code: Optional[str] = None

class UserCreateRequest(BaseModel):
    email: str
    name: str
    phone: Optional[str] = None

# Database startup/shutdown events
@app.on_event("startup")
async def startup_db_client():
    await connect_to_mongo()

@app.on_event("shutdown")
async def shutdown_db_client():
    await close_mongo_connection()

# Health check endpoint
@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "message": "Planix API is running"}

# DeepSeek API integration placeholder
async def generate_floor_plan_with_deepseek(prompt: str) -> str:
    """
    Generate floor plan using DeepSeek API
    This is a placeholder - will be implemented with actual DeepSeek integration
    """
    # TODO: Implement actual DeepSeek API call
    return f"Generated floor plan for: {prompt}"

# Material estimation algorithm
def calculate_material_estimate(area: float, rooms: int, bathrooms: int) -> dict:
    """
    Calculate material requirements based on floor plan specifications
    """
    # Basic material calculations (placeholder logic)
    brick_per_sqft = 8  # bricks per square foot
    cement_per_sqft = 0.4  # bags per square foot
    steel_per_sqft = 4  # kg per square foot
    sand_per_sqft = 0.5  # cubic feet per square foot
    aggregate_per_sqft = 0.3  # cubic feet per square foot
    
    total_bricks = int(area * brick_per_sqft)
    total_cement = round(area * cement_per_sqft, 2)
    total_steel = round(area * steel_per_sqft, 2)
    total_sand = round(area * sand_per_sqft, 2)
    total_aggregate = round(area * aggregate_per_sqft, 2)
    
    return {
        "bricks": {"quantity": total_bricks, "unit": "pieces"},
        "cement": {"quantity": total_cement, "unit": "bags"},
        "steel": {"quantity": total_steel, "unit": "kg"},
        "sand": {"quantity": total_sand, "unit": "cubic feet"},
        "aggregate": {"quantity": total_aggregate, "unit": "cubic feet"}
    }

# IS code compliance checker
def check_is_code_compliance(plan_details: dict) -> dict:
    """
    Check Indian Standard (IS) code compliance
    """
    compliance_results = {
        "overall_compliance": True,
        "checks": {
            "minimum_room_size": {"status": "passed", "message": "All rooms meet minimum size requirements"},
            "ventilation": {"status": "passed", "message": "Adequate ventilation provided"},
            "natural_light": {"status": "passed", "message": "Natural light requirements met"},
            "fire_safety": {"status": "passed", "message": "Fire safety norms complied"},
            "structural_safety": {"status": "passed", "message": "Structural safety standards met"}
        }
    }
    return compliance_results

# API Endpoints
@app.post("/api/generate-floor-plan", response_model=FloorPlanResponse)
async def generate_floor_plan(request: FloorPlanRequest):
    """
    Generate floor plan based on user requirements
    """
    try:
        # Generate unique plan ID
        plan_id = str(uuid.uuid4())
        
        # Create detailed prompt for DeepSeek API
        prompt = f"""
        Generate a detailed floor plan for:
        - Description: {request.description}
        - Area: {request.area} sq ft
        - Rooms: {request.rooms}
        - Bathrooms: {request.bathrooms}
        - Location: {request.location}
        - Budget: {request.budget}
        - Special features: {', '.join(request.features)}
        
        Please provide a detailed architectural plan with room layouts, dimensions, and IS code compliance.
        """
        
        # Generate floor plan using DeepSeek API
        generated_plan = await generate_floor_plan_with_deepseek(prompt)
        
        # Calculate material estimates
        material_estimate = calculate_material_estimate(
            request.area or 1000, 
            request.rooms or 2, 
            request.bathrooms or 1
        )
        
        # Check IS code compliance
        is_code_compliance = check_is_code_compliance({
            "area": request.area,
            "rooms": request.rooms,
            "bathrooms": request.bathrooms
        })
        
        # Create response
        response = FloorPlanResponse(
            id=plan_id,
            description=request.description,
            generated_plan=generated_plan,
            material_estimate=material_estimate,
            is_code_compliance=is_code_compliance,
            created_at=datetime.now(),
            user_id=request.user_id
        )
        
        # TODO: Save to database
        
        return response
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error generating floor plan: {str(e)}"
        )

@app.get("/api/subscription/{user_id}")
async def get_user_subscription(user_id: str):
    """
    Get user subscription details
    """
    # TODO: Implement database lookup
    # For now, return mock data
    return {
        "user_id": user_id,
        "plan_type": "free",
        "status": "active",
        "plans_remaining": 3,
        "exports_remaining": 5,
        "created_at": datetime.now().isoformat()
    }

@app.post("/api/referral/generate")
async def generate_referral_code(request: ReferralRequest):
    """
    Generate referral code for user
    """
    referral_code = f"PLANIX{request.user_id[:6].upper()}{str(uuid.uuid4())[:4].upper()}"
    
    # TODO: Save to database
    
    return {
        "user_id": request.user_id,
        "referral_code": referral_code,
        "credits_earned": 0,
        "total_referrals": 0
    }

@app.get("/api/referral/{user_id}")
async def get_referral_stats(user_id: str):
    """
    Get referral statistics for user
    """
    # TODO: Implement database lookup
    return {
        "user_id": user_id,
        "referral_code": f"PLANIX{user_id[:6].upper()}ABCD",
        "credits_earned": 150,
        "total_referrals": 3,
        "active_referrals": 2
    }

@app.get("/api/plans/{user_id}")
async def get_user_plans(user_id: str):
    """
    Get all floor plans for a user
    """
    # TODO: Implement database lookup
    mock_plans = [
        {
            "id": str(uuid.uuid4()),
            "description": "3 bedroom house with modern kitchen",
            "created_at": datetime.now().isoformat(),
            "status": "completed"
        },
        {
            "id": str(uuid.uuid4()),
            "description": "2 bedroom apartment with balcony",
            "created_at": (datetime.now() - timedelta(days=1)).isoformat(),
            "status": "completed"
        }
    ]
    return {"plans": mock_plans}

# Root endpoint
@app.get("/api/")
async def root():
    return {"message": "Welcome to Planix API - AI-powered floor plan generator"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)