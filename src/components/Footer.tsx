import { Activity, Github, Heart } from 'lucide-react';
import { navigate } from '@/lib/router';

export function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="container-app px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center">
                <Activity className="w-4 h-4 text-white" />
              </div>
              <span className="font-display font-bold text-lg text-slate-900 dark:text-white">Q-Dx</span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md">
              Hybrid Quantum Machine Learning for Early Disease Risk Detection. A research
              prototype combining classical ML and quantum ML for next-generation health
              risk assessment.
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-500 mt-3">
              SIH 2026 Project · Research Prototype — Not a Medical Diagnosis
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Navigate</h4>
            <ul className="space-y-2">
              {[
                { label: 'Home', path: '/' },
                { label: 'Health Assessment', path: '/assessment' },
                { label: 'History', path: '/history' },
                { label: 'About', path: '/about' },
              ].map((link) => (
                <li key={link.path}>
                  <button
                    onClick={() => navigate(link.path)}
                    className="text-sm text-slate-600 dark:text-slate-400 hover:text-brand-500 dark:hover:text-brand-400 transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Technology</h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li>React + TypeScript + Tailwind</li>
              <li>Supabase (Auth + Database)</li>
              <li>Scikit-learn (Classical ML)</li>
              <li>Qiskit (Quantum ML)</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500 dark:text-slate-500">
            © 2026 Q-Dx. Built for Smart India Hackathon.
          </p>
          <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-500">
            <span className="inline-flex items-center gap-1">
              Made with <Heart className="w-3 h-3 text-rose-500" /> for healthcare
            </span>
            <Github className="w-4 h-4" />
          </div>
        </div>
      </div>
    </footer>
  );
}
