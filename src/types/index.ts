export type Gender = 'male' | 'female' | 'other';
export type PhysicalActivity = 'low' | 'moderate' | 'high';
export type Alcohol = 'none' | 'occasional' | 'moderate' | 'heavy';
export type RiskLevel = 'low' | 'moderate' | 'high';

export interface HealthData {
  age: number;
  gender: Gender;
  bmi: number;
  bloodPressureSystolic: number;
  bloodPressureDiastolic: number;
  heartRate: number;
  glucose: number;
  cholesterol: number;
  smoking: boolean;
  physicalActivity: PhysicalActivity;
  sleepHours: number;
  alcohol: Alcohol;
  familyHistory: boolean;
}

export interface RiskFactor {
  name: string;
  contribution: number;
  description: string;
  value: string;
  severity: 'low' | 'moderate' | 'high';
}

export interface ModelMetrics {
  classical: {
    accuracy: number;
    precision: number;
    recall: number;
    f1: number;
    roc_auc: number;
  };
  quantum: {
    accuracy: number;
    precision: number;
    recall: number;
    f1: number;
    roc_auc: number;
  };
}

export interface AnalysisResult {
  riskScore: number;
  riskLevel: RiskLevel;
  classicalScore: number;
  quantumScore: number;
  riskFactors: RiskFactor[];
  modelMetrics: ModelMetrics;
  featureImportance: { feature: string; importance: number }[];
  recommendations: string[];
}

export interface AssessmentRecord {
  id: string;
  created_at: string;
  age: number | null;
  gender: string | null;
  bmi: number | null;
  blood_pressure_systolic: number | null;
  blood_pressure_diastolic: number | null;
  heart_rate: number | null;
  glucose: number | null;
  cholesterol: number | null;
  smoking: boolean | null;
  physical_activity: string | null;
  sleep_hours: number | null;
  alcohol: string | null;
  family_history: boolean | null;
  risk_score: number | null;
  risk_level: string | null;
  classical_score: number | null;
  quantum_score: number | null;
  risk_factors: RiskFactor[] | null;
  model_metrics: ModelMetrics | null;
}
