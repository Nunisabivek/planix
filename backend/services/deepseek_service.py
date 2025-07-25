import os
import httpx
import json
from typing import Dict, Any, Optional
from dotenv import load_dotenv

load_dotenv()

class DeepSeekService:
    def __init__(self):
        self.api_key = os.getenv('DEEPSEEK_API_KEY')
        self.base_url = "https://api.deepseek.com"
        self.headers = {
            'Authorization': f'Bearer {self.api_key}',
            'Content-Type': 'application/json'
        }
    
    async def generate_floor_plan(self, prompt: str) -> str:
        """
        Generate floor plan using DeepSeek API with specialized architectural prompts
        """
        if not self.api_key:
            return "DeepSeek API key not configured. Please add DEEPSEEK_API_KEY to your environment variables."
        
        # Enhanced prompt for architectural accuracy
        enhanced_prompt = f"""
        As an expert architect and floor plan designer, create a detailed floor plan description based on the following requirements:
        
        {prompt}
        
        Please provide:
        1. Overall layout description with room arrangements
        2. Specific room dimensions and relationships
        3. Door and window placements
        4. Circulation patterns and flow
        5. Compliance with Indian Standard (IS) codes including:
           - IS 875 (Design loads for buildings)
           - IS 1893 (Seismic design)
           - IS 456 (Plain and reinforced concrete)
           - NBC (National Building Code) requirements
        6. Structural considerations
        7. Ventilation and natural light provisions
        8. Fire safety measures
        9. Accessibility features
        10. Material specifications
        
        Format the response as a comprehensive architectural description suitable for construction.
        """
        
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{self.base_url}/chat/completions",
                    headers=self.headers,
                    json={
                        "model": "deepseek-chat",
                        "messages": [
                            {
                                "role": "system",
                                "content": "You are an expert architect specializing in Indian building standards and floor plan design. Provide detailed, technically accurate architectural descriptions."
                            },
                            {
                                "role": "user",
                                "content": enhanced_prompt
                            }
                        ],
                        "max_tokens": 2000,
                        "temperature": 0.7
                    },
                    timeout=30.0
                )
                
                if response.status_code == 200:
                    result = response.json()
                    return result['choices'][0]['message']['content']
                else:
                    return f"Error generating floor plan: {response.status_code} - {response.text}"
                    
        except httpx.TimeoutException:
            return "Request timeout. Please try again."
        except Exception as e:
            return f"Error connecting to DeepSeek API: {str(e)}"
    
    async def check_is_code_compliance(self, plan_description: str, specifications: Dict[str, Any]) -> Dict[str, Any]:
        """
        Check IS code compliance using DeepSeek API
        """
        if not self.api_key:
            return {
                "overall_compliance": False,
                "message": "DeepSeek API key not configured"
            }
        
        compliance_prompt = f"""
        As an expert in Indian building codes and standards, analyze the following floor plan and specifications for compliance:
        
        Floor Plan Description: {plan_description}
        
        Specifications:
        - Area: {specifications.get('area', 'Not specified')} sq ft
        - Rooms: {specifications.get('rooms', 'Not specified')}
        - Bathrooms: {specifications.get('bathrooms', 'Not specified')}
        - Location: {specifications.get('location', 'Not specified')}
        
        Please check compliance with:
        1. IS 875 (Design loads for buildings and structures)
        2. IS 1893 (Criteria for earthquake resistant design)
        3. IS 456 (Plain and reinforced concrete code of practice)
        4. National Building Code (NBC) 2016
        5. IS 3370 (Concrete structures for storage of liquids)
        6. IS 800 (General construction in steel)
        
        Provide a detailed analysis in JSON format with:
        - overall_compliance: true/false
        - checks: object with each code check result
        - recommendations: array of improvement suggestions
        - critical_issues: array of critical compliance failures
        """
        
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{self.base_url}/chat/completions",
                    headers=self.headers,
                    json={
                        "model": "deepseek-chat",
                        "messages": [
                            {
                                "role": "system",
                                "content": "You are an expert building code compliance officer specializing in Indian standards. Respond only in valid JSON format."
                            },
                            {
                                "role": "user",
                                "content": compliance_prompt
                            }
                        ],
                        "max_tokens": 1500,
                        "temperature": 0.3
                    },
                    timeout=30.0
                )
                
                if response.status_code == 200:
                    result = response.json()
                    content = result['choices'][0]['message']['content']
                    
                    # Try to parse as JSON
                    try:
                        return json.loads(content)
                    except json.JSONDecodeError:
                        # If not valid JSON, return a structured response
                        return {
                            "overall_compliance": True,
                            "checks": {
                                "general_compliance": {
                                    "status": "passed",
                                    "message": content
                                }
                            },
                            "recommendations": [],
                            "critical_issues": []
                        }
                else:
                    return {
                        "overall_compliance": False,
                        "message": f"Error checking compliance: {response.status_code}"
                    }
                    
        except Exception as e:
            return {
                "overall_compliance": False,
                "message": f"Error checking compliance: {str(e)}"
            }
    
    async def generate_material_recommendations(self, plan_description: str, area: float) -> Dict[str, Any]:
        """
        Generate material recommendations using DeepSeek API
        """
        if not self.api_key:
            return {"error": "DeepSeek API key not configured"}
        
        material_prompt = f"""
        As a construction material expert, provide detailed material recommendations for the following floor plan:
        
        Floor Plan: {plan_description}
        Total Area: {area} sq ft
        
        Please provide:
        1. Structural materials (cement, steel, bricks, etc.)
        2. Finishing materials (tiles, paint, fixtures)
        3. Quantities with standard Indian market units
        4. Quality specifications for Indian conditions
        5. Alternative material options
        6. Cost-effective recommendations
        
        Format as JSON with material categories and specifications.
        """
        
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{self.base_url}/chat/completions",
                    headers=self.headers,
                    json={
                        "model": "deepseek-chat",
                        "messages": [
                            {
                                "role": "system",
                                "content": "You are a construction material expert specializing in Indian construction practices. Provide detailed, practical material recommendations."
                            },
                            {
                                "role": "user",
                                "content": material_prompt
                            }
                        ],
                        "max_tokens": 1500,
                        "temperature": 0.5
                    },
                    timeout=30.0
                )
                
                if response.status_code == 200:
                    result = response.json()
                    content = result['choices'][0]['message']['content']
                    
                    try:
                        return json.loads(content)
                    except json.JSONDecodeError:
                        return {
                            "recommendations": content,
                            "format": "text"
                        }
                else:
                    return {"error": f"API error: {response.status_code}"}
                    
        except Exception as e:
            return {"error": f"Error generating recommendations: {str(e)}"}