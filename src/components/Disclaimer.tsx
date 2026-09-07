import { AlertTriangle } from 'lucide-react';

export function Disclaimer({ variant = 'banner' }: { variant?: 'banner' | 'card' }) {
  if (variant === 'card') {
    return (
      <div className="glass-card p-4 border-amber-200 dark:border-amber-900/50 bg-amber-50/50 dark:bg-amber-950/20">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-800 dark:text-amber-200">
              Research Prototype — Not a Medical Diagnosis
            </p>
            <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
              This tool is for educational and research demonstration purposes only. It is not a
              substitute for professional medical advice, diagnosis, or treatment. Always consult
              a qualified healthcare provider.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="disclaimer-banner">
      <span className="inline-flex items-center gap-1.5">
        <AlertTriangle className="w-3.5 h-3.5" />
        Research Prototype — Not a Medical Diagnosis
      </span>
    </div>
  );
}
