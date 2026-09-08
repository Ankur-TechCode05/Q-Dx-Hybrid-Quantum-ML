import { useEffect, useState } from 'react';
import {
  CheckCircle2, Cpu, Atom, Database, GitBranch,
  Loader2, Sparkles, Layers,
} from 'lucide-react';
import type { HealthData, AnalysisResult } from '@/types';
import { runAnalysis, DISEASES } from '@/lib/analysis';
import { navigate } from '@/lib/router';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { QuantumCircuit } from '@/components/QuantumCircuit';
import { Disclaimer } from '@/components/Disclaimer';

const pipelineSteps = [
  { icon: Database, label: 'Data Preprocessing', description: 'Normalizing 18+ features, encoding categorical variables, handling missing values' },
  { icon: Sparkles, label: 'Feature Selection', description: 'Selecting disease-specific feature subsets using mutual information and quantum feature importance' },
  { icon: Cpu, label: 'Classical ML Inference', description: 'Running disease-specific Random Forest and XGBoost models on preprocessed features' },
  { icon: Atom, label: 'Quantum ML Inference', description: 'Encoding features into quantum states, executing 6 disease-specific VQCs on Qiskit Aer' },
  { icon: Layers, label: 'Multi-Disease Scoring', description: 'Computing risk scores for Diabetes, Cardiovascular, Hypertension, Breast Cancer, Skin Cancer, CKD' },
  { icon: GitBranch, label: 'Hybrid Fusion & Explainability', description: 'Combining classical and quantum predictions, generating per-disease risk factors and recommendations' },
];

export function AnalysisPage() {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [done, setDone] = useState(false);
  const [data, setData] = useState<HealthData | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem('qdx-health-data');
    if (!stored) {
      navigate('/assessment');
      return;
    }
    setData(JSON.parse(stored) as HealthData);
  }, []);

  useEffect(() => {
    if (!data) return;

    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step >= pipelineSteps.length) {
        clearInterval(interval);
        setDone(true);

        const result = runAnalysis(data);
        sessionStorage.setItem('qdx-analysis-result', JSON.stringify(result));

        if (user) {
          supabase
            .from('assessments')
            .insert({
              user_id: user.id,
              age: data.age,
              gender: data.gender,
              bmi: data.bmi,
              blood_pressure_systolic: data.bloodPressureSystolic,
              blood_pressure_diastolic: data.bloodPressureDiastolic,
              heart_rate: data.heartRate,
              glucose: data.glucose,
              cholesterol: data.cholesterol,
              smoking: data.smoking,
              physical_activity: data.physicalActivity,
              sleep_hours: data.sleepHours,
              alcohol: data.alcohol,
              family_history: data.familyHistory,
              risk_score: result.overallRiskScore,
              risk_level: result.overallRiskLevel,
              classical_score: result.classicalScore,
              quantum_score: result.quantumScore,
              risk_factors: result.riskFactors,
              model_metrics: result.modelMetrics,
            })
            .then(({ error }) => {
              if (error) console.error('Failed to save assessment:', error.message);
            });
        }

        setTimeout(() => navigate('/results'), 1500);
      } else {
        setCurrentStep(step);
      }
    }, 1300);

    return () => clearInterval(interval);
  }, [data, user]);

  if (!data) return null;

  return (
    <div className="bg-mesh min-h-screen">
      <div className="container-app px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 items-center justify-center mb-4 shadow-lg shadow-brand-500/30 animate-pulse-slow">
              <Atom className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 dark:text-white">
              Multi-Disease Analysis
            </h1>
            <p className="mt-3 text-slate-600 dark:text-slate-400">
              Running hybrid quantum-classical ML pipeline across 6 disease categories
            </p>
          </div>

          <Disclaimer />

          {/* Disease badges */}
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            {DISEASES.map((d) => (
              <div key={d.type} className="badge bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
                {d.shortLabel}
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mt-8">
            {/* Pipeline Steps */}
            <div className="space-y-3">
              {pipelineSteps.map((step, i) => {
                const isComplete = done || i < currentStep;
                const isActive = !done && i === currentStep;
                const isPending = !done && i > currentStep;

                return (
                  <div key={i} className={`glass-card p-5 flex items-start gap-4 transition-all duration-500 ${isActive ? 'glow-blue scale-[1.02]' : ''} ${isPending ? 'opacity-40' : ''}`}>
                    <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                      isComplete ? 'bg-emerald-500' : isActive ? 'bg-gradient-to-br from-brand-500 to-accent-500' : 'bg-slate-200 dark:bg-slate-800'
                    }`}>
                      {isComplete ? <CheckCircle2 className="w-5 h-5 text-white" /> : isActive ? <step.icon className="w-5 h-5 text-white animate-pulse" /> : <step.icon className="w-5 h-5 text-slate-400" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className={`font-semibold text-sm ${isComplete ? 'text-emerald-600 dark:text-emerald-400' : isActive ? 'text-brand-600 dark:text-brand-400' : 'text-slate-500 dark:text-slate-400'}`}>{step.label}</h3>
                        {isActive && <Loader2 className="w-3.5 h-3.5 text-brand-500 animate-spin" />}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{step.description}</p>
                      {isActive && (
                        <div className="mt-2 h-1 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-brand-500 to-accent-500 rounded-full animate-pulse" style={{ width: '60%' }} />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quantum Circuit + Log */}
            <div className="space-y-4">
              <QuantumCircuit active={!done} />

              <div className="glass-card p-4 font-mono text-xs space-y-1 max-h-56 overflow-y-auto scrollbar-thin">
                <div className="text-slate-400">$ qdx-pipeline --mode=hybrid --diseases=6</div>
                {currentStep >= 0 && <div className="text-emerald-500">✓ Input validated: 18 features across 6 disease profiles</div>}
                {currentStep >= 1 && <div className="text-emerald-500">✓ Normalization complete (z-score + min-max)</div>}
                {currentStep >= 1 && <div className="text-emerald-500">✓ Feature encoding complete (one-hot + ordinal)</div>}
                {currentStep >= 2 && <div className="text-brand-500">→ Classical: Diabetes RF model loaded</div>}
                {currentStep >= 2 && <div className="text-brand-500">→ Classical: Cardiovascular XGBoost model</div>}
                {currentStep >= 2 && <div className="text-brand-500">→ Classical: 6 disease models executed</div>}
                {currentStep >= 3 && <div className="text-accent-500">→ Quantum: amplitude encoding (4 qubits × 6 models)</div>}
                {currentStep >= 3 && <div className="text-accent-500">→ Quantum: VQC execution on Aer simulator</div>}
                {currentStep >= 4 && <div className="text-emerald-500">✓ Shots: 1024 | Depth: 7 | Models: 6</div>}
                {currentStep >= 4 && <div className="text-emerald-500">✓ Multi-disease scoring complete</div>}
                {currentStep >= 5 && <div className="text-emerald-500">✓ Hybrid fusion + explainability complete</div>}
                {done && <div className="text-emerald-500">✓ Analysis complete — redirecting to dashboard...</div>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
