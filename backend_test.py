#!/usr/bin/env python3
"""
Comprehensive Backend API Testing for Planix Node.js/Express API
Tests all API endpoints with realistic data and JWT authentication
"""

import requests
import json
import uuid
import time
from datetime import datetime
from typing import Dict, Any

# Configuration
BASE_URL = "http://localhost:8001/api"
TIMEOUT = 30

class PlanixAPITester:
    def __init__(self):
        self.session = requests.Session()
        self.test_user_id = None
        self.test_plan_id = None
        self.auth_token = None
        self.test_results = []
        
    def log_test(self, test_name: str, success: bool, details: str = ""):
        """Log test results"""
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}")
        if details:
            print(f"   Details: {details}")
        
        self.test_results.append({
            "test": test_name,
            "success": success,
            "details": details,
            "timestamp": datetime.now().isoformat()
        })
    
    def set_auth_header(self, token):
        """Set authorization header for authenticated requests"""
        if token:
            self.session.headers.update({'Authorization': f'Bearer {token}'})
        else:
            self.session.headers.pop('Authorization', None)
    
    def test_health_check(self):
        """Test health check endpoint"""
        try:
            response = self.session.get(f"{BASE_URL}/health", timeout=TIMEOUT)
            
            if response.status_code == 200:
                data = response.json()
                if data.get("status") == "healthy" and "Planix" in data.get("message", ""):
                    self.log_test("Health Check", True, f"API is healthy - Version: {data.get('version')}")
                    return True
                else:
                    self.log_test("Health Check", False, f"Unexpected response: {data}")
                    return False
            else:
                self.log_test("Health Check", False, f"HTTP {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Health Check", False, f"Exception: {str(e)}")
            return False
    
    def test_register_user(self):
        """Test user registration endpoint"""
        try:
            user_data = {
                "email": "architect.sharma@planix.com",
                "name": "Rajesh Sharma",
                "phone": "+91-9876543210",
                "password": "SecurePass123!"
            }
            
            response = self.session.post(
                f"{BASE_URL}/auth/register",
                json=user_data,
                timeout=TIMEOUT
            )
            
            if response.status_code == 201:
                data = response.json()
                if data.get("success") and "user" in data and "token" in data:
                    self.test_user_id = data["user"]["id"]
                    self.auth_token = data["token"]
                    self.set_auth_header(self.auth_token)
                    self.log_test("Register User", True, f"User registered with ID: {self.test_user_id}")
                    return True
                else:
                    self.log_test("Register User", False, f"Missing fields in response: {data}")
                    return False
            else:
                self.log_test("Register User", False, f"HTTP {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Register User", False, f"Exception: {str(e)}")
            return False
    
    def test_login_user(self):
        """Test user login endpoint"""
        try:
            login_data = {
                "email": "architect.sharma@planix.com",
                "password": "SecurePass123!"
            }
            
            response = self.session.post(
                f"{BASE_URL}/auth/login",
                json=login_data,
                timeout=TIMEOUT
            )
            
            if response.status_code == 200:
                data = response.json()
                if data.get("success") and "user" in data and "token" in data:
                    self.auth_token = data["token"]
                    self.set_auth_header(self.auth_token)
                    self.log_test("Login User", True, f"Login successful for user: {data['user']['name']}")
                    return True
                else:
                    self.log_test("Login User", False, f"Missing fields in response: {data}")
                    return False
            else:
                self.log_test("Login User", False, f"HTTP {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Login User", False, f"Exception: {str(e)}")
            return False
    
    def test_get_user_profile(self):
        """Test protected user profile endpoint"""
        if not self.auth_token:
            self.log_test("Get User Profile", False, "No auth token available")
            return False
            
        try:
            response = self.session.get(
                f"{BASE_URL}/user/profile",
                timeout=TIMEOUT
            )
            
            if response.status_code == 200:
                data = response.json()
                if data.get("success") and "user" in data:
                    user = data["user"]
                    if user.get("email") == "architect.sharma@planix.com":
                        self.log_test("Get User Profile", True, f"Profile retrieved for: {user['name']}")
                        return True
                    else:
                        self.log_test("Get User Profile", False, f"User data mismatch: {user}")
                        return False
                else:
                    self.log_test("Get User Profile", False, f"Invalid response structure: {data}")
                    return False
            else:
                self.log_test("Get User Profile", False, f"HTTP {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Get User Profile", False, f"Exception: {str(e)}")
            return False
    
    def test_generate_floor_plan(self):
        """Test floor plan generation endpoint with real AI"""
        if not self.auth_token:
            self.log_test("Generate Floor Plan", False, "No auth token available")
            return False
            
        try:
            plan_request = {
                "description": "Modern 3BHK apartment with open kitchen, spacious living room, master bedroom with attached bathroom, two additional bedrooms, guest bathroom, and balcony. Located in Mumbai with good ventilation and natural light.",
                "area": 1200,
                "rooms": 3,
                "bathrooms": 2,
                "location": "Mumbai, Maharashtra",
                "budget": 2500000,
                "features": ["open_kitchen", "balcony", "master_suite", "guest_bathroom", "storage_room"]
            }
            
            response = self.session.post(
                f"{BASE_URL}/floor-plans",
                json=plan_request,
                timeout=TIMEOUT
            )
            
            if response.status_code == 201:
                data = response.json()
                if data.get("success") and "floorPlan" in data:
                    self.test_plan_id = data["floorPlan"]["id"]
                    self.log_test("Generate Floor Plan", True, f"Floor plan generation initiated with ID: {self.test_plan_id}")
                    return True
                else:
                    self.log_test("Generate Floor Plan", False, f"Invalid response structure: {data}")
                    return False
            else:
                self.log_test("Generate Floor Plan", False, f"HTTP {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Generate Floor Plan", False, f"Exception: {str(e)}")
            return False
    
    def test_get_floor_plan_detail(self):
        """Test get floor plan detail endpoint"""
        if not self.test_plan_id or not self.auth_token:
            self.log_test("Get Floor Plan Detail", False, "No test plan ID or auth token available")
            return False
            
        # Wait for plan generation to complete
        time.sleep(5)
            
        try:
            response = self.session.get(
                f"{BASE_URL}/floor-plans/{self.test_plan_id}",
                timeout=TIMEOUT
            )
            
            if response.status_code == 200:
                data = response.json()
                if data.get("success") and "floorPlan" in data:
                    plan = data["floorPlan"]
                    if plan.get("status") == "completed":
                        self.log_test("Get Floor Plan Detail", True, f"Floor plan completed with AI generation")
                        return True
                    elif plan.get("status") == "generating":
                        self.log_test("Get Floor Plan Detail", True, f"Floor plan still generating (expected)")
                        return True
                    else:
                        self.log_test("Get Floor Plan Detail", False, f"Plan status: {plan.get('status')}")
                        return False
                else:
                    self.log_test("Get Floor Plan Detail", False, f"Invalid response structure: {data}")
                    return False
            else:
                self.log_test("Get Floor Plan Detail", False, f"HTTP {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Get Floor Plan Detail", False, f"Exception: {str(e)}")
            return False
    
    def test_get_user_floor_plans(self):
        """Test get user's floor plans endpoint"""
        if not self.auth_token:
            self.log_test("Get User Floor Plans", False, "No auth token available")
            return False
            
        try:
            response = self.session.get(
                f"{BASE_URL}/floor-plans/user/me",
                timeout=TIMEOUT
            )
            
            if response.status_code == 200:
                data = response.json()
                if data.get("success") and "floorPlans" in data:
                    plans = data["floorPlans"]
                    if isinstance(plans, list):
                        self.log_test("Get User Floor Plans", True, f"Retrieved {len(plans)} floor plans")
                        return True
                    else:
                        self.log_test("Get User Floor Plans", False, f"Invalid plans data: {plans}")
                        return False
                else:
                    self.log_test("Get User Floor Plans", False, f"Invalid response structure: {data}")
                    return False
            else:
                self.log_test("Get User Floor Plans", False, f"HTTP {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Get User Floor Plans", False, f"Exception: {str(e)}")
            return False
    
    def test_get_subscription_plans(self):
        """Test get subscription plans endpoint"""
        try:
            response = self.session.get(
                f"{BASE_URL}/subscriptions/plans",
                timeout=TIMEOUT
            )
            
            if response.status_code == 200:
                data = response.json()
                if data.get("success") and "plans" in data:
                    plans = data["plans"]
                    if "free" in plans and "pro" in plans:
                        pro_price = plans["pro"]["price"]
                        if pro_price == 1599:  # Updated price
                            self.log_test("Get Subscription Plans", True, f"Plans retrieved - Pro: ₹{pro_price}/month")
                            return True
                        else:
                            self.log_test("Get Subscription Plans", False, f"Pro price mismatch: {pro_price}")
                            return False
                    else:
                        self.log_test("Get Subscription Plans", False, f"Missing plan types: {plans}")
                        return False
                else:
                    self.log_test("Get Subscription Plans", False, f"Invalid response structure: {data}")
                    return False
            else:
                self.log_test("Get Subscription Plans", False, f"HTTP {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Get Subscription Plans", False, f"Exception: {str(e)}")
            return False
    
    def test_get_user_subscription(self):
        """Test get user subscription endpoint"""
        if not self.auth_token:
            self.log_test("Get User Subscription", False, "No auth token available")
            return False
            
        try:
            response = self.session.get(
                f"{BASE_URL}/subscriptions/me",
                timeout=TIMEOUT
            )
            
            if response.status_code == 200:
                data = response.json()
                if data.get("success") and "subscription" in data:
                    subscription = data["subscription"]
                    if subscription.get("planType") == "free":
                        self.log_test("Get User Subscription", True, f"Subscription: {subscription['planType']} plan")
                        return True
                    else:
                        self.log_test("Get User Subscription", False, f"Unexpected plan type: {subscription}")
                        return False
                else:
                    self.log_test("Get User Subscription", False, f"Invalid response structure: {data}")
                    return False
            else:
                self.log_test("Get User Subscription", False, f"HTTP {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Get User Subscription", False, f"Exception: {str(e)}")
            return False
    
    def test_get_referral_stats(self):
        """Test get referral statistics endpoint"""
        if not self.auth_token:
            self.log_test("Get Referral Stats", False, "No auth token available")
            return False
            
        try:
            response = self.session.get(
                f"{BASE_URL}/referrals/me",
                timeout=TIMEOUT
            )
            
            if response.status_code == 200:
                data = response.json()
                if data.get("success") and "referral" in data:
                    referral = data["referral"]
                    if "code" in referral and referral["code"].startswith("PLANIX"):
                        self.log_test("Get Referral Stats", True, f"Referral code: {referral['code']}")
                        return True
                    else:
                        self.log_test("Get Referral Stats", False, f"Invalid referral code: {referral}")
                        return False
                else:
                    self.log_test("Get Referral Stats", False, f"Invalid response structure: {data}")
                    return False
            else:
                self.log_test("Get Referral Stats", False, f"HTTP {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Get Referral Stats", False, f"Exception: {str(e)}")
            return False
    
    def test_invalid_endpoints(self):
        """Test invalid endpoints and error handling"""
        test_cases = [
            ("GET", f"{BASE_URL}/users/invalid-user-id", 404),
            ("GET", f"{BASE_URL}/plans/detail/invalid-plan-id", 404),
            ("GET", f"{BASE_URL}/subscription/invalid-user-id", 404),
            ("POST", f"{BASE_URL}/users/", {"email": "invalid-email"}, 422),  # Invalid email format
        ]
        
        all_passed = True
        for method, url, expected_status, *args in test_cases:
            try:
                if method == "GET":
                    response = self.session.get(url, timeout=TIMEOUT)
                elif method == "POST":
                    json_data = args[0] if args else {}
                    response = self.session.post(url, json=json_data, timeout=TIMEOUT)
                
                if response.status_code == expected_status:
                    self.log_test(f"Error Handling - {method} {url.split('/')[-1]}", True, f"Correctly returned {expected_status}")
                else:
                    self.log_test(f"Error Handling - {method} {url.split('/')[-1]}", False, f"Expected {expected_status}, got {response.status_code}")
                    all_passed = False
                    
            except Exception as e:
                self.log_test(f"Error Handling - {method} {url.split('/')[-1]}", False, f"Exception: {str(e)}")
                all_passed = False
        
        return all_passed
    
    def test_root_endpoint(self):
        """Test root API endpoint"""
        try:
            response = self.session.get(f"{BASE_URL}/", timeout=TIMEOUT)
            
            if response.status_code == 200:
                data = response.json()
                if "message" in data and "Planix" in data["message"]:
                    self.log_test("Root Endpoint", True, "Root endpoint working")
                    return True
                else:
                    self.log_test("Root Endpoint", False, f"Unexpected response: {data}")
                    return False
            else:
                self.log_test("Root Endpoint", False, f"HTTP {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Root Endpoint", False, f"Exception: {str(e)}")
            return False
    
    def run_all_tests(self):
        """Run all tests in sequence"""
        print("🚀 Starting Planix Backend API Tests")
        print("=" * 50)
        
        # Core functionality tests
        tests = [
            self.test_health_check,
            self.test_root_endpoint,
            self.test_create_user,
            self.test_get_user,
            self.test_duplicate_user_creation,
            self.test_get_subscription,
            self.test_generate_referral_code,
            self.test_get_referral_stats,
            self.test_generate_floor_plan,
            self.test_get_user_plans,
            self.test_get_plan_detail,
            self.test_export_plan,
            self.test_invalid_endpoints,
        ]
        
        passed = 0
        total = len(tests)
        
        for test in tests:
            try:
                if test():
                    passed += 1
                time.sleep(0.5)  # Small delay between tests
            except Exception as e:
                print(f"❌ FAIL {test.__name__}: Unexpected error: {str(e)}")
        
        print("\n" + "=" * 50)
        print(f"📊 Test Results: {passed}/{total} tests passed")
        
        if passed == total:
            print("🎉 All tests passed! Backend is working correctly.")
        else:
            print(f"⚠️  {total - passed} tests failed. Check the details above.")
        
        return passed, total, self.test_results

def main():
    """Main test execution"""
    tester = PlanixAPITester()
    passed, total, results = tester.run_all_tests()
    
    # Save detailed results
    with open('/app/backend_test_results.json', 'w') as f:
        json.dump({
            "summary": {
                "passed": passed,
                "total": total,
                "success_rate": f"{(passed/total)*100:.1f}%",
                "timestamp": datetime.now().isoformat()
            },
            "detailed_results": results
        }, f, indent=2)
    
    print(f"\n📄 Detailed results saved to: /app/backend_test_results.json")
    
    return passed == total

if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)