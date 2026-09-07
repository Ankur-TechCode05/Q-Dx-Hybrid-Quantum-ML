import type {
  HealthData,
  AnalysisResult,
  RiskFactor,
  RiskLevel,
  ModelMetrics,
} from '@/types';

/**
 * Q-Dx Analysis Engine
 *
 * This module simulates the Hybrid Quantum-Classical ML pipeline for disease
 * risk detection. In production, these computations would be performed by a
 * Python backend (FastAPI + Scikit-learn + Qiskit). The logic here produces
 * realistic, deterministic, illustrative results clearly labeled as Demo.
 *
 * The classical model uses a weighted feature scoring approach (mimicking a
 * trained Random Forest / Logistic Regression), while the quantum model
 * applies a simulated quantum kernel-enhanced scoring (mimicking a QSVM with
 * amplitude-encoded features on a Qiskit Aer simulator).
 */

// Normalized feature weights — derived from epidemiological risk models
const FEATURE_WEIGHTS = {
  age: 0.18,
  bmi: 0.14,
  bloodPressure: 0.16,
  heartRate: 0.08,
  glucose: 0.17,
  cholesterol: 0.12,
  smoking: 0.10,
  physicalActivity: -0.08,
  sleep: -0.05,
  alcohol: 0.06,
  familyHistory: 0.12,
  gender: 0.03,
};

function clamp(value: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, value));
}

function normalize(value: number, min: number, max: number): number {
  return clamp((value - min) / (max - min), 0, 1);
}

function computeClassicalScore(data: HealthData): number {
  const ageScore = normalize(data.age, 20, 90);
  const bmiScore = normalize(data.bmi, 15, 45);
  const bpScore = normalize(
    (data.bloodPressureSystolic + data.bloodPressureDiastolic) / 2,
    80,
    160,
  );
  const hrScore = normalize(data.heartRate, 40, 120);
  const glucoseScore = normalize(data.glucose, 60, 200);
  const cholScore = normalize(data.cholesterol, 120, 280);

  const smokeScore = data.smoking ? 1 : 0;
  const activityScore = data.physicalActivity === 'low' ? 1 : data.physicalActivity === 'moderate' ? 0.5 : 0.2;
  const sleepScore = data.sleepHours < 5 || data.sleepHours > 10 ? 1 : Math.abs(data.sleepHours - 7.5) / 5;
  const alcoholScore = data.alcohol === 'none' ? 0 : data.alcohol === 'occasional' ? 0.3 : data.alcohol === 'moderate' ? 0.6 : 1;
  const familyScore = data.familyHistory ? 1 : 0;
  const genderScore = data.gender === 'male' ? 0.55 : data.gender === 'female' ? 0.4 : 0.5;

  const rawScore =
    ageScore * FEATURE_WEIGHTS.age +
    bmiScore * FEATURE_WEIGHTS.bmi +
    bpScore * FEATURE_WEIGHTS.bloodPressure +
    hrScore * FEATURE_WEIGHTS.heartRate +
    glucoseScore * FEATURE_WEIGHTS.glucose +
    cholScore * FEATURE_WEIGHTS.cholesterol +
    smokeScore * FEATURE_WEIGHTS.smoking +
    activityScore * FEATURE_WEIGHTS.physicalActivity +
    sleepScore * FEATURE_WEIGHTS.sleep +
    alcoholScore * FEATURE_WEIGHTS.alcohol +
    familyScore * FEATURE_WEIGHTS.familyHistory +
    genderScore * FEATURE_WEIGHTS.gender;

  // Scale to 0-100
  const totalPositiveWeight = Object.values(FEATURE_WEIGHTS).reduce((s, w) => s + Math.abs(w), 0);
  return clamp(Math.round((rawScore / totalPositiveWeight) * 100));
}

function computeQuantumScore(classicalScore: number, data: HealthData): number {
  // Quantum-enhanced scoring: simulates quantum kernel methods that capture
  // non-linear feature interactions. The quantum model typically shows slightly
  // different (often marginally better calibrated) results due to higher-dimensional
  // feature space mapping.

  // Simulate quantum feature map interaction terms
  const interactionBonus =
    (data.smoking && data.familyHistory ? 0.04 : 0) +
    (data.bmi > 30 && data.glucose > 120 ? 0.03 : 0) +
    (data.bloodPressureSystolic > 140 && data.cholesterol > 220 ? 0.03 : 0) +
    (data.age > 55 && data.physicalActivity === 'low' ? 0.02 : 0);

  // Quantum kernel adds slight non-linear adjustment
  const quantumAdjustment = (classicalScore - 50) * 0.05; // pulls extremes slightly toward center
  const quantumScore = classicalScore + interactionBonus * 100 - quantumAdjustment;

  return clamp(Math.round(quantumScore));
}

function getRiskLevel(score: number): RiskLevel {
  if (score < 35) return 'low';
  if (score < 65) return 'moderate';
  return 'high';
}

function generateRiskFactors(data: HealthData, classicalScore: number): RiskFactor[] {
  const factors: Omit<RiskFactor, 'contribution'>[] = [];

  if (data.age > 55) {
    factors.push({
      name: 'Age',
      description: 'Risk of cardiovascular and metabolic conditions increases significantly with age.',
      value: `${data.age} years`,
      severity: data.age > 70 ? 'high' : 'moderate',
    });
  }

  if (data.bmi >= 30) {
    factors.push({
      name: 'High BMI (Obesity)',
      description: 'BMI in the obese range is strongly linked to diabetes, hypertension, and heart disease.',
      value: `${data.bmi.toFixed(1)}`,
      severity: 'high',
    });
  } else if (data.bmi >= 25) {
    factors.push({
      name: 'Elevated BMI (Overweight)',
      description: 'Above-normal BMI contributes to long-term metabolic and cardiovascular risk.',
      value: `${data.bmi.toFixed(1)}`,
      severity: 'moderate',
    });
  }

  if (data.bloodPressureSystolic >= 140 || data.bloodPressureDiastolic >= 90) {
    factors.push({
      name: 'High Blood Pressure',
      description: 'Hypertension strains the heart and blood vessels, increasing risk of stroke and heart disease.',
      value: `${data.bloodPressureSystolic}/${data.bloodPressureDiastolic} mmHg`,
      severity: 'high',
    });
  } else if (data.bloodPressureSystolic >= 130 || data.bloodPressureDiastolic >= 85) {
    factors.push({
      name: 'Elevated Blood Pressure',
      description: 'Borderline blood pressure readings may indicate developing hypertension.',
      value: `${data.bloodPressureSystolic}/${data.bloodPressureDiastolic} mmHg`,
      severity: 'moderate',
    });
  }

  if (data.glucose >= 126) {
    factors.push({
      name: 'High Blood Glucose',
      description: 'Elevated glucose levels may indicate diabetes or prediabetes.',
      value: `${data.glucose} mg/dL`,
      severity: 'high',
    });
  } else if (data.glucose >= 100) {
    factors.push({
      name: 'Elevated Blood Glucose',
      description: 'Above-normal fasting glucose suggests prediabetes risk.',
      value: `${data.glucose} mg/dL`,
      severity: 'moderate',
    });
  }

  if (data.cholesterol >= 240) {
    factors.push({
      name: 'High Cholesterol',
      description: 'Excess cholesterol builds plaque in arteries, leading to atherosclerosis.',
      value: `${data.cholesterol} mg/dL`,
      severity: 'high',
    });
  } else if (data.cholesterol >= 200) {
    factors.push({
      name: 'Borderline Cholesterol',
      description: 'Cholesterol near the borderline warrants dietary monitoring.',
      value: `${data.cholesterol} mg/dL`,
      severity: 'moderate',
    });
  }

  if (data.smoking) {
    factors.push({
      name: 'Smoking',
      description: 'Tobacco use is a leading cause of cardiovascular and respiratory disease.',
      value: 'Active smoker',
      severity: 'high',
    });
  }

  if (data.physicalActivity === 'low') {
    factors.push({
      name: 'Low Physical Activity',
      description: 'Sedentary lifestyle increases risk of obesity, diabetes, and heart disease.',
      value: 'Low activity',
      severity: 'moderate',
    });
  }

  if (data.sleepHours < 5 || data.sleepHours > 10) {
    factors.push({
      name: 'Irregular Sleep Pattern',
      description: 'Insufficient or excessive sleep disrupts metabolic and cardiovascular health.',
      value: `${data.sleepHours} hours`,
      severity: 'moderate',
    });
  }

  if (data.alcohol === 'heavy' || data.alcohol === 'moderate') {
    factors.push({
      name: 'Alcohol Consumption',
      description: 'Regular alcohol intake affects liver function, blood pressure, and heart health.',
      value: data.alcohol === 'heavy' ? 'Heavy drinker' : 'Moderate drinker',
      severity: data.alcohol === 'heavy' ? 'high' : 'moderate',
    });
  }

  if (data.familyHistory) {
    factors.push({
      name: 'Family History',
      description: 'Genetic predisposition increases baseline risk for chronic diseases.',
      value: 'Positive family history',
      severity: 'moderate',
    });
  }

  if (data.heartRate > 100) {
    factors.push({
      name: 'Elevated Heart Rate',
      description: 'Persistently high resting heart rate may indicate cardiovascular stress.',
      value: `${data.heartRate} bpm`,
      severity: 'moderate',
    });
  }

  // Sort by severity (high first) and compute relative contribution
  const severityRank = { high: 3, moderate: 2, low: 1 };
  factors.sort((a, b) => severityRank[b.severity] - severityRank[a.severity]);

  const topFactors = factors.slice(0, 6);
  const totalSeverity = topFactors.reduce((s, f) => s + severityRank[f.severity], 0);

  return topFactors.map((f) => ({
    ...f,
    contribution: Math.round((severityRank[f.severity] / totalSeverity) * 100),
  }));
}

function generateFeatureImportance(data: HealthData) {
  const features = [
    { feature: 'Glucose', raw: normalize(data.glucose, 60, 200) * FEATURE_WEIGHTS.glucose },
    { feature: 'Blood Pressure', raw: normalize((data.bloodPressureSystolic + data.bloodPressureDiastolic) / 2, 80, 160) * FEATURE_WEIGHTS.bloodPressure },
    { feature: 'Age', raw: normalize(data.age, 20, 90) * FEATURE_WEIGHTS.age },
    { feature: 'BMI', raw: normalize(data.bmi, 15, 45) * FEATURE_WEIGHTS.bmi },
    { feature: 'Cholesterol', raw: normalize(data.cholesterol, 120, 280) * FEATURE_WEIGHTS.cholesterol },
    { feature: 'Smoking', raw: (data.smoking ? 1 : 0) * FEATURE_WEIGHTS.smoking },
    { feature: 'Family History', raw: (data.familyHistory ? 1 : 0) * FEATURE_WEIGHTS.familyHistory },
    { feature: 'Heart Rate', raw: normalize(data.heartRate, 40, 120) * FEATURE_WEIGHTS.heartRate },
    { feature: 'Physical Activity', raw: (data.physicalActivity === 'low' ? 1 : data.physicalActivity === 'moderate' ? 0.5 : 0.2) * Math.abs(FEATURE_WEIGHTS.physicalActivity) },
    { feature: 'Sleep', raw: (data.sleepHours < 5 || data.sleepHours > 10 ? 1 : Math.abs(data.sleepHours - 7.5) / 5) * Math.abs(FEATURE_WEIGHTS.sleep) },
    { feature: 'Alcohol', raw: (data.alcohol === 'none' ? 0 : data.alcohol === 'occasional' ? 0.3 : data.alcohol === 'moderate' ? 0.6 : 1) * FEATURE_WEIGHTS.alcohol },
  ];

  const total = features.reduce((s, f) => s + f.raw, 0);
  return features
    .map((f) => ({ feature: f.feature, importance: Math.round((f.raw / total) * 1000) / 10 }))
    .sort((a, b) => b.importance - a.importance);
}

function generateRecommendations(riskLevel: RiskLevel, data: HealthData): string[] {
  const recs: string[] = [];

  if (data.bmi >= 25) {
    recs.push('Adopt a balanced, portion-controlled diet to achieve a healthier BMI.');
  }
  if (data.bloodPressureSystolic >= 130) {
    recs.push('Reduce sodium intake and monitor blood pressure regularly.');
  }
  if (data.glucose >= 100) {
    recs.push('Limit refined sugars and simple carbohydrates; consult a physician about glucose monitoring.');
  }
  if (data.cholesterol >= 200) {
    recs.push('Increase fiber intake and reduce saturated fats to manage cholesterol levels.');
  }
  if (data.smoking) {
    recs.push('Enroll in a smoking cessation program — quitting is the single most impactful change.');
  }
  if (data.physicalActivity === 'low') {
    recs.push('Aim for at least 150 minutes of moderate aerobic activity per week.');
  }
  if (data.sleepHours < 6) {
    recs.push('Prioritize 7-9 hours of quality sleep per night to support metabolic health.');
  }
  if (data.alcohol === 'heavy' || data.alcohol === 'moderate') {
    recs.push('Reduce alcohol consumption to occasional or none for better cardiovascular health.');
  }
  if (data.familyHistory) {
    recs.push('Schedule regular health screenings given your family history of chronic conditions.');
  }

  if (riskLevel === 'high') {
    recs.unshift('Consult a healthcare professional promptly for a comprehensive evaluation.');
  } else if (riskLevel === 'moderate') {
    recs.unshift('Schedule a routine check-up to discuss your risk factors with a physician.');
  } else {
    recs.unshift('Maintain your healthy habits and continue regular annual check-ups.');
  }

  return recs;
}

// Illustrative model performance metrics — clearly labeled as Demo
// In production, these come from the trained models' evaluation on test data
function generateModelMetrics(data: HealthData): ModelMetrics {
  // Base metrics that vary slightly based on data complexity
  const complexity = Math.abs(data.age - 45) / 45 + Math.abs(data.bmi - 25) / 25;
  const variation = (complexity * 0.02);

  return {
    classical: {
      accuracy: Math.round((0.872 - variation) * 1000) / 10,
      precision: Math.round((0.851 - variation) * 1000) / 10,
      recall: Math.round((0.834 - variation) * 1000) / 10,
      f1: Math.round((0.842 - variation) * 1000) / 10,
      roc_auc: Math.round((0.889 - variation) * 1000) / 10,
    },
    quantum: {
      accuracy: Math.round((0.914 - variation * 0.5) * 1000) / 10,
      precision: Math.round((0.901 - variation * 0.5) * 1000) / 10,
      recall: Math.round((0.893 - variation * 0.5) * 1000) / 10,
      f1: Math.round((0.897 - variation * 0.5) * 1000) / 10,
      roc_auc: Math.round((0.931 - variation * 0.5) * 1000) / 10,
    },
  };
}

export function runAnalysis(data: HealthData): AnalysisResult {
  const classicalScore = computeClassicalScore(data);
  const quantumScore = computeQuantumScore(classicalScore, data);
  const combinedScore = Math.round(classicalScore * 0.45 + quantumScore * 0.55);
  const riskLevel = getRiskLevel(combinedScore);
  const riskFactors = generateRiskFactors(data, classicalScore);
  const featureImportance = generateFeatureImportance(data);
  const modelMetrics = generateModelMetrics(data);
  const recommendations = generateRecommendations(riskLevel, data);

  return {
    riskScore: combinedScore,
    riskLevel,
    classicalScore,
    quantumScore,
    riskFactors,
    modelMetrics,
    featureImportance,
    recommendations,
  };
}

export function getRiskColor(level: RiskLevel): string {
  switch (level) {
    case 'low': return 'text-emerald-500';
    case 'moderate': return 'text-amber-500';
    case 'high': return 'text-rose-500';
  }
}

export function getRiskBgColor(level: RiskLevel): string {
  switch (level) {
    case 'low': return 'bg-emerald-500';
    case 'moderate': return 'bg-amber-500';
    case 'high': return 'bg-rose-500';
  }
}
