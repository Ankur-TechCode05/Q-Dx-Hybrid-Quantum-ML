import { useEffect, useState } from 'react';
import {
  Atom, Award, BarChart3, Cpu, GitCompare, Info,
  Layers, TrendingUp, Zap,
} from 'lucide-react';
import type { AnalysisResult, DiseaseType } from '@/types';
import { navigate } from '@/lib/router';
import { Disclaimer } from '@/components/Disclaimer';
import { ComparisonBar, RadarChart } from '@/components/Charts';
import { getDiseaseInfo } from '@/lib/analysis';

export function ComparisonPage() {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [selectedDisease, setSelectedDisease] = useState<DiseaseType>('diabetes');

  useEffect(() => {
    const stored = sessionStorage.getItem('qdx-analysis-result');
    if (!stored) {
      navigate('/assessment');
      return;
    }
    setResult(JSON.parse(stored) as AnalysisResult);
  }, []);

  if (!result) return null;

  const disease = result.diseases.find((d) => d.disease === selectedDisease)!;
  const info = getDiseaseInfo(selectedDisease);

  const radarData = [
    { label: 'Accuracy', classical: disease.modelMetrics.classical.accuracy, quantum: disease.modelMetrics.quantum.accuracy },
    { label: 'Precision', classical: disease.modelMetrics.classical.precision, quantum: disease.modelMetrics.quantum.precision },
    { label: 'Recall', classical: disease.modelMetrics.classical.recall, quantum: disease.modelMetrics.quantum.recall },
    { label: 'F1', classical: disease.modelMetrics.classical.f1, quantum: disease.modelMetrics.quantum.f1 },
    { label: 'AUC', classical: disease.modelMetrics.classical.roc_auc, quantum: disease.modelMetrics.quantum.roc_auc },
  ];

  const winner = (metric: string) => {
    const c = disease.modelMetrics.classical[metric as keyof typeof disease.modelMetrics.classical];
    const q = disease.modelMetrics.quantum[metric as keyof typeof disease.modelMetrics.quantum];
    if (q > c) return 'quantum';
    if (c > q) return 'classical';
    return 'tie';
  };

  return (
    <div className="bg-mesh min-h-screen">
      <div className="container-app px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 items-center justify-center mb-4 shadow-lg shadow-brand-500/30">
              <GitCompare className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 dark:text-white">
              Model Comparison
            </h1>
            <p className="mt-3 text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Classical ML vs Quantum ML — detailed comparison across all 6 disease models
            </p>
          </div>

          <Disclaimer variant="card" />

          {/* Disease selector */}
          <div className="flex gap-2 overflow-x-auto scrollbar-thin pb-2 mt-6 p-1 bg-slate-100 dark:bg-slate-800/50 rounded-xl">
            {result.diseases.map((d) => {
              const di = getDiseaseInfo(d.disease);
              return (
                <button
                  key={d.disease}
                  onClick={() => setSelectedDisease(d.disease)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                    selectedDisease === d.disease
                      ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-md'
                      : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: di.color }} />
                  {di.shortLabel}
                </button>
              );
            })}
          </div>

          {/* Model Cards */}
          <div className="grid md:grid-cols-2 gap-6 mt-6">
            <div className="glass-card p-6 border-brand-200 dark:border-brand-900/50">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
                  <Cpu className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-display font-semibold text-slate-900 dark:text-white">Classical ML</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Random Forest + XGBoost — {info.shortLabel}</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Trained on disease-specific features using ensemble methods. Classical models
                excel at tabular data and provide fast, interpretable predictions.
              </p>
            </div>

            <div className="glass-card p-6 border-accent-200 dark:border-accent-900/50">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-500 to-accent-700 flex items-center justify-center">
                  <Atom className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-display font-semibold text-slate-900 dark:text-white">Quantum ML</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">QSVM + VQC on Qiskit Aer — {info.shortLabel}</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Amplitude-encoded features into quantum states with variational circuits.
                Quantum kernels capture high-dimensional non-linear interactions.
              </p>
            </div>
          </div>

          {/* Radar Chart */}
          <div className="glass-card p-6 mt-6">
            <div className="flex items-center gap-2 mb-6">
              <BarChart3 className="w-5 h-5 text-brand-500" />
              <h2 className="text-lg font-display font-semibold text-slate-900 dark:text-white">
                Performance Radar — {info.label}
              </h2>
              <div className="ml-auto flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-brand-500" />
                  <span className="text-slate-600 dark:text-slate-400">Classical</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-accent-500" />
                  <span className="text-slate-600 dark:text-slate-400">Quantum</span>
                </div>
              </div>
            </div>
            <RadarChart data={radarData} size={320} />
          </div>

          {/* Detailed Metrics */}
          <div className="glass-card p-6 mt-6">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-5 h-5 text-brand-500" />
              <h2 className="text-lg font-display font-semibold text-slate-900 dark:text-white">
                Detailed Metrics — {info.shortLabel}
              </h2>
              <span className="badge bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 ml-auto text-xs">Demo</span>
            </div>
            <div className="space-y-5">
              {[
                { key: 'accuracy', label: 'Accuracy', description: 'Overall correctness of predictions' },
                { key: 'precision', label: 'Precision', description: 'True positives / (true + false positives)' },
                { key: 'recall', label: 'Recall', description: 'True positives / (true positives + false negatives)' },
                { key: 'f1', label: 'F1 Score', description: 'Harmonic mean of precision and recall' },
                { key: 'roc_auc', label: 'ROC-AUC', description: 'Area under the receiver operating characteristic curve' },
              ].map((metric) => {
                const c = disease.modelMetrics.classical[metric.key as keyof typeof disease.modelMetrics.classical];
                const q = disease.modelMetrics.quantum[metric.key as keyof typeof disease.modelMetrics.quantum];
                const w = winner(metric.key);
                return (
                  <div key={metric.key}>
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{metric.label}</span>
                        <span className="text-xs text-slate-500 ml-2">{metric.description}</span>
                      </div>
                      {w !== 'tie' && (
                        <span className={`badge ${w === 'quantum' ? 'badge-low' : 'badge-moderate'} text-xs`}>
                          <Award className="w-3 h-3" />
                          {w === 'quantum' ? 'Quantum wins' : 'Classical wins'}
                        </span>
                      )}
                    </div>
                    <ComparisonBar classical={c} quantum={q} label="" />
                  </div>
                );
              })}
            </div>
          </div>

          {/* All-disease summary */}
          <div className="glass-card p-6 mt-6">
            <div className="flex items-center gap-2 mb-6">
              <Layers className="w-5 h-5 text-accent-500" />
              <h2 className="text-lg font-display font-semibold text-slate-900 dark:text-white">
                All Diseases — ROC-AUC Summary
              </h2>
            </div>
            <div className="space-y-3">
              {result.diseases.map((d) => {
                const di = getDiseaseInfo(d.disease);
                return (
                  <div key={d.disease}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: di.color }} />
                        {di.label}
                      </span>
                    </div>
                    <ComparisonBar classical={d.modelMetrics.classical.roc_auc} quantum={d.modelMetrics.quantum.roc_auc} label="" />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Key Insight */}
          <div className="glass-card p-6 mt-6 bg-gradient-to-br from-brand-50/50 to-accent-50/50 dark:from-brand-950/20 dark:to-accent-950/20">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center flex-shrink-0">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-slate-900 dark:text-white mb-2">
                  Key Insight: Quantum Advantage in Multi-Disease Detection
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  The quantum model shows improved performance primarily in ROC-AUC and recall
                  across all 6 disease models, suggesting better sensitivity to complex, non-linear
                  feature interactions. This is consistent with quantum kernel methods' ability to
                  implicitly map features into exponentially larger Hilbert spaces.
                </p>
                <p className="text-xs text-amber-600 dark:text-amber-400 mt-3 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5" />
                  These metrics are illustrative demo values. In production, they come from
                  cross-validated evaluation on real datasets (UCI/PhysioNet/CDC).
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <button onClick={() => navigate('/results')} className="btn-secondary">Back to Results</button>
            <button onClick={() => navigate('/explain')} className="btn-primary">View Explainable AI</button>
          </div>
        </div>
      </div>
    </div>
  );
}
