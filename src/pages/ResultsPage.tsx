import { useEffect, useState } from 'react';
import {
  AlertCircle, ArrowRight, Atom, Brain, CheckCircle2,
  Cpu, Download, FileText, GitCompare, Info, Lightbulb,
  Sparkles, TrendingUp, Layers,
} from 'lucide-react';
import type { HealthData, AnalysisResult, DiseaseResult, DiseaseType, RiskLevel } from '@/types';
import { navigate } from '@/lib/router';
import { generateReport } from '@/lib/report';
import { Disclaimer } from '@/components/Disclaimer';
import { RiskGauge } from '@/components/RiskGauge';
import { BarChart, ComparisonBar, DonutChart } from '@/components/Charts';
import { useAuth } from '@/context/AuthContext';
import { DISEASES, getDiseaseInfo } from '@/lib/analysis';

const levelInfo: Record<RiskLevel, { title: string; description: string; color: string }> = {
  low: { title: 'Low Risk Profile', description: 'Your health metrics indicate a relatively low risk. Maintain your healthy habits.', color: 'text-emerald-500' },
  moderate: { title: 'Moderate Risk Profile', description: 'Some metrics suggest moderate risk. Consider lifestyle adjustments and discuss with your provider.', color: 'text-amber-500' },
  high: { title: 'High Risk Profile', description: 'Several metrics indicate elevated risk. We strongly recommend consulting a healthcare professional.', color: 'text-rose-500' },
};

function DiseaseTab({ disease, active, onClick }: { disease: DiseaseResult; active: boolean; onClick: () => void }) {
  const info = getDiseaseInfo(disease.disease);
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap ${
        active
          ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-md'
          : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50'
      }`}
    >
      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: info.color }} />
      <span>{info.shortLabel}</span>
      <span className={`text-xs font-mono ${
        disease.riskLevel === 'high' ? 'text-rose-500' :
        disease.riskLevel === 'moderate' ? 'text-amber-500' : 'text-emerald-500'
      }`}>
        {disease.riskScore}
      </span>
    </button>
  );
}

function DiseaseDashboard({ disease }: { disease: DiseaseResult }) {
  const info = getDiseaseInfo(disease.disease);
  const dl = levelInfo[disease.riskLevel];

  return (
    <div className="animate-fade-in space-y-6">
      {/* Disease header */}
      <div className="glass-card p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${info.color}20` }}>
            <div className="w-6 h-6 rounded-full" style={{ backgroundColor: info.color }} />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-display font-bold text-slate-900 dark:text-white">{info.label}</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{info.description}</p>
          </div>
          <span className={`badge ${disease.riskLevel === 'high' ? 'badge-high' : disease.riskLevel === 'moderate' ? 'badge-moderate' : 'badge-low'} capitalize`}>
            {disease.riskLevel} Risk
          </span>
        </div>
      </div>

      {/* Risk Score + Pie Chart */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="glass-card p-6 flex flex-col items-center justify-center">
          <RiskGauge score={disease.riskScore} level={disease.riskLevel} size={200} />
          <p className={`text-sm font-medium mt-3 text-center ${dl.color}`}>{dl.title}</p>
          <div className="grid grid-cols-2 gap-3 mt-4 w-full">
            <div className="p-3 rounded-xl bg-brand-50 dark:bg-brand-950/30 text-center">
              <div className="text-xs text-slate-500">Classical ML</div>
              <div className="text-xl font-display font-bold text-brand-600 dark:text-brand-400">{disease.classicalScore}</div>
            </div>
            <div className="p-3 rounded-xl bg-accent-50 dark:bg-accent-950/30 text-center">
              <div className="text-xs text-slate-500">Quantum ML</div>
              <div className="text-xl font-display font-bold text-accent-600 dark:text-accent-400">{disease.quantumScore}</div>
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="text-sm font-display font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Layers className="w-4 h-4 text-brand-500" />
            Risk Distribution
          </h3>
          <DonutChart segments={disease.pieData} size={180} />
        </div>
      </div>

      {/* Risk Factors */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-2 mb-5">
          <AlertCircle className="w-5 h-5 text-amber-500" />
          <h3 className="text-lg font-display font-semibold text-slate-900 dark:text-white">Key Risk Factors — {info.shortLabel}</h3>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {disease.riskFactors.map((factor, i) => (
            <div key={i} className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${factor.severity === 'high' ? 'bg-rose-500' : factor.severity === 'moderate' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                  <h4 className="font-semibold text-slate-900 dark:text-white text-sm">{factor.name}</h4>
                </div>
                <span className={`badge ${factor.severity === 'high' ? 'badge-high' : factor.severity === 'moderate' ? 'badge-moderate' : 'badge-low'} capitalize text-xs`}>{factor.severity}</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">{factor.description}</p>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Current: <span className="font-mono font-medium text-slate-700 dark:text-slate-300">{factor.value}</span></span>
                <span className="text-slate-500">Contribution: <span className="font-mono font-medium text-slate-700 dark:text-slate-300">{factor.contribution}%</span></span>
              </div>
              <div className="mt-2 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${factor.severity === 'high' ? 'bg-rose-500' : factor.severity === 'moderate' ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${factor.contribution}%`, transition: 'width 1s ease-out' }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Feature Importance + Recommendations */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <div className="flex items-center gap-2 mb-5">
            <Brain className="w-5 h-5 text-accent-500" />
            <h3 className="text-lg font-display font-semibold text-slate-900 dark:text-white">Feature Importance</h3>
          </div>
          <div className="space-y-3">
            {disease.featureImportance.slice(0, 8).map((f, i) => (
              <div key={i}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-slate-700 dark:text-slate-300">{f.feature}</span>
                  <span className="font-mono text-slate-500">{f.importance}%</span>
                </div>
                <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${f.importance * 3}%`, background: `linear-gradient(to right, ${info.color}, ${info.color}80)`, transition: 'width 1s ease-out' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center gap-2 mb-5">
            <Lightbulb className="w-5 h-5 text-amber-500" />
            <h3 className="text-lg font-display font-semibold text-slate-900 dark:text-white">Recommendations</h3>
          </div>
          <ul className="space-y-3">
            {disease.recommendations.map((rec, i) => (
              <li key={i} className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Model Metrics */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-2 mb-5">
          <GitCompare className="w-5 h-5 text-brand-500" />
          <h3 className="text-lg font-display font-semibold text-slate-900 dark:text-white">Model Performance — {info.shortLabel}</h3>
          <span className="badge bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 ml-auto text-xs">Demo</span>
        </div>
        <div className="space-y-4">
          <ComparisonBar label="Accuracy" classical={disease.modelMetrics.classical.accuracy} quantum={disease.modelMetrics.quantum.accuracy} />
          <ComparisonBar label="Precision" classical={disease.modelMetrics.classical.precision} quantum={disease.modelMetrics.quantum.precision} />
          <ComparisonBar label="Recall" classical={disease.modelMetrics.classical.recall} quantum={disease.modelMetrics.quantum.recall} />
          <ComparisonBar label="F1 Score" classical={disease.modelMetrics.classical.f1} quantum={disease.modelMetrics.quantum.f1} />
          <ComparisonBar label="ROC-AUC" classical={disease.modelMetrics.classical.roc_auc} quantum={disease.modelMetrics.quantum.roc_auc} />
        </div>
      </div>
    </div>
  );
}

export function ResultsPage() {
  const { user } = useAuth();
  const [data, setData] = useState<HealthData | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [activeDisease, setActiveDisease] = useState<DiseaseType>('diabetes');

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

  const info = levelInfo[result.overallRiskLevel];
  const overallData = [
    { label: 'Classical', value: Math.round(result.diseases.reduce((s, d) => s + d.classicalScore, 0) / result.diseases.length) },
    { label: 'Quantum', value: Math.round(result.diseases.reduce((s, d) => s + d.quantumScore, 0) / result.diseases.length) },
    { label: 'Combined', value: result.overallRiskScore },
  ];

  const activeDiseaseResult = result.diseases.find((d) => d.disease === activeDisease)!;

  // Overall pie: distribution of risk across diseases
  const overallPie = [
    { label: 'High Risk Diseases', value: result.diseases.filter((d) => d.riskLevel === 'high').length, color: '#f43f5e' },
    { label: 'Moderate Risk', value: result.diseases.filter((d) => d.riskLevel === 'moderate').length, color: '#f59e0b' },
    { label: 'Low Risk', value: result.diseases.filter((d) => d.riskLevel === 'low').length, color: '#10b981' },
  ].filter((s) => s.value > 0);

  return (
    <div className="bg-mesh min-h-screen">
      <div className="container-app px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-50 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-900 mb-4">
              <Sparkles className="w-4 h-4 text-brand-500" />
              <span className="text-sm font-medium text-brand-700 dark:text-brand-300">Multi-Disease Analysis Complete</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 dark:text-white">
              Your Health Risk Dashboard
            </h1>
            <p className="mt-3 text-slate-600 dark:text-slate-400">
              6 diseases analyzed · Hybrid Quantum-Classical ML Pipeline
            </p>
          </div>

          <Disclaimer variant="card" />

          {/* Overall Summary */}
          <div className="grid lg:grid-cols-3 gap-6 mt-8">
            <div className="glass-card p-8 flex flex-col items-center justify-center">
              <RiskGauge score={result.overallRiskScore} level={result.overallRiskLevel} size={220} />
              <div className="mt-4 text-center">
                <h2 className={`text-lg font-display font-semibold ${info.color}`}>{info.title}</h2>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">{info.description}</p>
              </div>
            </div>

            <div className="glass-card p-6 lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-brand-500" />
                  <h2 className="text-lg font-display font-semibold text-slate-900 dark:text-white">Overall Model Scores</h2>
                </div>
                <button onClick={() => navigate('/comparison')} className="btn-ghost text-sm">
                  <GitCompare className="w-4 h-4" /> Full Comparison
                </button>
              </div>
              <BarChart data={overallData} height={160} color="from-brand-500 to-accent-500" />

              {/* Disease overview cards */}
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
                {result.diseases.map((d) => {
                  const di = getDiseaseInfo(d.disease);
                  return (
                    <div key={d.disease} className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: di.color }} />
                        <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{di.shortLabel}</span>
                      </div>
                      <div className={`text-lg font-display font-bold ${d.riskLevel === 'high' ? 'text-rose-500' : d.riskLevel === 'moderate' ? 'text-amber-500' : 'text-emerald-500'}`}>
                        {d.riskScore}<span className="text-xs text-slate-400">/100</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Overall Disease Distribution Pie */}
          <div className="glass-card p-6 mt-6">
            <div className="flex items-center gap-2 mb-6">
              <Layers className="w-5 h-5 text-brand-500" />
              <h2 className="text-lg font-display font-semibold text-slate-900 dark:text-white">Disease Risk Distribution</h2>
              <span className="text-xs text-slate-500 ml-auto">How many diseases fall into each risk level</span>
            </div>
            <DonutChart segments={overallPie} size={180} />
          </div>

          {/* Disease Tabs */}
          <div className="mt-8">
            <h2 className="text-xl font-display font-bold text-slate-900 dark:text-white mb-4">
              Per-Disease Dashboard
            </h2>
            <div className="flex gap-2 overflow-x-auto scrollbar-thin pb-2 mb-6 p-1 bg-slate-100 dark:bg-slate-800/50 rounded-xl">
              {result.diseases.map((d) => (
                <DiseaseTab
                  key={d.disease}
                  disease={d}
                  active={activeDisease === d.disease}
                  onClick={() => setActiveDisease(d.disease)}
                />
              ))}
            </div>

            <DiseaseDashboard disease={activeDiseaseResult} />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <button onClick={() => generateReport(data, result, user?.email)} className="btn-primary">
              <Download className="w-5 h-5" />
              Download Full Report
            </button>
            <button onClick={() => navigate('/explain')} className="btn-secondary">
              <Info className="w-5 h-5" />
              View Explainable AI
            </button>
            <button onClick={() => navigate('/assessment')} className="btn-secondary">
              <ArrowRight className="w-5 h-5" />
              New Assessment
            </button>
          </div>

          <div className="mt-8 text-center">
            <p className="text-xs text-slate-500 inline-flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" />
              Research Prototype — Not a Medical Diagnosis
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
