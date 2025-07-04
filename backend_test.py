import requests
import json
import os
import sys
from datetime import datetime

class StationeryFranchiseAPITester:
    def __init__(self, base_url="http://localhost:8001"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def run_test(self, name, method, endpoint, expected_status, data=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}
        
        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers)

            success = response.status_code == expected_status
            
            result = {
                "name": name,
                "endpoint": endpoint,
                "method": method,
                "expected_status": expected_status,
                "actual_status": response.status_code,
                "success": success
            }
            
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                if response.status_code != 204:  # No content
                    result["response"] = response.json()
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                try:
                    result["error"] = response.json()
                except:
                    result["error"] = response.text

            self.test_results.append(result)
            return success, response.json() if success and response.status_code != 204 else {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            self.test_results.append({
                "name": name,
                "endpoint": endpoint,
                "method": method,
                "success": False,
                "error": str(e)
            })
            return False, {}

    def test_health_check(self):
        """Test the health check endpoint"""
        return self.run_test(
            "Health Check",
            "GET",
            "api/health",
            200
        )

    def test_get_equipment(self):
        """Test getting equipment list"""
        return self.run_test(
            "Get Equipment List",
            "GET",
            "api/equipment",
            200
        )

    def test_get_franchise_plans(self):
        """Test getting franchise plans"""
        return self.run_test(
            "Get Franchise Plans",
            "GET",
            "api/franchise-plans",
            200
        )

    def test_get_specific_franchise_plan(self, plan_type):
        """Test getting a specific franchise plan"""
        return self.run_test(
            f"Get Specific Franchise Plan ({plan_type})",
            "GET",
            f"api/franchise-plans/{plan_type}",
            200
        )

    def test_submit_contact_inquiry(self):
        """Test submitting a contact inquiry"""
        data = {
            "name": "Test User",
            "email": "test@example.com",
            "phone": "555-123-4567",
            "message": "This is a test inquiry",
            "inquiry_type": "general"
        }
        return self.run_test(
            "Submit Contact Inquiry",
            "POST",
            "api/contact",
            200,
            data=data
        )

    def test_submit_franchise_application(self):
        """Test submitting a franchise application"""
        data = {
            "name": "Test Applicant",
            "email": "applicant@example.com",
            "phone": "555-987-6543",
            "city": "Test City",
            "state": "Test State",
            "investment_capacity": 50000,
            "business_experience": "5 years in retail",
            "preferred_plan": "professional",
            "message": "I'm interested in opening a franchise in my city."
        }
        return self.run_test(
            "Submit Franchise Application",
            "POST",
            "api/franchise-application",
            200,
            data=data
        )

    def test_get_mvp_manual(self):
        """Test getting the MVP manual"""
        return self.run_test(
            "Get MVP Manual",
            "GET",
            "api/manual",
            200
        )

    def test_get_launch_schedule(self):
        """Test getting the launch schedule"""
        return self.run_test(
            "Get Launch Schedule",
            "GET",
            "api/launch-schedule",
            200
        )

    def run_all_tests(self):
        """Run all API tests"""
        print("🚀 Starting API Tests for Stationery Franchise MVP")
        
        self.test_health_check()
        self.test_get_equipment()
        self.test_get_franchise_plans()
        
        # Test each franchise plan type
        plan_types = ["starter", "professional", "premium", "enterprise"]
        for plan_type in plan_types:
            self.test_get_specific_franchise_plan(plan_type)
        
        self.test_submit_contact_inquiry()
        self.test_submit_franchise_application()
        self.test_get_mvp_manual()
        self.test_get_launch_schedule()
        
        # Print results
        print(f"\n📊 Tests passed: {self.tests_passed}/{self.tests_run}")
        
        # Return success status
        return self.tests_passed == self.tests_run, self.test_results

def main():
    # Get backend URL from environment or use default
    backend_url = os.environ.get("REACT_APP_BACKEND_URL", "http://localhost:8001")
    print(f"Using backend URL: {backend_url}")
    
    # Setup tester
    tester = StationeryFranchiseAPITester(backend_url)
    
    # Run tests
    success, results = tester.run_all_tests()
    
    # Save results to file
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    with open(f"/app/api_test_results_{timestamp}.json", "w") as f:
        json.dump(results, f, indent=2)
    
    print(f"Test results saved to /app/api_test_results_{timestamp}.json")
    
    # Return exit code
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())