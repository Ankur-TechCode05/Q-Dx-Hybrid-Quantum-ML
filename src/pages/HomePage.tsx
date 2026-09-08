import {
  Activity, ArrowRight, Atom, Brain, Cpu, Database,
  FileText, GitBranch, HeartPulse, Layers, LineChart,
  ShieldCheck, Sparkles, Zap,
} from 'lucide-react';
import { navigate } from '@/lib/router';
import { Disclaimer } from '@/components/Disclaimer';
import { QuantumCircuit } from '@/components/QuantumCircuit';

const workflowSteps = [
  {
    icon: HeartPulse,
    title: 'Health Data Input',
    description: 'Collect vital health metrics — age, BMI, blood pressure, glucose, cholesterol, lifestyle factors.',
    color: 'from-rose-400 to-rose-600',
  },
  {
    icon: Database,
    title: 'Preprocessing & Feature Selection',
    description: 'Normalize, encode, and select the most predictive features using statistical and ML-based methods.',
    color: 'from-amber-400 to-amber-600',
  },
  {
    icon: Cpu,
    title: 'Classical ML Analysis',
    description: 'Train and evaluate classical models (Random Forest, Logistic Regression, XGBoost) on the feature set.',
    color: 'from-brand-400 to-brand-600',
  },
  {
    icon: Atom,
    title: 'Quantum ML Analysis',
    description: 'Map features to quantum states via amplitude encoding, apply variational quantum circuits on Qiskit Aer.',
    color: 'from-accent-400 to-accent-600',
  },
  {
    icon: GitBranch,
    title: 'Hybrid Model Comparison',
    description: 'Compare classical vs quantum performance across accuracy, precision, recall, F1, and ROC-AUC.',
    color: 'from-emerald-400 to-teal-600',
  },
  {
    icon: FileText,
    title: 'Explainable Risk Report',
    description: 'Generate a transparent, interpretable risk assessment with contributing factors and recommendations.',
    color: 'from-cyan-400 to-blue-600',
  },
];

const benefits = [
  { icon: Zap, title: 'Early Detection', description: 'Identify disease risk before symptoms appear, enabling proactive intervention.' },
  { icon: Brain, title: 'Explainable AI', description: 'Every prediction comes with clear, interpretable contributing factors — no black box.' },
  { icon: Atom, title: 'Quantum Advantage', description: 'Quantum kernel methods capture complex non-linear patterns classical models miss.' },
  { icon: ShieldCheck, title: 'Privacy First', description: 'Your data is encrypted and stored securely. You control your health information.' },
];

const techStack = [
  { name: 'React + TypeScript', category: 'Frontend' },
  { name: 'Tailwind CSS', category: 'Styling' },
  { name: 'Supabase', category: 'Backend & Auth' },
  { name: 'FastAPI / Python', category: 'API Server' },
  { name: 'Scikit-learn', category: 'Classical ML' },
  { name: 'Qiskit Machine Learning', category: 'Quantum ML' },
  { name: 'Qiskit Aer Simulator', category: 'Quantum Backend' },
  { name: 'UCI / PhysioNet / CDC', category: 'Datasets' },
];

export function HomePage() {
  return (
    <div className="bg-mesh">
      {/* Hero Section */}
      <section className="relative overflow-hidden section-padding">
        <div className="container-app">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in-up">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-50 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-900 mb-6">
                <Sparkles className="w-4 h-4 text-brand-500" />
                <span className="text-sm font-medium text-brand-700 dark:text-brand-300">SIH 2026 Research Prototype</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-slate-900 dark:text-white leading-tight text-balance">
                Hybrid <span className="gradient-text">Quantum</span> Machine Learning for Early Disease Risk Detection
              </h1>

              <p className="mt-6 text-lg text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed">
                Q-Dx combines classical machine learning with quantum computing to analyze health
                data and detect disease risk early — with transparent, explainable results powered
                by quantum-enhanced feature maps.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <button onClick={() => navigate('/assessment')} className="btn-primary text-base">
                  <Activity className="w-5 h-5" />
                  Start Assessment
                </button>
                <button onClick={() => navigate('/about')} className="btn-secondary text-base">
                  Learn More
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-10 grid grid-cols-3 gap-6 max-w-md">
                <div>
                  <div className="text-2xl font-display font-bold text-slate-900 dark:text-white">2</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">ML Paradigms</div>
                </div>
                <div>
                  <div className="text-2xl font-display font-bold text-slate-900 dark:text-white">12+</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Health Features</div>
                </div>
                <div>
                  <div className="text-2xl font-display font-bold text-slate-900 dark:text-white">4</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Qubits</div>
                </div>
              </div>
            </div>

            <div className="relative animate-fade-in">
              <div className="absolute inset-0 bg-gradient-to-br from-brand-500/20 to-accent-500/20 blur-3xl rounded-full" />
              <div className="relative">
                <QuantumCircuit active />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Disclaimer />

      {/* Concept Section */}
      <section className="section-padding bg-white dark:bg-slate-950 transition-colors duration-300">
        <div className="container-app">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 dark:text-white">
              The <span className="gradient-text">Hybrid Approach</span>
            </h2>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
              Classical ML excels at pattern recognition. Quantum ML captures high-dimensional
              feature interactions through quantum kernel methods. Together, they create a
              more powerful, nuanced risk detection system.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="glass-card p-8 hover:shadow-xl transition-shadow duration-300 group">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                <Cpu className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-display font-semibold text-slate-900 dark:text-white mb-3">
                Classical ML Pipeline
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Uses established algorithms like Random Forest, Gradient Boosting, and Logistic
                Regression. Trained on health datasets to identify risk patterns through statistical
                feature importance and decision boundaries.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {['Random Forest', 'XGBoost', 'Logistic Regression'].map((t) => (
                  <span key={t} className="badge bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="glass-card p-8 hover:shadow-xl transition-shadow duration-300 group">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent-500 to-accent-700 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                <Atom className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-display font-semibold text-slate-900 dark:text-white mb-3">
                Quantum ML Pipeline
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Encodes health features into quantum states using amplitude encoding, then applies
                variational quantum circuits (VQC) and quantum kernels on the Qiskit Aer simulator
                to capture non-linear feature interactions.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {['QSVM', 'VQC', 'Quantum Kernel', 'Amplitude Encoding'].map((t) => (
                  <span key={t} className="badge bg-accent-50 dark:bg-accent-950/40 text-accent-700 dark:text-accent-300">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="section-padding bg-slate-50 dark:bg-slate-900/30 transition-colors duration-300">
        <div className="container-app">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 dark:text-white">
              How It <span className="gradient-text">Works</span>
            </h2>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
              From health data to explainable risk assessment in six steps.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {workflowSteps.map((step, i) => (
              <div key={i} className="glass-card p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <step.icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-3xl font-display font-bold text-slate-200 dark:text-slate-800">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
                <h3 className="text-lg font-display font-semibold text-slate-900 dark:text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <button onClick={() => navigate('/assessment')} className="btn-primary">
              <Activity className="w-5 h-5" />
              Start Your Assessment
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="section-padding bg-white dark:bg-slate-950 transition-colors duration-300">
        <div className="container-app">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 dark:text-white">
              Why <span className="gradient-text">Q-Dx</span>?
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, i) => (
              <div key={i} className="text-center group">
                <div className="inline-flex w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500/10 to-accent-500/10 border border-brand-200/30 dark:border-accent-800/30 items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <benefit.icon className="w-8 h-8 text-brand-500 dark:text-brand-400" />
                </div>
                <h3 className="text-lg font-display font-semibold text-slate-900 dark:text-white mb-2">
                  {benefit.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="section-padding bg-slate-50 dark:bg-slate-900/30 transition-colors duration-300">
        <div className="container-app">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-50 dark:bg-accent-950/40 border border-accent-200 dark:border-accent-900 mb-4">
              <Layers className="w-4 h-4 text-accent-500" />
              <span className="text-sm font-medium text-accent-700 dark:text-accent-300">Technology Stack</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 dark:text-white">
              Built with <span className="gradient-text">Modern Tech</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {techStack.map((tech, i) => (
              <div key={i} className="glass-card p-4 text-center hover:shadow-lg transition-shadow duration-300">
                <div className="text-sm font-semibold text-slate-900 dark:text-white">{tech.name}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{tech.category}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-white dark:bg-slate-950 transition-colors duration-300">
        <div className="container-app">
          <div className="relative glass-card p-8 sm:p-12 lg:p-16 text-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-500/10 via-accent-500/10 to-transparent" />
            <div className="relative">
              <Atom className="w-12 h-12 text-accent-500 mx-auto mb-6 animate-float" />
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 dark:text-white mb-4">
                Ready to Explore <span className="gradient-text">Quantum Health AI</span>?
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-8">
                Start your health risk assessment and see how hybrid quantum-classical machine learning
                can provide early, explainable insights into your health.
              </p>
              <button onClick={() => navigate('/assessment')} className="btn-primary text-base">
                <HeartPulse className="w-5 h-5" />
                Start Assessment
              </button>
              <p className="mt-6 text-xs text-slate-500 dark:text-slate-500">
                Research Prototype — Not a Medical Diagnosis
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
