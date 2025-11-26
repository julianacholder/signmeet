// app/services/mlApi.ts - CALL HUGGING FACE SPACE

interface MLPredictionRequest {
  sequence: number[][];
  expected_sign?: string;
  demo_mode?: boolean;
}

interface MLPredictionResponse {
  sign: string;
  confidence: number;
  english: string;
  demo_mode?: boolean;
}

export class MLApiService {
  private apiUrl: string;

  constructor() {
   
    this.apiUrl = 'https://JCholder-rsl-sign-language-api.hf.space';
  }

  async predict(
    landmarks: number[][], 
    expectedSign?: string,
    demoMode: boolean = true
  ): Promise<MLPredictionResponse> {
    try {
      console.log('🚀 Sending to Hugging Face API:', landmarks.length, 'frames');
      if (demoMode && expectedSign) {
        console.log('🎭 Demo mode enabled - Expected sign:', expectedSign);
      }
      
      const response = await fetch(`${this.apiUrl}/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sequence: landmarks,
          expected_sign: expectedSign,
          demo_mode: demoMode
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const result = await response.json();
      console.log('✅ HF API response:', result);
      
      return result;
    } catch (error) {
      console.error('❌ HF API error:', error);
      return {
        sign: 'error',
        confidence: 0,
        english: 'Model unavailable',
        demo_mode: false
      };
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.apiUrl}/health`);
      return response.ok;
    } catch {
      return false;
    }
  }
}

export const mlApi = new MLApiService();
