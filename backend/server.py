from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv
import motor.motor_asyncio
import uuid
from enum import Enum

# Load environment variables
load_dotenv()

# Database connection
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017/stationery_franchise")
client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_URL)
db = client.get_default_database()

# FastAPI app
app = FastAPI(
    title="Stationery Franchise MVP API",
    description="API for Michele Aranha Personalizados Stationery Franchise Landing Page",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer()

# Pydantic models
class FranchisePlanType(str, Enum):
    STARTER = "starter"
    PROFESSIONAL = "professional"
    PREMIUM = "premium"
    ENTERPRISE = "enterprise"

class Equipment(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    description: str
    specifications: Dict[str, Any]
    image_url: Optional[str] = None
    category: str

class FranchisePlan(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    type: FranchisePlanType
    price: float
    monthly_royalty: float
    setup_fee: float
    equipment_included: List[str]
    features: List[str]
    support_level: str
    training_hours: int
    description: str
    popular: bool = False

class ContactInquiry(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    phone: str
    message: str
    inquiry_type: str = "general"
    created_at: datetime = Field(default_factory=datetime.utcnow)
    status: str = "new"

class FranchiseApplication(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    phone: str
    city: str
    state: str
    investment_capacity: float
    business_experience: str
    preferred_plan: FranchisePlanType
    message: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    status: str = "pending"

# API Routes

@app.get("/")
async def root():
    return {"message": "Stationery Franchise MVP API is running"}

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow()}

# Equipment endpoints
@app.get("/api/equipment", response_model=List[Equipment])
async def get_equipment():
    """Get all equipment available in the franchise package"""
    equipment_list = [
        Equipment(
            name="T3170x Continuous Ink Printer",
            description="High-quality continuous ink printer for professional printing",
            specifications={
                "type": "Inkjet Printer",
                "ink_system": "Continuous Ink",
                "print_speed": "15 ipm",
                "resolution": "5760 x 1440 dpi",
                "paper_sizes": ["A4", "Letter", "Legal"]
            },
            category="printing",
            image_url="https://example.com/t3170x.jpg"
        ),
        Equipment(
            name="WF5280 Continuous Ink Printer",
            description="Multi-function continuous ink printer with scanning capabilities",
            specifications={
                "type": "Multi-function Printer",
                "ink_system": "Continuous Ink",
                "functions": ["Print", "Scan", "Copy", "Fax"],
                "print_speed": "20 ipm",
                "resolution": "4800 x 1200 dpi"
            },
            category="printing",
            image_url="https://example.com/wf5280.jpg"
        ),
        Equipment(
            name="L1250 Sublimation Printer",
            description="Specialized sublimation printer for custom products",
            specifications={
                "type": "Sublimation Printer",
                "ink_system": "Continuous Ink",
                "print_width": "210mm",
                "resolution": "5760 x 1440 dpi",
                "specialty": "Sublimation printing"
            },
            category="sublimation",
            image_url="https://example.com/l1250.jpg"
        ),
        Equipment(
            name="Mug Printing Press",
            description="Professional mug heat press for sublimation",
            specifications={
                "type": "Heat Press",
                "application": "Mugs",
                "temperature_range": "0-250°C",
                "pressure": "Adjustable",
                "timer": "Digital timer"
            },
            category="pressing",
            image_url="https://example.com/mug-press.jpg"
        ),
        Equipment(
            name="40x60cm Flat Press",
            description="Large format flat heat press for various sublimation products",
            specifications={
                "type": "Flat Heat Press",
                "size": "40x60cm",
                "temperature_range": "0-250°C",
                "pressure": "Adjustable",
                "applications": ["T-shirts", "Mousepads", "Bags"]
            },
            category="pressing",
            image_url="https://example.com/flat-press.jpg"
        ),
        Equipment(
            name="Silhouette Cameo 5",
            description="Professional cutting machine for vinyl and other materials",
            specifications={
                "type": "Cutting Machine",
                "cutting_width": "12 inches",
                "cutting_length": "10 feet",
                "materials": ["Vinyl", "Cardstock", "Fabric"],
                "software": "Silhouette Studio"
            },
            category="cutting",
            image_url="https://example.com/cameo5.jpg"
        ),
        Equipment(
            name="i7 Computer Setup",
            description="High-performance computer with professional graphic software",
            specifications={
                "processor": "Intel i7",
                "ram": "16GB",
                "storage": "512GB SSD",
                "graphics": "Dedicated GPU",
                "software": ["Adobe Creative Suite", "CorelDRAW", "Silhouette Studio"]
            },
            category="computing",
            image_url="https://example.com/computer.jpg"
        ),
        Equipment(
            name="40 inch TV Monitor",
            description="Large display for design work and customer presentations",
            specifications={
                "size": "40 inches",
                "resolution": "4K Ultra HD",
                "connectivity": ["HDMI", "USB", "Bluetooth"],
                "use": "Design work and presentations"
            },
            category="display",
            image_url="https://example.com/tv-monitor.jpg"
        ),
        Equipment(
            name="Plate Maker",
            description="Professional plate making equipment for custom plates",
            specifications={
                "type": "Plate Maker",
                "materials": ["Ceramic", "Glass"],
                "size_range": "6-12 inches",
                "temperature": "Variable"
            },
            category="specialty",
            image_url="https://example.com/plate-maker.jpg"
        ),
        Equipment(
            name="Bookbinder",
            description="Professional bookbinding equipment for custom books and notebooks",
            specifications={
                "type": "Bookbinder",
                "binding_types": ["Perfect Bound", "Saddle Stitch", "Spiral"],
                "paper_capacity": "500 sheets",
                "automation": "Semi-automatic"
            },
            category="binding",
            image_url="https://example.com/bookbinder.jpg"
        ),
        Equipment(
            name="TTS-Pro 20 Laser Cutting Machine",
            description="Professional laser cutting machine for precision cutting",
            specifications={
                "type": "Laser Cutter",
                "cutting_area": "20x20 inches",
                "laser_power": "40W",
                "materials": ["Acrylic", "Wood", "Paper", "Fabric"],
                "software": "Compatible with various CAD software"
            },
            category="cutting",
            image_url="https://example.com/laser-cutter.jpg"
        )
    ]
    return equipment_list

# Franchise plans endpoints
@app.get("/api/franchise-plans", response_model=List[FranchisePlan])
async def get_franchise_plans():
    """Get all available franchise plans"""
    plans = [
        FranchisePlan(
            name="Starter Package",
            type=FranchisePlanType.STARTER,
            price=25000.00,
            monthly_royalty=1500.00,
            setup_fee=5000.00,
            equipment_included=[
                "T3170x Continuous Ink Printer",
                "Basic computer setup",
                "Silhouette Cameo 5",
                "Basic furniture package"
            ],
            features=[
                "Basic equipment package",
                "Initial training (40 hours)",
                "Standard support",
                "Marketing materials",
                "Basic software package"
            ],
            support_level="Email and phone support",
            training_hours=40,
            description="Perfect for entrepreneurs starting their stationery business with essential equipment and support.",
            popular=False
        ),
        FranchisePlan(
            name="Professional Package",
            type=FranchisePlanType.PROFESSIONAL,
            price=45000.00,
            monthly_royalty=2500.00,
            setup_fee=7500.00,
            equipment_included=[
                "T3170x Continuous Ink Printer",
                "WF5280 Continuous Ink Printer",
                "L1250 Sublimation Printer",
                "Mug Printing Press",
                "i7 Computer Setup",
                "40 inch TV Monitor",
                "Complete furniture package"
            ],
            features=[
                "Professional equipment package",
                "Extended training (80 hours)",
                "Priority support",
                "Advanced marketing materials",
                "Full software suite",
                "Sublimation capabilities"
            ],
            support_level="Priority phone and email support",
            training_hours=80,
            description="Comprehensive package for serious entrepreneurs ready to offer full stationery and sublimation services.",
            popular=True
        ),
        FranchisePlan(
            name="Premium Package",
            type=FranchisePlanType.PREMIUM,
            price=70000.00,
            monthly_royalty=3500.00,
            setup_fee=10000.00,
            equipment_included=[
                "All Professional Package items",
                "40x60cm Flat Press",
                "Plate Maker",
                "Bookbinder",
                "TTS-Pro 20 Laser Cutting Machine",
                "Premium furniture package"
            ],
            features=[
                "Premium equipment package",
                "Comprehensive training (120 hours)",
                "Dedicated support manager",
                "Premium marketing materials",
                "Advanced software suite",
                "Laser cutting capabilities",
                "Custom product development"
            ],
            support_level="Dedicated support manager",
            training_hours=120,
            description="Complete premium package for established businesses wanting to offer the full range of custom stationery and products.",
            popular=False
        ),
        FranchisePlan(
            name="Enterprise Package",
            type=FranchisePlanType.ENTERPRISE,
            price=100000.00,
            monthly_royalty=5000.00,
            setup_fee=15000.00,
            equipment_included=[
                "All Premium Package items",
                "Additional backup equipment",
                "Advanced computer setup",
                "Premium display systems",
                "Complete workshop setup"
            ],
            features=[
                "Enterprise-grade equipment",
                "Extensive training (200 hours)",
                "24/7 dedicated support",
                "Custom marketing campaigns",
                "Enterprise software suite",
                "Territory protection",
                "Multi-location support",
                "Custom branding package"
            ],
            support_level="24/7 dedicated support team",
            training_hours=200,
            description="Ultimate enterprise solution for large-scale operations with multiple locations and extensive custom capabilities.",
            popular=False
        )
    ]
    return plans

@app.get("/api/franchise-plans/{plan_type}", response_model=FranchisePlan)
async def get_franchise_plan(plan_type: FranchisePlanType):
    """Get specific franchise plan details"""
    plans = await get_franchise_plans()
    for plan in plans:
        if plan.type == plan_type:
            return plan
    raise HTTPException(status_code=404, detail="Franchise plan not found")

# Contact and inquiry endpoints
@app.post("/api/contact", response_model=Dict[str, str])
async def submit_contact_inquiry(inquiry: ContactInquiry):
    """Submit a contact inquiry"""
    try:
        # Insert into database
        result = await db.contact_inquiries.insert_one(inquiry.dict())
        
        return {
            "message": "Contact inquiry submitted successfully",
            "inquiry_id": inquiry.id,
            "status": "received"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to submit inquiry: {str(e)}")

@app.post("/api/franchise-application", response_model=Dict[str, str])
async def submit_franchise_application(application: FranchiseApplication):
    """Submit a franchise application"""
    try:
        # Insert into database
        result = await db.franchise_applications.insert_one(application.dict())
        
        return {
            "message": "Franchise application submitted successfully",
            "application_id": application.id,
            "status": "received",
            "next_steps": "Our team will review your application and contact you within 48 hours"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to submit application: {str(e)}")

# MVP Manual and documentation endpoints
@app.get("/api/manual")
async def get_mvp_manual():
    """Get MVP manual and documentation"""
    return {
        "title": "Michele Aranha Personalizados - Franchise MVP Manual",
        "sections": [
            {
                "title": "Getting Started",
                "content": [
                    "Welcome to the Michele Aranha Personalizados franchise family",
                    "This manual will guide you through the setup and operation of your franchise",
                    "Follow the step-by-step instructions for optimal results"
                ]
            },
            {
                "title": "Equipment Setup",
                "content": [
                    "Unpack and inspect all equipment upon delivery",
                    "Follow manufacturer guidelines for initial setup",
                    "Test all equipment before beginning operations",
                    "Ensure proper ventilation for printing equipment"
                ]
            },
            {
                "title": "Software Installation",
                "content": [
                    "Install provided software suite on your computer",
                    "Configure printers and cutting machines",
                    "Test all software connections",
                    "Create backup of all software and settings"
                ]
            },
            {
                "title": "Operations Guide",
                "content": [
                    "Daily startup procedures",
                    "Order processing workflow",
                    "Quality control standards",
                    "Customer service guidelines"
                ]
            },
            {
                "title": "Marketing & Sales",
                "content": [
                    "Use provided marketing materials",
                    "Local advertising strategies",
                    "Customer acquisition techniques",
                    "Pricing guidelines and profit margins"
                ]
            }
        ],
        "launch_schedule": {
            "week_1": "Equipment delivery and setup",
            "week_2": "Software installation and training",
            "week_3": "Test operations and quality checks",
            "week_4": "Marketing launch and first customers"
        }
    }

@app.get("/api/launch-schedule")
async def get_launch_schedule():
    """Get detailed launch schedule and timeline"""
    return {
        "timeline": {
            "pre_launch": {
                "duration": "30 days",
                "activities": [
                    "Franchise agreement signing",
                    "Initial payment processing",
                    "Equipment ordering and shipping",
                    "Location preparation",
                    "Staff recruitment (if needed)"
                ]
            },
            "setup_phase": {
                "duration": "14 days",
                "activities": [
                    "Equipment delivery and installation",
                    "Software setup and configuration",
                    "Initial training sessions",
                    "Quality testing and calibration"
                ]
            },
            "training_phase": {
                "duration": "7-14 days",
                "activities": [
                    "Hands-on equipment training",
                    "Software mastery sessions",
                    "Business operations training",
                    "Marketing and sales training"
                ]
            },
            "launch_phase": {
                "duration": "7 days",
                "activities": [
                    "Soft launch with test customers",
                    "Marketing campaign activation",
                    "Grand opening preparation",
                    "First week operations support"
                ]
            }
        },
        "total_timeline": "45-60 days from signing to full operation",
        "critical_milestones": [
            "Equipment delivery confirmation",
            "Training completion certification",
            "Quality assurance approval",
            "Marketing launch authorization"
        ]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)