import type {
  HealthData,
  DiseaseResult,
  DiseaseType,
  RiskFactor,
  RiskLevel,
  ModelMetrics,
  AnalysisResult,
} from '@/types';

/**
 * Q-Dx Multi-Disease Analysis Engine
 *
 * Simulates a Hybrid Quantum-Classical ML pipeline for multiple disease
 * risk detection. Each disease has its own feature weighting, risk factor
 * logic, and model metrics — mimicking disease-specific trained models
 * (Scikit-learn for classical, Qiskit QSVM/VQC for quantum).
 *
 * All results are clearly labeled as Demo / Illustrative.
 */

export const DISEASES: { type: DiseaseType; label: string; shortLabel: string; icon: string; color: string; description: string }[] = [
  {
    type: 'diabetes',
    label: 'Type 2 Diabetes',
    shortLabel: 'Diabetes',
    icon: 'Droplet',
    color: '#3361ff',
    description: 'Insulin resistance and metabolic dysfunction leading to elevated blood glucose.',
  },
  {
    type: 'cardiovascular',
    label: 'Cardiovascular Disease',
    shortLabel: 'Cardiac',
    icon: 'HeartPulse',
    color: '#f43f5e',
    description: 'Heart and blood vessel conditions including coronary artery disease and stroke.',
  },
  {
    type: 'hypertension',
    label: 'Hypertension',
    shortLabel: 'BP',
    icon: 'Activity',
    color: '#f59e0b',
    description: 'Persistently elevated blood pressure that strains the heart and arteries.',
  },
  {
    type: 'breast_cancer',
    label: 'Breast Cancer',
    shortLabel: 'Breast',
    icon: 'Ribbon',
    color: '#ec4899',
    description: 'Malignant tumor development in breast tissue, influenced by hormonal and genetic factors.',
  },
  {
    type: 'skin_cancer',
    label: 'Skin Cancer',
    shortLabel: 'Skin',
    icon: 'Sun',
    color: '#f97316',
    description: 'UV-induced DNA damage in skin cells leading to melanoma or non-melanoma cancer.',
  },
  {
    type: 'chronic_kidney_disease',
    label: 'Chronic Kidney Disease',
    shortLabel: 'CKD',
    icon: 'Kidney',
    color: '#8b5cf6',
    description: 'Progressive loss of kidney function, often linked to diabetes and hypertension.',
  },
];

function clamp(value: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, value));
}

function normalize(value: number, min: number, max: number): number {
  return clamp((value - min) / (max - min), 0, 1);
}

function getRiskLevel(score: number): RiskLevel {
  if (score < 35) return 'low';
  if (score < 65) return 'moderate';
  return 'high';
}

function activityScore(data: HealthData): number {
  return data.physicalActivity === 'low' ? 1 : data.physicalActivity === 'moderate' ? 0.5 : 0.2;
}

function sleepScore(data: HealthData): number {
  return data.sleepHours < 5 || data.sleepHours > 10 ? 1 : Math.abs(data.sleepHours - 7.5) / 5;
}

function alcoholScore(data: HealthData): number {
  return data.alcohol === 'none' ? 0 : data.alcohol === 'occasional' ? 0.3 : data.alcohol === 'moderate' ? 0.6 : 1;
}

function generateModelMetrics(baseAccuracy: number, baseAuc: number): ModelMetrics {
  return {
    classical: {
      accuracy: Math.round(baseAccuracy * 10) / 10,
      precision: Math.round((baseAccuracy - 2) * 10) / 10,
      recall: Math.round((baseAccuracy - 4) * 10) / 10,
      f1: Math.round((baseAccuracy - 3) * 10) / 10,
      roc_auc: Math.round(baseAuc * 10) / 10,
    },
    quantum: {
      accuracy: Math.round((baseAccuracy + 4) * 10) / 10,
      precision: Math.round((baseAccuracy + 2) * 10) / 10,
      recall: Math.round((baseAccuracy + 5) * 10) / 10,
      f1: Math.round((baseAccuracy + 3) * 10) / 10,
      roc_auc: Math.round((baseAuc + 4) * 10) / 10,
    },
  };
}

function computeQuantumScore(classicalScore: number, interactions: number): number {
  const adjustment = (classicalScore - 50) * 0.05;
  return clamp(Math.round(classicalScore + interactions * 100 - adjustment));
}

function buildFactors(factors: Omit<RiskFactor, 'contribution'>[]): RiskFactor[] {
  const severityRank = { high: 3, moderate: 2, low: 1 };
  factors.sort((a, b) => severityRank[b.severity] - severityRank[a.severity]);
  const top = factors.slice(0, 6);
  const total = top.reduce((s, f) => s + severityRank[f.severity], 0);
  return top.map((f) => ({
    ...f,
    contribution: Math.round((severityRank[f.severity] / total) * 100),
  }));
}

function buildPieData(riskScore: number): { label: string; value: number; color: string }[] {
  const risk = riskScore;
  const moderate = Math.max(0, Math.min(20, 100 - risk - Math.max(0, 60 - risk)));
  const low = 100 - risk - moderate;
  return [
    { label: 'High Risk', value: Math.round(risk), color: '#f43f5e' },
    { label: 'Moderate', value: Math.round(moderate), color: '#f59e0b' },
    { label: 'Low Risk', value: Math.round(low), color: '#10b981' },
  ];
}

// ===================== DIABETES =====================
function analyzeDiabetes(data: HealthData): DiseaseResult {
  const glucoseW = normalize(data.glucose, 70, 200) * 0.30;
  const bmiW = normalize(data.bmi, 18, 45) * 0.18;
  const ageW = normalize(data.age, 20, 80) * 0.12;
  const bpW = normalize(data.bloodPressureSystolic, 100, 160) * 0.10;
  const activityW = activityScore(data) * 0.08;
  const familyW = (data.familyHistory ? 1 : 0) * 0.12;
  const cholW = normalize(data.cholesterol, 120, 280) * 0.06;
  const sleepW = sleepScore(data) * 0.04;

  const total = glucoseW + bmiW + ageW + bpW + activityW + familyW + cholW + sleepW;
  const classicalScore = clamp(Math.round((total / 1.0) * 100));

  const interactions =
    (data.bmi > 30 && data.glucose > 120 ? 0.04 : 0) +
    (data.familyHistory && data.glucose > 100 ? 0.03 : 0) +
    (data.age > 50 && data.bmi > 27 ? 0.02 : 0);
  const quantumScore = computeQuantumScore(classicalScore, interactions);
  const riskScore = Math.round(classicalScore * 0.45 + quantumScore * 0.55);
  const riskLevel = getRiskLevel(riskScore);

  const factors: Omit<RiskFactor, 'contribution'>[] = [];
  if (data.glucose >= 126) factors.push({ name: 'High Blood Glucose', description: 'Fasting glucose ≥126 mg/dL is diagnostic for diabetes.', value: `${data.glucose} mg/dL`, severity: 'high' });
  else if (data.glucose >= 100) factors.push({ name: 'Elevated Glucose (Prediabetes)', description: 'Fasting glucose 100-125 mg/dL indicates prediabetes.', value: `${data.glucose} mg/dL`, severity: 'moderate' });

  if (data.bmi >= 30) factors.push({ name: 'Obesity', description: 'BMI ≥30 strongly linked to insulin resistance and type 2 diabetes.', value: `${data.bmi.toFixed(1)}`, severity: 'high' });
  else if (data.bmi >= 25) factors.push({ name: 'Overweight', description: 'Excess weight contributes to metabolic dysfunction.', value: `${data.bmi.toFixed(1)}`, severity: 'moderate' });

  if (data.age > 45) factors.push({ name: 'Age', description: 'Diabetes risk increases significantly after age 45.', value: `${data.age} years`, severity: 'moderate' });
  if (data.familyHistory) factors.push({ name: 'Family History', description: 'Genetic predisposition is a major diabetes risk factor.', value: 'Positive', severity: 'moderate' });
  if (data.bloodPressureSystolic >= 130) factors.push({ name: 'Hypertension', description: 'High blood pressure often co-occurs with diabetes.', value: `${data.bloodPressureSystolic}/${data.bloodPressureDiastolic}`, severity: 'moderate' });
  if (data.physicalActivity === 'low') factors.push({ name: 'Sedentary Lifestyle', description: 'Physical inactivity worsens insulin sensitivity.', value: 'Low activity', severity: 'moderate' });

  const recommendations: string[] = [];
  if (riskLevel === 'high') recommendations.push('Consult an endocrinologist for HbA1c testing and comprehensive evaluation.');
  if (data.glucose >= 100) recommendations.push('Reduce refined sugar and simple carbohydrate intake; consider a low-glycemic diet.');
  if (data.bmi >= 25) recommendations.push('Achieve 5-7% weight loss through diet and exercise to significantly reduce diabetes risk.');
  if (data.physicalActivity === 'low') recommendations.push('Aim for 150 min/week of moderate aerobic exercise to improve insulin sensitivity.');
  if (data.familyHistory) recommendations.push('Schedule annual fasting glucose and HbA1c screenings given family history.');
  if (recommendations.length === 0) recommendations.push('Maintain healthy habits and get annual glucose screenings.');

  return {
    disease: 'diabetes',
    riskScore,
    riskLevel,
    classicalScore,
    quantumScore,
    riskFactors: buildFactors(factors),
    modelMetrics: generateModelMetrics(87.2, 88.9),
    featureImportance: [
      { feature: 'Glucose', importance: 30 },
      { feature: 'BMI', importance: 18 },
      { feature: 'Age', importance: 12 },
      { feature: 'Family History', importance: 12 },
      { feature: 'Blood Pressure', importance: 10 },
      { feature: 'Activity', importance: 8 },
      { feature: 'Cholesterol', importance: 6 },
      { feature: 'Sleep', importance: 4 },
    ],
    recommendations,
    pieData: buildPieData(riskScore),
  };
}

// ===================== CARDIOVASCULAR =====================
function analyzeCardiovascular(data: HealthData): DiseaseResult {
  const ageW = normalize(data.age, 30, 85) * 0.20;
  const bpW = normalize((data.bloodPressureSystolic + data.bloodPressureDiastolic) / 2, 80, 160) * 0.20;
  const cholW = normalize(data.cholesterol, 120, 280) * 0.15;
  const smokeW = (data.smoking ? 1 : 0) * 0.15;
  const bmiW = normalize(data.bmi, 18, 40) * 0.08;
  const hrW = normalize(data.heartRate, 50, 120) * 0.05;
  const activityW = activityScore(data) * 0.07;
  const familyW = (data.familyHistory ? 1 : 0) * 0.10;

  const total = ageW + bpW + cholW + smokeW + bmiW + hrW + activityW + familyW;
  const classicalScore = clamp(Math.round(total * 100));

  const interactions =
    (data.smoking && data.cholesterol > 220 ? 0.05 : 0) +
    (data.bloodPressureSystolic > 140 && data.age > 55 ? 0.04 : 0) +
    (data.familyHistory && data.smoking ? 0.03 : 0);
  const quantumScore = computeQuantumScore(classicalScore, interactions);
  const riskScore = Math.round(classicalScore * 0.45 + quantumScore * 0.55);
  const riskLevel = getRiskLevel(riskScore);

  const factors: Omit<RiskFactor, 'contribution'>[] = [];
  if (data.bloodPressureSystolic >= 140) factors.push({ name: 'High Blood Pressure', description: 'Hypertension is a leading cause of heart disease and stroke.', value: `${data.bloodPressureSystolic}/${data.bloodPressureDiastolic} mmHg`, severity: 'high' });
  else if (data.bloodPressureSystolic >= 130) factors.push({ name: 'Elevated BP', description: 'Stage 1 hypertension increases cardiac risk.', value: `${data.bloodPressureSystolic}/${data.bloodPressureDiastolic} mmHg`, severity: 'moderate' });

  if (data.cholesterol >= 240) factors.push({ name: 'High Cholesterol', description: 'Excess LDL builds arterial plaque leading to atherosclerosis.', value: `${data.cholesterol} mg/dL`, severity: 'high' });
  else if (data.cholesterol >= 200) factors.push({ name: 'Borderline Cholesterol', description: 'Elevated cholesterol warrants dietary changes.', value: `${data.cholesterol} mg/dL`, severity: 'moderate' });

  if (data.smoking) factors.push({ name: 'Smoking', description: 'Tobacco use doubles cardiovascular risk and damages blood vessels.', value: 'Active smoker', severity: 'high' });
  if (data.age > 55) factors.push({ name: 'Age', description: 'Cardiovascular risk rises sharply after age 55.', value: `${data.age} years`, severity: 'moderate' });
  if (data.familyHistory) factors.push({ name: 'Family History', description: 'Genetic factors contribute to cardiovascular disease risk.', value: 'Positive', severity: 'moderate' });
  if (data.bmi >= 30) factors.push({ name: 'Obesity', description: 'Excess weight strains the heart and raises blood pressure.', value: `${data.bmi.toFixed(1)}`, severity: 'moderate' });

  const recommendations: string[] = [];
  if (riskLevel === 'high') recommendations.push('See a cardiologist promptly for ECG, stress test, and lipid panel.');
  if (data.smoking) recommendations.push('Quit smoking — it is the single most impactful change for heart health.');
  if (data.cholesterol >= 200) recommendations.push('Adopt a heart-healthy diet: reduce saturated fats, increase fiber and omega-3s.');
  if (data.bloodPressureSystolic >= 130) recommendations.push('Monitor blood pressure daily and reduce sodium intake.');
  if (data.physicalActivity === 'low') recommendations.push('Start a cardiac-safe exercise program (consult your doctor first).');
  if (recommendations.length === 0) recommendations.push('Maintain cardiovascular health with regular exercise and balanced diet.');

  return {
    disease: 'cardiovascular',
    riskScore,
    riskLevel,
    classicalScore,
    quantumScore,
    riskFactors: buildFactors(factors),
    modelMetrics: generateModelMetrics(85.6, 90.1),
    featureImportance: [
      { feature: 'Age', importance: 20 },
      { feature: 'Blood Pressure', importance: 20 },
      { feature: 'Cholesterol', importance: 15 },
      { feature: 'Smoking', importance: 15 },
      { feature: 'Family History', importance: 10 },
      { feature: 'BMI', importance: 8 },
      { feature: 'Activity', importance: 7 },
      { feature: 'Heart Rate', importance: 5 },
    ],
    recommendations,
    pieData: buildPieData(riskScore),
  };
}

// ===================== HYPERTENSION =====================
function analyzeHypertension(data: HealthData): DiseaseResult {
  const bpW = normalize((data.bloodPressureSystolic + data.bloodPressureDiastolic) / 2, 80, 170) * 0.35;
  const ageW = normalize(data.age, 25, 80) * 0.15;
  const bmiW = normalize(data.bmi, 18, 40) * 0.15;
  const saltW = alcoholScore(data) * 0.05;
  const activityW = activityScore(data) * 0.10;
  const familyW = (data.familyHistory ? 1 : 0) * 0.10;
  const sleepW = sleepScore(data) * 0.05;
  const smokeW = (data.smoking ? 1 : 0) * 0.05;

  const total = bpW + ageW + bmiW + saltW + activityW + familyW + sleepW + smokeW;
  const classicalScore = clamp(Math.round(total * 100));

  const interactions =
    (data.bmi > 30 && data.bloodPressureSystolic > 130 ? 0.04 : 0) +
    (data.age > 50 && data.bloodPressureSystolic > 135 ? 0.03 : 0);
  const quantumScore = computeQuantumScore(classicalScore, interactions);
  const riskScore = Math.round(classicalScore * 0.45 + quantumScore * 0.55);
  const riskLevel = getRiskLevel(riskScore);

  const factors: Omit<RiskFactor, 'contribution'>[] = [];
  if (data.bloodPressureSystolic >= 140) factors.push({ name: 'Stage 2 Hypertension', description: 'BP ≥140/90 requires medical management.', value: `${data.bloodPressureSystolic}/${data.bloodPressureDiastolic} mmHg`, severity: 'high' });
  else if (data.bloodPressureSystolic >= 130) factors.push({ name: 'Stage 1 Hypertension', description: 'BP 130-139/80-89 warrants lifestyle changes and monitoring.', value: `${data.bloodPressureSystolic}/${data.bloodPressureDiastolic} mmHg`, severity: 'moderate' });
  else if (data.bloodPressureSystolic >= 120) factors.push({ name: 'Elevated BP', description: 'BP 120-129/<80 is a warning sign for future hypertension.', value: `${data.bloodPressureSystolic}/${data.bloodPressureDiastolic} mmHg`, severity: 'moderate' });

  if (data.bmi >= 30) factors.push({ name: 'Obesity', description: 'Excess weight increases blood volume and vascular resistance.', value: `${data.bmi.toFixed(1)}`, severity: 'high' });
  else if (data.bmi >= 25) factors.push({ name: 'Overweight', description: 'Above-normal BMI contributes to elevated blood pressure.', value: `${data.bmi.toFixed(1)}`, severity: 'moderate' });

  if (data.age > 50) factors.push({ name: 'Age', description: 'Blood vessels stiffen with age, increasing BP.', value: `${data.age} years`, severity: 'moderate' });
  if (data.familyHistory) factors.push({ name: 'Family History', description: 'Genetic factors account for 30-50% of hypertension cases.', value: 'Positive', severity: 'moderate' });
  if (data.alcohol === 'heavy' || data.alcohol === 'moderate') factors.push({ name: 'Alcohol', description: 'Regular alcohol raises blood pressure.', value: data.alcohol, severity: 'moderate' });
  if (data.smoking) factors.push({ name: 'Smoking', description: 'Nicotine acutely raises blood pressure and damages vessels.', value: 'Active smoker', severity: 'moderate' });

  const recommendations: string[] = [];
  if (riskLevel === 'high') recommendations.push('Consult a physician for antihypertensive medication evaluation.');
  if (data.bloodPressureSystolic >= 130) recommendations.push('Reduce sodium to <1500mg/day and monitor BP twice daily.');
  if (data.bmi >= 25) recommendations.push('Weight loss of 1kg can reduce BP by approximately 1 mmHg.');
  if (data.physicalActivity === 'low') recommendations.push('Aim for 150 min/week of aerobic exercise to lower BP naturally.');
  if (data.alcohol === 'heavy' || data.alcohol === 'moderate') recommendations.push('Limit alcohol to ≤1 drink/day (women) or ≤2 drinks/day (men).');
  if (recommendations.length === 0) recommendations.push('Continue monitoring blood pressure at your annual check-up.');

  return {
    disease: 'hypertension',
    riskScore,
    riskLevel,
    classicalScore,
    quantumScore,
    riskFactors: buildFactors(factors),
    modelMetrics: generateModelMetrics(89.1, 91.5),
    featureImportance: [
      { feature: 'Blood Pressure', importance: 35 },
      { feature: 'Age', importance: 15 },
      { feature: 'BMI', importance: 15 },
      { feature: 'Activity', importance: 10 },
      { feature: 'Family History', importance: 10 },
      { feature: 'Sleep', importance: 5 },
      { feature: 'Alcohol', importance: 5 },
      { feature: 'Smoking', importance: 5 },
    ],
    recommendations,
    pieData: buildPieData(riskScore),
  };
}

// ===================== BREAST CANCER =====================
function analyzeBreastCancer(data: HealthData): DiseaseResult {
  const ageW = normalize(data.age, 30, 85) * 0.22;
  const familyW = (data.familyHistory ? 1 : 0) * 0.20;
  const genderW = data.gender === 'female' ? 0.10 : data.gender === 'male' ? 0.01 : 0.05;
  const bmiW = normalize(data.bmi, 18, 40) * 0.10;
  const alcoholW = alcoholScore(data) * 0.06;
  const menarcheW = data.menarcheAge < 12 ? 0.08 : data.menarcheAge < 14 ? 0.04 : 0.02;
  const pregW = data.pregnancies === 0 ? 0.06 : data.pregnancies <= 2 ? 0.04 : 0.02;
  const breastfeedW = (data.breastfeeding ? 0 : 0.04);
  const activityW = activityScore(data) * 0.04;
  const smokeW = (data.smoking ? 1 : 0) * 0.04;

  const total = ageW + familyW + genderW + bmiW + alcoholW + menarcheW + pregW + breastfeedW + activityW + smokeW;
  const classicalScore = clamp(Math.round(total * 100));

  const interactions =
    (data.familyHistory && data.age > 45 ? 0.05 : 0) +
    (data.bmi > 28 && data.alcohol !== 'none' ? 0.03 : 0) +
    (data.menarcheAge < 12 && data.familyHistory ? 0.03 : 0);
  const quantumScore = computeQuantumScore(classicalScore, interactions);
  const riskScore = Math.round(classicalScore * 0.45 + quantumScore * 0.55);
  const riskLevel = getRiskLevel(riskScore);

  const factors: Omit<RiskFactor, 'contribution'>[] = [];
  if (data.gender === 'female' && data.age > 50) factors.push({ name: 'Age (Female)', description: 'Breast cancer risk increases significantly after menopause.', value: `${data.age} years`, severity: 'moderate' });
  if (data.familyHistory) factors.push({ name: 'Family History', description: 'BRCA1/BRCA2 mutations and family history strongly increase risk.', value: 'Positive', severity: 'high' });
  if (data.menarcheAge < 12) factors.push({ name: 'Early Menarche', description: 'Starting menstruation before age 12 increases lifetime estrogen exposure.', value: `Age ${data.menarcheAge}`, severity: 'moderate' });
  if (data.pregnancies === 0 && data.gender === 'female') factors.push({ name: 'Nulliparity', description: 'Never having been pregnant slightly increases breast cancer risk.', value: '0 pregnancies', severity: 'moderate' });
  if (data.bmi >= 28 && data.gender === 'female') factors.push({ name: 'High BMI', description: 'Post-menopausal obesity increases estrogen production and cancer risk.', value: `${data.bmi.toFixed(1)}`, severity: 'moderate' });
  if (data.alcohol === 'heavy' || data.alcohol === 'moderate') factors.push({ name: 'Alcohol', description: 'Alcohol consumption is linked to increased breast cancer risk.', value: data.alcohol, severity: 'moderate' });
  if (!data.breastfeeding && data.pregnancies > 0 && data.gender === 'female') factors.push({ name: 'No Breastfeeding', description: 'Breastfeeding has a protective effect; not breastfeeding slightly increases risk.', value: 'Did not breastfeed', severity: 'low' });

  const recommendations: string[] = [];
  if (riskLevel === 'high') recommendations.push('Discuss genetic testing (BRCA1/BRCA2) and enhanced screening with an oncologist.');
  if (data.gender === 'female' && data.age > 40) recommendations.push('Schedule annual mammography screenings.');
  if (data.familyHistory) recommendations.push('Consider earlier and more frequent screenings (starting 10 years before family member\'s diagnosis age).');
  if (data.bmi >= 28) recommendations.push('Weight management reduces post-menopausal breast cancer risk.');
  if (data.alcohol !== 'none') recommendations.push('Reduce alcohol intake — even moderate drinking increases breast cancer risk.');
  if (recommendations.length === 0) recommendations.push('Perform monthly self-exams and get regular clinical breast exams.');

  return {
    disease: 'breast_cancer',
    riskScore,
    riskLevel,
    classicalScore,
    quantumScore,
    riskFactors: buildFactors(factors),
    modelMetrics: generateModelMetrics(88.4, 92.3),
    featureImportance: [
      { feature: 'Age', importance: 22 },
      { feature: 'Family History', importance: 20 },
      { feature: 'Gender', importance: 10 },
      { feature: 'BMI', importance: 10 },
      { feature: 'Menarche Age', importance: 8 },
      { feature: 'Pregnancies', importance: 6 },
      { feature: 'Breastfeeding', importance: 4 },
      { feature: 'Alcohol', importance: 6 },
      { feature: 'Activity', importance: 4 },
      { feature: 'Smoking', importance: 4 },
    ],
    recommendations,
    pieData: buildPieData(riskScore),
  };
}

// ===================== SKIN CANCER =====================
function analyzeSkinCancer(data: HealthData): DiseaseResult {
  const uvW = normalize(data.skinExposure, 0, 40) * 0.25;
  const skinTypeW = (data.skinType <= 2 ? 0.20 : data.skinType <= 3 ? 0.12 : 0.06);
  const molesW = normalize(data.molesCount, 0, 100) * 0.15;
  const ageW = normalize(data.age, 20, 85) * 0.10;
  const familyW = (data.familyHistory ? 1 : 0) * 0.10;
  const smokeW = (data.smoking ? 1 : 0) * 0.05;
  const sunburnW = data.skinExposure > 20 && data.skinType <= 2 ? 0.10 : 0.05;
  const activityW = activityScore(data) * 0.03;

  const total = uvW + skinTypeW + molesW + ageW + familyW + smokeW + sunburnW + activityW;
  const classicalScore = clamp(Math.round(total * 100));

  const interactions =
    (data.skinType <= 2 && data.skinExposure > 20 ? 0.06 : 0) +
    (data.molesCount > 50 && data.skinType <= 3 ? 0.04 : 0) +
    (data.familyHistory && data.skinExposure > 15 ? 0.03 : 0);
  const quantumScore = computeQuantumScore(classicalScore, interactions);
  const riskScore = Math.round(classicalScore * 0.45 + quantumScore * 0.55);
  const riskLevel = getRiskLevel(riskScore);

  const factors: Omit<RiskFactor, 'contribution'>[] = [];
  if (data.skinExposure > 20) factors.push({ name: 'High UV Exposure', description: 'Prolonged sun exposure causes DNA damage in skin cells.', value: `${data.skinExposure} hrs/week`, severity: 'high' });
  else if (data.skinExposure > 10) factors.push({ name: 'Moderate UV Exposure', description: 'Regular sun exposure accumulates UV damage over time.', value: `${data.skinExposure} hrs/week`, severity: 'moderate' });

  if (data.skinType <= 2) factors.push({ name: 'Fair Skin (Type I-II)', description: 'Light skin has less melanin protection and higher melanoma risk.', value: `Type ${data.skinType}`, severity: 'high' });
  else if (data.skinType <= 3) factors.push({ name: 'Light Skin (Type III)', description: 'Moderate skin pigmentation still carries elevated risk.', value: `Type ${data.skinType}`, severity: 'moderate' });

  if (data.molesCount > 50) factors.push({ name: 'Many Moles', description: '>50 moles increases melanoma risk significantly.', value: `${data.molesCount} moles`, severity: 'high' });
  else if (data.molesCount > 20) factors.push({ name: 'Multiple Moles', description: '20-50 moles moderately increases melanoma risk.', value: `${data.molesCount} moles`, severity: 'moderate' });

  if (data.age > 50) factors.push({ name: 'Age', description: 'Skin cancer risk accumulates with lifetime UV exposure.', value: `${data.age} years`, severity: 'moderate' });
  if (data.familyHistory) factors.push({ name: 'Family History', description: 'Genetic factors like CDKN2A mutations increase melanoma risk.', value: 'Positive', severity: 'moderate' });
  if (data.smoking) factors.push({ name: 'Smoking', description: 'Smoking is associated with squamous cell carcinoma risk.', value: 'Active smoker', severity: 'moderate' });

  const recommendations: string[] = [];
  if (riskLevel === 'high') recommendations.push('See a dermatologist for full-body skin examination and mole mapping.');
  if (data.skinExposure > 10) recommendations.push('Apply SPF 30+ sunscreen daily and reapply every 2 hours outdoors.');
  if (data.skinType <= 2) recommendations.push('Wear UPF 50+ protective clothing and avoid peak sun hours (10am-4pm).');
  if (data.molesCount > 20) recommendations.push('Perform monthly ABCDE self-checks: Asymmetry, Border, Color, Diameter, Evolving.');
  if (data.familyHistory) recommendations.push('Schedule annual dermatologist screenings given family history of skin cancer.');
  if (recommendations.length === 0) recommendations.push('Use daily sunscreen and examine your skin monthly for new or changing moles.');

  return {
    disease: 'skin_cancer',
    riskScore,
    riskLevel,
    classicalScore,
    quantumScore,
    riskFactors: buildFactors(factors),
    modelMetrics: generateModelMetrics(86.7, 89.8),
    featureImportance: [
      { feature: 'UV Exposure', importance: 25 },
      { feature: 'Skin Type', importance: 20 },
      { feature: 'Mole Count', importance: 15 },
      { feature: 'Age', importance: 10 },
      { feature: 'Family History', importance: 10 },
      { feature: 'Sunburn History', importance: 10 },
      { feature: 'Smoking', importance: 5 },
      { feature: 'Activity', importance: 3 },
    ],
    recommendations,
    pieData: buildPieData(riskScore),
  };
}

// ===================== CKD =====================
function analyzeCKD(data: HealthData): DiseaseResult {
  const bpW = normalize((data.bloodPressureSystolic + data.bloodPressureDiastolic) / 2, 80, 160) * 0.20;
  const glucoseW = normalize(data.glucose, 70, 200) * 0.18;
  const ageW = normalize(data.age, 25, 80) * 0.12;
  const bmiW = normalize(data.bmi, 18, 40) * 0.08;
  const waterW = normalize(15 - data.waterIntake, 0, 15) * 0.10;
  const urinationW = data.urinationFrequency === 'frequent' ? 0.10 : data.urinationFrequency === 'increased' ? 0.06 : 0.02;
  const swellingW = (data.swelling ? 1 : 0) * 0.10;
  const familyW = (data.familyHistory ? 1 : 0) * 0.08;
  const smokeW = (data.smoking ? 1 : 0) * 0.04;

  const total = bpW + glucoseW + ageW + bmiW + waterW + urinationW + swellingW + familyW + smokeW;
  const classicalScore = clamp(Math.round(total * 100));

  const interactions =
    (data.glucose > 126 && data.bloodPressureSystolic > 140 ? 0.06 : 0) +
    (data.swelling && data.urinationFrequency !== 'normal' ? 0.04 : 0) +
    (data.waterIntake < 4 && data.bloodPressureSystolic > 130 ? 0.03 : 0);
  const quantumScore = computeQuantumScore(classicalScore, interactions);
  const riskScore = Math.round(classicalScore * 0.45 + quantumScore * 0.55);
  const riskLevel = getRiskLevel(riskScore);

  const factors: Omit<RiskFactor, 'contribution'>[] = [];
  if (data.bloodPressureSystolic >= 140) factors.push({ name: 'Hypertension', description: 'High BP damages kidney blood vessels and filtering units.', value: `${data.bloodPressureSystolic}/${data.bloodPressureDiastolic} mmHg`, severity: 'high' });
  else if (data.bloodPressureSystolic >= 130) factors.push({ name: 'Elevated BP', description: 'Borderline hypertension gradually impairs kidney function.', value: `${data.bloodPressureSystolic}/${data.bloodPressureDiastolic} mmHg`, severity: 'moderate' });

  if (data.glucose >= 126) factors.push({ name: 'High Glucose', description: 'Diabetes is the leading cause of CKD — high sugar damages kidney filters.', value: `${data.glucose} mg/dL`, severity: 'high' });
  else if (data.glucose >= 100) factors.push({ name: 'Elevated Glucose', description: 'Prediabetes can progress to diabetic kidney disease over time.', value: `${data.glucose} mg/dL`, severity: 'moderate' });

  if (data.waterIntake < 4) factors.push({ name: 'Low Hydration', description: 'Inadequate water intake reduces kidney filtration efficiency.', value: `${data.waterIntake} glasses/day`, severity: 'moderate' });
  if (data.urinationFrequency === 'frequent') factors.push({ name: 'Frequent Urination', description: 'May indicate impaired kidney concentrating ability.', value: 'Frequent', severity: 'moderate' });
  else if (data.urinationFrequency === 'increased') factors.push({ name: 'Increased Urination', description: 'Changes in urination pattern may signal kidney issues.', value: 'Increased', severity: 'low' });

  if (data.swelling) factors.push({ name: 'Edema/Swelling', description: 'Fluid retention suggests the kidneys may not be filtering properly.', value: 'Present', severity: 'high' });
  if (data.age > 60) factors.push({ name: 'Age', description: 'Kidney function naturally declines with age.', value: `${data.age} years`, severity: 'moderate' });
  if (data.familyHistory) factors.push({ name: 'Family History', description: 'Genetic kidney conditions like PKD increase CKD risk.', value: 'Positive', severity: 'moderate' });

  const recommendations: string[] = [];
  if (riskLevel === 'high') recommendations.push('See a nephrologist for eGFR, creatinine, and urine albumin testing.');
  if (data.bloodPressureSystolic >= 130) recommendations.push('Tight BP control (<130/80) slows CKD progression.');
  if (data.glucose >= 100) recommendations.push('Blood sugar management is critical — diabetes is the #1 cause of CKD.');
  if (data.waterIntake < 6) recommendations.push('Increase water intake to 8+ glasses/day to support kidney filtration.');
  if (data.swelling) recommendations.push('Report swelling to your doctor — it may indicate fluid retention from kidney issues.');
  if (recommendations.length === 0) recommendations.push('Stay well-hydrated and get annual kidney function tests.');

  return {
    disease: 'chronic_kidney_disease',
    riskScore,
    riskLevel,
    classicalScore,
    quantumScore,
    riskFactors: buildFactors(factors),
    modelMetrics: generateModelMetrics(84.3, 87.6),
    featureImportance: [
      { feature: 'Blood Pressure', importance: 20 },
      { feature: 'Glucose', importance: 18 },
      { feature: 'Age', importance: 12 },
      { feature: 'Hydration', importance: 10 },
      { feature: 'Urination', importance: 10 },
      { feature: 'Edema', importance: 10 },
      { feature: 'Family History', importance: 8 },
      { feature: 'BMI', importance: 8 },
      { feature: 'Smoking', importance: 4 },
    ],
    recommendations,
    pieData: buildPieData(riskScore),
  };
}

// ===================== MAIN ANALYSIS =====================
export function runAnalysis(data: HealthData): AnalysisResult {
  const diseases: DiseaseResult[] = [
    analyzeDiabetes(data),
    analyzeCardiovascular(data),
    analyzeHypertension(data),
    analyzeBreastCancer(data),
    analyzeSkinCancer(data),
    analyzeCKD(data),
  ];

  const overallRiskScore = Math.round(
    diseases.reduce((s, d) => s + d.riskScore, 0) / diseases.length,
  );
  const overallRiskLevel = getRiskLevel(overallRiskScore);

  // Use the highest-risk disease for the legacy fields
  const topDisease = [...diseases].sort((a, b) => b.riskScore - a.riskScore)[0];

  return {
    overallRiskScore,
    overallRiskLevel,
    diseases,
    // Legacy compatibility
    riskScore: overallRiskScore,
    riskLevel: overallRiskLevel,
    classicalScore: topDisease.classicalScore,
    quantumScore: topDisease.quantumScore,
    riskFactors: topDisease.riskFactors,
    modelMetrics: topDisease.modelMetrics,
    featureImportance: topDisease.featureImportance,
    recommendations: topDisease.recommendations,
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

export function getDiseaseInfo(type: DiseaseType) {
  return DISEASES.find((d) => d.type === type)!;
}
