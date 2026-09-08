import {
  Activity, Atom, BookOpen, Code2, Database, GitBranch,
  Github, Heart, Layers, Mail, Target, Users,
} from 'lucide-react';
import { navigate } from '@/lib/router';
import { Disclaimer } from '@/components/Disclaimer';

const objectives = [
  'Develop a hybrid quantum-classical ML pipeline for early disease risk detection',
  'Leverage quantum kernel methods to capture complex, non-linear health feature interactions',
  'Provide explainable, transparent risk assessments — no black-box predictions',
  'Compare classical and quantum model performance across standard ML metrics',
  'Generate downloadable, professional health risk reports for clinical discussion',
  'Demonstrate quantum computing applications in healthcare for SIH 2026',
];

const team = [
  { role: 'ML & Quantum', focus: 'Scikit-learn + Qiskit pipeline' },
  { role: 'Frontend', focus: 'React + TypeScript + Tailwind' },
  { role: 'Backend', focus: 'FastAPI + Supabase' },
  { role: 'Data', focus: 'UCI / PhysioNet / CDC datasets' },
];

export function AboutPage() {
  return (
    <div className="bg-mesh min-h-screen">
      {/* Hero */}
      <section className="section-padding">
        <div className="container-app">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-50 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-900 mb-6">
              <BookOpen className="w-4 h-4 text-brand-500" />
              <span className="text-sm font-medium text-brand-700 dark:text-brand-300">About the Project</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-slate-900 dark:text-white leading-tight">
              About <span className="gradient-text">Q-Dx</span>
            </h1>
            <p className="mt-6 text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
              Q-Dx is a research prototype that explores the intersection of quantum computing and
              machine learning for early disease risk detection. Built for Smart India Hackathon 2026,
              it demonstrates how hybrid quantum-classical approaches can enhance health risk
              prediction beyond what classical ML alone can achieve.
            </p>
          </div>
        </div>
      </section>

      <Disclaimer />

      {/* Objectives */}
      <section className="section-padding bg-white dark:bg-slate-950 transition-colors duration-300">
        <div className="container-app">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-2 mb-8">
              <Target className="w-6 h-6 text-brand-500" />
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 dark:text-white">
                Project Objectives
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {objectives.map((obj, i) => (
                <div key={i} className="glass-card p-5 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-white">{i + 1}</span>
                  </div>
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{obj}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Architecture */}
      <section className="section-padding bg-slate-50 dark:bg-slate-900/30 transition-colors duration-300">
        <div className="container-app">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-2 mb-8">
              <Layers className="w-6 h-6 text-accent-500" />
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 dark:text-white">
                Architecture
              </h2>
            </div>

            <div className="space-y-4">
              {/* Frontend */}
              <div className="glass-card p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
                    <Code2 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-slate-900 dark:text-white">Frontend Layer</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">React + TypeScript + Tailwind CSS</p>
                  </div>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Responsive SPA with dark/light mode, animated quantum circuit visualizations,
                  interactive charts, and a clean, professional healthcare UI.
                </p>
              </div>

              {/* Backend */}
              <div className="glass-card p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-500 to-accent-700 flex items-center justify-center">
                    <Database className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-slate-900 dark:text-white">Backend & Database</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Supabase (Auth + PostgreSQL) + FastAPI</p>
                  </div>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Supabase handles authentication and assessment storage with row-level security.
                  A Python FastAPI server hosts the ML/QML inference pipeline (deployment-ready for Vercel).
                </p>
              </div>

              {/* ML Pipeline */}
              <div className="glass-card p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                    <GitBranch className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-slate-900 dark:text-white">ML/QML Pipeline</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Scikit-learn + Qiskit Machine Learning</p>
                  </div>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Classical models (Random Forest, XGBoost, Logistic Regression) run alongside quantum
                  models (QSVM, VQC) on the Qiskit Aer simulator. The hybrid fusion layer combines
                  both predictions for a final risk score.
                </p>
              </div>

              {/* Quantum */}
              <div className="glass-card p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                    <Atom className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-slate-900 dark:text-white">Quantum Backend</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Qiskit Aer Simulator (4 qubits, 1024 shots)</p>
                  </div>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Features are amplitude-encoded into quantum states. A variational quantum circuit
                  with parameterized gates (H, CNOT, RY, RZ) captures high-dimensional feature
                  interactions through quantum kernel methods.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section-padding bg-white dark:bg-slate-950 transition-colors duration-300">
        <div className="container-app">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-2 mb-8">
              <Users className="w-6 h-6 text-brand-500" />
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 dark:text-white">
                Team & Roles
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {team.map((member, i) => (
                <div key={i} className="glass-card p-5 text-center">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500/10 to-accent-500/10 border border-slate-200 dark:border-slate-700 flex items-center justify-center mx-auto mb-3">
                    <span className="text-lg font-display font-bold gradient-text">{i + 1}</span>
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white text-sm">{member.role}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{member.focus}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Disclaimer Section */}
      <section className="section-padding bg-slate-50 dark:bg-slate-900/30 transition-colors duration-300">
        <div className="container-app">
          <div className="max-w-3xl mx-auto">
            <div className="glass-card p-8 border-amber-200 dark:border-amber-900/50 bg-amber-50/50 dark:bg-amber-950/20">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center flex-shrink-0">
                  <Heart className="w-6 h-6 text-amber-500" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-slate-900 dark:text-white mb-2">
                    Research Prototype — Not a Medical Diagnosis
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    Q-Dx is an educational research project for SIH 2026. It is not a medical device,
                    diagnostic tool, or substitute for professional medical advice. The risk scores
                    and model metrics shown are illustrative demo values. Always consult a qualified
                    healthcare provider for medical concerns.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-white dark:bg-slate-950 transition-colors duration-300">
        <div className="container-app">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 dark:text-white mb-4">
              Ready to Explore?
            </h2>
            <button onClick={() => navigate('/assessment')} className="btn-primary">
              <Activity className="w-5 h-5" />
              Start Assessment
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
