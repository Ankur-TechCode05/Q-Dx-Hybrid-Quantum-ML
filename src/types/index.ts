export type Gender = 'male' | 'female' | 'other';
export type PhysicalActivity = 'low' | 'moderate' | 'high';
export type Alcohol = 'none' | 'occasional' | 'moderate' | 'heavy';
export type RiskLevel = 'low' | 'moderate' | 'high';

export type DiseaseType =
  | 'diabetes'
  | 'breast_cancer'
  | 'skin_cancer'
  | 'cardiovascular'
  | 'hypertension'
  | 'chronic_kidney_disease';

export interface DiseaseInfo {
  type: DiseaseType;
  label: string;
  shortLabel: string;
  icon: string;
  color: string;
  description: string;
}

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
  // Disease-specific inputs
  skinExposure: number; // UV exposure hours/week
  skinType: number; // Fitzpatrick scale 1-6
  molesCount: number; // number of moles
  breastfeeding: boolean; // breast cancer protective factor
  menarcheAge: number; // age at first menstruation
  pregnancies: number;
  waterIntake: number; // glasses/day (CKD)
  urinationFrequency: 'normal' | 'increased' | 'frequent';
  swelling: boolean; // edema (CKD)
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

export interface DiseaseResult {
  disease: DiseaseType;
  riskScore: number;
  riskLevel: RiskLevel;
  classicalScore: number;
  quantumScore: number;
  riskFactors: RiskFactor[];
  modelMetrics: ModelMetrics;
  featureImportance: { feature: string; importance: number }[];
  recommendations: string[];
  pieData: { label: string; value: number; color: string }[];
}

export interface AnalysisResult {
  overallRiskScore: number;
  overallRiskLevel: RiskLevel;
  diseases: DiseaseResult[];
  // Legacy fields for backward compatibility
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
