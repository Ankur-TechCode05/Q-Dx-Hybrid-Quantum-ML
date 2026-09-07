import { useEffect, useState } from 'react';
import {
  Brain, Download, GitBranch, Info, Lightbulb, Sparkles,
  TrendingUp, Zap,
} from 'lucide-react';
import type { AnalysisResult, HealthData } from '@/types';
import { navigate } from '@/lib/router';
import { generateReport } from '@/lib/report';
import { Disclaimer } from '@/components/Disclaimer';
import { BarChart } from '@/components/Charts';
import { useAuth } from '@/context/AuthContext';

export function ExplainPage() {
  const { user } = useAuth();
  const [data, setData] = useState<HealthData | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  useEffect(() => {
    const storedData = sessionStorage.getItem('qdx-health-data');
    const storedResult = sessionStorage.getItem('qdx-analysis-result');
    if (!storedData || !storedResult) {
      navigate('/assessment');
      return;
    }
    setData(JSON.parse(storedData) as HealthData);
    setResult(JSON.parse(storedResult) as AnalysisResult);
  }, []);

  if (!data || !result) return null;

  const featureData = result.featureImportance.map((f) => ({
    label: f.feature,
    value: f.importance,
    max: Math.max(...result.featureImportance.map((fi) => fi.importance)),
  }));

  return (
    <div className="bg-mesh min-h-screen">
      <div className="container-app px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-br from-accent-500 to-brand-500 items-center justify-center mb-4 shadow-lg shadow-accent-500/30">
              <Brain className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 dark:text-white">
              Explainable AI
            </h1>
            <p className="mt-3 text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Understanding how the model arrived at your risk score — transparent, interpretable,
              and traceable
            </p>
          </div>

          <Disclaimer variant="card" />

          {/* SHAP-style Feature Attribution */}
          <div className="glass-card p-6 mt-8">
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="w-5 h-5 text-brand-500" />
              <h2 className="text-lg font-display font-semibold text-slate-900 dark:text-white">
                Feature Attribution
              </h2>
              <span className="text-xs text-slate-500 dark:text-slate-400 ml-auto">
                How each health factor contributed to your risk score
              </span>
            </div>
            <BarChart data={featureData} height={220} color="from-brand-500 to-accent-500" />
          </div>

          {/* Factor Explanations */}
          <div className="glass-card p-6 mt-6">
            <div className="flex items-center gap-2 mb-6">
              <Info className="w-5 h-5 text-accent-500" />
              <h2 className="text-lg font-display font-semibold text-slate-900 dark:text-white">
                Factor-by-Factor Explanation
              </h2>
            </div>
            <div className="space-y-4">
              {result.riskFactors.map((factor, i) => (
                <div key={i} className="p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div className="flex items-start gap-3">
                    <div className={`w-1 h-full rounded-full flex-shrink-0 ${
                      factor.severity === 'high' ? 'bg-rose-500' :
                      factor.severity === 'moderate' ? 'bg-amber-500' : 'bg-emerald-500'
                    }`} style={{ minHeight: '100%' }} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-slate-900 dark:text-white">{factor.name}</h3>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                            {factor.contribution}% contribution
                          </span>
                          <span className={`badge ${
                            factor.severity === 'high' ? 'badge-high' :
                            factor.severity === 'moderate' ? 'badge-moderate' : 'badge-low'
                          } capitalize`}>
                            {factor.severity}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-2">
                        {factor.description}
                      </p>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-slate-500 dark:text-slate-400">Your value:</span>
                        <span className="font-mono font-medium px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {factor.value}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* How the Hybrid Model Works */}
          <div className="glass-card p-6 mt-6">
            <div className="flex items-center gap-2 mb-6">
              <GitBranch className="w-5 h-5 text-brand-500" />
              <h2 className="text-lg font-display font-semibold text-slate-900 dark:text-white">
                How the Hybrid Model Reached Your Score
              </h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-brand-100 dark:bg-brand-950/40 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-brand-600 dark:text-brand-400">1</span>
                </div>
                <div>
                  <h4 className="font-medium text-slate-900 dark:text-white text-sm">Classical ML Analysis</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Your 12 health features were fed into a Random Forest and XGBoost ensemble.
                    The classical model produced a risk score of <span className="font-mono font-semibold text-brand-600 dark:text-brand-400">{result.classicalScore}/100</span> based on
                    learned decision boundaries from training data.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-accent-100 dark:bg-accent-950/40 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-accent-600 dark:text-accent-400">2</span>
                </div>
                <div>
                  <h4 className="font-medium text-slate-900 dark:text-white text-sm">Quantum ML Analysis</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Your features were amplitude-encoded into a 4-qubit quantum state. A variational
                    quantum circuit (VQC) with 7 layers of parameterized gates was executed on the
                    Qiskit Aer simulator with 1024 shots. The quantum model produced a score of
                    <span className="font-mono font-semibold text-accent-600 dark:text-accent-400"> {result.quantumScore}/100</span>,
                    capturing non-linear feature interactions.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/40 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">3</span>
                </div>
                <div>
                  <h4 className="font-medium text-slate-900 dark:text-white text-sm">Hybrid Fusion</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    The final risk score of <span className="font-mono font-semibold text-slate-900 dark:text-white">{result.riskScore}/100</span> was
                    computed as a weighted ensemble (45% classical, 55% quantum), leveraging the
                    quantum model's superior sensitivity to complex risk factor combinations.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quantum Advantage */}
          <div className="glass-card p-6 mt-6 bg-gradient-to-br from-accent-50/50 to-brand-50/50 dark:from-accent-950/20 dark:to-brand-950/20">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-500 to-brand-500 flex items-center justify-center flex-shrink-0">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-slate-900 dark:text-white mb-2">
                  Why Quantum ML Helps Here
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Health risk factors don't act in isolation — they compound. Smoking combined with
                  family history, or high BMI with elevated glucose, creates risk that's more than
                  the sum of individual factors. Quantum kernel methods implicitly map features into
                  a higher-dimensional space, making these complex interactions easier to detect
                  without manually engineering interaction terms.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <button onClick={() => generateReport(data, result, user?.email)} className="btn-primary">
              <Download className="w-5 h-5" />
              Download Full Report
            </button>
            <button onClick={() => navigate('/results')} className="btn-secondary">
              Back to Results
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
