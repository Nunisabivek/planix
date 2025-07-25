import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

class Database:
    client: AsyncIOMotorClient = None
    database = None

db = Database()

async def connect_to_mongo():
    """Create database connection"""
    mongo_url = os.getenv('MONGO_URL', 'mongodb://localhost:27017/planix')
    db.client = AsyncIOMotorClient(mongo_url)
    db.database = db.client.planix
    
    # Test connection
    try:
        await db.client.admin.command('ping')
        print("Connected to MongoDB successfully!")
    except Exception as e:
        print(f"Error connecting to MongoDB: {e}")

async def close_mongo_connection():
    """Close database connection"""
    if db.client:
        db.client.close()
        print("MongoDB connection closed")

def get_database():
    """Get database instance"""
    return db.database

# Collection names
USERS_COLLECTION = "users"
FLOOR_PLANS_COLLECTION = "floor_plans"
SUBSCRIPTIONS_COLLECTION = "subscriptions"
REFERRALS_COLLECTION = "referrals"
PAYMENTS_COLLECTION = "payments"
MATERIAL_ESTIMATES_COLLECTION = "material_estimates"
IS_CODE_COMPLIANCE_COLLECTION = "is_code_compliance"