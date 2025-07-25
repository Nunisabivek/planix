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
        """Test floor plan generation endpoint"""
        if not self.test_user_id:
            self.log_test("Generate Floor Plan", False, "No test user ID available")
            return False
            
        try:
            plan_request = {
                "description": "Modern 3BHK apartment with open kitchen, spacious living room, master bedroom with attached bathroom, two additional bedrooms, guest bathroom, and balcony. Located in Mumbai with good ventilation and natural light.",
                "area": 1200.0,
                "rooms": 3,
                "bathrooms": 2,
                "location": "Mumbai, Maharashtra",
                "budget": 2500000.0,
                "features": ["open_kitchen", "balcony", "master_suite", "guest_bathroom", "storage_room"],
                "user_id": self.test_user_id
            }
            
            response = self.session.post(
                f"{BASE_URL}/generate-floor-plan",
                json=plan_request,
                timeout=TIMEOUT
            )
            
            if response.status_code == 200:
                data = response.json()
                required_fields = ["id", "description", "generated_plan", "material_estimate", "is_code_compliance", "created_at", "user_id"]
                
                if all(field in data for field in required_fields):
                    self.test_plan_id = data["id"]
                    
                    # Check material estimate structure
                    material_estimate = data["material_estimate"]
                    if "bricks" in material_estimate and "cement" in material_estimate:
                        self.log_test("Generate Floor Plan", True, f"Floor plan generated with ID: {self.test_plan_id}")
                        return True
                    else:
                        self.log_test("Generate Floor Plan", False, f"Invalid material estimate structure: {material_estimate}")
                        return False
                else:
                    missing_fields = [field for field in required_fields if field not in data]
                    self.log_test("Generate Floor Plan", False, f"Missing fields: {missing_fields}")
                    return False
            else:
                self.log_test("Generate Floor Plan", False, f"HTTP {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Generate Floor Plan", False, f"Exception: {str(e)}")
            return False
    
    def test_get_subscription(self):
        """Test get user subscription endpoint"""
        if not self.test_user_id:
            self.log_test("Get Subscription", False, "No test user ID available")
            return False
            
        try:
            response = self.session.get(
                f"{BASE_URL}/subscription/{self.test_user_id}",
                timeout=TIMEOUT
            )
            
            if response.status_code == 200:
                data = response.json()
                required_fields = ["user_id", "plan_type", "status", "plans_remaining", "exports_remaining", "features"]
                
                if all(field in data for field in required_fields):
                    if data["plan_type"] == "free" and data["status"] == "active":
                        self.log_test("Get Subscription", True, f"Subscription retrieved: {data['plan_type']} plan")
                        return True
                    else:
                        self.log_test("Get Subscription", False, f"Unexpected subscription data: {data}")
                        return False
                else:
                    missing_fields = [field for field in required_fields if field not in data]
                    self.log_test("Get Subscription", False, f"Missing fields: {missing_fields}")
                    return False
            else:
                self.log_test("Get Subscription", False, f"HTTP {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Get Subscription", False, f"Exception: {str(e)}")
            return False
    
    def test_generate_referral_code(self):
        """Test referral code generation"""
        if not self.test_user_id:
            self.log_test("Generate Referral Code", False, "No test user ID available")
            return False
            
        try:
            referral_request = {
                "user_id": self.test_user_id
            }
            
            response = self.session.post(
                f"{BASE_URL}/referral/generate",
                json=referral_request,
                timeout=TIMEOUT
            )
            
            if response.status_code == 200:
                data = response.json()
                required_fields = ["user_id", "referral_code", "credits_earned", "total_referrals"]
                
                if all(field in data for field in required_fields):
                    if data["referral_code"].startswith("PLANIX"):
                        self.log_test("Generate Referral Code", True, f"Referral code: {data['referral_code']}")
                        return True
                    else:
                        self.log_test("Generate Referral Code", False, f"Invalid referral code format: {data['referral_code']}")
                        return False
                else:
                    missing_fields = [field for field in required_fields if field not in data]
                    self.log_test("Generate Referral Code", False, f"Missing fields: {missing_fields}")
                    return False
            else:
                self.log_test("Generate Referral Code", False, f"HTTP {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Generate Referral Code", False, f"Exception: {str(e)}")
            return False
    
    def test_get_referral_stats(self):
        """Test get referral statistics"""
        if not self.test_user_id:
            self.log_test("Get Referral Stats", False, "No test user ID available")
            return False
            
        try:
            response = self.session.get(
                f"{BASE_URL}/referral/{self.test_user_id}",
                timeout=TIMEOUT
            )
            
            if response.status_code == 200:
                data = response.json()
                required_fields = ["user_id", "referral_code", "credits_earned", "total_referrals", "active_referrals"]
                
                if all(field in data for field in required_fields):
                    self.log_test("Get Referral Stats", True, f"Referral stats retrieved")
                    return True
                else:
                    missing_fields = [field for field in required_fields if field not in data]
                    self.log_test("Get Referral Stats", False, f"Missing fields: {missing_fields}")
                    return False
            else:
                self.log_test("Get Referral Stats", False, f"HTTP {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Get Referral Stats", False, f"Exception: {str(e)}")
            return False
    
    def test_get_user_plans(self):
        """Test get user's floor plans"""
        if not self.test_user_id:
            self.log_test("Get User Plans", False, "No test user ID available")
            return False
            
        try:
            response = self.session.get(
                f"{BASE_URL}/plans/{self.test_user_id}",
                timeout=TIMEOUT
            )
            
            if response.status_code == 200:
                data = response.json()
                if "plans" in data and isinstance(data["plans"], list):
                    if len(data["plans"]) > 0:
                        self.log_test("Get User Plans", True, f"Retrieved {len(data['plans'])} plans")
                        return True
                    else:
                        self.log_test("Get User Plans", True, "No plans found (expected for new user)")
                        return True
                else:
                    self.log_test("Get User Plans", False, f"Invalid response structure: {data}")
                    return False
            else:
                self.log_test("Get User Plans", False, f"HTTP {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Get User Plans", False, f"Exception: {str(e)}")
            return False
    
    def test_get_plan_detail(self):
        """Test get plan detail endpoint"""
        if not self.test_plan_id:
            self.log_test("Get Plan Detail", False, "No test plan ID available")
            return False
            
        try:
            response = self.session.get(
                f"{BASE_URL}/plans/detail/{self.test_plan_id}",
                timeout=TIMEOUT
            )
            
            if response.status_code == 200:
                data = response.json()
                required_fields = ["id", "user_id", "description", "generated_plan", "material_estimate"]
                
                if all(field in data for field in required_fields):
                    self.log_test("Get Plan Detail", True, f"Plan details retrieved")
                    return True
                else:
                    missing_fields = [field for field in required_fields if field not in data]
                    self.log_test("Get Plan Detail", False, f"Missing fields: {missing_fields}")
                    return False
            else:
                self.log_test("Get Plan Detail", False, f"HTTP {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Get Plan Detail", False, f"Exception: {str(e)}")
            return False
    
    def test_export_plan(self):
        """Test plan export endpoint"""
        if not self.test_plan_id:
            self.log_test("Export Plan", False, "No test plan ID available")
            return False
            
        try:
            response = self.session.post(
                f"{BASE_URL}/plans/{self.test_plan_id}/export",
                timeout=TIMEOUT
            )
            
            if response.status_code == 200:
                data = response.json()
                required_fields = ["message", "plan_id", "export_count"]
                
                if all(field in data for field in required_fields):
                    self.log_test("Export Plan", True, f"Plan exported successfully")
                    return True
                else:
                    missing_fields = [field for field in required_fields if field not in data]
                    self.log_test("Export Plan", False, f"Missing fields: {missing_fields}")
                    return False
            else:
                self.log_test("Export Plan", False, f"HTTP {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Export Plan", False, f"Exception: {str(e)}")
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