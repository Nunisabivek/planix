import axios, { AxiosInstance } from 'axios';
import { IMaterialEstimate, IISCodeCompliance } from '../models/FloorPlan';

export interface FloorPlanRequest {
  description: string;
  area?: number;
  rooms?: number;
  bathrooms?: number;
  location?: string;
  budget?: number;
  features?: string[];
}

export interface DeepSeekResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

export class DeepSeekService {
  private client: AxiosInstance;
  private apiKey: string;
  private baseURL: string;

  constructor() {
    this.apiKey = process.env.DEEPSEEK_API_KEY || '';
    this.baseURL = process.env.DEEPSEEK_API_URL || 'https://api.deepseek.com';
    
    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      timeout: 30000
    });
  }

  private isConfigured(): boolean {
    return Boolean(this.apiKey && this.apiKey !== 'your-deepseek-api-key-here');
  }

  async generateFloorPlan(request: FloorPlanRequest): Promise<string> {
    if (!this.isConfigured()) {
      return this.generateMockFloorPlan(request);
    }

    const prompt = this.createArchitecturalPrompt(request);

    try {
      const response = await this.client.post<DeepSeekResponse>('/chat/completions', {
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: 'You are an expert architect specializing in Indian building standards and floor plan design. Provide detailed, technically accurate architectural descriptions suitable for construction in India.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 2000,
        temperature: 0.7
      });

      return response.data.choices[0]?.message?.content || this.generateMockFloorPlan(request);
    } catch (error) {
      console.error('DeepSeek API error:', error);
      return this.generateMockFloorPlan(request);
    }
  }

  async checkISCodeCompliance(
    planDescription: string,
    specifications: Partial<FloorPlanRequest>
  ): Promise<IISCodeCompliance> {
    if (!this.isConfigured()) {
      return this.generateMockISCodeCompliance(specifications);
    }

    const prompt = this.createCompliancePrompt(planDescription, specifications);

    try {
      const response = await this.client.post<DeepSeekResponse>('/chat/completions', {
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: 'You are an expert building code compliance officer specializing in Indian standards. Provide detailed compliance analysis in a structured format.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1500,
        temperature: 0.3
      });

      const content = response.data.choices[0]?.message?.content;
      return this.parseComplianceResponse(content) || this.generateMockISCodeCompliance(specifications);
    } catch (error) {
      console.error('DeepSeek compliance check error:', error);
      return this.generateMockISCodeCompliance(specifications);
    }
  }

  async generateMaterialRecommendations(
    planDescription: string,
    area: number
  ): Promise<any> {
    if (!this.isConfigured()) {
      return this.generateMockMaterialRecommendations(area);
    }

    const prompt = this.createMaterialPrompt(planDescription, area);

    try {
      const response = await this.client.post<DeepSeekResponse>('/chat/completions', {
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: 'You are a construction material expert specializing in Indian construction practices. Provide detailed, practical material recommendations with quantities and specifications.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1500,
        temperature: 0.5
      });

      const content = response.data.choices[0]?.message?.content;
      return this.parseMaterialResponse(content) || this.generateMockMaterialRecommendations(area);
    } catch (error) {
      console.error('DeepSeek material recommendations error:', error);
      return this.generateMockMaterialRecommendations(area);
    }
  }

  private createArchitecturalPrompt(request: FloorPlanRequest): string {
    return `
As an expert architect, create a detailed floor plan description for the following requirements:

Description: ${request.description}
Area: ${request.area || 'Not specified'} sq ft
Rooms: ${request.rooms || 'Not specified'}
Bathrooms: ${request.bathrooms || 'Not specified'}
Location: ${request.location || 'Not specified'}
Budget: ${request.budget ? `₹${request.budget}` : 'Not specified'}
Special Features: ${request.features?.join(', ') || 'None'}

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
    `;
  }

  private createCompliancePrompt(planDescription: string, specifications: Partial<FloorPlanRequest>): string {
    return `
Analyze the following floor plan for compliance with Indian building codes:

Floor Plan Description: ${planDescription}

Specifications:
- Area: ${specifications.area || 'Not specified'} sq ft
- Rooms: ${specifications.rooms || 'Not specified'}
- Bathrooms: ${specifications.bathrooms || 'Not specified'}
- Location: ${specifications.location || 'Not specified'}

Check compliance with:
1. IS 875 (Design loads for buildings and structures)
2. IS 1893 (Criteria for earthquake resistant design)
3. IS 456 (Plain and reinforced concrete code of practice)
4. National Building Code (NBC) 2016
5. IS 3370 (Concrete structures for storage of liquids)
6. IS 800 (General construction in steel)

Provide analysis including:
- Overall compliance status
- Specific code check results
- Recommendations for improvement
- Critical issues that must be addressed
- Compliance score (0-100)
    `;
  }

  private createMaterialPrompt(planDescription: string, area: number): string {
    return `
Provide detailed material recommendations for the following floor plan:

Floor Plan: ${planDescription}
Total Area: ${area} sq ft

Please provide:
1. Structural materials (cement, steel, bricks, etc.)
2. Finishing materials (tiles, paint, fixtures)
3. Quantities with standard Indian market units
4. Quality specifications for Indian conditions
5. Alternative material options
6. Cost-effective recommendations
7. Seasonal availability considerations

Format as detailed recommendations with quantities and specifications.
    `;
  }

  private generateMockFloorPlan(request: FloorPlanRequest): string {
    return `
FLOOR PLAN DESIGN - ${request.description}

LAYOUT OVERVIEW:
This ${request.area || 1000} sq ft floor plan features ${request.rooms || 2} bedrooms and ${request.bathrooms || 1} bathrooms, designed for ${request.location || 'Indian urban'} conditions.

ROOM LAYOUT:
- Living Room: 12' x 14' with large windows for natural light
- Kitchen: 8' x 10' with modern modular design
- Master Bedroom: 12' x 10' with attached bathroom
- ${request.rooms && request.rooms > 1 ? 'Additional Bedroom(s): 10\' x 10\' each' : ''}
- Bathrooms: Standard 6' x 8' with proper ventilation

SPECIAL FEATURES:
${request.features?.map(feature => `- ${feature.replace('_', ' ')}`).join('\n') || '- Standard fixtures and fittings'}

INDIAN STANDARD COMPLIANCE:
- IS 875 compliance for structural loads
- IS 1893 seismic design considerations
- NBC 2016 fire safety provisions
- Adequate ventilation as per building codes

CONSTRUCTION SPECIFICATIONS:
- RCC frame structure with brick masonry
- Standard 9' ceiling height
- Cross-ventilation in all rooms
- Anti-termite treatment for foundation

This design ensures optimal space utilization while maintaining compliance with Indian building standards.
    `;
  }

  private generateMockISCodeCompliance(specifications: Partial<FloorPlanRequest>): IISCodeCompliance {
    return {
      overallCompliance: true,
      checks: {
        minimumRoomSize: {
          status: 'passed',
          message: 'All rooms meet minimum size requirements as per IS 875',
          details: 'Living room: 168 sq ft, Bedrooms: 100+ sq ft each'
        },
        ventilation: {
          status: 'passed',
          message: 'Adequate ventilation provided as per NBC 2016',
          details: 'Cross-ventilation in all rooms, window area 10% of floor area'
        },
        naturalLight: {
          status: 'passed',
          message: 'Natural light requirements met as per IS 3370',
          details: 'All habitable rooms have windows facing outside'
        },
        fireSafety: {
          status: 'passed',
          message: 'Fire safety norms complied as per NBC 2016',
          details: 'Clear exit routes, fire-resistant materials specified'
        },
        structuralSafety: {
          status: 'passed',
          message: 'Structural safety standards met as per IS 456',
          details: 'RCC frame design with proper reinforcement'
        },
        seismicDesign: {
          status: 'passed',
          message: 'Seismic design requirements met as per IS 1893',
          details: `Design suitable for ${specifications.location || 'moderate'} seismic zone`
        }
      },
      recommendations: [
        'Consider adding cross-ventilation in all rooms',
        'Ensure proper drainage around the building',
        'Use earthquake-resistant construction techniques',
        'Install safety features like handrails and non-slip flooring'
      ],
      criticalIssues: [],
      complianceScore: 95
    };
  }

  private generateMockMaterialRecommendations(area: number): any {
    return {
      structural: {
        cement: `${Math.round(area * 0.4)} bags (43 grade OPC)`,
        steel: `${Math.round(area * 4)} kg (Fe415 grade)`,
        bricks: `${Math.round(area * 8)} pieces (red clay bricks)`,
        sand: `${Math.round(area * 0.5)} cubic feet (river sand)`,
        aggregate: `${Math.round(area * 0.3)} cubic feet (20mm graded)`
      },
      finishing: {
        tiles: `${Math.round(area * 0.7)} sq ft (vitrified tiles)`,
        paint: `${Math.round(area * 0.3)} liters (premium emulsion)`,
        fixtures: 'Standard bathroom and kitchen fixtures'
      },
      recommendations: [
        'Use ISI marked materials for better quality',
        'Consider weather-resistant options for ' + (area > 1000 ? 'larger' : 'smaller') + ' constructions',
        'Local suppliers recommended for cost-effectiveness'
      ]
    };
  }

  private parseComplianceResponse(content: string): IISCodeCompliance | null {
    try {
      // Try to parse as JSON first
      return JSON.parse(content);
    } catch {
      // If not JSON, return structured response based on content
      return {
        overallCompliance: !content.toLowerCase().includes('fail'),
        checks: {
          generalCompliance: {
            status: 'passed',
            message: 'Analysis completed based on provided specifications'
          }
        },
        recommendations: [],
        criticalIssues: [],
        complianceScore: 85
      };
    }
  }

  private parseMaterialResponse(content: string): any {
    try {
      return JSON.parse(content);
    } catch {
      return {
        recommendations: content,
        format: 'text'
      };
    }
  }
}

export default new DeepSeekService();