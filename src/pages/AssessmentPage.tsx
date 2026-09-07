import { useState } from 'react';
import {
  Activity, ArrowRight, Cigarette, Droplet, Dumbbell,
  HeartPulse, Moon, PersonStanding, Ruler, User,
  Wine,
} from 'lucide-react';
import type { HealthData, Gender, PhysicalActivity, Alcohol } from '@/types';
import { navigate } from '@/lib/router';
import { Disclaimer } from '@/components/Disclaimer';

const initialData: HealthData = {
  age: 35,
  gender: 'male',
  bmi: 24,
  bloodPressureSystolic: 120,
  bloodPressureDiastolic: 80,
  heartRate: 72,
  glucose: 95,
  cholesterol: 180,
  smoking: false,
  physicalActivity: 'moderate',
  sleepHours: 7,
  alcohol: 'none',
  familyHistory: false,
};

export function AssessmentPage() {
  const [data, setData] = useState<HealthData>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const update = <K extends keyof HealthData>(key: K, value: HealthData[K]) => {
    setData((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: '' }));
  };

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (data.age < 1 || data.age > 120) e.age = 'Enter a valid age (1-120)';
    if (data.bmi < 10 || data.bmi > 60) e.bmi = 'Enter a valid BMI (10-60)';
    if (data.bloodPressureSystolic < 60 || data.bloodPressureSystolic > 250) e.bp = 'Enter valid systolic BP (60-250)';
    if (data.bloodPressureDiastolic < 40 || data.bloodPressureDiastolic > 150) e.bp = 'Enter valid diastolic BP (40-150)';
    if (data.heartRate < 30 || data.heartRate > 220) e.hr = 'Enter valid heart rate (30-220)';
    if (data.glucose < 40 || data.glucose > 400) e.glucose = 'Enter valid glucose (40-400)';
    if (data.cholesterol < 80 || data.cholesterol > 400) e.chol = 'Enter valid cholesterol (80-400)';
    if (data.sleepHours < 0 || data.sleepHours > 24) e.sleep = 'Enter valid sleep hours (0-24)';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    // Store data in sessionStorage for the analysis page to pick up
    sessionStorage.setItem('qdx-health-data', JSON.stringify(data));
    navigate('/analysis');
  };

  return (
    <div className="bg-mesh min-h-screen">
      <div className="container-app px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 items-center justify-center mb-4 shadow-lg shadow-brand-500/30">
              <HeartPulse className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 dark:text-white">
              Health Assessment
            </h1>
            <p className="mt-3 text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
              Enter your health metrics below. Our hybrid quantum-classical ML pipeline will
              analyze them to estimate your disease risk profile.
            </p>
          </div>

          <Disclaimer variant="card" />

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            {/* Demographics */}
            <div className="glass-card p-6">
              <div className="flex items-center gap-2 mb-5">
                <User className="w-5 h-5 text-brand-500" />
                <h2 className="text-lg font-display font-semibold text-slate-900 dark:text-white">
                  Demographics
                </h2>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="label-text">Age (years)</label>
                  <input
                    type="number"
                    value={data.age}
                    onChange={(e) => update('age', Number(e.target.value))}
                    className="input-field"
                    min={1}
                    max={120}
                  />
                  {errors.age && <p className="text-xs text-rose-500 mt-1">{errors.age}</p>}
                </div>
                <div>
                  <label className="label-text">Gender</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['male', 'female', 'other'] as Gender[]).map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => update('gender', g)}
                        className={`px-3 py-3 rounded-xl text-sm font-medium capitalize transition-all duration-200 ${
                          data.gender === g
                            ? 'bg-gradient-to-r from-brand-500 to-accent-500 text-white shadow-md'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Body Metrics */}
            <div className="glass-card p-6">
              <div className="flex items-center gap-2 mb-5">
                <Ruler className="w-5 h-5 text-brand-500" />
                <h2 className="text-lg font-display font-semibold text-slate-900 dark:text-white">
                  Body Metrics
                </h2>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="label-text">BMI (kg/m²)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={data.bmi}
                    onChange={(e) => update('bmi', Number(e.target.value))}
                    className="input-field"
                  />
                  {errors.bmi && <p className="text-xs text-rose-500 mt-1">{errors.bmi}</p>}
                  <p className="text-xs text-slate-400 mt-1">Normal: 18.5–24.9</p>
                </div>
                <div>
                  <label className="label-text">Heart Rate (bpm)</label>
                  <input
                    type="number"
                    value={data.heartRate}
                    onChange={(e) => update('heartRate', Number(e.target.value))}
                    className="input-field"
                  />
                  {errors.hr && <p className="text-xs text-rose-500 mt-1">{errors.hr}</p>}
                  <p className="text-xs text-slate-400 mt-1">Normal: 60–100</p>
                </div>
              </div>
            </div>

            {/* Vitals */}
            <div className="glass-card p-6">
              <div className="flex items-center gap-2 mb-5">
                <Activity className="w-5 h-5 text-brand-500" />
                <h2 className="text-lg font-display font-semibold text-slate-900 dark:text-white">
                  Vital Signs
                </h2>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="label-text">Systolic BP (mmHg)</label>
                  <input
                    type="number"
                    value={data.bloodPressureSystolic}
                    onChange={(e) => update('bloodPressureSystolic', Number(e.target.value))}
                    className="input-field"
                  />
                  {errors.bp && <p className="text-xs text-rose-500 mt-1">{errors.bp}</p>}
                  <p className="text-xs text-slate-400 mt-1">Normal: &lt;120</p>
                </div>
                <div>
                  <label className="label-text">Diastolic BP (mmHg)</label>
                  <input
                    type="number"
                    value={data.bloodPressureDiastolic}
                    onChange={(e) => update('bloodPressureDiastolic', Number(e.target.value))}
                    className="input-field"
                  />
                  <p className="text-xs text-slate-400 mt-1">Normal: &lt;80</p>
                </div>
                <div>
                  <label className="label-text">Glucose (mg/dL)</label>
                  <input
                    type="number"
                    value={data.glucose}
                    onChange={(e) => update('glucose', Number(e.target.value))}
                    className="input-field"
                  />
                  {errors.glucose && <p className="text-xs text-rose-500 mt-1">{errors.glucose}</p>}
                  <p className="text-xs text-slate-400 mt-1">Normal: 70–99</p>
                </div>
                <div>
                  <label className="label-text">Cholesterol (mg/dL)</label>
                  <input
                    type="number"
                    value={data.cholesterol}
                    onChange={(e) => update('cholesterol', Number(e.target.value))}
                    className="input-field"
                  />
                  {errors.chol && <p className="text-xs text-rose-500 mt-1">{errors.chol}</p>}
                  <p className="text-xs text-slate-400 mt-1">Normal: &lt;200</p>
                </div>
              </div>
            </div>

            {/* Lifestyle */}
            <div className="glass-card p-6">
              <div className="flex items-center gap-2 mb-5">
                <PersonStanding className="w-5 h-5 text-brand-500" />
                <h2 className="text-lg font-display font-semibold text-slate-900 dark:text-white">
                  Lifestyle Factors
                </h2>
              </div>
              <div className="space-y-5">
                {/* Smoking */}
                <div>
                  <label className="label-text flex items-center gap-2">
                    <Cigarette className="w-4 h-4" /> Smoking
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: 'Non-smoker', value: false },
                      { label: 'Smoker', value: true },
                    ].map((opt) => (
                      <button
                        key={String(opt.value)}
                        type="button"
                        onClick={() => update('smoking', opt.value)}
                        className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                          data.smoking === opt.value
                            ? 'bg-gradient-to-r from-brand-500 to-accent-500 text-white shadow-md'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Physical Activity */}
                <div>
                  <label className="label-text flex items-center gap-2">
                    <Dumbbell className="w-4 h-4" /> Physical Activity Level
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['low', 'moderate', 'high'] as PhysicalActivity[]).map((level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => update('physicalActivity', level)}
                        className={`px-3 py-3 rounded-xl text-sm font-medium capitalize transition-all duration-200 ${
                          data.physicalActivity === level
                            ? 'bg-gradient-to-r from-brand-500 to-accent-500 text-white shadow-md'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sleep */}
                <div>
                  <label className="label-text flex items-center gap-2">
                    <Moon className="w-4 h-4" /> Sleep Duration (hours)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={data.sleepHours}
                    onChange={(e) => update('sleepHours', Number(e.target.value))}
                    className="input-field"
                    min={0}
                    max={24}
                  />
                  {errors.sleep && <p className="text-xs text-rose-500 mt-1">{errors.sleep}</p>}
                  <p className="text-xs text-slate-400 mt-1">Recommended: 7–9 hours</p>
                </div>

                {/* Alcohol */}
                <div>
                  <label className="label-text flex items-center gap-2">
                    <Wine className="w-4 h-4" /> Alcohol Consumption
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {(['none', 'occasional', 'moderate', 'heavy'] as Alcohol[]).map((level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => update('alcohol', level)}
                        className={`px-3 py-3 rounded-xl text-sm font-medium capitalize transition-all duration-200 ${
                          data.alcohol === level
                            ? 'bg-gradient-to-r from-brand-500 to-accent-500 text-white shadow-md'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Family History */}
                <div>
                  <label className="label-text flex items-center gap-2">
                    <Droplet className="w-4 h-4" /> Family History of Chronic Disease
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: 'No family history', value: false },
                      { label: 'Has family history', value: true },
                    ].map((opt) => (
                      <button
                        key={String(opt.value)}
                        type="button"
                        onClick={() => update('familyHistory', opt.value)}
                        className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                          data.familyHistory === opt.value
                            ? 'bg-gradient-to-r from-brand-500 to-accent-500 text-white shadow-md'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-end">
              <button type="button" onClick={() => navigate('/')} className="btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                <ArrowRight className="w-5 h-5" />
                Run Analysis
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
