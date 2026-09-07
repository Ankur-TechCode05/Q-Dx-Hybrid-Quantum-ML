import { useEffect, useState } from 'react';
import {
  Activity, Atom, Calendar, Cpu, Download, FileText,
  History as HistoryIcon, Loader2, Trash2,
} from 'lucide-react';
import type { AssessmentRecord } from '@/types';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { navigate } from '@/lib/router';
import { Disclaimer } from '@/components/Disclaimer';
import { generateReport } from '@/lib/report';
import type { HealthData, AnalysisResult } from '@/types';

export function HistoryPage() {
  const { user } = useAuth();
  const [records, setRecords] = useState<AssessmentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    loadRecords();
  }, [user]);

  const loadRecords = async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('assessments')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      setError(error.message);
    } else {
      setRecords(data as AssessmentRecord[]);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('assessments').delete().eq('id', id);
    if (error) {
      setError(error.message);
    } else {
      setRecords(records.filter((r) => r.id !== id));
    }
  };

  const handleViewReport = (record: AssessmentRecord) => {
    const healthData: HealthData = {
      age: record.age ?? 0,
      gender: (record.gender as HealthData['gender']) ?? 'other',
      bmi: record.bmi ?? 0,
      bloodPressureSystolic: record.blood_pressure_systolic ?? 0,
      bloodPressureDiastolic: record.blood_pressure_diastolic ?? 0,
      heartRate: record.heart_rate ?? 0,
      glucose: record.glucose ?? 0,
      cholesterol: record.cholesterol ?? 0,
      smoking: record.smoking ?? false,
      physicalActivity: (record.physical_activity as HealthData['physicalActivity']) ?? 'moderate',
      sleepHours: record.sleep_hours ?? 7,
      alcohol: (record.alcohol as HealthData['alcohol']) ?? 'none',
      familyHistory: record.family_history ?? false,
    };

    const analysisResult: AnalysisResult = {
      riskScore: record.risk_score ?? 0,
      riskLevel: (record.risk_level as AnalysisResult['riskLevel']) ?? 'low',
      classicalScore: record.classical_score ?? 0,
      quantumScore: record.quantum_score ?? 0,
      riskFactors: record.risk_factors ?? [],
      modelMetrics: record.model_metrics ?? { classical: { accuracy: 0, precision: 0, recall: 0, f1: 0, roc_auc: 0 }, quantum: { accuracy: 0, precision: 0, recall: 0, f1: 0, roc_auc: 0 } },
      featureImportance: [],
      recommendations: [],
    };

    generateReport(healthData, analysisResult, user?.email);
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="bg-mesh min-h-screen">
      <div className="container-app px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 items-center justify-center mb-4 shadow-lg shadow-brand-500/30">
              <HistoryIcon className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 dark:text-white">
              Assessment History
            </h1>
            <p className="mt-3 text-slate-600 dark:text-slate-400">
              Your previous health risk assessments
            </p>
          </div>

          <Disclaimer variant="card" />

          {error && (
            <div className="glass-card p-4 mt-6 border-rose-200 dark:border-rose-900/50 bg-rose-50/50 dark:bg-rose-950/20">
              <p className="text-sm text-rose-700 dark:text-rose-300">{error}</p>
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
            </div>
          ) : records.length === 0 ? (
            <div className="glass-card p-12 mt-6 text-center">
              <FileText className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-display font-semibold text-slate-900 dark:text-white mb-2">
                No Assessments Yet
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                Start your first health risk assessment to see it here.
              </p>
              <button onClick={() => navigate('/assessment')} className="btn-primary">
                <Activity className="w-5 h-5" />
                Start Assessment
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mt-6 mb-4">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {records.length} assessment{records.length !== 1 ? 's' : ''} found
                </p>
                <button onClick={() => navigate('/assessment')} className="btn-ghost text-sm">
                  <Activity className="w-4 h-4" />
                  New Assessment
                </button>
              </div>

              <div className="space-y-4">
                {records.map((record) => {
                  const date = new Date(record.created_at).toLocaleDateString('en-US', {
                    year: 'numeric', month: 'short', day: 'numeric',
                    hour: '2-digit', minute: '2-digit',
                  });
                  const level = (record.risk_level ?? 'low') as 'low' | 'moderate' | 'high';
                  return (
                    <div key={record.id} className="glass-card p-5 hover:shadow-lg transition-shadow duration-200">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        {/* Risk Score Circle */}
                        <div className="flex-shrink-0 flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500/10 to-accent-500/10 border border-slate-200 dark:border-slate-700">
                          <div className="text-center">
                            <div className={`text-xl font-display font-bold ${
                              level === 'high' ? 'text-rose-500' :
                              level === 'moderate' ? 'text-amber-500' : 'text-emerald-500'
                            }`}>
                              {record.risk_score}
                            </div>
                            <div className="text-[9px] text-slate-500 dark:text-slate-400">/100</div>
                          </div>
                        </div>

                        {/* Info */}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`badge ${
                              level === 'high' ? 'badge-high' :
                              level === 'moderate' ? 'badge-moderate' : 'badge-low'
                            } capitalize`}>
                              {level} Risk
                            </span>
                            <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {date}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2 text-xs">
                            <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                              <span>Age: <span className="font-mono font-medium">{record.age}</span></span>
                            </div>
                            <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                              <span>BMI: <span className="font-mono font-medium">{record.bmi?.toFixed(1)}</span></span>
                            </div>
                            <div className="flex items-center gap-1 text-brand-600 dark:text-brand-400">
                              <Cpu className="w-3 h-3" />
                              <span className="font-mono">{record.classical_score}</span>
                            </div>
                            <div className="flex items-center gap-1 text-accent-600 dark:text-accent-400">
                              <Atom className="w-3 h-3" />
                              <span className="font-mono">{record.quantum_score}</span>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleViewReport(record)}
                            className="btn-ghost text-sm"
                            title="Download report"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(record.id)}
                            className="btn-ghost text-sm text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                            title="Delete record"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
