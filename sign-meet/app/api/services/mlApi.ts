// app/services/mlApi.ts

interface MLPredictionRequest {
  sequence: number[][]; // 30 frames × 126 features
}

interface MLPredictionResponse {
  sign: string;
  confidence: number;
  english: string;
}

export class MLApiService {
  private baseUrl: string;

  constructor(baseUrl: string = 'http://localhost:8000') {
    this.baseUrl = baseUrl;
  }

  async predict(landmarks: number[][]): Promise<MLPredictionResponse> {
    try {
      console.log('🚀 Sending to ML API:', landmarks.length, 'frames');
      
      const response = await fetch(`${this.baseUrl}/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sequence: landmarks
        }),
      });

      if (!response.ok) {
        throw new Error(`ML API error: ${response.status}`);
      }

      const result = await response.json();
      console.log('✅ ML API response:', result);
      
      return result;
    } catch (error) {
      console.error('❌ ML API error:', error);
      return {
        sign: 'error',
        confidence: 0,
        english: 'Model unavailable'
      };
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/health`);
      return response.ok;
    } catch {
      return false;
    }
  }
}

export const mlApi = new MLApiService();